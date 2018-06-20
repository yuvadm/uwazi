/* eslint-disable import/no-mutable-exports, global-require, prefer-destructuring */
import { isClient } from 'app/utils';

let PDFJS;
if (isClient) {
  require('../../../node_modules/pdfjs-dist/web/pdf_viewer.css');
  PDFJS = require('../../../node_modules/pdfjs-dist/web/pdf_viewer.js').PDFJS;
  if (window.pdfWorkerPath) {
    PDFJS.workerSrc = window.pdfWorkerPath;
  }
}

export default PDFJS;
