import React, { Component, PropTypes } from 'react';
import SearchResult from './SearchResult';
import currentUserProps from "../prop-types/current_user_props";

export default class SearchResultList extends Component {
  render() {
    return (
      <div className="search-result-list">
        {this.props.searchResults.hits &&
          <row className="search-result-heading">
            <div>Search Results ({this.props.searchResults.hits && this.props.searchResults.hits.total && this.props.searchResults.hits.total})</div>
            <hr/>
          </row>
        }
        {this.props.searchResults.hits && this.props.searchResults.hits.hits.map((sr, i) => {
          return(
            <SearchResult key={`${sr.Source.versionIndependentId}-${sr.Source.updatedAt}-${i}`} type={sr.Type} result={sr} currentUser={this.props.currentUser} handleSelectSearchResult={this.props.handleSelectSearchResult} />
          );
        })}
      </div>
    );
  }
}

SearchResultList.propTypes = {
  searchResults: PropTypes.object.isRequired,
  currentUser: currentUserProps,
  handleSelectSearchResult: PropTypes.func
};
