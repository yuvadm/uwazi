import PropTypes from 'prop-types';
import React from 'react';

const Button = (props) => {
  let className = props.icon ? `fa fa-${props.icon}` : 'fa fa-refresh';
  return (
    <span onClick={props.onClick} className={props.success ? 'btn btn-success' : 'btn btn-primary'}>
      <i className={className}></i>
      <span className="btn-label">{props.children}</span>
    </span>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  icon: PropTypes.string,
  success: PropTypes.bool
};

export default Button;
