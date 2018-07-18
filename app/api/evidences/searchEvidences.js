import Immutable from 'immutable';

import {index as elasticIndex} from 'api/config/elasticIndexes';

import elastic from '../search/elastic';
import entities from '../entities';
import queryBuilder from './evidencesQueryBuilder';

export default {
  search(filters, limit) {
    const query = queryBuilder();
    if (filters) {
      query.filter(filters);
    }

    if (limit) {
      query.limit(limit);
    }

    return elastic.search({index: elasticIndex, type: 'evidence', body: query.query()})
    .then((result) => {
      const rows = result.hits.hits.map((hit) => {
        hit._source._id = hit._id;
        return hit._source;
      });

      return {rows, totalRows: result.hits.total};
    });
  },

  index(evidence) {
    return entities.getById(evidence.document, evidence.language)
    .then((doc) => {
      const id = evidence._id.toString();
      let body = Object.assign({documentTitle: doc.title}, evidence);
      delete body._id;
      return elastic.index({index: elasticIndex, type: 'evidence', id, body}).then(() => Object.assign({documentTitle: doc.title}, evidence));
    });
  },

  bulkIndex(evidencesToIndex) {
    const documentIds = evidencesToIndex.map(e => e.document).filter(v => v).filter((el, i, a) => i === a.indexOf(el));
    return entities.get({sharedId: {$in: documentIds}, language: 'en'}, 'title sharedId')
    .then((documents) => {
      const documentTitles = documents.reduce((titles, document) => {
        titles[document.sharedId] = document.title;
        return titles;
      }, {});
      const evidences = Immutable.fromJS(evidencesToIndex).toJS();
      const indexedEvidences = [];
      const body = evidences.reduce((value, evidence) => {
        value.push({index: {_index: elasticIndex, _type: 'evidence', _id: evidence._id}});
        evidence.documentTitle = documentTitles[evidence.document];
        indexedEvidences.push(Object.assign({}, evidence));
        delete evidence._id;
        value.push(evidence);
        return value;
      }, []);

      return elastic.bulk({body})
      .then((res) => {
        if (res.items) {
          res.items.forEach((f) => {
            if (f.index.error) {
              console.log(`ERROR Failed to index evidence ${f.index._id}: ${JSON.stringify(f.index.error, null, ' ')}`);
            }
          });
        }
        return elastic.indices.refresh({index: elasticIndex});
      })
      .then(() => indexedEvidences);
    });
  },

  delete(id) {
    return elastic.delete({index: elasticIndex, type: 'evidence', id: id.toString()});
  },

  deleteAll() {
    return elastic.deleteByQuery({index: elasticIndex, type: 'evidence', body: {query: {match_all: {}}}});
  }
};
