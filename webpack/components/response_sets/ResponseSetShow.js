import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Linkify from 'react-linkify';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import { responseSetProps } from '../../prop-types/response_set_props';
import VersionInfo from '../VersionInfo';
import { hashHistory } from 'react-router';
import { Modal, Button, Row, Grid, Col } from 'react-bootstrap';
import SectionNestedItemList from '../../containers/sections/SectionNestedItemList';
import LoadingSpinner from '../../components/LoadingSpinner';
import BasicAlert from '../../components/BasicAlert';
import Pagination from 'rc-pagination';

const PAGE_SIZE = 10;

import CodedSetTable from "../CodedSetTable";
import Breadcrumb from "../Breadcrumb";
import TagModal from "../TagModal";
import ProgramsAndSystems from "../shared_show/ProgramsAndSystems";
import PublisherLookUp from "../shared_show/PublisherLookUp";
import GroupLookUp from "../shared_show/GroupLookUp";
import ChangeHistoryTab from "../shared_show/ChangeHistoryTab";
import CurationHistoryTab from "../shared_show/CurationHistoryTab";
import currentUserProps from "../../prop-types/current_user_props";
import { publishersProps } from "../../prop-types/publisher_props";
import { isEditable, isRevisable, isPublishable, isRetirable, isExtendable, isSimpleEditable, isGroupable } from '../../utilities/componentHelpers';

import { gaSend } from '../../utilities/GoogleAnalytics';

