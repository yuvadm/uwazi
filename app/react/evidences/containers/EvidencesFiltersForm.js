import {Form} from 'react-redux-form';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';

import FormGroup from 'app/DocumentForm/components/FormGroup';

import {MultiSelect} from '../../ReactReduxForms';
import {getFilters} from '../selectors';
import {searchEvidences} from '../actions';

const EvidencesFiltersForm = (props) => {
  console.log(props.filters);
  return (
    <Form model='evidences.search' onChange={props.onChange}>
      {props.filters.map((filter, index) => {
        return (
          <FormGroup key={index}>
            <ul className="search__filter is-active">
              <li>{filter.get('label')}</li>
              <li className="wide">
                <MultiSelect model={'.filters.value.values'} options={filter.get('values').toJS()} />
              </li>
            </ul>
          </FormGroup>
        );
      })}
    </Form>
  );
};

EvidencesFiltersForm.propTypes = {
  filters: PropTypes.instanceOf(Immutable.List),
  onChange: PropTypes.func
};

export function mapStateToProps(state) {
  return {
    filters: getFilters(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onChange: searchEvidences
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EvidencesFiltersForm);
