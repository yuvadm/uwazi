import React from 'react';
import { shallow } from 'enzyme';

import FormConfigHelper from 'app/Templates/components/FormConfigHelper';
import { Field } from 'react-redux-form';

describe('FormConfigHelper', () => {
  let component;
  let props;

  beforeEach(() => {
    props = {
      index: 0,
      property: { label: '' },
      formState: {
        'properties.0.label': { valid: true, dirty: false, errors: {} },
        $form: {
          errors: {
            'properties.0.label.required': false,
            'properties.0.label.duplicated': false
          }
        }
      }
    };
  });

  const render = () => {
    component = shallow(<FormConfigHelper.WrappedComponent {...props}/>);
  };

  const expectErrorLengthToBe = (length) => {
    render();
    expect(component.find('.has-error').length).toBe(length);
  };

  it('should render Fields with the correct datas', () => {
    render();
    const formFields = component.find(Field);
    expect(formFields.getElements().length).toBe(2);
    expect(formFields.getElements()[0].props.model).toBe('template.data.properties[0].label');
    expect(formFields.getElements()[1].props.model).toBe('template.data.properties[0].showInCard');
  });

  it('should allow setting a help text', () => {
    expect(component.find('.protip').length).toBe(0);
    props.helpText = 'Some help text';
    render();
    expect(component.find('.protip').length).toBe(1);
  });

  it('should allow excluding "show in card"', () => {
    props.canShowInCard = false;
    render();
    const formFields = component.find(Field);
    expect(formFields.getElements().length).toBe(1);
  });

  describe('validation', () => {
    it('should render the label without errors', () => {
      expectErrorLengthToBe(0);
    });
  });

  describe('when the field is invalid and dirty or the form is submited', () => {
    it('should render the label with errors', () => {
      props.formState.$form.errors['properties.0.label.required'] = true;
      props.formState['properties.0.label'].dirty = true;
      expectErrorLengthToBe(1);
    });

    it('should render the label with errors', () => {
      props.formState.$form.errors['properties.0.label.required'] = true;
      props.formState.submitFailed = true;
      expectErrorLengthToBe(1);
    });
  });
});
