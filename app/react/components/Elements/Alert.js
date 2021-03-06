import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './scss/alert.scss';
import { Icon } from 'UI';

class Alert extends Component {
  constructor(props) {
    super(props);
    this.state = { show: !!this.props.message };
  }

  hide() {
    this.setState({ show: false });
  }

  show() {
    this.setState({ show: true });
  }

  render() {
    const type = this.props.type || 'info';
    const cssClass = `alert alert-${type}`;
    let icon = 'info-circle';
    if (type === 'warning' || type === 'danger') {
      icon = 'exclamation-triangle';
    }

    return (
      <div className="alert-wrapper">
        {(() => {
          if (this.state.show) {
            return (
              <div className={cssClass}><span className="alert-icon">
                <Icon icon={icon} />
                                        </span><span className="alert-message">{this.props.message}</span>
                <a onClick={this.hide} className="alert-close">
                  <Icon icon="times" />
                </a>
              </div>
            );
          }
        })()}
      </div>
    );
  }
}

Alert.propTypes = {
  message: PropTypes.string,
  type: PropTypes.string
};

export default Alert;
