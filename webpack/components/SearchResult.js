/* eslint react/no-danger: 0 */

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import currentUserProps from "../prop-types/current_user_props";

// Note, acceptable type strings are: response_set, question, form, survey
export default class SearchResult extends Component {
  render() {
    return (this.baseResult(this.props.type,
                            this.props.result.Source,
                            this.props.result.highlight,
                            this.props.handleSelectSearchResult,
                            this.props.isEditPage,
                            this.props.extraActionName,
                            this.props.extraAction));
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

  resultDropdownMenu(result, type, extraActionName, extraAction) {
    type = type.replace('_s','S');
    return (
      <ul className="dropdown-menu dropdown-menu-right">
        {this.isRevisable(result) && <li>
          <Link to={`/${type}s/${result.id}/revise`}>Revise</Link>
        </li>}
        {this.isEditable(result) && <li>
          <Link to={`/${type}s/${result.id}/edit`}>Edit</Link>
        </li>}
        {this.isExtendable(result) && <li>
          <Link to={`/${type}s/${result.id}/extend`}>Extend</Link>
        </li>}
        <li>
          <Link to={`/${type}s/${result.id}`}>Details</Link>
        </li>
        {extraActionName && extraAction && <li>
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

  resultName(result, type, isEditPage){
    const highlight = result.highlight;
    const name = result.content ? result.content: result.name;
    const innerHTML = highlight && highlight.name ? <text dangerouslySetInnerHTML={{__html: highlight.name[0]}} /> : name;
    if(isEditPage){
      return innerHTML;
    }else{
      return (
        <Link to={`/${type.replace('_s','S')}s/${result.id}`}>
          {innerHTML}
        </Link>
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

  selectResultButton(result, handleSelectSearchResult) {
    return (
      <a title="Select Search Result" href="#" id={`select-${result.name}`} onClick={(e) => {
        e.preventDefault();
        handleSelectSearchResult(result);
      }}><i className="fa fa-plus-square fa-2x"></i></a>
    );
  }

  linkedDetails(result, type){
    switch(type) {
      case 'question':
        return (
          <ul className="list-inline result-linked-number result-linked-item associated__responseset">
            {result.responseSets && <li><a className="panel-toggle" data-toggle="collapse" href={`#collapse-${result.id}-question`}><i className="fa fa-bars" aria-hidden="true"></i>Linked Response Sets: {result.responseSets && result.responseSets.length}</a></li>}
          </ul>
        );
      case 'response_set':
        return (
          <ul className="list-inline result-linked-number result-linked-item associated__question">
            {result.codes && <li><a className="panel-toggle" data-toggle="collapse" href={`#collapse-${result.id}-rs`}><i className="fa fa-bars" aria-hidden="true"></i>Responses: {result.codes && result.codes.length}</a></li>}
          </ul>
        );
      case 'form':
        return (
          <ul className="list-inline result-linked-number result-linked-item associated__question">
            <li><a className="panel-toggle" data-toggle="collapse" href={`#collapse-${result.id}-form`}><i className="fa fa-bars" aria-hidden="true"></i>Questions: {result.questions && result.questions.length}</a></li>
          </ul>
        );
      case 'survey':
        return (
          <ul className="list-inline result-linked-number result-linked-item associated__form">
            <li><a className="panel-toggle" data-toggle="collapse" href={`#collapse-${result.id}-survey`}><i className="fa fa-bars" aria-hidden="true"></i>Forms: {result.forms && result.forms.length}</a></li>
          </ul>
        );
    }
  }

  detailsPanel(result, type){
    switch(type) {
      case 'question':
        return (
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
        );
      case 'response_set':
        return (
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
        );
      case 'form':
        return (
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
        );
      case 'survey':
        return (
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
        );
    }
  }

  baseResult(type, result, highlight, handleSelectSearchResult, isEditPage, actionName, action) {
    const iconMap = {'response_set': 'fa-list', 'question': 'fa-tasks', 'form': 'fa-clipboard', 'survey': 'fa-clipboard'};
    return (
      <div className="u-result-group">
        <div className="u-result" id={`${type}_id_${result.id}`}>
          <div className="u-result-container">
            <ul className="u-result-content">
              <li className="u-result-content-item">
                <div className={`u-result-details result__${type}`}>
                  <div className="result">
                    <ul className="list-inline result-type-wrapper">
                      <li className="result-type-icon"><span className={`fa ${iconMap[type]} fa-2x`} aria-hidden="true"></span></li>
                      <li className="result-name">
                        {this.resultName(result, type, isEditPage)}
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
                      <li className="result-timestamp pull-right"><p>{ moment(result.createdAt,'').format('MMMM Do, YYYY') }</p><p>version {result.version && result.version} | {type}</p></li>
                    </ul>
                  </div>
                </div>
                <div className="result-linked-details">
                  {this.linkedDetails(result, type)}
                </div>
              </li>
              <li className="u-result-content-item result-nav">
                <div className="result-nav-item"><Link to={`/${type.replace('_s','S')}s/${result.id}`}><i className="fa fa-eye fa-lg" aria-hidden="true"></i></Link></div>
                <div className="result-nav-item">
                  {handleSelectSearchResult ? (
                    this.selectResultButton(result, handleSelectSearchResult)
                  ) : (
                    <div className="dropdown">
                      <a id={`${type}_${result.id}_menu`} className="dropdown-toggle" type="" data-toggle="dropdown">
                        <span className="fa fa-ellipsis-h"></span>
                      </a>
                      {this.resultDropdownMenu(result, type, actionName, action)}
                    </div>
                  )}
                </div>
              </li>
            </ul>
          </div>
          {this.detailsPanel(result, type)}
        </div>
      </div>
    );
  }

}

SearchResult.propTypes = {
  type: PropTypes.string,
  currentUser: currentUserProps,
  result: PropTypes.object.isRequired,
  isEditPage: PropTypes.bool,
  handleSelectSearchResult: PropTypes.func,
  extraActionName: PropTypes.string,
  extraAction: PropTypes.func
};
