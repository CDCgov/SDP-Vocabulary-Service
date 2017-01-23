import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchQuestions } from '../actions/questions_actions';
import { questionsProps } from "../prop-types/question_props";
import currentUserProps from "../prop-types/current_user_props";
import Routes from "../routes";
import QuestionList from '../components/QuestionList';
import QuestionListSearch from '../components/QuestionListSearch';

class QuestionIndexContainer extends Component {
  constructor(props){
    super(props);
    this.search = this.search.bind(this);
  }

  componentWillMount() {
    this.props.fetchQuestions();
  }

  search(searchTerms){
    this.props.fetchQuestions(searchTerms);
  }

  newQuestionButton(){
    if(this.props.currentUser && this.props.currentUser.id){
      return(<a className="btn btn-default" href={Routes.new_question_path()}>New Question</a>);
    }
  }

  render() {
    return (
      <div className='row basic-bg'>
        <div className='col-md-12'>
          <QuestionListSearch search={this.search} />
          <QuestionList questions={this.props.questions} routes={Routes} />
          {this.newQuestionButton()}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    questions: state.questions,
    currentUser: state.currentUser
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchQuestions}, dispatch);
}

// Avoiding a lint error, but if you supply these when you create this class, they will be ignored and overwritten!
QuestionIndexContainer.propTypes = {
  questions: questionsProps,
  currentUser: currentUserProps,
  fetchQuestions: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionIndexContainer);
