import React, { Component, PropTypes } from 'react';
import QuestionWidget from './QuestionWidget';

class QuestionList extends Component {
  render() {
    return (
      <div className="question-group">
        {this.props.questions.map((q) => {
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

export default QuestionList;
