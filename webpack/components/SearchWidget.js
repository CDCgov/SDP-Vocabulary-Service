import React, { Component, PropTypes } from 'react';
import ResponseSetWidget from './ResponseSetWidget';
import QuestionList from './QuestionList';
import ResponseSetList from './ResponseSetList';
import SearchWidgetBar from './SearchWidgetBar';
import _ from 'lodash';

import _ from 'lodash';

export default class SearchWidget extends Component {
  constructor(props){
    super(props);

    this.state = {
      questions: {},
      responseSets: [],
      allQuestions: props.questions,
      allResponseSets: props.responseSets
    };
  }

  refreshSearch(term, category) {
    var questionsFiltered = {};
    var rsFiltered = [];

    switch (category) {
      case 'Select Category':
        if (term == '') {
          questionsFiltered = this.state.allQuestions;
          rsFiltered = this.state.allResponseSets;
        } else {
          _.values(this.state.allQuestions).map((q) => {
            if (q.content.toLowerCase().includes(term.toLowerCase())){
              questionsFiltered[q.id] = q;
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
          _.values(this.state.allQuestions).map((q) => {
            if (q.content.toLowerCase().includes(term.toLowerCase())){
              questionsFiltered[q.id] = q;
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
        <ResponseSetList responseSets={_.keyBy(this.state.responseSets, 'id')} routes={this.props.routes} />
        <QuestionList questions={this.state.questions} routes={this.props.routes} />
      </div>
    );
  }
}

SearchWidget.propTypes = {
  responseSets: PropTypes.arrayOf(ResponseSetWidget.propTypes.responseSet).isRequired,
  questions: PropTypes.object.isRequired,
  routes: PropTypes.object.isRequired
};
