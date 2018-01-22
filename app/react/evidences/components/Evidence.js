import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {RowList, ItemFooter} from 'app/Layout/Lists';

class Evidence extends Component {

  render() {
    return <RowList.Item>
      {this.props.evidence.get('evidence').get('text')}
    </RowList.Item>;
  }
}

Evidence.propTypes = {
  evidence: PropTypes.object
};

export function mapStateToProps() {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Evidence);
