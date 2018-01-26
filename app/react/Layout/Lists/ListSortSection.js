import PropTypes from 'prop-types';
import React from 'react';

const ListSortSection = (props) => {
  return <div className="sort-by">
    {props.children}
  </div>;
};

ListSortSection.propTypes = {
  children: PropTypes.node
};

const ListSortLabel = (props) => {
  return <div className="documents-counter">
    {props.children}
  </div>;
};

ListSortLabel.propTypes = {
  children: PropTypes.node
};

export default ListSortSection;
export {ListSortLabel};
