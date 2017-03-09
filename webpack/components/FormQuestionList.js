import React, { Component, PropTypes } from 'react';
import { questionProps } from "../prop-types/question_props";
import QuestionWidget from './QuestionWidget';

class FormQuestionList extends Component {
  render() {
    return (
      <div className="question-group">
        {this.props.questions.map((q, i) => {
          return <QuestionWidget key={i} question={q} />;
        })}
      </div>
    );
  }
}

FormQuestionList.propTypes = {
  questions: PropTypes.arrayOf(questionProps)
};

export default FormQuestionList;
