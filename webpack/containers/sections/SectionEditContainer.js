import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { denormalize } from 'normalizr';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { sectionSchema } from '../../schema';
import { setSteps } from '../../actions/tutorial_actions';
import { setStats } from '../../actions/landing';
import { fetchSection, saveSection, newSection, saveDraftSection } from '../../actions/section_actions';
import { addQuestion, removeQuestion, reorderQuestion, fetchQuestion } from '../../actions/questions_actions';
import SectionEdit from '../../components/sections/SectionEdit';
import ResponseSetModal from '../response_sets/ResponseSetModal';
import QuestionModalContainer  from '../questions/QuestionModalContainer';
import QuestionSearchContainer from '../questions/QuestionSearchContainer';
import { sectionProps } from '../../prop-types/section_props';
import { questionsProps } from '../../prop-types/question_props';
import { responseSetsProps } from '../../prop-types/response_set_props';


class SectionEditContainer extends Component {

  constructor(props) {
    super(props);
    let selectedSectionSaver = this.props.saveSection;
    if (this.props.params.sectionId) {
      this.props.fetchSection(this.props.params.sectionId);
      if (this.props.params.action === 'edit') {
        selectedSectionSaver = this.props.saveDraftSection;
      }
    } else {
      this.props.newSection();
      this.props.params.sectionId = 0;
      this.props.params.action = 'new';
    }
    this.state = {selectedSectionSaver: selectedSectionSaver, showQuestionModal: false, showResponseSetModal: false};
    this.showQuestionModal  = this.showQuestionModal.bind(this);
    this.closeQuestionModal = this.closeQuestionModal.bind(this);
    this.showResponseSetModal  = this.showResponseSetModal.bind(this);
    this.closeResponseSetModal = this.closeResponseSetModal.bind(this);
    this.handleSelectSearchResult  = this.handleSelectSearchResult.bind(this);
    this.handleSaveQuestionSuccess = this.handleSaveQuestionSuccess.bind(this);
  }

  componentDidMount() {
    this.props.setSteps([
      {
        title: 'Help',
        text: 'Click next to see a step by step walkthrough for using this page. To see more detailed information about this application and actions you can take <a class="tutorial-link" href="#help">click here to view the full Help Documentation.</a> Accessible versions of these steps are also duplicated in the help documentation.',
        selector: '.help-link',
        position: 'bottom',
      },
      {
        title: 'Author Question For Section',
        text: 'If you need to create a new question without leaving the the section use this button to author a new question from scratch.',
        selector: '.add-question',
        position: 'right',
      },
      {
        title: 'Question Search',
        text: 'Type in your search keywords here to search for questions to add to the section.',
        selector: '.search-input',
        position: 'bottom',
      },
      {
        title: 'Advanced Search Filters',
        text: 'Click Advanced to see additional filters you can apply to your search.',
        selector: '.search-group',
        position: 'right',
      },
      {
        title: 'Question Search Result',
        text: 'Use these search results to find the question you want to add.',
        selector: '.u-result',
        position: 'right',
      },
      {
        title: 'Add Question',
        text: 'Click on the add (+) button to select a question for the section.',
        selector: '.fa-plus-square',
        position: 'bottom',
      },
      {
        title: 'Section Details',
        text: 'Edit the various section details on the right side of the page. Select save in the top right of the page when done editing to save a draft of the content (this content will not be public until it is published).',
        selector: '.section-edit-details',
        position: 'left',
      },
      {
        title: 'Tags Table',
        text: 'The purpose of Tags is to facilitate content discovery and reuse. Click the info (i) icon, or <a class="tutorial-link" href="#help">go to the full help documentation</a> to see more information and examples on how to get the most out of tags.',
        selector: '.tags-table-header',
        position: 'left',
      }]);
  }

  componentDidUpdate(prevProps) {
    if(this.props.params.sectionId && prevProps.params.sectionId != this.props.params.sectionId){
      this.props.fetchSection(this.props.params.sectionId);
    }
    if(this.props.section && this.props.section.sectionQuestions) {
      this.refs.section.updateSectionQuestions(this.props.section.sectionQuestions);
    }
  }

