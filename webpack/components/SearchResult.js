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

  questionDropdownMenu(question){
    if(this.props.currentUser && this.props.currentUser.id){
      return (
        <ul className="dropdown-menu">
          <li>
            <Link to={`/questions/${question.id}/revise`}>Revise</Link>
          </li>
          <li>
            <Link to={`/questions/${question.id}`}>Details</Link>
          </li>
        </ul>
      );
    }else{
      return (
        <ul className="dropdown-menu">
          <li>
            <Link to={`/questions/${question.id}`}>Details</Link>
          </li>
        </ul>
      );
    }
  }

  questionResult(result, highlight) {
    return (
      <div className="search-result">
        <div className="search-result-name">
          <Link to={`/questions/${result.id}`}>
            <strong>Question: </strong>
            {highlight && highlight.name ? highlight.name[0] : result.name}
          </Link>
          <div className="pull-right question-menu">
            <div className="dropdown">
              <a id={`question_${result.id}_menu`} className="dropdown-toggle" type="" data-toggle="dropdown">
                <span className="fa fa-ellipsis-h"></span>
              </a>
              {this.questionDropdownMenu(result)}
            </div>
          </div>
        </div>
        <div className="search-result-description">
          {result.description && result.description}
        </div>
        <div className="search-result-stats">
          <hr/>
          <div>
            Response Sets:
          </div>
        </div>

        <hr/>
      </div>
    );
  }

  responseSetResult(result, highlight) {
    return (
      <div className="search-result">
        <div className="search-result-name">
          <Link to={`/responseSets/${result.id}`}>
            <strong>Response Set: </strong>
            {highlight && highlight.name ? highlight.name[0] : result.name}
          </Link>
        </div>
        <div className="search-result-description">
          {result.description && result.description}
        </div>
        <div className="search-result-stats">
        </div>
        <hr/>
      </div>
    );
  }

  formResult(result, highlight) {
    return (
      <div className="search-result">
        <div className="search-result-name">
          <Link to={`/forms/${result.id}`}>
            <strong>Form: </strong>
            {highlight && highlight.name ? highlight.name[0] : result.name}
          </Link>
        </div>
        <div className="search-result-description">
          {result.description && result.description}
        </div>
        <div className="search-result-stats">
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
