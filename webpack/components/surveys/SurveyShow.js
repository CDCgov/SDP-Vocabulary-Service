import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { hashHistory, Link } from 'react-router';
import { Modal, Button } from 'react-bootstrap';

import VersionInfo from '../VersionInfo';
import PublisherLookUp from "../shared_show/PublisherLookUp";
import GroupLookUp from "../shared_show/GroupLookUp";
import ChangeHistoryTab from "../shared_show/ChangeHistoryTab";
import CodedSetTable from "../CodedSetTable";
import TagModal from "../TagModal";

import SectionList from "../sections/SectionList";

import { surveyProps } from '../../prop-types/survey_props';
import { sectionProps } from '../../prop-types/section_props';
import currentUserProps from '../../prop-types/current_user_props';
import { publishersProps } from "../../prop-types/publisher_props";

import { isEditable, isRevisable, isPublishable, isExtendable, isGroupable, isSimpleEditable } from '../../utilities/componentHelpers';

class SurveyShow extends Component {
  constructor(props) {
    super(props);
    this.state = { tagModalOpen: false, selectedTab: 'main', showDeleteModal: false };
  }

  historyBar() {
    return (
      <div className="col-md-3 nopadding no-print">
        <h2 className="showpage_sidenav_subtitle">
          <text className="sr-only">Version History Navigation Links</text>
          <ul className="list-inline">
            <li className="subtitle_icon"><span className="fa fa-history" aria-hidden="true"></span></li>
            <li className="subtitle">History</li>
          </ul>
        </h2>
        <VersionInfo versionable={this.props.survey} versionableType='survey' currentUser={this.props.currentUser} />
      </div>
    );
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
            <p><strong>Delete All: </strong>This will delete the survey and all other unused draft sections, questions, and response sets associated with it</p>
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

  mainContent() {
    return (
      <div className="col-md-9 nopadding maincontent">
        <div className="action_bar no-print">
          {isEditable(this.props.survey, this.props.currentUser) &&
            <PublisherLookUp publishers={this.props.publishers}
                           itemType="Survey" />
          }
          <div className="btn-group">
            <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span className="fa fa-arrow-circle-down"></span> Export <span className="caret"></span>
            </button>
            <ul className="dropdown-menu">
              <li key="header" className="dropdown-header">Export format:</li>
              <li><a href={`/surveys/${this.props.survey.id}/epi_info`}>Epi Info (XML)</a></li>
              <li><a href={`/surveys/${this.props.survey.id}/redcap`}>REDCap (XML)</a></li>
              <li><a href={`/surveys/${this.props.survey.id}/spreadsheet`}>Spreadsheet (XLSX)</a></li>
              <li><a href='#' onClick={(e) => {
                e.preventDefault();
                window.print();
              }}>Print</a></li>
            </ul>
          </div>
          {isGroupable(this.props.survey, this.props.currentUser) &&
            <GroupLookUp item={this.props.survey} addFunc={this.props.addSurveyToGroup} removeFunc={this.props.removeSurveyFromGroup} currentUser={this.props.currentUser} />
          }
          {isPublishable(this.props.survey, this.props.currentUser) &&
            <a className="btn btn-default" href="#" onClick={(e) => {
              e.preventDefault();
              this.props.publishSurvey(this.props.survey.id);
              return false;
            }}>Publish</a>
          }
          {this.props.currentUser && this.props.currentUser.admin && !this.props.survey.preferred &&
            <a className="btn btn-default" href="#" onClick={(e) => {
              e.preventDefault();
              this.props.addPreferred(this.props.survey.id, 'Survey', () => {
                this.props.fetchSurvey(this.props.survey.id);
              });
              return false;
            }}><i className="fa fa-square"></i> CDC Pref<text className="sr-only">Click to add CDC preferred attribute to this content</text></a>
          }
          {this.props.currentUser && this.props.currentUser.admin && this.props.survey.preferred &&
            <a className="btn btn-default" href="#" onClick={(e) => {
              e.preventDefault();
              this.props.removePreferred(this.props.survey.id, 'Survey', () => {
                this.props.fetchSurvey(this.props.survey.id);
              });
              return false;
            }}><i className="fa fa-check-square"></i> CDC Pref<text className="sr-only">Click to remove CDC preferred attribute from this content</text></a>
          }
          {isRevisable(this.props.survey, this.props.currentUser) &&
              <Link className="btn btn-default" to={`surveys/${this.props.survey.id}/revise`}>Revise</Link>
          }
          {isEditable(this.props.survey, this.props.currentUser) &&
              <Link className="btn btn-default" to={`surveys/${this.props.survey.id}/edit`}>Edit</Link>
          }
          {isEditable(this.props.survey, this.props.currentUser) &&
            <a className="btn btn-default" href="#" onClick={(e) => {
              e.preventDefault();
              this.setState({showDeleteModal: true});
              return false;
            }}>{this.deleteModal()}Delete</a>
          }
          {isExtendable(this.props.survey, this.props.currentUser) &&
            <Link className="btn btn-default" to={`/surveys/${this.props.survey.id}/extend`}>Extend</Link>
          }
          {isEditable(this.props.survey, this.props.currentUser) && this.props.survey.dupeCount > 0 &&
              <Link className="btn btn-default" to={`surveys/${this.props.survey.id}/dedupe`}>Curate ({this.props.survey.dupeCount})</Link>
          }
        </div>
        <div className="maincontent-details">
          <h1 className={`maincontent-item-name ${this.props.survey.preferred ? 'cdc-preferred-note' : ''}`}><strong>Survey Name:</strong> {this.props.survey.name} {this.props.survey.preferred && <text className="sr-only">This content is marked as preferred by the CDC</text>}</h1>
          <p className="maincontent-item-info">Version: {this.props.survey.version} - Author: {this.props.survey.userId} </p>
          {this.surveillanceProgram()}
          {this.surveillanceSystem()}
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
              <ChangeHistoryTab versions={this.props.survey.versions} type='survey' majorVersion={this.props.survey.version} />
            </div>
            <div className={`tab-pane ${this.state.selectedTab === 'main' && 'active'}`} id="main" role="tabpanel" aria-hidden={this.state.selectedTab !== 'main'} aria-labelledby="main-content-tab">
              <div className="basic-c-box panel-default survey-type">
                <div className="panel-heading">
                  <h2 className="panel-title">Description</h2>
                </div>
                <div className="box-content">
                  {this.props.survey.description}
                </div>
                { this.props.survey.status === 'published' && this.props.survey.publishedBy && this.props.survey.publishedBy.email &&
                <div className="box-content">
                  <strong>Published By: </strong>
                  {this.props.survey.publishedBy.email}
                </div>
                }
                { this.props.survey.parent &&
                <div className="box-content">
                  <strong>Extended from: </strong>
                  <Link to={this.props.survey.parent.id && `/surveys/${this.props.survey.parent.id}`}>{ this.props.survey.parent.name && this.props.survey.parent.name }</Link>
                </div>
                }
              </div>
              <div className="basic-c-box panel-default">
                <div className="panel-heading">
                  <h2 className="panel-title">
                    Tags
                    {isSimpleEditable(this.props.survey, this.props.currentUser) &&
                      <a className="pull-right tag-modal-link" href="#" onClick={(e) => {
                        e.preventDefault();
                        this.setState({ tagModalOpen: true });
                      }}>
                        <TagModal show={this.state.tagModalOpen || false}
                          cancelButtonAction={() => this.setState({ tagModalOpen: false })}
                          concepts={this.props.survey.concepts}
                          saveButtonAction={(conceptsAttributes) => {
                            this.props.updateSurveyTags(this.props.survey.id, conceptsAttributes);
                            this.setState({ tagModalOpen: false });
                          }} />
                        <i className="fa fa-pencil-square-o" aria-hidden="true"></i> Update
                      </a>
                    }
                  </h2>
                </div>
                <div className="box-content">
                  <div id="concepts-table">
                    <CodedSetTable items={this.props.survey.concepts} itemName={'Tag'} />
                  </div>
                </div>
              </div>
              <div className="basic-c-box panel-default">
                <div className="panel-heading">
                  <h2 className="panel-title">
                    <a className="panel-toggle" data-toggle="collapse" href={`#collapse-linked-surveys`}><i className="fa fa-bars" aria-hidden="true"></i>
                    <text className="sr-only">Click link to expand information about linked </text>Linked Sections: {this.props.sections && this.props.sections.length}</a>
                  </h2>
                </div>
                <div className="panel-collapse panel-details collapse" id="collapse-linked-surveys">
                  <div className="box-content panel-body">
                    <SectionList sections={this.props.sections} currentUser={this.props.currentUser} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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

  render() {
    let {survey, sections} = this.props;
    if(!survey || !sections){
      return (
        <div>Loading...</div>
      );
    }
    return (
      <div id={"survey_id_"+survey.id}>
        <div className="showpage_header_container no-print">
          <ul className="list-inline">
            <li className="showpage_button"><span className="fa fa-arrow-left fa-2x" aria-hidden="true" onClick={hashHistory.goBack}></span></li>
            <li className="showpage_title"><h1>Survey Details {survey.status && (<text>[{survey.status.toUpperCase()}]</text>)}</h1></li>
          </ul>
        </div>
        {this.historyBar()}
        {this.mainContent()}
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
  deleteSurvey:  PropTypes.func,
  addPreferred: PropTypes.func,
  removePreferred: PropTypes.func,
  fetchSurvey: PropTypes.func,
  setStats: PropTypes.func,
  addSurveyToGroup: PropTypes.func,
  removeSurveyFromGroup: PropTypes.func,
  updateSurveyTags: PropTypes.func,
  stats: PropTypes.object,
  publishers: publishersProps
};

export default SurveyShow;
