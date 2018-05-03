import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

import { surveyProps } from '../../prop-types/survey_props';
import currentUserProps from "../../prop-types/current_user_props";

import iconMap from '../../styles/iconMap';

class SurveyDedupe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemPageIndex: 0,
      viewPage: 'all',
      viewSectionIndex: 0,
      viewQuestionIndex: 0,
      showDeleteModal: false,
      selectedDupe: {},
      selectedDraft: {}
    };
  }

  surveillanceSystem() {
    if (this.props.survey.surveillanceSystem) {
      return <p className="maincontent-item-info">Surveillance System: {this.props.survey.surveillanceSystem.name}</p>;
    } else {
      return "";
    }
  }

  surveillanceProgram() {
    if (this.props.survey.surveillanceProgram) {
      return <p className="maincontent-item-info">Surveillance Program: {this.props.survey.surveillanceProgram.name}</p>;
    } else {
      return "";
    }
  }

  deleteModal() {
    let question = this.state.selectedDupe;
    let draft = this.state.selectedDraft;
    return(
      <div className="static-modal">
        <Modal animation={false} show={this.state.showDeleteModal} onHide={()=>this.setState({showDeleteModal: false})} role="dialog" aria-label="Delete Confirmation Modal">
          <Modal.Header>
            <Modal.Title componentClass="h2"><i className="fa fa-exclamation-triangle simple-search-icon" aria-hidden="true"><text className="sr-only">Warning for</text></i> Select &amp; Replace Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to select the '{question.name}' question to replace '{draft.content}' and mark the draft question as a duplicate? Doing so will replace the duplicate draft question with the preferred content throughout the system and delete the duplicate.
            This action cannot be undone.</p>
          </Modal.Body>
          <br/>
          <br/>
          <Modal.Footer>
            <Button onClick={() => {
              this.props.markAsDuplicate(draft.id, question.id, this.props.survey.id);
              this.setState({viewPage: 'all', showDeleteModal: false});
            }} bsStyle="primary">Replace</Button>
            <Button onClick={()=>this.setState({showDeleteModal: false})} bsStyle="default">Cancel</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  viewAllDupes() {
    return (
      <div>
        <h4>Potential Duplicate Questions ({this.props.survey.dupeCount})</h4>
        <table className="table table-dark-header">
          <thead>
            <tr>
              <th>Name &amp; Description</th>
              <th>Response Type</th>
              <th>Category</th>
              <th className="action"></th>
            </tr>
          </thead>
          {this.props.potentialDupes.map((section, i) => {
            return (
              <tbody key={i}>
                <tr className="section-row">
                  <td colSpan="4"><i className={`fa ${iconMap['section']}`} aria-hidden="true"></i><text className="sr-only">Click to view parent section</text> <a href={`/#/sections/${section.id}`} target="_blank">{section.name}</a> ({section.count})<span className="sr-only">There are {section.count} potential duplicate questions in this section</span></td>
                </tr>
                {section.questions.map((question, j) => {
                  return (
                    <tr key={j}>
                      <td><text>{question.draftQuestion.content}</text><br/><span className="small">{question.draftQuestion.description}</span></td>
                      <td><i className='fa fa-comments' aria-hidden="true"></i> {question.draftQuestion.responseType}</td>
                      <td>{question.draftQuestion.category}</td>
                      <td><button className="btn btn-sm btn-default" onClick={()=>this.setState({viewPage: 'single', viewSectionIndex: i, viewQuestionIndex: j})}>View</button></td>
                    </tr>
                  );
                })}
              </tbody>
            );
          })}
        </table>
      </div>
    );
  }

  previousQuestion() {
    let prevQuestionIndex = this.state.viewQuestionIndex;
    let prevSectionIndex = this.state.viewSectionIndex;
    if(prevQuestionIndex > 0) {
      this.setState({viewQuestionIndex: prevQuestionIndex-1});
    } else {
      let prevSection = this.props.potentialDupes[this.state.viewSectionIndex-1];
      this.setState({viewSectionIndex: prevSectionIndex-1, viewQuestionIndex: prevSection.questions.length-1});
    }
  }

  nextQuestion() {
    let prevQuestionIndex = this.state.viewQuestionIndex;
    let prevSectionIndex = this.state.viewSectionIndex;
    if(prevQuestionIndex < (this.props.potentialDupes[prevSectionIndex].questions.length-1)) {
      this.setState({viewQuestionIndex: prevQuestionIndex+1});
    } else {
      this.setState({viewSectionIndex: prevSectionIndex+1, viewQuestionIndex: 0});
    }
  }

  previousQuestionCount(sectionIndex) {
    if (sectionIndex > 0) {
      return this.props.potentialDupes[sectionIndex-1].questions.length + this.previousQuestionCount(sectionIndex-1);
    } else {
      return 0;
    }
  }

  viewSingleDupe() {
    let section = this.props.potentialDupes[this.state.viewSectionIndex];
    let question = section.questions[this.state.viewQuestionIndex];
    let pageIndex = this.previousQuestionCount(this.state.viewSectionIndex) + this.state.viewQuestionIndex + 1;
    return (
      <div>
        <div className="duplicate-nav-buttons">
          <button className="btn btn-default" disabled={pageIndex == 1} onClick={() => this.previousQuestion()}><i className="fa fa-arrow-left"></i><span className="sr-only">Switch to the previous potential duplicate question</span></button>
          <button className="btn btn-default" disabled={pageIndex == this.props.survey.dupeCount} onClick={() => this.nextQuestion()}><i className="fa fa-arrow-right"></i><span className="sr-only">Switch to the next potential duplicate question</span></button>
        </div>
        <h4>Viewing {pageIndex} of {this.props.survey.dupeCount} Potential Duplicate Questions <a href="#" onClick={(e) => {
          e.preventDefault();
          this.setState({ viewPage: 'all' });
        }}>(List all)</a></h4>
        <div className="text-large"><i className={`fa ${iconMap['section']}`} aria-hidden="true"></i><text className="sr-only">Click to view parent section</text> <a href={`/#/sections/${section.id}`} target="_blank">{section.name}</a> ({this.state.viewQuestionIndex+1} of {section.count})<span className="sr-only">There are {section.count} potential duplicate questions in this section</span></div>
        <table className="table">
          <thead>
            <tr className="active">
              <th>Name &amp; Description</th>
              <th>Response Type</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><text>{question.draftQuestion.content}</text><br/><span className="small">{question.draftQuestion.description}</span></td>
              <td><i className='fa fa-comments' aria-hidden="true"></i> {question.draftQuestion.responseType}</td>
              <td>{question.draftQuestion.category}</td>
            </tr>
          </tbody>
        </table>
        <h4>Suggested Replacement Questions ({question.potentialDuplicates && question.potentialDuplicates.length})</h4>
        <table className="table">
          <thead>
            <tr className="active">
              <th className="match-score">Match</th>
              <th>Name &amp; Description</th>
              <th>CDC Pref</th>
              <th>Response Type</th>
              <th>Category</th>
              <th className="text-center">Usage</th>
              <th className="action"></th>
            </tr>
          </thead>
          <tbody>
            {question.potentialDuplicates && question.potentialDuplicates.map((dupe, i) => {
              return (
                <tr key={i}>
                  <td className="match-score">{dupe.Score}</td>
                  <td><a href={`/#/questions/${dupe.Source.id}`} target="_blank">{dupe.Source.name}</a><br/><span className="small">{dupe.Source.description}</span></td>
                  <td></td>
                  <td><i className='fa $fa-comments' aria-hidden="true"></i> {dupe.Source.responseType && dupe.Source.responseType.name}</td>
                  <td>{dupe.Source.category && dupe.Source.category.name}</td>
                  <td className="text-center">{dupe.Source.surveillancePrograms && dupe.Source.surveillancePrograms.length}</td>
                  <td><button className="btn btn-default btn-sm" onClick={(e) => {
                    e.preventDefault();
                    this.setState({showDeleteModal: true, selectedDupe: dupe.Source, selectedDraft: question.draftQuestion});
                    return false;
                  }}>{this.deleteModal()}Select</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    if(!this.props.survey || !this.props.potentialDupes){
      return ('Loading...');
    }
    return (
      <div>
        <div className="maincontent-details">
          <h1 className="maincontent-item-name"><strong>Survey Name:</strong> {this.props.survey.name} </h1>
          <p className="maincontent-item-info">Version: {this.props.survey.version} - Author: {this.props.survey.userId} </p>
          {this.surveillanceProgram()}
          {this.surveillanceSystem()}
          <div>
            {this.props.survey.description}
          </div>
          <hr />
          <div className="import-note warning">
            <strong>Potential duplicate questions</strong><br />
            This survey contains draft questions which may be duplicates of existing questions in the Vocabulary Service.
            You may select an existing question to replace the suspected duplicate question in the survey.
          </div>
          {this.state.viewPage === 'all' && this.viewAllDupes()}
          {this.state.viewPage === 'single' && this.viewSingleDupe()}
        </div>
     </div>
    );
  }
}

SurveyDedupe.propTypes = {
  survey: surveyProps,
  potentialDupes: PropTypes.array,
  markAsDuplicate: PropTypes.func,
  currentUser: currentUserProps,
};

export default SurveyDedupe;
