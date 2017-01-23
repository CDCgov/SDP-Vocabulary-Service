import React, { Component, PropTypes } from 'react';
import { questionProps } from "../prop-types/question_props";

export default class QuestionWidget extends Component {
  render() {
    return (
      <div className="question-group" id={"question_id_"+this.props.question.id}>
        <div className="panel panel-default">
          <div className="question-container">
            <ul className="list-inline">
              <li><a href={this.props.routes.questionPath(this.props.question)}>{this.props.question.content}</a></li>
              <li className="pull-right">
                <a>
                  <span className="fa fa-signal"></span>
                </a>
              </li>
            </ul>
          </div>

          <div className="response-set-details">
            <ul className="list-inline">
              <li className="reponse-number panel-toggle" data-toggle="collapse" href={"#collapse"+this.props.question.id}>
                <span className="fa fa-list-ul"></span>
              </li>
              <li className="pull-right question-menu">
                <div className="dropdown">
                  <a id={"question_"+this.props.question.id+"_menu"} className="dropdown-toggle" type="" data-toggle="dropdown">
                    <span className="fa fa-ellipsis-h"></span>
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <a href={this.props.routes.reviseQuestionPath(this.props.question)}>Revise</a>
                    </li>
                    <li>
                      <a href={this.props.routes.questionPath(this.props.question)}>Details</a>
                    </li>
                    <li>
                      <a data-confirm="Are you sure?" rel="nofollow" data-method="delete" href={this.props.routes.questionPath(this.props.question)}>Delete</a>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>

          <div className="panel-collapse panel-details collapse" id={"collapse" + this.props.question.id}>
            <div className="panel-body">
            </div>
          </div>

        </div>
      </div>
    );
  }
}

QuestionWidget.propTypes = {
  question: questionProps,
  routes: PropTypes.shape({
    questionPath: PropTypes.func.isRequired,
    reviseQuestionPath: PropTypes.func.isRequired
  })
};
