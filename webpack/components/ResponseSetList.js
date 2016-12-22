import React, { Component, PropTypes } from 'react';
import ResponseSetWidget from './ResponseSetWidget';

export default class ResponseSetList extends Component {
  render() {
    return (
      <div className="response-set-list">
        {this.props.responseSets.map((rs) => {
          // Each List Item Component needs a key attribute for uniqueness:
          // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
          // In addition, we pass in our item data
          return <ResponseSetWidget key={rs.id} responseSet={rs} routes={this.props.routes} />;
        })}
      </div>
    );
  }
}

ResponseSetList.propTypes = {
  responseSets: PropTypes.arrayOf(ResponseSetWidget.propTypes.responseSet).isRequired,
  routes: ResponseSetWidget.propTypes.routes.isRequired
};
