import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { denormalize } from 'normalizr';
import { Button, Grid, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { sectionSchema } from '../../schema';
import { setSteps } from '../../actions/tutorial_actions';
import { setStats } from '../../actions/landing';
import { fetchSection, saveSection, newSection, saveDraftSection, addNestedItem, removeNestedItem, reorderNestedItem } from '../../actions/section_actions';
import { fetchQuestion } from '../../actions/questions_actions';
import SectionEdit from '../../components/sections/SectionEdit';
import ResponseSetModal from '../response_sets/ResponseSetModal';
import QuestionModalContainer  from '../questions/QuestionModalContainer';
import SectionEditSearchContainer from '../sections/SectionEditSearchContainer';
import { sectionProps, sectionsProps } from '../../prop-types/section_props';
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
        title: 'Search',
        text: 'Type in your search keywords here to search for questions or nested sections to add to the section.',
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
        title: 'Search Result',
        text: 'Use these search results to find the question or nested section you want to add.',
        selector: '.u-result',
        position: 'right',
      },
      {
        title: 'Add Item',
        text: 'Click on the add (+) button to select an item for the section.',
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
    if(this.props.section && this.props.section.sectionNestedItems) {
      this.refs.section.updateSectionNestedItems(this.props.section.sectionNestedItems);
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
    this.props.addNestedItem(this.props.section, successResponse.data);
  }

  handleSelectSearchResult(sni, type){
    this.props.addNestedItem(this.props.section, sni, type);
  }

  actionWord() {
    const wordMap = {'new': 'Create', 'revise': 'Revise', 'extend': 'Extend', 'edit': 'Edit'};
    return wordMap[this.props.params.action || 'new'];
  }

  render() {
    if(!this.props.section || !this.props.questions || !this.props.sections){
      return (
        <Grid className="basic-bg">Loading..</Grid>
      );
    }

    return (
      <Grid className="section-edit-container">
        <QuestionModalContainer route ={this.props.route}
                                router={this.props.router}
                                showModal={this.state.showQuestionModal}
                                closeQuestionModal ={this.closeQuestionModal}
                                handleSaveQuestionSuccess={this.handleSaveQuestionSuccess} />
        <ResponseSetModal show={this.state.showResponseSetModal}
                          router={this.props.router}
                          closeModal={this.closeResponseSetModal}
                          saveResponseSetSuccess={this.closeResponseSetModal} />
        <Row>
          <div className="panel panel-default">
            <div className="panel-heading">
              <h1 className="panel-title">{`${this.actionWord()} Section`}</h1>
            </div>
            <Row className="panel-body">
              <Col md={5}>
                <div className="add-question">
                  <Button tabIndex="4" onClick={this.showQuestionModal} bsStyle="primary">Add New Question</Button>
                </div>
                <SectionEditSearchContainer selectedQuestions={this.props.selectedQuestions}
                                            selectedSections={this.props.selectedSections}
                                            sectionId={this.props.section.id}
                                            handleSelectSearchResult={this.handleSelectSearchResult} />
              </Col>
              <SectionEdit ref ='section'
                        section={this.props.section}
                        route ={this.props.route}
                        router={this.props.router}
                        stats={this.props.stats}
                        setStats={this.props.setStats}
                        action={this.props.params.action || 'new'}
                        questions={this.props.questions}
                        responseSets ={this.props.responseSets}
                        sections={this.props.sections}
                        sectionSubmitter={this.state.selectedSectionSaver}
                        removeNestedItem={this.props.removeNestedItem}
                        reorderNestedItem={this.props.reorderNestedItem}
                        showResponseSetModal={this.showResponseSetModal} />
            </Row>
          </div>
        </Row>
      </Grid>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({setSteps, addNestedItem, fetchQuestion,
    newSection, fetchSection, removeNestedItem, reorderNestedItem, setStats,
    saveSection, saveDraftSection}, dispatch);
}

function mapStateToProps(state, ownProps) {
  const section = denormalize(state.sections[ownProps.params.sectionId || 0], sectionSchema, state);
  var selectedQuestions = {};
  var selectedSections = {};
  if(section && section.sectionNestedItems){
    section.sectionNestedItems.map((sni)=>{
      if (sni.questionId) {
        selectedQuestions[sni.questionId] = true;
      } else {
        selectedSections[sni.nestedSectionId] = true;
      }
    });
  }
  return {
    section: section,
    questions: state.questions,
    responseSets: state.responseSets,
    sections: state.sections,
    stats: state.stats,
    selectedQuestions: selectedQuestions,
    selectedSections: selectedSections
  };
}

SectionEditContainer.propTypes = {
  section:  sectionProps,
  route: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  questions: questionsProps,
  responseSets: responseSetsProps,
  sections: sectionsProps,
  setSteps: PropTypes.func,
  setStats: PropTypes.func,
  stats: PropTypes.object,
  newSection:  PropTypes.func,
  saveSection: PropTypes.func,
  fetchSection: PropTypes.func,
  addNestedItem: PropTypes.func,
  saveDraftSection: PropTypes.func,
  fetchQuestion: PropTypes.func,
  removeNestedItem: PropTypes.func,
  reorderNestedItem: PropTypes.func,
  selectedQuestions: PropTypes.object,
  selectedSections: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(SectionEditContainer);
