/* eslint-disable import/no-mutable-exports, global-require, prefer-destructuring */
import { isClient } from 'app/utils';

let PDFJS;
if (isClient) {
  require('../../../node_modules/pdfjs-dist/web/pdf_viewer.css');
  PDFJS = require('../../../node_modules/pdfjs-dist/build/pdf.js');
  const viewer = require('../../../node_modules/pdfjs-dist/web/pdf_viewer.js');

  PDFJS = Object.assign(PDFJS, viewer);
  if (process.env.HOT) {
    PDFJS.GlobalWorkerOptions.workerSrc = 'http://localhost:8080/pdf.worker.js';
  } else {
    PDFJS.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';
  }
}

export default PDFJS;
