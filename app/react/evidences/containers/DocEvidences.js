import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {docEvidencesActions} from '../actions';
import {docEvidences} from '../selectors';

import Evidence from '../components/Evidence';

export class DocEvidences extends Component {

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

  render() {
    //
    const evidences = this.props.evidences.filter((evidence) => {
      if (this.state.positive && evidence.get('isEvidence')) {
        return evidence;
      }
      if (this.state.negative && evidence.get('isEvidence') === false) {
        return evidence;
      }
      if (this.state.suggestions && !evidence.has('isEvidence')) {
        return evidence;
      }
      return false;
    });
    //

    return <div>
      <div>
        <button onClick={this.getSuggestions}>Get suggestions</button>
      </div>
      <div className="text-center">
        <button type="button" onClick={this.toggleSuggestions} className={'btn ' + (this.state.suggestions ? 'btn-success' : '')}>suggestions </button>
        <button type="button" onClick={this.togglePositiveEvidences} className={'btn ' + (this.state.positive ? 'btn-success' : '')}>positive </button>
        <button type="button" onClick={this.toggleNegativeEvidences} className={'btn ' + (this.state.negative ? 'btn-success' : '')}>negative</button>
      </div>

      {evidences.map((evidence, index) => <Evidence key={index} evidence={evidence} accept={this.props.accept} reject={this.props.reject}/>)}
    </div>;
  }
}

DocEvidences.propTypes = {
  evidences: PropTypes.instanceOf(Immutable.List),
  doc: PropTypes.object,
  getSuggestions: PropTypes.func,
  accept: PropTypes.func,
  reject: PropTypes.func
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
    accept: docEvidencesActions.saveValidSuggestion,
    reject: docEvidencesActions.saveInvalidSuggestion
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DocEvidences);
