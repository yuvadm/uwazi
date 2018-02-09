import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as formActions, LocalForm} from 'react-redux-form';
//import {Field, LocalForm} from 'react-redux-form';
import {unsetEvidence, saveEvidence} from '../actions';
import {docEvidencesActions} from '../actions';
import {Select as SimpleSelect} from 'app/ReactReduxForms';

export class EvidenceForm extends Component {

  constructor(props) {
    super(props);

    const template = props.template.toJS();
    const properties = template.properties.filter((p) => p.type === 'multiselect');
    const propertyOptions = properties.map((p) => {
      return {label: p.label, value: p._id};
    });

    this.state = {
      propertyOptions,
      thesauriOptions: this.buildThesauriOptions(properties[0]._id)
    };

    this.submit = this.submit.bind(this);
    this.attachDispatch = this.attachDispatch.bind(this);
    this.propertyChange = this.propertyChange.bind(this);
  }

  submit(values) {
    const evidence = {
      property: values.property,
      value: values.value,
      document: this.props.doc.get('sharedId'),
      evidence: {text: this.props.evidence},
      isEvidence: true
    };

    this.props.saveEvidence(evidence);
  }

  buildThesauriOptions(propertyId) {
    const template = this.props.template.toJS();
    const thesauris = this.props.thesauris.toJS();

    const properties = template.properties.filter((p) => p.type === 'multiselect');

    const thesauri = thesauris.find((t) => t._id === properties.find((p) => p._id === propertyId).content);
    const thesauriOptions = thesauri.values.map((t) => {
      return {label: t.label, value: t.id || t._id};
    });

    //return [{label: 'Select...', value: ''}].concat(thesauriOptions);
    return thesauriOptions;
  }

  propertyChange(e) {
    this.selectProperty(e.target.value);
  }

  selectProperty(propertyId) {
    this.resetValue();
    this.setState({
      thesauriOptions: this.buildThesauriOptions(propertyId)
    });
  }

  attachDispatch(dispatch) {
    this.formDispatch = dispatch;
  }

  resetValue() {
    this.formDispatch(formActions.change('evidence.value', ''));
  }

  render() {
    return (
      <div>
        <h4>Assign the selected text:</h4>
        <p>{this.props.evidence}</p>
        <p>as evidence of:</p>
        <LocalForm
          getDispatch={this.attachDispatch}
          model={'evidence'}
          onSubmit={this.submit}
          id='evidenceForm'
        >
          <SimpleSelect
            model=".property"
            className="form-control"
            options={this.state.propertyOptions}
            onChange={this.propertyChange}
            defaultValue=''
          >
          </SimpleSelect>

          <SimpleSelect
            model=".value"
            className="form-control"
            options={this.state.thesauriOptions}
            defaultValue=''
          >
          </SimpleSelect>
        </LocalForm>

        <button type="button" className="btn btn-default" onClick={this.props.unsetEvidence}>
          <i className="fa fa-close"></i> Cancel
        </button>
        <button type="submit" form="evidenceForm" className="btn btn-primary">
          <i className="fa fa-trash"></i> Add property
        </button>
      </div>
    );
  }
}

EvidenceForm.propTypes = {
  template: PropTypes.object,
  doc: PropTypes.object,
  thesauris: PropTypes.object,
  evidence: PropTypes.string,
  unsetEvidence: PropTypes.func,
  saveEvidence: PropTypes.func
};

const mapStateToProps = ({thesauris, templates}, {doc}) => {
  return {
    template: templates.find((t) => t.get('_id') === doc.get('template')),
    thesauris
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    unsetEvidence,
    saveEvidence: docEvidencesActions.saveEvidence
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EvidenceForm);
