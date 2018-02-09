import {browserHistory} from 'react-router';
import {actions as formActions} from 'react-redux-form';
import Immutable from 'immutable';
import rison from 'rison';
import {actions} from 'app/BasicReducer';

import {getEvidencesFilters} from './selectors';
import evidencesAPI from './evidencesAPI';

import {evidencesActions, docEvidencesActions} from './reducer';


export function getSuggestions(docId) {
  return function (dispatch) {
    return evidencesAPI.getSuggestions(docId)
    .then((suggestions) => {
      dispatch(docEvidencesActions.concat(suggestions));
    });
  };
}

docEvidencesActions.getSuggestions = (docId) => {
  return (dispatch) => {
    return evidencesAPI.getSuggestions(docId)
    .then((suggestions) => {
      dispatch(docEvidencesActions.concat(suggestions));
    });
  };
};

docEvidencesActions.getEvidences = (docId) => {
  return (dispatch) => {
    return evidencesAPI.get(docId)
    .then((evidences) => {
      dispatch(docEvidencesActions.set(evidences));
    });
  };
};

docEvidencesActions.saveValidSuggestion = (evidence) => {
  return function (dispatch) {
    return docEvidencesActions.saveEvidence(evidence.set('isEvidence', true).toJS())(dispatch);
  };
};
docEvidencesActions.saveInvalidSuggestion = (evidence) => {
  return function (dispatch) {
    return docEvidencesActions.saveEvidence(evidence.set('isEvidence', false).toJS())(dispatch);
  };
};

docEvidencesActions.saveEvidence = (evidence) => {
  return function (dispatch) {
    return evidencesAPI.save(evidence)
    .then((response) => {
      dispatch(actions.unset('evidences/evidence'));
      dispatch(actions.set('viewer/doc', response.entity));
      dispatch(docEvidencesActions.update(response.evidence));
    });
  };
};

export {
  evidencesActions,
  docEvidencesActions
};
//
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
//

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

export function acceptSuggestion(evidence) {
  return function (dispatch) {
    return evidencesAPI.save(evidence.set('isEvidence', true).toJS())
    .then((response) => {
      dispatch(actions.update('evidences/evidences', response.evidence));
    });
  };
}

export function rejectSuggestion(evidence) {
  return function (dispatch) {
    return evidencesAPI.save(evidence.set('isEvidence', false).toJS())
    .then((response) => {
      dispatch(actions.update('evidences/evidences', response.evidence));
    });
  };
}

export function searchEvidences(query, limit) {
  return function (dispatch, getState) {
    let newFilters = Immutable.fromJS(query || getEvidencesFilters(getState()));

    newFilters = newFilters.set('filters', newFilters.get('filters').reduce((filters, filter, key) => {
      if (!filter.get('values').size) {
        return filters;
      }
      return Immutable.Map().set(key, filter);
    }, Immutable.Map()));

    newFilters = Object.assign({}, Object.assign({}, newFilters.toJS()), {limit});
    browserHistory.push(`/evidences/?q=${rison.encode(newFilters)}`);
  };
}

export function resetEvidencesFilters() {
  return (dispatch) => {
    dispatch(formActions.reset('evidences.search'));
    dispatch(searchEvidences({filters: {}}));
  };
}


export function loadMoreEvidences(limit) {
  return function (dispatch) {
    dispatch(searchEvidences(null, limit));
  };
}
