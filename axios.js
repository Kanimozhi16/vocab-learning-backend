const axios = require('axios');

const apiKey = 'youhf_VbtHxtjDeXOXSvfJJylETcgTqzADIHvedK';
const model = 'bert-base-uncased'; // Example model, change to your desired model
const endpoint = `https://api-inference.huggingface.co/models/${model}`;

const headers = {
  Authorization: `Bearer ${apiKey}`,
};

const data = {
  inputs: 'Hello, how are you?',
};

axios
  .post(endpoint, data, { headers })
  .then((response) => {
    console.log('Model Response:', response.data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
