import { catchErrors } from 'api/utils/jasmineHelpers';
import testingDB from 'api/utils/testing_db';
import migration from '../index.js';
import fixtures from './fixtures.js';

describe('migration divide_fullText_pages', () => {
  beforeEach((done) => {
    spyOn(process.stdout, 'write');
    testingDB.clearAllAndLoad(fixtures).then(done).catch(catchErrors(done));
  });

  afterAll((done) => {
    testingDB.disconnect().then(done);
  });

  it('should have a delta number', () => {
    expect(migration.delta).toBe(3);
  });

  it('should divide fullText by pages', (done) => {
    migration.up(testingDB.mongodb)
    .then(() => testingDB.mongodb.collection('entities').find().toArray())
    .then(([doc1, doc2]) => {
      expect(Object.keys(doc1.fullText).length).toBe(3);
      expect(doc1.numPages).toBe(3);
      expect(doc1.fullText[1]).toBe('first page');
      expect(doc1.fullText[2]).toBe('second page');
      expect(doc1.fullText[3]).toBe('third page');

      expect(Object.keys(doc2.fullText).length).toBe(4);
      expect(doc2.numPages).toBe(4);
      expect(doc2.fullText[1]).toBe('first page');
      expect(doc2.fullText[2]).toBe('second page');
      expect(doc2.fullText[3]).toBe('third page');
      expect(doc2.fullText[4]).toBe('fourth page');
      done();
    })
    .catch(catchErrors(done));
  });
});
