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
      responseSets: [],
      allQuestions: props.questions,
      allResponseSets: props.responseSets
    };
  }

  refreshSearch(term, category) {
    var questionsFiltered = [];
    var rsFiltered = [];

    switch (category) {
      case 'Select Category':
        if (term == '') {
          questionsFiltered = this.state.allQuestions;
          rsFiltered = this.state.allResponseSets;
        } else {
          this.state.allQuestions.map((q) => {
            if (q.content.toLowerCase().includes(term.toLowerCase())){
              questionsFiltered.push(q);
            }
          });
          this.state.allResponseSets.map((rs) => {
            if (rs.name.toLowerCase().includes(term.toLowerCase())){
              rsFiltered.push(rs);
            }
          });
        }
        break;

      case 'Questions':
        if (term == '') {
          questionsFiltered = this.state.allQuestions;
        } else {
          this.state.allQuestions.map((q) => {
            if (q.content.toLowerCase().includes(term.toLowerCase())){
              questionsFiltered.push(q);
            }
          });
        }
        break;

      case 'Response Sets':
        if (term == '') {
          rsFiltered = this.state.allResponseSets;
        } else {
          this.state.allResponseSets.map((rs) => {
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
      responseSets: rsFiltered
    });
  }

  render() {
    return (
      <div className="search-widget">
        <SearchWidgetBar onSearchTermChange={(term, category) => this.refreshSearch(term, category)} />
        <ResponseSetList responseSets={this.state.responseSets} routes={this.props.routes} />
        <QuestionList questions={this.state.questions} routes={this.props.routes} />
      </div>
    );
  }
}

SearchWidget.propTypes = {
  responseSets: PropTypes.arrayOf(ResponseSetWidget.propTypes.response_set).isRequired,
  questions: PropTypes.arrayOf(QuestionWidget.propTypes.question).isRequired,
  routes: PropTypes.object.isRequired
};