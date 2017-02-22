import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import currentUserProps from "../prop-types/current_user_props";

export default class SearchResult extends Component {
  render() {
    switch(this.props.type) {
      case 'question':
        return (
          <div>
            {this.questionResult(this.props.result.Source, this.props.result.highlight)}
          </div>
        );
      case 'response_set':
        return (
          <div>
            {this.responseSetResult(this.props.result.Source, this.props.result.highlight)}
          </div>
        );
      case 'form':
        return (
          <div>
            {this.formResult(this.props.result.Source, this.props.result.highlight)}
          </div>
        );
    }
  }

  questionDropdownMenu(question, resultType){
    if(this.props.currentUser && this.props.currentUser.id){
      return (
        <ul className="dropdown-menu">
          <li>
            <Link to={`/${resultType}s/${question.id}/revise`}>Revise</Link>
          </li>
          <li>
            <Link to={`/${resultType}s/${question.id}`}>Details</Link>
          </li>
        </ul>
      );
    }else{
      return (
        <ul className="dropdown-menu">
          <li>
            <Link to={`/${resultType}s/${question.id}`}>Details</Link>
          </li>
        </ul>
      );
    }
  }

  questionResult(result, highlight) {
    return (
      <div className="search-result">
        <div className="search-result-name">
          <text className="search-result-type">Question: </text>
          <Link to={`/questions/${result.id}`}>
            {highlight && highlight.name ? <text dangerouslySetInnerHTML={{__html: highlight.name[0]}} /> : result.name}
          </Link>
          <div className="pull-right question-menu">
            <div className="dropdown">
              <a id={`question_${result.id}_menu`} className="dropdown-toggle" type="" data-toggle="dropdown">
                <span className="fa fa-ellipsis-h"></span>
              </a>
              {this.questionDropdownMenu(result, 'question')}
            </div>
          </div>
        </div>
        <div className="search-result-description">
          {highlight && highlight.description ? <text dangerouslySetInnerHTML={{__html: highlight.description[0]}} /> : result.description}
        </div>
        <div className="search-result-stats">
          <hr/>
          {result.responseSets.length > 0 &&
            <div>
              Linked Response Sets: |{result.responseSets.map((rs) => {
                return(
                  <text key={`response-set-${rs.id}`}>
                    <Link to={`/responseSets/${rs.id}`}> {rs.name}</Link> |
                  </text>
                );
              })}
            </div>
          }
        </div>

        <hr/>
      </div>
    );
  }

  responseSetResult(result, highlight) {
    return (
      <div className="search-result">
        <div className="search-result-name">
          <text className="search-result-type">Response Set: </text>
          <Link to={`/responseSets/${result.id}`}>
            {highlight && highlight.name ? <text dangerouslySetInnerHTML={{__html: highlight.name[0]}} /> : result.name}
          </Link>
          <div className="pull-right response-set-menu">
            <div className="dropdown">
              <a id={`question_${result.id}_menu`} className="dropdown-toggle" type="" data-toggle="dropdown">
                <span className="fa fa-ellipsis-h"></span>
              </a>
              {this.questionDropdownMenu(result, 'responseSet')}
            </div>
          </div>
        </div>
        <div className="search-result-description">
          {highlight && highlight.description ? <text dangerouslySetInnerHTML={{__html: highlight.description[0]}} /> : result.description}
        </div>
        <div className="search-result-stats">
          <hr/>
          {result.questions.length > 0 &&
            <div>
              Linked Questions: |{result.questions.map((q) => {
                return(
                  <text key={`question-${q.id}`}>
                    <Link to={`/questions/${q.id}`}> {q.name}</Link> |
                  </text>
                );
              })}
            </div>
          }
        </div>
        <hr/>
      </div>
    );
  }

  formResult(result, highlight) {
    return (
      <div className="search-result">
        <div className="search-result-name">
          <text className="search-result-type">Form: </text>
          <Link to={`/forms/${result.id}`}>
            {highlight && highlight.name ? <text dangerouslySetInnerHTML={{__html: highlight.name[0]}} /> : result.name}
          </Link>
          <div className="pull-right form-menu">
            <div className="dropdown">
              <a id={`question_${result.id}_menu`} className="dropdown-toggle" type="" data-toggle="dropdown">
                <span className="fa fa-ellipsis-h"></span>
              </a>
              {this.questionDropdownMenu(result, 'form')}
            </div>
          </div>
        </div>
        <div className="search-result-description">
          {highlight && highlight.description ? <text dangerouslySetInnerHTML={{__html: highlight.description[0]}} /> : result.description}
        </div>
        <div className="search-result-stats">
          <hr/>
          {result.questions.length > 0 &&
            <div>
              Questions Used: |{result.questions.map((q) => {
                return(
                  <text key={`question-${q.id}`}>
                    <Link to={`/questions/${q.id}`}> {q.name}</Link> |
                  </text>
                );
              })}
            </div>
          }
        </div>
        <hr/>
      </div>
    );
  }
}

SearchResult.propTypes = {
  type: PropTypes.string,
  currentUser: currentUserProps,
  result: PropTypes.object.isRequired
};
