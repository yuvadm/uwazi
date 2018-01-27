import PropTypes from 'prop-types';
import React from 'react';
import {RowList} from 'app/Layout/Lists';
import Immutable from 'immutable';

const Evidence = (props) => {
  return <RowList.Item>
    {props.evidence.get('evidence').get('text')}
  </RowList.Item>;
};

Evidence.propTypes = {
  evidence: PropTypes.instanceOf(Immutable.map)
};

export default Evidence;
