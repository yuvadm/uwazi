/* eslint-disable max-len */
import db from 'api/utils/testing_db';

const evidenceId = db.id();
const value1 = 'value1';
const value2 = 'value2';
const value3 = 'value3';

export default {
  evidences: [
    {_id: evidenceId, value: value1},
    {_id: db.id(), value: value1},
    {_id: db.id(), value: value2},
    {_id: db.id(), value: value3}
  ]
};

export {
  evidenceId,
  value1,
  value2
};
