import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { hashHistory, Link } from 'react-router';
import Linkify from 'react-linkify';
import Pagination from 'rc-pagination';
import $ from 'jquery';
import { Modal, Button, Row, Col } from 'react-bootstrap';

import SectionNestedItemList from '../../containers/sections/SectionNestedItemList';
import CodedSetTable from "../CodedSetTable";
import VersionInfo from '../VersionInfo';
import PublisherLookUp from "../shared_show/PublisherLookUp";
import GroupLookUp from "../shared_show/GroupLookUp";
import ChangeHistoryTab from "../shared_show/ChangeHistoryTab";
import LoadingSpinner from '../../components/LoadingSpinner';
import BasicAlert from '../../components/BasicAlert';

import Breadcrumb from "../Breadcrumb";
import TagModal from "../TagModal";
import { sectionProps } from '../../prop-types/section_props';
import currentUserProps from '../../prop-types/current_user_props';
import { publishersProps } from "../../prop-types/publisher_props";
import { isEditable, isRevisable, isPublishable, isRetirable, isExtendable, isGroupable, isSimpleEditable } from '../../utilities/componentHelpers';
import ResultStyleControl from '../shared_show/ResultStyleControl';

import { gaSend } from '../../utilities/GoogleAnalytics';

const PAGE_SIZE = 10;

class SectionShow extends Component {
  constructor(props) {
    super(props);
    this.state = { page: 1, tagModalOpen: false, selectedTab: 'main', showDeleteModal: false, showPublishModal: false, publishOrRetire: 'Publish' };
    this.nestedItemsForPage = this.nestedItemsForPage.bind(this);
    this.pageChange = this.pageChange.bind(this);
  }

  componentDidMount() {
    this.props.addBreadcrumbItem({type:'section',id:this.props.section.id,name:this.props.section.name});
  }

  render() {
    const {section} = this.props;
    if(!section || this.props.loadStatus == 'failure'){
      return (
          <div>
            <div>
              <div className="showpage_header_container no-print">
                <ul className="list-inline">
                  <li className="showpage_button"><span className="fa fa-arrow-left fa-2x" aria-hidden="true" onClick={hashHistory.goBack}></span></li>
                  <li className="showpage_title"><h1>Section Details</h1></li>
                </ul>
              </div>
            </div>
            <Row>
              <Col xs={12}>
                  <div className="main-content">
                    {this.props.isLoading && <LoadingSpinner msg="Loading section..." />}
                    {this.props.loadStatus == 'failure' &&
                      <BasicAlert msg={this.props.loadStatusText} severity='danger' />
                    }
                    {this.props.loadStatus == 'success' &&
                     <BasicAlert msg="Sorry, there is a problem loading this section." severity='warning' />
                    }
                  </div>
              </Col>
            </Row>
          </div>
      );
    }
    return (
      <div>
        <Row>
          <Col sm={12}>
            <div id={"section_id_"+section.id}>
              <div className="showpage_header_container no-print">
                <ul className="list-inline">
                  <li className="showpage_button"><span className="fa fa-arrow-left fa-2x" aria-hidden="true" onClick={hashHistory.goBack}></span></li>
                  <li className="showpage_title"><h1>Section Details {section.contentStage && (<text>[{section.contentStage.toUpperCase()}]</text>)}</h1></li>
                </ul>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="no-inside-gutter">
          {this.historyBar(section)}
          {this.mainContent(section)}
        </Row>
      </div>
    );
  }

  historyBar(section){
    return (
      <Col md={3} className="no-print">
        <h2 className="showpage_sidenav_subtitle">
          <text className="sr-only">Version History Navigation Links</text>
          <ul className="list-inline">
            <li className="subtitle_icon"><span className="fa fa-history" aria-hidden="true"></span></li>
            <li className="subtitle">History</li>
          </ul>
        </h2>
        <VersionInfo versionable={section} versionableType='section' currentUser={this.props.currentUser} />
      </Col>
    );
  }

