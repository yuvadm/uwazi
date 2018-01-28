import {createSelector} from 'reselect';

const evidencesState = (state) => state.evidences;

const getEvidences = createSelector(
  state => evidencesState(state).allEvidences,
  evidences => evidences
);

const getEvidencesFilters = createSelector(
  state => evidencesState(state).search,
  evidencesFilters => evidencesFilters
);

export {
  getEvidences,
  getEvidencesFilters
};
