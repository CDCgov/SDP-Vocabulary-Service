import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { removeQuestion } from '../actions/question';

import QuestionItem from './QuestionItem';

class FormsQuestionList extends Component {
  render() {
    return (
      <div className="question-group">
        <div className="row">
          <div className="col-md-1"><b>ID</b></div>
            <div>
              <div className="col-md-5"><b>Content</b></div>
              <div className="col-md-6"><b>Response Sets</b></div>
            </div>
        </div><br/>
        {this.props.questions.map((q, i) => {
          return (
            <div className="row" key={i}>
              <QuestionItem question={q} responseSets={this.props.responseSets} index={i}
                            removeQuestion={this.props.removeQuestion}/>
            </div>
          );
        })}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({removeQuestion}, dispatch);
}

function mapStateToProps(state) {
  return {
    questions: state.questions
  };
}

FormsQuestionList.propTypes = {
  questions: React.PropTypes.array.isRequired,
  responseSets: React.PropTypes.array.isRequired,
  removeQuestion: React.PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(FormsQuestionList);
