import React, { Component } from 'react';
import PropTypes from 'prop-types';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import { hashHistory, Link } from 'react-router';
import Linkify from 'react-linkify';
import { Modal, Button, Row, Col } from 'react-bootstrap';

import VersionInfo from "../VersionInfo";
import ResponseSetList from "../response_sets/ResponseSetList";
import CodedSetTable from "../CodedSetTable";
import TagModal from "../TagModal";
import ProgramsAndSystems from "../shared_show/ProgramsAndSystems";
import PublisherLookUp from "../shared_show/PublisherLookUp";
import ChangeHistoryTab from "../shared_show/ChangeHistoryTab";
import GroupLookUp from "../shared_show/GroupLookUp";
import Breadcrumb from "../Breadcrumb";
import BasicAlert from '../../components/BasicAlert';
import LoadingSpinner from '../../components/LoadingSpinner';

import { questionProps } from "../../prop-types/question_props";
import currentUserProps from "../../prop-types/current_user_props";
import { publishersProps } from "../../prop-types/publisher_props";

import { isEditable, isRevisable, isPublishable, isRetirable, isExtendable, isGroupable, isSimpleEditable } from '../../utilities/componentHelpers';

export default class QuestionShow extends Component {
  constructor(props) {
    super(props);
    this.state = { tagModalOpen: false, collapseSectionPath: [], selectedTab: 'main', showDeleteModal: false, showPublishModal: false };
  }

  componentDidMount() {
    const _name = this.props.question.content ? this.props.question.content : this.props.question.name;
    this.props.addBreadcrumbItem({type:'question',id:this.props.question.id,name:_name});
  }

  render() {
    const {question} = this.props;
    if(question === undefined || question.content === undefined){
      return (
      <div>
        <div>
          <div className="showpage_header_container no-print">
            <ul className="list-inline">
              <li className="showpage_button"><span className="fa fa-arrow-left fa-2x" aria-hidden="true" onClick={hashHistory.goBack}></span></li>
              <li className="showpage_title"><h1>Question Details</h1></li>
            </ul>
          </div>
        </div>
        <Row>
          <Col xs={12}>
              <div className="main-content">
                {this.props.isLoading && <LoadingSpinner msg="Loading question..." />}
                {this.props.loadStatus == 'failure' &&
                  <BasicAlert msg={this.props.loadStatusText} severity='danger' />
                }
                {this.props.loadStatus == 'success' && question === undefined &&
                 <BasicAlert msg="Sorry, there is a problem loading this question." severity='warning' />
                }
              </div>
          </Col>
        </Row>
      </div>
      );
    }

    return (
      <div>
        <div id={"question_id_"+question.id}>
          <div className="showpage_header_container no-print">
            <ul className="list-inline">
              <li className="showpage_button"><span className="fa fa-arrow-left fa-2x" aria-hidden="true" onClick={hashHistory.goBack}></span></li>
              <li className="showpage_title"><h1>Question Details {question.contentStage && (<text>[{question.contentStage.toUpperCase()}]</text>)}</h1></li>
            </ul>
          </div>
        </div>
        <Row className="no-inside-gutter">
          {this.historyBar(question)}
          {this.mainContent(question)}
        </Row>
      </div>
    );
  }

  reviseQuestionButton(){
    if(this.props.currentUser && this.props.currentUser.id && this.props.question && this.props.question.mostRecent == this.props.question.version){
      if(this.props.question.status && this.props.question.status == 'draft'){
        return( <Link className="btn btn-primary" to={`/questions/${this.props.question.id}/edit`}>Edit</Link> );
      } else {
        return( <Link className="btn btn-primary" to={`/questions/${this.props.question.id}/revise`}>Revise</Link> );
      }
    }
  }

  extendQuestionButton() {
    if(this.props.currentUser && this.props.currentUser.id && this.props.question && this.props.question.mostRecent == this.props.question.version){
      if(this.props.question.status && this.props.question.status == 'published'){
        return( <Link to={`/questions/${this.props.question.id}/extend`} className="btn btn-primary">Extend</Link> );
      }
    }
  }

