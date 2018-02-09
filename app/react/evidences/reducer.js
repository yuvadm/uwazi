import {combineReducers} from 'redux';
import {formReducer, modelReducer} from 'react-redux-form';

import createReducer from 'app/BasicReducer';

const defaultSearch = {};

export default combineReducers({
  evidence: createReducer('evidences/evidence', {}),
  //suggestions: createReducer('evidences/suggestions', []),
  docEvidences: createReducer('evidences/docEvidences', []),
  evidences: createReducer('evidences/evidences', []),
  search: modelReducer('evidences.search', defaultSearch),
  searchForm: formReducer('evidences.search', defaultSearch)
});
