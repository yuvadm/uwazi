import Immutable from 'immutable';

import {selectors} from '..';

describe('Evidences selectors', () => {
  describe('getEvidences', () => {
    it('should return evidences with added property and value labels', () => {
      const state = {
        templates: Immutable.fromJS([
          {properties: [{_id: 'id1', label: 'property1'}, {_id: 'id2', label: 'property2'}]},
          {properties: [{_id: 'id3', label: 'property3'}, {_id: 'id4', label: 'property4'}]}
        ]),
        thesauris: Immutable.fromJS([
          {values: [{id: 'id1', label: 'value1'}, {id: 'id2', label: 'value2'}]},
          {values: [{id: 'id3', label: 'value3'}, {id: 'id4', label: 'value4'}]}
        ]),
        evidences: {
          allEvidences: Immutable.fromJS({
            rows: [
              {property: 'id3', value: 'id2'},
              {property: 'id1', value: 'id4'}
            ]
          })
        }
      };

      const evidences = selectors.getEvidences(state);

      expect(evidences.toJS()).toEqual({
        rows: [
          {property: 'id3', value: 'id2', propertyLabel: 'property3', valueLabel: 'value2'},
          {property: 'id1', value: 'id4', propertyLabel: 'property1', valueLabel: 'value4'}
        ]
      });
    });
  });

  describe('getFilters', () => {
    it('should return all filter posibilities based on templates and thesauris', () => {
      const state = {
        templates: Immutable.fromJS([
          {properties: [{_id: 'property1', label: 'propertyLabel1', content: 'thesauri1'}, {_id: 'property2', label: 'propertyLabel2'}]},
          {properties: [
            {_id: 'property3', label: 'propertyLabel3', content: 'thesauri2'},
            {_id: 'property4', label: 'propertyLabel4', content: 'thesauri1'}
          ]}
        ]),
        thesauris: Immutable.fromJS([
          {_id: 'thesauri1', values: [{id: 'value1', label: 'valueLabel1'}, {id: 'value2', label: 'valueLabel2'}]},
          {_id: 'thesauri2', values: [{id: 'value3', label: 'valueLabel3'}, {id: 'value4', label: 'valueLabel4'}]}
        ])
      };

      const filters = selectors.getFilters(state);

      expect(filters.toJS()).toEqual([
        {label: 'Used as:', values: [{value: true, label: 'True evidence'}, {value: false, label: 'False evidence'}]},
        {label: 'propertyLabel1', values: [{value: 'value1', label: 'valueLabel1'}, {value: 'value2', label: 'valueLabel2'}]},
        {label: 'propertyLabel3', values: [{value: 'value3', label: 'valueLabel3'}, {value: 'value4', label: 'valueLabel4'}]},
        {label: 'propertyLabel4', values: [{value: 'value1', label: 'valueLabel1'}, {value: 'value2', label: 'valueLabel2'}]}
      ]);
    });
  });
});