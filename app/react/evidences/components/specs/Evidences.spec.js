import React from 'react';
import {shallow} from 'enzyme';
import Immutable from 'immutable';

import {Evidences} from '../Evidences';

fdescribe('Evidences', () => {
  let component;
  //let instance;
  let props;
  let evidences = Immutable.fromJS([
    {
      value: 'valueId1',
      property: 'property1',
      evidence: {text: 'evidence text 1'}
    },
    {
      value: 'valueId3',
      property: 'property2',
      evidence: {text: 'evidence text 3'}
    },
    {
      value: 'valueId2',
      property: 'property1',
      evidence: {text: 'evidence text 2'}
    },
    {
      value: 'valueId4',
      property: 'property2',
      evidence: {text: 'evidence text 4'}
    }
  ]);

  let thesauris = Immutable.fromJS([
    {_id: 'thesauri1', values: [{id: 'valueId1', label: 'label1'}, {id: 'valueId2', label: 'label2'}]},
    {_id: 'thesauri2', values: [{id: 'valueId3', label: 'label3'}, {id: 'valueId4', label: 'label4'}]}
  ]);

  beforeEach(() => {
    props = {
      evidences,
      thesauris
    };
  });

  let render = () => {
    component = shallow(<Evidences {...props} />);
    //instance = component.instance();
  };

  it('should render evidences grouped by property', () => {
    render();

    let evidenceElements = component.find('div.evidence');

    expect(evidenceElements.at(0).text().match('text 1')).not.toBe(null);
    expect(evidenceElements.at(0).text().match('label1')).not.toBe(null);

    expect(evidenceElements.at(1).text().match('text 2')).not.toBe(null);
    expect(evidenceElements.at(1).text().match('label2')).not.toBe(null);

    expect(evidenceElements.at(2).text().match('text 3')).not.toBe(null);
    expect(evidenceElements.at(2).text().match('label3')).not.toBe(null);

    expect(evidenceElements.at(3).text().match('text 4')).not.toBe(null);
    expect(evidenceElements.at(3).text().match('label4')).not.toBe(null);
  });

  describe('when has suggestions', () => {
    it('should render them grouped with his property', () => {
      props.suggestions = Immutable.fromJS([
        {
          value: 'valueId1',
          property: 'property1',
          evidence: {text: 'suggestion1'}
        },
        {
          value: 'valueId3',
          property: 'property2',
          evidence: {text: 'suggestion2'}
        }
      ]);
      render();

      let evidenceElements = component.find('div.suggestion');

      expect(evidenceElements.at(0).text().match('suggestion1')).not.toBe(null);
      expect(evidenceElements.at(0).text().match('label1')).not.toBe(null);

      expect(evidenceElements.at(1).text().match('suggestion2')).not.toBe(null);
      expect(evidenceElements.at(1).text().match('label3')).not.toBe(null);
    });

    describe('and there is no evidences', () => {
      it('should render them grouped with his property', () => {
        props.evidences = Immutable.fromJS([]);
        props.suggestions = Immutable.fromJS([
          {
            value: 'valueId1',
            property: 'property1',
            evidence: {text: 'suggestion1'}
          },
          {
            value: 'valueId3',
            property: 'property2',
            evidence: {text: 'suggestion2'}
          }
        ]);
        render();

        let evidenceElements = component.find('div.suggestion');

        expect(evidenceElements.at(0).text().match('suggestion1')).not.toBe(null);
        expect(evidenceElements.at(0).text().match('label1')).not.toBe(null);

        expect(evidenceElements.at(1).text().match('suggestion2')).not.toBe(null);
        expect(evidenceElements.at(1).text().match('label3')).not.toBe(null);
      });
    });
  });
});
