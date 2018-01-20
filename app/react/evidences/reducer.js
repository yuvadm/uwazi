import {combineReducers} from 'redux';
import createReducer from 'app/BasicReducer';

export default combineReducers({
  evidence: createReducer('evidences/evidence', {}),
  suggestions: createReducer('evidences/suggestions', []),
  evidences: createReducer('evidences/evidences', []),
  allEvidences: createReducer('evidences/allEvidences', [])
});
