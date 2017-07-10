import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchSearchResults, fetchMoreSearchResults } from '../actions/search_results_actions';

import SearchResult from '../components/SearchResult';
import DashboardSearch from '../components/DashboardSearch';
import currentUserProps from "../prop-types/current_user_props";
import { surveillanceSystemsProps }from '../prop-types/surveillance_system_props';
import { surveillanceProgramsProps } from '../prop-types/surveillance_program_props';

const QUESTION_SEARCH_CONTEXT = 'QUESTION_SEARCH_CONTEXT';

class QuestionSearchContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerms: '',
      progFilters: [],
      sysFilters: [],
      page: 1
    };
    this.search   = this.search.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.setFiltersParent = this.setFiltersParent.bind(this);
  }

  componentWillMount() {
    this.search('');
  }

  componentDidUpdate(_prevProps, prevState) {
    if(prevState.page === this.state.page && prevState.progFilters != undefined && (prevState.progFilters !== this.state.progFilters || prevState.sysFilters !== this.state.sysFilters)) {
      let searchType = this.state.searchType;
      let searchTerms = this.state.searchTerms;
      if(searchType === '') {
        searchType = null;
      }
      if(searchTerms === ''){
        searchTerms = null;
      }
      this.props.fetchSearchResults(QUESTION_SEARCH_CONTEXT, searchTerms, 'question', this.state.progFilters, this.state.sysFilters);
    }
  }

  setFiltersParent(newState) {
    this.setState(newState);
  }

  search(searchTerms, progFilters, sysFilters) {
    if(searchTerms === ''){
      searchTerms = null;
    }
    this.setState({searchTerms: searchTerms, progFilters: progFilters, sysFilters: sysFilters});
    this.props.fetchSearchResults(QUESTION_SEARCH_CONTEXT, searchTerms, 'question', progFilters, sysFilters);
  }

  loadMore() {
    let searchTerms = this.state.searchTerms;
    let tempState = this.state.page + 1;
    if(this.state.searchTerms === '') {
      searchTerms = null;
    }
    this.props.fetchMoreSearchResults(QUESTION_SEARCH_CONTEXT, searchTerms, 'question', tempState,
                                      this.state.progFilters,
                                      this.state.sysFilters);
    this.setState({page: tempState});
  }

  render() {
    const searchResults = this.props.searchResults;
    return (
      <div>
        <DashboardSearch search={this.search}
                         surveillanceSystems={this.props.surveillanceSystems}
                         surveillancePrograms={this.props.surveillancePrograms}
                         setFiltersParent={this.setFiltersParent}
                         searchSource={this.props.searchResults.Source} />
        <div className="load-more-search">
          {searchResults.hits && searchResults.hits.hits.map((q, i) => {
            return (
              <SearchResult key={`${q.Source.versionIndependentId}-${q.Source.updatedAt}-${i}`}
                            type={q.Type}
                            result={q}
                            isEditPage={true}
                            currentUser={this.props.currentUser}
                            handleSelectSearchResult={this.props.handleSelectSearchResult}
                            isSelected={this.props.selectedSearchResults[q.Id]} />
            );
          })}
          {searchResults.hits && searchResults.hits.total > 0 && this.state.page <= Math.floor(searchResults.hits.total / 10) &&
            <button id="load-more-btn" className="button button-action center-block" onClick={this.loadMore}>LOAD MORE</button>
          }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    searchResults: state.searchResults[QUESTION_SEARCH_CONTEXT] || {},
    surveillanceSystems: state.surveillanceSystems,
    surveillancePrograms: state.surveillancePrograms,
    currentUser: state.currentUser
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchSearchResults, fetchMoreSearchResults}, dispatch);
}

QuestionSearchContainer.propTypes = {
  handleSelectSearchResult: PropTypes.func.isRequired,
  selectedSearchResults: PropTypes.object.isRequired,
  fetchSearchResults: PropTypes.func,
  fetchMoreSearchResults: PropTypes.func,
  currentUser: currentUserProps,
  searchResults: PropTypes.object,
  surveillanceSystems: surveillanceSystemsProps,
  surveillancePrograms: surveillanceProgramsProps
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionSearchContainer);
