import { AxiosInstance } from 'axios';
export interface IHttpClientConfig {
    baseURL?: string;
    bearerToken?: string;
}
export declare class HttpClientFactory {
    static createHttpClient(config?: IHttpClientConfig): AxiosInstance;
}
