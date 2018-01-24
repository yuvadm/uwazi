import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Evidence from './Evidence';
import EvidencesList from '../containers/EvidencesList';

class EvidencesSection extends Component {
  render() {
    return <div>
      {this.props.evidences.map((evidence, index) => {
        return <Evidence key={index} evidence={evidence} />;
      })}
      <EvidencesList />
      </div>;
  }
}

EvidencesSection.propTypes = {
  evidences: PropTypes.object
};

export function mapStateToProps(state) {
  return {
    evidences: state.evidences.allEvidences
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EvidencesSection);
