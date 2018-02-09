import {createSelector} from 'reselect';
import Immutable from 'immutable';

import {selectors as templateSelectors} from 'app/Templates';
import {selectors as thesaurisSelectors} from 'app/Thesauris';

const evidencesState = (state) => state.evidences;

const getEvidences = createSelector(
  (state, namespace = 'evidences') => evidencesState(state)[namespace],
  templateSelectors.getAllPropertyNames,
  thesaurisSelectors.getAllThesaurisLabels,
  (evidences, propertyNames, thesauriLabels) => {
    return evidences.map((evidence) => {
      return evidence
      .set('propertyLabel', propertyNames[evidence.get('property')])
      .set('valueLabel', thesauriLabels[evidence.get('value')]);
    });
  }
);

const docEvidences = {
  get: (state) => getEvidences(state, 'docEvidences')
};

const evidences = {
  get: (state) => getEvidences(state),
  count: (state) => evidencesState(state).evidences.size,
  totalRows: (state) => evidencesState(state).evidencesUI.get('totalRows')
};

const buildFilter = (property, thesauris) => {
  return Immutable.Map({
    label: property.get('label'),
    _id: property.get('_id'),
    values: thesauris.find((t) => t.get('_id') === property.get('content'))
    .get('values').map((value) => {
      return value.set('value', value.get('id')).delete('id');
    })
  });
};

const getFilters = createSelector(
  templateSelectors.get,
  thesaurisSelectors.get,
  (templates, thesauris) => {
    return Immutable.fromJS([
      {label: 'Used as:', _id: 'isEvidence', values: [{value: true, label: 'True evidence'}, {value: false, label: 'False evidence'}]}
    ])
    .concat(
      templates
      .reduce((properties, template) => properties.concat(template.get('properties')), Immutable.List())
      .filter(property => property.get('content'))
      .map(property => buildFilter(property, thesauris))
    );
  }
);

const getEvidencesFilters = createSelector(
  state => evidencesState(state).search,
  evidencesFilters => evidencesFilters
);

export {
  getEvidencesFilters,
  getFilters,
  docEvidences,
  evidences
};
