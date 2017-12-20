import model from './evidencesModel.js';
import entities from '../entities';
import templates from '../templates';

export default {
  save(evidence, user, language) {
    return model.save(evidence)
    .then(() => {
      return entities.getById(evidence.entity);
    })
    .then((entity) => {
      return Promise.all([
        entity,
        templates.getById(entity.template)
      ]);
    })
    .then(([entity, template]) => {
      const propertyName = template.properties.find((p) => p._id.toString() === evidence.property.toString()).name;
      if (!entity.metadata[propertyName]) {
        entity.metadata[propertyName] = [];
      }
      entity.metadata[propertyName].push(evidence.value);
      return entities.save(entity, {user, language});
    });
  },

  get(query, select, pagination) {
    return model.get(query, select, pagination);
  },

  getSuggestions(docId) {
    return entities.getById(docId)
    .then((entity) => {
      return Promise.all([
        entity,
        templates.getById(entity.template)
      ]);
    })
    .then(([entity, template]) => {
      const multiselects = template.properties.filter(p => p.type === 'multiselect');
      return Promise.resolve({rows: [
        {entity: docId, property: multiselects[0]._id, value: 'test', evidence: {text: 'test evidence true'}},
        {entity: docId, property: multiselects[0]._id, value: 'test', evidence: {text: 'test evidence false'}},
        {entity: docId, property: multiselects[1]._id, value: 'test2', evidence: {text: 'test evidence2 true'}},
        {entity: docId, property: multiselects[1]._id, value: 'test2', evidence: {text: 'test evidence2 false'}}
      ]});
    });
  },

  getById(_id) {
    return model.get({_id}).then(([evidence]) => evidence);
  },

  delete(_id) {
    return model.delete({_id});
  }
};
