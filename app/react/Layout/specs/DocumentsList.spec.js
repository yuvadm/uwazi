import React from 'react';
import {shallow} from 'enzyme';
import Immutable from 'immutable';

import DocumentsList from 'app/Layout/DocumentsList';
import Doc from 'app/Library/components/Doc';
//import SortButtons from 'app/Library/components/SortButtons';
import DocumentsListSort from 'app/Layout/DocumentsListSort';

describe('DocumentsList', () => {
  let component;
  let instance;
  let props;
  let documents = Immutable.fromJS({rows: [{title: 'Document one', _id: '1'}, {title: 'Document two', _id: '2'}], totalRows: 2});

  beforeEach(() => {
    props = {
      documents: documents,
      search: {sort: 'sort'},
      storeKey: 'storeKey',
      filters: Immutable.fromJS({documentTypes: []}),
      onSnippetClick: jasmine.createSpy('onSnippetClick'),
      searchDocuments: () => {},
      deleteConnection: () => {}
    };
  });

  let render = () => {
    component = shallow(<DocumentsList {...props} />);
    instance = component.instance();
  };

  describe('List view', () => {
    it('should render List passed', () => {
      const List = () => false;
      props.List = List;
      render();

      let renderedList = component.find(List).at(0);

      expect(renderedList.props().storeKey).toEqual('storeKey');
    });
  });

  describe('Graph view', () => {
    beforeEach(() => {
      props.view = 'graph';
      props.GraphView = () => <div>GraphView</div>;
      render();
    });

    it('should not render Doc elements', () => {
      expect(component.find(Doc).length).toBe(0);
    });

    it('should render GraphView prop', () => {
      expect(component.find(props.GraphView).length).toBe(1);
      expect(component.find(props.GraphView).getElements()[0].type().props.children).toBe('GraphView');
    });
  });

  it('should render action buttons if passed as props', () => {
    render();
    expect(component.find('.search-list-actions').length).toBe(0);

    let ActionButtons = () => <div>action buttons</div>;
    props.ActionButtons = ActionButtons;

    render();
    expect(component.find('.search-list-actions').length).toBe(1);
    expect(component.find('.search-list-actions').childAt(0).getElements()[0].type().props.children).toBe('action buttons');
  });

  describe('sorting', () => {
    it('Should render a default sorting section', () => {
      render();
      expect(component.find(DocumentsListSort).props().label).toBe('sorted by');
      expect(component.find(DocumentsListSort).props().total).toBeDefined();
      expect(component.find(DocumentsListSort).props().storeKey).toBe('storeKey');
    });

    it('Should render sorting section passed', () => {
      const CustomSorting = () => <div/>;
      props.DocumentsListSort = CustomSorting;
      render();

      expect(component.find(CustomSorting).props().label).toBe('sorted by');
      expect(component.find(CustomSorting).props().total).toBeDefined();
      expect(component.find(CustomSorting).props().storeKey).toBe('storeKey');
    });
  });

  describe('List', () => {
    it('Should render a default sorting section', () => {
      render();
      expect(component.find(DocumentsListSort).props().label).toBe('sorted by');
      expect(component.find(DocumentsListSort).props().total).toBeDefined();
      expect(component.find(DocumentsListSort).props().storeKey).toBe('storeKey');
    });

    it('Should render sorting section passed', () => {
      const CustomSorting = () => <div/>;
      props.DocumentsListSort = CustomSorting;
      render();

      expect(component.find(CustomSorting).props().label).toBe('sorted by');
      expect(component.find(CustomSorting).props().total).toBeDefined();
      expect(component.find(CustomSorting).props().storeKey).toBe('storeKey');
    });
  });
});
