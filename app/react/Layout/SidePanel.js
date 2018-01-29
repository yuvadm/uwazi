import PropTypes from 'prop-types';
import React, {Component} from 'react';

export class SidePanel extends Component {
  render() {
    let propsClass = this.props.className || '';
    return (
      <aside className={'side-panel ' + propsClass + ' ' + (this.props.open ? 'is-active' : 'is-hidden')}>
        {this.props.children}
      </aside>
    );
  }
}

SidePanel.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  className: PropTypes.string,
  open: PropTypes.bool
};

const Body = (props) => {
  return <div className="sidepanel-body">{props.children}</div>;
};

Body.propTypes = {
  children: PropTypes.node
};

const Footer = (props) => {
  return <div className="sidepanel-footer">{props.children}</div>;
};

Footer.propTypes = {
  children: PropTypes.node
};


SidePanel.Body = Body;
SidePanel.Footer = Footer;
export default SidePanel;
