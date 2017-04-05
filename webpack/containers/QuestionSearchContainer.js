import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { addQuestion } from '../actions/questions_actions';
import { fetchSearchResults, fetchMoreSearchResults } from '../actions/search_results_actions';

import SearchResult from '../components/SearchResult';
import DashboardSearch from '../components/DashboardSearch';
import currentUserProps from "../prop-types/current_user_props";

class QuestionSearchContainer extends Component {
  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.state = {
      searchTerms: '',
      page: 1
    };
  }

  componentWillMount() {
    this.search('');
  }

  search(searchTerms) {
    if(searchTerms === ''){
      searchTerms = null;
    }
    this.setState({searchTerms: searchTerms});
    this.props.fetchSearchResults(searchTerms, 'question');
  }

  loadMore() {
    let searchTerms = this.state.searchTerms;
    let tempState = this.state.page + 1;
    if(this.state.searchTerms === '') {
      searchTerms = null;
    }
    this.props.fetchMoreSearchResults(searchTerms, 'question', tempState);
    this.setState({page: tempState});
  }

  render() {
    const searchResults = this.props.searchResults;
    return (
      <div>
        <DashboardSearch search={this.search} />
        <div className="load-more-search">
          {searchResults.hits && searchResults.hits.hits.map((q, i) => {
            return (
              <SearchResult key={`${q.Source.versionIndependentId}-${q.Source.updatedAt}-${i}`}
              type={q.Type} result={q} currentUser={this.props.currentUser}
              handleSelectSearchResult={() => this.props.addQuestion(this.props.form, q.Source)}/>
            );
          })}
          {searchResults.hits && searchResults.hits.total && this.state.page <= Math.floor(searchResults.hits.total / 10) &&
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
  searchResults: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionSearchContainer);
