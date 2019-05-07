import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import { Modal, Button } from 'react-bootstrap';

import { setSteps } from '../actions/tutorial_actions';
import { fetchResponseTypes } from '../actions/response_type_actions';
import { fetchCategories } from '../actions/category_actions';
import { fetchSearchResults, exportSearch, fetchMoreSearchResults, setLastSearch, fetchLastSearch, SearchParameters, fetchSuggestions } from '../actions/search_results_actions';
import { clearBreadcrumb } from '../actions/breadcrumb_actions';

import DashboardSearch from '../components/DashboardSearch';
import SearchManagerComponent from '../components/SearchManagerComponent';
import SignUpModal from '../components/accounts/SignUpModal';
import SearchResultList from '../components/SearchResultList';
import currentUserProps from '../prop-types/current_user_props';
import { surveillanceSystemsProps }from '../prop-types/surveillance_system_props';
import { surveillanceProgramsProps } from '../prop-types/surveillance_program_props';
import { signUp } from '../actions/current_user_actions';
import { clearAjaxStatus } from '../actions/landing';
import { gaSend } from '../utilities/GoogleAnalytics';


const DASHBOARD_CONTEXT = 'DASHBOARD_CONTEXT';
const NO_SEARCH_RESULTS = {};

class DashboardContainer extends SearchManagerComponent {
  constructor(props){
    super(props);
    this.search = this.search.bind(this);
    this.changeFiltersCallback = this.changeFiltersCallback.bind(this);
    this.selectType = this.selectType.bind(this);
    this.selectGroup = this.selectGroup.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.openSignUpModal = this.openSignUpModal.bind(this);
    this.closeSignUpModal = this.closeSignUpModal.bind(this);
    this.currentSearchParameters = this.currentSearchParameters.bind(this);
    this.state = {
      type: '',
      searchTerms: '',
      programFilter: [],
      systemFilter: [],
      methodsFilter: [],
      mostRecentFilter: false,
      contentSince: null,
      ombDate: null,
      sourceFilter: '',
      statusFilter: '',
      stageFilter: '',
      categoryFilter: '',
      rtFilter: '',
      preferredFilter: false,
      retiredFilter: false,
      ombFilter: false,
      signUpOpen: false,
      firstTimeOpen: false,
      myStuffFilter: false,
      page: 1,
      groupFilterId: 0
    };
  }

  componentWillMount() {
    gaSend('send', 'pageview', '/SDP-V/Dashboard');
    let lastSearch = this.props.lastSearch;
    let searchParameters = new SearchParameters(this.props.lastSearch);
    if(lastSearch.page > 1 && lastSearch.page !== this.state.page) {
      this.props.fetchLastSearch(DASHBOARD_CONTEXT, searchParameters);
      this.setState({page: lastSearch.page});
    } else {
      this.props.fetchSearchResults(DASHBOARD_CONTEXT, searchParameters);
    }
    this.props.fetchCategories();
    this.props.fetchResponseTypes();
    this.props.clearAjaxStatus();
    this.setState(searchParameters);
    this.props.clearBreadcrumb();
  }

  componentDidUpdate(prevProps) {
    if(prevProps != this.props) {
      let steps = [
        {
          title: 'Help',
          text: 'Click next to see a step by step walkthrough for using this page. To see more detailed information about this application and actions you can take <a class="tutorial-link" id="tutorial-link" tabindex="3" href="#help">click here to view the full Help Documentation.</a> Accessible versions of these steps are also duplicated in the help documentation.',
          selector: '.help-link',
          position: 'bottom',
        },
        {
          title: 'Dashboard Search',
          text: 'Type in your search term and search across all items by default. Results include private items you own and public items.',
          selector: '.search-input',
          position: 'bottom',
        },
        {
          title: 'Type Filters',
          text: 'Click on any of the type boxes to highlight them and toggle on filtering by that single item type.',
          selector: '.analytics-list-group',
          position: 'right',
        },
        {
          title: 'Advanced Search Filters',
          text: 'Click Advanced Link to see additional filters you can apply to your search.',
          selector: '.search-group',
          position: 'right',
        }];
      if(isEmpty(this.props.currentUser)) {
        steps = steps.concat([
          {
            title: 'Log In',
            text: 'If you already have an account you can log in to unlock more features by clicking the log in link in the top right of the dashboard page.',
            selector: '.log-in-link',
            position: 'left',
          }]);
      } else {
        steps = steps.concat([
          {
            title: 'My Stuff Filtering',
            text: 'Click on any of the rows in the My Stuff Analytics panel to filter by items you authored.',
            selector: '.recent-items-body',
            position: 'left',
          },
          {
            title: 'Group Filtering',
            text: 'If you belong to a group you may use the dropdown in the right panel to select a group, this will filter all search results limiting to content owned by that group.',
            selector: '.recent-items-group-heading',
            position: 'left',
          },
          {
            title: 'Create Menu',
            text: 'Click the create menu and then select an item type to author a new item.',
            selector: '.create-menu',
            position: 'bottom',
          },
          {
            title: 'Notifications',
            text: 'Click the alerts dropdown to see any new notifications about your content.',
            selector: '.notification-dropdown',
            position: 'bottom',
          },
          {
            title: 'Manage Account',
            text: 'Click your e-mail to see various account management options.',
            selector: '.account-dropdown',
            position: 'bottom',
          }]);
      }
      this.props.setSteps(steps);
    }
  }

