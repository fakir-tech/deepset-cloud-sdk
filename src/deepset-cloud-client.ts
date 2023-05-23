import axios from 'axios';
import { AxiosRequestConfig, AxiosResponse, AxiosError, AxiosInstance } from 'axios';

import * as _ from 'lodash';
import FormData from 'form-data';
// var FormData = require("form-data");
import pLimit from 'p-limit';
import { ISearchHistoryResponse, ISearchResult } from 'deepset-response.d.js';
import { IFileUploadRequest, IFilesRequest, IFileEntry, ISearchRequest } from 'deepset-typings.d.js';
import { HttpClientFactory } from './http-client-cervice.js';
import { IDeepsetCloudClient } from './deepset-cloud-client.api.js';


// const url = `https://api.cloud.deepset.ai/api/v1/workspaces/${workspace}/files`;
const DEEPSET_CLOUD_API_BASE_URI = 'https://api.cloud.deepset.ai/api/v1';


export interface IConfig {
  workspace?: string;
  apiKey?: string;
}

export class DeepsetCloudClient implements IDeepsetCloudClient {
  private config: IConfig;
  private httpClient: AxiosInstance;

  constructor(config: IConfig) {
    // default values
    this.config = config || {};
    this.config.workspace = this.config.workspace || 'default';
    this.httpClient = HttpClientFactory.createHttpClient({
        baseURL: this.getWorkspaceUrl(),
        bearerToken: this.config.apiKey
    });
  }


  public async storeFile(parameter: IFileUploadRequest) {
    let fileBuffer = parameter.fileBuffer;

    if (parameter.fileContent) {
      fileBuffer = Buffer.from(parameter.fileContent, 'utf-8');
    }
    if (parameter.fileBuffer) {
      fileBuffer = parameter.fileBuffer;
    }
    if (!fileBuffer) {
      throw new Error('No file content provided');
    }
    if (parameter.skipDuplicates && !parameter.uniqueId) {
      throw new Error('If you want to skil duplicates, you have to provide a uniqueId, which allows to identify the file.');
    }

    const result = await this.uploadFileToDeepsetCloud(parameter, fileBuffer);
    return result.data;
  }

  public async storeFiles(parameters: IFileUploadRequest[], maxParallelRequests?: number) {
    const maxConccurrency = maxParallelRequests || 10;

    const limit = pLimit(maxConccurrency);
    const promises = parameters.map(parameter => limit(() => this.storeFile(parameter)));

    return await Promise.all(promises);
  }

  public async getFile(fileId: string) {
    const url = `${this.getWorkspaceUrl()}/files/${fileId}`;

    // strange behaviour:
    //  to receive the json object of a file by Id, we need to use 2 queries.
    //  it should be rather /files/{id} (which is instead providing the file content);

    // const result = await this.getFiles({ after: fileId, limit: 1 });
    // console.log('result', result);
    throw new Error("Not implemented yet.");

  }
  public async getFileContent(fileId: string) {
    const url = `${this.getWorkspaceUrl()}/files/${fileId}`;
    const result = await this.httpClient.get(url);
    return result.data;
  }
  public async removeFile(fileId: string) {
    const url = `${this.getWorkspaceUrl()}/files/${fileId}`;
    const result = await this.httpClient.delete(url);
    return result.data;
  }

  public async getSearchHistory(pipeline:string, limit?:number, pageNumber?:number): Promise<ISearchHistoryResponse> {
    // https://api.cloud.deepset.ai/api/v1/workspaces/{workspace_name}/pipelines/{pipeline_name}/search_history
    const url = `${this.getWorkspaceUrl()}/pipelines/${pipeline}/search_history`;
    const result = await this.httpClient.get(url, {
      params: { limit, page: pageNumber }
    });
    return result.data;
  }

  private snakeCaseKeys(obj: any) {
    return _.mapKeys(obj, (value: any, key: string) => _.snakeCase(key));
  }

  private async getFiles(parameters: IFilesRequest) {
    const url = `${this.getWorkspaceUrl()}/files`;
    const parametersSnake = this.snakeCaseKeys(parameters);
    const result = await this.httpClient.post(url, {
      data: {
        ...parametersSnake,
      },
    });
    return result.data as IFileEntry[];
  }


  /**
   * The main Search functionality
   * @param parameter
   * @returns
   */
  public async search(parameter: ISearchRequest): Promise<ISearchResult> {
    const queries = Array.isArray(parameter.query) ? parameter.query : [parameter.query];
    const url = `${this.getWorkspaceUrl()}/pipelines/${parameter.pipeline}/search`;
    const requestData = {
      queries,
      filters: parameter.filters,
    };
    const result = await this.httpClient.post(url, requestData);
    const searchResult = result.data.results[0] as ISearchResult;


    return searchResult;
  }

  private async uploadFileToDeepsetCloud(parameter: IFileUploadRequest, fileBuffer: Buffer): Promise<AxiosResponse> {
    const form = new FormData();
    form.append('meta', JSON.stringify(parameter.metadata || {}));
    form.append('file', fileBuffer, parameter.fileName);
    const url = `${this.getWorkspaceUrl()}/files`;

    let result;
    try {
      result = await axios({
        method: 'post',
        url,
        data: form,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }

    if (result.status != 201) {
      throw new Error('Upload to Deepset Cloud failed - statusCode: ' + result.status);
    }
    return result;
  }
  private getWorkspaceUrl(): string {
    return `${DEEPSET_CLOUD_API_BASE_URI}/workspaces/${this.config.workspace}`;
  }
}
