import React, { Component, PropTypes } from 'react';
import ResponseSetWidget from './ResponseSetWidget';

export default class ResponseSetList extends Component {
  render() {
    return (
      <div className="response-set-list">
        {this.props.response_sets.map((rs) => {
          // Each List Item Component needs a key attribute for uniqueness:
          // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
          // In addition, we pass in our item data
          return <ResponseSetWidget key={rs.id} response_set={rs} routes={this.props.routes} />;
        })}
      </div>
    );
  }
}

ResponseSetList.propTypes = {
  response_sets: PropTypes.arrayOf(ResponseSetWidget.propTypes.response_set).isRequired,
  routes: ResponseSetWidget.propTypes.routes.isRequired
};
