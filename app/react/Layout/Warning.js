import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from 'UI';

const Tip = ({ children }) => (
  <span className="property-help">
    <Icon icon="exclamation-triangle" />
    <div className="property-description">
      {children}
    </div>
  </span>
);

Tip.propTypes = {
  children: PropTypes.string.isRequired
};

export default Tip;
