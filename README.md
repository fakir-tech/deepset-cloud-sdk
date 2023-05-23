
# Deepset Cloud Client SDK

This is an inofficial [deepset](https://www.deepset.ai) cloud client provided by [Fakir Technology Consultants GmbH](https://www.fakir.tech).

If you have any questions or feedback, feel free to open an issue or contact us at info@fakir.tech

## Features

**File Upload Handling**

* Throttling of requests
* Retry on failed uploads
* Data Deduplications (using unique meta fields)


## Quick Examples

```javascript
import { initialize } from 'deepet-cloud-sdk';

const deepsetCloudClient = initialize({apiKey: '...' });


await deepsetCloudClient.storeFile({
    fileContent: "I am Albet Einestein",
    fileName: "einstein.txt"
})

const { results } = await deepsetCloudClient.search( {   
            pipeline:"germanBert", 
            query:"Who ist Albert Einstein"
        })


for (let answer of results[0]) {
    console.log(answer.text); //
}
```
