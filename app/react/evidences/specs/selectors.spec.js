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
});
