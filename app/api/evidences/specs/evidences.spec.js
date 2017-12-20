import evidences from '../evidences.js';
import entities from '../../entities';
import {catchErrors} from 'api/utils/jasmineHelpers';
import MLAPI from '../MLAPI';

import db from 'api/utils/testing_db';
import fixtures, {propertyID, entityID} from './fixtures.js';

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
      let evidence = {
        entity: entityID,
        property: propertyID,
        value: db.id(),
        evidence: {text: 'test evidence'}
      };

      evidences.save(evidence, {}, 'en')
      .then(() => evidences.get())
      .then(([createdEvidence]) => {
        expect(createdEvidence.evidence.text).toBe('test evidence');
        done();
      })
      .catch(catchErrors(done));
    });

    it('should save the value on the entity property', (done) => {
      let evidence = {
        entity: entityID,
        property: propertyID,
        value: 'value',
        evidence: {text: 'test evidence'}
      };

      evidences.save(evidence, {}, 'en')
      .then((updatedEntity) => {
        return Promise.all([
          updatedEntity,
          entities.getById(entityID)
        ]);
      })
      .then(([returnedEntity, entityOnDB]) => {
        expect(returnedEntity.metadata.multiselect).toEqual(['value']);
        expect(entityOnDB.metadata.multiselect).toEqual(['value']);
        evidence.value = 'value2';
        return evidences.save(evidence, {}, 'en');
      })
      .then((entity) => {
        expect(entity.metadata.multiselect).toEqual(['value', 'value2']);
        done();
      })
      .catch(catchErrors(done));
    });
  });

  //describe('getSuggestions', () => {
    //it('should call the suggestions api for each multiselect value and return all suggestions merged', (done) => {
      //spyOn(MLAPI, 'getSuggestions').and.returnValue('suggestions');
      //evidences.getSuggestions(entityID)
      //.then((suggestions) => {
        //expect(true).toBe(false);
        //done();
      //});
    //});
  //});
});
