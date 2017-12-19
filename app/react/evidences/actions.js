import {actions} from 'app/BasicReducer';
import evidencesAPI from './evidencesAPI';

export function setEvidence(evidence) {
  return function (dispatch) {
    return dispatch(actions.set('evidences/evidence', evidence));
  };
}

export function unsetEvidence() {
  return function (dispatch) {
    return dispatch(actions.unset('evidences/evidence'));
  };
}

export function saveEvidence(evidence) {
  return function (dispatch) {
    return evidencesAPI.save(evidence)
    .then((savedDoc) => {
      dispatch(actions.unset('evidences/evidence'));
      dispatch(actions.set('viewer/doc', savedDoc));
    });
  };
}
