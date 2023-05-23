import { ISearchHistoryResponse, ISearchResult } from 'deepsetResponse.js';
import { IFileUploadRequest, ISearchRequest } from 'deepsetTypings.js';
import { IDeepsetCloudClient } from './deepsetCloudClientApi.js';
export interface IConfig {
    workspace?: string;
    apiKey?: string;
}
export declare class DeepsetCloudClient implements IDeepsetCloudClient {
    private config;
    private httpClient;
    constructor(config: IConfig);
    storeFile(parameter: IFileUploadRequest): Promise<any>;
    storeFiles(parameters: IFileUploadRequest[], maxParallelRequests?: number): Promise<any[]>;
    getFile(fileId: string): Promise<void>;
    getFileContent(fileId: string): Promise<any>;
    removeFile(fileId: string): Promise<any>;
    getSearchHistory(pipeline: string, limit?: number, pageNumber?: number): Promise<ISearchHistoryResponse>;
    private snakeCaseKeys;
    private getFiles;
    search(parameter: ISearchRequest): Promise<ISearchResult>;
    private uploadFileToDeepsetCloud;
    private getWorkspaceUrl;
}
