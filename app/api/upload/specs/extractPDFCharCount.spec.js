import fs from 'fs';

import extracPDFCharCount from '../extractPDFCharCount';

describe('extractPDFCharCount', () => {
  fit('should extract number of characters per page', (done) => {
    const filepath = `${__dirname}/batman_wikipedia.pdf`;

    const fileData = new Uint8Array(fs.readFileSync(filepath));

    extracPDFCharCount(fileData)
    .then((pages) => {
      const pdfInfo = Object.keys(pages).map(key => pages[key].chars).sort((a, b) => a - b);
      expect(pdfInfo).toMatchSnapshot();
      done();
    })
    .catch(done.fail);
  });
});
