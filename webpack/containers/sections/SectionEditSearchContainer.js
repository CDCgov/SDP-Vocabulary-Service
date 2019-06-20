import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import debounce from 'lodash/debounce';

import { fetchSearchResults, fetchMoreSearchResults, fetchSuggestions } from '../../actions/search_results_actions';

import SearchResult from '../../components/SearchResult';
import DashboardSearch from '../../components/DashboardSearch';
import SearchManagerComponent from '../../components/SearchManagerComponent';
import currentUserProps from "../../prop-types/current_user_props";
import { surveillanceSystemsProps }from '../../prop-types/surveillance_system_props';
import { surveillanceProgramsProps } from '../../prop-types/surveillance_program_props';

const SECTION_EDIT_SEARCH_CONTEXT = 'SECTION_EDIT_SEARCH_CONTEXT';

class SectionEditSearchContainer extends SearchManagerComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchTerms: '',
      searchType: 'question',
      programFilter: [],
      systemFilter: [],
      page: 1,
      mostRecentFilter: false
    };
    this.search   = this.search.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.changeFiltersCallback = this.changeFiltersCallback.bind(this);
    this.selectType = this.selectType.bind(this);
  }

  componentWillMount() {
    this.search(this.currentSearchParameters());
  }

  componentDidUpdate(_prevProps, prevState) {
    if(prevState.page === this.state.page && prevState.programFilter != undefined && (prevState.programFilter !== this.state.programFilter || prevState.systemFilter !== this.state.systemFilter)) {
      this.props.fetchSearchResults(SECTION_EDIT_SEARCH_CONTEXT, this.currentSearchParameters());
    }
  }

  search(searchParameters) {
    searchParameters.type = this.state.searchType;
    searchParameters.nsFilter = this.props.sectionId;
    super.search(searchParameters, SECTION_EDIT_SEARCH_CONTEXT);
  }

  loadMore() {
    super.loadMore(SECTION_EDIT_SEARCH_CONTEXT);
  }

  selectType(type) {
    this.setState({ searchType: type });
    let searchParameters = this.currentSearchParameters();
    searchParameters.type = type;
    super.search(searchParameters, SECTION_EDIT_SEARCH_CONTEXT);
  }

  render() {
    const searchResults = this.props.searchResults;
    const fetchSuggestions = debounce(this.props.fetchSuggestions, 300);
    return (
      <div>
        <ul className="nav nav-tabs section-edit-search-tabs" role="tablist">
          <li id="question-search-tab" className={`nav-item ${this.state.searchType === 'question' ? 'active' : ''}`} role="tab" onClick={() => this.selectType('question')} aria-selected={this.state.searchType === 'question'}>
            <a className="nav-link" href="#" tabIndex="4" onClick={(e) => e.preventDefault()} role="tab"><i className="fa fa-question-circle" aria-hidden="true"><text className='sr-only' aria-hidden="true">Click to filter search by</text></i> Questions</a>
          </li>
          <li id="section-search-tab" className={`nav-item ${this.state.searchType === 'section' ? 'active' : ''}`} role="tab" onClick={() => this.selectType('section')} aria-selected={this.state.searchType === 'section'}>
            <a className="nav-link" href="#" tabIndex="4" onClick={(e) => e.preventDefault()} role="tab"><i className="fa fa-window-maximize" aria-hidden="true"><text className='sr-only' aria-hidden="true">Click to filter search by</text></i> Sections</a>
          </li>
        </ul>
        <DashboardSearch search={this.search}
                         surveillanceSystems={this.props.surveillanceSystems}
                         surveillancePrograms={this.props.surveillancePrograms}
                         changeFiltersCallback={this.changeFiltersCallback}
                         searchSource={this.props.searchResults.Source}
                         suggestions={this.props.suggestions}
                         fetchSuggestions={fetchSuggestions}
                         placeholder={`Search ${this.state.searchType}s...`} />
        <br/>
        <div className="load-more-search">
          {searchResults.hits && searchResults.hits.hits.map((sr, i) => {
            let isSelected = this.state.searchType === 'section' ? this.props.selectedSections[sr.Id] : this.props.selectedQuestions[sr.Id];
            return (
              <SearchResult key={`${sr.Source.versionIndependentId}-${sr.Source.updatedAt}-${i}`}
                            type={sr.Type}
                            result={sr}
                            isEditPage={true}
                            currentUser={this.props.currentUser}
                            handleSelectSearchResult={this.props.handleSelectSearchResult}
                            isSelected={isSelected} />
            );
          })}
          {searchResults.hits && searchResults.hits.total > 0 && this.state.page <= Math.floor((searchResults.hits.total-1) / 10) &&
            <button id="load-more-btn" className="button button-action center-block" onClick={this.loadMore}>LOAD MORE</button>
          }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    searchResults: state.searchResults[SECTION_EDIT_SEARCH_CONTEXT] || {},
    surveillanceSystems: state.surveillanceSystems,
    surveillancePrograms: state.surveillancePrograms,
    currentUser: state.currentUser,
    suggestions: state.suggestions
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchSearchResults, fetchSuggestions, fetchMoreSearchResults}, dispatch);
}

SectionEditSearchContainer.propTypes = {
  handleSelectSearchResult: PropTypes.func.isRequired,
  selectedQuestions: PropTypes.object.isRequired,
  selectedSections: PropTypes.object.isRequired,
  sectionId: PropTypes.number,
  fetchSearchResults: PropTypes.func,
  fetchMoreSearchResults: PropTypes.func,
  fetchSuggestions: PropTypes.func,
  suggestions: PropTypes.array,
  currentUser: currentUserProps,
  searchResults: PropTypes.object,
  surveillanceSystems: surveillanceSystemsProps,
  surveillancePrograms: surveillanceProgramsProps
};

export default connect(mapStateToProps, mapDispatchToProps)(SectionEditSearchContainer);
