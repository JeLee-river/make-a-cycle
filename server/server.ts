import canvas from 'canvas';
import express, { Request, Response } from 'express';
import { JSDOM } from 'jsdom';
import '@tensorflow/tfjs-node';
import tmImage from '@teachablemachine/image';

const app = express();

function init() {
  configureBodyParser();
  configureEndPoints();
  configureBrowserPolyFills();

  // Configure the server to begin listening for requests.
  app.listen(3001, () => {
    console.log('Server running on port 3001');
  });
}

async function addEndpoint(name, baseUrl) {
  const modelURL = baseUrl + 'model.json';
  const metadataURL = baseUrl + 'metadata.json';
  const model = await tmImage.load(modelURL, metadataURL);
  app.post('/' + name, (request, response) => {
    const base64Image = Buffer.from(request.body).toString('base64');
    const contentType = request.get('Content-Type');
    getPrediction(model, base64Image, contentType, (output) => {
      response.send(output);
    });
  });
}

function configureBodyParser() {
  app.use(require('body-parser').raw({ type: 'image/jpeg', limit: '3MB' }));
}

function configureBrowserPolyFills() {
  global.window = new JSDOM(`
  <body>
    <script>
    document.body.appendChild(document.createElement("hr"));
    </script>
  </body>`).window;
  global.document = window.document;
  global.fetch = require('node-fetch');
  global.HTMLVideoElement = class HTMLVideoElement {};
}

function configureEndPoints() {
  addEndpoint(
    'test',
    'https://teachablemachine.withgoogle.com/models/AI5i76oG/'
  );
}

async function getPrediction(model, imageData, contentType, responseFunction) {
  const imageCanvas = canvas.createCanvas(64, 64);
  const canvasContext = imageCanvas.getContext('2d');

  const canvasImage = new canvas.Image();
  canvasImage.onload = async () => {
    canvasContext.drawImage(canvasImage, 0, 0, 64, 64);

    const prediction = await model.predict(imageCanvas);
    console.log(prediction);
    responseFunction(prediction);
  };

  canvasImage.onerror = (error) => {
    throw error;
  };

  canvasImage.src = `data:${contentType};base64,` + imageData;
}

init();
