export const Greeter = (name: string) => `Hello ${name}`;


export interface IConfig {
    workspace?: string;
    apikey?: string
}

export const initialize = () => {
    
    console.log(Greeter('World'));
}