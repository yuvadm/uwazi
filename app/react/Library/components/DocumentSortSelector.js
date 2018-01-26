import PropTypes from 'prop-types';
import React from 'react';
import {ListSortSection} from 'app/Layout';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {searchDocuments} from 'app/Library/actions/libraryActions';
import SortButtons from 'app/Library/components/SortButtons';
import {wrapDispatch} from 'app/Multireducer';
import Immutable from 'immutable';

const DocumentSortSelector = (props) => {
  return (
    <ListSortSection total={props.total} label={props.label}>
      <SortButtons
        sortCallback={props.searchDocuments}
        storeKey={props.storeKey}
        selectedTemplates={props.selectedTemplates}
      />
    </ListSortSection>
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
