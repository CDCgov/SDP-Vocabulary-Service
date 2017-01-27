import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { addQuestion } from '../actions/questions_actions';

import QuestionResults from '../components/QuestionResults';
import SearchBar from '../components/SearchBar';
import _ from 'lodash';

class QuestionSearchContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      questions: props.allQs,
      responseSets: props.allRs,
      allQs: props.allQs
    };
  }

  questionFilter(term) {
    var questionsFiltered = [];

    if (term == '') {
      questionsFiltered = this.state.allQs;
    } else {
      this.state.allQs.map((q) => {
        if (q.content.toLowerCase().includes(term.toLowerCase())){
          questionsFiltered.push(q);
        }
      });
    }

    this.setState({
      questions: questionsFiltered
    });
  }

  render() {
    return (
            <div>
                <SearchBar onSearchTermChange={term => this.questionFilter(term)} />
                <QuestionResults questions={this.state.questions} responseSets={_.values(this.state.responseSets)}
                                 addQuestion={this.props.addQuestion} />
            </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({addQuestion}, dispatch);
}

QuestionSearchContainer.propTypes = {
  allQs: React.PropTypes.array,
  allRs: React.PropTypes.array,
  addQuestion: React.PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(QuestionSearchContainer);
