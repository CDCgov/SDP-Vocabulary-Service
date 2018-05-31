import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import debounce from 'lodash/debounce';
import { addSection } from '../../actions/section_actions';
import { sectionProps } from '../../prop-types/section_props';
import { surveyProps } from '../../prop-types/survey_props';
import { fetchSearchResults, fetchMoreSearchResults, fetchSuggestions } from '../../actions/search_results_actions';
import SearchResult from '../../components/SearchResult';
import DashboardSearch from '../../components/DashboardSearch';
import SearchManagerComponent from '../../components/SearchManagerComponent';
import currentUserProps from "../../prop-types/current_user_props";
import { surveillanceSystemsProps }from '../../prop-types/surveillance_system_props';
import { surveillanceProgramsProps } from '../../prop-types/surveillance_program_props';

const SECTION_SEARCH_CONTEXT = 'SECTION_SEARCH_CONTEXT';

class SectionSearchContainer extends SearchManagerComponent {
  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.changeFiltersCallback = this.changeFiltersCallback.bind(this);
    this.state = {
      sections: props.allSections,
      allSections: props.allSections,
      searchTerms: '',
      programFilter: [],
      systemFilter: [],
      page: 1,
      type: 'section'
    };
  }

  componentWillMount() {
    this.search(this.currentSearchParameters());
  }

  componentWillUpdate(nextProps) {
    if(nextProps.allSections != this.props.allSections) {
      this.setState({sections: nextProps.allSections});
    }
  }

  componentDidUpdate(_prevProps, prevState) {
    if(prevState.page === this.state.page && prevState.programFilter != undefined && (prevState.programFilter !== this.state.programFilter || prevState.systemFilter !== this.state.systemFilter)) {
      this.props.fetchSearchResults(SECTION_SEARCH_CONTEXT, this.currentSearchParameters());
    }
  }

  search(searchParameters) {
    searchParameters.type = 'section';
    super.search(searchParameters, SECTION_SEARCH_CONTEXT);
  }

  loadMore() {
    super.loadMore(SECTION_SEARCH_CONTEXT);
  }

  render() {
    const searchResults = this.props.searchResults;
    const fetchSuggestions = debounce(this.props.fetchSuggestions, 300);
    return (
      <div>
        <DashboardSearch search={this.search} surveillanceSystems={this.props.surveillanceSystems}
                         surveillancePrograms={this.props.surveillancePrograms}
                         changeFiltersCallback={this.changeFiltersCallback}
                         searchSource={this.props.searchResults.Source}
                         suggestions={this.props.suggestions}
                         fetchSuggestions={fetchSuggestions}
                         placeholder="Search sections..." />
        <div className="load-more-search">
          {searchResults.hits && searchResults.hits.hits.map((sect, i) => {
            return (
              <SearchResult key={`${sect.Source.versionIndependentId}-${sect.Source.updatedAt}-${i}`}
              type={sect.Type} result={sect} currentUser={this.props.currentUser}
              isEditPage={true}
              handleSelectSearchResult={() => this.props.addSection(this.props.survey, sect.Source)}
              isSelected={this.props.selectedSearchResults[sect.Id]}
              />
            );
          })}
          {searchResults.hits && searchResults.hits.total > 0 && this.state.page <= Math.floor((searchResults.hits.total-1) / 10) &&
            <button id="load-more-btn" className="button button-action center-block" onClick={() => this.loadMore()}>LOAD MORE</button>
          }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    searchResults: state.searchResults[SECTION_SEARCH_CONTEXT] || {},
    surveillanceSystems: state.surveillanceSystems,
    surveillancePrograms: state.surveillancePrograms,
    currentUser: state.currentUser,
    suggestions: state.suggestions
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({addSection, fetchSuggestions, fetchSearchResults, fetchMoreSearchResults}, dispatch);
}

SectionSearchContainer.propTypes = {
  survey: surveyProps,
  allSections: PropTypes.arrayOf(sectionProps),
  addSection: PropTypes.func.isRequired,
  fetchSearchResults: PropTypes.func,
  fetchSuggestions: PropTypes.func,
  suggestions: PropTypes.array,
  fetchMoreSearchResults: PropTypes.func,
  currentUser: currentUserProps,
  searchResults: PropTypes.object,
  selectedSearchResults: PropTypes.object,
  surveillanceSystems: surveillanceSystemsProps,
  surveillancePrograms: surveillanceProgramsProps
};

export default connect(mapStateToProps, mapDispatchToProps)(SectionSearchContainer);
