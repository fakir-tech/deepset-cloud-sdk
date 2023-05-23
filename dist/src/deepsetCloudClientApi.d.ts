import { ISearchHistoryResponse } from "deepsetResponse.js";
import { IFileUploadRequest, ISearchRequest, ISearchResult } from "deepsetTypings.js";
export interface IDeepsetCloudClient {
    storeFile(parameter: IFileUploadRequest): any;
    storeFiles(parameters: IFileUploadRequest[], maxParallelRequests?: number): any;
    search(parameter: ISearchRequest): Promise<ISearchResult>;
    getFileContent(fileId: string): any;
    getSearchHistory(pipeline: string, limit?: number, pageNumber?: number): Promise<ISearchHistoryResponse>;
}
