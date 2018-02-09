import {catchErrors} from 'api/utils/jasmineHelpers';
import db from 'api/utils/testing_db';

import MLAPI from '../MLAPI';
import entities from '../../entities';
import evidences from '../evidences.js';
import fixtures, {evidenceId, propertyID1, entityID, value3, value4} from './fixtures.js';
import search from '../searchEvidences';

fdescribe('evidences', () => {
  beforeEach((done) => {
    db.clearAllAndLoad(fixtures, (err) => {
      if (err) {
        done.fail(err);
      }
      done();
    });
  });

  describe('save', () => {
    it('should save the evidence', (done) => {
      let newEvidence = {
        document: 'shared',
        property: propertyID1,
        value: db.id(),
        evidence: {text: 'test evidence'}
      };

      evidences.save(newEvidence, {}, 'en')
      .then(() => evidences.get({document: 'shared'}))
      .then(([createdEvidence]) => {
        expect(createdEvidence.evidence.text).toBe('test evidence');
        expect(createdEvidence.language).toBe('en');
        done();
      })
      .catch(catchErrors(done));
    });

    it('should return the updated entity and evidence', (done) => {
      let newEvidence = {
        document: 'shared',
        property: propertyID1,
        value: 'value',
        evidence: {text: 'test evidence'}
      };

      evidences.save(newEvidence, {}, 'en')
      .then(({entity, evidence}) => {
        expect(evidence.value).toBe('value');
        expect(evidence._id).toBeDefined();
        expect(entity.metadata.multiselect).toEqual(['value']);
        done();
      })
      .catch(catchErrors(done));
    });

    it('should index the newly created evidence', (done) => {
      spyOn(search, 'index');
      let evidence = {
        document: 'shared',
        property: propertyID1,
        value: 'value',
        evidence: {text: 'test evidence'}
      };

      evidences.save(evidence, {}, 'en')
      .then(() => {
        expect(search.index.calls.all()[0].args[0].value).toBe('value');
        expect(search.index.calls.all()[0].args[0]._id).toBeDefined();
        done();
      })
      .catch(catchErrors(done));
    });

    it('should save the value on the entity property, if not already saved', (done) => {
      let evidence = {
        document: 'shared',
        property: propertyID1,
        value: 'value',
        evidence: {text: 'test evidence'}
      };

      evidences.save(evidence, {}, 'en')
      .then(({entity}) => {
        return Promise.all([
          entity,
          entities.getById(entityID)
        ]);
      })
      .then(([returnedEntity, entityOnDB]) => {
        expect(returnedEntity.metadata.multiselect).toEqual(['value']);
        expect(entityOnDB.metadata.multiselect).toEqual(['value']);
        evidence.value = 'value2';
        return evidences.save(evidence, {}, 'en');
      })
      .then(({entity}) => {
        expect(entity.metadata.multiselect).toEqual(['value', 'value2']);
        return evidences.save(evidence, {}, 'en');
      })
      .then(({entity}) => {
        expect(entity.metadata.multiselect).toEqual(['value', 'value2']);
        done();
      })
      .catch(catchErrors(done));
    });
  });

  describe('getSuggestions', () => {
    it('should get suggestions passing the doc and every posible combination of property/vale for the multiselect', (done) => {
      spyOn(MLAPI, 'getSuggestions').and.returnValue(Promise.resolve([]));
      evidences.getSuggestions('shared', 'en')
      .then((suggestions) => {
        expect(MLAPI.getSuggestions).toHaveBeenCalledWith({
          doc: {
            title: 'Suggestions doc',
            text: 'this is a test'
          },
          properties: [
            {document: 'shared', language: 'en', property: propertyID1.toString(), value: value3},
            {document: 'shared', language: 'en', property: propertyID1.toString(), value: value4}
          ]
        });
        expect(suggestions).toEqual([]);
        done();
      })
      .catch(catchErrors(done));
    });

    it('should save the suggestions and then return them', (done) => {
      spyOn(MLAPI, 'getSuggestions').and.returnValue(Promise.resolve([
        {evidence: 'text', probability: 0.86543},
        {evidence: 'text2', probability: 0.9}
      ]));
      spyOn(search, 'bulkIndex').and.returnValue(Promise.resolve());

      evidences.getSuggestions('shared', 'en')
      .then((suggestions) => {
        return Promise.all([
          evidences.getById(suggestions[0]._id),
          evidences.getById(suggestions[1]._id)
        ]);
      })
      .then(([suggestion1, suggestion2]) => {
        expect(suggestion1.evidence.text).toBe('text');
        expect(suggestion1.probability).toBe(0.86543);
        expect(suggestion1.language).toBe('en');
        expect(suggestion2.evidence.text).toBe('text2');
        expect(suggestion2.probability).toBe(0.9);
        expect(suggestion2.language).toBe('en');

        expect(search.bulkIndex).toHaveBeenCalledWith([suggestion1, suggestion2]);
        done();
      })
      .catch(catchErrors(done));
    });
  });

  describe('delete', () => {
    it('should delete the evidence from the db and from the search engine', (done) => {
      spyOn(search, 'delete');
      evidences.delete(evidenceId)
      .then(() => evidences.get())
      .then((results) => {
        expect(results.length).toBe(3);
        expect(search.delete).toHaveBeenCalledWith(evidenceId);
        done();
      });
    });
  });
});
