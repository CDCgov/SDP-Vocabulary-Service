import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import { responseSetProps } from '../../prop-types/response_set_props';
import VersionInfo from '../VersionInfo';
import { hashHistory } from 'react-router';
import { Row, Col } from 'react-bootstrap';
import SectionNestedItemList from '../../containers/sections/SectionNestedItemList';
import LoadingSpinner from '../../components/LoadingSpinner';
import BasicAlert from '../../components/BasicAlert';

import CodedSetTable from "../CodedSetTable";
import Breadcrumb from "../Breadcrumb";
import ProgramsAndSystems from "../shared_show/ProgramsAndSystems";
import PublisherLookUp from "../shared_show/PublisherLookUp";
import GroupLookUp from "../shared_show/GroupLookUp";
import ChangeHistoryTab from "../shared_show/ChangeHistoryTab";
import currentUserProps from "../../prop-types/current_user_props";
import { publishersProps } from "../../prop-types/publisher_props";
import { isEditable, isRevisable, isPublishable, isRetirable, isExtendable, isSimpleEditable, isGroupable } from '../../utilities/componentHelpers';

export default class ResponseSetShow extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedTab: 'main'
    };
  }

  componentWillMount() {
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

  mainContent(responseSet) {
    return (
      <Col md={9} className="maincontent">
        {this.props.currentUser && this.props.currentUser.id &&
          <div className="action_bar no-print">
            {isEditable(responseSet, this.props.currentUser) &&
              <PublisherLookUp publishers={this.props.publishers}
                             itemType="Response Set" />
            }
            {isGroupable(responseSet, this.props.currentUser) &&
              <GroupLookUp item={responseSet} addFunc={this.props.addResponseSetToGroup} removeFunc={this.props.removeResponseSetFromGroup} currentUser={this.props.currentUser} />
            }
            {isRevisable(responseSet, this.props.currentUser) &&
              <Link className="btn btn-default" to={`/responseSets/${responseSet.id}/revise`}>Revise</Link>
            }
            {isEditable(responseSet, this.props.currentUser) &&
              <Link className="btn btn-default" to={`/responseSets/${responseSet.id}/edit`}>Edit</Link>
            }
            {isExtendable(responseSet, this.props.currentUser) &&
              <Link className="btn btn-default" to={`/responseSets/${responseSet.id}/extend`}>Extend</Link>
            }
            {isRetirable(responseSet, this.props.currentUser) &&
              <a className="btn btn-default" href="#" onClick={(e) => {
                e.preventDefault();
                this.props.retireResponseSet(responseSet.id);
                return false;
              }}>Retire</a>
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
            {isPublishable(responseSet, this.props.currentUser) &&
              <a className="btn btn-default" href="#" onClick={(e) => {
                e.preventDefault();
                this.props.publishResponseSet(responseSet.id);
                return false;
              }}>Publish</a>
            }
            {this.props.currentUser && this.props.currentUser.admin && !responseSet.preferred &&
              <a className="btn btn-default" href="#" onClick={(e) => {
                e.preventDefault();
                this.props.addPreferred(responseSet.id, 'ResponseSet', () => {
                  this.props.fetchResponseSet(responseSet.id);
                });
                return false;
              }}><i className="fa fa-square"></i> CDC Pref<text className="sr-only">Click to add CDC preferred attribute to this content</text></a>
            }
            {this.props.currentUser && this.props.currentUser.admin && responseSet.preferred &&
              <a className="btn btn-default" href="#" onClick={(e) => {
                e.preventDefault();
                this.props.removePreferred(responseSet.id, 'ResponseSet', () => {
                  this.props.fetchResponseSet(responseSet.id);
                });
                return false;
              }}><i className="fa fa-check-square"></i> CDC Pref<text className="sr-only">Click to remove CDC preferred attribute from this content</text></a>
            }
            {isEditable(responseSet, this.props.currentUser) &&
              <a className="btn btn-default" href="#" onClick={(e) => {
                e.preventDefault();
                if(confirm('Are you sure you want to delete this Response Set? This action cannot be undone.')){
                  this.props.deleteResponseSet(responseSet.id, (response) => {
                    if (response.status == 200) {
                      let stats = Object.assign({}, this.props.stats);
                      stats.responseSetCount = this.props.stats.responseSetCount - 1;
                      stats.myResponseSetCount = this.props.stats.myResponseSetCount - 1;
                      this.props.setStats(stats);
                      this.props.router.push('/');
                    }
                  });
                }
                return false;
              }}>Delete</a>
            }
          </div>
        }
        <div className="maincontent-details">
          <Breadcrumb currentUser={this.props.currentUser} />
          <h1 className={`maincontent-item-name ${responseSet.preferred ? 'cdc-preferred-note' : ''}`}><strong>Response Set Name:</strong> {responseSet.name} {responseSet.preferred && <text className="sr-only">This content is marked as preferred by the CDC</text>}</h1>
          <p className="maincontent-item-info">Version: {responseSet.version} - Author: {responseSet.createdBy && responseSet.createdBy.email} </p>
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
              <ChangeHistoryTab versions={responseSet.versions} type='response_set' majorVersion={responseSet.version} />
            </div>
            <div className={`tab-pane ${this.state.selectedTab === 'main' && 'active'}`} id="main" role="tabpanel" aria-hidden={this.state.selectedTab !== 'main'} aria-labelledby="main-content-tab">
              <div className="basic-c-box panel-default response_set-type">
                <div className="panel-heading">
                  <h2 className="panel-title">Details</h2>
                </div>
                <div className="box-content">
                  <strong>Description: </strong>
                  {responseSet.description}
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
                  </div>
                }
                {responseSet.duplicateOf && responseSet.contentStage && responseSet.contentStage === 'Duplicate' &&
                  <div className="box-content">
                    <strong>Duplicate of: </strong><Link to={`/responseSets/${responseSet.duplicateOf}`}>Response Set #{responseSet.duplicateOf}</Link>
                  </div>
                }
                { this.props.currentUser && responseSet.status && responseSet.status === 'published' &&
                <div className="box-content">
                  <strong>Visibility: </strong>Published (publically available)
                </div>
                }
                { this.props.currentUser && responseSet.status && responseSet.status === 'draft' &&
                <div className="box-content">
                  <strong>Visibility: </strong>Draft (authors and publishers only)
                </div>
                }
                { responseSet.status === 'published' && responseSet.publishedBy && responseSet.publishedBy.email &&
                <div className="box-content">
                  <strong>Published By: </strong>
                  {responseSet.publishedBy.email}
                </div>
                }
              </div>
              <div className="basic-c-box panel-default">
                <div className="panel-heading">
                  <h2 className="panel-title">Responses</h2>
                </div>
                <div className="box-content">
                <CodedSetTable items={responseSet.responses} itemName={'Response'} />
                </div>
              </div>
              {responseSet.questions && responseSet.questions.length > 0 &&
                <div className="basic-c-box panel-default">
                  <div className="panel-heading">
                    <h2 className="panel-title">Linked Questions</h2>
                  </div>
                  <div className="box-content">
                    <SectionNestedItemList items={responseSet.questions} currentUser={this.props.currentUser} />
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
  addResponseSetToGroup: PropTypes.func,
  removeResponseSetFromGroup: PropTypes.func,
  addPreferred: PropTypes.func,
  removePreferred: PropTypes.func,
  updateStageResponseSet: PropTypes.func,
  fetchResponseSet: PropTypes.func,
  setStats: PropTypes.func,
  stats: PropTypes.object,
  isLoading: PropTypes.bool,
  loadStatus : PropTypes.string,
  loadStatusText : PropTypes.string,
  publishers: publishersProps
};
