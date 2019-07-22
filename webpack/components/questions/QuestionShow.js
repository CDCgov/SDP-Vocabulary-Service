import React, { Component } from 'react';
import PropTypes from 'prop-types';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import { hashHistory, Link } from 'react-router';
import Linkify from 'react-linkify';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import Pagination from 'rc-pagination';

const PAGE_SIZE = 10;

import VersionInfo from "../VersionInfo";
import ResponseSetList from "../response_sets/ResponseSetList";
import CodedSetTable from "../CodedSetTable";
import TagModal from "../TagModal";
import ProgramsAndSystems from "../shared_show/ProgramsAndSystems";
import PublisherLookUp from "../shared_show/PublisherLookUp";
import ChangeHistoryTab from "../shared_show/ChangeHistoryTab";
import CurationHistoryTab from "../shared_show/CurationHistoryTab";
import GroupLookUp from "../shared_show/GroupLookUp";
import Breadcrumb from "../Breadcrumb";
import BasicAlert from '../../components/BasicAlert';
import LoadingSpinner from '../../components/LoadingSpinner';
import InfoModal from '../../components/InfoModal';
import InfoModalBodyContent from '../../components/InfoModalBodyContent';

import { questionProps } from "../../prop-types/question_props";
import currentUserProps from "../../prop-types/current_user_props";
import { publishersProps } from "../../prop-types/publisher_props";

import { isEditable, isRevisable, isPublishable, isRetirable, isExtendable, isGroupable, isSimpleEditable } from '../../utilities/componentHelpers';

import { gaSend } from '../../utilities/GoogleAnalytics';

