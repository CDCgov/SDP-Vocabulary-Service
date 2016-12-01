import React, { Component, PropTypes } from 'react';
import QuestionItem from './QuestionItem';
import { add_question } from '../FormBuild';

export default class QuestionList extends Component {

  render() {
    return (
      <div className="question-group">
        <div className="row">
          <div className="col-md-1"><b>ID</b></div>
          <div className="col-md-5"><b>Content</b></div>
          <div className="col-md-6"><b>Response Sets</b></div>
        </div><br/>
        {this.props.questions.map((q, i) => {
          return (
            <div className="row" key={i}>
              <QuestionItem question={q} response_sets={this.props.response_sets} />
              <div className="col-md-3">
                <div className="btn btn-small btn-default"
                     onClick={() => add_question( q )}>
                  <b>Add</b>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
