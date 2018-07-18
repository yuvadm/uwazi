import {Form} from 'react-redux-form';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';

import FormGroup from 'app/DocumentForm/components/FormGroup';

import {Button} from '../../Layout';
import {MultiSelect} from '../../ReactReduxForms';
import {evidencesActions, searchEvidences, retrainModel} from '../actions';
import {getFilters} from '../selectors';

const EvidencesFiltersForm = (props) => {
  const isEvidenceFilter = props.filters.find((f) => f.get('_id') === 'isEvidence');
  const probabilityFilter = props.filters.find((f) => f.get('_id') === 'probability');
  const filters = props.filters.filter((f) => f.get('_id') !== 'isEvidence' && f.get('_id') !== 'probability');
  return (
    <Form model='evidences.search' onChange={props.onChange}>
      <FormGroup>
        <ul className="search__filter is-active">
          <li>{isEvidenceFilter.get('label')}</li>
          <li className="wide">
            <MultiSelect
              model={`.filters._${isEvidenceFilter.get('_id')}.values`}
              options={isEvidenceFilter.get('values').toJS()}
              prefix={isEvidenceFilter.get('_id')}
              renderActions={(option) => {
                const isSuggestionsOption = option.value === 'null';
                if (isSuggestionsOption) {
                  return (
                    <div>
                      <Button danger icon="trash" onClick={props.deleteSuggestions}> Delete All</Button>
                    </div>
                  );
                }
              }}
            />
          </li>
        </ul>
      </FormGroup>
      <FormGroup>
        <ul className="search__filter is-active">
          <li>{probabilityFilter.get('label')}</li>
          <li className="wide">
            <MultiSelect
              model={`.filters._${probabilityFilter.get('_id')}.values`}
              options={probabilityFilter.get('values').toJS()}
              prefix={probabilityFilter.get('_id')}
            />
          </li>
        </ul>
      </FormGroup>
      {filters.map((filter, index) => {
        return (
          <FormGroup key={index}>
            <ul className="search__filter is-active">
              <li>{filter.get('label')}</li>
              <li className="wide">
                <MultiSelect
                  model={`.filters._${filter.get('_id')}.values`}
                  options={filter.get('values').toJS()}
                  prefix={filter.get('_id')}
                  renderActions={(option) =>
                      <div>
                        <button onClick={() => props.getSuggestions(filter.get('_id'), option.value)}>Predict</button>
                        <button onClick={() => props.oneByOne(filter.get('_id'), option.value)}>OneByOne</button>
                        <button onClick={() => props.retrainModel(filter.get('_id'), option.value)}>Retrain</button>
                      </div>
                  }
                />
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
  onChange: PropTypes.func,
  deleteSuggestions: PropTypes.func,
  retrainModel: PropTypes.func,
  getSuggestions: PropTypes.func
};

export function mapStateToProps(state) {
  return {
    filters: getFilters(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onChange: searchEvidences,
    retrainModel,
    oneByOne: evidencesActions.oneByOneSuggestions,
    getSuggestions: evidencesActions.getSuggestions,
    deleteSuggestions: evidencesActions.deleteSuggestions
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EvidencesFiltersForm);
