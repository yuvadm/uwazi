import PropTypes from 'prop-types';
import React from 'react';

const Badge = (props) => {
  let type = 8;
  if (props.red) {
    type = 1;
  }

  return (
    <span className={`item-type item-type-${type}`}>
      <span className="item-type__name">
        {props.children}
      </span>
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node,
  red: PropTypes.bool
};

export default Badge;
