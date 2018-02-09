import Immutable from 'immutable';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {Badge, Button} from 'app/Layout';
import {RowList} from 'app/Layout/Lists';

import {ItemFooter} from '../../Layout/Lists';

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
      <RowList.Item className='item-entity'>
        <div className="item-info">
          <div className="item-name">
            <p><b>{props.evidence.get('propertyLabel')}</b>: {props.evidence.get('valueLabel')}</p>
          </div>
          <div className="item-snippet-wrapper">
            <p>{props.evidence.get('evidence').get('text')}</p>
          </div>
          {props.evidence.get('isEvidence') === true ? <Badge>Positive</Badge> : false}
          {props.evidence.get('isEvidence') === false ? <Badge red>Negative</Badge> : false}
          {props.evidence.has('isEvidence') ? <div/> :
              <div>
                <p>Probability: <b>{Math.round(props.evidence.get('probability') * 100 * 100) / 100}%</b></p>
                <Button success icon='thumbs-up' onClick={this.accept}> Accept</Button>
                &nbsp;<Button danger icon='thumbs-down' onClick={this.reject}> Reject</Button>
              </div>
          }
        </div>
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
