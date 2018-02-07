import Immutable from 'immutable';

import api from 'app/utils/api';

export default {
  get(docId) {
    return api.get('evidences', {document: docId}).then(response => response.json);
  },

  search(data) {
    let filters = Immutable.fromJS(data);
    filters = filters.set('filters', filters.get('filters').reduce((newFilters, filter, key) => {
      return newFilters.set(key.replace('_', ''), filter);
    }, Immutable.Map()));
    return api.get('evidences/search', filters.toJS()).then(response => response.json);

  },

  getSuggestions(id) {
    return api.get('evidences/suggestions', {_id: id}).then(response => response.json);
  },

  save(evidence) {
    return api.post('evidences', evidence).then(response => response.json);
  },

  delete(evidence) {
    return api.delete('evidences', {_id: evidence._id}).then((response) => response.json);
  }
};
