import React, { Component, PropTypes } from 'react';
import keys from 'lodash/keys';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import flatten from 'lodash/flatten';
import values from 'lodash/values';

export default class Errors extends Component {
  render() {
    if (keys(this.props.errors).length > 0) {
      return (
        <div id="error_explanation">
          <h1>{this.errorCount()} error(s) prohibited this form from being saved:</h1>
          <ul>
          {map(this.errorList(), (e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      );
    } else {
      return <div id="error_explanation" />;
    }
  }

  errorCount() {
    return reduce(values(this.props.errors), (sum, v) => sum + v.length, 0);
  }

  errorList() {
    return flatten(keys(this.props.errors).map((k) => {
      return this.props.errors[k].map((e) => `${k} - ${e}`);
    }));
  }
}

Errors.propTypes = {
  errors: PropTypes.objectOf(PropTypes.array)
};
