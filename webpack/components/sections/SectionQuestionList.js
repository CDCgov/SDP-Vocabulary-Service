import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shallowCompare from 'react-addons-shallow-compare';

import { questionProps } from "../../prop-types/question_props";
import SearchResult from '../SearchResult';

class SectionQuestionList extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

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

SectionQuestionList.propTypes = {
  questions: PropTypes.arrayOf(questionProps),
};

export default SectionQuestionList;
