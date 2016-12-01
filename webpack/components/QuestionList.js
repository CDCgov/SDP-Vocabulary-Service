import React, { Component, PropTypes } from 'react';
import QuestionWidget from './QuestionWidget';

export default class QuestionList extends Component {
  render() {
    return (
      <div className="question-group">
        {this.props.questions.map((q) => {
          // Each List Item Component needs a key attribute for uniqueness:
          // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
          // In addition, we pass in our item data and a handleOnClick function that executes a callback that passes
          // the item value
          return <QuestionWidget key={q.id} question={q} routes={this.props.routes} />;
        })}
      </div>
    );
  }
}

QuestionList.propTypes = {
  questions: PropTypes.arrayOf(QuestionWidget.propTypes.question).isRequired,
  routes: QuestionWidget.propTypes.routes.isRequired
};