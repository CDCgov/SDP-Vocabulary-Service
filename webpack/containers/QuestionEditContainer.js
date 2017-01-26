import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchQuestion } from '../actions/questions_actions';
import QuestionForm from '../components/QuestionForm';
import { questionProps } from '../prop-types/question_props';

class QuestionEditContainer extends Component {
  componentWillMount() {
    if(this.props.params.qId){
      this.props.fetchQuestion(this.props.params.qId);
    }
  }

  render() {
    if(!this.props.question){
      return (
        <div>Loading..</div>
      );
    }
    //  <QuestionForm question={this.props.question} questionSubmitter={() => {}} />
    return (
      <div className="container">
        Rendered Test.
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const props = {};
  if(ownProps.params.qId){
    props.question = state.questions[ownProps.params.qId];
  } else {
    props.question = { version: 1 };
  }
  return props;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchQuestion}, dispatch);
}

QuestionEditContainer.propTypes = {
  question: questionProps,
  fetchQuestion: PropTypes.func,
  params: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionEditContainer);
