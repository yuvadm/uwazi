import {index as elasticIndex} from 'api/config/elasticIndexes';

import MLAPI from './MLAPI';
import searchEntities from '../search/search';
import elastic from '../search/elastic';
import entities from '../entities';
import entitiesModel from '../entities/entitiesModel';
import model from './evidencesModel.js';
import search from './searchEvidences';
import templates from '../templates';
import thesauris from '../thesauris/thesauris';

export default {
  save(evidence, user, language) {
    evidence.language = language;
    return model.save(evidence)
    .then((updatedEvidence) => {
      return Promise.all([
        entities.getById(evidence.document, language),
        search.index(updatedEvidence)
      ]);
    })
    .then(([entity, indexedEvidences]) => {
      return Promise.all([
        indexedEvidences,
        entity,
        templates.getById(entity.template)
      ]);
    })
    .then(([indexedEvidences, entity, template]) => {
      const propertyName = template.properties.find((p) => p._id.toString() === evidence.property.toString()).name;
      if (!entity.metadata[propertyName]) {
        entity.metadata[propertyName] = [];
      }
      if (evidence.isEvidence && !entity.metadata[propertyName].includes(evidence.value)) {
        entity.metadata[propertyName].push(evidence.value);
      }
      return entities.save(entity, {user, language})
      .then((updatedEntity) => {
        return {
          entity: updatedEntity,
          evidence: indexedEvidences
        };
      });
    });
  },

  get(query, select, pagination) {
    return model.get(query, select, pagination);
  },

  resetDocEvidencesFlags() {
    return entitiesModel.db.updateMany({$set: {evidencesAnalyzed: false}})
    .then(() => searchEntities.indexEntities({}));
  },

  deleteSuggestions() {
    return model.delete({isEvidence: {$exists: false}})
    .then(() => {
      return elastic.deleteByQuery({index: elasticIndex, type: 'evidence', body: {query: {bool: {must_not: {exists: {field: 'isEvidence'}}}}}});
    });
  },

  getSuggestionsForOneValue(property, value, language, limit = 3) {
    return templates.get({'properties._id': property})
    .then(([template]) => {
      return entities.get({type: 'document', template: template._id, $or: [{evidencesAnalyzed: {$exists: false}}, {evidencesAnalyzed: false}]}, '+fullText', {limit: Number(limit)})
      .then((docs) => {
        if (!docs.length) {
          return entitiesModel.db.updateMany({}, {$set: {evidencesAnalyzed: false}})
          .then(() => entities.get({
            template: template._id,
            $or: [{evidencesAnalyzed: {$exists: false}}, {evidencesAnalyzed: false}]
          }, '+fullText', {limit}));
        }
        return docs;
      });
    })
    .then((documents) => {
      return Promise.all([
        documents,
        MLAPI.getSuggestionsForOneValue({
          property,
          value,
          docs: documents.map((d) => ({_id: d.sharedId, text: d.fullText.replace(/\[\[[0-9]*\]\]/g, '')}))
        })
      ]);
    })
    .then(([documents, evidences]) => {
      return Promise.all([
        model.save(evidences.map((evidence) => {
          evidence.evidence = {text: evidence.evidence};
          evidence.language = language;
          return evidence;
        })),
        entities.saveMultiple(documents.map((d) => ({_id: d._id, evidencesAnalyzed: true})), '')
      ]);
    })
    .then(([evidences]) => evidences.length ? search.bulkIndex(evidences).then(indexedEvidences => indexedEvidences) : []);
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

  reindexEvidencesByDocument(docSharedId, language = 'en') {
    return this.get({document: docSharedId, language})
    .then((docEvidences) => {
      return search.bulkIndex(docEvidences);
    });
  },

  retrainModel(property, value) {
    return model.get({property, value, isEvidence: {$exists: true}})
    .then((evidences) => {
      return MLAPI.retrainModel({property, value, evidences: evidences.map((e) => {
        e.sentence = e.evidence.text;
        e.label = e.isEvidence;
        return e;
      })});
    });
  },

  getById(_id) {
    return model.get({_id}).then(([evidence]) => evidence);
  },

  delete(_id) {
    return model.delete({_id})
    .then(() => search.delete(_id));
  }
};
