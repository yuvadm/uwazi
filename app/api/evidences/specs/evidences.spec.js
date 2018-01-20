import evidences from '../evidences.js';
import entities from '../../entities';
import {catchErrors} from 'api/utils/jasmineHelpers';
import MLAPI from '../MLAPI';

import db from 'api/utils/testing_db';
import fixtures, {evidenceId, propertyID, propertyID2, entityID} from './fixtures.js';
import search from '../searchEvidences';

describe('evidences', () => {
  beforeEach((done) => {
    db.clearAllAndLoad(fixtures, (err) => {
      if (err) {
        done.fail(err);
      }
      done();
    });
  });

  describe('save', () => {
    it('should create a new entity for each language in settings with a language property and a shared id', (done) => {
      let newEvidence = {
        document: 'shared',
        property: propertyID,
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
        property: propertyID,
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
        property: propertyID,
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
        property: propertyID,
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
      evidences.getSuggestions('shared1', 'en')
      .then((suggestions) => {
        expect(MLAPI.getSuggestions).toHaveBeenCalledWith({
          doc: {
            title: 'Suggestions doc',
            text: 'this is a test'
          },
          properties: [
            {document: 'shared1', language: 'en', property: propertyID, value: '1'},
            {document: 'shared1', language: 'en', property: propertyID, value: '2'},
            {document: 'shared1', language: 'en', property: propertyID2, value: '3'},
            {document: 'shared1', language: 'en', property: propertyID2, value: '4'}
          ]
        });
        expect(suggestions).toEqual([]);
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
        expect(results.length).toBe(0);
        expect(search.delete).toHaveBeenCalledWith(evidenceId);
        done();
      });
    });
  });
});
