import React, { Component, PropTypes } from 'react';
import SearchResult from './SearchResult';
import currentUserProps from "../prop-types/current_user_props";

export default class SearchResultList extends Component {
  render() {
    return (
      <div className="search-result-list">
        {this.props.searchResults.hits &&
          <row>
            <h1 className="search-result-heading">Search Results ({this.props.searchResults.hits && this.props.searchResults.hits.total && this.props.searchResults.hits.total})</h1>
            <hr/>
          </row>
        }
        {this.props.searchResults.hits && this.props.searchResults.hits.hits.map((sr, i) => {
          return(
            <SearchResult key={`${sr.Source.versionIndependentId}-${sr.Source.updatedAt}-${i}`}
                          type={sr.Type} result={sr} currentUser={this.props.currentUser}
                          handleSelectSearchResult={this.props.handleSelectSearchResult}
                          extraAction={this.props.extraAction} extraActionName={this.props.extraActionName}
                          isEditPage={this.props.isEditPage}
                          />
          );
        })}
      </div>
    );
  }
}

SearchResultList.propTypes = {
  searchResults: PropTypes.object.isRequired,
  currentUser: currentUserProps,
  isEditPage: PropTypes.bool,
  handleSelectSearchResult: PropTypes.func,
  extraActionName: PropTypes.string,
  extraAction: PropTypes.func
};
