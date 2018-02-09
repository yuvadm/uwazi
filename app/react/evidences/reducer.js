import {combineReducers} from 'redux';
import {formReducer, modelReducer} from 'react-redux-form';

import createReducer, {createReducerNamespaced} from 'app/BasicReducer';

const defaultSearch = {};

const evidences = createReducerNamespaced('evidences/evidences', []);
const docEvidences = createReducerNamespaced('evidences/docEvidences', []);

export const evidencesActions = evidences.actions;
export const docEvidencesActions = docEvidences.actions;

export default combineReducers({
  evidence: createReducer('evidences/evidence', {}),
  docEvidences: docEvidences.reducer,
  evidences: evidences.reducer,

  search: modelReducer('evidences.search', defaultSearch),
  searchForm: formReducer('evidences.search', defaultSearch)
});
