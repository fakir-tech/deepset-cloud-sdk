import { DeepsetCloudClient } from './deepsetCloudClient.js';
export const initialize = (config) => {
    if (!config.apiKey) {
        throw new Error('Deepset Cloud API Key is required!');
    }
    return new DeepsetCloudClient(config);
};
//# sourceMappingURL=index.js.map