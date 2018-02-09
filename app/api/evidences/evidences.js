import model from './evidencesModel.js';
import entities from '../entities';
import templates from '../templates';
import thesauris from '../thesauris/thesauris';
import MLAPI from './MLAPI';
import search from './searchEvidences';

export default {
  save(evidence, user, language) {
    evidence.language = language;
    return model.save(evidence)
    .then((updatedEvidence) => {
      return Promise.all([
        updatedEvidence,
        entities.getById(evidence.document, language),
        search.index(updatedEvidence)
      ]);
    })
    .then(([updatedEvidence, entity]) => {
      return Promise.all([
        updatedEvidence,
        entity,
        templates.getById(entity.template)
      ]);
    })
    .then(([updatedEvidence, entity, template]) => {
      const propertyName = template.properties.find((p) => p._id.toString() === evidence.property.toString()).name;
      if (!entity.metadata[propertyName]) {
        entity.metadata[propertyName] = [];
      }
      if (!entity.metadata[propertyName].includes(evidence.value)) {
        entity.metadata[propertyName].push(evidence.value);
      }
      return entities.save(entity, {user, language})
      .then((updatedEntity) => {
        return {
          entity: updatedEntity,
          evidence: updatedEvidence
        };
      });
    });
  },

  get(query, select, pagination) {
    return model.get(query, select, pagination);
  },

  getSuggestions(docId, language) {
    return entities.get({sharedId: docId, language}, '+fullText')
    .then(([entity]) => {
      return Promise.all([
        entity,
        templates.getById(entity.template)
      ]);
    })
    .then(([entity, template]) => {
      const multiselects = template.properties.filter(p => p.type === 'multiselect');

      return Promise.all([
        entity,
        template,
        Promise.all(multiselects.map((multiselect) => thesauris.get(multiselect.content, 'en').then((t) => t[0])))
      ]);
    })
    .then(([entity, template, dictionaries]) => {
      const multiselects = template.properties.filter(p => p.type === 'multiselect');
      let properties = [];
      multiselects.forEach((property) => {
        dictionaries.find((d) => d._id.toString() === property.content.toString()).values.forEach((value) => {
          properties.push({document: docId, language: language, property: property._id.toString(), value: value.id});
        });
      });
      return MLAPI.getSuggestions({
        doc: {
          title: entity.title,
          text: entity.fullText.replace(/\[\[[0-9]*\]\]/g, '')
        },
        properties
      });
    })
    .then((evidences) => {
      return model.save(evidences.map((evidence) => {
        evidence.evidence = {text: evidence.evidence};
        evidence.language = language;
        return evidence;
      }));
    })
    .then((evidences) => evidences.length ? search.bulkIndex(evidences).then(() => evidences) : evidences);
  },

  getById(_id) {
    return model.get({_id}).then(([evidence]) => evidence);
  },

  delete(_id) {
    return model.delete({_id})
    .then(() => search.delete(_id));
  }
};
