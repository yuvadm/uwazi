import fs from 'fs';
import pdfjsLib from 'pdfjs-dist';
import Canvas from 'canvas';
import assert from 'assert';

function NodeCanvasFactory() {}
NodeCanvasFactory.prototype = {
  create: (width, height) => {
    assert(width > 0 && height > 0, 'Invalid canvas size');
    const canvas = new Canvas(width, height);
    const context = canvas.getContext('2d');
    return { canvas, context };
  },

  reset: (_canvasAndContext, width, height) => {
    const canvasAndContext = _canvasAndContext;
    assert(canvasAndContext.canvas, 'Canvas is not specified');
    assert(width > 0 && height > 0, 'Invalid canvas size');
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  },

  destroy: (_canvasAndContext) => {
    const canvasAndContext = _canvasAndContext;
    assert(canvasAndContext.canvas, 'Canvas is not specified');

    // Zeroing the width and height cause Firefox to release graphics
    // resources immediately, which can greatly reduce memory consumption.
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  },
};

function readPDFData(pdfURL) {
  return new Promise((resolve, reject) => {
    fs.readFile(pdfURL, (err, rawData) => {
      if (err) { reject(err); }
      resolve(new Uint8Array(rawData));
    });
  });
}

function renderPage(pdfDocument, page, scale) {
  return pdfDocument.getPage(page)
  .then((pageData) => {
    const viewport = pageData.getViewport(scale);
    const canvasFactory = new NodeCanvasFactory();
    const canvasAndContext = canvasFactory.create(viewport.width, viewport.height);
    const renderContext = {
      canvasContext: canvasAndContext.context,
      viewport,
      canvasFactory
    };

    return pageData.render(renderContext).then(() => canvasAndContext);
  });
}

function outputJpg(outputURL, canvasAndContext, promise) {
  const out = fs.createWriteStream(outputURL);
  const stream = canvasAndContext.canvas.jpegStream({ bufsize: 4096, quality: 75, progressive: false });

  stream.on('data', (chunk) => { out.write(chunk); });
  stream.on('end', () => { out.end(); });
  out.on('error', (err) => { promise.reject(err); });

  out.on('finish', () => {
    promise.resolve('Finished converting page to JPG.');
  });
}

function outputPng(outputURL, canvasAndContext, promise) {
  const image = canvasAndContext.canvas.toBuffer();
  fs.writeFile(outputURL, image, (error) => {
    if (error) { return promise.reject(error); }
    return promise.resolve('Finished converting page to PNG.');
  });
}

function formatResult(canvasAndContext, outputURL, format) {
  return new Promise((resolve, reject) => {
    switch (format) {
    case 'jpg':
      outputJpg(outputURL, canvasAndContext, { resolve, reject });
      break;
    case 'png':
    default:
      outputPng(outputURL, canvasAndContext, { resolve, reject });
      break;
    }
  });
}

const pdfPageToImage = (pdfURL, outputURL, _options) => {
  const { format, scale, page } = Object.assign({ format: 'png', scale: 1, page: 1 }, _options || {});

  return readPDFData(pdfURL)
  .then(rawData => pdfjsLib.getDocument({
    data: rawData,
    disableFontFace: true,
    nativeImageDecoderSupport: 'none',
  }))
  .then(pdfDocument => renderPage(pdfDocument, page, scale))
  .then(canvasAndContext => formatResult(canvasAndContext, outputURL, format));
};

export default pdfPageToImage;
