import Immutable from 'immutable';
import React from 'react';

import {shallow} from 'enzyme';

import Evidence from '../Evidence.js';

describe('Evidence', () => {
  let component;
  let instance;
  let props;

  beforeEach(() => {
    props = {
      evidence: Immutable.fromJS({
        evidence: {text: 'test'}
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
    it('should be treated as a suggestion and render the action buttons', () => {
      render();
      const buttons = component.find('button');
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
    it('should not render action buttons', () => {
      props.evidence = props.evidence.set('isEvidence', true);
      render();

      const buttons = component.find('button');
      expect(buttons.length).toBe(0);
    });
  });
});
