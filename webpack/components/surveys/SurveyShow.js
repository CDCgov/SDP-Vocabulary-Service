import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { hashHistory, Link } from 'react-router';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import Linkify from 'react-linkify';
import Pagination from 'rc-pagination';

const PAGE_SIZE = 10;

import VersionInfo from '../VersionInfo';
import PublisherLookUp from "../shared_show/PublisherLookUp";
import GroupLookUp from "../shared_show/GroupLookUp";
import ChangeHistoryTab from "../shared_show/ChangeHistoryTab";
import CodedSetTable from "../CodedSetTable";
import Breadcrumb from "../Breadcrumb";
import TagModal from "../TagModal";
import LoadingSpinner from '../../components/LoadingSpinner';
import BasicAlert from '../../components/BasicAlert';

import SectionList from "../sections/SectionList";

import { surveyProps } from '../../prop-types/survey_props';
import { sectionProps } from '../../prop-types/section_props';
import currentUserProps from '../../prop-types/current_user_props';
import { publishersProps } from "../../prop-types/publisher_props";

import { isEditable, isRevisable, isPublishable, isRetirable, isExtendable, isGroupable, isSimpleEditable } from '../../utilities/componentHelpers';

import { gaSend } from '../../utilities/GoogleAnalytics';
import InfoModal from '../../components/InfoModal';
import InfoModalBodyContent from '../../components/InfoModalBodyContent';

