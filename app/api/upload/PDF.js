import PDFJS from 'pdfjs-dist';

import EventEmitter from 'events';
import fs from 'fs';
import path from 'path';

import { attachmentsPath } from 'api/config/paths';
import pdfUtils from 'api/pdfUtils';

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
        const fileData = new Uint8Array(data);
        return PDFJS.getDocument(fileData).then((pdf) => {
          const maxPages = pdf.pdfInfo.numPages;
          const pages = [];
          for (let pageNumber = 1; pageNumber <= maxPages; pageNumber += 1) {
            pages.push(
              pdf.getPage(pageNumber)
              .then(page => Promise.all([page, page.getTextContent()]))
              .then(([page, text]) => `${text.items.map(s => s.str).join('').replace(/(\S+)(\s?)/g, `$1[[${Number(page.pageIndex) + 1}]]$2`)}\f`)
            );
          }

          Promise.all(pages).then((texts) => {
            resolve(texts.join(''));
          })
          .catch((error) => {
            reject(error);
          });
        })
        .catch((error) => {
          reject(error);
        });
      });
    });
  }

  generateThumbnail() {
    const thumbPath = `${attachmentsPath}${basename(this.optimizedPath)}.jpg`;
    return pdfUtils.pdfPageToImage(this.optimizedPath, thumbPath, { format: 'jpg', scale: 0.3 })
    .catch(() => Promise.resolve());
  }

  convert() {
    return this.extractText().catch(() => Promise.reject(new Error('conversion_error')))
    .then(fullText => Promise.all([fullText, this.generateThumbnail()]))
    .then(([fullText]) => ({ fullText }));
  }
}
