import React, { Component, PropTypes } from 'react';
import SearchResult from './SearchResult';

export default class SearchResultList extends Component {
  render() {
    return (
      <div className="search-result-list">
        {this.props.searchResults.hits &&
          <row className="search-result-heading">
            <div>Search Results ({this.props.searchResults.hits.total})</div>
            <hr/><br/>
          </row>
        }
        {this.props.searchResults.hits && this.props.searchResults.hits.hits.map((sr) => {
          return(
            <SearchResult key={sr.Id} type={sr.Type} result={sr.Source} />
          );
        })}
      </div>
    );
  }
}

SearchResultList.propTypes = {
  searchResults: PropTypes.object.isRequired
};
