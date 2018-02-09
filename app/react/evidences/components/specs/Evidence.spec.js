import Immutable from 'immutable';
import React from 'react';

import {shallow} from 'enzyme';

import Evidence from '../Evidence.js';
import {Button} from 'app/Layout';

describe('Evidence', () => {
  let component;
  let instance;
  let props;

  beforeEach(() => {
    props = {
      evidence: Immutable.fromJS({
        evidence: {text: 'test'},
        probability: 0.60
      }),
      accept: jasmine.createSpy('recoverPassword'),
      reject: jasmine.createSpy('notify')
    };
  });

  let render = () => {
    component = shallow(<Evidence {...props}/>);
    instance = component.instance();
  };

  describe('when evidence has not a isEvidence property set', () => {
    it('should render the probability', () => {
      render();
      expect(component.html()).toMatch('60%');
    });

    it('should be treated as a suggestion and render the action buttons', () => {
      render();
      const buttons = component.find(Button);
      const acceptButton = buttons.findWhere((b) => b.props().onClick === instance.accept);
      const rejectButton = buttons.findWhere((b) => b.props().onClick === instance.reject);
      expect(acceptButton.exists()).toBe(true);
      expect(rejectButton.exists()).toBe(true);

      instance.accept();
      expect(props.accept).toHaveBeenCalledWith(props.evidence);
      instance.reject();
      expect(props.reject).toHaveBeenCalledWith(props.evidence);
    });
  });

  describe('when evidence has isEvidence property', () => {
    it('should not render action buttons and probability', () => {
      props.evidence = props.evidence.set('isEvidence', true);
      render();

      const buttons = component.find('button');
      expect(buttons.length).toBe(0);
      expect(component.html()).not.toMatch('60%');
    });
  });

  describe('when isEvidence is true', () => {
    it('should render a Positive badge', () => {
      props.evidence = props.evidence.set('isEvidence', true);
      render();
      expect(component.html()).toMatch('Positive');
      expect(component.html()).not.toMatch('Negative');
    });
  });

  describe('when isEvidence is false', () => {
    it('should render a Negative badge', () => {
      props.evidence = props.evidence.set('isEvidence', false);
      render();
      expect(component.html()).toMatch('Negative');
      expect(component.html()).not.toMatch('Positive');
    });
  });
});
