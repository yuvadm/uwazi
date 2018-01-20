import {index as elasticIndex} from 'api/config/elasticIndexes';
import elastic from '../search/elastic';
//import queryBuilder from './documentQueryBuilder';
//import entities from '../entities';
//import model from '../entities/entitiesModel';
//import templatesModel from '../templates';
//import {comonProperties} from 'shared/comonProperties';
//import languages from 'shared/languagesList';
//import {detect as detectLanguage} from 'shared/languages';

export default {
  //search() {

  //},

  index(evidence) {
    const id = evidence._id;
    return elastic.index({index: elasticIndex, type: 'evidence', id, body: evidence});
  },

  bulkIndex(evidences) {
    const body = evidences.reduce((value, evidence) => {
      value.push({index: {_index: elasticIndex, _type: 'evidence', _id: evidence._id}});
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
      return res;
    });
  },

  delete(id) {
    return elastic.delete({index: elasticIndex, type: 'evidence', id: id.toString()});
  }
};
