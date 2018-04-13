/* eslint-disable import/no-mutable-exports, global-require, prefer-destructuring */
import { isClient } from 'app/utils';

let PDFJS;
let PDFJSLib;

if (isClient) {
  require('../../../node_modules/pdfjs-dist/web/pdf_viewer.css');
  PDFJS = require('../../../node_modules/pdfjs-dist/web/pdf_viewer.js');
  PDFJSLib = require('pdfjs-dist');
  if (process.env.HOT) {
    PDFJS.workerSrc = 'http://localhost:8080/pdf.worker.js';
  } else {
    PDFJS.workerSrc = '/pdf.worker.js';
  }
}
console.log(PDFJS);
console.log(PDFJSLib);

export { PDFJS, PDFJSLib };
