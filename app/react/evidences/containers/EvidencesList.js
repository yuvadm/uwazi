import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {MainListWrapper} from 'app/Layout';

import {evidences} from '../selectors';
import {loadMoreEvidences} from '../actions';
import Evidences from './Evidences';

export function mapStateToProps(state) {
  return {
    SearchBar: () => false,
    List: Evidences,
    numberOfDocuments: evidences.count(state),
    totalDocuments: 400
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loadMoreDocuments: loadMoreEvidences
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainListWrapper);
