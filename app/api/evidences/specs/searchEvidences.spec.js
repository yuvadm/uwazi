/* eslint-disable max-nested-callbacks */
import {index as elasticIndex} from 'api/config/elasticIndexes';
import search from '../searchEvidences.js';
import elastic from '../../search/elastic';
//import queryBuilder from 'api/search/documentQueryBuilder';
import {catchErrors} from 'api/utils/jasmineHelpers';

import fixtures, {evidenceId, value1, value2} from './fixtures';
//import elasticFixtures, {ids} from './fixtures_elastic';
import db from 'api/utils/testing_db';
import elasticTesting from 'api/utils/elastic_testing';

describe('searchEvidences', () => {
  beforeEach((done) => {
    db.clearAllAndLoad(fixtures, (err) => {
      if (err) {
        done.fail(err);
      }

      elasticTesting.reindexEvidences()
      .then(done)
      .catch(done.fail);
    });
  });

  describe('search', () => {
    it('should return all results if no params passed', (done) => {
      search.search()
      .then((allEvidences) => {
        expect(allEvidences.totalRows).toBe(4);
        expect(allEvidences.rows.length).toBe(4);
        const value1Evidence = allEvidences.rows.find((e) => e._id === evidenceId.toString());
        expect(value1Evidence.value).toBe(value1);
        done();
      })
      .catch(catchErrors(done));
    });

    it('should search by value', (done) => {
      Promise.all([
        search.search({value: {values: [value1]}}),
        search.search({value: {values: [value2]}}),
        search.search({value: {values: [value1, value2]}})
      ])
      .then(([value1Evidences, value2Evidences, value12Evidences]) => {
        expect(value1Evidences.rows.length).toBe(2);
        expect(value1Evidences.rows[0].value).toBe(value1);
        expect(value1Evidences.rows[1].value).toBe(value1);

        expect(value2Evidences.rows.length).toBe(1);
        expect(value2Evidences.rows[0].value).toBe(value2);

        expect(value12Evidences.rows.length).toBe(3);
        done();
      })
      .catch(catchErrors(done));
    });
  });

  describe('index', () => {
    it('should index the evidence', (done) => {
      done();
      spyOn(elastic, 'index').and.returnValue(Promise.resolve());

      const id = db.id();

      const evidence = {
        _id: id,
        document: 'documentId'
      };

      search.index(evidence)
      .then(() => {
        expect(evidence._id.toString()).toBe(id.toString());
        expect(elastic.index)
        .toHaveBeenCalledWith({
          index: elasticIndex,
          type: 'evidence',
          id: id.toString(),
          body: {
            document: 'documentId'
          }
        });
        done();
      })
      .catch(catchErrors(done));
    });
  });

  describe('delete', () => {
    it('should delete the evidence', (done) => {
      spyOn(elastic, 'delete').and.returnValue(Promise.resolve());

      const id = db.id();

      search.delete(id)
      .then(() => {
        expect(elastic.delete).toHaveBeenCalledWith({index: elasticIndex, type: 'evidence', id: id.toString()});
        done();
      })
      .catch(catchErrors(done));
    });
  });

  describe('bulkIndex', () => {
    it('should update evidences using the bulk functionality', (done) => {
      spyOn(elastic, 'bulk').and.returnValue(Promise.resolve({items: []}));
      const evidences = [
        {_id: 'id1', document: 'doc1'},
        {_id: 'id2', document: 'doc2'}
      ];

      search.bulkIndex(evidences)
      .then(() => {
        expect(elastic.bulk).toHaveBeenCalledWith({body: [
          {index: {_index: elasticIndex, _type: 'evidence', _id: 'id1'}},
          {document: 'doc1'},
          {index: {_index: elasticIndex, _type: 'evidence', _id: 'id2'}},
          {document: 'doc2'}
        ]});
        done();
      })
      .catch(catchErrors(done));
    });
  });
});
