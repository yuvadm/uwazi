import {Form} from 'react-redux-form';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';

import FormGroup from 'app/DocumentForm/components/FormGroup';

import {MultiSelect} from '../../ReactReduxForms';
import {SidePanel} from '../../Layout';
import {searchEvidences} from '../actions';

const EvidencesFilters = (props) => {
  return (
    <SidePanel className="library-filters" open={true}>
      <Form model='evidences.search' onChange={props.onChange}>
        {props.thesauris.map((thesauri, index) => {
          return (
            <FormGroup key={index}>
              <ul className="search__filter is-active">
                <li>{thesauri.get('name')}</li>
                <li className="wide">
                  <MultiSelect
                    model={'.filters.value.values'}
                    prefix={thesauri.name}
                    options={thesauri.get('values').toJS()}
                    optionsValue="id"
                  />
                </li>
              </ul>
            </FormGroup>
          );
        })}
      </Form>
    </SidePanel>
  );
};

EvidencesFilters.propTypes = {
  thesauris: PropTypes.instanceOf(Immutable.List),
  onChange: PropTypes.func
};

export function mapStateToProps({thesauris}) {
  return {
    thesauris
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onChange: searchEvidences
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EvidencesFilters);
