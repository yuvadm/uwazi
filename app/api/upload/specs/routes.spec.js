/* eslint-disable max-nested-callbacks */
import { catchErrors } from 'api/utils/jasmineHelpers';
import db from 'api/utils/testing_db';
import documents from 'api/documents';
import entities from 'api/entities';
import relationships from 'api/relationships';
import search from 'api/search/search';
import pdfUtils from 'api/pdfUtils';

import fixtures, { entityId } from './fixtures.js';
import instrumentRoutes from '../../utils/instrumentRoutes';
import uploadRoutes from '../routes.js';

describe('upload routes', () => {
  let routes;
  let req;
  let file;
  let iosocket;

  beforeEach((done) => {
    spyOn(search, 'delete').and.returnValue(Promise.resolve());
    spyOn(entities, 'indexEntities').and.returnValue(Promise.resolve());
    spyOn(pdfUtils, 'pdfPageToImage').and.returnValue(Promise.resolve());

    iosocket = jasmine.createSpyObj('socket', ['emit']);
    const io = { getCurrentSessionSockets: () => ({ sockets: [iosocket], emit: iosocket.emit }) };
    routes = instrumentRoutes(uploadRoutes);
    file = { fieldname: 'file',
            originalname: 'gadgets-01.pdf',
            encoding: '7bit',
            mimetype: 'application/octet-stream',
            destination: `${__dirname}/uploads/`,
            filename: 'f2082bf51b6ef839690485d7153e847a.pdf',
            path: `${__dirname}/uploads/f2082bf51b6ef839690485d7153e847a.pdf`,
            size: 171411271 };
    req = { language: 'es', user: 'admin', headers: {}, body: { document: 'id' }, files: [file], io };

    db.clearAllAndLoad(fixtures).then(done).catch(catchErrors(done));
  });

  afterAll((done) => {
    db.disconnect().then(done);
  });

  describe('POST/upload', () => {
    describe('Success process', () => {
      function getDocuments() {
        return Promise.all([
          documents.get({ sharedId: 'id', language: 'es' }, '+fullText'),
          documents.get({ sharedId: 'id', language: 'en' }, '+fullText')
        ]);
      }

      function checkLanguage(lang, done) {
        iosocket.emit.and.callFake((eventName) => {
          if (eventName === 'documentProcessed') {
            return getDocuments()
            .then(([docES, docEN]) => {
              expect(docEN[0].file.language).toBe(lang);
              expect(docES[0].file.language).toBe(lang);
              done();
            })
            .catch(catchErrors(done));
          }

          return null;
        });
      }

      // Temporary test for PDF conversion. This should probably go elsewhere?
      it('should process the document after upload', (done) => {
        iosocket.emit.and.callFake((eventName) => {
          if (eventName === 'documentProcessed') {
            return getDocuments()
            .then(([docES, docEN]) => {
              expect(iosocket.emit).toHaveBeenCalledWith('conversionStart', 'id');
              expect(iosocket.emit).toHaveBeenCalledWith('documentProcessed', 'id');
              expect(docEN[0].processed).toBe(true);
              expect(docEN[0].fullText).toMatch(/Test\[\[1\]\] file/);
              expect(docEN[0].language).toBe('en');

              expect(docES[0].processed).toBe(true);
              expect(docES[0].fullText).toMatch(/Test\[\[1\]\] file/);
              expect(docES[0].language).toBe('es');
              done();
            })
            .catch(catchErrors(done));
          }
          return null;
        });

        routes.post('/api/upload', req)
        .catch(catchErrors(done));
      });

      describe('Language detection', () => {
        it('should detect English documents and store the result', (done) => {
          file.filename = 'eng.pdf';
          file.path = `${__dirname}/uploads/eng.pdf`;

          checkLanguage('eng', done);

          routes.post('/api/upload', req)
          .catch(catchErrors(done));
        });

        it('should detect Spanish documents and store the result', (done) => {
          file.filename = 'spn.pdf';
          file.path = `${__dirname}/uploads/spn.pdf`;

          checkLanguage('spa', done);

          routes.post('/api/upload', req)
          .catch(catchErrors(done));
        });
      });
    });

    // -----------------------------------------------------------------------

    describe('when conversion fails', () => {
      function checkError(done) {
        iosocket.emit.and.callFake((eventName) => {
          if (eventName === 'conversionFailed') {
            setTimeout(() => {
              entities.getAllLanguages('id')
              .then((docs) => {
                expect(docs[0].processed).toBe(false);
                expect(docs[1].processed).toBe(false);
                done();
              });
            }, 500);
          }

          if (eventName === 'documentProcessed') {
            done.fail('should not have processed');
          }
        });
      }

      describe('by conversion_error', () => {
        it('should set document processed to false and emit a socket conversionFailed event with the id of the document', (done) => {
          checkError(done);
          req.files = ['invalid_file'];
          routes.post('/api/upload', req)
          .catch(done.fail);
        });
      });

      fdescribe('by thumbnail_error', () => {
        it('should set document processed to false and emit a socket conversionFailed event with the id of the document', (done) => {
          pdfUtils.pdfPageToImage.and.callFake(() => Promise.reject(new Error('thumbnail_error')));

          checkError(done);

          routes.post('/api/upload', req)
          .catch(catchErrors(done));
        });
      });
    });

    describe('when upload finishes', () => {
      it('should update the document with the file path and uploaded flag to true', (done) => {
        routes.post('/api/upload', req)
        .then((response) => {
          expect(response).toEqual(file);
          return documents.getById('id', 'es');
        })
        .then((doc) => {
          expect(doc.file.originalname).toEqual(file.originalname);
          expect(doc.file.filename).toEqual(file.filename);
          expect(doc.uploaded).toEqual(true);
          done();
        })
        .catch(done.fail);
      });
    });
  });

  describe('POST/reupload', () => {
    beforeEach(() => {
      spyOn(relationships, 'deleteTextReferences').and.returnValue(Promise.resolve());
    });

    it('should reupload a document', (done) => {
      req.body.document = entityId;
      routes.post('/api/reupload', req)
      .then((response) => {
        expect(relationships.deleteTextReferences).toHaveBeenCalledWith('id', 'es');
        expect(response).toEqual(file);

        return documents.getById('id', 'es');
      })
      .then((modifiedDoc) => {
        expect(modifiedDoc.toc.length).toBe(0);
        done();
      })
      .catch(done.fail);
    });
  });
});
