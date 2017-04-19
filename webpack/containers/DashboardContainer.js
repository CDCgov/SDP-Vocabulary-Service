import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { fetchStats } from '../actions/landing';
import { fetchSearchResults, fetchMoreSearchResults } from '../actions/search_results_actions';
import DashboardSearch from '../components/DashboardSearch';
import SearchResultList from '../components/SearchResultList';
import { surveillanceSystemsProps }from '../prop-types/surveillance_system_props';
import { surveillanceProgramsProps } from '../prop-types/surveillance_program_props';
import currentUserProps from '../prop-types/current_user_props';

class DashboardContainer extends Component {
  constructor(props){
    super(props);
    this.search = this.search.bind(this);
    this.selectType = this.selectType.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.state = {
      searchType: '',
      searchTerms: '',
      page: 1
    };
  }

  componentWillMount() {
    this.props.fetchStats();
    this.search('');
  }

  render() {
    const searchResults = this.props.searchResults;
    return (
      <div className="container">
        <div className="row dashboard">
          <div className="col-md-8">
            <div className="dashboard-details">
              <DashboardSearch search={this.search} surveillanceSystems={this.props.surveillanceSystems} surveillancePrograms={this.props.surveillancePrograms} />
              <div className="row">
                <div className="col-md-12">
                  {this.analyticsGroup(this.state.searchType)}
                </div>
              </div>
              <div className="load-more-search">
                <SearchResultList searchResults={this.props.searchResults} currentUser={this.props.currentUser} isEditPage={false} />
                {searchResults.hits && searchResults.hits.total > 0 && this.state.page <= Math.floor(searchResults.hits.total / 10) &&
                  <div id="load-more-btn" className="button button-action center-block" onClick={() => this.loadMore()}>LOAD MORE</div>
                }
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="dashboard-activity">
              {this.authorStats()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  loadMore() {
    let searchType = this.state.searchType;
    let searchTerms = this.state.searchTerms;
    let tempState = this.state.page + 1;
    if(this.state.searchType === '') {
      searchType = null;
    }
    if(this.state.searchTerms === '') {
      searchTerms = null;
    }
    this.props.fetchMoreSearchResults(searchTerms, searchType, tempState);
    this.setState({page: tempState});
  }

  search(searchTerms) {
    let searchType = null;
    if(this.state.searchType === '') {
      searchType = null;
    } else {
      searchType = this.state.searchType;
    }
    if(searchTerms === ''){
      searchTerms = null;
    }
    this.setState({searchTerms: searchTerms});
    this.props.fetchSearchResults(searchTerms, searchType);
  }

  selectType(searchType) {
    let searchTerms = null;
    if(this.state.searchTerms === '') {
      searchTerms = null;
    } else {
      searchTerms = this.state.searchTerms;
    }
    if(this.state.searchType === searchType) {
      this.setState({searchType: '', page: 1});
      searchType = null;
    } else {
      this.setState({searchType: searchType, page: 1});
    }
    this.props.fetchSearchResults(searchTerms, searchType);
  }

  analyticsGroup(searchType) {
    return (
    <div className="analytics-group">
      <ul className="analytics-list-group">
        <li id="questions-analytics-item" className={"analytics-list-item btn" + (searchType === 'question' ? " analytics-active-item" : "")} onClick={() => this.selectType('question')}>
          <div>
            <i className="fa fa-tasks fa-3x item-icon" aria-hidden="true"></i>
            <p className="item-value">{this.props.questionCount}</p>
            <h2 className="item-title">Questions</h2>
          </div>
        </li>
        <li id="response-sets-analytics-item" className={"analytics-list-item btn" + (searchType === 'response_set' ? " analytics-active-item" : "")} onClick={() => this.selectType('response_set')}>
          <div>
            <i className="fa fa-list fa-3x item-icon" aria-hidden="true"></i>
            <p className="item-value">{this.props.responseSetCount}</p>
            <h2 className="item-title">Response Sets</h2>
          </div>
          </li>
        <li id="forms-analytics-item" className={"analytics-list-item btn" + (searchType === 'form' ? " analytics-active-item" : "")} onClick={() => this.selectType('form')}>
          <div>
            <i className="fa fa-list-alt fa-3x item-icon" aria-hidden="true"></i>
            <p className="item-value">{this.props.formCount}</p>
            <h2 className="item-title">Forms</h2>
          </div>
          </li>
        <li id="surveys-analytics-item" className={"analytics-list-item btn" + (searchType === 'survey' ? " analytics-active-item" : "")} onClick={() => this.selectType('survey')}>
          <div>
            <i className="fa fa-clipboard fa-3x item-icon" aria-hidden="true"></i>
            <p className="item-value">{this.props.surveyCount}</p>
            <h2 className="item-title">Surveys</h2>
          </div>
          </li>
      </ul>
      {searchType != '' && <a href="#" onClick={() => this.selectType(searchType)}>Clear Filter</a>}
    </div>);
  }

  authorStats() {
    return (
      <div className="recent-items-panel">
        <div className="recent-items-heading">My Stuff</div>
        <div className="recent-items-body">
          <ul className="list-group">
            <li className="recent-item-list">
              <div className="recent-items-icon"><i className="fa fa-tasks recent-items-icon" aria-hidden="true"></i></div>
              <Link to="/mystuff" className="recent-items-value">{this.props.myQuestionCount} Questions</Link>
            </li>
            <li className="recent-item-list">
              <div className="recent-items-icon"><i className="fa fa-list recent-items-icon" aria-hidden="true"></i></div>
              <Link to="/mystuff" className="recent-items-value">{this.props.myResponseSetCount} Response Sets</Link>
            </li>
            <li className="recent-item-list">
              <div className="recent-items-icon"><i className="fa fa-list-alt recent-items-icon" aria-hidden="true"></i></div>
              <Link to="/mystuff" className="recent-items-value">{this.props.myFormCount} Forms</Link>
            </li>
            <li className="recent-item-list">
              <div className="recent-items-icon"><i className="fa fa-clipboard recent-items-icon" aria-hidden="true"></i></div>
              <Link to="/mystuff" className="recent-items-value">{this.props.mySurveyCount} Surveys</Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    formCount: state.stats.formCount,
    questionCount: state.stats.questionCount,
    responseSetCount: state.stats.responseSetCount,
    surveyCount: state.stats.surveyCount,
    myFormCount: state.stats.myFormCount,
    myQuestionCount: state.stats.myQuestionCount,
    myResponseSetCount: state.stats.myResponseSetCount,
    mySurveyCount: state.stats.mySurveyCount,
    searchResults: state.searchResults,
    surveillanceSystems: state.surveillanceSystems,
    surveillancePrograms: state.surveillancePrograms,
    currentUser: state.currentUser
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchStats, fetchSearchResults, fetchMoreSearchResults}, dispatch);
}

DashboardContainer.propTypes = {
  formCount: PropTypes.number,
  questionCount: PropTypes.number,
  responseSetCount: PropTypes.number,
  surveyCount: PropTypes.number,
  myFormCount: PropTypes.number,
  myQuestionCount: PropTypes.number,
  myResponseSetCount: PropTypes.number,
  mySurveyCount: PropTypes.number,
  fetchStats: PropTypes.func,
  fetchSearchResults: PropTypes.func,
  fetchMoreSearchResults: PropTypes.func,
  currentUser: currentUserProps,
  searchResults: PropTypes.object,
  surveillanceSystems: surveillanceSystemsProps,
  surveillancePrograms: surveillanceProgramsProps
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);
