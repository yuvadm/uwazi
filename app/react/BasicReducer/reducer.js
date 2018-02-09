import {fromJS as Immutable} from 'immutable';
import {PUSH, REMOVE, SET, UNSET, UPDATE, CONCAT} from './actionsTypes';

export default function createReducer(namespace, defaultValue) {
  return (currentState = defaultValue, action = {}) => {
    switch (action.type) {
    case `${namespace}/${SET}`:
      return Immutable(action.value);

    case `${namespace}/${UNSET}`:
      return Immutable(defaultValue);

    case `${namespace}/${PUSH}`:
      return currentState.push(Immutable(action.value));

    case `${namespace}/${CONCAT}`:
      return currentState.concat(Immutable(action.value));

    case `${namespace}/${REMOVE}`:
      return Immutable(currentState).filter((object) => {
        if (object.get('_id')) {
          return object.get('_id') !== action.value._id;
        }
        return !object.equals(action.value);
      });
    case `${namespace}/${UPDATE}`:
      const index = currentState.findIndex(o => o.get('_id') === action.value._id);
      if (index === -1) {
        return currentState.push(Immutable(action.value));
      }
      return currentState.set(index, Immutable(action.value));

    default:
      return Immutable(currentState);
    }
  };
}
