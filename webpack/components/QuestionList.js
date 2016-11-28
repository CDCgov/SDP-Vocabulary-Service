import React, { Component, PropTypes } from 'react';
import QuestionWidget from './QuestionWidget';
export default class QuestionList extends Component {
  constructor(props) {
    super(props);
    this.state = {questions: props.questions};
  }

  render() {
    return (
      <div className="question-group">
        {this.state.questions.map((function(q) {
          // Each List Item Component needs a key attribute for uniqueness:
          // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
          // In addition, we pass in our item data and a handleOnClick function that executes a callback that passes
          // the item value
          return <QuestionWidget key={q.id} question={q} />;
        }))}
      </div>
    );
  }
}

QuestionList.propTypes = {
  questions: PropTypes.arrayOf(QuestionWidget.propTypes.question)
};
