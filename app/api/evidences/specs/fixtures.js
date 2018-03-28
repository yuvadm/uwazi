/* eslint-disable max-len */
import db from 'api/utils/testing_db';

const evidenceId = db.id();
const entityID = db.id();
const entityID2 = db.id();
const templateId = db.id();
const templateId2 = db.id();
const propertyID1 = db.id();
const propertyID2 = db.id();
const dictionary1 = db.id();
const dictionary2 = db.id();
const value1 = 'value1';
const value2 = 'value-2';
const value3 = 'value3';
const value4 = 'value4';

export default {
  entities: [
    {_id: entityID, sharedId: 'shared', template: templateId, language: 'en', evidencesAnalyzed: false, metadata: {}, title: 'Suggestions doc', fullText: 'this[[1]] is[[1]] a[[14]] test[[66]]'},
    {_id: db.id(), sharedId: 'shared3', template: templateId, language: 'en', metadata: {}, title: 'Suggestions doc 2', fullText: 'this[[1]] is[[1]] another[[14]] test[[66]]'},
    {_id: entityID2, sharedId: 'shared2', template: templateId2, title: 'doc2', language: 'en'}
  ],
  evidences: [
    {_id: evidenceId, probability: 0.55, value: value1, property: propertyID1, isEvidence: true, evidence: {text: 'evidence1'}},
    {_id: db.id(), probability: 0.59, value: value1, property: propertyID1},
    {_id: db.id(), probability: 0.81, value: value1, property: propertyID1, isEvidence: false, evidence: {text: 'evidence1.1'}},
    {_id: db.id(), probability: 0.87, value: value2, property: propertyID1, isEvidence: true},
    {_id: db.id(), probability: 0.90, value: value3, isEvidence: true},
    {_id: db.id(), probability: 0.91, value: value2, property: propertyID1},
    {_id: db.id(), probability: 0.99, value: value3, property: propertyID1}
  ],
  templates: [
    {_id: templateId, name: 'template_test', properties: [
      {type: 'text', name: 'text', _id: db.id()},
      {type: 'multiselect', name: 'multiselect', _id: propertyID1, content: dictionary2}
    ]},
    {_id: templateId2, name: 'template_test2', properties: [
      {type: 'text', name: 'text', _id: db.id()},
      {type: 'multiselect', name: 'multiselect', _id: propertyID2, content: dictionary1}
    ]}
  ],
  dictionaries: [
    {_id: dictionary1, name: 'dictionaty1', values: [
      {id: value1, label: 'dict1', _id: db.id()},
      {id: value2, label: 'dict2', _id: db.id()}
    ]},
    {_id: dictionary2, name: 'dictionary2', values: [
      {id: value3, label: 'dict3', _id: db.id()},
      {id: value4, label: 'dict4', _id: db.id()}
    ]}
  ]
};

export {
  evidenceId,
  value1,
  value2,
  value3,
  value4,
  propertyID1,
  propertyID2,
  entityID,
  entityID2
};
