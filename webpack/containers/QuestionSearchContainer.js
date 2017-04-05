import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { addQuestion } from '../actions/questions_actions';
import { fetchSearchResults, fetchMoreSearchResults } from '../actions/search_results_actions';

import SearchResult from '../components/SearchResult';
import DashboardSearch from '../components/DashboardSearch';
import currentUserProps from "../prop-types/current_user_props";
import QuestionResults from '../components/QuestionResults';
import SearchBar from '../components/SearchBar';
import _ from 'lodash';

class QuestionSearchContainer extends Component {
  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.state = {
      questions: props.allQs,
      responseSets: props.allRs,
      allQs: props.allQs,
      searchTerms: '',
      page: 1
    };
  }

  componentWillMount() {
    this.search('');
  }

  componentWillUpdate(prevProps) {
    if(prevProps.allQs != this.props.allQs) {
      this.setState({
        questions: this.props.allQs
      });
    }
  }

  questionFilter(term) {
    var questionsFiltered = [];

    if (term == '') {
      questionsFiltered = this.props.allQs;
    } else {
      this.props.allQs.map((q) => {
        if (q.content.toLowerCase().includes(term.toLowerCase())){
          questionsFiltered.push(q);
        }
      });
    }

    this.setState({
      questions: questionsFiltered
    });
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
    return (
      <div>
        <DashboardSearch search={this.search} />
        <SearchBar modelName='question' onSearchTermChange={term => this.questionFilter(term)} />
        <QuestionResults questions={this.props.reverseSort ? this.state.questions.reverse() : this.state.questions}
                         responseSets={_.values(this.state.responseSets)}
                         addQuestion={this.props.addQuestion}
                         form={this.props.form} />
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
  allQs: React.PropTypes.array,
  allRs: React.PropTypes.array,
  addQuestion: React.PropTypes.func.isRequired,
  form: React.PropTypes.object,
  reverseSort: React.PropTypes.bool,
  fetchSearchResults: PropTypes.func,
  fetchMoreSearchResults: PropTypes.func,
  currentUser: currentUserProps,
  searchResults: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionSearchContainer);
