import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import join from 'lodash/join';

import { surveyProps } from '../../prop-types/survey_props';
import currentUserProps from "../../prop-types/current_user_props";
import LoadingSpinner from '../../components/LoadingSpinner';

import iconMap from '../../styles/iconMap';

class SurveyDedupe extends Component {
  constructor(props) {
    super(props);
    this.selectTab = this.selectTab.bind(this);
    this.state = {
      viewType: 'question',
      viewPage: 'all',
      viewSectionIndex: 0,
      viewQuestionIndex: 0,
      viewResponseSetIndex: 0,
      showDeleteModal: false,
      showLinkModal: false,
      selectedDupe: {},
      selectedDraft: {}
    };
  }

  selectTab(tabName) {
    this.setState({
      viewType: tabName,
      viewPage: 'all',
      viewSectionIndex: 0,
      viewQuestionIndex: 0,
      viewResponseSetIndex: 0,
      showDeleteModal: false,
      showLinkModal: false,
    });
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
    let dupeItem = this.state.selectedDupe;
    let draft = this.state.selectedDraft;
    return(
      <div className="static-modal">
        <Modal animation={false} show={this.state.showDeleteModal} onHide={()=>this.setState({showDeleteModal: false})} role="dialog" aria-label="Delete Confirmation Modal">
          <Modal.Header>
            <Modal.Title componentClass="h2"><i className="fa fa-exclamation-triangle simple-search-icon" aria-hidden="true"><text className="sr-only">Warning for</text></i> Select &amp; Replace Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to replace "{draft.content || draft.name}" with "{dupeItem.name}" and mark the {this.state.viewType} draft as a duplicate? Doing so will replace the duplicate draft {this.state.viewType} with the preferred content throughout the system and delete the duplicate.
            This action cannot be undone.</p>
          </Modal.Body>
          <br/>
          <br/>
          <Modal.Footer>
            <Button onClick={() => {
              this.props.markAsDuplicate(draft.id, dupeItem.id, this.props.survey.id, this.state.viewType);
              this.setState({viewPage: 'all', showDeleteModal: false, success: {msg: `Successfully replaced:  ${draft.content || draft.name } with `, id: dupeItem.id, name: dupeItem.name}, warning: {} });
            }} bsStyle="primary">Confirm Replace</Button>
            <Button onClick={()=>this.setState({showDeleteModal: false})} bsStyle="default">Cancel</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  linkModal() {
    let dupeItem = this.state.selectedDupe;
    let draft = this.state.selectedDraft;
    return(
      <div className="static-modal">
        <Modal animation={false} show={this.state.showLinkModal} onHide={()=>this.setState({showLinkModal: false})} role="dialog" aria-label="Link Confirmation Modal">
          <Modal.Header>
            <Modal.Title componentClass="h2"><i className="fa fa-exclamation-triangle simple-search-icon" aria-hidden="true"><text className="sr-only">Warning for</text></i> Mark &amp; Link Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to make the following changes:</p>
            <ul>
              <li>The {this.state.viewType} from your survey will be moved to the "Duplicate" content stage and marked as such on its details page.</li>
              <li>"{draft.content || draft.name}" from your survey will provide a link to the preferred "{dupeItem.name}" on its details page under the "Duplicate of:" field.</li>
            </ul>
            <p><strong>NOTE: </strong>This is a <strong>published</strong> item. Accordingly, this action WILL NOT replace the item marked as duplicate with the linked item on any published surveys or sections. An author must revise these published items. This action allows you to indicate which item is a preferred replacement to promote harmonization and reduce redundancy.</p>
          </Modal.Body>
          <br/>
          <br/>
          <Modal.Footer>
            <Button onClick={() => {
              this.props.linkToDuplicate(draft.id, dupeItem.id, this.props.survey.id, this.state.viewType);
              this.setState({viewPage: 'all', showLinkModal: false, success: {msg: `Successfully linked:  ${draft.content || draft.name } with `, id: dupeItem.id, name: dupeItem.name}, warning: {} });
            }} bsStyle="primary">Confirm Link</Button>
            <Button onClick={()=>this.setState({showLinkModal: false})} bsStyle="default">Cancel</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  viewAllDupes(qCount) {
    return (
      <div>
        {this.state.error && this.state.error.msg &&
          <div className="alert alert-danger">
            {this.state.error.msg}
          </div>
        }
        {this.state.warning && this.state.warning.msg &&
          <div className="alert alert-warning">
            {this.state.warning.msg}
          </div>
        }
        {this.state.success && this.state.success.msg &&
          <div className="alert alert-success">
            {this.state.success.msg}
            <a href={`/#/questions/${this.state.success.id}`} target="_blank">{this.state.success.name}</a>
          </div>
        }
        <h2 className="h4">Potential Duplicate Questions ({qCount})</h2>
        <table className="table table-dark-header">
          <caption className="sr-only">Information about potential duplicate draft questions in this survey</caption>
          <thead>
            <tr>
              <th scope="col" id="name-desc-column">Name &amp; Description</th>
              <th scope="col" id="response-column">Response Type</th>
              <th scope="col" id="category-column">Category</th>
              <th scope="col" id="action-column" className="action">Action</th>
            </tr>
          </thead>
          {this.props.potentialDupes.map((section, i) => {
            return (
              <tbody key={i}>
                {section.qCount > 0 && <tr className="section-row">
                  <td id={`section_${i}`} scope="colgroup" colSpan="4"><i className={`fa ${iconMap['section']}`} aria-hidden="true"></i><text className="sr-only">Click to view parent section</text> <a href={`/#/sections/${section.id}`} target="_blank">{section.name}</a> ({section.qCount})<span className="sr-only">There are {section.qCount} potential duplicate questions in this section</span></td>
                </tr>}
                {section.dupes.questions.map((question, j) => {
                  return (
                    <tr key={j}>
                      <td scope="row" headers={`section_${i} name-desc-column`}><text>{question.draftQuestion.content}</text><br/><span className="small">{question.draftQuestion.description}</span></td>
                      <td headers={`section_${i} response-column`}><i className='fa fa-comments' aria-hidden="true"></i> {question.draftQuestion.responseType}</td>
                      <td headers={`section_${i} category-column`}>{question.draftQuestion.category}</td>
                      <td headers={`section_${i} action-column`}><button className="btn btn-sm btn-default" id={`view-single-${question.draftQuestion.content}`} onClick={()=>this.setState({viewPage: 'single', viewSectionIndex: i, viewQuestionIndex: j})}>View</button></td>
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

  viewAllRSDupes(rsCount) {
    return (
      <div>
        {this.state.error && this.state.error.msg &&
          <div className="alert alert-danger">
            {this.state.error.msg}
          </div>
        }
        {this.state.warning && this.state.warning.msg &&
          <div className="alert alert-warning">
            {this.state.warning.msg}
          </div>
        }
        {this.state.success && this.state.success.msg &&
          <div className="alert alert-success">
            {this.state.success.msg}
            <a href={`/#/responseSets/${this.state.success.id}`} target="_blank">{this.state.success.name}</a>
          </div>
        }
        <h2 className="h4">Potential Duplicate Response Sets ({rsCount})</h2>
        <table className="table table-dark-header">
          <caption className="sr-only">Information about potential duplicate draft response sets in this survey</caption>
          <thead>
            <tr>
              <th scope="col" id="name-desc-column">Name &amp; Description</th>
              <th scope="col" id="linked-column">Linked Question</th>
              <th scope="col" id="responses-column">Responses</th>
              <th scope="col" id="action-column" className="action">Action</th>
            </tr>
          </thead>
          {this.props.potentialDupes.map((section, i) => {
            return (
              <tbody key={i}>
                {section.rsCount > 0 && <tr className="section-row">
                  <td id={`section_${i}`} scope="colgroup" colSpan="4"><i className={`fa ${iconMap['section']}`} aria-hidden="true"></i><text className="sr-only">Click to view parent section</text> <a href={`/#/sections/${section.id}`} target="_blank">{section.name}</a> ({section.rsCount})<span className="sr-only">There are {section.rsCount} potential duplicate response sets in this section</span></td>
                </tr>}
                {section.dupes.responseSets.map((responseSet, j) => {
                  return (
                    <tr key={j}>
                      <td scope="row" headers={`section_${i} name-desc-column`}><text>{responseSet.draftResponseSet.name}</text><br/><span className="small">{responseSet.draftResponseSet.description}</span></td>
                      <td headers={`section_${i} linked-column`}><i className={`fa ${iconMap['question']}`} aria-hidden="true"></i> {responseSet.draftResponseSet.linkedQuestion && responseSet.draftResponseSet.linkedQuestion.content}</td>
                      <td headers={`section_${i} responses-column`}>{responseSet.draftResponseSet.responses && join(responseSet.draftResponseSet.responses.map((r) => r.displayName), ', ')}</td>
                      <td headers={`section_${i} action-column`}><button className="btn btn-sm btn-default" id={`view-single-${responseSet.draftResponseSet.name}`} onClick={()=>this.setState({viewPage: 'single', viewSectionIndex: i, viewResponseSetIndex: j})}>View</button></td>
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
      this.setState({viewSectionIndex: prevSectionIndex-1, viewQuestionIndex: prevSection.dupes.questions.length-1});
    }
  }

  nextQuestion() {
    let prevQuestionIndex = this.state.viewQuestionIndex;
    let prevSectionIndex = this.state.viewSectionIndex;
    if(prevQuestionIndex < (this.props.potentialDupes[prevSectionIndex].dupes.questions.length-1)) {
      this.setState({viewQuestionIndex: prevQuestionIndex+1});
    } else {
      this.setState({viewSectionIndex: prevSectionIndex+1, viewQuestionIndex: 0});
    }
  }

  previousQuestionCount(sectionIndex) {
    if (sectionIndex > 0) {
      return this.props.potentialDupes[sectionIndex-1].dupes.questions.length + this.previousQuestionCount(sectionIndex-1);
    } else {
      return 0;
    }
  }

  previousResponseSet() {
    let prevResponseSetIndex = this.state.viewResponseSetIndex;
    let prevSectionIndex = this.state.viewSectionIndex;
    if(prevResponseSetIndex > 0) {
      this.setState({viewResponseSetIndex: prevResponseSetIndex-1});
    } else {
      let prevSection = this.props.potentialDupes[this.state.viewSectionIndex-1];
      this.setState({viewSectionIndex: prevSectionIndex-1, viewResponseSetIndex: prevSection.dupes.responseSets.length-1});
    }
  }

  nextResponseSet() {
    let prevResponseSetIndex = this.state.viewResponseSetIndex;
    let prevSectionIndex = this.state.viewSectionIndex;
    if(prevResponseSetIndex < (this.props.potentialDupes[prevSectionIndex].dupes.responseSets.length-1)) {
      this.setState({viewResponseSetIndex: prevResponseSetIndex+1});
    } else {
      this.setState({viewSectionIndex: prevSectionIndex+1, viewResponseSetIndex: 0});
    }
  }

  previousResponseSetCount(sectionIndex) {
    if (sectionIndex > 0) {
      return this.props.potentialDupes[sectionIndex-1].dupes.responseSets.length + this.previousResponseSetCount(sectionIndex-1);
    } else {
      return 0;
    }
  }

  viewSingleDupe(qCount) {
    let section = this.props.potentialDupes[this.state.viewSectionIndex];
    let question = section.dupes.questions[this.state.viewQuestionIndex];
    let pageIndex = this.previousQuestionCount(this.state.viewSectionIndex) + this.state.viewQuestionIndex + 1;
    if (question) {
      return (
        <div>
          <div className="duplicate-nav-buttons">
            <h2 className="h4">Viewing {pageIndex} of {qCount} Potential Duplicate Questions <a href="#" onClick={(e) => {
              e.preventDefault();
              this.setState({ viewPage: 'all' });
            }}>(List all)</a></h2>
            <button className="btn btn-default" disabled={pageIndex == 1} onClick={() => this.previousQuestion()}><i className="fa fa-arrow-left"></i><span className="sr-only">Switch to the previous potential duplicate question</span></button>
            <button className="btn btn-default" disabled={pageIndex == qCount} onClick={() => this.nextQuestion()}><i className="fa fa-arrow-right"></i><span className="sr-only">Switch to the next potential duplicate question</span></button>
          </div>
          <h3 className="h4">Duplicate Question</h3>
          <p className="linked-section">Linked Section: <i className={`fa ${iconMap['section']}`} aria-hidden="true"></i><text className="sr-only">Click to view parent section</text> <a href={`/#/sections/${section.id}`} target="_blank">{section.name}</a> ({this.state.viewQuestionIndex+1} of {section.qCount})<span className="sr-only">There are {section.qCount} potential duplicate questions in this section</span></p>
          <table className="table table-dark-header">
            <caption className="sr-only">Information about potential duplicate draft questions in this survey</caption>
            <thead>
              <tr>
                <th scope="col" id="name-desc-q-column">Question Name &amp; Description</th>
                <th scope="col" id="response-type-q-column">Response Type</th>
                <th scope="col" id="category-q-column">Category</th>
              </tr>
            </thead>
            <tbody>
              <tr className="duplicate-row">
                <td scope="row" headers="name-desc-q-column"><text>{question.draftQuestion.content}</text><br/><span className="small">{question.draftQuestion.description}</span></td>
                <td headers="response-type-q-column"><i className='fa fa-comments' aria-hidden="true"></i> {question.draftQuestion.responseType}</td>
                <td headers="category-q-column">{question.draftQuestion.category}</td>
              </tr>
            </tbody>
          </table>
          <div className="suggested-replacements">
            <h3 className="h4">Suggested Replacement Questions ({question.potentialDuplicates && question.potentialDuplicates.length})</h3>
            <table className="table table-dark-header">
              <caption className="sr-only">Information about suggested replacement questions</caption>
              <thead>
                <tr>
                  <th scope="col" id="match-score-column" className="match-score">Match Score</th>
                  <th scope="col" id="name-desc-column">Question Name &amp; Description</th>
                  <th scope="col" id="cdc-pref-column">CDC Preferred</th>
                  <th scope="col" id="response-type-column">Response Type</th>
                  <th scope="col" id="category-column">Question Category</th>
                  <th scope="col" id="usage-column" className="text-center">Program Usage</th>
                  <th scope="col" id="action-column" className="action">Action</th>
                </tr>
              </thead>
              <tbody>
                {question.potentialDuplicates && question.potentialDuplicates.map((dupe, i) => {
                  return (
                    <tr key={i}>
                      <td headers="match-score-column" className="match-score">{dupe.Score}</td>
                      <td scope="row" headers="name-desc-column"><a href={`/#/questions/${dupe.Source.id}`} target="_blank">{dupe.Source.name}</a><br/><span className="small">{dupe.Source.description}</span></td>
                      <td headers="cdc-pref-column" className={dupe.Source.preferred ? 'cdc-preferred-column' : ''}>{dupe.Source.preferred && <text className='sr-only'>This content is marked as preferred by the CDC</text>}</td>
                      <td headers="response-type-column"><i className='fa $fa-comments' aria-hidden="true"></i> {dupe.Source.responseType && dupe.Source.responseType.name}</td>
                      <td headers="category-column">{dupe.Source.category && dupe.Source.category.name}</td>
                      <td headers="usage-column" className="text-center">{dupe.Source.surveillancePrograms && dupe.Source.surveillancePrograms.length}</td>
                      {question.draftQuestion && question.draftQuestion.status && question.draftQuestion.status === 'draft' && <td headers="action-column"><button id={`select-question-${dupe.Source.name}`} className="btn btn-default btn-sm" onClick={(e) => {
                        e.preventDefault();
                        this.setState({showDeleteModal: true, selectedDupe: dupe.Source, selectedDraft: question.draftQuestion});
                        return false;
                      }}>Replace</button></td>}
                      {question.draftQuestion && question.draftQuestion.status && question.draftQuestion.status === 'published' && <td headers="action-column"><button id={`select-question-${dupe.Source.name}`} className="btn btn-default btn-sm" onClick={(e) => {
                        e.preventDefault();
                        this.setState({showLinkModal: true, selectedDupe: dupe.Source, selectedDraft: question.draftQuestion});
                        return false;
                      }}>Link</button></td>}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    } else {
      return;
    }
  }

  viewSingleRSDupe(rsCount) {
    let section = this.props.potentialDupes[this.state.viewSectionIndex];
    let responseSet = section.dupes.responseSets[this.state.viewResponseSetIndex];
    let pageIndex = this.previousResponseSetCount(this.state.viewSectionIndex) + this.state.viewResponseSetIndex + 1;
    if (responseSet) {
      return (
        <div>
          <div className="duplicate-nav-buttons">
            <button className="btn btn-default" disabled={pageIndex == 1} onClick={() => this.previousResponseSet()}><i className="fa fa-arrow-left"></i><span className="sr-only">Switch to the previous potential duplicate response set</span></button>
            <button className="btn btn-default" disabled={pageIndex == rsCount} onClick={() => this.nextResponseSet()}><i className="fa fa-arrow-right"></i><span className="sr-only">Switch to the next potential duplicate response set</span></button>
          </div>

          <h2 className="h4 pull-right">Viewing {pageIndex} of {rsCount} Potential Duplicate Response Sets <a href="#" onClick={(e) => {
            e.preventDefault();
            this.setState({ viewPage: 'all' });
          }}>(List all)</a></h2>
          <h3 className="h4">Duplicate Response Set</h3>
          <p className="linked-section">Linked Section: <i className={`fa ${iconMap['section']}`} aria-hidden="true"></i><text className="sr-only">Click to view parent section</text> <a href={`/#/sections/${section.id}`} target="_blank">{section.name}</a> ({this.state.viewResponseSetIndex+1} of {section.rsCount})<span className="sr-only">There are {section.rsCount} potential duplicate questions in this section</span></p>
          <table className="table">
            <caption>Information about potential duplicate draft response sets in this survey</caption>
            <thead>
              <tr className="active">
                <th scope="col" id="name-desc-rs-column">Name &amp; Description</th>
                <th scope="col" id="linked-rs-column">Linked Question</th>
                <th scope="col" id="responses-rs-column">Responses</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td scope="row" headers="name-desc-rs-column"><text>{responseSet.draftResponseSet.name}</text><br/><span className="small">{responseSet.draftResponseSet.description}</span></td>
                <td headers="linked-rs-column"><a target='_blank' href={`/#/questions/${responseSet.draftResponseSet.linkedQuestion && responseSet.draftResponseSet.linkedQuestion.id}`}><i className={`fa ${iconMap['question']}`} aria-hidden="true"></i> {responseSet.draftResponseSet.linkedQuestion && responseSet.draftResponseSet.linkedQuestion.content}</a></td>
                <td headers="responses-rs-column">{responseSet.draftResponseSet.responses && join(responseSet.draftResponseSet.responses.map((r) => r.displayName), ', ')}</td>
              </tr>
            </tbody>
          </table>
          <div className="suggested-replacements">
          <h3 className="h4">Suggested Replacement Response Sets ({responseSet.potentialDuplicates && responseSet.potentialDuplicates.length})</h3>
            <table className="table">
              <caption>Information about suggested replacement response sets</caption>
              <thead>
                <tr className="active">
                  <th scope="col" id="match-score-column" className="match-score">Match Score</th>
                  <th scope="col" id="name-desc-column">Response Set Name &amp; Description</th>
                  <th scope="col" id="cdc-pref-column">CDC Preferred</th>
                  <th scope="col" id="usage-column" className="text-center">Program Usage</th>
                  <th scope="col" id="action-column" className="action">Action</th>
                </tr>
              </thead>
              <tbody>
                {responseSet.potentialDuplicates && responseSet.potentialDuplicates.map((dupe, i) => {
                  return (
                    <tr key={i}>
                      <td headers="match-score-column" className="match-score">{dupe.Score}</td>
                      <td scope="row" headers="name-desc-column"><a href={`/#/responseSets/${dupe.Source.id}`} target="_blank">{dupe.Source.name}</a><br/><span className="small">{dupe.Source.description}</span></td>
                      <td headers="cdc-pref-column" className={dupe.Source.preferred ? 'cdc-preferred-column' : ''}>{dupe.Source.preferred && <text className='sr-only'>This content is marked as preferred by the CDC</text>}</td>
                      <td headers="usage-column" className="text-center">{dupe.Source.surveillancePrograms && dupe.Source.surveillancePrograms.length}</td>
                      {responseSet.draftResponseSet && responseSet.draftResponseSet.status && responseSet.draftResponseSet.status === 'draft' && <td headers="action-column"><button id={`select-response-set-${dupe.Source.name}`} className="btn btn-default btn-sm" onClick={(e) => {
                        e.preventDefault();
                        this.setState({showDeleteModal: true, selectedDupe: dupe.Source, selectedDraft: responseSet.draftResponseSet});
                        return false;
                      }}>Replace</button></td>}
                      {responseSet.draftResponseSet && responseSet.draftResponseSet.status && responseSet.draftResponseSet.status === 'published' && <td headers="action-column"><button id={`select-response-set-${dupe.Source.name}`} className="btn btn-default btn-sm" onClick={(e) => {
                        e.preventDefault();
                        this.setState({showLinkModal: true, selectedDupe: dupe.Source, selectedDraft: responseSet.draftResponseSet});
                        return false;
                      }}>Link</button></td>}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    } else {
      return;
    }
  }

  render() {
    if(!this.props.survey || !this.props.potentialDupes){
      return <LoadingSpinner msg="Loading survey..." />;
    }
    let qCountArray = this.props.potentialDupes.map((s) => s.qCount);
    let rsCountArray = this.props.potentialDupes.map((s) => s.rsCount);
    let qCount = qCountArray.length > 0 ? qCountArray.reduce((prev, next) => prev + next) : 0;
    let rsCount = rsCountArray.length > 0 ? rsCountArray.reduce((prev, next) => prev + next) : 0;
    return (
      <div>
        <div className="maincontent-details">
          {this.deleteModal()}
          {this.linkModal()}
          <h1 className="maincontent-item-name"><strong>Survey Name:</strong> <a href={`/#/surveys/${this.props.survey.id}`}>{this.props.survey.name}</a> </h1>
          <p className="maincontent-item-info">Version: {this.props.survey.version} - Author: {this.props.survey.userId} </p>
          {this.surveillanceProgram()}
          {this.surveillanceSystem()}
          <div>
            {this.props.survey.description}
          </div>
          <br/>
          <ul className="nav nav-tabs" role="tablist">
            <li id="question-list-tab" className="nav-item active" role="tab" onClick={() => this.selectTab('question')} aria-selected={this.state.viewType === 'question'} aria-controls="question-list">
              <a className="nav-link" data-toggle="tab" href="#question-list" role="tab">Questions ({qCount})</a>
            </li>
            <li id="response-set-list-tab" className="nav-item" role="tab" onClick={() => this.selectTab('response set')} aria-selected={this.state.viewType === 'response set'} aria-controls="response-set-list">
              <a className="nav-link" data-toggle="tab" href="#response-set-list" role="tab">Response Sets ({rsCount})</a>
            </li>
          </ul>
          <div className="tab-content">
            <div className="import-note warning">
              <strong>Potential duplicate {this.state.viewType}s</strong><br />
              This survey contains draft {this.state.viewType}s which may be duplicates of existing {this.state.viewType}s in the Vocabulary Service.
              You may select an existing {this.state.viewType} to replace the suspected duplicate {this.state.viewType} in the survey.
            </div>
            <div className="tab-pane active step-focus" id="question-list" role="tabpanel" aria-hidden={this.state.viewType !== 'question'} aria-labelledby="question-list-tab">
              {this.state.viewPage === 'all' && this.viewAllDupes(qCount)}
              {this.state.viewPage === 'single' && this.viewSingleDupe(qCount)}
              {this.state.viewType === 'question' && qCount < 1 && <p>No duplicate draft questions detected on this survey</p>}
            </div>
            <div className="tab-pane" id="response-set-list" role="tabpanel" aria-hidden={this.state.viewType !== 'response set'} aria-labelledby="response-set-list-tab">
              {this.state.viewPage === 'all' && this.viewAllRSDupes(rsCount)}
              {this.state.viewPage === 'single' && this.viewSingleRSDupe(rsCount)}
              {this.state.viewType === 'response set' && rsCount < 1 && <p>No duplicate draft response sets detected on this survey</p>}
            </div>
          </div>
        </div>
     </div>
    );
  }
}

SurveyDedupe.propTypes = {
  survey: surveyProps,
  potentialDupes: PropTypes.array,
  markAsDuplicate: PropTypes.func,
  isLoading: PropTypes.bool,
  loadStatus : PropTypes.string,
  loadStatusText : PropTypes.string,
  linkToDuplicate: PropTypes.func,
  currentUser: currentUserProps,
};

export default SurveyDedupe;