  toggleExpand() {
    $('#collapse-linked-questions').collapse('toggle');
    this.props.toggleResultControl(this.props.resultControlVisibility);
  }

  pageChange(nextPage) {
    this.setState({page: nextPage});
  }

  nestedItemsForPage(section) {
    const startIndex = (this.state.page - 1) * PAGE_SIZE;
    const endIndex = this.state.page * PAGE_SIZE;
    const sectionNestedItemPage = section.sectionNestedItems.slice(startIndex, endIndex);
    return sectionNestedItemPage.map((sni) => {
      var sectionNestedItem = {};
      if (sni.nestedSectionId) {
        sectionNestedItem = Object.assign({}, section.nestedSections.find(s => s.id === sni.nestedSectionId));
        sectionNestedItem.programVar = sni.programVar || '';
        sectionNestedItem.sniId = sni.id;
        sectionNestedItem.sectionId = section.id;
        sectionNestedItem.groups = section.groups;
      } else {
        sectionNestedItem = Object.assign({}, section.questions.find(q => q.id === sni.questionId));
        sectionNestedItem.programVar = sni.programVar || '';
        sectionNestedItem.sniId = sni.id;
        sectionNestedItem.sectionId = section.id;
        sectionNestedItem.groups = section.groups;
        sectionNestedItem.responseSets = [{name: 'None'}];
        if (sni.responseSetId) {
          var responseSet = section.responseSets.find(rs => rs.id === sni.responseSetId);
          if(responseSet) {
            sectionNestedItem.responseSets = [responseSet];
          } else {
            sectionNestedItem.responseSets = [{name: 'Loading...'}];
          }
        }
      }
      return sectionNestedItem;
    });
  }

