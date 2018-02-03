import Immutable from 'immutable';

import {selectors} from '..';

describe('thesauri selectors', () => {
  describe('getAllThesaurisLabels', () => {
    it('should return id -> property labels hashmap', () => {
      const state = {
        thesauris: Immutable.fromJS([
          {values: [{id: 'id1', label: 'name1'}, {id: 'id2', label: 'name2'}]},
          {values: [{id: 'id3', label: 'name3'}, {id: 'id4', label: 'name4'}]}
        ])
      };

      const propertyNames = selectors.getAllThesaurisLabels(state);

      expect(propertyNames).toEqual({
        id1: 'name1',
        id2: 'name2',
        id3: 'name3',
        id4: 'name4'
      });
    });
  });
});
