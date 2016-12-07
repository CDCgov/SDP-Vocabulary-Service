import React, { Component } from 'react';

export default class QuestionResults extends Component {
  render() {
    return (
      <div className="question-group">
        <div className="row">
          <div className="col-md-1"><b>ID</b></div>
          <div className="col-md-11"><b>Content</b></div>
        </div><br/>
        {this.props.questions.map((question, i) => {
          return (
            <div className="row" key={i}>
              <div data-question-id={question.id}>
                <div className="col-md-8" name="question_content" >{question.content}</div>
                <div className="col-md-3">
                  <div id={"question_"+question.id+"_add"} className="btn btn-small btn-default"
                       onClick={() => this.props.addQuestion(question)}>
                    <b>Add</b>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

QuestionResults.propTypes = {
  questions: React.PropTypes.array.isRequired,
  addQuestion: React.PropTypes.func.isRequired
};
