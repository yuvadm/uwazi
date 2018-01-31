import {createSelector} from 'reselect';
import * as templates from 'app/Templates';
import * as thesauris from 'app/Thesauris';

const evidencesState = (state) => state.evidences;

const getEvidences = createSelector(
  state => evidencesState(state).allEvidences,
  templates.selectors.getAllPropertyNames,
  thesauris.selectors.getAllThesaurisLabels,
  (evidences, propertyNames, thesauriLabels) => {
    return evidences.set('rows', evidences.get('rows').map((evidence) => {
      return evidence
      .set('propertyLabel', propertyNames[evidence.get('property')])
      .set('valueLabel', thesauriLabels[evidence.get('value')]);
    }));
  }
);

const getEvidencesFilters = createSelector(
  state => evidencesState(state).search,
  evidencesFilters => evidencesFilters
);

export {
  getEvidences,
  getEvidencesFilters
};
