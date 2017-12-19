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

  getById(_id) {
    return model.get({_id}).then(([evidence]) => evidence);
  },

  delete(_id) {
    return model.delete({_id});
  }
};
