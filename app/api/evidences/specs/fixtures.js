/* eslint-disable max-len */
import db from 'api/utils/testing_db';

const templateId = db.id();
const entityID = db.id();
const entityForSuggestions = db.id();
const propertyID = db.id();
const propertyID2 = db.id();

const dictionary1Id = db.id();
const dictionary2Id = db.id();

export default {
  entities: [
    {_id: entityID, sharedId: 'shared', type: 'entity', template: templateId, language: 'en', title: 'Batman finishes', published: true, metadata: {property1: 'value1'}},
    {_id: entityForSuggestions, sharedId: 'shared1', type: 'document', template: templateId, title: 'Suggestions doc', fullText: 'this[[1]] is[[2]] a[[13]] test[[234]]', metadata: {}}
  ],
  settings: [
    {_id: db.id(), languages: [{key: 'es'}, {key: 'pt'}, {key: 'en'}]}
  ],
  dictionaries: [
    {_id: dictionary1Id, name: 'dictionary1', values: [{id: '1', label: 'dict1value1'}, {id: '2', label: 'dict1value2'}]},
    {_id: dictionary2Id, name: 'dictionary2', values: [{id: '3', label: 'dict2value1'}, {id: '4', label: 'dict2value2'}]}
  ],
  templates: [
    {_id: templateId, name: 'template_test', properties: [
      {type: 'text', name: 'text', _id: db.id()},
      {type: 'select', name: 'select', _id: db.id()},
      {type: 'multiselect', name: 'multiselect', _id: propertyID, content: dictionary1Id},
      {type: 'multiselect', name: 'multiselect2', _id: propertyID2, content: dictionary2Id}
    ]}
  ]
};

export {
  entityID,
  entityForSuggestions,
  propertyID,
  propertyID2
};
