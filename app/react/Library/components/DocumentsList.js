import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {wrapDispatch} from 'app/Multireducer';
import {actions as actionCreators} from 'app/BasicReducer';

import DocumentsList from 'app/Layout/DocumentsList';
import Documents from './Documents.js';
import DocumentSortSelector from './DocumentSortSelector';
import {loadMoreDocuments} from 'app/Library/actions/libraryActions';

export function mapStateToProps(state, props) {
  return {
    List: Documents,
    DocumentsListSort: DocumentSortSelector,
    documents: state[props.storeKey].documents
  };
}

function mapDispatchToProps(dispatch, props) {
  return bindActionCreators({
    loadMoreDocuments,
    onSnippetClick: () => actionCreators.set(props.storeKey + '.sidepanel.tab', 'text-search')
  }, wrapDispatch(dispatch, props.storeKey));
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentsList);
