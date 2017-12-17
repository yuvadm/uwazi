import model from './evidencesModel.js';

export default {
  save(evidence) {
    return model.save(evidence);
  },

  get(query, select, pagination) {
    return model.get(query, select, pagination);
  },

  getById(_id) {
    return model.get({_id}).then(([evidence]) => evidence);
  },

  delete(_id) {
    return model.delete({_id});
  }
};