class SurveyShow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tagModalOpen: false, page: 1, selectedTab: 'main', showDeleteModal: false,
      showPublishModal: false, publishOrRetire: 'Publish', showEpiInfoModal: false,
      orgKey: '', error: {}, success: {}, warning: {}, isCreating: false
    };
    this.nestedItemsForPage = this.nestedItemsForPage.bind(this);
    this.pageChange = this.pageChange.bind(this);
  }

  componentDidMount() {
    this.props.setBreadcrumbPath([{type:'survey',id:this.props.survey.id,name:this.props.survey.name}]);
  }

  historyBar() {
    return (
      <Col md={3} className="no-print">
        <h2 className="showpage_sidenav_subtitle">
          <text className="sr-only">Version History Navigation Links</text>
          <ul className="list-inline">
            <li className="subtitle_icon"><span className="fa fa-history" aria-hidden="true"></span></li>
            <li className="subtitle">History</li>
          </ul>
        </h2>
        <VersionInfo versionable={this.props.survey} versionableType='survey' currentUser={this.props.currentUser} />
      </Col>
    );
  }

  pageChange(nextPage) {
    this.setState({page: nextPage});
  }

  nestedItemsForPage(sections) {
    const startIndex = (this.state.page - 1) * PAGE_SIZE;
    const endIndex = this.state.page * PAGE_SIZE;
    const itemPage = sections.slice(startIndex, endIndex);
    return itemPage;
  }

  deleteModal() {
    return(
      <div className="static-modal">
        <Modal animation={false} show={this.state.showDeleteModal} onHide={()=>this.setState({showDeleteModal: false})} role="dialog" aria-label="Delete Confirmation Modal">
          <Modal.Header>
            <Modal.Title componentClass="h2"><i className="fa fa-exclamation-triangle simple-search-icon" aria-hidden="true"><text className="sr-only">Warning for</text></i> Delete Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this survey? This action cannot be undone.</p>
            <p><strong>Delete Survey: </strong>This will delete the survey but not any of the other items created or associated with it</p>
            <p><strong>Delete All: </strong>This will delete the survey and all other unused private draft sections, questions, and response sets associated with it</p>
          </Modal.Body>
          <br/>
          <br/>
          <Modal.Footer>
            <Button onClick={() => this.props.deleteSurvey(this.props.survey.id, false, (response) => {
              if (response.status == 200) {
                let stats = Object.assign({}, this.props.stats);
                stats.surveyCount = this.props.stats.surveyCount - 1;
                stats.mySurveyCount = this.props.stats.mySurveyCount - 1;
                this.props.setStats(stats);
                this.props.router.push('/');
              }
            })} bsStyle="primary">Delete Survey</Button>
            <Button onClick={() => this.props.deleteSurvey(this.props.survey.id, true, (response) => {
              if (response.status == 200) {
                let stats = Object.assign({}, this.props.stats);
                stats.surveyCount = this.props.stats.surveyCount - 1;
                stats.mySurveyCount = this.props.stats.mySurveyCount - 1;
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
        <Modal animation={false} show={this.state.showPublishModal} onHide={()=>this.setState({showPublishModal: false})} role="dialog" aria-label="Delete Confirmation Modal">
          <Modal.Header>
            <Modal.Title componentClass="h2"><i className="fa fa-exclamation-triangle simple-search-icon" aria-hidden="true"><text className="sr-only">Warning for</text></i> {this.state.publishOrRetire} Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.publishOrRetire === 'Publish' && <div><p>Are you sure you want to publish this survey and all of its contents?</p><p>Publishing this item will change the visibility of this content to public, making it available to all authenticated and unauthenticated users.</p><p>This action cannot be undone.</p></div>}
            {this.state.publishOrRetire === 'Retire' && <div><p>Are you sure you want to retire this content?</p><p>The content stage can be changed later.</p></div>}
          </Modal.Body>
          <Modal.Footer>
            {this.state.publishOrRetire === 'Retire' && <Button onClick={() => {
              this.props.retireSurvey(this.props.survey.id);
              gaSend('send', 'pageview', window.location.toString() + '/v' + this.props.survey.version + '/Confirm Retire');
              this.setState({showPublishModal: false});
            }} bsStyle="primary">Confirm Retire</Button>}
            {this.state.publishOrRetire === 'Publish' && <Button onClick={() => {
              this.props.publishSurvey(this.props.survey.id);
              gaSend('send', 'pageview', window.location.toString() + '/v' + this.props.survey.version + '/Confirm Publish');
              this.setState({showPublishModal: false});
            }} bsStyle="primary">Confirm Publish</Button>}
              <Button onClick={() => this.setState({showPublishModal: false})} bsStyle="default">Cancel</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  epiInfoModal() {
    return(
      <div className="static-modal">
        <Modal animation={false} show={this.state.showEpiInfoModal} onHide={()=>this.setState({showEpiInfoModal: false})} role="dialog" aria-label="Epi Info Modal">
          <Modal.Header>
            <Modal.Title componentClass="h2"><i className="fa fa-internet-explorer" aria-hidden="true"><text className="sr-only">Input for</text></i> Epi Info Web Survey (BETA)</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.error && this.state.error.msg &&
              <div className="alert alert-danger">
                {this.state.error.msg}
              </div>
            }
            {this.state.success && this.state.success.msg && this.state.success.url &&
              <div className="alert alert-success">
                {this.state.success.msg}<br/>
                <a href={this.state.success.url}>{this.state.success.url}</a><br/>
                <p>Publish Key: {this.state.success.pubkey}</p>
              </div>
            }
            <p>To create a web survey in Epi Info with a shareable link, enter your Organization Key:</p>
            <input  className="input-format" type='text' placeholder='ex. 00000000-0000-5555-9999-ex4mpl312345' value={this.state.orgKey} onChange={(e) => this.setState({orgKey: e.target.value})} />
            <hr/><p>If you do not have an account with Epi Info for your organization, <a href='http://www.cstesurvey.org/EpiInfoWebSurvey/Account'>click here to register your organization</a> and return once you have received an organization key.</p>
            <p>If you want to download the XML template to use the Epi Info desktop client, <a href={`/surveys/${this.props.survey.id}/epi_info`}>click here.</a></p>
            <p><strong>Note:</strong> Once published the survey will need to be edited in the Epi Info desktop client. In the future when publishing an editing package will download. For now, save the publisher key returned on success and enter it into the web survey import form in the Epi Info desktop client. If you are not familiar with this process and want to add skip logic or make formatting edits before publishing this survey please <a href={`/surveys/${this.props.survey.id}/epi_info`}>download the XML Template</a> and import into the desktop client to edit before publishing. For more instructions see the "View and Export Content", then "Epi Info" section in <a href='/#/help'>the help documentation.</a></p>
            {this.state.isCreating && <div><hr/><p><LoadingSpinner msg="Attempting to create Web Survey..." /></p></div>}
          </Modal.Body>
          <Modal.Footer>
            <Button className={this.state.isCreating ? 'disabled' : ''} onClick={() => {
              this.setState({isCreating: true});
              this.props.publishWebSurvey(this.props.survey.id, this.state.orgKey, (successResponse) => {
                this.setState({isCreating: false, success: successResponse.data, warning: {}, error: {}});
              }, (failureResponse) => {
                if (failureResponse.response.data && failureResponse.response.data.msg) {
                  this.setState({isCreating: false, error: failureResponse.response.data });
                } else {
                  this.setState({isCreating: false, error: {msg: 'An Error has occured while publishing your survey.'}});
                }
              });
            }} bsStyle="primary">Create Web Survey (BETA)</Button>
            <Button onClick={()=>this.setState({showEpiInfoModal: false})} bsStyle="default">Cancel</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  mainContent() {
    return (
      <Col md={9} className="maincontent">
        <div className="action_bar no-print">
          {isSimpleEditable(this.props.survey, this.props.currentUser) &&
            <PublisherLookUp publishers={this.props.publishers}
                           publishOrRetire={this.props.survey.status === 'draft' ? 'publish' : 'retire'}
                           itemType="Survey" />
          }
          <div className="btn-group">
            <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span className="fa fa-arrow-circle-down"></span> Export <span className="caret"></span>
            </button>
            <ul className="dropdown-menu">
              <li key="header" className="dropdown-header">Export format:</li>
              <li><a href='#' onClick={(e) => {
                e.preventDefault();
                this.setState({showEpiInfoModal: true});
              }}>Epi Info (Web Survey)</a>{this.epiInfoModal()}</li>
              <li><a href={`/surveys/${this.props.survey.id}/epi_info`} onClick={() => gaSend('send', 'pageview', window.location.toString() + '/v' + this.props.survey.version + '/Export to Epi Info (XML)')}>Epi Info (XML)</a></li>
              <li><a href={`/surveys/${this.props.survey.id}/redcap`} onClick={() => gaSend('send', 'pageview', window.location.toString() + '/v' + this.props.survey.version + '/Export to REDCap (XML)')}>REDCap (XML)</a></li>
              <li><a href={`/surveys/${this.props.survey.id}/spreadsheet`} onClick={() => gaSend('send', 'pageview', window.location.toString() + '/v' + this.props.survey.version + '/Export to Spreadsheet (XLSX)')}>Spreadsheet (XLSX)</a></li>
              <li><a href='#' onClick={(e) => {
                e.preventDefault();
                window.print();
                gaSend('send', 'pageview', window.location.toString() + '/v' + this.props.survey.version + '/Window Print');
              }}>Print</a></li>
            </ul>
          </div>
          {isGroupable(this.props.survey, this.props.currentUser) &&
            <GroupLookUp item={this.props.survey} addFunc={this.props.addSurveyToGroup} removeFunc={this.props.removeSurveyFromGroup} currentUser={this.props.currentUser} />
          }
          {isSimpleEditable(this.props.survey, this.props.currentUser) &&
            <div className="btn-group">
              <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span className="fa fa-sitemap"></span> Stage <span className="caret"></span>
              </button>
              <ul className="dropdown-menu">
                <li key="header" className="dropdown-header">Update Content Stage:</li>
                <li><a href='#' onClick={(e) => {
                  e.preventDefault();
                  this.props.updateStageSurvey(this.props.survey.id, 'Comment Only');
                  gaSend('send', 'pageview', window.location.toString() + '/v' + this.props.survey.version + '/Comment Only');
                }}>Comment Only</a></li>
                <li><a href='#' onClick={(e) => {
                  e.preventDefault();
                  this.props.updateStageSurvey(this.props.survey.id, 'Trial Use');
                  gaSend('send', 'pageview', window.location.toString() + '/v' + this.props.survey.version + '/Trial Use');
                }}>Trial Use</a></li>
                {this.props.survey.status === 'draft' && <li><a href='#' onClick={(e) => {
                  e.preventDefault();
                  this.props.updateStageSurvey(this.props.survey.id, 'Draft');
                  gaSend('send', 'pageview', window.location.toString() + '/v' + this.props.survey.version + '/Draft');
                }}>Draft</a></li>}
                {this.props.survey.status === 'published' && <li><a href='#' onClick={(e) => {
                  e.preventDefault();
                  this.props.updateStageSurvey(this.props.survey.id, 'Published');
                  gaSend('send', 'pageview', window.location.toString() + '/v' + this.props.survey.version + '/Published');
                }}>Published</a></li>}
              </ul>
            </div>
          }
          {isRetirable(this.props.survey, this.props.currentUser) &&
            <a className="btn btn-default" href="#" onClick={(e) => {
              e.preventDefault();
              this.setState({showPublishModal: true, publishOrRetire: 'Retire'});
              gaSend('send', 'pageview', window.location.toString() + '/v' + this.props.survey.version + '/Retire');
              return false;
            }}>{this.publishModal()}Retire</a>
          }
          {isPublishable(this.props.survey, this.props.currentUser) &&
            <a className="btn btn-default" href="#" onClick={(e) => {
              e.preventDefault();
              this.setState({showPublishModal: true, publishOrRetire: 'Publish'});
              gaSend('send', 'pageview', window.location.toString() + '/v' + this.props.survey.version + '/Publish');
              return false;
            }}>{this.publishModal()}Publish</a>
          }
          {this.props.currentUser && this.props.currentUser.admin && !this.props.survey.preferred &&
            <a className="btn btn-default" href="#" onClick={(e) => {
              e.preventDefault();
              this.props.addPreferred(this.props.survey.id, 'Survey', () => {
                this.props.fetchSurvey(this.props.survey.id);
                gaSend('send', 'pageview', window.location.toString() + '/v' + this.props.survey.version + '/CDC Pref/Checked');
              });
              return false;
            }}><i className="fa fa-square"></i> CDC Pref<text className="sr-only">Click to add CDC preferred attribute to this content</text></a>
          }
          {this.props.currentUser && this.props.currentUser.admin && this.props.survey.preferred &&
            <a className="btn btn-default" href="#" onClick={(e) => {
              e.preventDefault();
              this.props.removePreferred(this.props.survey.id, 'Survey', () => {
                this.props.fetchSurvey(this.props.survey.id);
                gaSend('send', 'pageview', window.location.toString() + '/v' + this.props.survey.version + '/CDC Pref/UnChecked');
              });
              return false;
            }}><i className="fa fa-check-square"></i> CDC Pref<text className="sr-only">Click to remove CDC preferred attribute from this content</text></a>
          }
          {isRevisable(this.props.survey, this.props.currentUser) && this.props.currentUser && this.props.currentUser.author &&
              <Link className="btn btn-default" to={`surveys/${this.props.survey.id}/revise`}>Revise</Link>
          }
          {isEditable(this.props.survey, this.props.currentUser) &&
              <Link className="btn btn-default" to={`surveys/${this.props.survey.id}/edit`}>Edit</Link>
          }
          {isEditable(this.props.survey, this.props.currentUser) && this.props.currentUser && this.props.currentUser.author &&
            <a className="btn btn-default" href="#" onClick={(e) => {
              e.preventDefault();
              this.setState({showDeleteModal: true});
              return false;
            }}>{this.deleteModal()}Delete</a>
          }
          {isExtendable(this.props.survey, this.props.currentUser) && this.props.currentUser && this.props.currentUser.author &&
            <Link className="btn btn-default" to={`/surveys/${this.props.survey.id}/extend`}>Extend</Link>
          }
          {((this.props.currentUser && this.props.currentUser.admin) || isPublishable(this.props.survey, this.props.currentUser) || isEditable(this.props.survey, this.props.currentUser) || (isRevisable(this.props.survey, this.props.currentUser))) && this.props.dupeCount > 0 &&
              <Link className="btn btn-default" to={`surveys/${this.props.survey.id}/dedupe`} onClick={() => gaSend('send', 'pageview', window.location.toString() + '/v' + this.props.survey.version + '/Curate')}>Curate ({this.props.dupeCount})</Link>
          }
        </div>
        <InfoModal show={this.state.showInfoVersion} header="Version" body={<InfoModalBodyContent enum='version'></InfoModalBodyContent>} hideInfo={()=>this.setState({showInfoVersion: false})} />
        <InfoModal show={this.state.showInfoTags} header="Tags" body={<InfoModalBodyContent enum='tags'></InfoModalBodyContent>} hideInfo={()=>this.setState({showInfoTags: false})} />
        <InfoModal show={this.state.showInfoSurveillanceProgram} header="Surveillance Program" body={<p>The surveillance program that will maintain and use this vocabulary to support their public health activities.</p>} hideInfo={()=>this.setState({showInfoSurveillanceProgram: false})} />
        <InfoModal show={this.state.showInfoSurveillanceSystem} header="Surveillance System" body={<p>The surveillance system that will use this vocabulary to support public health activities.</p>} hideInfo={()=>this.setState({showInfoSurveillanceSystem: false})} />
        <div className="maincontent-details">
          <Breadcrumb currentUser={this.props.currentUser} />
          <h1 className={`maincontent-item-name ${this.props.survey.preferred ? 'cdc-preferred-note' : ''}`}><strong>Survey Name:</strong> {this.props.survey.name} {this.props.survey.preferred && <text className="sr-only">This content is marked as preferred by the CDC</text>}</h1>
          <p className="maincontent-item-info">Version{<Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoVersion: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item (Version)</text></Button>}: {this.props.survey.version} - Author: {this.props.survey.userId} </p>
          {this.surveillanceProgram()}
          {this.surveillanceSystem()}
          <p className="maincontent-item-info">Tags{<Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoTags: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item (Tags)</text></Button>}: {this.props.survey.tagList && this.props.survey.tagList.length > 0 ? (
            <text>{this.props.survey.tagList.join(', ')}</text>
          ) : (
            <text>No Tags Found</text>
          )}
          {isSimpleEditable(this.props.survey, this.props.currentUser) &&
            <a className='pull-right' href='#' onClick={(e) => {
              e.preventDefault();
              this.setState({ tagModalOpen: true });
            }}>Update Tags <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
              <TagModal show={this.state.tagModalOpen || false}
                        cancelButtonAction={() => this.setState({ tagModalOpen: false })}
                        tagList={this.props.survey.tagList}
                        saveButtonAction={(tagList) => {
                          this.props.updateSurveyTags(this.props.survey.id, tagList);
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
              {isSimpleEditable(this.props.survey, this.props.currentUser) ? (
                <ChangeHistoryTab versions={this.props.survey.versions} type='survey' majorVersion={this.props.survey.version} />
              ) : (
                <div className='basic-c-box panel-default survey-type'>
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
              <div className="basic-c-box panel-default survey-type">
                <div className="panel-heading">
                  <h2 className="panel-title">Description</h2>
                </div>
                <div className="box-content">
                  <Linkify properties={{target: '_blank'}}>{this.props.survey.description}</Linkify>
                </div>
                <InfoModal show={this.state.showInfoOMBControlNumber} header="OMB Control Number" body={<p>Provides the OMB Control Number associated with the data collection instrument (if applicable).<br /> <br />This attribute is optional but completion allows other users to find vocabulary that has been used on an OMB-approved data collection instrument. Reuse of vocabulary that has been part of one or more OMB approved Paperwork Reduction Act (PRA) packages in the past can help expedite the review process. There is an advanced search filter that is based off of this attribute.</p>} hideInfo={()=>this.setState({showInfoOMBControlNumber: false})} />
                { this.props.survey.controlNumber &&
                <div className="box-content">
                  <strong>OMB Control Number{<Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoOMBControlNumber: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item (Content Stage)</text></Button>}: </strong>
                  {this.props.survey.controlNumber}
                  {this.props.survey.ombApprovalDate && <text className='pull-right'><strong>OMB Approval Date: </strong>{this.props.survey.ombApprovalDate}</text>}
                </div>
                }
                <div className="box-content">
                <InfoModal show={this.state.showVersionIndependentID} header="Version Indenpendent ID" body={<InfoModalBodyContent enum='versionIndependentID'></InfoModalBodyContent>} hideInfo={()=>this.setState({showVersionIndependentID: false})} />
                  <strong>Version Independent ID{<Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showVersionIndependentID: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item (Version Independent ID)</text></Button>}: </strong>{this.props.survey.versionIndependentId}
                </div>
                { this.props.survey.status === 'published' && this.props.survey.publishedBy && this.props.survey.publishedBy.email &&
                <div className="box-content">
                  <strong>Published By: </strong>
                  {this.props.survey.publishedBy.email}
                </div>
                }
                <InfoModal show={this.state.showInfoContentStage} header={this.props.survey.contentStage} body={<InfoModalBodyContent enum='contentStage' contentStage={this.props.survey.contentStage}></InfoModalBodyContent>} hideInfo={()=>this.setState({showInfoContentStage: false})} />
                { this.props.survey.contentStage &&
                <div className="box-content">
                  <strong>Content Stage: </strong>
                  {this.props.survey.contentStage}{<Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoContentStage: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item (Content Stage)</text></Button>}
                </div>
                }
                { this.props.currentUser && this.props.survey.status && this.props.survey.status === 'published' &&
                <div className="box-content">
                <InfoModal show={this.state.show} header="Public" body={<InfoModalBodyContent enum='visibility' visibility='public'></InfoModalBodyContent>} hideInfo={()=>this.setState({show: false})} />
                  <strong>Visibility: </strong>Public{<Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({show: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item (Public)</text></Button>}
                </div>
                }
                { this.props.currentUser && this.props.survey.status && this.props.survey.status === 'draft' &&
                <div className="box-content">
                <InfoModal show={this.state.show} header="Private" body={<InfoModalBodyContent enum='visibility' visibility='private'></InfoModalBodyContent>} hideInfo={()=>this.setState({show: false})} />
                  <strong>Visibility: </strong>Private (authors and publishers only){<Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({show: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item (Private)</text></Button>}
                </div>
                }
                { this.props.survey.parent &&
                <div className="box-content">
                  <strong>Extended from: </strong>
                  <Link to={`/surveys/${this.props.survey.parent.id}`}>{ this.props.survey.parent.name }</Link>
                </div>
                }
              </div>
              <InfoModal show={this.state.showInfoCodeSystemMappings} header="Code System Mappings" body={<InfoModalBodyContent enum='codeSystemMappings'></InfoModalBodyContent>} hideInfo={()=>this.setState({showInfoCodeSystemMappings: false})} />
              <div className="basic-c-box panel-default">
                <div className="panel-heading">
                  <h2 className="panel-title">
                    Code System Mappings{<Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoCodeSystemMappings: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item (Code System Mappings)</text></Button>}
                  </h2>
                </div>
                <div className="box-content">
                  <div id="concepts-table">
                    <CodedSetTable items={this.props.survey.concepts} itemName={'Code System Mapping'} />
                  </div>
                </div>
              </div>
              <InfoModal show={this.state.showInfoLinkedSections} header="Linked Sections" body={<p>Displays the selected sections (grouping of questions) for this Survey.</p>} hideInfo={()=>this.setState({showInfoLinkedSections: false})} />
              <div className="basic-c-box panel-default">
                <div className="panel-heading">
                  <h2 className="panel-title">
                    <a className="panel-toggle" data-toggle="collapse" href={`#collapse-linked-surveys`}><i className="fa fa-bars" aria-hidden="true"></i>
                    <text className="sr-only">Click link to expand information about linked </text>Linked Sections</a>{<Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoLinkedSections: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item (Linked Sections)</text></Button>}: {this.props.sections && this.props.sections.length}
                  </h2>
                </div>
                <div className="panel-collapse panel-details collapse" id="collapse-linked-surveys">
                  <div className="box-content panel-body">
                    <SectionList sections={this.nestedItemsForPage(this.props.sections)} currentUser={this.props.currentUser} />
                    {this.props.sections.length > 10 &&
                      <Pagination onChange={this.pageChange} current={this.state.page} total={this.props.sections.length} />
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

  surveillanceSystem() {
    if (this.props.survey.surveillanceSystem) {
      return <p className="maincontent-item-info">Surveillance System{<Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoSurveillanceSystem: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item (Surveillance System)</text></Button>}: {this.props.survey.surveillanceSystem.name}</p>;
    } else {
      return "";
    }
  }

  surveillanceProgram() {
    if (this.props.survey.surveillanceProgram) {
      return <p className="maincontent-item-info">Surveillance Program{<Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoSurveillanceProgram: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item (Surveillance Program)</text></Button>}: {this.props.survey.surveillanceProgram.name}</p>;
    } else {
      return "";
    }
  }

  render() {
    let {survey, sections} = this.props;
    if(!survey || !sections){
      return (
      <div>
        <div>
          <div className="showpage_header_container no-print">
            <ul className="list-inline">
              <li className="showpage_button"><span className="fa fa-arrow-left fa-2x" aria-hidden="true" onClick={hashHistory.goBack}></span></li>
              <li className="showpage_title"><h1>Survey Details</h1></li>
            </ul>
          </div>
        </div>
        <Row>
          <Col xs={12}>
              <div className="main-content">
                {this.props.isLoading && <LoadingSpinner msg="Loading survey..." />}
                {this.props.loadStatus == 'failure' &&
                  <BasicAlert msg={this.props.loadStatusText} severity='danger' />
                }
                {this.props.loadStatus == 'success' && survey === undefined &&
                 <BasicAlert msg="Sorry, there is a problem loading this survey." severity='warning' />
                }
              </div>
          </Col>
        </Row>
      </div>
      );
    }
    return (
      <div>
        <div id={"survey_id_"+survey.id}>
          <div className="showpage_header_container no-print">
            <ul className="list-inline">
              <li className="showpage_button"><span className="fa fa-arrow-left fa-2x" aria-hidden="true" onClick={hashHistory.goBack}></span></li>
              <li className="showpage_title"><h1>Survey Details {survey.contentStage && (<text>[{survey.contentStage.toUpperCase()}]</text>)}</h1></li>
            </ul>
          </div>
        </div>
        <Row className="no-inside-gutter">
          {this.historyBar()}
          {this.mainContent()}
        </Row>
      </div>
    );
  }
}

SurveyShow.propTypes = {
  survey: surveyProps,
  sections:  PropTypes.arrayOf(sectionProps),
  router: PropTypes.object,
  currentUser: currentUserProps,
  publishSurvey: PropTypes.func,
  publishWebSurvey: PropTypes.func,
  retireSurvey: PropTypes.func,
  deleteSurvey:  PropTypes.func,
  addPreferred: PropTypes.func,
  removePreferred: PropTypes.func,
  updateStageSurvey: PropTypes.func,
  setBreadcrumbPath: PropTypes.func,
  fetchSurvey: PropTypes.func,
  dupeCount: PropTypes.number,
  setStats: PropTypes.func,
  addSurveyToGroup: PropTypes.func,
  removeSurveyFromGroup: PropTypes.func,
  updateSurveyTags: PropTypes.func,
  stats: PropTypes.object,
  isLoading: PropTypes.bool,
  loadStatus : PropTypes.string,
  loadStatusText : PropTypes.string,
  publishers: publishersProps
};

export default SurveyShow;
