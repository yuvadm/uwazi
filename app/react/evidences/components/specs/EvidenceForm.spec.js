import React from 'react';
import {shallow} from 'enzyme';
import {EvidenceForm} from '../EvidenceForm';
import Immutable from 'immutable';
import {Select as SimpleSelect} from 'app/ReactReduxForms';
import {actions as formActions} from 'react-redux-form';

describe('EvidenceForm', () => {
  let component;
  let instance;
  let props;

  beforeEach(() => {
    props = {
      saveEvidence: jasmine.createSpy('saveEvidence'),
      doc: Immutable.fromJS({
        sharedId: 'shared'
      }),
      evidence: 'evidence_text',
      template: Immutable.fromJS({
        _id: 'template',
        properties: [
          {_id: 'id_multiselect1', type: 'multiselect', label: 'multiselect1', content: 'thesauri1'},
          {type: 'text', label: 'text'},
          {_id: 'id_multiselect2', type: 'multiselect', label: 'multiselect2', content: 'thesauri2'}
        ]
      }),
      thesauris: Immutable.fromJS([
        {_id: 'thesauri1', values: [
          {_id: 'thesauri1_id1', label: 'thesauri1_label1'},
          {_id: 'thesauri1_id2', label: 'thesauri1_label2'}
        ]},
        {_id: 'thesauri2', values: [
          {_id: 'thesauri2_id1', label: 'thesauri2_label1'},
          {_id: 'thesauri2_id2', label: 'thesauri2_label2'}
        ]}
      ])
    };
  });

  let render = () => {
    component = shallow(<EvidenceForm {...props}/>);
    instance = component.instance();
  };

  it('should render a select with multiselects as options', () => {
    render();
    expect(component.find(SimpleSelect).at(0).props().options)
    .toEqual([{label: 'multiselect1', value: 'id_multiselect1'}, {label: 'multiselect2', value: 'id_multiselect2'}]);
  });

  it('should render a select with thesauri options based on the first selection', () => {
    render();
    instance.formDispatch = jasmine.createSpy('formDispatch');

    expect(component.find(SimpleSelect).at(0).props().options)
    .toEqual([{label: 'multiselect1', value: 'id_multiselect1'}, {label: 'multiselect2', value: 'id_multiselect2'}]);

    expect(component.find(SimpleSelect).at(1).props().options)
    .toEqual([{label: 'thesauri1_label1', value: 'thesauri1_id1'}, {label: 'thesauri1_label2', value: 'thesauri1_id2'}]);


    instance.selectProperty('id_multiselect2');
    component.update();

    expect(instance.formDispatch).toHaveBeenCalledWith(formActions.change('evidence.value', ''));
    expect(component.find(SimpleSelect).at(1).props().options)
    .toEqual([{label: 'thesauri2_label1', value: 'thesauri2_id1'}, {label: 'thesauri2_label2', value: 'thesauri2_id2'}]);
  });

  describe('submit', () => {
    it('save evidence', () => {
      render();

      instance.submit({property: 'propertyId', value: 'valueId'});

      expect(props.saveEvidence).toHaveBeenCalledWith({
        property: 'propertyId',
        value: 'valueId',
        document: 'shared',
        evidence: {text: props.evidence},
        isEvidence: true
      });
    });
  });
});
