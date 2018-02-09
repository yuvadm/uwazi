import {combineReducers} from 'redux';
import {formReducer, modelReducer} from 'react-redux-form';

import createReducer, {createReducerNamespaced} from 'app/BasicReducer';

const defaultSearch = {};

const evidences = createReducerNamespaced('evidences/evidences', []);
const evidencesUI = createReducerNamespaced('evidences/UI', {});
const docEvidences = createReducerNamespaced('evidences/docEvidences', []);

export const evidencesActions = evidences.actions;
export const evidencesUIActions = evidencesUI.actions;
export const docEvidencesActions = docEvidences.actions;

export default combineReducers({
  docEvidences: docEvidences.reducer,
  evidences: evidences.reducer,
  evidencesUI: evidencesUI.reducer,

  evidence: createReducer('evidences/evidence', {}),

  search: modelReducer('evidences.search', defaultSearch),
  searchForm: formReducer('evidences.search', defaultSearch)
});
