import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {RowList} from 'app/Layout/Lists';
import Immutable from 'immutable';

class Evidence extends Component {
  constructor(props) {
    super(props);
    this.accept = this.accept.bind(this);
    this.reject = this.reject.bind(this);
  }
  accept() {
    this.props.accept(this.props.evidence);
  }
  reject() {
    this.props.reject(this.props.evidence);
  }
  render() {
    const {props} = this;
    return (
      <RowList.Item>
        <p>{props.evidence.get('evidence').get('text')}</p>
        <p><b>{props.evidence.get('propertyLabel')}</b>: {props.evidence.get('valueLabel')}</p>
        {props.evidence.has('isEvidence') ? <div/> :
            <div>
              <p>Probability: <b>{Math.round(props.evidence.get('probability') * 100 * 100) / 100}%</b></p>
              <button onClick={this.accept}>Accept</button>
              <button onClick={this.reject}>Reject</button>
            </div>
        }
      </RowList.Item>
    );
  }
}

Evidence.propTypes = {
  evidence: PropTypes.instanceOf(Immutable.Map),
  accept: PropTypes.func,
  reject: PropTypes.func
};

export default Evidence;
