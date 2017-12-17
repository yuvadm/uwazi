import evidences from '../evidences.js';
import {catchErrors} from 'api/utils/jasmineHelpers';

import db from 'api/utils/testing_db';

describe('evidences', () => {
  describe('save', () => {
    fit('should create a new entity for each language in settings with a language property and a shared id', (done) => {
      let evidence = {
        entity: db.id(),
        property: db.id(),
        value: db.id(),
        evidence: {text: 'test evidence'}
      };

      evidences.save(evidence)
      .then(() => evidences.get())
      .then(([createdEvidence]) => {
        expect(createdEvidence.evidence.text).toBe('test evidence');
        done();
      })
      .catch(catchErrors(done));
    });
  });
});
