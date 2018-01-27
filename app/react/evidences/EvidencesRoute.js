import React from 'react';
import rison from 'rison';

import api from './evidencesAPI';
import RouteHandler from 'app/App/RouteHandler';
import SearchButton from 'app/Library/components/SearchButton';
import {actions} from 'app/BasicReducer';
import EvidencesSection from './components/EvidencesSection';

export default class Uploads extends RouteHandler {

  constructor(props, context) {
    super(props, context);
    this.superComponentWillReceiveProps = super.componentWillReceiveProps;
  }

  static renderTools() {
    return (
      <div className="searchBox">
        <SearchButton storeKey="uploads"/>
      </div>
    );
  }

  static requestState(params, _query = {}) {
    //const defaultSearch = prioritySortingCriteria.get({templates: globalResources.templates});
    let query = rison.decode(_query.q || '()');
    //query.order = query.order || defaultSearch.order;
    //query.sort = query.sort || defaultSearch.sort;
    //query.unpublished = true;

    return api.search(query)
    .then((allEvidences) => {
      //const filterState = libraryHelpers.URLQueryToState(query, globalResources.templates.toJS(), globalResources.thesauris.toJS());
      return {
        evidences: {
          allEvidences: allEvidences
        }
      };
    });
  }

  setReduxState(state) {
    //const dispatch = wrapDispatch(this.context.store.dispatch, 'uploads');
    //dispatch(setDocuments(state.uploads.documents));
    this.context.store.dispatch(actions.set('evidences/allEvidences', state.evidences.allEvidences));
  }

  //componentDidMount() {
    //const dispatch = wrapDispatch(this.context.store.dispatch, 'uploads');
    //dispatch(enterLibrary());
  //}

  //componentWillReceiveProps(nextProps) {
    //if (nextProps.location.query.q !== this.props.location.query.q) {
      //return this.superComponentWillReceiveProps(nextProps);
    //}
  //}

  render() {
    return <EvidencesSection />;
  }
}
