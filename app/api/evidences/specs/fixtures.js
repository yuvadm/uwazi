/* eslint-disable max-len */
import db from 'api/utils/testing_db';

const evidenceId = db.id();
const entityID = db.id();
const templateId = db.id();
const propertyID = db.id();
const value1 = 'value1';
const value2 = 'value2';
const value3 = 'value3';

export default {
  entities: [
    {_id: entityID, sharedId: 'shared', template: templateId, language: 'en', metadata: {}}
  ],
  evidences: [
    {_id: evidenceId, value: value1},
    {_id: db.id(), value: value1},
    {_id: db.id(), value: value2},
    {_id: db.id(), value: value3}
  ],
  templates: [
    {_id: templateId, name: 'template_test', properties: [
      {type: 'text', name: 'text', _id: db.id()},
      {type: 'multiselect', name: 'multiselect', _id: propertyID}
    ]}
  ]
};

export {
  evidenceId,
  value1,
  value2,
  propertyID,
  entityID
};
