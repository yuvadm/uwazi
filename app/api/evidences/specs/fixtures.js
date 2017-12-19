/* eslint-disable max-len */
import db from 'api/utils/testing_db';

const templateId = db.id();
const entityID = db.id();
const propertyID = db.id();

export default {
  entities: [
    {_id: entityID, sharedId: 'shared', type: 'entity', template: templateId, language: 'en', title: 'Batman finishes', published: true, metadata: {property1: 'value1'}}
  ],
  settings: [
    {_id: db.id(), languages: [{key: 'es'}, {key: 'pt'}, {key: 'en'}]}
  ],
  templates: [
    {_id: templateId, name: 'template_test', properties: [
      {type: 'text', name: 'text', _id: db.id()},
      {type: 'select', name: 'select', _id: db.id()},
      {type: 'multiselect', name: 'multiselect', _id: propertyID}
    ]}
  ]
};

export {
  entityID,
  propertyID
};
