import PDFJS from 'pdfjs-dist';
//import { JSDOM } from 'jsdom';

import EventEmitter from 'events';
import fs from 'fs';
import path from 'path';

//const extractPageInfo = page => new Promise((resolve) => {
  //const { document } = (new JSDOM('')).window;
  //const textLayerDiv = document.createElement('div');

  //textLayerDiv.addEventListener('textlayerrendered', () => {
    //resolve(textLayerDiv.innerText.length);
  //});

  //textLayerDiv.className = 'textLayer';
  //const textLayer = new PDFJS.DefaultTextLayerFactory().createTextLayerBuilder(textLayerDiv, null, page.getViewport(1), true);
  //page.getTextContent({ normalizeWhitespace: true })
  //.then((textContent) => {
    //textLayer.setTextContent(textContent);
    //textLayer.render();
  //});
//});

//const extractPDFInfo = pdfFile => new Promise((resolve) => {
  //PDFJS.getDocument(pdfFile)
  //.then((pdf) => {
    //const pages = [];
    //for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      //pages.push(pdf.getPage(pageNumber).then(extractPageInfo));
    //}

    //return Promise.all(pages)
    //.then((result) => {
      //const count = {};
      //result.forEach((length, index) => {
        //count[index + 1] = {
            //chars: length
        //};
        //if (count[index]) {
          //count[index + 1].chars += count[index].chars;
        //}
      //});
      //resolve(count);
    //});
  //});
//});

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
        const pdfInfo = {};
        const fileData = new Uint8Array(data);
        PDFJS.getDocument(fileData).then((pdf) => {
          const maxPages = pdf.pdfInfo.numPages;
          const pages = [];
          for (let pageNumber = 1; pageNumber <= maxPages; pageNumber += 1) {
            pages.push(
              pdf.getPage(pageNumber)
              .then(page => page.getTextContent()
                .then(text => {
                  const plainText = text.items.map(s => s.str).join('');
                  pdfInfo[pageNumber] = {chars: plainText.length};
                  return `${plainText.replace(/(\S+)(\s?)/g, `$1[[${Number(page.pageIndex) + 1}]]$2`)}\f`;
                })
              )
            );
          }
          Promise.all(pages).then((texts) => {
            Object.keys(pdfInfo).forEach((key) => {
              if (pdfInfo[key - 1]) {
                pdfInfo[key].chars += pdfInfo[key - 1].chars;
              }
            });
            resolve([texts.join(''), pdfInfo]);
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

  convert() {
    return this.extractText()
    .catch(() => Promise.reject({ error: 'conversion_error' }))
    .then(fullText => ({ fullText }));
  }
}
