import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { questionProps } from "../prop-types/question_props";
import { responseSetProps } from "../prop-types/response_set_props";
import currentUserProps from '../prop-types/current_user_props';
import { surveillanceSystemsProps }from '../prop-types/surveillance_system_props';
import { surveillanceProgramsProps } from '../prop-types/surveillance_program_props';
import { fetchSearchResults } from '../actions/search_results_actions';
import SearchResult from './SearchResult';
import DashboardSearch from './DashboardSearch';
import SearchResultList from '../components/SearchResultList';
import { Modal, Button } from 'react-bootstrap';

class QuestionItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerms: '',
      programVar: this.props.programVar,
      showSearchModal: false,
      showProgramVarModal: false,
      progFilters: [],
      sysFilters: []
    };
    this.setFiltersParent = this.setFiltersParent.bind(this);
    this.showResponseSetSearch = this.showResponseSetSearch.bind(this);
    this.hideResponseSetSearch = this.hideResponseSetSearch.bind(this);
    this.showProgramVarModal = this.showProgramVarModal.bind(this);
    this.hideProgramVarModal = this.hideProgramVarModal.bind(this);
    this.handleSelectSearchResult = this.handleSelectSearchResult.bind(this);
    this.search = this.search.bind(this);
  }

  componentDidUpdate(_prevProps, prevState) {
    if(prevState != this.state && prevState.page === this.state.page) {
      let searchTerms = this.state.searchTerms;
      if(searchTerms === ''){
        searchTerms = null;
      }
      this.props.fetchSearchResults(searchTerms, 'response_set', this.state.progFilters, this.state.sysFilters);
    }
  }

  showResponseSetSearch() {
    this.setState({ showSearchModal: true });
  }

  hideResponseSetSearch() {
    this.setState({ showSearchModal: false });
  }

  showProgramVarModal() {
    this.setState({ showProgramVarModal: true });
  }

  hideProgramVarModal() {
    this.setState({ showProgramVarModal: false });
  }

  handleSelectSearchResult(rs) {
    this.props.handleSelectSearchResult(rs);
    this.setState({ showSearchModal: false });
  }

  setFiltersParent(newState) {
    this.setState(newState);
  }

  search(searchTerms, progFilters, sysFilters) {
    let searchType = 'response_set';
    if(searchTerms === ''){
      searchTerms = null;
    }
    this.setState({searchTerms: searchTerms, progFilters: progFilters, sysFilters: sysFilters});
    this.props.fetchSearchResults(searchTerms, searchType, progFilters, sysFilters);
  }

  searchModal() {
    return (
      <Modal show={this.state.showSearchModal} onHide={this.hideResponseSetSearch} aria-label="Search Response Sets">
        <Modal.Header closeButton bsStyle='search'>
          <Modal.Title>Search Response Sets</Modal.Title>
        </Modal.Header>
        <Modal.Body bsStyle='search'>
          <DashboardSearch search={this.search} surveillanceSystems={this.props.surveillanceSystems}
                           surveillancePrograms={this.props.surveillancePrograms}
                           setFiltersParent={this.setFiltersParent}
                           searchSource={this.props.searchResults.Source} />
          <SearchResultList searchResults={this.props.searchResults} currentUser={this.props.currentUser} handleSelectSearchResult={this.handleSelectSearchResult} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.hideResponseSetSearch} bsStyle="primary">Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  programVarModal(){
    return (
      <Modal show={this.state.showProgramVarModal} onHide={this.hideProgramVarModal}>
        <Modal.Header closeButton bsStyle='search'>
          <Modal.Title>Modify Program Defined Variable Name</Modal.Title>
        </Modal.Header>
        <Modal.Body bsStyle='search'>
          <label htmlFor="program-var" hidden>Program Variable</label>
          <input id="program-var"
                 name="program-var"
                 type="text"
                 className="input-format"
                 placeholder="Program Defined Variable Name"
                 value={this.state.programVar || ''}
                 onChange={(e) => this.setState({programVar : e.target.value})} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.hideProgramVarModal}>Cancel</Button>
          <Button bsStyle="primary" onClick={(e) => {
            e.preventDefault();
            this.props.handleProgramVarChange(this.state.programVar);
            this.hideProgramVarModal();
          }}>Done</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  render() {
    if (!this.props.question) {
      return (<div>Loading...</div>);
    }
    return (
      <div className='question-item'>
        {this.searchModal()}
        {this.programVarModal()}
        <div className="col-md-12">
          <SearchResult type  ='form_question'
                        result={{Source:this.props.question}}
                        currentUser ={{id: -1}}
                        isEditPage  ={true}
                        index = {this.props.index}
                        programVar={this.props.programVar}
                        responseSets={this.props.responseSets}
                        handleResponseSetChange={this.props.handleResponseSetChange}
                        handleProgramVarChange ={this.props.handleProgramVarChange}
                        selectedResponseSetId  ={this.props.selectedResponseSet}
                        showResponseSetSearch={(e) => {
                          e.preventDefault();
                          this.showResponseSetSearch();
                          this.props.fetchSearchResults('', 'response_set');
                        }}
                        showProgramVarModal={(e) => {
                          e.preventDefault();
                          this.showProgramVarModal();
                        }}

                        />
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
  return bindActionCreators({fetchSearchResults}, dispatch);
}

QuestionItem.propTypes = {
  question: questionProps,
  responseSets: PropTypes.arrayOf(responseSetProps),
  selectedResponseSet: PropTypes.number,
  index: PropTypes.number.isRequired,
  handleResponseSetChange: PropTypes.func,
  handleProgramVarChange:  PropTypes.func,
  handleSelectSearchResult: PropTypes.func,
  fetchSearchResults: PropTypes.func,
  responseSetId: PropTypes.number,
  programVar: PropTypes.string,
  searchResults: PropTypes.object,
  currentUser: currentUserProps,
  surveillanceSystems: surveillanceSystemsProps,
  surveillancePrograms: surveillanceProgramsProps
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionItem);
