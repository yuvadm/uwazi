import Immutable from 'immutable';

import {selectors} from '..';

describe('templates selectors', () => {
  describe('getAllPropertyNames', () => {
    it('should return _id -> property names hashmap', () => {
      const state = {
        templates: Immutable.fromJS([
          {properties: [{_id: 'id1', label: 'name1'}, {_id: 'id2', label: 'name2'}]},
          {properties: [{_id: 'id3', label: 'name3'}, {_id: 'id4', label: 'name4'}]}
        ])
      };

      const propertyNames = selectors.getAllPropertyNames(state);

      expect(propertyNames).toEqual({
        id1: 'name1',
        id2: 'name2',
        id3: 'name3',
        id4: 'name4'
      });
    });
  });
});
