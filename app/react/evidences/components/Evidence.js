import PropTypes from 'prop-types';
import React from 'react';
import {RowList} from 'app/Layout/Lists';
import Immutable from 'immutable';

const Evidence = (props) => {
  return (
    <RowList.Item>
      <p>{props.evidence.get('evidence').get('text')}</p>
      <p><b>{props.evidence.get('propertyLabel')}</b>: {props.evidence.get('valueLabel')}</p>
      {props.evidence.has('isEvidence') ? <div/> :
          <div>
            <button onClick={props.accept}></button>
            <button onClick={props.reject}></button>
          </div>
      }
    </RowList.Item>
  );
};

Evidence.propTypes = {
  evidence: PropTypes.instanceOf(Immutable.Map),
  accept: PropTypes.func,
  reject: PropTypes.func
};

export default Evidence;
