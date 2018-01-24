import PropTypes from 'prop-types';
import React from 'react';

const DocumentsListSort = (props) => {
  return <div className="sort-by">
    <div className="documents-counter">
      <span className="documents-counter-label">{props.total}</span>
      <span className="documents-counter-sort">{props.label}:</span>
    </div>
    {props.children}
  </div>;
};

DocumentsListSort.propTypes = {
  total: PropTypes.node,
  label: PropTypes.string,
  children: PropTypes.node
};

export default DocumentsListSort;
