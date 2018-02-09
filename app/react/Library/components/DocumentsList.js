import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {actions as actionCreators} from 'app/BasicReducer';
import {loadMoreDocuments} from 'app/Library/actions/libraryActions';
import {wrapDispatch} from 'app/Multireducer';

import {MainListWrapper} from '../../Layout';
import DocumentSortSelector from './DocumentSortSelector';
import Documents from './Documents.js';

export function mapStateToProps(state, props) {
  return {
    List: Documents,
    Sort: DocumentSortSelector,
    documents: state[props.storeKey].documents
  };
}

function mapDispatchToProps(dispatch, props) {
  return bindActionCreators({
    loadMoreDocuments,
    onSnippetClick: () => actionCreators.set(props.storeKey + '.sidepanel.tab', 'text-search')
  }, wrapDispatch(dispatch, props.storeKey));
}

export default connect(mapStateToProps, mapDispatchToProps)(MainListWrapper);
