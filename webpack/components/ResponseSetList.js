import React, { Component, PropTypes } from 'react';
import ResponseSetWidget from './ResponseSetWidget';
import _ from 'lodash';

export default class ResponseSetList extends Component {
  render() {
    return (
      <div className="response-set-list">
        {_.values(this.props.responseSets).map((rs) => {
          return <ResponseSetWidget key={rs.id} responseSet={rs} routes={this.props.routes} />;
        })}
      </div>
    );
  }
}

ResponseSetList.propTypes = {
  responseSets: PropTypes.object.isRequired,
  routes: ResponseSetWidget.propTypes.routes.isRequired
};
