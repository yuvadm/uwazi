import { actions } from 'app/BasicReducer';
import { notify } from 'app/Notifications';
import api from 'app/utils/api';
import debounce from 'app/utils/debounce';

import * as types from './actionTypes';
import * as uiActions from './uiActions';

export function immidiateSearch(dispatch, searchTerm, connectionType) {
  dispatch(uiActions.searching());

  const query = { searchTerm, fields: ['title'] };

  return api.get('search', query)
  .then((response) => {
    let results = response.json.rows;
    if (connectionType === 'targetRanged') {
      results = results.filter(r => r.type !== 'entity');
    }
    dispatch(actions.set('connections/searchResults', results));
  });
}

const debouncedSearch = debounce(immidiateSearch, 400);

export function search(searchTerm, connectionType) {
  return (dispatch) => {
    dispatch(actions.set('connections/searchTerm', searchTerm));
    return debouncedSearch(dispatch, searchTerm, connectionType);
  };
}

export function startNewConnection(connectionType, sourceDocument) {
  return dispatch => immidiateSearch(dispatch, '', connectionType)
  .then(() => {
    dispatch(actions.set('connections/searchTerm', ''));
    dispatch(uiActions.openPanel(connectionType, sourceDocument));
  });
}

export function setRelationType(template) {
  return {
    type: types.SET_RELATION_TYPE,
    template
  };
}

export function setTargetDocument(id) {
  return {
    type: types.SET_TARGET_DOCUMENT,
    id
  };
}

export function saveConnection(connection, callback = () => {}) {
  return (dispatch, getState) => {
    dispatch({ type: types.CREATING_CONNECTION });
    if (connection.type !== 'basic') {
      connection.language = getState().locale;
    }

    delete connection.type;

    const sourceRelationship = { entity: connection.sourceDocument, template: null, range: connection.sourceRange };

    const targetRelationship = { entity: connection.targetDocument, template: connection.template };
    if (connection.targetRange && typeof connection.targetRange.start !== 'undefined') {
      targetRelationship.range = connection.targetRange;
    }

    const apiCall = {
      delete: [],
      save: [[sourceRelationship, targetRelationship]]
    };

    return api.post('relationships/bulk', apiCall)
    .then((response) => {
      dispatch({ type: types.CONNECTION_CREATED });
      callback(response.json);
      dispatch(notify('saved successfully !', 'success'));
    });
  };
}

export function selectRangedTarget(connection, onRangedConnect) {
  return (dispatch) => {
    dispatch({ type: types.CREATING_RANGED_CONNECTION });
    onRangedConnect(connection.targetDocument);
  };
}
