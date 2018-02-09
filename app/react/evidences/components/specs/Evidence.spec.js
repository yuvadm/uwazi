import Immutable from 'immutable';
import React from 'react';

import {shallow} from 'enzyme';

import Evidence from '../Evidence.js';

describe('Evidence', () => {
  let component;
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
  };

  describe('when evidence has not a isEvidence property set', () => {
    it('should be treated as a suggestion and render the action buttons', () => {
      render();
      const buttons = component.find('button');
      const acceptButton = buttons.findWhere((b) => b.props().onClick === props.accept);
      const rejectButton = buttons.findWhere((b) => b.props().onClick === props.reject);
      expect(acceptButton.exists()).toBe(true);
      expect(rejectButton.exists()).toBe(true);
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
