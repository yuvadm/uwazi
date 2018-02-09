import createReducer from './reducer';
import createNamespacedActions from './actions';

export default (namespace, value) => ({
  reducer: createReducer(namespace, value),
  actions: createNamespacedActions(namespace)
});
