const apiKey = '..';
import { initialize } from './src/index.js';
const deepsetCloudClient = initialize({ apiKey, workspace: 'xircle2demo' });
async function run() {
    await deepsetCloudClient.storeFile({
        fileContent: 'hello world',
        fileName: 'hello.txt',
        uniqueId: 'hello.',
        skipDuplicates: true,
    });
    const response = await deepsetCloudClient.search({ pipeline: 'default', query: 'Who is the president of the USA?' });
    response.answers.map((a) => console.log('Antwort: ' + a.answer));
}
run().then(console.log).catch(console.error);
//# sourceMappingURL=sample.js.map