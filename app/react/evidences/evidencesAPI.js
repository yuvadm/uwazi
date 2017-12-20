import api from 'app/utils/api';

export default {
  get(id) {
    return api.get('evidences', {_id: id}).then(response => response.json.rows);
  },

  getSuggestions(id) {
    return api.get('evidences/suggestions', {_id: id}).then(response => response.json.rows);
  },

  save(evidence) {
    return api.post('evidences', evidence).then(response => response.json);
  },

  delete(evidence) {
    return api.delete('evidences', {_id: evidence._id}).then((response) => response.json);
  }
};
