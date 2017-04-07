import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { removeQuestion, reorderQuestion } from '../actions/questions_actions';
import QuestionItem from '../components/QuestionItem';
import _ from 'lodash';

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
        {_.values(this.props.questions).map((q, i) => {
          return (
            <div className="row" key={i}>
              <QuestionItem question={q} responseSets={this.props.responseSets} index={i}
                            removeQuestion={this.props.removeQuestion}
                            handleResponseSetChange={() => {}}
                            reorderQuestion={this.props.reorderQuestion}/>
            </div>
          );
        })}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({removeQuestion, reorderQuestion}, dispatch);
}

function mapStateToProps(state) {
  return {
    questions: state.questions
  };
}

FormsQuestionList.propTypes = {
  questions: React.PropTypes.object,//.isRequired,
  responseSets: React.PropTypes.object, //array.isRequired,
  removeQuestion: React.PropTypes.func.isRequired,
  reorderQuestion: React.PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(FormsQuestionList);
