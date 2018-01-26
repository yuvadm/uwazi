import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Immutable from 'immutable';
import Doc from './Doc';
import {RowList} from 'app/Layout/Lists';
import {wrapDispatch} from 'app/Multireducer';
import {actions as actionCreators} from 'app/BasicReducer';
import {getLibraryDocuments} from '../selectors';
import {clickOnDocument} from '../actions/libraryActions';

const Documents = (props) => {
  return (
  <RowList>
    {props.documents.map((doc, index) =>
      <Doc doc={doc}
        storeKey={props.storeKey}
        key={index}
        onClick={props.clickOnDocument}
        onSnippetClick={props.onSnippetClick}
        deleteConnection={props.deleteConnection}
        searchParams={props.search} />
    )}
  </RowList>
  );
};

Documents.propTypes = {
  documents: PropTypes.instanceOf(Immutable.List),
  storeKey: PropTypes.string,
  search: PropTypes.object,
  onSnippetClick: PropTypes.func,
  deleteConnection: PropTypes.func,
  clickOnDocument: PropTypes.func
};

export function mapStateToProps(state, props) {
  return {
    documents: getLibraryDocuments(state, props.storeKey).get('rows'),
    search: state[props.storeKey].search
  };
}

function mapDispatchToProps(dispatch, props) {
  return bindActionCreators({
    clickOnDocument,
    onSnippetClick: () => actionCreators.set(props.storeKey + '.sidepanel.tab', 'text-search')
  }, wrapDispatch(dispatch, props.storeKey));
}

export default connect(mapStateToProps, mapDispatchToProps)(Documents);
