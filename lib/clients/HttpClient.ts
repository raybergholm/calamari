/* eslint-disable @typescript-eslint/no-explicit-any */

export type HttpClientBody = BodyInit | null | undefined;

export type HttpClientErrorHandler = (error: any) => void;
export interface HttpClientRequestConfig extends Omit<
  RequestInit,
  "method" | "body"
> {
  onError?: HttpClientErrorHandler;
  responseMode?: ResponseMode;
}

export interface HttpClientInterface {
  options<T>(path: string, config?: HttpClientRequestConfig): Promise<T>;
  head<T>(path: string, config?: HttpClientRequestConfig): Promise<T>;
  get<T>(path: string, config?: HttpClientRequestConfig): Promise<T>;
  post<T>(
    path: string,
    body: HttpClientBody,
    config?: HttpClientRequestConfig,
  ): Promise<T>;
  put<T>(
    path: string,
    body: HttpClientBody,
    config?: HttpClientRequestConfig,
  ): Promise<T>;
  patch<T>(
    path: string,
    body: HttpClientBody,
    config?: HttpClientRequestConfig,
  ): Promise<T>;
  delete<T>(path: string, config?: HttpClientRequestConfig): Promise<T>;
}

export type HttpClientConfig = {
  headers?: Record<string, string>;
  defaultTimeoutInMs?: number;
  onError?: HttpClientErrorHandler;
  responseMode?: ResponseMode;
};

export type ResponseMode =
  | "raw"
  | "json"
  | "text"
  | "blob"
  | "arrayBuffer"
  | "formData";

export class HttpClient implements HttpClientInterface {
  protected readonly host: string;
  protected readonly headers: Record<string, string>;
  protected readonly onError: HttpClientErrorHandler | undefined;
  protected readonly responseMode: ResponseMode;

  constructor(host: string, config?: HttpClientConfig) {
    this.host = host;
    this.headers = config?.headers || {};
    this.responseMode = config?.responseMode || "json";
    this.onError = config?.onError;
  }

  protected async _request<T>(
    method: "OPTIONS" | "HEAD" | "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    path: string,
    body: HttpClientBody,
    config: HttpClientRequestConfig = {},
  ): Promise<T> {
    try {
      const consolidatedConfig: RequestInit = {
        ...config,
        method,
        headers: { ...this.headers, ...config.headers },
        body,
      };

      const url = path ? `${this.host}/${path}` : this.host;
      const response = await fetch(url, consolidatedConfig);

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const responseMode = config.responseMode || this.responseMode;
      switch (responseMode) {
        case "raw":
          return response as any as T;
        case "json":
          return (await response.json()) as T;
        case "text":
          return (await response.text()) as any as T;
        case "blob":
          return (await response.blob()) as any as T;
        case "arrayBuffer":
          return (await response.arrayBuffer()) as any as T;
        case "formData":
          return (await response.formData()) as any as T;
      }
    } catch (error: any) {
      if (this.onError) {
        this.onError(error);
      }
      throw error;
    }
  }

  public async options<T>(
    path: string,
    config?: HttpClientRequestConfig,
  ): Promise<T> {
    return this._request("OPTIONS", path, undefined, config);
  }

  public async head<T>(
    path: string,
    config?: HttpClientRequestConfig,
  ): Promise<T> {
    return this._request("HEAD", path, undefined, config);
  }

  public async get<T>(
    path: string,
    config?: HttpClientRequestConfig,
  ): Promise<T> {
    return this._request("GET", path, undefined, config);
  }

  public async post<T>(
    path: string,
    body: HttpClientBody,
    config?: HttpClientRequestConfig,
  ): Promise<T> {
    return this._request("POST", path, body, config);
  }

  public async put<T>(
    path: string,
    body: HttpClientBody,
    config?: HttpClientRequestConfig,
  ): Promise<T> {
    return this._request("PUT", path, body, config);
  }

  public async patch<T>(
    path: string,
    body: HttpClientBody,
    config?: HttpClientRequestConfig,
  ): Promise<T> {
    return this._request("PATCH", path, body, config);
  }

  public async delete<T>(
    path: string,
    config?: HttpClientRequestConfig,
  ): Promise<T> {
    return this._request("DELETE", path, undefined, config);
  }
}
