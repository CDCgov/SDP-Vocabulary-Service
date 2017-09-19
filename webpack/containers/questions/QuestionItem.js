import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { denormalize } from 'normalizr';
import { questionSchema } from '../../schema';
import { questionProps } from "../../prop-types/question_props";
import { responseSetProps } from "../../prop-types/response_set_props";
import currentUserProps from '../../prop-types/current_user_props';
import { surveillanceSystemsProps }from '../../prop-types/surveillance_system_props';
import { surveillanceProgramsProps } from '../../prop-types/surveillance_program_props';
import { fetchSearchResults } from '../../actions/search_results_actions';
import SearchResult from '../../components/SearchResult';
import DashboardSearch from '../../components/DashboardSearch';
import SearchResultList from '../../components/SearchResultList';
import { Modal, Button } from 'react-bootstrap';

const QUESTION_ITEM_CONTEXT = 'QUESTION_ITEM_CONTEXT';

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
    this.updateProgramVar = this.updateProgramVar.bind(this);
    this.submitProgramVar = this.submitProgramVar.bind(this);
    this.showProgramVarModal = this.showProgramVarModal.bind(this);
    this.hideProgramVarModal = this.hideProgramVarModal.bind(this);
    this.handleSelectSearchResult = this.handleSelectSearchResult.bind(this);
    this.handleResponseSetChangeEvent = this.handleResponseSetChangeEvent.bind(this);
    this.search = this.search.bind(this);
  }

  componentDidUpdate(_prevProps, prevState) {
    if(prevState.page === this.state.page && prevState.progFilters != undefined && (prevState.progFilters !== this.state.progFilters || prevState.sysFilters !== this.state.sysFilters)) {
      let searchTerms = this.state.searchTerms;
      if(searchTerms === ''){
        searchTerms = null;
      }
      this.props.fetchSearchResults(QUESTION_ITEM_CONTEXT, searchTerms, 'response_set', this.state.progFilters, this.state.sysFilters);
    }
  }

  showResponseSetSearch(e) {
    e.preventDefault();
    this.setState({ showSearchModal: true });
    this.props.fetchSearchResults(QUESTION_ITEM_CONTEXT, '', 'response_set');
  }

  hideResponseSetSearch() {
    this.setState({ showSearchModal: false });
  }

  showProgramVarModal(e) {
    if(e){
      e.preventDefault();
    }
    this.setState({ showProgramVarModal: true });
  }

  hideProgramVarModal() {
    this.setState({ showProgramVarModal: false });
  }

  handleSelectSearchResult(rs) {
    this.props.handleSelectSearchResult(this.props.index, rs);
    this.setState({ showSearchModal: false });
  }

  handleResponseSetChangeEvent(event){
    this.props.handleResponseSetChange(this.props.index, event);
  }

  setFiltersParent(newState) {
    this.setState(newState);
  }

  updateProgramVar(e){
    this.setState({programVar : e.target.value});
  }

  submitProgramVar(e){
    e.preventDefault();
    this.hideProgramVarModal();
    this.props.handleProgramVarChange(this.props.index, this.state.programVar);
  }

  search(searchTerms, progFilters, sysFilters) {
    let searchType = 'response_set';
    if(searchTerms === ''){
      searchTerms = null;
    }
    this.props.fetchSearchResults(QUESTION_ITEM_CONTEXT, searchTerms, searchType, progFilters, sysFilters);
    this.setState({searchTerms: searchTerms, progFilters: progFilters, sysFilters: sysFilters, page: 1});
  }

  searchModal() {
    return (
      <Modal animation={false} show={this.state.showSearchModal} onHide={this.hideResponseSetSearch} aria-label="Search Response Sets">
        <Modal.Header closeButton bsStyle='search'>
          <Modal.Title componentClass="h1">Search Response Sets</Modal.Title>
        </Modal.Header>
        <Modal.Body bsStyle='search'>
          <DashboardSearch search={this.search}
                           searchSource={this.props.searchResults.Source}
                           setFiltersParent={this.setFiltersParent}
                           surveillanceSystems={this.props.surveillanceSystems}
                           surveillancePrograms={this.props.surveillancePrograms}
                          />
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
          <Modal.Title componentClass="h1">{this.props.programVar ? 'Modify' : 'Add'} Program Defined Variable Name</Modal.Title>
        </Modal.Header>
        <Modal.Body bsStyle='search'>
          <label htmlFor="program-var" hidden>Program Variable</label>
          <input id="program-var"
                 name="program-var"
                 type="text"
                 className="input-format"
                 placeholder="Program Defined Variable Name"
                 value={this.state.programVar || ''}
                 onChange={this.updateProgramVar} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.hideProgramVarModal}>Cancel</Button>
          <Button bsStyle="primary" onClick={this.submitProgramVar}>Done</Button>
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
                        index ={this.props.index}
                        result={{Source:this.props.question}}
                        isEditPage ={true}
                        programVar ={this.props.programVar}
                        currentUser={{id: -1}}
                        responseSets={this.props.responseSets}
                        showProgramVarModal={this.showProgramVarModal}
                        selectedResponseSetId={this.props.selectedResponseSet}
                        showResponseSetSearch={this.showResponseSetSearch}
                        handleProgramVarChange ={this.props.handleProgramVarChange}
                        handleResponseSetChange={this.handleResponseSetChangeEvent}
                        />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  var question = denormalize(ownProps.question, questionSchema, state);
  return {
    searchResults: state.searchResults[QUESTION_ITEM_CONTEXT] || {},
    surveillanceSystems: state.surveillanceSystems,
    surveillancePrograms: state.surveillancePrograms,
    currentUser: state.currentUser,
    question: question
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
