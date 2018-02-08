/* eslint-disable max-len */
import db from 'api/utils/testing_db';

const evidenceId = db.id();
const entityID = db.id();
const templateId = db.id();
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
    {_id: entityID, sharedId: 'shared', template: templateId, language: 'en', metadata: {}, title: 'Suggestions doc', fullText: 'this[[1]] is[[1]] a[[14]] test[[66]]'}
  ],
  evidences: [
    {_id: evidenceId, value: value1, property: propertyID1, isEvidence: true},
    {_id: db.id(), value: value1, property: propertyID1, isEvidence: false},
    {_id: db.id(), value: value2, property: propertyID1, isEvidence: true},
    {_id: db.id(), value: value3, isEvidence: true}
  ],
  templates: [
    {_id: templateId, name: 'template_test', properties: [
      {type: 'text', name: 'text', _id: db.id()},
      {type: 'multiselect', name: 'multiselect', _id: propertyID1, content: dictionary2}
    ]},
    {_id: db.id(), name: 'template_test2', properties: [
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
  entityID
};
