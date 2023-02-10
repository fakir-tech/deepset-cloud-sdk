import axios from 'axios';
import * as FormData from 'form-data';
// var FormData = require("form-data");

export interface IConfig {
  workspace?: string;
  apikey?: string;
}

export interface IFileUploadRequest {
  fileContent?: string;
  fileBuffer?: Buffer;
  metadata: Object;
  fileName: string;
}

interface IHashMap {
  [details: string]: string;
}
export interface ISearchRequest {
  query: string | string[];
  filters: IHashMap;
  pipeline: string;
}

// const url = `https://api.cloud.deepset.ai/api/v1/workspaces/${workspace}/files`;
const DEEPSET_CLOUD_API_BASE_URI = 'https://api.deepset.ai/api/v1';

export class DeepsetCloudClient {
  private config: IConfig;

  constructor(config: IConfig) {
    // default values
    this.config = config || {};
    this.config.workspace = this.config.workspace || 'default';
  }

  public initialize() {
    console.log('initialize');
  }

  /**
   * Method to upload a file to the Deepset Cloud.
   * fileBuffer or fileContent is required
   * @param parameter
   */
  public async uploadFile(parameter: IFileUploadRequest) {
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

  public async searchFile(parameter: ISearchRequest) {
    const queries = Array.isArray(parameter.query) ? parameter.query : [parameter.query];
    const url = `${DEEPSET_CLOUD_API_BASE_URI}/workspaces/${this.config.workspace}/pipelines/${
      parameter.pipeline
    }/search`;

    const result = await axios({
      method: 'post',
      url,
      data: {
        queries,
        filters: parameter.filters,
      },
    });
    if (result.status != 200) {
      throw new Error('Search on Deepset Cloud failed - statusCode: ' + result.status, e);
    }
    return result;
  }

  private async uploadFileToDeepsetCloud(parameter: IFileUploadRequest, fileBuffer: Buffer): AxiosResponse<any, any> {
    const form = new FormData();
    form.append('meta', JSON.stringify(parameter.metadata || {}));
    form.append('file', fileBuffer, parameter.fileName);
    const url = `${DEEPSET_CLOUD_API_BASE_URI}/workspaces/${this.config.workspace}/files`;

    const result = await axios({
      method: 'post',
      url,
      data: form,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${this.config.apikey}`,
      },
    });

    if (result.status != 201) {
      throw new Error('Upload to Deepset Cloud failed - statusCode: ' + result.status, e);
    }
    return result;
  }
}
