import PropTypes from 'prop-types';
import React from 'react';
import DocumentsListSort from 'app/Layout/DocumentsListSort';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {searchDocuments} from 'app/Library/actions/libraryActions';
import SortButtons from 'app/Library/components/SortButtons';
import {wrapDispatch} from 'app/Multireducer';
import Immutable from 'immutable';

const DocumentSortSelector = (props) => {
  return (
    <DocumentsListSort total={props.total} label={props.label}>
      <SortButtons
        sortCallback={props.searchDocuments}
        storeKey={props.storeKey}
        selectedTemplates={props.selectedTemplates}
      />
    </DocumentsListSort>
  );
};

DocumentSortSelector.propTypes = {
  total: PropTypes.node,
  label: PropTypes.string,
  children: PropTypes.node,
  searchDocuments: PropTypes.func,
  storeKey: PropTypes.string,
  selectedTemplates: PropTypes.instanceOf(Immutable.List)
};

function mapDispatchToProps(dispatch, props) {
  return bindActionCreators({searchDocuments}, wrapDispatch(dispatch, props.storeKey));
}

function mapStateToProps(state, props) {
  return {
    selectedTemplates: state[props.storeKey].filters.get('documentTypes')
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentSortSelector);
