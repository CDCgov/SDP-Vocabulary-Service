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
            {this.responseSetResult(this.props.result.Source, this.props.result.highlight, this.props.handleSelectSearchResult)}
          </div>
        );
      case 'form':
        return (
          <div>
            {this.formResult(this.props.result.Source, this.props.result.highlight, this.props.extraActionName, this.props.extraAction)}
          </div>
        );
      case 'survey':
        return (
          <div>
            {this.surveyResult(this.props.result.Source, this.props.result.highlight)}
          </div>
        );
    }
  }

  isRevisable(source) {
    // Needs concept of source.mostRecent === source.version
    // Currently no way to do this in ES schema
    return source.status === 'published' &&
      (source.createdById || source.createdBy.id) === this.props.currentUser.id;
  }

  isEditable(source) {
    // Needs concept of source.mostRecent === source.version
    return source.status === 'draft' &&
      (source.createdById || source.createdBy.id) === this.props.currentUser.id;
  }

  isExtendable(source) {
    return source.status === 'published';
  }

  resultDropdownMenu(result, resultType, extraActionName, extraAction){
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
        {extraActionName && extraAction &&       <li>
      <a className="menu-action" id={`action_for_${result.id}`} onClick={() => extraAction()}>
        {extraActionName}
      </a>
      </li>}
      </ul>
    );
  }

  questionResult(result, highlight) {
    return (
      <div className="u-result-group">
        <div className="u-result" id={`question_id_${result.id}`}>
          <div className="u-result-container">
            <ul className="u-result-content">
              <li className="u-result-content-item">
                <div className="u-result-details result__question">
                  <div className="result">
                    <ul className="list-inline result-type-wrapper">
                      <li className="result-type-icon"><span className="fa fa-tasks fa-2x" aria-hidden="true"></span></li>
                      <li className="result-name">
                        <Link to={`/questions/${result.id}`}>
                          {highlight && highlight.name ? <text dangerouslySetInnerHTML={{__html: highlight.name[0]}} /> : result.name}
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="result-description">
                    {highlight && highlight.description ? <text dangerouslySetInnerHTML={{__html: highlight.description[0]}} /> : result.description}
                  </div>
                  <div className="result-analytics">
                    <ul className="list-inline">
                      <li className="result-analytics-item">
                        <span className="item-value">30</span>
                        <p className="item-description">programs</p>
                      </li>
                      <li className="result-analytics-item">
                        <span className="item-value">10</span>
                        <p className="item-description">systems</p>
                      </li>
                      <li className="result-analytics-item">
                        <span className="fa fa-check-square-o fa-lg item-status-published" aria-hidden="true"></span>
                        <p className="item-description">published</p>
                      </li>
                      <li className="result-timestamp pull-right"><p>april 7</p><p>version 12 | question</p></li>
                    </ul>
                  </div>
                </div>
                <div className="result-linked-details">
                  <ul className="list-inline result-linked-item associated__responseset">
                    <li className="result-linked-number">
                      {result.responseSets.length > 0 &&
                        <div>
                          Linked Response Sets: |{result.responseSets.map((rs, i) => {
                            return(
                              <text key={`response-set-${rs.id}-${i}`}>
                                <Link to={`/responseSets/${rs.id}`}> {rs.name}</Link> |
                              </text>
                            );
                          })}
                        </div>
                      }
                    </li>
                  </ul>
                </div>
              </li>
              <li className="u-result-content-item result-nav">
                <div className="result-nav-item"><i className="fa fa-signal fa-lg" aria-hidden="true"></i></div>
                <div className="result-nav-item"><i className="fa fa-eye fa-lg" aria-hidden="true"></i></div>
                <div className="result-nav-item">
                  <div className="dropdown">
                    <a id={`question_${result.id}_menu`} className="dropdown-toggle" type="" data-toggle="dropdown">
                      <span className="fa fa-ellipsis-h"></span>
                    </a>
                    {this.resultDropdownMenu(result, 'question')}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  selectResultButton(result, handleSelectSearchResult) {
    return (
      <a title="Select Search Result" href="#" id={`select-${result.name}`} onClick={(e) => {
        e.preventDefault();
        handleSelectSearchResult(result);
      }}><i className="fa fa-plus-square fa-2x"></i></a>
    );
  }

  responseSetResult(result, highlight, handleSelectSearchResult) {
    return (
      <div className="search-result" id={`response_set_id_${result.id}`}>
        <div className="u-result-group">
          <div className="u-result">
            <div className="u-result-container">
              <ul className="u-result-content">
                <li className="u-result-content-item">
                  <div className="u-result-details result__responseset">
                    <div className="result">
                      <ul className="list-inline result-type-wrapper">
                        <li className="result-type-icon"><span className="fa fa-list fa-2x" aria-hidden="true"></span></li>
                        <li className="result-name">
                          <Link to={`/responseSets/${result.id}`}>
                            {highlight && highlight.name ? <text dangerouslySetInnerHTML={{__html: highlight.name[0]}} /> : result.name}
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className="result-description">
                      {highlight && highlight.description ? <text dangerouslySetInnerHTML={{__html: highlight.description[0]}} /> : result.description}
                    </div>
                    <div className="result-analytics">
                      <ul className="list-inline">
                        <li className="result-analytics-item">
                          <span className="item-value">30</span>
                          <p className="item-description">programs</p>
                        </li>
                        <li className="result-analytics-item">
                          <span className="item-value">10</span>
                          <p className="item-description">systems</p>
                        </li>
                        <li className="result-analytics-item">
                          <span className="fa fa-check-square-o fa-lg item-status-published" aria-hidden="true"></span>
                          <p className="item-description">published</p>
                        </li>
                        <li className="result-timestamp pull-right"><p>april 7</p><p>version 12 | response set</p></li>
                      </ul>
                    </div>
                  </div>
                  <div className="result-linked-details">
                    <ul className="list-inline result-linked-item associated__question">
                      <li className="result-linked-number">
                        {result.questions.length > 0 &&
                          <div>
                            Linked Questions: |{result.questions.map((q, i) => {
                              return(
                                <text key={`question-${q.id}-${i}`}>
                                  <Link to={`/questions/${q.id}`}> {q.name}</Link> |
                                </text>
                              );
                            })}
                          </div>
                        }
                      </li>
                    </ul>
                  </div>
                </li>
                <li className="u-result-content-item result-nav">
                  <div className="result-nav-item"><i className="fa fa-signal fa-lg" aria-hidden="true"></i></div>
                  <div className="result-nav-item"><i className="fa fa-eye fa-lg" aria-hidden="true"></i></div>
                  <div className="result-nav-item">
                    {handleSelectSearchResult ? (
                      this.selectResultButton(result, handleSelectSearchResult)
                    ) : (
                      <div className="dropdown">
                        <a id={`response_set_${result.id}_menu`} className="dropdown-toggle" type="" data-toggle="dropdown">
                          <span className="fa fa-ellipsis-h"></span>
                        </a>
                        {this.resultDropdownMenu(result, 'responseSet')}
                      </div>
                    )}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  formResult(result, highlight, actionName, action) {
    return (
      <div className="u-result-group">
        <div className="u-result" id={`form_id_${result.id}`}>
          <div className="u-result-container">
            <ul className="u-result-content">
              <li className="u-result-content-item">
                <div className="u-result-details result__form">
                  <div className="result">
                    <ul className="list-inline result-type-wrapper">
                      <li className="result-type-icon"><span className="fa fa-clipboard fa-2x" aria-hidden="true"></span></li>
                      <li className="result-name">
                        <Link to={`/forms/${result.id}`}>
                          {highlight && highlight.name ? <text dangerouslySetInnerHTML={{__html: highlight.name[0]}} /> : result.name}
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="result-description">
                    {highlight && highlight.description ? <text dangerouslySetInnerHTML={{__html: highlight.description[0]}} /> : result.description}
                  </div>
                  <div className="result-analytics">
                    <ul className="list-inline">
                      <li className="result-analytics-item">
                        <span className="item-value">30</span>
                        <p className="item-description">programs</p>
                      </li>
                      <li className="result-analytics-item">
                        <span className="item-value">10</span>
                        <p className="item-description">systems</p>
                      </li>
                      <li className="result-analytics-item">
                        <span className="fa fa-check-square-o fa-lg item-status-published" aria-hidden="true"></span>
                        <p className="item-description">published</p>
                      </li>
                      <li className="result-timestamp pull-right"><p>april 7</p><p>version 12 | form</p></li>
                    </ul>
                  </div>
                </div>
                <div className="result-linked-details">
                  <ul className="list-inline result-linked-item associated__question">
                    <li className="result-linked-number">
                      {result.questions && result.questions > 0 && result.questions.map((q, i) => {
                        return(
                          <text key={`question-${q.id}-${i}`}>
                            <Link to={`/questions/${q.id}`}> {q.name}</Link> |
                          </text>
                        );
                      })}
                    </li>
                  </ul>
                </div>
              </li>
              <li className="u-result-content-item result-nav">
                <div className="result-nav-item"><i className="fa fa-signal fa-lg" aria-hidden="true"></i></div>
                <div className="result-nav-item"><i className="fa fa-eye fa-lg" aria-hidden="true"></i></div>
                <div className="result-nav-item">
                  <div className="dropdown">
                    <a id={`form_${result.id}_menu`} className="dropdown-toggle" type="" data-toggle="dropdown">
                      <span className="fa fa-ellipsis-h"></span>
                    </a>
                    {this.resultDropdownMenu(result, 'form')}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  surveyResult(result, highlight) {
    return (
      <div className="search-result" id={`survey_id_${result.id}`}>
        <div className="search-result-name">
          <text className="search-result-type">Survey: </text>
          <Link to={`/surveys/${result.id}`}>
            {highlight && highlight.name ? <text dangerouslySetInnerHTML={{__html: highlight.name[0]}} /> : result.name}
          </Link>
          <div className="pull-right survey-menu">
            <div className="dropdown">
              <a id={`survey_${result.id}_menu`} className="dropdown-toggle" type="" data-toggle="dropdown">
                <span className="fa fa-ellipsis-h"></span>
              </a>
              {this.resultDropdownMenu(result, 'survey')}
            </div>
          </div>
        </div>
        <div className="search-result-description">
          {highlight && highlight.description ? <text dangerouslySetInnerHTML={{__html: highlight.description[0]}} /> : result.description}
        </div>
        <div className="search-result-stats">
          <hr/>
        </div>
      </div>
    );
  }
}

SearchResult.propTypes = {
  type: PropTypes.string,
  currentUser: currentUserProps,
  result: PropTypes.object.isRequired,
  handleSelectSearchResult: PropTypes.func,
  extraActionName: PropTypes.string,
  extraAction: PropTypes.func
};
