import React, { Component, PropTypes } from 'react';
import { questionsProps } from "../prop-types/question_props";
import { responseSetsProps } from "../prop-types/response_set_props";
import QuestionList from './QuestionList';
import ResponseSetList from './ResponseSetList';
import SearchWidgetBar from './SearchWidgetBar';
import _ from 'lodash';

export default class SearchWidget extends Component {
  constructor(props){
    super(props);

    this.state = {
      questions: {},
      responseSets: {},
      allQuestions: props.questions,
      allResponseSets: props.responseSets
    };
  }

  refreshSearch(term, category) {
    var questionsFiltered = {};
    var rsFiltered = {};

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
          _.values(this.state.allResponseSets).map((rs) => {
            if (rs.name.toLowerCase().includes(term.toLowerCase())){
              rsFiltered[rs.id]=rs;
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
          _.values(this.state.allResponseSets).map((rs) => {
            if (rs.name.toLowerCase().includes(term.toLowerCase())){
              rsFiltered[rs.id]=rs;
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
  responseSets: responseSetsProps,
  questions: questionsProps,
  routes: PropTypes.object.isRequired
};
