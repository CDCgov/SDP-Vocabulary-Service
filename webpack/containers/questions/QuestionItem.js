import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { denormalize } from 'normalizr';
import { questionSchema, sectionSchema } from '../../schema';
import { questionProps } from "../../prop-types/question_props";
import { responseSetProps } from "../../prop-types/response_set_props";
import currentUserProps from '../../prop-types/current_user_props';
import { surveillanceSystemsProps }from '../../prop-types/surveillance_system_props';
import { surveillanceProgramsProps } from '../../prop-types/surveillance_program_props';
import { fetchSearchResults, fetchSuggestions } from '../../actions/search_results_actions';
import SearchResult from '../../components/SearchResult';
import DashboardSearch from '../../components/DashboardSearch';
import SearchResultList from '../../components/SearchResultList';
import SearchManagerComponent from '../../components/SearchManagerComponent';
import { SearchParameters } from '../../actions/search_results_actions';
import { Modal, Button } from 'react-bootstrap';

const QUESTION_ITEM_CONTEXT = 'QUESTION_ITEM_CONTEXT';

class QuestionItem extends SearchManagerComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchTerms: '',
      programVar: this.props.programVar,
      showSearchModal: false,
      showProgramVarModal: false,
      programFilter: [],
      systemFilter: [],
      mostRecentFilter: false,
      type: 'response_set'
    };
    this.changeFiltersCallback = this.changeFiltersCallback.bind(this);
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
    if(prevState.page === this.state.page && prevState.programFilter != undefined && (prevState.programFilter !== this.state.programFilter || prevState.systemFilter !== this.state.systemFilter)) {
      this.props.fetchSearchResults(QUESTION_ITEM_CONTEXT, this.currentSearchParameters());
    }
  }

  showResponseSetSearch(e) {
    e.preventDefault();
    this.setState({ showSearchModal: true });
    this.props.fetchSearchResults(QUESTION_ITEM_CONTEXT, new SearchParameters({type: 'response_set'}));
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

  // TODO check if I need to worry about adding _type to this
  handleSelectSearchResult(rs) {
    this.props.handleSelectSearchResult(this.props.index, rs);
    this.setState({ showSearchModal: false });
  }

  handleResponseSetChangeEvent(event){
    this.props.handleResponseSetChange(this.props.index, event);
  }

  updateProgramVar(e){
    this.setState({programVar : e.target.value});
  }

  submitProgramVar(e){
    e.preventDefault();
    this.hideProgramVarModal();
    this.props.handleProgramVarChange(this.props.index, this.state.programVar);
  }

  search(searchParameters) {
    searchParameters.type = 'response_set';
    super.search(searchParameters, QUESTION_ITEM_CONTEXT);
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
                           changeFiltersCallback={this.changeFiltersCallback}
                           surveillanceSystems={this.props.surveillanceSystems}
                           surveillancePrograms={this.props.surveillancePrograms}
                           suggestions={this.props.suggestions}
                           fetchSuggestions={this.props.fetchSuggestions}
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
    if (!this.props.item) {
      return (<div>Loading...</div>);
    }
    let srType = this.props.itemType === 'question' ? 'section_question' : 'nested_section';
    return (
      <div className='question-item'>
        {this.searchModal()}
        {this.programVarModal()}
        <div className="col-md-12">
          <SearchResult type  ={srType}
                        index ={this.props.index}
                        result={{Source:this.props.item}}
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
  var schema = ownProps.itemType === 'question' ? questionSchema : sectionSchema;
  var item = denormalize(ownProps.item, schema, state);
  return {
    searchResults: state.searchResults[QUESTION_ITEM_CONTEXT] || {},
    surveillanceSystems: state.surveillanceSystems,
    surveillancePrograms: state.surveillancePrograms,
    currentUser: state.currentUser,
    item: item,
    suggestions: state.suggestions
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchSearchResults, fetchSuggestions}, dispatch);
}

QuestionItem.propTypes = {
  item: PropTypes.object,
  itemType: PropTypes.string,
  responseSets: PropTypes.arrayOf(responseSetProps),
  selectedResponseSet: PropTypes.number,
  index: PropTypes.number.isRequired,
  handleResponseSetChange: PropTypes.func,
  handleProgramVarChange:  PropTypes.func,
  handleSelectSearchResult: PropTypes.func,
  fetchSearchResults: PropTypes.func,
  fetchSuggestions: PropTypes.func,
  suggestions: PropTypes.array,
  responseSetId: PropTypes.number,
  programVar: PropTypes.string,
  searchResults: PropTypes.object,
  currentUser: currentUserProps,
  surveillanceSystems: surveillanceSystemsProps,
  surveillancePrograms: surveillanceProgramsProps
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionItem);
