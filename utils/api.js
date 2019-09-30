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
    Host: "eastus.api.cognitive.microsoft.com",
    "Cache-Control": "no-cache",
    Accept: "*/*",
    "Ocp-Apim-Subscription-Key": process.env.AZURE_KEY,
    "Content-Type": "application/json",
  },
  body: { url: '' },
  json: true };

module.exports = {
  ocr: (imageUrl, cb) => {
    console.log(imageUrl);
    options.body.url=imageUrl;
    console.log(JSON.stringify(options.body))
    request(options, (error, response, body) => {
      if (error) console.log(error);
      console.log(body)
      cb(body);
    });
  }
};