export default class QuestionShow extends Component {
  constructor(props) {
    super(props);
    this.state = { tagModalOpen: false, page: 1, collapseSectionPath: [], qrsLink: null, selectedTab: 'main', showDeleteModal: false, showPublishModal: false, publishOrRetire: 'Publish' };
    this.nestedItemsForPage = this.nestedItemsForPage.bind(this);
    this.pageChange = this.pageChange.bind(this);
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

  pageChange(nextPage) {
    this.setState({page: nextPage});
  }

  nestedItemsForPage(responseSets) {
    const startIndex = (this.state.page - 1) * PAGE_SIZE;
    const endIndex = this.state.page * PAGE_SIZE;
    const itemPage = responseSets.slice(startIndex, endIndex);
    return itemPage;
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
            <p><strong>Delete All: </strong>This will delete the question and all other unused private draft response sets associated with it</p>
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
            <Modal.Title componentClass="h2"><i className="fa fa-exclamation-triangle simple-search-icon" aria-hidden="true"><text className="sr-only">Warning for</text></i> {this.state.publishOrRetire} Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.publishOrRetire === 'Publish' && <div><p>Are you sure you want to publish this question?</p><p>Publishing this item will change the visibility of this content to public, making it available to all authenticated and unauthenticated users.</p><p>This action cannot be undone.</p></div>}
            {this.state.publishOrRetire === 'Retire' && <div><p>Are you sure you want to retire this content?</p><p>The content stage can be changed later.</p></div>}
          </Modal.Body>
          <Modal.Footer>
            {this.state.publishOrRetire === 'Retire' && <Button onClick={() => {
              this.props.retireQuestion(this.props.question.id);
              gaSend('send', 'pageview', window.location.toString() + '/v' + this.props.question.version + '/Confirm Retire');
              this.setState({showPublishModal: false});
            }} bsStyle="primary">Confirm Retire</Button>}
            {this.state.publishOrRetire === 'Publish' && <Button onClick={() => {
              this.props.handlePublish(this.props.question);
              gaSend('send', 'pageview', window.location.toString() + '/v' + this.props.question.version + '/Confirm Publish');
              this.setState({showPublishModal: false});
            }} bsStyle="primary">Confirm Publish</Button>}
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
            {isSimpleEditable(question, this.props.currentUser) &&
              <PublisherLookUp publishers={this.props.publishers}
                             publishOrRetire={question.status === 'draft' ? 'publish' : 'retire'}
                             itemType="Question" />
            }
            {isGroupable(question, this.props.currentUser) &&
              <GroupLookUp item={question} addFunc={this.props.addQuestionToGroup} removeFunc={this.props.removeQuestionFromGroup} currentUser={this.props.currentUser} />
            }
            {isRevisable(question, this.props.currentUser) && this.props.currentUser && this.props.currentUser.author &&
              <Link className="btn btn-primary" to={`/questions/${this.props.question.id}/revise`}>Revise</Link>
            }
            {isEditable(question, this.props.currentUser) &&
              <Link className="btn btn-primary" to={`/questions/${this.props.question.id}/edit`}>Edit</Link>
            }
            {isExtendable(question, this.props.currentUser) && this.props.currentUser && this.props.currentUser.author &&
              <Link to={`/questions/${this.props.question.id}/extend`} className="btn btn-primary">Extend</Link>
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
                    gaSend('send', 'pageview', window.location.toString() + '/v' + question.version + '/Comment Only');
                  }}>Comment Only</a></li>
                  <li><a href='#' onClick={(e) => {
                    e.preventDefault();
                    this.props.updateStageQuestion(question.id, 'Trial Use');
                    gaSend('send', 'pageview', window.location.toString() + '/v' + question.version + '/Trial Use');
                  }}>Trial Use</a></li>
                  {question.status === 'draft' && <li><a href='#' onClick={(e) => {
                    e.preventDefault();
                    this.props.updateStageQuestion(question.id, 'Draft');
                    gaSend('send', 'pageview', window.location.toString() + '/v' + question.version + '/Draft');
                  }}>Draft</a></li>}
                  {question.status === 'published' && <li><a href='#' onClick={(e) => {
                    e.preventDefault();
                    this.props.updateStageQuestion(question.id, 'Published');
                    gaSend('send', 'pageview', window.location.toString() + '/v' + question.version + '/Published');
                  }}>Published</a></li>}
                </ul>
              </div>
            }
            {isPublishable(question, this.props.currentUser) &&
              <button className="btn btn-primary" onClick={(e) => {
                e.preventDefault();
                this.setState({showPublishModal: true, publishOrRetire: 'Publish'});
                gaSend('send', 'pageview', window.location.toString() + '/v' + question.version + '/Publish');
              }}>{this.publishModal()}Publish</button>
            }
            {isEditable(question, this.props.currentUser) && this.props.currentUser && this.props.currentUser.author &&
              <a className="btn btn-default" href="#" onClick={(e) => {
                e.preventDefault();
                this.setState({showDeleteModal: true});
                gaSend('send', 'pageview', window.location.toString() + '/v' + question.version + '/Delete');
                return false;
              }}>{this.deleteModal(question)}Delete</a>
            }
          </div>
        }
        <div className="maincontent-details">
          <Breadcrumb currentUser={this.props.currentUser} />
          <h1 className={`maincontent-item-name ${question.preferred ? 'cdc-preferred-note' : ''}`}><strong>Question Name:</strong> {question.content} {question.preferred && <text className="sr-only">This content is marked as preferred by the CDC</text>}</h1>
          <p className="maincontent-item-info">Version: {question.version} - Author: {question.createdBy && question.createdBy.email} </p>
          {question.status === 'published' &&
            <ProgramsAndSystems item={question} />
          }
          {question.sections && question.sections.length > 0 &&
            <div className="basic-c-box panel-default">
              <div className="panel-heading">
                <h2 className="panel-title">
                  <InfoModal show={this.state.showInfoParentItemsQuestion} header="Parent Items" body={<p>The parent items window shows how content is being reused across the service. It helps to answer “where is this question being used?”. The default view shows the names of the different Sections that the Question is being used on. The user can view the Surveys that each Question is used on by clicking “+”.</p>} hideInfo={()=>this.setState({showInfoParentItemsQuestion: false})} />
                  <a className="panel-toggle" data-toggle="collapse" href={`#collapse-linked-sections`}><i className="fa fa-bars" aria-hidden="true"></i>
                  <text className="sr-only">Click link to expand information about (Parent Items)</text>Parent Items</a>
                  <Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoParentItemsQuestion: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item (Parent Items InfoButton)</text></Button>
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
                          <i className="fa fa-window-maximize" aria-hidden="true"></i> <a href={`/#/sections/${sect.id}`}>{sect.name}</a>
                            {sect.surveys && sect.surveys.length > 0 && <ul className="no-bullet-list collapse" id={`collapse-section-path-${pathIndex}`}>
                              {sect.surveys.map((surv) => {
                                return(
                                  <li>
                                    {surv[0] && surv[0].type !== 'section' && <text><i className="fa fa-clipboard" aria-hidden="true"></i> <a href={`/#/surveys/${surv[0].id}`}>{surv[0].name}</a></text>}
                                    {surv[0] && surv[0].type === 'section' && <text><i className="fa fa-window-maximize" aria-hidden="true"></i> <a href={`/#/sections/${surv[0].id}`}>{surv[0].name}</a></text>}
                                    <ul className="no-bullet-list">
                                    {surv.slice(1).map((pathItem, index) => {
                                      return(
                                        <li className='elbow-li' style={{ marginLeft: index + 'em' }}><i className="fa fa-window-maximize" aria-hidden="true"></i> <a href={`/#/sections/${pathItem.id}`}>{pathItem.name}</a></li>
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
          <InfoModal show={this.state.showInfoCodeSystemMappings} header="Code System Mappings" body={<InfoModalBodyContent enum='codeMappingHelpModal'></InfoModalBodyContent>} hideInfo={()=>this.setState({showInfoCodeSystemMappings: false})} />
          <div className="basic-c-box panel-default">
            <div className="panel-heading">
              <h2 className="panel-title">
                Code System Mappings{<Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoCodeSystemMappings: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item (Code System Mappings)</text></Button>}
              </h2>
            </div>
            <div className="box-content">
              <div id="concepts-table">
                <CodedSetTable items={question.concepts} itemName={'Code System Mapping'} />
              </div>
            </div>
          </div>
          {this.props.breadcrumb && this.props.breadcrumb.length > 1 && question.linkedResponseSets && question.linkedResponseSets.length > 0 && (this.props.breadcrumb.find((item)=>item.type=='survey') || this.props.breadcrumb.find((item)=>item.type=='section')) &&
            <div className="basic-c-box panel-default">
              <div className="panel-heading">
                <h2 className="panel-title">
                  <a className="panel-toggle" data-toggle="collapse" href="#collapse-ers" onClick={() => {
                    let sid = this.props.breadcrumb.find((item)=>item.type=='survey') || this.props.breadcrumb.find((item)=>item.type=='section');
                    let sidType = this.props.breadcrumb.find((item)=>item.type=='survey') ? 'survey' : 'section';
                    this.props.fetchQrsLink(question.id, sid.id, sidType, (successResponse)=>this.setState({qrsLink: successResponse.data}));
                  }}><i className="fa fa-bars" aria-hidden="true"></i>
                  <text className="sr-only">Click link to expand information about </text>Responses expected for this question:</a>
                </h2>
              </div>
              <div className="panel-collapse panel-details collapse" id="collapse-ers">
                <div className="box-content panel-body">
                  {question.linkedResponseSets.find((rs)=>rs.id === this.state.qrsLink) ? (
                    <ResponseSetList responseSets={[question.linkedResponseSets.find((rs)=>rs.id === this.state.qrsLink)]} />
                  ) : (
                    <LoadingSpinner msg="Loading responses..." />
                  )}
                </div>
              </div>
            </div>
          }
          <InfoModal show={this.state.showInfoAuthorRecommendedResponseSets} header="Author Recommended Response Sets" body={<p>Response sets added to a Question by the author at the time of creation of the Question. This allows the author of the question to identify Response Sets that are appropriate for different contexts (e.g., For a Question asking about a vaccine administered, valid Response Sets may include condition-specific vaccine types, like varicella, influenza, or pertussis).  Users are encouraged to use these Response Sets if they meet their data collection needs.</p>} hideInfo={()=>this.setState({showInfoAuthorRecommendedResponseSets: false})} />
          {question.responseSets && question.responseSets.length > 0 &&
            <div className="basic-c-box panel-default">
              <div className="panel-heading">
                <h2 className="panel-title">
                  <a className="panel-toggle" data-toggle="collapse" href="#collapse-rs"><i className="fa fa-bars" aria-hidden="true"></i>
                  <text className="sr-only">Click link to expand information about linked </text>Author Recommended Response Sets</a>{<Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoAuthorRecommendedResponseSets: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item </text></Button>}: {question.responseSets && question.responseSets.length}
                </h2>
              </div>
              <div className="panel-collapse panel-details collapse" id="collapse-rs">
                <div className="box-content panel-body">
                  <ResponseSetList responseSets={this.nestedItemsForPage(question.responseSets)} />
                  {question.responseSets.length > 10 &&
                    <Pagination onChange={this.pageChange} current={this.state.page} total={question.responseSets.length} />
                  }
                </div>
              </div>
            </div>
          }
          <InfoModal show={this.state.showInfoResponseSetsLinkedOnSections} header="Response Sets Linked On Sections" body={<p>This displays a list of response sets paired with a Question that are not the “Author Recommended Response Sets”.<br /><br />SDP-V allows users the flexibility to pair a Question with different response sets based on their data collection needs.  If a user would like to reuse a Question, but the “author recommended response sets” do not meet the needs of that user, users can select other Response Sets from the repository to associate with the Question while creating, editing, or revising a Section. This allows SDP-V users to reuse Questions in the repository but provides the flexibility to select a context appropriate Response Set on a given Section. </p>} hideInfo={()=>this.setState({showInfoResponseSetsLinkedOnSections: false})} />
          {question.linkedResponseSets && question.linkedResponseSets.length > 0 &&
            <div className="basic-c-box panel-default">
              <div className="panel-heading">
                <h2 className="panel-title">
                  <a className="panel-toggle" data-toggle="collapse" href="#collapse-lrs"><i className="fa fa-bars" aria-hidden="true"></i>
                  <text className="sr-only">Click link to expand information about </text>Response Sets Linked on Sections</a>{<Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoResponseSetsLinkedOnSections: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item (Response Sets Linked on Sections)</text></Button>}: {question.linkedResponseSets && question.linkedResponseSets.length}
                </h2>
              </div>
              <div className="panel-collapse panel-details collapse" id="collapse-lrs">
                <div className="box-content panel-body">
                  <ResponseSetList responseSets={this.nestedItemsForPage(question.linkedResponseSets)} />
                  {question.linkedResponseSets.length > 10 &&
                    <Pagination onChange={this.pageChange} current={this.state.page} total={question.linkedResponseSets.length} />
                  }
                </div>
              </div>
            </div>
          }
          <ul className="nav nav-tabs" role="tablist">
            <li id="main-content-tab" className="nav-item active" role="tab" onClick={() => this.setState({selectedTab: 'main'})} aria-selected={this.state.selectedTab === 'main'} aria-controls="main">
              <a className="nav-link" data-toggle="tab" href="#main-content" role="tab">Information</a>
            </li>
            <li id="change-history-tab" className="nav-item" role="tab" onClick={() => this.setState({selectedTab: 'changes'})} aria-selected={this.state.selectedTab === 'changes'} aria-controls="changes">
              <a className="nav-link" data-toggle="tab" href="#change-history" role="tab">Change History</a>
            </li>
            <li id="curation-history-tab" className="nav-item" role="tab" onClick={() => this.setState({selectedTab: 'curation'})} aria-selected={this.state.selectedTab === 'curation'} aria-controls="curation">
              <a className="nav-link" data-toggle="tab" href="#curation-history" role="tab">Curation History</a>
            </li>
            <div className="action_bar no-print">
              <div className="btn-group">
            {isRetirable(question, this.props.currentUser) &&
              <button className="btn btn-primary" onClick={(e) => {
                e.preventDefault();
                this.setState({showPublishModal: true, publishOrRetire: 'Retire'});
                gaSend('send', 'pageview', window.location.toString() + '/v' + question.version + '/Retire');
              }}>{this.publishModal()}Retire</button>
            }
            {this.props.currentUser && this.props.currentUser.admin && !question.preferred &&
              <a className="btn btn-default" href="#" onClick={(e) => {
                e.preventDefault();
                this.props.addPreferred(question.id, 'Question', () => {
                  this.props.fetchQuestion(question.id);
                  gaSend('send', 'pageview', window.location.toString() + '/v' + question.version + '/CDC Pref/Checked');
                });
                return false;
              }}><i className="fa fa-square"></i> CDC Pref<text className="sr-only">Click to add CDC preferred attribute to this content</text></a>
            }
            {this.props.currentUser && this.props.currentUser.admin && question.preferred &&
              <a className="btn btn-default" href="#" onClick={(e) => {
                e.preventDefault();
                this.props.removePreferred(question.id, 'Question', () => {
                  this.props.fetchQuestion(question.id);
                  gaSend('send', 'pageview', window.location.toString() + '/v' + question.version + '/CDC Pref/UnChecked');
                });
                return false;
              }}><i className="fa fa-check-square"></i> CDC Pref<text className="sr-only">Click to remove CDC preferred attribute from this content</text></a>
            }
            </div>
            </div>
          </ul>
          <div className="tab-content">
          <div className={`tab-pane ${this.state.selectedTab === 'curation' && 'active'}`} id="curation" role="tabpanel" aria-hidden={this.state.selectedTab !== 'curation'} aria-labelledby="curation-history-tab">
            {isSimpleEditable(question, this.props.currentUser) ? (
              <CurationHistoryTab suggestedReplacementOf={question.suggestedReplacementOf} duplicateOf={question.duplicateOf} contentStage={question.contentStage} objSetName={'Question'} type='question'/>
            ) : (
              <div className='basic-c-box panel-default question-type'>
                <div className="panel-heading">
                  <h2 className="panel-title">Curation</h2>
                </div>
                <div className="box-content">
                  You do not have permissions to see curation history on this item (you must be the owner or in the proper collaborative authoring group).
                </div>
              </div>
            )}
          </div>
            <div className={`tab-pane ${this.state.selectedTab === 'changes' && 'active'}`} id="changes" role="tabpanel" aria-hidden={this.state.selectedTab !== 'changes'} aria-labelledby="change-history-tab">
              {isSimpleEditable(question, this.props.currentUser) ? (
                <ChangeHistoryTab versions={question.versions} type='question' majorVersion={question.version} />
              ) : (
                <div className='basic-c-box panel-default question-type'>
                  <div className="panel-heading">
                    <h2 className="panel-title">Changes</h2>
                  </div>
                  <div className="box-content">
                    You do not have permissions to see change history on this item (you must be the owner or in the proper collaborative authoring group).
                  </div>
                </div>
              )}
            </div>
            <div className={`tab-pane ${this.state.selectedTab === 'main' && 'active'}`} id="main" role="tabpanel" aria-hidden={this.state.selectedTab !== 'main'} aria-labelledby="main-content-tab">
              <div className="basic-c-box panel-default question-type">
                <div className="panel-heading">
                  <h2 className="panel-title">Details</h2>
                </div>
                <div className="container-fluid details-margin-padding">
                <div className="col-md-6 details-margin-padding">
                <div className="details-border">
                <InfoModal show={this.state.showVersionIndependentID} header="Version Indenpendent ID" body={<InfoModalBodyContent enum='versionIndependentID'></InfoModalBodyContent>} hideInfo={()=>this.setState({showVersionIndependentID: false})} />
                  <strong>Version Independent ID{<Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showVersionIndependentID: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item (Version Independent ID)</text></Button>}: </strong>{question.versionIndependentId}
                </div>
                <div className="details-border">
                  <strong>Description: </strong>
                  <Linkify properties={{target: '_blank'}}>{question.description}</Linkify>
                </div>
                <div className="details-border">
                  <strong>Created: </strong>
                  { format(parse(question.createdAt,''), 'MMMM Do, YYYY') }
                </div>
                <InfoModal show={this.state.showContentStage} header={question.contentStage} body={<InfoModalBodyContent enum='contentStage' contentStage={question.contentStage}></InfoModalBodyContent>} hideInfo={()=>this.setState({showContentStage: false})} />
                {question.contentStage && <div className="details-border">
                  <strong>Content Stage: </strong>
                  {question.contentStage}{<Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showContentStage: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item (Content Stage)</text></Button>}
                </div>}
                </div>
                <div className="col-md-6 details-margin-padding">
                { this.props.currentUser && question.status && question.status === 'published' &&
                <div className="details-border">
                  <InfoModal show={this.state.show} header='Public' body={<InfoModalBodyContent enum='visibility' visibility='public'></InfoModalBodyContent>} hideInfo={()=>this.setState({show: false})} />
                  <strong>Visibility: </strong>Public{<Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({show: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item (Public)</text></Button>}
                </div>
                }
                { this.props.currentUser && question.status && question.status === 'draft' &&
                <div className="details-border">
                  <InfoModal show={this.state.show} header='Private' body={<InfoModalBodyContent enum='visibility' visibility='private'></InfoModalBodyContent>} hideInfo={()=>this.setState({show: false})} />
                  <strong>Visibility: </strong>Private (authors and publishers only){<Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({show: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item (Private)</text></Button>}
                </div>
                }
                { question.parent &&
                  <div className="details-border">
                    <strong>Extended from: </strong>
                    <Link to={`/questions/${question.parent.id}`}>{ question.parent.name || question.parent.content }</Link>
                  </div>
                }
                { question.status === 'published' && question.publishedBy && question.publishedBy.email &&
                <div className="details-border">
                  <strong>Published By: </strong>
                  {question.publishedBy.email}
                </div>
                }
                {question.category && <div className="details-border">
                <InfoModal show={this.state.showInfoCategory} header="Category" body={<p>The category defines the type of Question. Questions are categorized by the author.<br /> <br />This attribute is optional but completion allows other users to find questions of interest. There is an advanced search filter that is based off of this attribute.</p>} hideInfo={()=>this.setState({showInfoCategory: false})} />
                  <strong>Category{<Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoCategory: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item (Category)</text></Button>}: </strong>
                  {question.category.name}
                </div>}
                {question.subcategory && <div className="details-border">
                  <strong>Subcategory: </strong>
                  {question.subcategory.name}
                </div>}
                {question.responseType && <div className="details-border">
                  <InfoModal show={this.state.showInfoResponseType} header="Response Type" body={<p>Response Type indicates what kind of response is expected for the Question. Common response types include choice, text, and date.  These response types are defined by HL7.</p>} hideInfo={()=>this.setState({showInfoResponseType: false})} />
                  <strong>Response Type{<Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoResponseType: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item (Response Type)</text></Button>}: </strong>
                  {question.responseType.name}
                </div>}
                {question.dataCollectionMethods && question.dataCollectionMethods.length > 0 && <div className="details-border">
                <InfoModal show={this.state.showInfoDataCollectionMethods} header="Data Collection Method" body={<p>The Data Collection Method attribute represents the manner in which the Question is used to collect data at the time of administration. This is not necessarily the same as how CDC is receiving the data.<br /><br />This attribute is optional but completion helps other users find questions in SDP-V most suited for a specific data collection method. There is an advanced search filter based off of this attribute.
</p>} hideInfo={()=>this.setState({showInfoDataCollectionMethods: false})} />
                  <strong>Data Collection Methods{<Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoDataCollectionMethods: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item (Data Collection Methods)</text></Button>}: </strong>
                  <ul>
                    {question.dataCollectionMethods.map((dcm, i) => {
                      return (<li key={i}>{dcm}</li>);
                    })}
                  </ul>
                </div>}
                {question.responseType && question.responseType.code === 'choice' && <div className="details-border">
                  <InfoModal show={this.state.showInfoOtherAllowed} header="Other Allowed" body={<p>This attribute indicates if the Question provides an “other” choice where a respondent can provide their own answer outside of the chosen Response Set.</p>} hideInfo={()=>this.setState({showInfoOtherAllowed: false})} />
                  <strong>Other Allowed{<Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoOtherAllowed: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item (Other Allowed)</text></Button>}: </strong>
                  {question.otherAllowed ? 'Yes' : 'No' }
                </div>}
                <InfoModal show={this.state.showInfoTags} header="Tags" body={<InfoModalBodyContent enum='tags'></InfoModalBodyContent>} hideInfo={()=>this.setState({showInfoTags: false})} />
                {
                  <div className="details-border">
                  <strong>Tags</strong>{<Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoTags: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item (Tags)</text></Button>}: {question.tagList && question.tagList.length > 0 ? (
                    <text>{question.tagList.join(', ')}</text>
                  ) : (
                    <text>No Tags Found</text>
                  )}
                  {isSimpleEditable(question, this.props.currentUser) &&
                    <a href='#' onClick={(e) => {
                      e.preventDefault();
                      this.setState({ tagModalOpen: true });
                    }}>&nbsp;&nbsp;<i className="fa fa-pencil" aria-hidden="true"></i>
                      <TagModal show={this.state.tagModalOpen || false}
                                cancelButtonAction={() => this.setState({ tagModalOpen: false })}
                                tagList={question.tagList}
                                saveButtonAction={(tagList) => {
                                  this.props.updateQuestionTags(question.id, tagList);
                                  this.setState({ tagModalOpen: false });
                                }} />
                    </a>
                  }
                  </div>
                }
              </div>
              </div>
              </div>
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
  currentUser: currentUserProps,
  router: PropTypes.object,
  handlePublish:  PropTypes.func,
  retireQuestion: PropTypes.func,
  deleteQuestion: PropTypes.func,
  addBreadcrumbItem: PropTypes.func,
  breadcrumb: PropTypes.array,
  fetchQrsLink: PropTypes.func,
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
