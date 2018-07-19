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

class EvidencesFiltersForm extends React.Component {
  constructor(props) {
    super(props);
    this.continuePrediciton = false;
    this.state = {
      predictionStopped: true
    }
  }

  async oneByOne(property, value) {
    while (true) {
      try {
        await this.props.getSuggestions(property, value, 3);
      }
      catch(e) {}
      if (!this.continuePrediciton) {
        this.setState({ predictionStopped: true });
        break;
      }
    }
  }

  async start(property, value) {
    this.continuePrediciton = true;
    this.setState({ predictionStopped: false });
    this.oneByOne(property, value)
  }

  async stop() {
    this.continuePrediciton = false;
  }

  render() {
    const isEvidenceFilter = this.props.filters.find((f) => f.get('_id') === 'isEvidence');
    const probabilityFilter = this.props.filters.find((f) => f.get('_id') === 'probability');
    const filters = this.props.filters.filter((f) => f.get('_id') !== 'isEvidence' && f.get('_id') !== 'probability');
    return (
      <Form model='evidences.search' onChange={this.props.onChange}>
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
                        <Button danger icon="trash" onClick={this.props.deleteSuggestions}> Delete All</Button>
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
                          <button onClick={() => this.props.getSuggestions(filter.get('_id'), option.value)}>Predict</button>
                          <button onClick={() => this.props.retrainModel(filter.get('_id'), option.value)}>Retrain</button>
                          {
                            this.state.predictionStopped ?
                              <button className="btn btn-success" onClick={() => this.start(filter.get('_id'), option.value)}>Toggle predict</button>
                            : <button className="btn btn-danger" onClick={() => this.stop()}>Stop predict</button>
                          }
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
  }
}

EvidencesFiltersForm.propTypes = {
  filters: PropTypes.instanceOf(Immutable.List),
  onChange: PropTypes.func,
  deleteSuggestions: PropTypes.func,
  retrainModel: PropTypes.func,
  getSuggestions: PropTypes.func,
  oneByOne: PropTypes.func
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
