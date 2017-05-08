import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
export default class Errors extends Component {
  render() {
    if (_.keys(this.props.errors).length > 0) {
      return (
        <div id="error_explanation">
          <h1 aria-live="assertive">{this.errorCount()} error(s) prohibited this form from being saved:</h1>
          <ul>
          {_.map(this.errorList(), (e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      );
    } else {
      return <div id="error_explanation" />;
    }
  }

  errorCount() {
    return _.reduce(_.values(this.props.errors), (sum, v) => sum + v.length, 0);
  }

  errorList() {
    return _.flatten(_.keys(this.props.errors).map((k) => {
      return this.props.errors[k].map((e) => `${k} - ${e}`);
    }));
  }
}

Errors.propTypes = {
  errors: PropTypes.objectOf(PropTypes.array)
};
