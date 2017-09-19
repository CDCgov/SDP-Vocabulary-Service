import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addForm } from '../../actions/form_actions';
import { formProps } from '../../prop-types/form_props';
import { surveyProps } from '../../prop-types/survey_props';
import { fetchSearchResults, fetchMoreSearchResults } from '../../actions/search_results_actions';
import SearchResult from '../../components/SearchResult';
import DashboardSearch from '../../components/DashboardSearch';
import currentUserProps from "../../prop-types/current_user_props";
import { surveillanceSystemsProps }from '../../prop-types/surveillance_system_props';
import { surveillanceProgramsProps } from '../../prop-types/surveillance_program_props';

const FORM_SEARCH_CONTEXT = 'FORM_SEARCH_CONTEXT';

class FormSearchContainer extends Component {
  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.setFiltersParent = this.setFiltersParent.bind(this);
    this.state = {
      forms: props.allForms,
      allForms: props.allForms,
      searchTerms: '',
      progFilters: [],
      sysFilters: [],
      page: 1
    };
  }

  componentWillMount() {
    this.search('');
  }

  componentWillUpdate(nextProps) {
    if(nextProps.allForms != this.props.allForms) {
      this.setState({forms: nextProps.allForms});
    }
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
      this.props.fetchSearchResults(FORM_SEARCH_CONTEXT, searchTerms, 'form', this.state.progFilters, this.state.sysFilters);
    }
  }

  setFiltersParent(newState) {
    this.setState(newState);
  }

  search(searchTerms, progFilters, sysFilters) {
    if(searchTerms === ''){
      searchTerms = null;
    }
    this.setState({searchTerms: searchTerms, progFilters: progFilters, sysFilters: sysFilters, page: 1});
    this.props.fetchSearchResults(FORM_SEARCH_CONTEXT, searchTerms, 'form', progFilters, sysFilters);
  }

  loadMore() {
    let searchTerms = this.state.searchTerms;
    let tempState = this.state.page + 1;
    if(this.state.searchTerms === '') {
      searchTerms = null;
    }
    this.props.fetchMoreSearchResults(FORM_SEARCH_CONTEXT, searchTerms, 'form', tempState,
                                      this.state.progFilters,
                                      this.state.sysFilters);
    this.setState({page: tempState});
  }

  render() {
    const searchResults = this.props.searchResults;
    return (
      <div>
        <DashboardSearch search={this.search} surveillanceSystems={this.props.surveillanceSystems}
                         surveillancePrograms={this.props.surveillancePrograms}
                         setFiltersParent={this.setFiltersParent}
                         searchSource={this.props.searchResults.Source} />
        <div className="load-more-search">
          {searchResults.hits && searchResults.hits.hits.map((f, i) => {
            return (
              <SearchResult key={`${f.Source.versionIndependentId}-${f.Source.updatedAt}-${i}`}
              type={f.Type} result={f} currentUser={this.props.currentUser}
              isEditPage={true}
              handleSelectSearchResult={() => this.props.addForm(this.props.survey, f.Source)}
              isSelected={this.props.selectedSearchResults[f.Id]}
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
    searchResults: state.searchResults[FORM_SEARCH_CONTEXT] || {},
    surveillanceSystems: state.surveillanceSystems,
    surveillancePrograms: state.surveillancePrograms,
    currentUser: state.currentUser
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({addForm, fetchSearchResults, fetchMoreSearchResults}, dispatch);
}

FormSearchContainer.propTypes = {
  survey: surveyProps,
  allForms: PropTypes.arrayOf(formProps),
  addForm: PropTypes.func.isRequired,
  fetchSearchResults: PropTypes.func,
  fetchMoreSearchResults: PropTypes.func,
  currentUser: currentUserProps,
  searchResults: PropTypes.object,
  selectedSearchResults: PropTypes.object,
  surveillanceSystems: surveillanceSystemsProps,
  surveillancePrograms: surveillanceProgramsProps
};

export default connect(mapStateToProps, mapDispatchToProps)(FormSearchContainer);