export default class ResponseSetShow extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedTab: 'main',
      page: 1,
      qPage: 1,
      showPublishModal: false,
      showDeleteModal: false,
      publishOrRetire: 'Publish'
    };
    this.nestedItemsForPage = this.nestedItemsForPage.bind(this);
    this.pageChange = this.pageChange.bind(this);
  }

  componentDidMount() {
    this.props.addBreadcrumbItem({type:'response_set',id:this.props.responseSet.id,name:this.props.responseSet.name});
  }

  render() {
    const {responseSet} = this.props;
    if(responseSet === undefined || responseSet.name === undefined){
      return (
              <Grid className="basic-bg">
                <div>
                  <div className="showpage_header_container no-print">
                    <ul className="list-inline">
                      <li className="showpage_button"><span className="fa fa-arrow-left fa-2x" aria-hidden="true" onClick={hashHistory.goBack}></span></li>
                      <li className="showpage_title"><h1>Response Set Details</h1></li>
                    </ul>
                  </div>
                </div>
                <Row>
                  <Col xs={12}>
                      <div className="main-content">
                        {this.props.isLoading && <LoadingSpinner msg="Loading response set..." />}
                        {this.props.loadStatus == 'failure' &&
                          <BasicAlert msg={this.props.loadStatusText} severity='danger' />
                        }
                        {this.props.loadStatus == 'success' &&
                         <BasicAlert msg="Sorry, there is a problem loading this response set." severity='warning' />
                        }
                      </div>
                  </Col>
                </Row>
              </Grid>
      );
    }

    return (
      <div>
        <div id={"response_set_id_"+responseSet.id}>
          <div className="showpage_header_container no-print">
            <ul className="list-inline">
              <li className="showpage_button"><span className="fa fa-arrow-left fa-2x" aria-hidden="true" onClick={hashHistory.goBack}></span></li>
              <li className="showpage_title"><h1>Response Set Details {responseSet.contentStage && (<text>[{responseSet.contentStage.toUpperCase()}]</text>)}</h1></li>
            </ul>
          </div>
        </div>
        <Row className="no-inside-gutter">
          {this.historyBar(responseSet)}
          {this.mainContent(responseSet)}
        </Row>
      </div>
    );
  }

  pageChange(nextPage) {
    this.setState({qPage: nextPage});
  }

  nestedItemsForPage(responseSet) {
    const startIndex = (this.state.qPage - 1) * PAGE_SIZE;
    const endIndex = this.state.qPage * PAGE_SIZE;
    const itemPage = responseSet.questions.slice(startIndex, endIndex);
    return itemPage;
  }

  historyBar(responseSet) {
    return (
      <Col md={3} className="no-print">
        <h2 className="showpage_sidenav_subtitle">
          <text className="sr-only">Version History Navigation Links</text>
          <ul className="list-inline">
            <li className="subtitle_icon"><span className="fa fa-history" aria-hidden="true"></span></li>
            <li className="subtitle">History</li>
          </ul>
        </h2>
        <VersionInfo versionable={responseSet} versionableType='ResponseSet' currentUser={this.props.currentUser} />
      </Col>
    );
  }

  sourceLink(responseSet) {
    if(responseSet.source === 'PHIN_VADS' && responseSet.oid && responseSet.version === responseSet.mostRecent) {
      return <a href={`https://phinvads.cdc.gov/vads/ViewValueSet.action?oid=${responseSet.oid}`} target="_blank">PHIN VADS</a>;
    } else if (responseSet.source === 'PHIN_VADS') {
      return <a href="https://phinvads.cdc.gov">PHIN VADS</a>;
    } else {
      return <text>{responseSet.source[0].toUpperCase() + responseSet.source.slice(1)}</text>;
    }
  }

  publishModal() {
    return(
      <div className="static-modal">
        <Modal animation={false} show={this.state.showPublishModal} onHide={()=>this.setState({showPublishModal: false})} role="dialog" aria-label="Publish Confirmation Modal">
          <Modal.Header>
            <Modal.Title componentClass="h2"><i className="fa fa-exclamation-triangle simple-search-icon" aria-hidden="true"><text className="sr-only">Warning for</text></i> {this.state.publishOrRetire} Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.publishOrRetire === 'Publish' && <div><p>Are you sure you want to publish this response set?</p><p>Publishing this item will change the visibility of this content to public, making it available to all authenticated and unauthenticated users.</p><p>This action cannot be undone.</p></div>}
            {this.state.publishOrRetire === 'Retire' && <div><p>Are you sure you want to retire this content?</p><p>The content stage can be changed later.</p></div>}
          </Modal.Body>
          <Modal.Footer>
            {this.state.publishOrRetire === 'Retire' && <Button onClick={() => {
              this.props.retireResponseSet(this.props.responseSet.id);
              this.setState({showPublishModal: false});
            }} bsStyle="primary">Confirm Retire</Button>}
            {this.state.publishOrRetire === 'Publish' && <Button onClick={() => {
              this.props.publishResponseSet(this.props.responseSet.id);
              this.setState({showPublishModal: false});
            }} bsStyle="primary">Confirm Publish</Button>}
            <Button onClick={() => this.setState({showPublishModal: false})} bsStyle="default">Cancel</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  deleteModal(responseSet) {
    return(
      <div className="static-modal">
        <Modal animation={false} show={this.state.showDeleteModal} onHide={()=>this.setState({showDeleteModal: false})} role="dialog" aria-label="Delete Confirmation Modal">
          <Modal.Header>
            <Modal.Title componentClass="h2"><i className="fa fa-exclamation-triangle simple-search-icon" aria-hidden="true"><text className="sr-only">Warning for</text></i> Delete Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this response set? This action cannot be undone.</p>
            <p><strong>Delete Response Set: </strong>This will delete the response set permanently</p>
          </Modal.Body>
          <br/>
          <br/>
          <Modal.Footer>
            <Button onClick={() => this.props.deleteResponseSet(responseSet.id, (response) => {
              if (response.status == 200) {
                let stats = Object.assign({}, this.props.stats);
                stats.responseSetCount = this.props.stats.responseSetCount - 1;
                stats.myResponseSetCount = this.props.stats.myResponseSetCount - 1;
                this.props.setStats(stats);
                this.props.router.push('/');
              }
            })} bsStyle="primary">Delete Response Set</Button>
            <Button onClick={()=>this.setState({showDeleteModal: false})} bsStyle="default">Cancel</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  mainContent(responseSet) {
    return (
      <Col md={9} className="maincontent">
        {this.props.currentUser && this.props.currentUser.id &&
          <div className="action_bar no-print">
            {isSimpleEditable(responseSet, this.props.currentUser) &&
              <PublisherLookUp publishers={this.props.publishers}
                             publishOrRetire={responseSet.status === 'draft' ? 'publish' : 'retire'}
                             itemType="Response Set" />
            }
            {isGroupable(responseSet, this.props.currentUser) &&
              <GroupLookUp item={responseSet} addFunc={this.props.addResponseSetToGroup} removeFunc={this.props.removeResponseSetFromGroup} currentUser={this.props.currentUser} />
            }
            {isRevisable(responseSet, this.props.currentUser) && this.props.currentUser && this.props.currentUser.author &&
              <Link className="btn btn-default" to={`/responseSets/${responseSet.id}/revise`}>Revise</Link>
            }
            {isEditable(responseSet, this.props.currentUser) &&
              <Link className="btn btn-default" to={`/responseSets/${responseSet.id}/edit`}>Edit</Link>
            }
            {isExtendable(responseSet, this.props.currentUser) && this.props.currentUser && this.props.currentUser.author &&
              <Link className="btn btn-default" to={`/responseSets/${responseSet.id}/extend`}>Extend</Link>
            }
            {isSimpleEditable(responseSet, this.props.currentUser) &&
              <div className="btn-group">
                <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span className="fa fa-sitemap"></span> Stage <span className="caret"></span>
                </button>
                <ul className="dropdown-menu">
                  <li key="header" className="dropdown-header">Update Content Stage:</li>
                  <li><a href='#' onClick={(e) => {
                    e.preventDefault();
                    this.props.updateStageResponseSet(responseSet.id, 'Comment Only');
                  }}>Comment Only</a></li>
                  <li><a href='#' onClick={(e) => {
                    e.preventDefault();
                    this.props.updateStageResponseSet(responseSet.id, 'Trial Use');
                  }}>Trial Use</a></li>
                  {responseSet.status === 'draft' && <li><a href='#' onClick={(e) => {
                    e.preventDefault();
                    this.props.updateStageResponseSet(responseSet.id, 'Draft');
                  }}>Draft</a></li>}
                  {responseSet.status === 'published' && <li><a href='#' onClick={(e) => {
                    e.preventDefault();
                    this.props.updateStageResponseSet(responseSet.id, 'Published');
                  }}>Published</a></li>}
                </ul>
              </div>
            }
            {isRetirable(responseSet, this.props.currentUser) &&
              <a className="btn btn-default" href="#" onClick={(e) => {
                e.preventDefault();
                this.setState({showPublishModal: true, publishOrRetire: 'Retire'});
                return false;
              }}>{this.publishModal()}Retire</a>
            }
            {isPublishable(responseSet, this.props.currentUser) &&
              <a className="btn btn-default" href="#" onClick={(e) => {
                e.preventDefault();
                this.setState({showPublishModal: true, publishOrRetire: 'Publish'});
                return false;
              }}>{this.publishModal()}Publish</a>
            }
            {this.props.currentUser && this.props.currentUser.admin && !responseSet.preferred &&
              <a className="btn btn-default" href="#" onClick={(e) => {
                e.preventDefault();
                this.props.addPreferred(responseSet.id, 'ResponseSet', () => {
                  this.props.fetchResponseSet(responseSet.id);
                  gaSend('send', 'pageview', window.location.toString() + '/v' + responseSet.version + '/CDC Pref/Checked');
                });
                return false;
              }}><i className="fa fa-square"></i> CDC Pref<text className="sr-only">Click to add CDC preferred attribute to this content</text></a>
            }
            {this.props.currentUser && this.props.currentUser.admin && responseSet.preferred &&
              <a className="btn btn-default" href="#" onClick={(e) => {
                e.preventDefault();
                this.props.removePreferred(responseSet.id, 'ResponseSet', () => {
                  this.props.fetchResponseSet(responseSet.id);
                  gaSend('send', 'pageview', window.location.toString() + '/v' + responseSet.version + '/CDC Pref/UnChecked');
                });
                return false;
              }}><i className="fa fa-check-square"></i> CDC Pref<text className="sr-only">Click to remove CDC preferred attribute from this content</text></a>
            }
            {isEditable(responseSet, this.props.currentUser) && this.props.currentUser && this.props.currentUser.author &&
              <a className="btn btn-default" href="#" onClick={(e) => {
                e.preventDefault();
                this.setState({showDeleteModal: true});
                return false;
              }}>{this.deleteModal(responseSet)}Delete</a>
            }
          </div>
        }
        <div className="maincontent-details">
          <Breadcrumb currentUser={this.props.currentUser} />
          <h1 className={`maincontent-item-name ${responseSet.preferred ? 'cdc-preferred-note' : ''}`}><strong>Response Set Name:</strong> {responseSet.name} {responseSet.preferred && <text className="sr-only">This content is marked as preferred by the CDC</text>}</h1>
          <p className="maincontent-item-info">Version: {responseSet.version} - Author: {responseSet.createdBy && responseSet.createdBy.email} </p>
          <p className="maincontent-item-info">Tags: {responseSet.tagList && responseSet.tagList.length > 0 ? (
            <text>{responseSet.tagList.join(', ')}</text>
          ) : (
            <text>No Tags Found</text>
          )}
          {isSimpleEditable(responseSet, this.props.currentUser) &&
            <a className='pull-right' href='#' onClick={(e) => {
              e.preventDefault();
              this.setState({ tagModalOpen: true });
            }}>Update Tags <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
              <TagModal show={this.state.tagModalOpen || false}
                        cancelButtonAction={() => this.setState({ tagModalOpen: false })}
                        tagList={responseSet.tagList}
                        saveButtonAction={(tagList) => {
                          this.props.updateResponseSetTags(responseSet.id, tagList);
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
            <li id="curation-history-tab" className="nav-item" role="tab" onClick={() => this.setState({selectedTab: 'curation'})} aria-selected={this.state.selectedTab === 'changes'} aria-controls="curation">
              <a className="nav-link" data-toggle="tab" href="#curation-history" role="tab">Curation History</a>
            </li>
          </ul>
          <div className="tab-content">
          <div className={`tab-pane ${this.state.selectedTab === 'curation' && 'active'}`} id="curation" role="tabpanel" aria-hidden={this.state.selectedTab !== 'curation'} aria-labelledby="curation-history-tab">
            {isSimpleEditable(responseSet, this.props.currentUser) ? (
              <CurationHistoryTab suggestedReplacementOf={responseSet.suggestedReplacementOf} duplicateOf={responseSet.duplicateOf} contentStage={responseSet.contentStage} objSetName={'Response Set'} type='response_set'/>
            ) : (
              <div className='basic-c-box panel-default response_set-type'>
                <div className="panel-heading">
                  <h2 className="panel-title">Curation</h2>
                </div>
                <div className="box-content">
                  You do not have permissions to see curation history on this item ((you must be the owner or in the proper collaborative authoring group).
                </div>
              </div>
            )}
          </div>
            <div className={`tab-pane ${this.state.selectedTab === 'changes' && 'active'}`} id="changes" role="tabpanel" aria-hidden={this.state.selectedTab !== 'changes'} aria-labelledby="change-history-tab">
              {isSimpleEditable(responseSet, this.props.currentUser) ? (
                <ChangeHistoryTab versions={responseSet.versions} type='response_set' majorVersion={responseSet.version} />
              ) : (
                <div className='basic-c-box panel-default response_set-type'>
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
              <div className="basic-c-box panel-default response_set-type">
                <div className="panel-heading">
                  <h2 className="panel-title">Details</h2>
                </div>
                <div className="box-content">
                  <strong>Version Independent ID: </strong>{responseSet.versionIndependentId}
                </div>
                <div className="box-content">
                  <strong>Description: </strong>
                  <Linkify properties={{target: '_blank'}}>{responseSet.description}</Linkify>
                </div>
                <div className="box-content">
                  <strong>Created: </strong>
                  { format(parse(responseSet.createdAt,''), 'MMMM Do YYYY, h:mm:ss a') }
                </div>
                { responseSet.parent &&
                  <div className="box-content">
                    <strong>Extended from: </strong>
                    <Link to={`/responseSets/${responseSet.parent.id}`}>{ responseSet.parent.name }</Link>
                  </div>
                }
                { responseSet.source &&
                  <div className="box-content">
                    <strong>Import / Source: </strong>
                    {this.sourceLink(responseSet)}
                  </div>
                }
                { responseSet.contentStage &&
                  <div className="box-content">
                    <strong>Content Stage: </strong>
                    {responseSet.contentStage}
                    {gaSend('send', 'pageview', window.location.toString() + '/v' + responseSet.version + '/' + responseSet.contentStage)}
                  </div>
                }
                { this.props.currentUser && responseSet.status && responseSet.status === 'published' &&
                <div className="box-content">
                  <strong>Visibility: </strong>Public
                </div>
                }
                { this.props.currentUser && responseSet.status && responseSet.status === 'draft' &&
                <div className="box-content">
                  <strong>Visibility: </strong>Private (authors and publishers only)
                </div>
                }
                { responseSet.status === 'published' && responseSet.publishedBy && responseSet.publishedBy.email &&
                <div className="box-content">
                  <strong>Published By: </strong>
                  {responseSet.publishedBy.email}
                </div>
                }
                { responseSet.oid &&
                <div className="box-content">
                  <strong>OID: </strong>
                  {responseSet.oid}
                </div>
                }
              </div>
              <div className="basic-c-box panel-default">
                <div className="panel-heading">
                  <h2 className="panel-title">Responses</h2>
                </div>
                <div className="box-content">
                  {responseSet.responseCount && responseSet.responseCount > 25 &&
                    <p>
                      This response set has a large amount of responses. The table below is a sample of 25 of the {responseSet.responseCount} responses. To access an exhaustive list please choose from the following options:
                      <ul>
                        <li>Visit our API endpoint ({`/api/valueSets/${responseSet.versionIndependentId}`}) with the full list of responses</li>
                        {responseSet.source && responseSet.source === 'PHIN_VADS' && responseSet.oid && responseSet.version === responseSet.mostRecent &&
                          <li><a href={`https://phinvads.cdc.gov/vads/ViewValueSet.action?oid=${responseSet.oid}`} target="_blank">Click here to visit import source list in PHIN VADS UI</a></li>
                        }
                        <li>Use the load more option at the bottom of the table to expand to the exhaustive list. For performance and usability each load batch will grab an additional 25 responses.</li>
                      </ul>
                    </p>
                  }
                  <CodedSetTable items={responseSet.responses} itemName={'Response'} />
                  {responseSet.responses && responseSet.responseCount && responseSet.responseCount > 25 && responseSet.responseCount !== responseSet.responses.length &&
                    <p><button onClick={() => {
                      this.props.fetchMoreResponses(responseSet.id, this.state.page);
                      this.setState({page: this.state.page+1});
                    }}>... Click here to load more</button></p>
                  }
                </div>
              </div>
              {responseSet.questions && responseSet.questions.length > 0 &&
                <div className="basic-c-box panel-default">
                  <div className="panel-heading">
                    <h2 className="panel-title">Linked Questions</h2>
                  </div>
                  <div className="box-content">
                    <SectionNestedItemList items={this.nestedItemsForPage(responseSet)} currentUser={this.props.currentUser} />
                    {responseSet.questions.length > 10 &&
                      <Pagination onChange={this.pageChange} current={this.state.qPage} total={responseSet.questions.length} />
                    }
                  </div>
                </div>
              }
              {responseSet.status === 'published' &&
                <ProgramsAndSystems item={responseSet} />
              }
            </div>
          </div>
        </div>
      </Col>
    );
  }
}

ResponseSetShow.propTypes = {
  responseSet: responseSetProps,
  router: PropTypes.object,
  currentUser: currentUserProps,
  publishResponseSet: PropTypes.func,
  retireResponseSet: PropTypes.func,
  addBreadcrumbItem: PropTypes.func,
  deleteResponseSet:  PropTypes.func,
  fetchMoreResponses: PropTypes.func,
  addResponseSetToGroup: PropTypes.func,
  removeResponseSetFromGroup: PropTypes.func,
  addPreferred: PropTypes.func,
  removePreferred: PropTypes.func,
  updateStageResponseSet: PropTypes.func,
  fetchResponseSet: PropTypes.func,
  updateResponseSetTags: PropTypes.func,
  setStats: PropTypes.func,
  stats: PropTypes.object,
  isLoading: PropTypes.bool,
  loadStatus : PropTypes.string,
  loadStatusText : PropTypes.string,
  publishers: publishersProps
};
