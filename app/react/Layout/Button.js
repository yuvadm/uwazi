import PropTypes from 'prop-types';
import React from 'react';

const Button = (props) => {
  let className = props.icon ? `fa fa-${props.icon}` : 'fa fa-refresh';
  let buttonClass = 'btn btn-primary';
  if (props.success) {
    buttonClass = 'btn btn-success';
  }

  if (props.danger) {
    buttonClass = 'btn btn-danger';
  }
  return (
    <span onClick={props.onClick} className={buttonClass}>
      <i className={className}></i>
      <span className="btn-label">{props.children}</span>
    </span>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  icon: PropTypes.string,
  success: PropTypes.bool,
  danger: PropTypes.bool
};

export default Button;
