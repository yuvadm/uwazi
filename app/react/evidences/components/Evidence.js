import {Link} from 'react-router';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {Badge, Button} from 'app/Layout';
import {RowList} from 'app/Layout/Lists';

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
    const {evidence} = this.props;
    return (
      <RowList.Item className='item-entity'>
        <div className="item-info">
          <div className="item-name">
            <p><b>{evidence.get('propertyLabel')}</b>: {evidence.get('valueLabel')}</p>
            {
              evidence.get('documentTitle') ?
                <p>
                  <b>Document</b>:
                  &nbsp;<Link to={`/${evidence.get('language')}/document/${evidence.get('document')}`}>{evidence.get('documentTitle')}</Link>
                </p>
                : false
            }
          </div>
          <div className="item-snippet-wrapper">
            <p dangerouslySetInnerHTML={{__html: evidence.get('evidence').get('text')}} />
          </div>
          {evidence.get('isEvidence') === true && <Badge>Positive</Badge>}
          {evidence.get('isEvidence') === false && <Badge red>Negative</Badge>}
          {evidence.has('isEvidence') ? <div/> :
              <div>
                <p>Probability: <b>{Math.round(evidence.get('probability') * 100 * 100) / 100}%</b></p>
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
