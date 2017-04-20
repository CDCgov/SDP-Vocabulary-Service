import React, { Component, PropTypes } from 'react';
import { questionProps } from "../prop-types/question_props";
import SearchResult from './SearchResult';

class FormQuestionList extends Component {
  render() {
    if(!this.props.questions){
      return (
        <div>Loading...</div>
      );
    }
    return (
      <div className="question-group">
        {this.props.questions.map((q, i) => {
          return <SearchResult key={i} type='question' result={{Source: q}} programVar={q.programVar} currentUser={{id: -1}} />;
        })}
      </div>
    );
  }
}

FormQuestionList.propTypes = {
  questions: PropTypes.arrayOf(questionProps),
};

export default FormQuestionList;
