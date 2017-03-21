/* eslint react/no-danger: 0 */

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

  isRevisable(source) {
    // Needs concept of source.mostRecent === source.version
    // Currently no way to do this in ES schema
    return source.status === 'published' &&
      source.createdBy.id === this.props.currentUser.id;
  }

  isEditable(source) {
    // Needs concept of source.mostRecent === source.version
    return source.status === 'draft' &&
      source.createdBy.id === this.props.currentUser.id;
  }

  isExtendable(source) {
    return source.status === 'published';
  }

  resultDropdownMenu(result, resultType){
    return (
      <ul className="dropdown-menu dropdown-menu-right">
        {this.isRevisable(result) && <li>
          <Link to={`/${resultType}s/${result.id}/revise`}>Revise</Link>
        </li>}
        {this.isEditable(result) && <li>
          <Link to={`/${resultType}s/${result.id}/edit`}>Edit</Link>
        </li>}
        {this.isExtendable(result) && <li>
          <Link to={`/${resultType}s/${result.id}/extend`}>Extend</Link>
        </li>}
        <li>
          <Link to={`/${resultType}s/${result.id}`}>Details</Link>
        </li>
      </ul>
    );
  }

  questionResult(result, highlight) {
    return (
      <div className="search-result" id={`question_id_${result.id}`}>
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
              {this.resultDropdownMenu(result, 'question')}
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
      <div className="search-result" id={`response_set_id_${result.id}`}>
        <div className="search-result-name">
          <text className="search-result-type">Response Set: </text>
          <Link to={`/responseSets/${result.id}`}>
            {highlight && highlight.name ? <text dangerouslySetInnerHTML={{__html: highlight.name[0]}} /> : result.name}
          </Link>
          <div className="pull-right response-set-menu">
            <div className="dropdown">
              <a id={`response_set_${result.id}_menu`} className="dropdown-toggle" type="" data-toggle="dropdown">
                <span className="fa fa-ellipsis-h"></span>
              </a>
              {this.resultDropdownMenu(result, 'responseSet')}
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
      <div className="search-result" id={`form_id_${result.id}`}>
        <div className="search-result-name">
          <text className="search-result-type">Form: </text>
          <Link to={`/forms/${result.id}`}>
            {highlight && highlight.name ? <text dangerouslySetInnerHTML={{__html: highlight.name[0]}} /> : result.name}
          </Link>
          <div className="pull-right form-menu">
            <div className="dropdown">
              <a id={`form_${result.id}_menu`} className="dropdown-toggle" type="" data-toggle="dropdown">
                <span className="fa fa-ellipsis-h"></span>
              </a>
              {this.resultDropdownMenu(result, 'form')}
            </div>
          </div>
        </div>
        <div className="search-result-description">
          {highlight && highlight.description ? <text dangerouslySetInnerHTML={{__html: highlight.description[0]}} /> : result.description}
        </div>
        <div className="search-result-stats">
          <hr/>
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
