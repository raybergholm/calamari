import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  Method,
} from "axios";

export type HttpClientBody = Record<string, any> | string;

type HttpClientDefaultErrorHandler = (error: AxiosError<unknown, any>) => AxiosError<unknown, any>;
export type HttpClientErrorHandler = HttpClientDefaultErrorHandler | any;
export interface HttpClientRequestConfig extends AxiosRequestConfig {
  onError?: HttpClientErrorHandler;
}

export interface HttpClientInterface {
  options<T>(path: string, config?: HttpClientRequestConfig): Promise<T>;
  head<T>(path: string, config?: HttpClientRequestConfig): Promise<T>;
  get<T>(path: string, config?: HttpClientRequestConfig): Promise<T>;
  post<T>(path: string, body: HttpClientBody, config?: HttpClientRequestConfig): Promise<T>;
  put<T>(path: string, body: HttpClientBody, config?: HttpClientRequestConfig): Promise<T>;
  patch<T>(path: string, body: HttpClientBody, config?: HttpClientRequestConfig): Promise<T>;
  delete<T>(path: string, config?: HttpClientRequestConfig): Promise<T>;
}

export class HttpClient implements HttpClientInterface {
  protected readonly client: AxiosInstance;
  protected readonly onError: HttpClientErrorHandler;

  constructor(
    host: string,
    headers: Record<string, string>,
    defaultTimeoutInMs: number,
    onError?: HttpClientErrorHandler,
  ) {
    this.client = axios.create({
      baseURL: host,
      timeout: defaultTimeoutInMs,
      headers,
    });

    this.onError = onError || this.defaultErrorHandler;
  }

  protected async _request<T>(
    method: Method,
    path: string,
    body?: HttpClientBody,
    config: HttpClientRequestConfig = {},
  ): Promise<T> {
    const response = await this.client.request(
      {
        method,
        url: path,
        data: body,
        ...config,
      }
    ).catch(config?.onError ?? this.onError);
    return response.data;
  }

  protected defaultErrorHandler ( error: AxiosError ): AxiosError {
    throw error;
  }

  public async options<T>(
    path: string,
    config?: HttpClientRequestConfig
  ): Promise<T> {
    return this._request("OPTIONS", path, undefined, config);
  }

  public async head<T>(
    path: string,
    config?: HttpClientRequestConfig
  ): Promise<T> {
    return this._request("HEAD", path, undefined, config);
  }

  public async get<T>(
    path: string,
    config?: HttpClientRequestConfig
  ): Promise<T> {
    return this._request("GET", path, undefined, config);
  }

  public async post<T>(
    path: string,
    body: HttpClientBody,
    config?: HttpClientRequestConfig
  ): Promise<T> {
    return this._request("POST", path, body, config);
  }

  public async put<T>(
    path: string,
    body: HttpClientBody,
    config?: HttpClientRequestConfig
  ): Promise<T> {
    return this._request("PUT", path, body, config);
  }

  public async patch<T>(
    path: string,
    body: HttpClientBody,
    config?: HttpClientRequestConfig
  ): Promise<T> {
    return this._request("PATCH", path, body, config);
  }

  public async delete<T>(
    path: string,
    config?: HttpClientRequestConfig
  ): Promise<T> {
    return this._request("DELETE", path, undefined, config);
  }
}
