import {fromJS as Immutable} from 'immutable';
import React from 'react';
import rison from 'rison';

import {shallow} from 'enzyme';
import RouteHandler from 'app/App/RouteHandler';

import {evidencesActions} from '../actions';
import EvidencesRoute from '../EvidencesRoute';
import EvidencesSection from '../components/EvidencesSection';
import evidencesAPI from '../evidencesAPI';

describe('EvidencesRoute', () => {
  let evidences = {rows: [{_id: 'evidence1'}, {_id: 'evidence2'}], totalRows: 5};
  let component;
  let instance;
  let context;
  let props = {location: {query: {q: '(a:1)'}}};
  let templates = [
    {name: 'Decision', _id: 'abc1', properties: [{name: 'p', filter: true, type: 'text', prioritySorting: true}]},
    {name: 'Ruling', _id: 'abc2', properties: []}
  ];
  let globalResources = {templates: Immutable(templates), thesauris: Immutable([])};

  beforeEach(() => {
    RouteHandler.renderedFromServer = true;
    context = {store: {dispatch: jasmine.createSpy('dispatch')}};
    component = shallow(<EvidencesRoute {...props}/>, {context});
    instance = component.instance();

    spyOn(evidencesAPI, 'search').and.returnValue(Promise.resolve(evidences));
  });

  it('should render the EvidencesSection', () => {
    expect(component.find(EvidencesSection).length).toBe(1);
  });

  describe('static requestState()', () => {
    it('should request evidences templates and thesauris', (done) => {
      const query = {q: rison.encode({filters: {something: 1}})};
      let params;

      const expectedSearch = {
        filters: {something: 1}
      };

      EvidencesRoute.requestState(params, query, globalResources)
      .then((state) => {
        expect(evidencesAPI.search).toHaveBeenCalledWith(expectedSearch);
        expect(state.evidences.evidences).toEqual(evidences.rows);
        expect(state.evidences.evidencesUI.totalRows).toEqual(evidences.totalRows);
        done();
      })
      .catch(done.fail);
    });
  });

  describe('setReduxState()', () => {
    it('should dispatch all setters', () => {
      instance.setReduxState({evidences: {evidences, evidencesUI: {totalRows: 5}}});
      expect(context.store.dispatch).toHaveBeenCalledWith(evidencesActions.set(evidences));
      expect(context.store.dispatch).toHaveBeenCalledWith(evidencesActions.setTotalRows(5));
    });
  });
});
