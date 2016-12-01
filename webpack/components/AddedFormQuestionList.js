import React, { Component, PropTypes } from 'react';
//import QuestionWidget from './QuestionWidget';
import QuestionItem from './QuestionItem';
import { remove_question } from '../FormBuild';

export default class AddedFormQuestionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: props.questions,
      response_sets: props.response_sets
    };
  }

  render() {
    return (
      <div className="question-group">
        <div className="row">
          <div className="col-md-1"><b>ID</b></div>
          <div className="col-md-5"><b>Content</b></div>
          <div className="col-md-6"><b>Response Sets</b></div>
        </div>
        {this.state.questions.map((q, i) => {
          // Each List Item Component needs a key attribute for uniqueness:
          // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
          // In addition, we pass in our item data and a handleOnClick function that executes a callback that passes
          // the item value
          // <QuestionWidget key={q.id} question={q} />;
          // If disallowing dupes, can maybe use id as key
          return (
            <div className="row" key={i}>
              <QuestionItem question={q} response_sets={this.state.response_sets} />
              <div className="col-md-3">
                <div className="btn btn-small btn-default" 
                     onClick={() => remove_question( i )}>
                  <b>Remove</b>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

//QuestionList.propTypes = {
//  questions: PropTypes.arrayOf(QuestionWidget.propTypes.question),
//  questions: PropTypes.arrayOf(QuestionWidget.propTypes.question)
//};
