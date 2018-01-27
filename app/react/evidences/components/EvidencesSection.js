import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import React, {Component} from 'react';

import EvidencesList from '../containers/EvidencesList';

class EvidencesSection extends Component {
  render() {
    return <div>
      <EvidencesList />
      </div>;
  }
}

EvidencesSection.propTypes = {
};

export function mapStateToProps() {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EvidencesSection);
