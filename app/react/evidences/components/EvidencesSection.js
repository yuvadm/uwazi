import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import React, {Component} from 'react';

import EvidencesList from '../containers/EvidencesList';

class EvidencesSection extends Component {
  render() {
    return (
      <div className="row panels-layout">
        <main className="library-viewer document-viewer with-panel">
          <EvidencesList />
        </main>
      </div>
    );
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
