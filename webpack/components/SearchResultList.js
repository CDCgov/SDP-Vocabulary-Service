import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchResult from './SearchResult';
import currentUserProps from "../prop-types/current_user_props";

export default class SearchResultList extends Component {
  render() {
    return (
      <div className="search-result-list">
        {this.props.searchResults.hits &&
          <div>
            <h1 className="search-result-heading">{this.title()} ({this.props.searchResults.hits && this.props.searchResults.hits.total && this.props.searchResults.hits.total})</h1>
            <hr/>
          </div>
        }
        {this.props.searchResults.hits && this.props.searchResults.hits.hits.map((sr, i) => {
          return(
            <SearchResult key={`${sr.Source.versionIndependentId}-${sr.Source.updatedAt}-${i}`}
                          type={sr.Type} result={sr} currentUser={this.props.currentUser}
                          handleSelectSearchResult={this.props.handleSelectSearchResult}
                          extraAction={this.props.extraAction} extraActionName={this.props.extraActionName}
                          isEditPage={this.props.isEditPage} fetchResponseSetPreview={this.props.fetchResponseSetPreview}
                          />
          );
        })}
      </div>
    );
  }

  title() {
    if (this.props.title) {
      return this.props.title;
    } else {
      return "Search Results";
    }
  }
}

SearchResultList.propTypes = {
  searchResults: PropTypes.object.isRequired,
  currentUser: currentUserProps,
  isEditPage: PropTypes.bool,
  handleSelectSearchResult: PropTypes.func,
  extraActionName: PropTypes.string,
  extraAction: PropTypes.func,
  title: PropTypes.string,
  fetchResponseSetPreview: PropTypes.func
};
