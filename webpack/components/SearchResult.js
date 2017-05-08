/* eslint react/no-danger: 0 */

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import currentUserProps from "../prop-types/current_user_props";
import { responseSetProps } from "../prop-types/response_set_props";

// Note, acceptable type strings are: response_set, question, form_question, form, survey
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

  resultDropdownMenu(result, originalType, extraActionName, extraAction) {
    var type = originalType.replace('_s','S').replace('form_','');
    return (
      <ul className="dropdown-menu dropdown-menu-right">
        {originalType === 'form_question' && <li>
          <a title="Modify Program Variable Value" href="#" onClick={this.props.showProgramVarModal}>Modify Program Variable</a>
        </li>}
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

  resultName(result, highlight, type, isEditPage) {
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
        <span className="item-value">{result.surveillancePrograms.length}</span>
        <p className="item-description">programs</p>
      </li>
    );
  }

  systemsInfo(result) {
    return (
      <li className="result-analytics-item">
        <span className="item-value">{result.surveillanceSystems.length}</span>
        <p className="item-description">systems</p>
      </li>
    );
  }

  selectResultButton(result, handleSelectSearchResult) {
    return (
      <a title="Select Search Result" href="#" id={`select-${result.name}`} onClick={(e) => {
        e.preventDefault();
        handleSelectSearchResult(result);
      }}><i className="fa fa-plus-square fa-2x"></i><span className="sr-only">Add or Select Result</span></a>
    );
  }

  linkedDetails(result, type){
    switch(type) {
      case 'question':
        return (
          <ul className="list-inline result-linked-number result-linked-item associated__responseset">
            {result.responseSets && result.responseSets.length === 1 ? (
              <li><a className="panel-toggle" data-toggle="collapse" href={`#collapse-${result.id}-question`}><i className="fa fa-bars" aria-hidden="true"></i>Linked Response Set</a></li>
            ) : (
              <li><a className="panel-toggle" data-toggle="collapse" href={`#collapse-${result.id}-question`}><i className="fa fa-bars" aria-hidden="true"></i>Linked Response Sets: {result.responseSets && result.responseSets.length}</a></li>
            )}
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
      case 'form_question':
        var selectedResponseSet = this.props.responseSets.find((r) => r.id == this.props.selectedResponseSetId);
        return (
          <div className="panel-body panel-body-form-question">
            <span className="selected-response-set">Response Set: {(selectedResponseSet && selectedResponseSet.name) || '(None)'}</span>
            <div className="form-question-group">
            <input aria-label="Question IDs" type="hidden" name="question_ids[]" value={this.props.result.id}/>
            <select className="response-set-select" aria-label="Response Set IDs" name='responseSet' data-question={this.props.index} value={this.props.selectedResponseSetId || ''} onChange={this.props.handleResponseSetChange}>
              {this.props.responseSets.length > 0 && this.props.responseSets.map((r, i) => {
                return (
                  <option value={r.id} key={`${r.id}-${i}`}>{r.name} </option>
                );
              })}
              <option aria-label=' '></option>
            </select>
            <a title="Search Response Sets to Link" id="search-response-sets" href="#" onClick={this.props.showResponseSetSearch}><i className="fa fa-search fa-2x response-set-search"></i><span className="sr-only">Search Response Sets</span></a>
            </div>
          </div>
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
                      {rs.name === 'None' ? <text>No Associated Response Set.</text> : <Link to={`/responseSets/${rs.id}`}>{rs.name}</Link>}
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
    const iconMap = {'response_set': 'fa-list', 'question': 'fa-tasks', 'form_question': 'fa-tasks', 'form': 'fa-list-alt', 'survey': 'fa-clipboard'};
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
                        {this.resultName(result, highlight, type, isEditPage)}
                      </li>
                    </ul>
                  </div>
                  <div className="result-description">
                    {highlight && highlight.description ? <text dangerouslySetInnerHTML={{__html: highlight.description[0]}} /> : result.description}
                  </div>
                  <div className="result-analytics">
                    <ul className="list-inline">
                      {result.surveillancePrograms && this.programsInfo(result)}
                      {result.surveillanceSystems && this.systemsInfo(result)}
                      {result.status && this.resultStatus(result.status)}
                      <li className={`result-timestamp pull-right ${this.props.programVar && 'list-program-var'}`}>
                      <p>{ moment(result.createdAt,'').format('MMMM Do, YYYY') }</p>
                      <p>version {result.version && result.version} | {type}</p>
                      {this.props.programVar && (<p>{this.props.programVar}</p>)}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="result-linked-details">
                  {this.linkedDetails(result, type)}
                </div>
              </li>
              <li className="u-result-content-item result-nav" role="navigation" aria-label="Search Result">
                <div className="result-nav-item"><Link to={`/${type.replace('_s','S')}s/${result.id}`}><i className="fa fa-eye fa-lg" aria-hidden="true"></i><span className="sr-only">View Item Details</span></Link></div>
                <div className="result-nav-item">
                  {handleSelectSearchResult ? (
                    this.selectResultButton(result, handleSelectSearchResult)
                  ) : (
                    <div className="dropdown">
                      <a id={`${type}_${result.id}_menu`} className="dropdown-toggle" type="" data-toggle="dropdown">
                        <span className="fa fa-ellipsis-h" aria-hidden="true"></span>
                      </a>
                      {this.resultDropdownMenu(result, type, actionName, action)}
                    </div>
                  )}
                </div>
              </li>
            </ul>
          </div>
          {(type !== "form_question") && this.detailsPanel(result, type)}
        </div>
      </div>
    );
  }

}

SearchResult.propTypes = {
  type:   PropTypes.string,
  index:  PropTypes.number,
  result: PropTypes.object.isRequired,
  programVar: PropTypes.string,
  isEditPage: PropTypes.bool,
  currentUser:  currentUserProps,
  extraAction:  PropTypes.func,
  responseSets: PropTypes.arrayOf(responseSetProps),
  extraActionName: PropTypes.string,
  showProgramVarModal: PropTypes.func,
  selectedResponseSetId: PropTypes.number,
  showResponseSetSearch: PropTypes.func,
  handleResponseSetChange:  PropTypes.func,
  handleSelectSearchResult: PropTypes.func
};
