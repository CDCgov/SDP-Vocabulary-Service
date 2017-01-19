import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchQuestions } from '../actions/questions_actions';
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

  render() {
    return (
      <div>
        <QuestionListSearch search={this.search} />
        <QuestionList questions={this.props.questions} routes={Routes} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    questions: state.questions
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchQuestions}, dispatch);
}

// Avoiding a lint error, but if you supply these when you create this class, they will be ignored and overwritten!
QuestionIndexContainer.propTypes = {
  questions: PropTypes.object, //fixme
  fetchQuestions: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionIndexContainer);
