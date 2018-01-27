import {createSelector} from 'reselect';

const evidencesState = (state) => state.evidences;

const getEvidences = createSelector(
  state => evidencesState(state).allEvidences,
  evidences => evidences
);

export {
  getEvidences
};
