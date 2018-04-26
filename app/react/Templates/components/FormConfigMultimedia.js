import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Field } from 'react-redux-form';
import { connect } from 'react-redux';

import { t } from 'app/I18N';
import { Select } from 'app/ReactReduxForms';
import Tip from 'app/Layout/Tip';

import PropertyConfigOption from './PropertyConfigOption';

const style = index => (
  <div>
    <div className="form-group">
      <label>
        {t('System', 'Style')}
      </label>
      <Select
        model={`template.data.properties[${index}].style`}
        options={[{ _id: 'contain', name: 'Contain' }, { _id: 'cover', name: 'Cover' }]}
        optionsLabel="name"
        optionsValue="_id"
      />
    </div>
    <div className="protip">
      <span><b>Contain</b> will show the entire media inside the container.  Grey bars may appear to the sides of the image.</span>
      <br /><span><b>Cover</b> will fill the container, centering the image and using the entire width.  Some cropping may occur.</span>
    </div>
  </div>
);

class FormConfigMultimedia extends Component {
  render() {
    const { property, index, formState, canShowInCard, helpText } = this.props;

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
          <div>
            <PropertyConfigOption label="Show in cards" model={`template.data.properties[${index}].showInCard`}>
              <Tip>This property will appear in the library cards as part of the basic info.</Tip>
            </PropertyConfigOption>
            {property.showInCard && style(index)}
          </div>
        }
      </div>
    );
  }
}

FormConfigMultimedia.defaultProps = {
  canShowInCard: true,
  helpText: ''
};

FormConfigMultimedia.propTypes = {
  property: PropTypes.instanceOf(Object).isRequired,
  canShowInCard: PropTypes.bool,
  helpText: PropTypes.string,
  index: PropTypes.number.isRequired,
  formState: PropTypes.instanceOf(Object).isRequired
};

export function mapStateToProps({ template }, ownProps) {
  return {
    property: template.data.properties[ownProps.index],
    formState: template.formState
  };
}

export default connect(mapStateToProps)(FormConfigMultimedia);
