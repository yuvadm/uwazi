import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Field } from 'react-redux-form';
import { connect } from 'react-redux';

class FormConfigHelper extends Component {
  render() {
    const { index, formState, canShowInCard, helpText } = this.props;
    let labelClass = 'form-group';
    const labelKey = `properties.${index}.label`;
    const requiredLabel = formState.$form.errors[`${labelKey}.required`];
    const duplicatedLabel = formState.$form.errors[`${labelKey}.duplicated`];
    if (requiredLabel || duplicatedLabel) {
      labelClass += ' has-error';
    }

    return (
      <div>
        <div className={labelClass}>
          <label>Name</label>
          <Field model={`template.data.properties[${index}].label`}>
            <input className="form-control"/>
          </Field>
        </div>

        {helpText &&
          <div className="protip">
            <i className="fa fa-lightbulb-o"/>
            <span>This is an automatically generated field.  For Documents, it renders a thumbnail of the PDFs first page.</span>
          </div>
        }

        {canShowInCard &&
          <Field model={`template.data.properties[${index}].showInCard`}>
            <input id={`showInCard${this.props.index}`} type="checkbox"/>
            &nbsp;
            <label className="property-label" htmlFor={`showInCard${this.props.index}`}>
              Show in cards
              <i className="property-help fa fa-question-circle">
                <div className="property-description">Show this property in the cards as part of the basic info.</div>
              </i>
            </label>
          </Field>
        }
      </div>
    );
  }
}

FormConfigHelper.defaultProps = {
  canShowInCard: true,
  helpText: ''
};

FormConfigHelper.propTypes = {
  canShowInCard: PropTypes.bool,
  helpText: PropTypes.string,
  index: PropTypes.number.isRequired,
  formState: PropTypes.instanceOf(Object).isRequired
};

export function mapStateToProps({ template }) {
  return {
    formState: template.formState
  };
}

export default connect(mapStateToProps)(FormConfigHelper);
