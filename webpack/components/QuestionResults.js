import React, { Component } from 'react';
import { questionProps } from "../prop-types/question_props";
import { formProps } from "../prop-types/form_props";
import { Link } from 'react-router';

export default class QuestionResults extends Component {
  render() {
    return (
      <div className="question-group">
        <div>
        {this.props.questions.map((question, i) => {
          return (
            <div className="row" key={i}>
              <div data-question-id={question.id}>
                {this.questionResult(question)}
              </div>
            </div>
          );
        })}
        </div>
      </div>
    );
  }
  reviseOrEditLink(question) {
    if (question.status == 'published') {
      return (
        <li>
          <Link to={`/questions/${question.id}/revise`}>Revise</Link>
        </li>
      );
    } else if (question.status == 'draft') {
      return (
        <li>
          <Link to={`/questions/${question.id}/revise`}>Revise</Link>
        </li>
      );
    }
  }
  detailsLink(question) {
    return (
      <li>
        <Link to={`/questions/${question.id}/details`}>Details</Link>
      </li>
    );
  }
  addToFormLink(question) {
    return (
      <li>
      <a id={`add_question_${question.id}_to_form`} onClick={() => this.props.addQuestion(this.props.form, question)}>
        Add to Form
      </a>
      </li>
    );
  }
  questionResult(question) {
    return (
      <div className="search-result">
        <div className="search-result-name">
          <Link to={`/questions/${question.id}`}>
            {question.content}
          </Link>
          <div className="pull-right question-menu">
            <div className="dropdown">
              <a id={`question_${question.id}_menu`} className="dropdown-toggle" type="" data-toggle="dropdown">
                <span className="fa fa-ellipsis-h"></span>
              </a>
              <ul className="dropdown-menu">
                {this.reviseOrEditLink(question)}
                {this.detailsLink(question)}
                {this.addToFormLink(question)}
              </ul>
            </div>
          </div>
        </div>
        <div className="search-result-description">
          {question.description}
        </div>
        <div className="search-result-stats">
          <hr/>
          {question.responseSets.length > 0 &&
            <div>
              Linked Response Sets: |{question.responseSets.map((rs) => {
                return(
                  <text key={`response-set-${rs.id}`}>
                    <Link to={`/responseSets/${rs.id}`}> {rs.name}</Link> |
                  </text>
                );
              })}
            </div>
          }
        </div>
        <hr/>
      </div>
    );
  }
}
QuestionResults.propTypes = {
  form: formProps,
  questions: React.PropTypes.arrayOf(questionProps).isRequired,
  addQuestion: React.PropTypes.func.isRequired
};
