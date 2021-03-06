import path from 'path';
import fs from 'fs';
import errorLog from 'api/log/errorLog';
import PDFObject from '../PDF.js';

describe('PDF', () => {
  let pdf;
  const filepath = `${__dirname}/12345.test.pdf`;
  const thumbnailName = `${__dirname}/documentId.jpg`;

  const deleteThumbnail = (done) => {
    fs.stat(path.resolve(thumbnailName), (err) => {
      if (err) { return done(); }
      fs.unlinkSync(thumbnailName);
      return done();
    });
  };

  beforeEach(() => {
    pdf = new PDFObject(filepath);
  });

  describe('convert', () => {
    it('should extract text indexed per page, with apended page in every word for elastic search purposes', async () => {
      const conversion = await pdf.convert();
      const pages = conversion.fullText;

      expect(pages[1]).toMatch('Page[[1]] 1[[1]]');
      expect(pages[2]).toMatch('Page[[2]] 2[[2]]');
      expect(pages[3]).toMatch('Page[[3]] 3[[3]]');
    });

    it('should return the total number of pages', async () => {
      const conversion = await pdf.convert();
      expect(conversion.totalPages).toBe(11);
    });
  });

  describe('createThumbnail', () => {
    beforeEach((done) => {
      deleteThumbnail(done);
    });

    afterEach((done) => {
      deleteThumbnail(done);
    });

    it('should send a spawn process to create image (implementation test)', async () => {
      const thumbnailResponse = await pdf.createThumbnail('documentId');
      expect(thumbnailResponse.childProcess.spawnfile).toBe('pdftoppm');
      expect(thumbnailResponse.childProcess.spawnargs).toEqual([
        'pdftoppm',
        '-f', '1',
        '-singlefile',
        '-scale-to', '320',
        '-jpeg',
        filepath,
        `${__dirname}/documentId`
      ]);
      expect(fs.existsSync(thumbnailName)).toBe(true);
    });

    it('should correctly log errors, but continue with the flow', async () => {
      spyOn(errorLog, 'error');
      pdf = new PDFObject('/missingpath/pdf.pdf');
      const thumbnailResponse = await pdf.createThumbnail('documentId');
      expect(thumbnailResponse instanceof Error).toBe(true);
      expect(errorLog.error).toHaveBeenCalledWith('Thumbnail creation error for: /missingpath/pdf.pdf');
    });
  });

  describe('deleteThumbnail', () => {
    it('should unlink the file from the system', async () => {
      await pdf.createThumbnail('documentId');
      expect(fs.existsSync(thumbnailName)).toBe(true);
      await pdf.deleteThumbnail('documentId');
      expect(fs.existsSync(thumbnailName)).toBe(false);
    });
  });
});
