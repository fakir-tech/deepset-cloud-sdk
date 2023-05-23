import axios from 'axios';
import * as _ from 'lodash';
import FormData from 'form-data';
import pLimit from 'p-limit';
import { HttpClientFactory } from './httpClientService.js';
const DEEPSET_CLOUD_API_BASE_URI = 'https://api.cloud.deepset.ai/api/v1';
export class DeepsetCloudClient {
    constructor(config) {
        this.config = config || {};
        this.config.workspace = this.config.workspace || 'default';
        this.httpClient = HttpClientFactory.createHttpClient({
            baseURL: this.getWorkspaceUrl(),
            bearerToken: this.config.apiKey
        });
    }
    async storeFile(parameter) {
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
    async storeFiles(parameters, maxParallelRequests) {
        const maxConccurrency = maxParallelRequests || 10;
        const limit = pLimit(maxConccurrency);
        const promises = parameters.map(parameter => limit(() => this.storeFile(parameter)));
        return await Promise.all(promises);
    }
    async getFile(fileId) {
        const url = `${this.getWorkspaceUrl()}/files/${fileId}`;
        throw new Error("Not implemented yet.");
    }
    async getFileContent(fileId) {
        const url = `${this.getWorkspaceUrl()}/files/${fileId}`;
        const result = await this.httpClient.get(url);
        return result.data;
    }
    async removeFile(fileId) {
        const url = `${this.getWorkspaceUrl()}/files/${fileId}`;
        const result = await this.httpClient.delete(url);
        return result.data;
    }
    async getSearchHistory(pipeline, limit, pageNumber) {
        const url = `${this.getWorkspaceUrl()}/pipelines/${pipeline}/search_history`;
        const result = await this.httpClient.get(url, {
            params: { limit, page: pageNumber }
        });
        return result.data;
    }
    snakeCaseKeys(obj) {
        return _.mapKeys(obj, (value, key) => _.snakeCase(key));
    }
    async getFiles(parameters) {
        const url = `${this.getWorkspaceUrl()}/files`;
        const parametersSnake = this.snakeCaseKeys(parameters);
        const result = await this.httpClient.post(url, {
            data: Object.assign({}, parametersSnake),
        });
        return result.data;
    }
    async search(parameter) {
        const queries = Array.isArray(parameter.query) ? parameter.query : [parameter.query];
        let url = `${this.getWorkspaceUrl()}/pipelines/${parameter.pipeline}/search`;
        const requestData = {
            queries,
            filters: parameter.filters,
        };
        const result = await this.httpClient.post(url, requestData);
        const searchResult = result.data.results[0];
        return searchResult;
    }
    async uploadFileToDeepsetCloud(parameter, fileBuffer) {
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
        }
        catch (error) {
            console.log(error);
            throw error;
        }
        if (result.status != 201) {
            throw new Error('Upload to Deepset Cloud failed - statusCode: ' + result.status);
        }
        return result;
    }
    getWorkspaceUrl() {
        return `${DEEPSET_CLOUD_API_BASE_URI}/workspaces/${this.config.workspace}`;
    }
}
//# sourceMappingURL=deepsetCloudClient.js.map