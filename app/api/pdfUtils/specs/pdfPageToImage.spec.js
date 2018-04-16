import fs from 'fs';

import pdfPageToImage from '../pdfPageToImage';

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
    safeDeleteFile(`${__dirname}/../fixtures/batmanFullPage1.png`)
    .then(() => safeDeleteFile(`${__dirname}/../fixtures/jokerThumbPage2.jpg`))
    .then(() => safeDeleteFile(`${__dirname}/../fixtures/jokerFullPage4.jpg`))
    .then(done)
    .catch(done.fail);
  }

  function expectIdenticalFiles(file1URL, file2URL) {
    const file1 = fs.readFileSync(`${__dirname}${file1URL}`);
    const file2 = fs.readFileSync(`${__dirname}${file2URL}`);
    expect(file1.equals(file2)).toBe(true);
  }

  function expectPDFResults([originalPDF, output, expected, options, done]) {
    pdfPageToImage(`${__dirname}/../fixtures/${originalPDF}`, `${__dirname}/../fixtures/${output}`, options)
    .then((res) => {
      expect(res).toContain('Finished converting page to');
      expectIdenticalFiles(`/../fixtures/${output}`, `/../fixtures/${expected}`);
      done();
    })
    .catch(done.fail);
  }

  beforeAll((done) => {
    deleteCreatedFiles(done);
  });

  describe('Basic Usage', () => {
    it('should save page 1 to specified output with default parameters (PNG, full size)', (done) => {
      expectPDFResults(['batman.pdf', 'batmanFullPage1.png', 'expectedBatmanFullPage1.png', undefined, done]);
    });
  });

  describe('Advanced Options', () => {
    it('should save allow saving a different page, scale and format', (done) => {
      const options = { format: 'jpg', scale: 0.2, page: 2 };
      expectPDFResults(['joker.pdf', 'jokerThumbPage2.jpg', 'expectedJokerThumbPage2.jpg', options, done]);
    });

    it('should save allow overriding certain params only', (done) => {
      const options = { format: 'jpg', page: 4 };
      expectPDFResults(['joker.pdf', 'jokerFullPage4.jpg', 'expectedJokerFullPage4.jpg', options, done]);
    });
  });

  afterAll((done) => {
    deleteCreatedFiles(done);
  });
});
