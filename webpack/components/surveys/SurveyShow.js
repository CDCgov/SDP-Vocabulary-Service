import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { hashHistory, Link } from 'react-router';

import VersionInfo from '../VersionInfo';
import PublisherLookUp from "../shared_show/PublisherLookUp";
import GroupLookUp from "../shared_show/GroupLookUp";
import CodedSetTable from "../CodedSetTable";
import { displayVersion } from '../../utilities/componentHelpers';

import { surveyProps } from '../../prop-types/survey_props';
import { sectionProps } from '../../prop-types/section_props';
import currentUserProps from '../../prop-types/current_user_props';
import { publishersProps } from "../../prop-types/publisher_props";

import { isEditable, isRevisable, isPublishable, isExtendable, isGroupable } from '../../utilities/componentHelpers';

class SurveyShow extends Component {
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
        <VersionInfo versionable={this.props.survey} versionableType='survey' currentUserId={this.props.currentUser.id} />
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
          {isGroupable(this.props.survey, this.props.currentUser) &&
            <GroupLookUp item={this.props.survey} addFunc={this.props.addSurveyToGroup} currentUser={this.props.currentUser} />
          }
          {isPublishable(this.props.survey, this.props.currentUser) &&
              <a className="btn btn-default" href="#" onClick={(e) => {
                e.preventDefault();
                this.props.publishSurvey(this.props.survey.id);
                return false;
              }}>Publish</a>
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
              if(confirm('Are you sure you want to delete this Survey? This action cannot be undone.')){
                this.props.deleteSurvey(this.props.survey.id, (response) => {
                  if (response.status == 200) {
                    let stats = Object.assign({}, this.props.stats);
                    stats.surveyCount = this.props.stats.surveyCount - 1;
                    stats.mySurveyCount = this.props.stats.mySurveyCount - 1;
                    this.props.setStats(stats);
                    this.props.router.push('/');
                  }
                });
              }
              return false;
            }}>Delete</a>
          }
          {isExtendable(this.props.survey, this.props.currentUser) &&
            <Link className="btn btn-default" to={`/surveys/${this.props.survey.id}/extend`}>Extend</Link>
          }
          <button className="btn btn-default" onClick={() => window.print()}>Print</button>
          <a className="btn btn-default" href={`/surveys/${this.props.survey.id}/redcap`}>Export to REDCap</a>
        </div>
        <div className="maincontent-details">
          <h1 className="maincontent-item-name"><strong>Name:</strong> {this.props.survey.name} </h1>
          <p className="maincontent-item-info">Version: {this.props.survey.version} - Author: {this.props.survey.userId} </p>
          {this.surveillanceProgram()}
          {this.surveillanceSystem()}
          <div className="basic-c-box panel-default">
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
              <h2 className="panel-title">Tags</h2>
            </div>
            <div className="box-content">
              <div id="concepts-table">
                <CodedSetTable items={this.props.survey.concepts} itemName={'Tag'} />
              </div>
            </div>
          </div>
          {this.props.sections.map((sect,i) =>
            <div key={i} className="basic-c-box panel-default survey-section">
              <div className="panel-heading">
                <h2 className="panel-title"><Link to={`/sections/${sect.id}`}>{ sect.name }</Link></h2>
              </div>
              <div className="box-content">
                <ul>
                  {sect.questions.map((q,i) =>
                    <li key={i}><Link to={`/questions/${q.id}`}>{q.content}</Link></li>
                  )}
                </ul>
              </div>
              <div className="panel-footer survey-section">
                <p>Section version: {displayVersion(sect.version, sect.mostRecentPublished)}</p>
              </div>
            </div>
          )}
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
            <li className="showpage_title"><h1>Survey Details {survey.status === 'draft' && <text>[DRAFT]</text>}</h1></li>
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
  setStats: PropTypes.func,
  addSurveyToGroup: PropTypes.func,
  stats: PropTypes.object,
  publishers: publishersProps
};

export default SurveyShow;
