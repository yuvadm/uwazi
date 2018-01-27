import {connect} from 'react-redux';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';

import {RowList} from 'app/Layout/Lists';

import {getEvidences} from '../selectors';
import Evidence from '../components/Evidence';

const Evidences = (props) => {
  return (
  <RowList>
    {props.evidences.map((evidence, index) =>
      <Evidence evidence={evidence} key={index} />
    )}
  </RowList>
  );
};

Evidences.propTypes = {
  evidences: PropTypes.instanceOf(Immutable.List)
};

export function mapStateToProps(state) {
  return {
    evidences: getEvidences(state).get('rows')
  };
}

export default connect(mapStateToProps)(Evidences);
