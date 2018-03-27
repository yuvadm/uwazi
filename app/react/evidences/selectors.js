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
      {label: 'Type:', _id: 'isEvidence', values: [
        {value: 'null', label: 'Suggestion'},
        {value: true, label: 'Positive'},
        {value: false, label: 'Negative'}
      ]},
      {label: 'Probability:', _id: 'probability', values: [
        {value: '0.5-0.6', label: '50-60'},
        {value: '0.6-0.7', label: '60-70'},
        {value: '0.7-0.8', label: '70-80'},
        {value: '0.8-0.9', label: '80-90'},
        {value: '0.9-1', label: '90-100'}
      ]}
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
