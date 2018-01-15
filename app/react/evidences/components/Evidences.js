import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getSuggestions, saveEvidence, removeSuggestion} from '../actions';
import {createSelector} from 'reselect';
import Immutable from 'immutable';

const thesauriValues = createSelector(s => s.thesauris, (thesauris) => {
  let values = {};
  thesauris.forEach((thesauri) => {
    thesauri.get('values').forEach((value) => {
      values[value.get('id')] = value.get('label');
    });
  });

  return values;
});

export class Evidences extends Component {

  constructor(props) {
    super(props);
    this.getSuggestions = this.getSuggestions.bind(this);
  }

  getSuggestions() {
    return this.props.getSuggestions(this.props.doc.get('sharedId'));
  }

  saveValidSuggestion(suggestion) {
    let evidence = suggestion.toJS();
    evidence.isEvidence = true;
    return this.props.saveEvidence(evidence)
    .then(() => {
      this.props.removeSuggestion(suggestion);
    });
  }

  saveInvalidSuggestion(suggestion) {
    let evidence = suggestion.toJS();
    evidence.isEvidence = false;
    return this.props.saveEvidence(evidence)
    .then(() => {
      this.props.removeSuggestion(suggestion);
    });
  }

  render() {
    const evidences = this.props.evidences.groupBy(x => x.get('property'));
    const suggestions = this.props.suggestions.groupBy(x => x.get('property'));
    const properties = this.props.suggestions.concat(this.props.evidences).groupBy((x) => x.get('property')).keySeq().toArray();
    const valuesLabels = thesauriValues(this.props);

    return <div>
      <button onClick={this.getSuggestions}>Get suggestions</button>

      {properties.map((property) => {
        return <div key={property}>
          {evidences.size ? evidences.get(property).map((evidence, index) => {
            return <div key={index} className="evidence">
              <p>{evidence.get('evidence').get('text')}</p>
              <p>{valuesLabels[evidence.get('value')]}</p>
            </div>;
          }) : false}
          {suggestions.size ? suggestions.get(property).map((suggestion, index) => {
            return <div key={index} className="evidence suggestion">
              <p>{suggestion.get('evidence').get('text')}</p>
              <p>{valuesLabels[suggestion.get('value')]}</p>
              <button onClick={this.saveValidSuggestion.bind(this, suggestion)}>OK</button>
              <button onClick={this.saveInvalidSuggestion.bind(this, suggestion)}>NO</button>
            </div>;
          }) : false}
        </div>;
      })}
    </div>;
  }
}

Evidences.defaultProps = {
  suggestions: Immutable.fromJS([])
};

Evidences.propTypes = {
  suggestions: PropTypes.object,
  evidences: PropTypes.object,
  doc: PropTypes.object,
  getSuggestions: PropTypes.func,
  removeSuggestion: PropTypes.func,
  saveEvidence: PropTypes.func
};

export function mapStateToProps({evidences, documentViewer, thesauris}) {
  return {
    suggestions: evidences.suggestions,
    doc: documentViewer.doc,
    thesauris,
    evidences: evidences.evidences
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getSuggestions, saveEvidence, removeSuggestion}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Evidences);
