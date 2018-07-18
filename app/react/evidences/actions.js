import {browserHistory} from 'react-router';
import {actions as formActions} from 'react-redux-form';
import Immutable from 'immutable';
import rison from 'rison';

import {actions} from 'app/BasicReducer';

import {evidencesActions, docEvidencesActions, evidencesUIActions} from './reducer';
import {getEvidencesFilters} from './selectors';
import evidencesAPI from './evidencesAPI';

docEvidencesActions.getSuggestions = (docId) => {
  return (dispatch) => {
    return evidencesAPI.getSuggestions({_id: docId})
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

evidencesActions.saveValidSuggestion = (evidence) => {
  return function (dispatch) {
    return evidencesActions.saveEvidence(evidence.set('isEvidence', true).toJS())(dispatch);
  };
};

evidencesActions.saveInvalidSuggestion = (evidence) => {
  return function (dispatch) {
    return evidencesActions.saveEvidence(evidence.set('isEvidence', false).toJS())(dispatch);
  };
};

evidencesActions.saveEvidence = (evidence) => {
  return function (dispatch) {
    return evidencesAPI.save(evidence)
    .then((response) => dispatch(evidencesActions.update(response.evidence)));
  };
};

evidencesActions.getSuggestions = (property, value) => {
  return (dispatch, getState) => {
    return evidencesAPI.getSuggestions({property, value})
    .then((suggestions) => {
      const currentFilters = getEvidencesFilters(getState());
      return evidencesAPI.search(currentFilters);
    })
    .then((evidences) => {
      dispatch(evidencesActions.set(evidences.rows));
      dispatch(evidencesActions.setTotalRows(evidences.totalRows));
    });
  };
};

evidencesActions.oneByOneSuggestions = (property, value) => {
  return async (dispatch, getState) => {
    let thereIsMore = true;

    while (thereIsMore) {
      await evidencesAPI.getSuggestions({property, value, limit: 1});
      const currentFilters = getEvidencesFilters(getState());
      const evidences = await evidencesAPI.search(currentFilters);
      dispatch(evidencesActions.set(evidences.rows));
      dispatch(evidencesActions.setTotalRows(evidences.totalRows));
    }
  };
};

evidencesActions.setTotalRows = (totalRows) => evidencesUIActions.set({totalRows});

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

    if (newFilters.get('filters')) {
      newFilters = newFilters.set('filters', newFilters.get('filters').reduce((filters, filter, key) => {
      if (!filter.get('values').size) {
        return filters;
      }
      return filters.set(key, filter);
    }, Immutable.Map()));
    }

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

evidencesActions.resetDocEvidencesFlags = () => {
  return () => {
    return evidencesAPI.resetDocEvidencesFlags();
  };
};

evidencesActions.deleteSuggestions = () => {
  return dispatch => {
    return evidencesAPI.deleteSuggestions()
    .then(() => {
      dispatch(resetEvidencesFilters());
    });
  };
};

export function retrainModel(property, value) {
  return () => {
    return evidencesAPI.retrainModel(property, value);
  };
}

export function loadMoreEvidences(limit) {
  return function (dispatch) {
    dispatch(searchEvidences(null, limit));
  };
}
