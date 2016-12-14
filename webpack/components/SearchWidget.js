import React, { Component, PropTypes } from 'react';
import ResponseSetWidget from './ResponseSetWidget';
import QuestionWidget from './QuestionWidget';
import QuestionList from './QuestionList';
import ResponseSetList from './ResponseSetList';
import SearchWidgetBar from './SearchWidgetBar';

export default class SearchWidget extends Component {
  constructor(props){
    super(props);

    this.state = {
      questions: [],
      response_sets: [],
      all_questions: props.questions,
      all_rs: props.response_sets
    };
  }

  refreshSearch(term, category) {
    var questionsFiltered = [];
    var rsFiltered = [];

    switch (category) {
      case 'Select Category':
        if (term == '') {
          questionsFiltered = this.state.all_questions;
          rsFiltered = this.state.all_rs;
        } else {
          this.state.all_questions.map((q) => {
            if (q.content.toLowerCase().includes(term.toLowerCase())){
              questionsFiltered.push(q);
            }
          });
          this.state.all_rs.map((rs) => {
            if (rs.name.toLowerCase().includes(term.toLowerCase())){
              rsFiltered.push(rs);
            }
          });
        }
        break;

      case 'Questions':
        if (term == '') {
          questionsFiltered = this.state.all_questions;
        } else {
          this.state.all_questions.map((q) => {
            if (q.content.toLowerCase().includes(term.toLowerCase())){
              questionsFiltered.push(q);
            }
          });
        }
        break;

      case 'Response Sets':
        if (term == '') {
          rsFiltered = this.state.all_rs;
        } else {
          this.state.all_rs.map((rs) => {
            if (rs.name.toLowerCase().includes(term.toLowerCase())){
              rsFiltered.push(rs);
            }
          });
        }
        break;

      case 'Forms':
        break;
    }



    this.setState({
      questions: questionsFiltered,
      response_sets: rsFiltered
    });
  }

  render() {
    return (
      <div className="search-widget">
        <SearchWidgetBar onSearchTermChange={(term, category) => this.refreshSearch(term, category)} />
        <ResponseSetList response_sets={this.state.response_sets} routes={this.props.routes} />
        <QuestionList questions={this.state.questions} routes={this.props.routes} />
      </div>
    );
  }
}

SearchWidget.propTypes = {
  response_sets: PropTypes.arrayOf(ResponseSetWidget.propTypes.response_set).isRequired,
  questions: PropTypes.arrayOf(QuestionWidget.propTypes.question).isRequired,
  routes: PropTypes.object.isRequired
};