  deleteModal(question) {
    return(
      <div className="static-modal">
        <Modal animation={false} show={this.state.showDeleteModal} onHide={()=>this.setState({showDeleteModal: false})} role="dialog" aria-label="Delete Confirmation Modal">
          <Modal.Header>
            <Modal.Title componentClass="h2"><i className="fa fa-exclamation-triangle simple-search-icon" aria-hidden="true"><text className="sr-only">Warning for</text></i> Delete Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this question? This action cannot be undone.</p>
            <p><strong>Delete Question: </strong>This will delete the question but not any of the other items created or associated with it</p>
            <p><strong>Delete All: </strong>This will delete the question and all other unused draft response sets associated with it</p>
          </Modal.Body>
          <br/>
          <br/>
          <Modal.Footer>
            <Button onClick={() => this.props.deleteQuestion(question.id, false, (response) => {
              if (response.status == 200) {
                let stats = Object.assign({}, this.props.stats);
                stats.questionCount = this.props.stats.questionCount - 1;
                stats.myQuestionCount = this.props.stats.myQuestionCount - 1;
                this.props.setStats(stats);
                this.props.router.push('/');
              }
            })} bsStyle="primary">Delete Question</Button>
            <Button onClick={() => this.props.deleteQuestion(question.id, true, (response) => {
              if (response.status == 200) {
                let stats = Object.assign({}, this.props.stats);
                stats.questionCount = this.props.stats.questionCount - 1;
                stats.myQuestionCount = this.props.stats.myQuestionCount - 1;
                this.props.setStats(stats);
                this.props.router.push('/');
              }
            })} bsStyle="primary">Delete All</Button>
            <Button onClick={()=>this.setState({showDeleteModal: false})} bsStyle="default">Cancel</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  publishModal() {
    return(
      <div className="static-modal">
        <Modal animation={false} show={this.state.showPublishModal} onHide={()=>this.setState({showPublishModal: false})} role="dialog" aria-label="Publish Confirmation Modal">
          <Modal.Header>
            <Modal.Title componentClass="h2"><i className="fa fa-exclamation-triangle simple-search-icon" aria-hidden="true"><text className="sr-only">Warning for</text></i> Publish Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to publish this question?</p><p>Publishing this item will change the visibility of this content to public, making it available to all authenticated and unauthenticated users.</p><p>This action cannot be undone.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.props.handlePublish(this.props.question)} bsStyle="primary">Confirm Publish</Button>
            <Button onClick={()=>this.setState({showPublishModal: false})} bsStyle="default">Cancel</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  mainContent(question) {
    return (
      <Col md={9} className="maincontent">
        {this.props.currentUser && this.props.currentUser.id &&
          <div className="action_bar no-print">
            {isEditable(question, this.props.currentUser) &&
              <PublisherLookUp publishers={this.props.publishers}
                             itemType="Question" />
            }
            {isGroupable(question, this.props.currentUser) &&
              <GroupLookUp item={question} addFunc={this.props.addQuestionToGroup} removeFunc={this.props.removeQuestionFromGroup} currentUser={this.props.currentUser} />
            }
            {isRevisable(question, this.props.currentUser) &&
              <Link className="btn btn-primary" to={`/questions/${this.props.question.id}/revise`}>Revise</Link>
            }
            {isEditable(question, this.props.currentUser) &&
              <Link className="btn btn-primary" to={`/questions/${this.props.question.id}/edit`}>Edit</Link>
            }
            {isExtendable(question, this.props.currentUser) &&
              <Link to={`/questions/${this.props.question.id}/extend`} className="btn btn-primary">Extend</Link>
            }
            {isRetirable(question, this.props.currentUser) &&
              <button className="btn btn-primary" onClick={() => this.props.retireQuestion(question.id) }>Retire</button>
            }
            {isSimpleEditable(question, this.props.currentUser) &&
              <div className="btn-group">
                <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span className="fa fa-sitemap"></span> Stage <span className="caret"></span>
                </button>
                <ul className="dropdown-menu">
                  <li key="header" className="dropdown-header">Update Content Stage:</li>
                  <li><a href='#' onClick={(e) => {
                    e.preventDefault();
                    this.props.updateStageQuestion(question.id, 'Comment Only');
                  }}>Comment Only</a></li>
                  <li><a href='#' onClick={(e) => {
                    e.preventDefault();
                    this.props.updateStageQuestion(question.id, 'Trial Use');
                  }}>Trial Use</a></li>
                  {question.status === 'draft' && <li><a href='#' onClick={(e) => {
                    e.preventDefault();
                    this.props.updateStageQuestion(question.id, 'Draft');
                  }}>Draft</a></li>}
                  {question.status === 'published' && <li><a href='#' onClick={(e) => {
                    e.preventDefault();
                    this.props.updateStageQuestion(question.id, 'Published');
                  }}>Published</a></li>}
                </ul>
              </div>
            }
            {isPublishable(question, this.props.currentUser) &&
              <button className="btn btn-primary" onClick={() => this.setState({showPublishModal: true}) }>{this.publishModal()}Publish</button>
            }
            {this.props.currentUser && this.props.currentUser.admin && !question.preferred &&
              <a className="btn btn-default" href="#" onClick={(e) => {
                e.preventDefault();
                this.props.addPreferred(question.id, 'Question', () => {
                  this.props.fetchQuestion(question.id);
                });
                return false;
              }}><i className="fa fa-square"></i> CDC Pref<text className="sr-only">Click to add CDC preferred attribute to this content</text></a>
            }
            {this.props.currentUser && this.props.currentUser.admin && question.preferred &&
              <a className="btn btn-default" href="#" onClick={(e) => {
                e.preventDefault();
                this.props.removePreferred(question.id, 'Question', () => {
                  this.props.fetchQuestion(question.id);
                });
                return false;
              }}><i className="fa fa-check-square"></i> CDC Pref<text className="sr-only">Click to remove CDC preferred attribute from this content</text></a>
            }
            {isEditable(question, this.props.currentUser) &&
              <a className="btn btn-default" href="#" onClick={(e) => {
                e.preventDefault();
                this.setState({showDeleteModal: true});
                return false;
              }}>{this.deleteModal(question)}Delete</a>
            }
          </div>
        }
        <div className="maincontent-details">
          <Breadcrumb currentUser={this.props.currentUser} />
          <h1 className={`maincontent-item-name ${question.preferred ? 'cdc-preferred-note' : ''}`}><strong>Question Name:</strong> {question.content} {question.preferred && <text className="sr-only">This content is marked as preferred by the CDC</text>}</h1>
          <p className="maincontent-item-info">Version: {question.version} - Author: {question.createdBy && question.createdBy.email} </p>
          <p className="maincontent-item-info">Tags: {question.tagList && question.tagList.length > 0 ? (
            <text>{question.tagList.join(', ')}</text>
          ) : (
            <text>No Tags Found</text>
          )}
          {isSimpleEditable(question, this.props.currentUser) &&
            <a className='pull-right' href='#' onClick={(e) => {
              e.preventDefault();
              this.setState({ tagModalOpen: true });
            }}>Update Tags <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
              <TagModal show={this.state.tagModalOpen || false}
                        cancelButtonAction={() => this.setState({ tagModalOpen: false })}
                        tagList={question.tagList}
                        saveButtonAction={(tagList) => {
                          this.props.updateQuestionTags(question.id, tagList);
                          this.setState({ tagModalOpen: false });
                        }} />
            </a>
          }</p>
          <ul className="nav nav-tabs" role="tablist">
            <li id="main-content-tab" className="nav-item active" role="tab" onClick={() => this.setState({selectedTab: 'main'})} aria-selected={this.state.selectedTab === 'main'} aria-controls="main">
              <a className="nav-link" data-toggle="tab" href="#main-content" role="tab">Information</a>
            </li>
            <li id="change-history-tab" className="nav-item" role="tab" onClick={() => this.setState({selectedTab: 'changes'})} aria-selected={this.state.selectedTab === 'changes'} aria-controls="changes">
              <a className="nav-link" data-toggle="tab" href="#change-history" role="tab">Change History</a>
            </li>
          </ul>
          <div className="tab-content">
            <div className={`tab-pane ${this.state.selectedTab === 'changes' && 'active'}`} id="changes" role="tabpanel" aria-hidden={this.state.selectedTab !== 'changes'} aria-labelledby="change-history-tab">
              {isSimpleEditable(question, this.props.currentUser) ? (
                <ChangeHistoryTab versions={question.versions} type='question' majorVersion={question.version} />
              ) : (
                <div className='basic-c-box panel-default question-type'>
                  <div className="panel-heading">
                    <h2 className="panel-title">Changes</h2>
                  </div>
                  <div className="box-content">
                    You do not have permissions to see change history on this item (you must be a collaborating author / in the proper group).
                  </div>
                </div>
              )}
            </div>
            <div className={`tab-pane ${this.state.selectedTab === 'main' && 'active'}`} id="main" role="tabpanel" aria-hidden={this.state.selectedTab !== 'main'} aria-labelledby="main-content-tab">
              <div className="basic-c-box panel-default question-type">
                <div className="panel-heading">
                  <h2 className="panel-title">Details</h2>
                </div>
                <div className="box-content">
                  <strong>Version Independent ID: </strong>{question.versionIndependentId}
                </div>
                <div className="box-content">
                  <strong>Description: </strong>
                  <Linkify properties={{target: '_blank'}}>{question.description}</Linkify>
                </div>
                <div className="box-content">
                  <strong>Created: </strong>
                  { format(parse(question.createdAt,''), 'MMMM Do YYYY, h:mm:ss a') }
                </div>
                {question.contentStage && <div className="box-content">
                  <strong>Content Stage: </strong>
                  {question.contentStage}
                </div>}
                {question.duplicateOf && question.contentStage && question.contentStage === 'Duplicate' &&
                <div className="box-content">
                  <strong>Duplicate of: </strong><Link to={`/questions/${question.duplicateOf}`}>Question #{question.duplicateOf}</Link>
                </div>
                }
                { this.props.currentUser && question.status && question.status === 'published' &&
                <div className="box-content">
                  <strong>Visibility: </strong>Published (publicly available)
                </div>
                }
                { this.props.currentUser && question.status && question.status === 'draft' &&
                <div className="box-content">
                  <strong>Visibility: </strong>Draft (authors and publishers only)
                </div>
                }
                { question.parent &&
                  <div className="box-content">
                    <strong>Extended from: </strong>
                    <Link to={`/questions/${question.parent.id}`}>{ question.parent.name || question.parent.content }</Link>
                  </div>
                }
                { question.status === 'published' && question.publishedBy && question.publishedBy.email &&
                <div className="box-content">
                  <strong>Published By: </strong>
                  {question.publishedBy.email}
                </div>
                }
                {question.category && <div className="box-content">
                  <strong>Category: </strong>
                  {question.category.name}
                </div>}
                {question.subcategory && <div className="box-content">
                  <strong>Subcategory: </strong>
                  {question.subcategory.name}
                </div>}
                {question.responseType && <div className="box-content">
                  <strong>Response Type: </strong>
                  {question.responseType.name}
                </div>}
                {question.dataCollectionMethods && question.dataCollectionMethods.length > 0 && <div className="box-content">
                  <strong>Data Collection Methods: </strong>
                  <ul>
                    {question.dataCollectionMethods.map((dcm, i) => {
                      return (<li key={i}>{dcm}</li>);
                    })}
                  </ul>
                </div>}
                {question.responseType && question.responseType.code === 'choice' && <div className="box-content">
                  <strong>Other Allowed: </strong>
                  {question.otherAllowed ? 'Yes' : 'No' }
                </div>}
              </div>
              <div className="basic-c-box panel-default">
                <div className="panel-heading">
                  <h2 className="panel-title">
                    Code System Mappings
                  </h2>
                </div>
                <div className="box-content">
                  <div id="concepts-table">
                    <CodedSetTable items={question.concepts} itemName={'Code System Mapping'} />
                  </div>
                </div>
              </div>
              {question.sections && question.sections.length > 0 &&
                <div className="basic-c-box panel-default">
                  <div className="panel-heading">
                    <h2 className="panel-title">
                      <a className="panel-toggle" data-toggle="collapse" href={`#collapse-linked-sections`}><i className="fa fa-bars" aria-hidden="true"></i>
                      <text className="sr-only">Click link to expand information about </text>Parent Items</a>
                    </h2>
                  </div>
                  <div className="panel-collapse panel-details collapse" id="collapse-linked-sections">
                    <div className="box-content panel-body">
                      {question.parentItems && question.parentItems.length > 0 && question.parentItems[0].error === undefined ? ( <ul className="no-bullet-list">
                        {question.parentItems.map((sect, pathIndex) => {
                          return (
                            <li>
                              <a data-toggle="collapse" title="Click to expand section path" href={`#collapse-section-path-${pathIndex}`} onClick={()=>{
                                let csp = this.state.collapseSectionPath;
                                if (this.state.collapseSectionPath[pathIndex]) {
                                  csp[pathIndex] = false;
                                  this.setState({collapseSectionPath: csp});
                                } else {
                                  csp[pathIndex] = true;
                                  this.setState({collapseSectionPath: csp});
                                }
                              }}><i className={`fa ${this.state.collapseSectionPath[pathIndex] === true ? 'fa-minus' : 'fa-plus'}`} aria-hidden="true"></i> <text className='sr-only'>Click to expand section path</text></a>
                              <i className="fa fa-list-alt" aria-hidden="true"></i> <a href={`/#/sections/${sect.id}`}>{sect.name}</a>
                                {sect.surveys && sect.surveys.length > 0 && <ul className="no-bullet-list collapse" id={`collapse-section-path-${pathIndex}`}>
                                  {sect.surveys.map((surv) => {
                                    return(
                                      <li>
                                        {surv[0] && surv[0].type !== 'section' && <text><i className="fa fa-clipboard" aria-hidden="true"></i> <a href={`/#/surveys/${surv[0].id}`}>{surv[0].name}</a></text>}
                                        {surv[0] && surv[0].type === 'section' && <text><i className="fa fa-list-alt" aria-hidden="true"></i> <a href={`/#/sections/${surv[0].id}`}>{surv[0].name}</a></text>}
                                        <ul className="no-bullet-list">
                                        {surv.slice(1).map((pathItem, index) => {
                                          return(
                                            <li className='elbow-li' style={{ marginLeft: index + 'em' }}><i className="fa fa-list-alt" aria-hidden="true"></i> <a href={`/#/sections/${pathItem.id}`}>{pathItem.name}</a></li>
                                          );
                                        })}
                                        </ul>
                                      </li>
                                    );
                                  })}
                                </ul>}
                            </li>
                          );
                        })}
                      </ul>) : (
                        <p>Loading Parent Items or None found.</p>
                      )}
                    </div>
                  </div>
                </div>
              }
              {question.responseSets && question.responseSets.length > 0 &&
                <div className="basic-c-box panel-default">
                  <div className="panel-heading">
                    <h2 className="panel-title">
                      <a className="panel-toggle" data-toggle="collapse" href="#collapse-rs"><i className="fa fa-bars" aria-hidden="true"></i>
                      <text className="sr-only">Click link to expand information about linked </text>Author Recommended Response Sets: {question.responseSets && question.responseSets.length}</a>
                    </h2>
                  </div>
                  <div className="panel-collapse panel-details collapse" id="collapse-rs">
                    <div className="box-content panel-body">
                      <ResponseSetList responseSets={question.responseSets} />
                    </div>
                  </div>
                </div>
              }
              {question.linkedResponseSets && question.linkedResponseSets.length > 0 &&
                <div className="basic-c-box panel-default">
                  <div className="panel-heading">
                    <h2 className="panel-title">
                      <a className="panel-toggle" data-toggle="collapse" href="#collapse-lrs"><i className="fa fa-bars" aria-hidden="true"></i>
                      <text className="sr-only">Click link to expand information about </text>Response Sets Linked on Sections: {question.linkedResponseSets && question.linkedResponseSets.length}</a>
                    </h2>
                  </div>
                  <div className="panel-collapse panel-details collapse" id="collapse-lrs">
                    <div className="box-content panel-body">
                      <ResponseSetList responseSets={question.linkedResponseSets} />
                    </div>
                  </div>
                </div>
              }
              {question.status === 'published' &&
                <ProgramsAndSystems item={question} />
              }
            </div>
          </div>
        </div>
      </Col>
    );
  }

  historyBar(question) {
    return (
      <Col md={3} className="no-print">
        <h2 className="showpage_sidenav_subtitle">
          <text className="sr-only">Version History Navigation Links</text>
          <ul className="list-inline">
            <li className="subtitle_icon"><span className="fa fa-history" aria-hidden="true"></span></li>
            <li className="subtitle">History</li>
          </ul>
        </h2>
        <VersionInfo versionable={question} versionableType='Question' currentUser={this.props.currentUser} />
      </Col>
    );
  }
}

QuestionShow.propTypes = {
  question:  questionProps,
  currentUser:   currentUserProps,
  router: PropTypes.object,
  handlePublish:  PropTypes.func,
  retireQuestion: PropTypes.func,
  deleteQuestion: PropTypes.func,
  addBreadcrumbItem: PropTypes.func,
  addQuestionToGroup: PropTypes.func,
  removeQuestionFromGroup: PropTypes.func,
  addPreferred: PropTypes.func,
  removePreferred: PropTypes.func,
  fetchQuestion: PropTypes.func,
  updateQuestionTags: PropTypes.func,
  updateStageQuestion: PropTypes.func,
  setStats: PropTypes.func,
  stats: PropTypes.object,
  publishers: publishersProps,
  isLoading: PropTypes.bool,
  loadStatus : PropTypes.string,
  loadStatusText: PropTypes.string
};
