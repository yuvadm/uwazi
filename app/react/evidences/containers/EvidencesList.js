import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {wrapDispatch} from 'app/Multireducer';
import {searchDocuments} from 'app/Library/actions/libraryActions';
import {actions as actionCreators} from 'app/BasicReducer';

import DocumentsList from 'app/Layout/DocumentsList';
import {loadMoreDocuments, selectDocument, unselectDocument, unselectAllDocuments, selectDocuments} from 'app/Library/actions/libraryActions';

export function mapStateToProps({evidences}) {
  return {
    documents: evidences.allEvidences
  };
}

function mapDispatchToProps(dispatch, props) {
  return bindActionCreators({
    loadMoreDocuments,
    searchDocuments,
    selectDocument,
    selectDocuments,
    unselectDocument,
    unselectAllDocuments,
    onSnippetClick: () => actionCreators.set(props.storeKey + '.sidepanel.tab', 'text-search')
  }, wrapDispatch(dispatch, props.storeKey));
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentsList);
