import PropTypes from 'prop-types';
import React from 'react';
import {ListSortSection, ListSortLabel} from 'app/Layout';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {searchDocuments} from 'app/Library/actions/libraryActions';
import SortButtons from 'app/Library/components/SortButtons';
import {wrapDispatch} from 'app/Multireducer';
import Immutable from 'immutable';
import {getLibraryTotalDocs} from '../selectors';
import {t} from 'app/I18N';

const DocumentSortSelector = (props) => {
  return (
    <ListSortSection>
      <ListSortLabel>
        <b>{props.total + ' '}</b>{t('System', 'documents')}<span>{t('System', 'sorted by')}:</span>
      </ListSortLabel>
      <SortButtons
        sortCallback={props.searchDocuments}
        storeKey={props.storeKey}
        selectedTemplates={props.selectedTemplates}
      />
    </ListSortSection>
  );
};

DocumentSortSelector.propTypes = {
  total: PropTypes.number,
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
    selectedTemplates: state[props.storeKey].filters.get('documentTypes'),
    total: getLibraryTotalDocs(state, props.storeKey)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentSortSelector);
