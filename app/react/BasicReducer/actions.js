import {PUSH, REMOVE, SET, UNSET, UPDATE} from './actionsTypes';

export const actions = {
  update: (namespace, value) => ({
    type: `${namespace}/${UPDATE}`,
    value
  }),
  set: (namespace, value) => ({
    type: `${namespace}/${SET}`,
    value
  }),
  unset: (namespace) => ({
    type: `${namespace}/${UNSET}`
  }),
  push: (namespace, value) => ({
    type: `${namespace}/${PUSH}`,
    value
  }),
  remove: (namespace, value) => ({
    type: `${namespace}/${REMOVE}`,
    value
  })
};

export default (namespace) => {
  const namespacedActions = {};
  Object.keys(actions).forEach((actionName) => {
    namespacedActions[actionName] = (value) => actions[actionName](namespace, value);
  });
  return namespacedActions;
};
