import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';

import {RowList} from 'app/Layout/Lists';

import {evidencesActions} from '../actions';
import {evidences} from '../selectors';
import Evidence from '../components/Evidence';

const Evidences = (props) => {
  return (
    <RowList>
      {props.evidences.map((evidence, index) =>
        <Evidence evidence={evidence} key={index} accept={props.accept} reject={props.reject}/>
      )}
    </RowList>
  );
};

Evidences.propTypes = {
  evidences: PropTypes.instanceOf(Immutable.List),
  accept: PropTypes.func,
  reject: PropTypes.func
};

export function mapStateToProps(state) {
  return {
    evidences: evidences.get(state)
  };
}

export function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    accept: evidencesActions.saveValidSuggestion,
    reject: evidencesActions.saveInvalidSuggestion
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Evidences);
