import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {docEvidencesActions, removeSuggestion, saveEvidence} from '../actions';
import {docEvidences} from '../selectors';

import Evidence from './Evidence';

export class Evidences extends Component {

  constructor(props) {
    super(props);
    this.getSuggestions = this.getSuggestions.bind(this);
    this.toggleSuggestions = this.toggleSuggestions.bind(this);
    this.togglePositiveEvidences = this.togglePositiveEvidences.bind(this);
    this.toggleNegativeEvidences = this.toggleNegativeEvidences.bind(this);
    this.state = {
      suggestions: true,
      positive: true,
      negative: true
    };
  }

  getSuggestions() {
    return this.props.getSuggestions(this.props.doc.get('sharedId'));
  }

  toggleSuggestions() {
    this.setState({suggestions: !this.state.suggestions});
  }

  togglePositiveEvidences() {
    this.setState({positive: !this.state.positive});
  }

  toggleNegativeEvidences() {
    this.setState({negative: !this.state.negative});
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
    const {evidences} = this.props;

    return <div>
      <div>
        <button onClick={this.getSuggestions}>Get suggestions</button>
      </div>
      <div className="text-center">
        <button type="button" onClick={this.toggleSuggestions} className={'btn ' + (this.state.suggestions ? 'btn-success' : '')}>suggestions </button>
        <button type="button" onClick={this.togglePositiveEvidences} className={'btn ' + (this.state.positive ? 'btn-success' : '')}>positive </button>
        <button type="button" onClick={this.toggleNegativeEvidences} className={'btn ' + (this.state.negative ? 'btn-success' : '')}>negative</button>
      </div>

      {evidences.map((evidence, index) => <Evidence key={index} evidence={evidence}/>)}
    </div>;
  }
}

Evidences.propTypes = {
  evidences: PropTypes.instanceOf(Immutable.List),
  doc: PropTypes.object,
  getSuggestions: PropTypes.func,
  removeSuggestion: PropTypes.func,
  saveEvidence: PropTypes.func
};

export function mapStateToProps(state) {
  return {
    doc: state.documentViewer.doc,
    evidences: docEvidences.get(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getSuggestions: docEvidencesActions.getSuggestions,
    saveEvidence,
    removeSuggestion
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Evidences);
