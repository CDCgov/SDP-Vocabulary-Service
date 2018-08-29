import React from 'react';
import PropTypes from 'prop-types';

const BasicAlert = ({msg="An error has occurred...",severity='danger'}) => (
  <div className={`alert alert-${severity}`}>
    <i className="fa fa-exclamation-circle" aria-hidden="true"></i> {msg}
  </div>
);

BasicAlert.propTypes = {
  msg: PropTypes.string,
  severity: PropTypes.string
};

export default BasicAlert;
