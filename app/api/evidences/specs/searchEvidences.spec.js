/* eslint-disable max-nested-callbacks */
import {index as elasticIndex} from 'api/config/elasticIndexes';
import search from '../searchEvidences.js';
import elastic from '../../search/elastic';
//import queryBuilder from 'api/search/documentQueryBuilder';
import {catchErrors} from 'api/utils/jasmineHelpers';

//import fixtures, {templateId, userId} from './fixtures';
//import elasticFixtures, {ids} from './fixtures_elastic';
import db from 'api/utils/testing_db';
import elasticTesting from 'api/utils/elastic_testing';
import languages from 'shared/languages';

fdescribe('searchEvidences', () => {
  //beforeEach((done) => {
    //db.clearAllAndLoad(fixtures, (err) => {
      //if (err) {
        //done.fail(err);
      //}
      //done();
    //});
  //});

  describe('index', () => {
    it('should index the evidence', (done) => {
      done();
      spyOn(elastic, 'index').and.returnValue(Promise.resolve());

      const evidence = {
        _id: 'evidenceId',
        document: 'documentId'
      };

      search.index(evidence)
      .then(() => {
        expect(evidence._id).toBe('evidenceId');
        expect(elastic.index)
        .toHaveBeenCalledWith({
          index: elasticIndex,
          type: 'evidence',
          id: 'evidenceId',
          body: {
            _id: 'evidenceId',
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
          {_id: 'id1', document: 'doc1'},
          {index: {_index: elasticIndex, _type: 'evidence', _id: 'id2'}},
          {_id: 'id2', document: 'doc2'}
        ]});
        done();
      })
      .catch(catchErrors(done));
    });
  });

  //describe('indexEntities', () => {
    //it('should index entities based on query params passed', (done) => {
      //spyOn(search, 'bulkIndex');
      //search.indexEntities({sharedId: 'shared'}, {title: 1})
      //.then(() => {
        //const documentsToIndex = search.bulkIndex.calls.argsFor(0)[0];
        //expect(documentsToIndex[0].title).toBeDefined();
        //expect(documentsToIndex[0].metadata).not.toBeDefined();
        //expect(documentsToIndex[1].title).toBeDefined();
        //expect(documentsToIndex[1].metadata).not.toBeDefined();
        //expect(documentsToIndex[2].title).toBeDefined();
        //expect(documentsToIndex[2].metadata).not.toBeDefined();
        //done();
      //})
      //.catch(catchErrors(done));
    //});
  //});

});
