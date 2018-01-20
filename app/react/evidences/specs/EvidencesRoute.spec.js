import React from 'react';
import {shallow} from 'enzyme';
import rison from 'rison';

import EvidencesRoute from '../EvidencesRoute';
import EvidencesSection from '../components/EvidencesSection';
import evidencesAPI from '../evidencesAPI';

// import LibraryCharts from 'app/Charts/components/LibraryCharts';
// import ListChartToggleButtons from 'app/Charts/components/ListChartToggleButtons';
import RouteHandler from 'app/App/RouteHandler';
import * as actionTypes from 'app/Library/actions/actionTypes.js';
import {fromJS as Immutable} from 'immutable';


//import prioritySortingCriteria from 'app/utils/prioritySortingCriteria';

describe('EvidencesRoute', () => {
  let evidences = {rows: [{_id: 'evidence1'}, {_id: 'evidence2'}]};
  let aggregations = [{1: '23'}, {2: '123'}];
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
    //expect(component.find(DocumentsList).props().storeKey).toBe('uploads');
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
        expect(state.evidences.allEvidences).toEqual(evidences.rows);
        done();
      })
      .catch(done.fail);
    });
  });

  describe('setReduxState()', () => {
    it('should call setDocuments with the documents', () => {
      instance.setReduxState({evidences: {allEvidences: evidences}});
      expect(context.store.dispatch).toHaveBeenCalledWith({type: 'evidences/allEvidences/SET', value: evidences});
    });
  });

  //describe('componentWillReceiveProps()', () => {
    //beforeEach(() => {
      //instance.superComponentWillReceiveProps = jasmine.createSpy('superComponentWillReceiveProps');
    //});

    //it('should update if "q" has changed', () => {
      //const nextProps = {location: {query: {q: '(a:2)'}}};
      //instance.componentWillReceiveProps(nextProps);
      //expect(instance.superComponentWillReceiveProps).toHaveBeenCalledWith(nextProps);
    //});

    //it('should not update if "q" is the same', () => {
      //const nextProps = {location: {query: {q: '(a:1)'}}};
      //instance.componentWillReceiveProps(nextProps);
      //expect(instance.superComponentWillReceiveProps).not.toHaveBeenCalled();
    //});
  //});
});
