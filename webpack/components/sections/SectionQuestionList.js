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
    let currentUserId = this.props.currentUser ? this.props.currentUser.id : -1;
    return (
      <div className="question-group">
        {this.props.questions.map((q, i) => {
          if (q.status === 'published' || q.createdById === currentUserId) {
            return <SearchResult key={i} type='question' result={{Source: q}} programVar={q.programVar} currentUser={this.props.currentUser} updatePDV={this.props.updatePDV}/>;
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
  currentUser: PropTypes.object
};

export default connect(null, mapDispatchToProps)(SectionQuestionList);
