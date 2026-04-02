import {
  Pool,
  type QueryConfig,
  type QueryResult,
  type QueryResultRow,
} from "pg";

// Tracks whether the current Lambda invocation has already performed a write.
// Safe to use as module-level state because Lambda handles one invocation at a
// time per container. Reset to false at the start of each invocation via databaseMiddleware.
let writeExecuted = false;

// Use as middy.use(databaseMiddleware()) to reset write state between invocations.
export function databaseMiddleware() {
  return {
    before: async () => {
      writeExecuted = false;
    },
  };
}

export interface PsqlDatabaseClientInterface {
  query<T>(queryConfig: QueryConfig): Promise<QueryResult<T[]>>;
  writeQuery<T>(queryConfig: QueryConfig): Promise<QueryResult<T[]>>;
}

export interface LoggerInterface {
  error(message: string, meta?: any): void;
  info(message: string, meta?: any): void;
  log(message: string, meta?: any): void;
  warn(message: string, meta?: any): void;
}

export type PsqlDatabaseClientConfig = {
  readerEndpoint: string;
  writerEndpoint: string;
  port: number;
  database: string;
  user: string;
  password: string;
  logger?: LoggerInterface;
};

export const DefaultConfig = {
  statement_timeout: 10000,
  query_timeout: 10000,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  // Small pool size is intentional: many Lambda containers run in parallel, each
  // with their own pool. A large per-container pool would exhaust Aurora's
  // connection limit. Keeping it small ensures warm containers reuse connections
  // without overwhelming the DB.
  max: 1,
  slowQueryLimitMs: 1000,
};

export class PsqlDatabaseClient implements PsqlDatabaseClientInterface {
  private readonly readPool: Pool;
  private readonly writePool: Pool;
  private readonly logger: LoggerInterface | undefined;
  private readonly slowQueryLimitMs: number;

  constructor(config: PsqlDatabaseClientConfig) {
    const baseConfig = {
      ...DefaultConfig,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
    };

    this.logger = config.logger;
    
    this.slowQueryLimitMs = DefaultConfig.slowQueryLimitMs;

    this.readPool = new Pool({ ...baseConfig, host: config.readerEndpoint });
    this.writePool = new Pool({ ...baseConfig, host: config.writerEndpoint });
  }

  public async query<T extends QueryResultRow>(
    queryConfig: QueryConfig,
    verbose: boolean = true,
  ): Promise<QueryResult<T>> {
    const startTime = performance.now();
    // If this request has already made a successful write query,
    // route reads to the write pool to avoid replication lag issues.
    const pool = writeExecuted ? this.writePool : this.readPool;
    const response = await pool.query<T>(queryConfig);

    const executionTimeMs = performance.now() - startTime;
    if (this.logger && executionTimeMs > this.slowQueryLimitMs && verbose) {
      this.logger.info("Slow DB query", {
        name: queryConfig.name,
        executionTimeMs,
      });
    }
    return response;
  }

  public async writeQuery<T extends QueryResultRow>(
    queryConfig: QueryConfig,
    verbose: boolean = true,
  ): Promise<QueryResult<T>> {
    const startTime = performance.now();
    const response = await this.writePool.query<T>(queryConfig);
    writeExecuted = true;
    if (this.logger && verbose) {
      const executionTimeMs = performance.now() - startTime;
      this.logger.info("DB write query", {
        name: queryConfig.name,
        executionTimeMs,
      });
    }
    return response;
  }
}
