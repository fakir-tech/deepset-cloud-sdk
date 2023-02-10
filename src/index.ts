import { DeepsetCloudClient, IConfig } from "./deepsetCloudClient"


export const initialize = (config: IConfig) => {
    // TODO: validate
    console.log('Got config', config);
    return new DeepsetCloudClient(config);
}