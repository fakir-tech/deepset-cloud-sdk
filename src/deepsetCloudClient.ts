import axios from 'axios';
import { AxiosRequestConfig, AxiosResponse, AxiosError, AxiosInstance } from 'axios';

import * as _ from 'lodash';
import FormData from 'form-data';
// var FormData = require("form-data");
import pLimit from 'p-limit';
import { IFileEntry, IFilesRequest, IFileUploadRequest, ISearchRequest, ISearchResult } from './deepsettypings.js';

// const url = `https://api.cloud.deepset.ai/api/v1/workspaces/${workspace}/files`;
const DEEPSET_CLOUD_API_BASE_URI = 'https://api.cloud.deepset.ai/api/v1';

/***
 * API documentation of Deepset Cloud:
 * https://docs.cloud.deepset.ai/reference/delete_file_api_v1_workspaces__workspace_name__files__file_id__delete
 */

export interface IConfig {
  workspace?: string;
  apiKey?: string;
}

export class DeepsetCloudClient {
  private config: IConfig;
  private httpClient: AxiosInstance;

  constructor(config: IConfig) {
    // default values
    this.config = config || {};
    this.config.workspace = this.config.workspace || 'default';
    this.httpClient = axios.create({
      baseURL: this.getWorkspaceUrl(),
      // timeout: 1000,
      headers: { authorization: `Bearer ${this.config.apiKey}` },
    });
    this.httpClient.interceptors.response.use(
      response => response,
      error => {
        // console.log('http error', error);

        switch (error.response.status) {
          case 401:
            throw new Error('Deepset Cloud API Key is invalid!');

          case 500:
            console.error('Deepset Cloud API Error 500', error.response.data);
            throw error;
          case 501:
            const message =
              'Deepset Cloud API Error 591 - means the model is going to be warmed up, please try it again in a few minutes!';
            console.warn(message, error.response.data);
            return Promise.reject(message);
        }
        console.log(`## Deepset Cloud API Error ${error.response.status} ##
        ${error.mesage}
        `,
          JSON.stringify(error.response.data, null, 2),
        );
        Promise.reject(error.message);
      },
    );
  }

  public initialize() {
    console.log('initialize');
  }

  /**
   * Method to upload a file to the Deepset Cloud.
   * fileBuffer or fileContent is required
   * @param parameter
   */
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
    const result = await this.uploadFileToDeepsetCloud(parameter, fileBuffer);
    return result.data;
  }

  /**
   * Does upload multiple files to the Deepset Cloud
   * concurrently with  a maximum of 10 parallel uploads.
   * @param parameters
   * @param maxParallelRequests Maximum number of parallel requests. Default is 10.
   */
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
    let url = `${this.getWorkspaceUrl()}/pipelines/${parameter.pipeline}/search`;
    const requestData = {
      queries,
      filters: parameter.filters,
    };
    const result = await this.httpClient.post(url, requestData);
    const searchResult = result.data as ISearchResult;

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