  showQuestionModal(){
    this.setState({showQuestionModal: true});
  }

  closeQuestionModal(){
    this.setState({showQuestionModal: false});
  }

  showResponseSetModal(){
    this.setState({showResponseSetModal: true});
  }

  closeResponseSetModal(){
    this.setState({showResponseSetModal: false});
  }

  handleSaveQuestionSuccess(successResponse){
    this.setState({showQuestionModal: false});
    this.props.fetchQuestion(successResponse.data.id);
    this.props.addQuestion(this.props.section, successResponse.data);
  }

  handleSelectSearchResult(q){
    this.props.addQuestion(this.props.section, q);
  }

  actionWord() {
    const wordMap = {'new': 'Create', 'revise': 'Revise', 'extend': 'Extend', 'edit': 'Edit'};
    return wordMap[this.props.params.action || 'new'];
  }

  render() {
    if(!this.props.section || !this.props.questions){
      return (
        <div>Loading...</div>
      );
    }

    return (
      <div className="section-edit-container">
        <QuestionModalContainer route ={this.props.route}
                                router={this.props.router}
                                showModal={this.state.showQuestionModal}
                                closeQuestionModal ={this.closeQuestionModal}
                                handleSaveQuestionSuccess={this.handleSaveQuestionSuccess} />
        <ResponseSetModal show={this.state.showResponseSetModal}
                          router={this.props.router}
                          closeModal={this.closeResponseSetModal}
                          saveResponseSetSuccess={this.closeResponseSetModal} />
        <div className="row">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h1 className="panel-title">{`${this.actionWord()} Section`}</h1>
            </div>
            <div className="panel-body">
              <div className="col-md-5">
                <div className="row add-question">
                  <Button tabIndex="4" onClick={this.showQuestionModal} bsStyle="primary">Add New Question</Button>
                </div>
                <QuestionSearchContainer selectedSearchResults={this.props.selectedSearchResults}
                                         handleSelectSearchResult={this.handleSelectSearchResult} />
              </div>
              <SectionEdit ref ='section'
                        section={this.props.section}
                        route ={this.props.route}
                        router={this.props.router}
                        stats={this.props.stats}
                        setStats={this.props.setStats}
                        action={this.props.params.action || 'new'}
                        questions={this.props.questions}
                        responseSets ={this.props.responseSets}
                        sectionSubmitter={this.state.selectedSectionSaver}
                        removeQuestion ={this.props.removeQuestion}
                        reorderQuestion={this.props.reorderQuestion}
                        showResponseSetModal={this.showResponseSetModal} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({setSteps, addQuestion, fetchQuestion,
    newSection, fetchSection, removeQuestion, reorderQuestion, setStats,
    saveSection, saveDraftSection}, dispatch);
}

function mapStateToProps(state, ownProps) {
  const section = denormalize(state.sections[ownProps.params.sectionId || 0], sectionSchema, state);
  var selectedSearchResults = {};
  if(section && section.sectionQuestions){
    section.sectionQuestions.map((sq)=>{
      selectedSearchResults[sq.questionId] = true;
    });
  }
  return {
    section: section,
    questions: state.questions,
    responseSets: state.responseSets,
    stats: state.stats,
    selectedSearchResults: selectedSearchResults
  };
}

SectionEditContainer.propTypes = {
  section:  sectionProps,
  route: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  questions: questionsProps,
  responseSets: responseSetsProps,
  setSteps: PropTypes.func,
  setStats: PropTypes.func,
  stats: PropTypes.object,
  newSection:  PropTypes.func,
  saveSection: PropTypes.func,
  fetchSection: PropTypes.func,
  addQuestion: PropTypes.func,
  saveDraftSection: PropTypes.func,
  fetchQuestion: PropTypes.func,
  removeQuestion: PropTypes.func,
  reorderQuestion: PropTypes.func,
  selectedSearchResults: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(SectionEditContainer);
