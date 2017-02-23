import React, { Component, PropTypes } from 'react';
import { questionProps } from "../prop-types/question_props";
import VersionInfo from "./VersionInfo";
import moment from 'moment';
import { hashHistory } from 'react-router';

export default class QuestionDetails extends Component {
  render() {
    const {question} = this.props;
    const {responseSets} = this.props;
    if(!question){
      return (<div>Loading...</div>);
    }

    return (
      <div id={"question_id_"+question.id}>
        <div className="showpage_header_container no-print">
          <ul className="list-inline">
            <li className="showpage_button"><span className="fa fa-arrow-left fa-2x" aria-hidden="true" onClick={hashHistory.goBack}></span></li>
            <li className="showpage_title">Question Details</li>
          </ul>
        </div>
        {this.historyBar(question)}
        {this.mainContent(question)}

        <p>
        <strong>Content: </strong>
        { question.content }
        </p>
        <p>
        <strong>Description: </strong>
        { question.description }
        </p>
        <p>
        <strong>Harmonized: </strong>
        { question.harmonized ? 'yes' : 'no' }
        </p>
        <p>
          <strong>Author: </strong>
          { question.createdBy && question.createdBy.email }
        </p>
        <p>
          <strong>Created: </strong>
          { moment(question.createdAt,'').format('MMMM Do YYYY, h:mm:ss a') }
        </p>
        <p>
          <strong>Updated: </strong>
          { question.updatedby && question.updatedby.email }
          { moment(question.updatedAt,'').format('MMMM Do YYYY, h:mm:ss a') }
        </p>
        <p>
          <strong>Primary Response Type: </strong><br/>
            { question.responsetype && question.responsetype.name}
        </p>
        <p>
          <strong>Response Set Names:</strong>
          <br/>
          {responseSets && responseSets.map((rs) => {
            return (
              <span key={rs.id}>
                <a href={`/landing#/responseSets/${rs.id}`}>{rs.name}</a>
                <br/>
              </span>
            );
          })}
        </p>
        <p>
          <strong>Question Type: </strong>
          { question.questionType && question.questionType.name }
        </p>
        <VersionInfo versionable={question} versionableType='Question' />
      </div>
    );
  }

  mainContent(question) {
    return (
      <div className="col-md-9 nopadding maincontent">
        {this.props.currentUser && this.props.currentUser.id && question.mostRecent == question.version &&
          <div className="action_bar no-print">
            <a className="btn btn-default" href={`/landing#/questions/${question.id}/revise`}>Revise</a>
          </div>
        }
      </div>
    );
  }
  historyBar(question) {
    return (
      <div className="col-md-3 nopadding no-print">
        <div className="showpage_sidenav_subtitle">
          <ul className="list-inline">
            <li className="subtitle_icon"><span className="fa fa-history" aria-hidden="true"></span></li>
            <li className="subtitle">History</li>
          </ul>
        </div>
        <VersionInfo versionable={question} versionableType='Question' />
      </div>
    );
  }
}

QuestionDetails.propTypes = {
  question:  questionProps,
  responseSets: PropTypes.array
};
