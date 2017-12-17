import {combineReducers} from 'redux';
import createReducer from 'app/BasicReducer';

export default combineReducers({
  evidence: createReducer('evidences/evidence', {})
});
