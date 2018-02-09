import React from 'react';
import rison from 'rison';

import api from './evidencesAPI';
import RouteHandler from 'app/App/RouteHandler';
import SearchButton from 'app/Library/components/SearchButton';
import {actions} from 'app/BasicReducer';
import {actions as formActions} from 'react-redux-form';
import EvidencesSection from './components/EvidencesSection';

export default class EvidencesRoute extends RouteHandler {

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
    let query = rison.decode(_query.q || '()');

    return api.search(query)
    .then((allEvidences) => {
      return {
        evidences: {
          evidences: allEvidences,
          search: query
        }
      };
    });
  }

  setReduxState(state) {
    this.context.store.dispatch(formActions.setInitial('evidences.search', state.evidences.search));
    this.context.store.dispatch(actions.set('evidences/evidences', state.evidences.evidences));
  }

  render() {
    return <EvidencesSection />;
  }
}
