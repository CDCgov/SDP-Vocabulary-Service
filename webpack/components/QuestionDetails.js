import React, { Component } from 'react';
import PropTypes from 'prop-types';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import { hashHistory, Link } from 'react-router';

import VersionInfo from "./VersionInfo";
import ResponseSetList from "./response_sets/ResponseSetList";
import CodedSetTable from "./CodedSetTable";
import ProgramsAndSystems from "./shared_show/ProgramsAndSystems";
import PublisherLookUp from "./shared_show/PublisherLookUp";

import { questionProps } from "../prop-types/question_props";
import currentUserProps from "../prop-types/current_user_props";
import { publishersProps } from "../prop-types/publisher_props";

import { isEditable, isRevisable, isPublishable, isExtendable } from '../utilities/componentHelpers';

export default class QuestionDetails extends Component {
  render() {
    const {question} = this.props;
    if(question === undefined || question.content === undefined){
      return (<div>Loading...</div>);
    }

    return (
      <div id={"question_id_"+question.id}>
        <div className="showpage_header_container no-print">
          <ul className="list-inline">
            <li className="showpage_button"><span className="fa fa-arrow-left fa-2x" aria-hidden="true" onClick={hashHistory.goBack}></span></li>
            <li className="showpage_title"><h1>Question Details {question.status === 'draft' && <text>[DRAFT]</text>}</h1></li>
          </ul>
        </div>
        {this.historyBar(question)}
        {this.mainContent(question)}
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

  mainContent(question) {
    return (
      <div className="col-md-9 nopadding maincontent">
        {this.props.currentUser && this.props.currentUser.id && question.mostRecent == question.version &&
          <div className="action_bar no-print">
            {isEditable(question, this.props.currentUser) &&
              <PublisherLookUp publishers={this.props.publishers}
                             itemType="Question" />
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
            {isPublishable(question, this.props.currentUser) &&
              <button className="btn btn-primary" onClick={() => this.props.handlePublish(question) }>Publish</button>
            }
            {isEditable(question, this.props.currentUser) &&
              <a className="btn btn-default" href="#" onClick={(e) => {
                e.preventDefault();
                if(confirm('Are you sure you want to delete this Question? This action cannot be undone.')){
                  this.props.deleteQuestion(question.id, (response) => {
                    if (response.status == 200) {
                      let stats = Object.assign({}, this.props.stats);
                      stats.questionCount = this.props.stats.questionCount - 1;
                      stats.myQuestionCount = this.props.stats.myQuestionCount - 1;
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
          <h1 className="maincontent-item-name"><strong>Name:</strong> {question.content} </h1>
          <p className="maincontent-item-info">Version: {question.version} - Author: {question.createdBy && question.createdBy.email} </p>
          <div className="basic-c-box panel-default">
            <div className="panel-heading">
              <h2 className="panel-title">Details</h2>
            </div>
            <div className="box-content">
              <strong>Description: </strong>
              {question.description}
            </div>
            <div className="box-content">
              <strong>Created: </strong>
              { format(parse(question.createdAt,''), 'MMMM Do YYYY, h:mm:ss a') }
            </div>
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
            {question.questionType && <div className="box-content">
              <strong>Question Type: </strong>
              {question.questionType.name && question.questionType.name}
            </div>}
            {question.responseType && <div className="box-content">
              <strong>Response Type: </strong>
              {question.responseType.name && question.responseType.name}
            </div>}
            {question.responseType && question.responseType.code === 'choice' && <div className="box-content">
              <strong>Other Allowed: </strong>
              {question.otherAllowed ? 'Yes' : 'No' }
            </div>}
          </div>
            <div className="basic-c-box panel-default">
              <div className="panel-heading">
                <h2 className="panel-title">Tags</h2>
              </div>
              <div className="box-content">
                <div id="concepts-table">
                  <CodedSetTable items={question.concepts} itemName={'Tag'} />
                </div>
              </div>
            </div>
          {question.responseSets && question.responseSets.length > 0 &&
            <div className="basic-c-box panel-default">
              <div className="panel-heading">
                <h2 className="panel-title">Linked Response Sets</h2>
              </div>
              <div className="box-content">
                <ResponseSetList responseSets={question.responseSets} />
              </div>
            </div>
          }
          {question.status === 'published' &&
            <ProgramsAndSystems item={question} />
          }
        </div>
      </div>
    );
  }

  historyBar(question) {
    return (
      <div className="col-md-3 nopadding no-print">
        <h2 className="showpage_sidenav_subtitle">
          <text className="sr-only">Version History Navigation Links</text>
          <ul className="list-inline">
            <li className="subtitle_icon"><span className="fa fa-history" aria-hidden="true"></span></li>
            <li className="subtitle">History</li>
          </ul>
        </h2>
        <VersionInfo versionable={question} versionableType='Question' />
      </div>
    );
  }
}

QuestionDetails.propTypes = {
  question:  questionProps,
  currentUser:   currentUserProps,
  router: PropTypes.object,
  handlePublish:  PropTypes.func,
  deleteQuestion: PropTypes.func,
  setStats: PropTypes.func,
  stats: PropTypes.object,
  publishers: publishersProps
};
