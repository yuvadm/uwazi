/* eslint-disable max-len */
import db from 'api/utils/testing_db';

const templateId = db.id();
const entityID = db.id();
const propertyID = db.id();
const propertyID2 = db.id();

export default {
  entities: [
    {_id: entityID, sharedId: 'shared', type: 'entity', template: templateId, language: 'en', title: 'Batman finishes', published: true, metadata: {property1: 'value1'}}
  ],
  settings: [
    {_id: db.id(), languages: [{key: 'es'}, {key: 'pt'}, {key: 'en'}]}
  ],
  //evidences: [
    //{_id: db.id(), property: propertyID, entity: entityID}
  //],
  templates: [
    {_id: templateId, name: 'template_test', properties: [
      {type: 'text', name: 'text', _id: db.id()},
      {type: 'select', name: 'select', _id: db.id()},
      {type: 'multiselect', name: 'multiselect', _id: propertyID},
      {type: 'multiselect2', name: 'multiselect2', _id: propertyID2}
    ]}
  ]
};

export {
  entityID,
  propertyID,
  propertyID2
};
