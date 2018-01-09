import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import shallowCompare from 'react-addons-shallow-compare';

import { questionProps } from "../../prop-types/question_props";
import SearchResult from '../SearchResult';
import { updatePDV } from "../../actions/section_actions";

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
          if (q.status === 'published' || q.createdById === this.props.currentUserId) {
            return <SearchResult key={i} type='question' result={{Source: q}} programVar={q.programVar} currentUser={{id: this.props.currentUserId}} updatePDV={this.props.updatePDV}/>;
          }
        })}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({updatePDV}, dispatch);
}

SectionQuestionList.propTypes = {
  questions: PropTypes.arrayOf(questionProps),
  updatePDV: PropTypes.func,
  currentUserId: PropTypes.number
};

export default connect(null, mapDispatchToProps)(SectionQuestionList);
