import { toMatchImageSnapshot } from 'jest-image-snapshot';
import Jimp from 'jimp';
import fs from 'fs';

import pdfPageToImage from '../pdfPageToImage';

expect.extend({ toMatchImageSnapshot });

describe('pdfPageToImage PDF utility', () => {
  function safeDeleteFile(file) {
    return new Promise((resolve, reject) => {
      fs.stat(file, (err) => {
        if (err) {
          return err.code === 'ENOENT' ? resolve() : reject(err);
        }

        fs.unlinkSync(file);
        return resolve();
      });
    });
  }

  function deleteCreatedFiles(done) {
    safeDeleteFile(`${__dirname}/fixtures/batmanFullPage1.png`)
    .then(() => safeDeleteFile(`${__dirname}/fixtures/jokerThumbPage2.jpg`))
    .then(() => safeDeleteFile(`${__dirname}/fixtures/jokerFullPagePage1.png`))
    .then(done)
    .catch(done.fail);
  }

  function expectIdenticalFiles(file1URL, reBuffer, done) {
    if (!reBuffer) {
      const file1 = fs.readFileSync(`${__dirname}${file1URL}`);
      expect(file1).toMatchImageSnapshot();
      done();
    } else {
      Jimp.read(`${__dirname}${file1URL}`).then((image) => {
        image.getBuffer(Jimp.MIME_PNG, (err, result) => {
          if (err) { throw err; }
          expect(result).toMatchImageSnapshot();
          done();
        });
      })
      .catch(done.fail);
    }
  }

  function expectPDFResults([originalPDF, output, options, reBuffer, done]) {
    pdfPageToImage(`${__dirname}/fixtures/${originalPDF}`, `${__dirname}/fixtures/${output}`, options)
    .then((res) => {
      expect(res).toContain('Finished converting page to');
      expectIdenticalFiles(`/fixtures/${output}`, reBuffer, done);
    })
    .catch(done.fail);
  }

  beforeAll((done) => {
    deleteCreatedFiles(done);
  });

  describe('Basic Usage', () => {
    it('should save page 1 to specified output with default parameters (PNG, full size)', (done) => {
      expectPDFResults(['batman.pdf', 'batmanFullPage1.png', undefined, false, done]);
    });
  });

  describe('Advanced Options', () => {
    it('should allow saving a different page, scale and format', (done) => {
      const options = { format: 'jpg', scale: 0.2, page: 2 };
      expectPDFResults(['joker.pdf', 'jokerThumbPage2.jpg', options, true, done]);
    });

    it('should allow overriding certain params only', (done) => {
      expectPDFResults(['joker.pdf', 'jokerFullPagePage1.png', { scale: 0.3 }, false, done]);
    });
  });

  afterAll((done) => {
    deleteCreatedFiles(done);
  });
});
