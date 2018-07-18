import {browserHistory} from 'react-router';
import Immutable from 'immutable';
import thunk from 'redux-thunk';

import configureMockStore from 'redux-mock-store';

import * as actions from '../actions.js';
import evidencesAPI from '../evidencesAPI';
import {actions as baseReducerActions} from 'app/BasicReducer';
import {evidencesActions, docEvidencesActions} from '../actions';
import {evidencesUIActions} from '../reducer';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('evidences actions', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
  });

  describe('docEvidencesActions', () => {
    describe('getSuggestions', () => {
      it('should request suggestions and reload the sugestions list', (done) => {
        spyOn(evidencesAPI, 'getSuggestions').and.returnValue(Promise.resolve('suggestionsResponse'));
        const expectedActions = [docEvidencesActions.concat('suggestionsResponse')];

        const getState = () => ({ });
        docEvidencesActions.getSuggestions('docId')(store.dispatch, getState)
        .then(() => {
          expect(evidencesAPI.getSuggestions).toHaveBeenCalledWith({_id: 'docId'});
          expect(store.getActions()).toEqual(expectedActions);
          done();
        });
      });
    });

    describe('resetDocEvidencesFlags', () => {
      it('should call api resetevidencesfilters and', (done) => {
        store = mockStore({evidences: {search: {}}});
        spyOn(evidencesAPI, 'resetDocEvidencesFlags').and.returnValue(Promise.resolve('response'));
        spyOn(browserHistory, 'push');
        evidencesActions.resetDocEvidencesFlags()(store.dispatch)
        .then(() => {
          expect(evidencesAPI.resetDocEvidencesFlags).toHaveBeenCalled();
          done();
        });
      });
    });

    describe('deleteSuggestions', () => {
      it('should call api delete suggestions and', (done) => {
        store = mockStore({evidences: {search: {}}});
        spyOn(evidencesAPI, 'deleteSuggestions').and.returnValue(Promise.resolve('response'));
        spyOn(browserHistory, 'push');
        evidencesActions.deleteSuggestions()(store.dispatch)
        .then(() => {
          expect(evidencesAPI.deleteSuggestions).toHaveBeenCalled();
          done();
        });
      });
    });

    describe('saveValidSuggestion', () => {
      it('should save the evidence with "isEvidence = true"', (done) => {
        spyOn(evidencesAPI, 'save').and.returnValue(Promise.resolve({entity: 'savedDoc', evidence: 'savedEvidence'}));
        const expectedActions = [
          {type: 'evidences/evidence/UNSET'},
          {type: 'viewer/doc/SET', value: 'savedDoc'},
          docEvidencesActions.update('savedEvidence')
        ];
        const evidence = Immutable.fromJS({test: 'test'});

        docEvidencesActions.saveValidSuggestion(evidence)(store.dispatch)
        .then(() => {
          expect(evidencesAPI.save).toHaveBeenCalledWith({test: 'test', isEvidence: true});
          expect(store.getActions()).toEqual(expectedActions);
          done();
        });
      });
    });


    describe('saveInvalidSuggestion', () => {
      it('should save the evidence with "isEvidence = true"', (done) => {
        spyOn(evidencesAPI, 'save').and.returnValue(Promise.resolve({entity: 'savedDoc', evidence: 'savedEvidence'}));
        const expectedActions = [
          {type: 'evidences/evidence/UNSET'},
          {type: 'viewer/doc/SET', value: 'savedDoc'},
          docEvidencesActions.update('savedEvidence')
        ];
        const evidence = Immutable.fromJS({test: 'test'});

        docEvidencesActions.saveInvalidSuggestion(evidence)(store.dispatch)
        .then(() => {
          expect(evidencesAPI.save).toHaveBeenCalledWith({test: 'test', isEvidence: false});
          expect(store.getActions()).toEqual(expectedActions);
          done();
        });
      });
    });
  });

  describe('evidencesActions', () => {
    describe('setTotalRows', () => {
      it('should set totalRows', () => {
        expect(evidencesActions.setTotalRows(5)).toEqual(evidencesUIActions.set({totalRows: 5}));
      });
    });

    describe('saveValidSuggestion', () => {
      it('should save the evidence with "isEvidence = true"', (done) => {
        spyOn(evidencesAPI, 'save').and.returnValue(Promise.resolve({entity: 'savedDoc', evidence: 'savedEvidence'}));
        const expectedActions = [evidencesActions.update('savedEvidence')];
        const evidence = Immutable.fromJS({test: 'test'});

        evidencesActions.saveValidSuggestion(evidence)(store.dispatch)
        .then(() => {
          expect(evidencesAPI.save).toHaveBeenCalledWith({test: 'test', isEvidence: true});
          expect(store.getActions()).toEqual(expectedActions);
          done();
        });
      });
    });

    describe('saveInvalidSuggestion', () => {
      it('should save the evidence with "isEvidence = true"', (done) => {
        spyOn(evidencesAPI, 'save').and.returnValue(Promise.resolve({entity: 'savedDoc', evidence: 'savedEvidence'}));
        const expectedActions = [evidencesActions.update('savedEvidence')];
        const evidence = Immutable.fromJS({test: 'test'});

        evidencesActions.saveInvalidSuggestion(evidence)(store.dispatch)
        .then(() => {
          expect(evidencesAPI.save).toHaveBeenCalledWith({test: 'test', isEvidence: false});
          expect(store.getActions()).toEqual(expectedActions);
          done();
        });
      });
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

  describe('get', () => {
    it('should get evidences for the doc', (done) => {
      spyOn(evidencesAPI, 'get').and.returnValue(Promise.resolve('evidences'));
      const expectedActions = [docEvidencesActions.set('evidences')];
      const docId = 'docId';

      docEvidencesActions.getEvidences(docId)(store.dispatch)
      .then(() => {
        expect(evidencesAPI.get).toHaveBeenCalledWith(docId);
        expect(store.getActions()).toEqual(expectedActions);
        done();
      });
    });
  });

  describe('searchEvidences', () => {
    it('should work with null filters', () => {
      store = mockStore({evidences: {search: {}}});
      const limit = 'limit';
      spyOn(browserHistory, 'push');
      store.dispatch(actions.searchEvidences(null, limit));
      expect(browserHistory.push).toHaveBeenCalledWith('/evidences/?q=(limit:limit)');
    });

    it('should change the url with the new params', () => {
      const limit = 'limit';
      spyOn(browserHistory, 'push');
      store.dispatch(actions.searchEvidences({filters: {value: {values: ['filter']}}}, limit));
      expect(browserHistory.push).toHaveBeenCalledWith('/evidences/?q=(filters:(value:(values:!(filter))),limit:limit)');
    });

    it('should change the url with the new params', () => {
      const limit = 'limit';
      spyOn(browserHistory, 'push');
      store.dispatch(actions.searchEvidences({filters: {value: {values: ['filter']}, value2: {values: ['filter2']}}}, limit));
      expect(browserHistory.push)
      .toHaveBeenCalledWith('/evidences/?q=(filters:(value:(values:!(filter)),value2:(values:!(filter2))),limit:limit)');
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

  describe('retrainModel', () => {
    it('should reset filters form and searchEvidences with empty filter object', () => {
      spyOn(evidencesAPI, 'retrainModel').and.returnValue(Promise.resolve('response'));

      const property = 'property';
      const value = 'value';
      store.dispatch(actions.retrainModel(property, value));
      expect(evidencesAPI.retrainModel).toHaveBeenCalledWith(property, value);
    });
  });
});
