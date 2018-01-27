import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Immutable from 'immutable';

import {MainListWrapper} from 'app/Layout';
import {loadMoreDocuments} from 'app/Library/actions/libraryActions';

import {getEvidences, getEvidencesTotal} from '../selectors';
import Evidences from './Evidences';

export function mapStateToProps(state) {
  return {
    SearchBar: () => false,
    List: Evidences,
    documents: Immutable.fromJS({rows: getEvidences(state), totalRows: getEvidencesTotal(state)})
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loadMoreDocuments
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainListWrapper);
