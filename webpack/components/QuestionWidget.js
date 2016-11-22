import React, { Component, PropTypes } from 'react';
var routes = require("../routes.js.erb");
export default class QuestionWidget extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="question-group" id={"question_id_"+this.props.question.id}>
          <div className="panel panel-default">
              <div className="question-container">

                  <ul className="list-inline">
                      <li><a href={routes.question_path(this.props.question)}>{this.props.question.content}</a></li>
                      <li className="pull-right">
                          <a>
                              <span className="glyphicon glyphicon-signal"></span>
                          </a>
                      </li>
                  </ul>
              </div>

              <div className="response-set-details">
                  <ul className="list-inline">
                      <li className="reponse-number panel-toggle" data-toggle="collapse" href={"#collapse"+this.props.question.id}>
                          <span className="glyphicon glyphicon-th-list"></span></li>
                      <li className="pull-right question-menu">
                          <div className="dropdown">
                              <a id={"question_"+this.props.question.id+"_menu"} className="dropdown-toggle" type="" data-toggle="dropdown">
                                  <span className="glyphicon glyphicon-option-horizontal"></span>
                              </a>
                              <ul className="dropdown-menu">
                              <li>
                                <a href={routes.revise_question_path(this.props.question)}>Revise</a>
                              </li>
                              <li>
                                <a href={routes.question_path(this.props.question)}>Details</a>
                              </li>
                                  <li>
                                  <a data-confirm="Are you sure?" rel="nofollow" data-method="delete" href={routes.question_path(this.props.question)}>Delete</a>
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
  question: PropTypes.shape({
    id: PropTypes.number,
    content: PropTypes.string,
    question_type: PropTypes.string
  })
};
