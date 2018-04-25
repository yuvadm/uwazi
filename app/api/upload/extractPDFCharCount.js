import { JSDOM } from 'jsdom';

let PDFJS;

const extractPageInfo = page => new Promise((resolve) => {
  const textLayerDiv = document.createElement('div');

  textLayerDiv.addEventListener('textlayerrendered', () => {
    resolve(textLayerDiv.textContent.length);
  });

  textLayerDiv.className = 'textLayer';
  const textLayer = new PDFJS.DefaultTextLayerFactory().createTextLayerBuilder(textLayerDiv, null, page.getViewport(1), true);
  page.getTextContent({ normalizeWhitespace: true })
  .then((textContent) => {
    textLayer.setTextContent(textContent);
    textLayer.render();
  });
});

const promiseInSequence = funcs =>
  funcs.reduce((promise, func) =>
    promise.then(result => func().then(Array.prototype.concat.bind(result))),
    Promise.resolve([]));

const extractPDFInfo = pdfFile => new Promise((resolve) => {
  const { document } = (new JSDOM('')).window;
  global.document = document;
  global.navigator = { language: '' };

  PDFJS = require('../../../node_modules/pdfjs-dist/web/pdf_viewer').PDFJS;

  PDFJS.getDocument(pdfFile)
  .then((pdf) => {
    const pages = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      pages.push(() => pdf.getPage(pageNumber).then(extractPageInfo));
    }

    return promiseInSequence(pages)
    .then((result) => {
      const count = {};
      result.forEach((length, index) => {
        count[index + 1] = {
            chars: length
        };
        if (count[index]) {
          count[index + 1].chars += count[index].chars;
        }
      });
      resolve(count);
      global.document = null;
      global.navigator = null;
    });
  });
});

export default extractPDFInfo;
