import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getSuggestions, saveEvidence} from '../actions';

class EvidenceSuggestions extends Component {

  constructor(props) {
    super(props);
    this.getSuggestions = this.getSuggestions.bind(this);
  }

  getSuggestions() {
    return this.props.getSuggestions(this.props.doc.get('_id'));
  }

  saveValidSuggestion(suggestion) {
    let evidence = suggestion.toJS();
    evidence.isEvidence = true;
    return this.props.saveEvidence(evidence);
  }

  saveInvalidSuggestion(suggestion) {
    let evidence = suggestion.toJS();
    evidence.isEvidence = false;
    return this.props.saveEvidence(evidence);
  }

  render() {
    return <div>
      <button onClick={this.getSuggestions}>Get suggestions</button>
      {this.props.suggestions.map((suggestion, index) => {
        return <div key={index}>
          <p>{suggestion.get('evidence').get('text')}</p>
          <p>{suggestion.get('value')}</p>
          <button onClick={this.saveValidSuggestion.bind(this, suggestion)}>OK</button>
          <button onClick={this.saveInvalidSuggestion.bind(this, suggestion)}>NO</button>
        </div>;
      })}
      </div>;
  }
}

EvidenceSuggestions.propTypes = {
  suggestions: PropTypes.object,
  doc: PropTypes.object,
  getSuggestions: PropTypes.func,
  saveEvidence: PropTypes.func
};

export function mapStateToProps({evidences, documentViewer}) {
  return {
    suggestions: evidences.suggestions,
    doc: documentViewer.doc
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getSuggestions, saveEvidence}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EvidenceSuggestions);
