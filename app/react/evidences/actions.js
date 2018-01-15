import {actions} from 'app/BasicReducer';
import evidencesAPI from './evidencesAPI';

export function setSuggestions(suggestions) {
  return function (dispatch) {
    return dispatch(actions.set('evidences/suggestions', suggestions));
  };
}

export function setEvidences(evidences) {
  return actions.set('evidences/evidences', evidences);
}

export function unsetSuggestions() {
  return function (dispatch) {
    return dispatch(actions.unset('evidences/suggestions'));
  };
}

export function getSuggestions(docId) {
  return function (dispatch) {
    return evidencesAPI.getSuggestions(docId)
    .then((suggestions) => {
      dispatch(setSuggestions(suggestions));
    });
  };
}

export function getEvidences(docId) {
  return function (dispatch) {
    return evidencesAPI.get(docId)
    .then((evidences) => {
      dispatch(setEvidences(evidences));
    });
  };
}

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

export function removeSuggestion(suggestion) {
  return function (dispatch) {
    dispatch(actions.remove('evidences/suggestions', suggestion));
  };
}

export function saveEvidence(evidence) {
  return function (dispatch) {
    return evidencesAPI.save(evidence)
    .then((response) => {
      dispatch(actions.unset('evidences/evidence'));
      dispatch(actions.set('viewer/doc', response.entity));
      dispatch(actions.push('evidences/evidences', response.evidence));
    });
  };
}
