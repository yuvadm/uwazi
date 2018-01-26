import {createSelector} from 'reselect';

const getUser = createSelector(
  (state) => state.user,
  user => user
);

export {
  getUser
};
