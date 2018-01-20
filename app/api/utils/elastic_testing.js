import search from 'api/search/search';
import evidences from 'api/evidences/evidences';
import searchEvidences from 'api/evidences/searchEvidences';
import elasticMapping from '../../../database/elastic_mapping';
import {index as elasticIndex} from 'api/config/elasticIndexes';
import elastic from 'api/search/elastic';

export default {
  reindex() {
    return elastic.indices.delete({index: elasticIndex})
    .then(() => {
      return elastic.indices.create({
        index: elasticIndex,
        body: elasticMapping
      });
    })
    .then(() => {
      return search.indexEntities({}, '+fullText');
    })
    .then(() => {
      return elastic.indices.refresh({index: elasticIndex});
    });
  },

  reindexEvidences() {
    return elastic.indices.delete({index: elasticIndex})
    .then(() => {
      return elastic.indices.create({
        index: elasticIndex,
        body: elasticMapping
      });
    })
    .then(() => evidences.get())
    .then((evidencesResult) => {
      return searchEvidences.bulkIndex(evidencesResult);
    })
    .then(() => {
      return elastic.indices.refresh({index: elasticIndex});
    });
  },

  refresh() {
    return elastic.indices.refresh({index: elasticIndex});
  }
};
