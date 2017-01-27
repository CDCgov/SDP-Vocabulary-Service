import React, { Component, PropTypes } from 'react';
import { questionProps } from "../prop-types/question_props";
import VersionInfo from "./VersionInfo";
import moment from 'moment';

export default class QuestionDetails extends Component {
  render() {
    const {question} = this.props;
    const {responseSets} = this.props;
    return (
      <div className="panel">
        <p>
        <strong>Content: </strong>
        { question.content }
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
}

QuestionDetails.propTypes = {
  question:  questionProps,
  responseSets: PropTypes.array
};
