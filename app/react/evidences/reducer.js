import {combineReducers} from 'redux';
import {formReducer, modelReducer} from 'react-redux-form';

import createReducer from 'app/BasicReducer';

const defaultSearch = {};

export default combineReducers({
  evidence: createReducer('evidences/evidence', {}),
  suggestions: createReducer('evidences/suggestions', []),
  evidences: createReducer('evidences/evidences', []),
  allEvidences: createReducer('evidences/allEvidences', []),
  search: modelReducer('evidences.search', defaultSearch),
  searchForm: formReducer('evidences.search', defaultSearch)
});
