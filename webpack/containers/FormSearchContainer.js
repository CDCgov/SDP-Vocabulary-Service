import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addForm } from '../actions/form_actions';
import { formProps } from '../prop-types/form_props';
import { surveyProps } from '../prop-types/survey_props';
import { fetchSearchResults, fetchMoreSearchResults } from '../actions/search_results_actions';
import SearchResult from '../components/SearchResult';
import DashboardSearch from '../components/DashboardSearch';
import currentUserProps from "../prop-types/current_user_props";

class FormSearchContainer extends Component {
  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.state = {
      forms: props.allForms,
      allForms: props.allForms,
      searchTerms: '',
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

  search(searchTerms) {
    if(searchTerms === ''){
      searchTerms = null;
    }
    this.setState({searchTerms: searchTerms});
    this.props.fetchSearchResults(searchTerms, 'form');
  }

  loadMore() {
    let searchTerms = this.state.searchTerms;
    let tempState = this.state.page + 1;
    if(this.state.searchTerms === '') {
      searchTerms = null;
    }
    this.props.fetchMoreSearchResults(searchTerms, 'form', tempState);
    this.setState({page: tempState});
  }

  render() {
    const searchResults = this.props.searchResults;
    return (
      <div>
        <DashboardSearch search={this.search} />
        <div className="load-more-search">
          {searchResults.hits && searchResults.hits.hits.map((f, i) => {
            return (
              <SearchResult key={`${f.Source.versionIndependentId}-${f.Source.updatedAt}-${i}`}
              type={f.Type} result={f} currentUser={this.props.currentUser}
              handleSelectSearchResult={() => this.props.addForm(this.props.survey, f.Source)}
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
  searchResults: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(FormSearchContainer);
