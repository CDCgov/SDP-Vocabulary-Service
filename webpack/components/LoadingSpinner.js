import React from 'react';
import PropTypes from 'prop-types';

const LoadingSpinner = ({msg="Loading..."}) => (
  <div>
    <i className="fa fa-spinner fa-spin" aria-hidden="true" /> {msg}
  </div>
);

LoadingSpinner.propTypes = {
  msg: PropTypes.string
};

export default LoadingSpinner;
