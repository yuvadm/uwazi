import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
//import {actions as formActions, Field, LocalForm} from 'react-redux-form';
import {Field, LocalForm} from 'react-redux-form';
import {Select as SimpleSelect} from 'app/Forms';

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
    this.propertyChange = this.propertyChange.bind(this);
  }

  submit() {

  }

  buildThesauriOptions(propertyId) {
    const template = this.props.template.toJS();
    const thesauris = this.props.thesauris.toJS();

    const properties = template.properties.filter((p) => p.type === 'multiselect');

    const thesauri = thesauris.find((t) => t._id === properties.find((p) => p._id === propertyId).content);
    const thesauriOptions = thesauri.values.map((t) => {
      return {label: t.label, value: t._id};
    });

    return thesauriOptions;
  }

  propertyChange(e) {
    this.selectProperty(e.target.value);
  }

  selectProperty(propertyId) {
    this.setState({
      thesauriOptions: this.buildThesauriOptions(propertyId)
    });
  }

  render() {
    return (
      <div>
        <h4>Assign the selected text:</h4>
        <p>{this.props.evidence}</p>
        <p>as evidence of:</p>
        <LocalForm
          model={'evidence'}
          onSubmit={this.submit}
          >
          <Field model=".property">
            <SimpleSelect
              className="form-control"
              options={this.state.propertyOptions}
              onChange={this.propertyChange}
            >
            </SimpleSelect>
          </Field>

          <Field model=".value">
            <SimpleSelect
              className="form-control"
              options={this.state.thesauriOptions}
            >
            </SimpleSelect>
          </Field>
        </LocalForm>

        <button type="button" className="btn btn-default">
          <i className="fa fa-close"></i> Cancel
        </button>
        <button type="button" className="btn btn-primary">
          <i className="fa fa-trash"></i> Add property
        </button>
      </div>
    );
  }
}

EvidenceForm.propTypes = {
  template: PropTypes.object,
  thesauris: PropTypes.object,
  evidence: PropTypes.string
};

const mapStateToProps = ({thesauris}) => {
  return {thesauris};
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EvidenceForm);
