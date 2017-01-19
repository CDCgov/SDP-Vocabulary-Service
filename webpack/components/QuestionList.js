import React, { Component, PropTypes } from 'react';
import QuestionWidget from './QuestionWidget';
import _ from 'lodash';

class QuestionList extends Component {
  render() {
    return (
      <div className="question-group">
        {_.values(this.props.questions).map((q) => {
          return <QuestionWidget key={q.id} question={q} routes={this.props.routes} />;
        })}
      </div>
    );
  }
}

QuestionList.propTypes = {
  questions: PropTypes.object.isRequired,
  routes: QuestionWidget.propTypes.routes.isRequired
};

export default QuestionList;
