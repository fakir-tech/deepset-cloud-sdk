import { DeepsetCloudClient, IConfig } from './deepsetCloudClient.js';

export const initialize = (config: IConfig) => {
  if (!config.apiKey) {
    throw new Error('Deepset Cloud API Key is required!');
  }
  return new DeepsetCloudClient(config);
};
