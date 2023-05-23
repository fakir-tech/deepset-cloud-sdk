import axios from 'axios';
export class HttpClientFactory {
    static createHttpClient(config) {
        const headers = {};
        if (config === null || config === void 0 ? void 0 : config.bearerToken) {
            headers['Authorization'] = `Bearer ${config.bearerToken}`;
        }
        const client = axios.create({
            baseURL: config === null || config === void 0 ? void 0 : config.baseURL,
            headers,
        });
        client.interceptors.response.use((response) => response, (error) => {
            switch (error.response.status) {
                case 401:
                    throw new Error('Deepset Cloud API Key is invalid!');
                case 500:
                    console.error('Deepset Cloud API Error 500', error.response.data);
                    throw error;
                case 501:
                    const message = 'Deepset Cloud API Error 591 - means the model is going to be warmed up, please try it again in a few minutes!';
                    console.warn(message, error.response.data);
                    return Promise.reject(message);
            }
            console.log(`## Deepset Cloud API Error ${error.response.status} ##
          ${error.mesage}
          `, JSON.stringify(error.response.data, null, 2));
            Promise.reject(error.message);
        });
        return client;
    }
}
//# sourceMappingURL=httpClientService.js.map