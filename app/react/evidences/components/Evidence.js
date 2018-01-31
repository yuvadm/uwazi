import PropTypes from 'prop-types';
import React from 'react';
import {RowList} from 'app/Layout/Lists';
import Immutable from 'immutable';

const Evidence = (props) => {
  return <RowList.Item>
    <p>{props.evidence.get('evidence').get('text')}</p>
    <p><b>{props.evidence.get('propertyLabel')}</b>: {props.evidence.get('valueLabel')}</p>
  </RowList.Item>;
};

Evidence.propTypes = {
  evidence: PropTypes.instanceOf(Immutable.Map)
};

export default Evidence;
