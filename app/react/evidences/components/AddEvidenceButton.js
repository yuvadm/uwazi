import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setEvidence} from '../actions.js';

class AddEvidenceButton extends Component {
  constructor(props) {
    super(props);
    this.addEvidence = this.addEvidence.bind(this);
  }

  addEvidence() {
    this.props.setEvidence(this.props.evidence);
  }

  render() {
    return <div onClick={this.addEvidence} className={this.props.className}>
      {this.props.children}
    </div>;
  }
}

let childrenType = PropTypes.oneOfType([
  PropTypes.object,
  PropTypes.array
]);

AddEvidenceButton.propTypes = {
  setEvidence: PropTypes.func,
  evidence: PropTypes.object,
  children: childrenType,
  className: PropTypes.string
};

export function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({setEvidence}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AddEvidenceButton);
