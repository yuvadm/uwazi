import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

class EvidencesSection extends Component {
  render() {
    return <div>
      {this.props.evidences.map((evidence, index) => {
        return <div key={index}>{evidence.get('evidence').get('text')}</div>;
      })}
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
