import {browserHistory} from 'react-router';
import Immutable from 'immutable';
import thunk from 'redux-thunk';

import configureMockStore from 'redux-mock-store';

import * as actions from '../actions.js';
import evidencesAPI from '../evidencesAPI';
import {actions as baseReducerActions} from 'app/BasicReducer';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('evidences actions', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
  });

  describe('setSuggestions', () => {
    it('should set the suggestions', () => {
      const expectedActions = [{type: 'evidences/suggestions/SET', value: 'suggestions'}];

      actions.setSuggestions('suggestions')(store.dispatch);
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('unsetSuggestions', () => {
    it('should unset the suggestions', () => {
      const expectedActions = [{type: 'evidences/suggestions/UNSET'}];

      actions.unsetSuggestions()(store.dispatch);
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('getSuggestions', () => {
    it('should request suggestions and set them on the store', (done) => {
      spyOn(evidencesAPI, 'getSuggestions').and.returnValue(Promise.resolve('suggestionsResponse'));
      const expectedActions = [{type: 'evidences/suggestions/SET', value: 'suggestionsResponse'}];

      actions.getSuggestions('docId')(store.dispatch)
      .then(() => {
        expect(evidencesAPI.getSuggestions).toHaveBeenCalledWith('docId');
        expect(store.getActions()).toEqual(expectedActions);
        done();
      });
    });
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

  describe('acceptSuggestion', () => {
    it('should set isEvidence to true and save it', (done) => {
      const apiResponse = {entity: 'savedDoc', evidence: 'savedEvidence'};
      spyOn(evidencesAPI, 'save').and.returnValue(Promise.resolve(apiResponse));

      const evidence = Immutable.fromJS({test: 'test'});
      const expectedActions = [
        baseReducerActions.update('evidences/evidences', apiResponse.evidence)
      ];

      actions.acceptSuggestion(evidence)(store.dispatch)
      .then(() => {
        expect(evidencesAPI.save).toHaveBeenCalledWith({test: 'test', isEvidence: true});
        expect(store.getActions()).toEqual(expectedActions);
        done();
      });
    });
  });

  describe('rejectSuggestion', () => {
    it('should set isEvidence to false and save it', (done) => {
      const apiResponse = {entity: 'savedDoc', evidence: 'savedEvidence'};
      spyOn(evidencesAPI, 'save').and.returnValue(Promise.resolve(apiResponse));

      const evidence = Immutable.fromJS({test: 'test'});
      const expectedActions = [
        baseReducerActions.update('evidences/evidences', apiResponse.evidence)
      ];

      actions.rejectSuggestion(evidence)(store.dispatch)
      .then(() => {
        expect(evidencesAPI.save).toHaveBeenCalledWith({test: 'test', isEvidence: false});
        expect(store.getActions()).toEqual(expectedActions);
        done();
      });
    });
  });

  describe('saveEvidence', () => {
    it('should save the evidence', (done) => {
      spyOn(evidencesAPI, 'save').and.returnValue(Promise.resolve({entity: 'savedDoc', evidence: 'savedEvidence'}));
      const expectedActions = [
        {type: 'evidences/evidence/UNSET'},
        {type: 'viewer/doc/SET', value: 'savedDoc'},
        {type: 'evidences/evidences/PUSH', value: 'savedEvidence'}
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

  describe('get', () => {
    it('should get evidences for the doc', (done) => {
      spyOn(evidencesAPI, 'get').and.returnValue(Promise.resolve('evidences'));
      const expectedActions = [
        {type: 'evidences/evidences/SET', value: 'evidences'}
      ];
      const docId = 'docId';

      actions.getEvidences(docId)(store.dispatch)
      .then(() => {
        expect(evidencesAPI.get).toHaveBeenCalledWith(docId);
        expect(store.getActions()).toEqual(expectedActions);
        done();
      });
    });
  });

  describe('searchEvidences', () => {
    it('should change the url with the new params', () => {
      const limit = 'limit';
      spyOn(browserHistory, 'push');
      store.dispatch(actions.searchEvidences({filters: {value: {values: ['filter']}}}, limit));
      expect(browserHistory.push).toHaveBeenCalledWith('/evidences/?q=(filters:(value:(values:!(filter))),limit:limit)');
    });

    it('should use current filters when filters passed are null', () => {
      store = mockStore({evidences: {search: {filters: {value: {values: ['filter']}}}}});

      const limit = 'limit';
      spyOn(browserHistory, 'push');
      store.dispatch(actions.searchEvidences(null, limit));

      expect(browserHistory.push).toHaveBeenCalledWith('/evidences/?q=(filters:(value:(values:!(filter))),limit:limit)');
    });

    it('should not add empty filters', () => {
      const limit = 'limit';
      spyOn(browserHistory, 'push');
      store.dispatch(actions.searchEvidences({filters: {filter1: {values: []}, filter2: {values: []}}}, limit));
      expect(browserHistory.push).toHaveBeenCalledWith('/evidences/?q=(filters:(),limit:limit)');
    });
  });

  describe('resetEvidencesFilters', () => {
    it('should reset filters form and searchEvidences with empty filter object', () => {
      spyOn(evidencesAPI, 'save').and.returnValue(Promise.resolve({entity: 'savedDoc', evidence: 'savedEvidence'}));
      spyOn(browserHistory, 'push');

      const expectedActions = [ {type: 'rrf/reset', model: 'evidences.search'} ];

      store.dispatch(actions.resetEvidencesFilters());
      expect(store.getActions()).toEqual(expectedActions);
      expect(browserHistory.push).toHaveBeenCalledWith('/evidences/?q=(filters:())');
    });
  });
});
