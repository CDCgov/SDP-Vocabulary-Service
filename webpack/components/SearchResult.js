import React, { Component, PropTypes } from 'react';

export default class SearchResult extends Component {
  render() {
    return (
      <div className="search-result">
        {this.props.result.name}
      </div>
    );
  }
}

SearchResult.propTypes = {
  type: PropTypes.string,
  result: PropTypes.object.isRequired
};