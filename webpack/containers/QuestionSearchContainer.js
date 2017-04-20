import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { addQuestion } from '../actions/questions_actions';
import { fetchSearchResults, fetchMoreSearchResults } from '../actions/search_results_actions';

import SearchResult from '../components/SearchResult';
import DashboardSearch from '../components/DashboardSearch';
import currentUserProps from "../prop-types/current_user_props";
import { surveillanceSystemsProps }from '../prop-types/surveillance_system_props';
import { surveillanceProgramsProps } from '../prop-types/surveillance_program_props';

class QuestionSearchContainer extends Component {
  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.setFiltersParent = this.setFiltersParent.bind(this);
    this.state = {
      searchTerms: '',
      progFilters: [],
      sysFilters: [],
      page: 1
    };
  }

  componentWillMount() {
    this.search('');
  }

  componentDidUpdate(_prevProps, prevState) {
    if(prevState != this.state) {
      let searchType = this.state.searchType;
      let searchTerms = this.state.searchTerms;
      if(searchType === '') {
        searchType = null;
      }
      if(searchTerms === ''){
        searchTerms = null;
      }
      this.props.fetchSearchResults(searchTerms, 'question', this.state.progFilters, this.state.sysFilters);
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
    this.props.fetchSearchResults(searchTerms, 'question', progFilters, sysFilters);
  }

  loadMore() {
    let searchTerms = this.state.searchTerms;
    let tempState = this.state.page + 1;
    if(this.state.searchTerms === '') {
      searchTerms = null;
    }
    this.props.fetchMoreSearchResults(searchTerms, searchType, tempState,
                                      this.state.progFilters,
                                      this.state.sysFilters);
    this.setState({page: tempState});
  }

  render() {
    const searchResults = this.props.searchResults;
    return (
      <div>
        <DashboardSearch search={this.search} surveillanceSystems={this.props.surveillanceSystems} surveillancePrograms={this.props.surveillancePrograms} setFiltersParent={this.setFiltersParent}/>
        <div className="load-more-search">
          {searchResults.hits && searchResults.hits.hits.map((q, i) => {
            return (
              <SearchResult key={`${q.Source.versionIndependentId}-${q.Source.updatedAt}-${i}`}
              type={q.Type} result={q} currentUser={this.props.currentUser}
              handleSelectSearchResult={() => this.props.addQuestion(this.props.form, q.Source)}
              isEditPage={true}/>
            );
          })}
          {searchResults.hits && searchResults.hits.total > 0 && this.state.page <= Math.floor(searchResults.hits.total / 10) &&
            <div id="load-more-btn" className="button button-action center-block" onClick={() => this.loadMore()}>LOAD MORE</div>
          }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    searchResults: state.searchResults,
    surveillanceSystems: state.surveillanceSystems,
    surveillancePrograms: state.surveillancePrograms,
    currentUser: state.currentUser
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({addQuestion, fetchSearchResults, fetchMoreSearchResults}, dispatch);
}

QuestionSearchContainer.propTypes = {
  addQuestion: PropTypes.func.isRequired,
  form: PropTypes.object,
  fetchSearchResults: PropTypes.func,
  fetchMoreSearchResults: PropTypes.func,
  currentUser: currentUserProps,
  searchResults: PropTypes.object,
  surveillanceSystems: surveillanceSystemsProps,
  surveillancePrograms: surveillanceProgramsProps
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionSearchContainer);
