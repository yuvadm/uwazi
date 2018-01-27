import {createSelector} from 'reselect';

const evidencesState = (state) => state.evidences;

const getEvidences = createSelector(
  (state) => evidencesState(state).allEvidences,
  evidences => evidences.get('rows')
);

const getEvidencesTotal = createSelector(
  (state) => evidencesState(state).allEvidences,
  evidences => evidences.get('totalRows')
);

export {
  getEvidences,
  getEvidencesTotal
};
