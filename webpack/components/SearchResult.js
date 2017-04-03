/* eslint react/no-danger: 0 */

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
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

  resultDropdownMenu(result, resultType, extraActionName, extraAction) {
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

  resultStatus(status) {
    if(status === 'published') {
      return(
        <li className="result-analytics-item">
          <span className="fa fa-check-square-o fa-lg item-status-published" aria-hidden="true"></span>
          <p className="item-description">published</p>
        </li>
      );
    } else if (status === 'draft') {
      return(
        <li className="result-analytics-item">
          <span className="fa fa-pencil fa-lg item-status-draft" aria-hidden="true"></span>
          <p className="item-description">draft</p>
        </li>
      );
    }
  }

  programsInfo(result) {
    return (
      <li className="result-analytics-item">
        <span className="item-value">{result.programsCount}</span>
        <p className="item-description">programs</p>
      </li>
    );
  }

  systemsInfo(result) {
    return (
      <li className="result-analytics-item">
        <span className="item-value">{result.systemsCount}</span>
        <p className="item-description">systems</p>
      </li>
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
                      {result.programsCount && this.programsInfo(result)}
                      {result.systemsCount && this.systemsInfo(result)}
                      {result.status && this.resultStatus(result.status)}
                      <li className="result-timestamp pull-right"><p>{ moment(result.createdAt,'').format('MMMM Do, YYYY') }</p><p>version {result.version && result.version} | question</p></li>
                    </ul>
                  </div>
                </div>
                <div className="result-linked-details">
                  <ul className="list-inline result-linked-number result-linked-item associated__responseset">
                    <li><a className="panel-toggle" data-toggle="collapse" href={`#collapse-${result.id}-question`}><i className="fa fa-bars" aria-hidden="true"></i>Linked Response Sets: {result.responseSets && result.responseSets.length}</a></li>
                  </ul>
                </div>
              </li>
              <li className="u-result-content-item result-nav">
                <div className="result-nav-item"><i className="fa fa-signal fa-lg" aria-hidden="true"></i></div>
                <div className="result-nav-item"><Link to={`/questions/${result.id}`}><i className="fa fa-eye fa-lg" aria-hidden="true"></i></Link></div>
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
          <div className="panel-collapse panel-details collapse" id={`collapse-${result.id}-question`}>
            <div className="panel-body">
              {result.responseSets && result.responseSets.length > 0 &&
                result.responseSets.map((rs, i) => {
                  return(
                    <div key={`response-set-${rs.id}-${i}`} className="result-details-content">
                      <Link to={`/responseSets/${rs.id}`}>{rs.name}</Link>
                    </div>
                  );
                })
              }
            </div>
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
                        {result.programsCount && this.programsInfo(result)}
                        {result.systemsCount && this.systemsInfo(result)}
                        {result.status && this.resultStatus(result.status)}
                        <li className="result-timestamp pull-right"><p>{ moment(result.createdAt,'').format('MMMM Do, YYYY') }</p><p>version {result.version && result.version} | response set</p></li>
                      </ul>
                    </div>
                  </div>
                  <div className="result-linked-details">
                    <ul className="list-inline result-linked-number result-linked-item associated__question">
                      <li><a className="panel-toggle" data-toggle="collapse" href={`#collapse-${result.id}-rs`}><i className="fa fa-bars" aria-hidden="true"></i>Responses: {result.codes && result.codes.length}</a></li>
                    </ul>
                  </div>
                </li>
                <li className="u-result-content-item result-nav">
                  <div className="result-nav-item"><i className="fa fa-signal fa-lg" aria-hidden="true"></i></div>
                  <div className="result-nav-item"><Link to={`/responseSets/${result.id}`}><i className="fa fa-eye fa-lg" aria-hidden="true"></i></Link></div>
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
            <div className="panel-collapse panel-details collapse" id={`collapse-${result.id}-rs`}>
              <div className="panel-body">
                {result.codes && result.codes.length > 0 &&
                  result.codes.map((c, i) => {
                    return(
                      <div key={`response-${c.id}-${i}`} className="result-details-content">
                        {`${i+1}. ${c.displayName ? c.displayName : c.code}`}
                      </div>
                    );
                  })
                }
              </div>
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
                      {result.programsCount && this.programsInfo(result)}
                      {result.systemsCount && this.systemsInfo(result)}
                      {result.status && this.resultStatus(result.status)}
                      <li className="result-timestamp pull-right"><p>{ moment(result.createdAt,'').format('MMMM Do, YYYY') }</p><p>version {result.version && result.version} | form</p></li>
                    </ul>
                  </div>
                </div>
                <div className="result-linked-details">
                  <ul className="list-inline result-linked-number result-linked-item associated__question">
                    <li><a className="panel-toggle" data-toggle="collapse" href={`#collapse-${result.id}-form`}><i className="fa fa-bars" aria-hidden="true"></i>Questions: {result.questions && result.questions.length}</a></li>
                  </ul>
                </div>
              </li>
              <li className="u-result-content-item result-nav">
                <div className="result-nav-item"><i className="fa fa-signal fa-lg" aria-hidden="true"></i></div>
                <div className="result-nav-item"><Link to={`/forms/${result.id}`}><i className="fa fa-eye fa-lg" aria-hidden="true"></i></Link></div>
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
          <div className="panel-collapse panel-details collapse" id={`collapse-${result.id}-form`}>
            <div className="panel-body">
              {result.questions && result.questions.length > 0 &&
                result.questions.map((q, i) => {
                  return(
                    <div key={`question-${q.id}-${i}`} className="result-details-content">
                      <text>
                        <Link to={`/questions/${q.id}`}> {q.name}</Link>
                      </text>
                    </div>
                  );
                })
              }
            </div>
          </div>
        </div>
      </div>
    );
  }

  surveyResult(result, highlight) {
    return (
      <div className="u-result-group">
        <div className="u-result" id={`survey_id_${result.id}`}>
          <div className="u-result-container">
            <ul className="u-result-content">
              <li className="u-result-content-item">
                <div className="u-result-details result__survey">
                  <div className="result">
                    <ul className="list-inline result-type-wrapper">
                      <li className="result-type-icon"><span className="fa fa-clipboard fa-2x" aria-hidden="true"></span></li>
                      <li className="result-name">
                        <Link to={`/surveys/${result.id}`}>
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
                      {result.programsCount && this.programsInfo(result)}
                      {result.systemsCount && this.systemsInfo(result)}
                      {result.status && this.resultStatus(result.status)}
                      <li className="result-timestamp pull-right"><p>{ result.createdAt && moment(result.createdAt,'').format('MMMM Do, YYYY') }</p><p>version {result.version && result.version} | survey</p></li>
                    </ul>
                  </div>
                </div>
                <div className="result-linked-details">
                  <ul className="list-inline result-linked-number result-linked-item associated__form">
                    <li><a className="panel-toggle" data-toggle="collapse" href={`#collapse-${result.id}-survey`}><i className="fa fa-bars" aria-hidden="true"></i>Forms: {result.forms && result.forms.length}</a></li>
                  </ul>
                </div>
              </li>
              <li className="u-result-content-item result-nav">
                <div className="result-nav-item"><i className="fa fa-signal fa-lg" aria-hidden="true"></i></div>
                <div className="result-nav-item"><Link to={`/surveys/${result.id}`}><i className="fa fa-eye fa-lg" aria-hidden="true"></i></Link></div>
                <div className="result-nav-item">
                  <div className="dropdown">
                    <a id={`survey_${result.id}_menu`} className="dropdown-toggle" type="" data-toggle="dropdown">
                      <span className="fa fa-ellipsis-h"></span>
                    </a>
                    {this.resultDropdownMenu(result, 'survey')}
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div className="panel-collapse panel-details collapse" id={`collapse-${result.id}-survey`}>
            <div className="panel-body">
              {result.forms && result.forms.length > 0 &&
                result.forms.map((f, i) => {
                  return(
                    <div key={`form-${f.id}-${i}`} className="result-details-content">
                      <Link to={`/forms/${f.id}`}>{f.name}</Link>
                    </div>
                  );
                })
              }
            </div>
          </div>
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
