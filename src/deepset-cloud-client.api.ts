import { ISearchHistoryResponse } from "deepset-response.d.js";
import { IFileUploadRequest, ISearchRequest, ISearchResult } from "deepset-typings.d.js";

/***
 * API documentation of Deepset Cloud:
 * https://docs.cloud.deepset.ai/reference/delete_file_api_v1_workspaces__workspace_name__files__file_id__delete
 */
export interface IDeepsetCloudClient {
  /**
   * Method to upload a file to the Deepset Cloud.
   * fileBuffer or fileContent is required
   * @param parameter
   */
  storeFile(parameter: IFileUploadRequest) ;

  /**
   * Does upload multiple files to the Deepset Cloud
   * concurrently with  a maximum of 10 parallel uploads.
   * @param parameters
   * @param maxParallelRequests Maximum number of parallel requests. Default is 10.
   */
  storeFiles(parameters: IFileUploadRequest[], maxParallelRequests?: number)

  /**
   * Runs a search query against the Deepset Cloud.
   * @param parameter
   */
  search(parameter: ISearchRequest): Promise<ISearchResult>

  /**
   * Returns the filecontent of a file in the Deepset Cloud.
   * @param fileId
   */
  getFileContent(fileId: string)

  /**
   * Fetches the search history of a pipeline.
   * Warning this is an experimental API and might change in the future.
   *
   * @experimental
   * @param pipeline
   * @param limit
   * @param pageNumber
   */
  getSearchHistory(pipeline:string, limit?:number, pageNumber?:number): Promise<ISearchHistoryResponse>

}