  render() {
    let loggedIn = ! isEmpty(this.props.currentUser);
    const searchResults = this.props.searchResults;
    const fetchSuggestions = debounce(this.props.fetchSuggestions, 300);
    const groupObj = this.props.currentUser.groups && this.props.currentUser.groups.find((g) => g.id === parseInt(this.state.groupFilterId, 10));
    return (
      <div>
        {!loggedIn &&
          <div className="row">
            <SignUpModal signUp={this.props.signUp} show={this.state.signUpOpen}
              closer={() => this.closeSignUpModal()}
              surveillanceSystems={this.props.surveillanceSystems}
              surveillancePrograms={this.props.surveillancePrograms} />
            {this.firstTimeModal()}
            <div className="cdc-jumbotron">
              <div className="container">
                <div className="row">
                   <div className="col-md-8">
                      <div className="cdc-promo-banner">
                        <h1 className="banner-title">CDC Vocabulary Service</h1>
                        <h2 className="banner-subtitle">Author Questions, Response Sets, Sections, and Surveys</h2>
                        <p className="lead">The Vocabulary Service allows users to author their own questions and response sets, and to reuse others’ wording for their new data collection needs when applicable. A goal of this service is to increase consistency by reducing the number of different ways that CDC asks for similar information, lowering the reporting burden on partners.</p>
                        <p><a className="btn btn-lg button-submit" href="#" tabIndex="2" role="button" onClick={() => this.setState({firstTimeOpen: true})}>First Time Login</a></p>
                      </div>
                    </div>
                    <div className="col-md-4"></div>
                </div>
              </div>
            </div>
          </div>
        }
        <div className="container">
          <div className="row basic-bg">
            <div className="col-md-8">
              <div className="dashboard-details">
                <DashboardSearch search={this.search} surveillanceSystems={this.props.surveillanceSystems}
                                 surveillancePrograms={this.props.surveillancePrograms}
                                 categories={this.props.categories}
                                 responseTypes={this.props.responseTypes}
                                 changeFiltersCallback={this.changeFiltersCallback}
                                 searchSource={this.props.searchResults.Source}
                                 lastSearch={this.props.lastSearch}
                                 suggestions={this.props.suggestions}
                                 fetchSuggestions={fetchSuggestions}/>
                {this.state.groupFilterId === '-1' &&
                  <div className="adv-filter-list">Filtering to content owned by any of your groups</div>
                }
                {this.state.groupFilterId > 0 &&
                  <div className="group-filter-info">
                  <div className="adv-filter-list">

                  <a className="panel-toggle" data-toggle="collapse" href="#collapse_group_detail"><i className="fa fa-bars" aria-hidden="true"></i>
                  <text className="sr-only">Click link to expand information about group</text>
                  Filtering by content in group: {groupObj.name}</a></div>
                  <div className="group-detail panel-collapse panel-details collapse" id="collapse_group_detail">
                    <div className="panel-body">
                    <p><strong>Description:</strong> {groupObj.description}</p>
                    <p><strong>Group Members</strong></p>
                    <ul>
                      {groupObj.users && groupObj.users.map((member) => {
                        return  <li key={member.id}> {member.firstName} {member.lastName} (<a href="mailto:{member.email}">{member.email}</a>)</li>;
                      })}
                    </ul>
                  </div>
                  </div>
                </div>
                }
                <div>
                    {this.analyticsGroup(this.state.type)}
                </div>
                <div className="load-more-search">
                  <SearchResultList searchResults={this.props.searchResults} currentUser={this.props.currentUser} isEditPage={false} />
                  {searchResults.hits && searchResults.hits.total > 0 && this.state.page <= Math.floor((searchResults.hits.total-1) / 10) &&
                    <button id="load-more-btn" className="button button-action center-block" onClick={() => this.loadMore()}>LOAD MORE</button>
                  }
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="dashboard-activity">
                {this.authorStats(this.state.type, this.state.myStuffFilter, loggedIn)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  openSignUpModal() {
    this.setState({signUpOpen: true});
  }

  closeSignUpModal() {
    this.setState({signUpOpen: false});
  }

  loadMore() {
    super.loadMore(DASHBOARD_CONTEXT, (searchParameters) => this.props.setLastSearch(searchParameters));
  }

  search(searchParameters) {
    super.search(searchParameters, DASHBOARD_CONTEXT, (searchParameters) => this.props.setLastSearch(searchParameters));
  }

  selectType(searchType, myStuffToggle=false) {
    let newState = {};
    if(myStuffToggle) {
      if(this.state.type === searchType && this.state.myStuffFilter) {
        newState.myStuffFilter = false;
      } else {
        newState.myStuffFilter = true;
      }
    } else {
      newState.myStuffFilter = false;
    }
    if(this.state.type === searchType && !(myStuffToggle && !this.state.myStuffFilter)) {
      newState.type = '';
      newState.page = 1;
    } else {
      newState.type = searchType;
      newState.page = 1;
    }
    this.setState(newState);
    let newSearchParams = Object.assign(this.currentSearchParameters(), newState);
    this.props.fetchSearchResults(DASHBOARD_CONTEXT, newSearchParams);
    this.props.setLastSearch(newSearchParams);
  }

  firstTimeModal() {
    return (
      <Modal animation={false} show={this.state.firstTimeOpen} onHide={() => this.setState({ firstTimeOpen: false })} aria-label="First time login information">
        <Modal.Header closeButton bsStyle='concept'>
          <Modal.Title componentClass="h1"><i className="fa fa-exclamation-triangle simple-search-icon" aria-hidden="true"><text className="sr-only">Warning for</text></i> New Users</Modal.Title>
        </Modal.Header>
        <Modal.Body bsStyle='concept'>
          <h2 className="help-section-subtitle" id="logging-in">Logging In</h2>
          <p>The CDC Surveillance Data Platform (SDP) Vocabulary Service uses Secure Access Management Services (SAMS) for authentication. If you already have an account that has been added to the CDC SDP Vocabulary Service SAMS Activity Group, simply click the "Continue to SAMS" button below and you should then be redirected to login* with your credentials.</p>
          <p id="trouble"><strong>*Trouble logging in:</strong> If you receive an error message after entering your credentials into SAMS, please email <a href="mailto:surveillanceplatform@cdc.gov">surveillanceplatform@cdc.gov</a> to request Surveillance Data Platform Vocabulary Service SAMS Activity Group membership.</p>
        </Modal.Body>
        <Modal.Footer>
          <a className="btn button-submit" role="button" href="/users/auth/openid_connect">Continue to SAMS</a>
          <Button onClick={() => this.setState({ firstTimeOpen: false })} bsStyle="default">Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  selectGroup(gid=0) {
    let newState = {};
    newState.groupFilterId = gid;
    this.setState(newState);
    let newSearchParams = Object.assign(this.currentSearchParameters(), newState);
    this.props.fetchSearchResults(DASHBOARD_CONTEXT, newSearchParams);
    this.props.setLastSearch(newSearchParams);
  }

  analyticsGroup(searchType) {
    return (
    <div className="analytics-group" role="navigation" aria-label="Analytics">
      <ul className="analytics-list-group">
        <button id="response-sets-analytics-item" tabIndex="4" className={"analytics-list-item btn" + (searchType === 'response_set' ? " analytics-active-item" : "")} onClick={() => this.selectType('response_set')}>
          <div>
            <i className="fa fa-list fa-3x item-icon" aria-hidden="true"></i>
            <p className="item-value" aria-describedby="response-sets-analytics-item-title">{this.props.responseSetCount}</p>
            <h2 className="item-title" id="response-sets-analytics-item-title">Response Sets</h2>
          </div>
        </button>
        <button id="questions-analytics-item" tabIndex="4" className={"analytics-list-item btn" + (searchType === 'question' ? " analytics-active-item" : "")} onClick={() => this.selectType('question')}>
          <div>
            <i className="fa fa-tasks fa-3x item-icon" aria-hidden="true"></i>
            <p className="item-value" aria-describedby="question-analytics-item-title">{this.props.questionCount}</p>
            <h2 className="item-title" id="question-analytics-item-title">Questions</h2>
          </div>
        </button>
        <button id="sections-analytics-item" tabIndex="4" className={"analytics-list-item btn" + (searchType === 'section' ? " analytics-active-item" : "")} onClick={() => this.selectType('section')}>
          <div>
            <i className="fa fa-list-alt fa-3x item-icon" aria-hidden="true"></i>
            <p className="item-value" aria-describedby="sections-analytics-item-title">{this.props.sectionCount}</p>
            <h2 className="item-title" id="sections-analytics-item-title">Sections</h2>
          </div>
        </button>
        <button id="surveys-analytics-item" tabIndex="4" className={"analytics-list-item btn" + (searchType === 'survey' ? " analytics-active-item" : "")} onClick={() => this.selectType('survey')}>
          <div>
            <i className="fa fa-clipboard fa-3x item-icon" aria-hidden="true"></i>
            <p className="item-value" aria-describedby="surveys-analytics-item-title">{this.props.surveyCount}</p>
            <h2 className="item-title" id="surveys-analytics-item-title">Surveys</h2>
          </div>
        </button>
      </ul>
      {(searchType !== '' && searchType !== undefined && searchType !== null)&& <a href="#" tabIndex="4" onClick={() => this.selectType(searchType)}>Clear Type Filter</a>}
    </div>);
  }

  authorStats(searchType, myStuffFilter, loggedIn) {
    const groups = this.props.currentUser ? this.props.currentUser.groups : [];
    return (
      <div className="recent-items-panel">
        {loggedIn && <div className="recent-items-heading">My Stuff</div>}
        {loggedIn && <div className="recent-items-body">
          <div className="list-group" name="Filter by stuff you own">
            <button tabIndex="4" className={"recent-item-list btn" + (searchType === 'response_set' && myStuffFilter ? " analytics-active-item" : "")} onClick={() => this.selectType('response_set', true)}>
              <div className="recent-items-icon"><i className="fa fa-list recent-items-icon" aria-hidden="true"></i></div>
              <text className="sr-only">Click button to filter search results by response sets you own.</text>
              <div className="recent-items-value">{this.props.myResponseSetCount} Response Sets</div>
            </button>
            <button tabIndex="4" className={"recent-item-list btn" + (searchType === 'question' && myStuffFilter ? " analytics-active-item" : "")} onClick={() => this.selectType('question', true)}>
              <div className="recent-items-icon"><i className="fa fa-tasks recent-items-icon" aria-hidden="true"></i></div>
              <text className="sr-only">Click button to filter search results by questions you own.</text>
              <div className="recent-items-value">{this.props.myQuestionCount} Questions</div>
            </button>
            <button tabIndex="4" className={"recent-item-list btn" + (searchType === 'section' && myStuffFilter ? " analytics-active-item" : "")} onClick={() => this.selectType('section', true)}>
              <div className="recent-items-icon"><i className="fa fa-list-alt recent-items-icon" aria-hidden="true"></i></div>
              <text className="sr-only">Click button to filter search results by sections you own.</text>
              <div className="recent-items-value">{this.props.mySectionCount} Sections</div>
            </button>
            <button tabIndex="4" className={"recent-item-list btn" + (searchType === 'survey' && myStuffFilter ? " analytics-active-item" : "")} onClick={() => this.selectType('survey', true)}>
              <div className="recent-items-icon"><i className="fa fa-clipboard recent-items-icon" aria-hidden="true"></i></div>
              <text className="sr-only">Click button to filter search results by surveys you own.</text>
              <div className="recent-items-value">{this.props.mySurveyCount} Surveys</div>
            </button>
          </div>
          {myStuffFilter ? (<a href="#" className="center-block text-center" onClick={() => this.selectType(searchType)}>Clear My Stuff Filter</a>) : (
            <a href="#" tabIndex="4" className="center-block text-center" onClick={() => this.selectType(searchType, true)}>Filter by My Stuff</a>
          )}
        </div>}
        {loggedIn && <div className="recent-items-heading"></div>}
        {loggedIn && groups.length > 0 && this.props.searchResults.Source !== 'simple_search' &&
          <div>
            <div className="recent-items-group-heading">Filter by Group</div>
            <div className="recent-items-body">
              <label className="input-label" htmlFor="groupFilterId" aria-hidden='true' hidden='true'>Group Select</label>
              <select tabIndex="4" className="input-group-select" name="groupFilterId" id="groupFilterId" value={this.state.groupFilterId} onChange={(e) => this.selectGroup(e.target.value)} >
                <option value={0}></option>
                {groups.map((g) => {
                  return <option key={g.id} value={g.id}>{g.name}</option>;
                })}
                <option disabled>----------------------------</option>
                <option value={-1}>All My Groups</option>
              </select>
              {this.state.groupFilterId !== 0 && <a href="#" tabIndex="4" className="center-block text-center" onClick={() => this.selectGroup(0)}>Clear Groups Filter</a>}
            </div>
          </div>
        }
        {loggedIn && <div className="recent-items-heading"></div>}
        {this.props.searchResults.Source !== 'simple_search' && <div>
          <div className="recent-items-group-heading">Download Search Result Report</div>
          <div className="recent-items-body">
            <a className="recent-item-list" href={`/elasticsearch/export?${Object.keys(this.currentSearchParameters().toSearchParameters()).map(key => key + '=' + this.currentSearchParameters().toSearchParameters()[key]).join('&')}`}>Download <i className="fa fa-download" aria-hidden="true"></i></a>
          </div>
        </div>}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    sectionCount: state.stats.sectionCount,
    questionCount: state.stats.questionCount,
    responseSetCount: state.stats.responseSetCount,
    surveyCount: state.stats.surveyCount,
    mySectionCount: state.stats.mySectionCount,
    myQuestionCount: state.stats.myQuestionCount,
    myResponseSetCount: state.stats.myResponseSetCount,
    mySurveyCount: state.stats.mySurveyCount,
    searchResults: state.searchResults[DASHBOARD_CONTEXT] || NO_SEARCH_RESULTS,
    lastSearch: state.lastSearch,
    suggestions: state.suggestions,
    surveillanceSystems: state.surveillanceSystems,
    surveillancePrograms: state.surveillancePrograms,
    currentUser: state.currentUser,
    categories: state.categories,
    responseTypes: state.responseTypes
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({setSteps, clearAjaxStatus, fetchResponseTypes, fetchCategories, fetchSearchResults, exportSearch, setLastSearch, fetchLastSearch, fetchMoreSearchResults, fetchSuggestions, signUp, clearBreadcrumb}, dispatch);
}

DashboardContainer.propTypes = {
  sectionCount: PropTypes.number,
  questionCount: PropTypes.number,
  responseSetCount: PropTypes.number,
  surveyCount: PropTypes.number,
  mySectionCount: PropTypes.number,
  myQuestionCount: PropTypes.number,
  myResponseSetCount: PropTypes.number,
  mySurveyCount: PropTypes.number,
  setSteps: PropTypes.func,
  clearAjaxStatus: PropTypes.func,
  fetchResponseTypes: PropTypes.func,
  fetchCategories: PropTypes.func,
  fetchSearchResults: PropTypes.func,
  exportSearch: PropTypes.func,
  setLastSearch: PropTypes.func,
  fetchLastSearch: PropTypes.func,
  fetchSuggestions: PropTypes.func,
  lastSearch: PropTypes.object,
  fetchMoreSearchResults: PropTypes.func,
  signUp: PropTypes.func,
  currentUser: currentUserProps,
  categories: PropTypes.object,
  responseTypes: PropTypes.object,
  searchResults: PropTypes.object,
  suggestions: PropTypes.array,
  surveillanceSystems: surveillanceSystemsProps,
  surveillancePrograms: surveillanceProgramsProps,
  clearBreadcrumb: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);
