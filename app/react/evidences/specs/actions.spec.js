import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import evidencesAPI from '../evidencesAPI';

import * as actions from '../actions.js';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('evidences actions', () => {
  let store;

  beforeEach(() => {
    spyOn(evidencesAPI, 'save').and.returnValue(Promise.resolve());
    store = mockStore({});
  });

  describe('add Evidence', () => {
    it('should set the evidence', () => {
      const expectedActions = [{type: 'evidences/evidence/SET', value: {text: 'evidence text'}}];

      actions.setEvidence({text: 'evidence text'})(store.dispatch);
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('cancel Evidence', () => {
    it('should unset the evidence', () => {
      const expectedActions = [{type: 'evidences/evidence/UNSET'}];

      actions.unsetEvidence()(store.dispatch);
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('saveEvidence', () => {
    it('should save the evidence', (done) => {
      const expectedActions = [
        {type: 'evidences/evidence/UNSET'}
      ];
      const evidence = {test: 'test'};

      actions.saveEvidence(evidence)(store.dispatch)
      .then(() => {
        expect(evidencesAPI.save).toHaveBeenCalledWith(evidence);
        expect(store.getActions()).toEqual(expectedActions);
        done();
      });
    });
  });
});
