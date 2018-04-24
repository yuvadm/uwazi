import React from 'react';
import { shallow } from 'enzyme';

import { FormConfigInput } from 'app/Templates/components/FormConfigInput';
import { Field } from 'react-redux-form';

describe('FormConfigInput', () => {
  let component;
  let props;

  beforeEach(() => {
    props = {
      type: 'text',
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
    component = shallow(<FormConfigInput {...props}/>);
  };

  const expectPrioritySortingToShow = (bool) => {
    render();
    expect(component.find(Field).at(5).parent().props().if).toBe(bool);
  };

  const expectErrorLengthToBe = (length) => {
    render();
    expect(component.find('.has-error').length).toBe(length);
  };

  it('should render Fields with the correct datas', () => {
    render();
    const formFields = component.find(Field);
    expect(formFields.getElements()[0].props.model).toBe('template.data.properties[0].label');
    expect(formFields.getElements()[1].props.model).toBe('template.data.properties[0].required');
    expect(formFields.getElements()[2].props.model).toBe('template.data.properties[0].showInCard');
    expect(formFields.getElements()[3].props.model).toBe('template.data.properties[0].filter');
    expect(formFields.getElements()[4].props.model).toBe('template.data.properties[0].defaultfilter');
    expect(formFields.getElements()[5].props.model).toBe('template.data.properties[0].prioritySorting');
  });

  it('should not allow prioritySorting on types others than text or date', () => {
    props.type = 'text';
    expectPrioritySortingToShow(true);
    props.type = 'date';
    expectPrioritySortingToShow(true);
    props.type = 'markdown';
    expectPrioritySortingToShow(false);
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
