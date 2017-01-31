import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
export default class Errors extends Component {
  render() {
    if (_.keys(this.props.errors).length > 0) {
      return (
        <div id="error_explanation">
          <h2>{this.errorCount()} error(s) prohibited this form from being saved:</h2>
          <ul>
          {_.forOwn(this.props.errors, (field) => {
            return _.map(this.props.errors[field], (e) => {
              return <li>{field} - {e}</li>;
            });
          })}
          </ul>
        </div>
      );
    }
  }

  errorCount() {
    return _.reduce(_.values(this.props.errors), 'length', 0);
  }
}

Errors.propTypes = {
  errors: PropTypes.objectOf(PropTypes.array)
};
