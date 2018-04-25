import PDFJS from 'pdfjs-dist';
import { JSDOM } from 'jsdom';
//const JSDOM = require("jsdom");

import EventEmitter from 'events';
import fs from 'fs';
import path from 'path';
var Canvas = require('canvas');




const basename = (filepath = '') => {
  let finalPath = filepath;
  if (typeof filepath !== 'string') {
    finalPath = '';
  }
  return path.basename(finalPath, path.extname(finalPath));
};

export default class PDF extends EventEmitter {
  constructor(filepath, originalName) {
    super();
    this.logFile = `${__dirname}/../../../log/${basename(originalName)}.log`;
    this.filepath = filepath;
    this.optimizedPath = filepath;
  }

  extractText() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.filepath, (err, data) => {
        if (err) {
          return reject(err);
        }
        //const pdfInfo = {};
        const fileData = new Uint8Array(data);
        extractPDFInfo(fileData)
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
      });
    });
  }

  convert() {
    return this.extractText()
    .catch(() => Promise.reject({ error: 'conversion_error' }))
    .then(fullText => ({ fullText }));
  }
}

