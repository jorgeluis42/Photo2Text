const fs = require("fs");
const path = require("path");
const request = require("request");

const options = {
  method: "POST",
  url: "https://eastus.api.cognitive.microsoft.com/vision/v1.0/ocr",
  qs: {
    language: "en",
    "detectOrientation ": "true"
  },
  headers: {
    "cache-control": "no-cache",
    Connection: "keep-alive",
    "Accept-Encoding": "gzip, deflate",
    Host: "eastus.api.cognitive.microsoft.com",
    "Cache-Control": "no-cache",
    Accept: "*/*",
    "Ocp-Apim-Subscription-Key": process.env.AZURE_KEY,
    "content-type": "multipart/form-data"
  },
  formData: {
    image: {
      options: {
        contentType: null
      }
    }
  }
};

module.exports = {
  ocr: (fileLocation, cb) => {
    const readFile = fs.createReadStream(fileLocation);
    options.formData.image.value = readFile;
    options.formData.image.options.fileName = fileLocation;
    request(options, (error, response, body) => {
      if (error) console.log(error);
      // console.log("-=-=-=-=-=-=-=-=-=-=-=-==--",(body))
      cb(JSON.parse(body));
    });
  }
};
