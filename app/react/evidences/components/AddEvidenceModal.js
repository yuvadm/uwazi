import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Modal from 'app/Layout/Modal';
import EvidenceForm from './EvidenceForm';

export class AddEvidenceModal extends Component {
  render() {
    return (
      <Modal isOpen={!!this.props.evidence}>
        <Modal.Body>
          <EvidenceForm template={this.props.template} evidence={this.props.evidence}/>
        </Modal.Body>
      </Modal>
    );
  }
}

AddEvidenceModal.propTypes = {
  template: PropTypes.object,
  evidence: PropTypes.string
};

const mapStateToProps = ({templates, evidences}, {templateId}) => {
  return {
    template: templates.find((t) => t.get('_id') === templateId),
    evidence: evidences.evidence.get('text')
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AddEvidenceModal);