  deleteModal(section) {
    return(
      <div className="static-modal">
        <Modal animation={false} show={this.state.showDeleteModal} onHide={()=>this.setState({showDeleteModal: false})} role="dialog" aria-label="Delete Confirmation Modal">
          <Modal.Header>
            <Modal.Title componentClass="h2"><i className="fa fa-exclamation-triangle simple-search-icon" aria-hidden="true"><text className="sr-only">Warning for</text></i> Delete Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this section? This action cannot be undone.</p>
            <p><strong>Delete Section: </strong>This will delete the section but not any of the other items created or associated with it</p>
            <p><strong>Delete All: </strong>This will delete the section and all other unused private draft questions and response sets associated with it</p>
          </Modal.Body>
          <br/>
          <br/>
          <Modal.Footer>
            <Button onClick={() => this.props.deleteSection(section.id, false, (response) => {
              if (response.status == 200) {
                let stats = Object.assign({}, this.props.stats);
                stats.sectionCount = this.props.stats.sectionCount - 1;
                stats.mySectionCount = this.props.stats.mySectionCount - 1;
                this.props.setStats(stats);
                this.props.router.push('/');
              }
            })} bsStyle="primary">Delete Section</Button>
            <Button onClick={() => this.props.deleteSection(section.id, true, (response) => {
              if (response.status == 200) {
                let stats = Object.assign({}, this.props.stats);
                stats.sectionCount = this.props.stats.sectionCount - 1;
                stats.mySectionCount = this.props.stats.mySectionCount - 1;
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
            {this.state.publishOrRetire === 'Publish' && <div><p>Are you sure you want to publish this section and all of its contents?</p><p>Publishing this item will change the visibility of this content to public, making it available to all authenticated and unauthenticated users.</p><p>This action cannot be undone.</p></div>}
            {this.state.publishOrRetire === 'Retire' && <div><p>Are you sure you want to retire this content?</p><p>The content stage can be changed later.</p></div>}
          </Modal.Body>
          <Modal.Footer>
            {this.state.publishOrRetire === 'Retire' && <Button onClick={() => {
              this.props.retireSection(this.props.section.id);
              this.setState({showPublishModal: false});
            }} bsStyle="primary">Confirm Retire</Button>}
            {this.state.publishOrRetire === 'Publish' && <Button onClick={() => {
              this.props.publishSection(this.props.section.id);
              this.setState({showPublishModal: false});
            }} bsStyle="primary">Confirm Publish</Button>}
            <Button onClick={()=>this.setState({showPublishModal: false})} bsStyle="default">Cancel</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  mainContent(section) {
    return (
      <Col md={9} className="maincontent">
        <div className="action_bar no-print">
          {isSimpleEditable(section, this.props.currentUser) &&
            <PublisherLookUp publishers={this.props.publishers}
                           publishOrRetire={section.status === 'draft' ? 'publish' : 'retire'}
                           itemType="Section" />
          }
          {isGroupable(section, this.props.currentUser) &&
            <GroupLookUp item={section} addFunc={this.props.addSectionToGroup} removeFunc={this.props.removeSectionFromGroup} currentUser={this.props.currentUser} />
          }
          <div className="btn-group">
            <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span className="fa fa-arrow-circle-down"></span> Export <span className="caret"></span>
            </button>
            <ul className="dropdown-menu">
              <li key="header" className="dropdown-header">Export format:</li>
              <li><a href={`/sections/${this.props.section.id}/epi_info`}>Epi Info (XML)</a></li>
              <li><a href={`/sections/${this.props.section.id}/redcap`} onClick={() => gaSend('send', 'pageview', window.location.toString() + '/v' + this.props.section.version + '/Export to REDCap (XML)')}>REDCap (XML)</a></li>
              <li><a href='#' onClick={(e) => {
                e.preventDefault();
                window.print();
                gaSend('send', 'pageview', window.location.toString() + '/v' + this.props.section.version + '/Window Print');
              }}>Print</a></li>
            </ul>
          </div>
          {isPublishable(section, this.props.currentUser) &&
              <a className="btn btn-default" href="#" onClick={(e) => {
                e.preventDefault();
                this.setState({showPublishModal: true, publishOrRetire: 'Publish'});
                return false;
              }}>{this.publishModal()}Publish</a>
          }
          {isRetirable(section, this.props.currentUser) &&
              <a className="btn btn-default" href="#" onClick={(e) => {
                e.preventDefault();
                this.setState({showPublishModal: true, publishOrRetire: 'Retire'});
                return false;
              }}>{this.publishModal()}Retire</a>
          }
          {isSimpleEditable(section, this.props.currentUser) &&
            <div className="btn-group">
              <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span className="fa fa-sitemap"></span> Stage <span className="caret"></span>
              </button>
              <ul className="dropdown-menu">
                <li key="header" className="dropdown-header">Update Content Stage:</li>
                <li><a href='#' onClick={(e) => {
                  e.preventDefault();
                  this.props.updateStageSection(section.id, 'Comment Only');
                  gaSend('send', 'pageview', window.location.toString() + '/v' + section.version + '/Comment Only');
                }}>Comment Only</a></li>
                <li><a href='#' onClick={(e) => {
                  e.preventDefault();
                  this.props.updateStageSection(section.id, 'Trial Use');
                  gaSend('send', 'pageview', window.location.toString() + '/v' + section.version + '/Trial Use');
                }}>Trial Use</a></li>
                {section.status === 'draft' && <li><a href='#' onClick={(e) => {
                  e.preventDefault();
                  this.props.updateStageSection(section.id, 'Draft');
                  gaSend('send', 'pageview', window.location.toString() + '/v' + section.version + '/Draft');
                }}>Draft</a></li>}
                {section.status === 'published' && <li><a href='#' onClick={(e) => {
                  e.preventDefault();
                  this.props.updateStageSection(section.id, 'Published');
                  gaSend('send', 'pageview', window.location.toString() + '/v' + section.version + '/Published');
                }}>Published</a></li>}
              </ul>
            </div>
          }
          {this.props.currentUser && this.props.currentUser.admin && !section.preferred &&
            <a className="btn btn-default" href="#" onClick={(e) => {
              e.preventDefault();
              this.props.addPreferred(section.id, 'Section', () => {
                this.props.fetchSection(section.id);
                gaSend('send', 'pageview', window.location.toString() + '/v' + section.version + '/CDC Pref/Checked');
              });
              return false;
            }}><i className="fa fa-square"></i> CDC Pref<text className="sr-only">Click to add CDC preferred attribute to this content</text></a>
          }
          {this.props.currentUser && this.props.currentUser.admin && section.preferred &&
            <a className="btn btn-default" href="#" onClick={(e) => {
              e.preventDefault();
              this.props.removePreferred(section.id, 'Section', () => {
                this.props.fetchSection(section.id);
                gaSend('send', 'pageview', window.location.toString() + '/v' + section.version + '/CDC Pref/UnChecked');
              });
              return false;
            }}><i className="fa fa-check-square"></i> CDC Pref<text className="sr-only">Click to remove CDC preferred attribute from this content</text></a>
          }
          {isRevisable(section, this.props.currentUser) && this.props.currentUser && this.props.currentUser.author &&
            <Link className="btn btn-default" to={`sections/${section.id}/revise`}>Revise</Link>
          }
          {isEditable(section, this.props.currentUser) &&
            <Link className="btn btn-default" to={`sections/${section.id}/edit`}>Edit</Link>
          }
          {isEditable(section, this.props.currentUser) && this.props.currentUser && this.props.currentUser.author &&
            <a className="btn btn-default" href="#" onClick={(e) => {
              e.preventDefault();
              this.setState({showDeleteModal: true});
              return false;
            }}>{this.deleteModal(section)}Delete</a>
          }
          {isExtendable(section, this.props.currentUser) && this.props.currentUser && this.props.currentUser.author &&
            <Link className="btn btn-default" to={`/sections/${section.id}/extend`}>Extend</Link>
          }
        </div>
        <div className="maincontent-details">
          <Breadcrumb currentUser={this.props.currentUser} />
          <h1 className={`maincontent-item-name ${section.preferred ? 'cdc-preferred-note' : ''}`}><strong>Section Name:</strong> {section.name} {section.preferred && <text className="sr-only">This content is marked as preferred by the CDC</text>}</h1>
          <p className="maincontent-item-info">Version: {section.version} - Author: {section.userId} </p>
          <p className="maincontent-item-info">Tags: {section.tagList && section.tagList.length > 0 ? (
            <text>{section.tagList.join(', ')}</text>
          ) : (
            <text>No Tags Found</text>
          )}
          {isSimpleEditable(section, this.props.currentUser) &&
            <a className='pull-right' href='#' onClick={(e) => {
              e.preventDefault();
              this.setState({ tagModalOpen: true });
            }}>Update Tags <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
              <TagModal show={this.state.tagModalOpen || false}
                        cancelButtonAction={() => this.setState({ tagModalOpen: false })}
                        tagList={section.tagList}
                        saveButtonAction={(tagList) => {
                          this.props.updateSectionTags(section.id, tagList);
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
              {isSimpleEditable(section, this.props.currentUser) ? (
                <ChangeHistoryTab versions={section.versions} type='section' majorVersion={section.version} />
              ) : (
                <div className='basic-c-box panel-default section-type'>
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
              <div className="basic-c-box panel-default section-type">
                <div className="panel-heading">
                  <h2 className="panel-title">Description</h2>
                </div>
                <div className="box-content">
                  <Linkify properties={{target: '_blank'}}>{section.description}</Linkify>
                </div>
                <div className="box-content">
                  <strong>Version Independent ID: </strong>{section.versionIndependentId}
                </div>
                { section.contentStage &&
                  <div className="box-content">
                    <strong>Content Stage: </strong>
                    {section.contentStage}
                  </div>
                }
                { this.props.currentUser && section.status && section.status === 'published' &&
                <div className="box-content">
                  <strong>Visibility: </strong>Public
                </div>
                }
                { this.props.currentUser && section.status && section.status === 'draft' &&
                <div className="box-content">
                  <strong>Visibility: </strong>Private (authors and publishers only)
                </div>
                }
                { section.status === 'published' && section.publishedBy && section.publishedBy.email &&
                <div className="box-content">
                  <strong>Published By: </strong>
                  {section.publishedBy.email}
                </div>
                }
                { section.parent &&
                <div className="box-content">
                  <strong>Extended from: </strong>
                  <Link to={`/sections/${section.parent.id}`}>{ section.parent.name }</Link>
                </div>
                }
              </div>
              <div className="basic-c-box panel-default">
                <div className="panel-heading">
                  <h2 className="panel-title">
                    Code System Mappings
                  </h2>
                </div>
                <div className="box-content">
                  <div id="concepts-table">
                    <CodedSetTable items={section.concepts} itemName={'Code System Mapping'} />
                  </div>
                </div>
              </div>
              {section.sectionNestedItems && section.sectionNestedItems.length > 0 && ((section.questions && section.questions.length > 0) || (section.nestedSections && section.nestedSections.length > 0)) &&
                <div className="basic-c-box panel-default">
                  <div className="panel-heading">
                    <h2 className="panel-title">
                      <a className="panel-toggle" onClick={(e) => {
                        e.preventDefault();
                        this.toggleExpand();
                      }} href={`#collapse-linked-questions`}><i className="fa fa-bars" aria-hidden="true"></i>
                      <text className="sr-only">Click link to expand information about linked </text>Linked Questions and Sections: {section.sectionNestedItems && section.sectionNestedItems.length}</a>
                    </h2>
                    <ResultStyleControl resultControlVisibility={this.props.resultControlVisibility} resultStyle={this.props.resultStyle} />
                  </div>
                  <div className="panel-collapse panel-details collapse" id="collapse-linked-questions">
                    <div className="box-content panel-body">
                      <SectionNestedItemList resultStyle={this.props.resultStyle} items={this.nestedItemsForPage(section)} currentUser={this.props.currentUser} />
                      {this.props.section.sectionNestedItems.length > 10 &&
                        <Pagination onChange={this.pageChange} current={this.state.page} total={this.props.section.sectionNestedItems.length} />
                      }
                    </div>
                  </div>
                </div>
              }
              {section.parentItems && section.parentItems.length > 0 &&
                <div className="basic-c-box panel-default">
                  <div className="panel-heading">
                    <h2 className="panel-title">
                      <a className="panel-toggle" data-toggle="collapse" href={`#collapse-linked-surveys`}><i className="fa fa-bars" aria-hidden="true"></i>
                      <text className="sr-only">Click link to expand information about </text>Parent Items</a>
                    </h2>
                  </div>
                  <div className="panel-collapse panel-details collapse" id="collapse-linked-surveys">
                    <div className="box-content panel-body">
                      {section.parentItems && section.parentItems.length > 0 && section.parentItems[0].error === undefined ? ( <ul className="no-bullet-list">
                        {section.parentItems.map((surv) => {
                          return (
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
                      </ul>) : (
                        <p>Loading Parent Items or None found.</p>
                      )}
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </Col>
    );
  }
}

SectionShow.propTypes = {
  section: sectionProps,
  router: PropTypes.object,
  currentUser: currentUserProps,
  publishSection: PropTypes.func,
  retireSection: PropTypes.func,
  deleteSection:  PropTypes.func.isRequired,
  addSectionToGroup: PropTypes.func,
  removeSectionFromGroup: PropTypes.func,
  addPreferred: PropTypes.func,
  addBreadcrumbItem: PropTypes.func,
  removePreferred: PropTypes.func,
  fetchSection: PropTypes.func,
  isLoading: PropTypes.bool,
  loadStatus : PropTypes.string,
  loadStatusText : PropTypes.string,
  updateSectionTags: PropTypes.func,
  updateStageSection: PropTypes.func,
  setStats: PropTypes.func,
  stats: PropTypes.object,
  publishers: publishersProps,
  resultControlVisibility: PropTypes.string,
  resultStyle: PropTypes.string,
  toggleResultControl: PropTypes.func
};

export default SectionShow;
