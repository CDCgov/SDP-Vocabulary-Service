/* eslint react/no-danger: 0 */

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import currentUserProps from "../prop-types/current_user_props";
import { responseSetProps } from "../prop-types/response_set_props";

// Note, acceptable type strings are: response_set, question, form_question, form, survey, survey_form
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
    var type = originalType.replace('_s','S').replace('form_','').replace('survey_','');
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
          <p className="item-description"><text className="sr-only">Item visibility status: </text>published</p>
        </li>
      );
    } else if (status === 'draft') {
      return(
        <li className="result-analytics-item">
          <span className="fa fa-pencil fa-lg item-status-draft" aria-hidden="true"></span>
          <p className="item-description"><text className="sr-only">Item visibility status: </text>draft</p>
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
        <span className="item-value"><text className="sr-only">Item program usage count: </text>{result.surveillancePrograms.length}</span>
        <p className="item-description" aria-hidden="true">programs</p>
      </li>
    );
  }

  systemsInfo(result) {
    return (
      <li className="result-analytics-item">
        <span className="item-value"><text className="sr-only">Item system usage count: </text>{result.surveillanceSystems.length}</span>
        <p className="item-description" aria-hidden="true">systems</p>
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

  questionCollapsable(result) {
    if(result.responseType && result.responseType.name && result.responseType.name !== 'Choice' && result.responseType.name !== 'Open Choice') {
      return (<li><i className="fa fa-comments" aria-hidden="true"></i>Response Type: {result.responseType.name}</li>);
    } else if (result.responseSets && result.responseSets.length === 1) {
      return (<li><a className="panel-toggle" data-toggle="collapse" href={`#collapse-${result.id}-question`}><i className="fa fa-bars" aria-hidden="true"></i><text className="sr-only">Click link to expand information about </text>Linked Response Set</a></li>);
    } else {
      return (<li><a className="panel-toggle" data-toggle="collapse" href={`#collapse-${result.id}-question`}><i className="fa fa-bars" aria-hidden="true"></i><text className="sr-only">Click link to expand information about </text>Linked Response Sets: {result.responseSets && result.responseSets.length}</a></li>);
    }
  }

  linkedDetails(result, type){
    switch(type) {
      case 'question':
        return (
          <ul className="list-inline result-linked-number result-linked-item associated__responseset" aria-label="Additional Question details.">
            {this.questionCollapsable(result)}
          </ul>
        );
      case 'response_set':
        return (
          <ul className="list-inline result-linked-number result-linked-item associated__question" aria-label="Additional Response Set details.">
            {result.codes && <li><a className="panel-toggle" data-toggle="collapse" href={`#collapse-${result.id}-rs`}><i className="fa fa-bars" aria-hidden="true"></i><text className="sr-only">Click link to expand information about linked </text>Responses: {result.codes && result.codes.length}</a></li>}
          </ul>
        );
      case 'form':
      case 'survey_form':
        return (
          <ul className="list-inline result-linked-number result-linked-item associated__question" aria-label="Additional Form details.">
            <li><a className="panel-toggle" data-toggle="collapse" href={`#collapse-${result.id}-${type}`}><i className="fa fa-bars" aria-hidden="true"></i><text className="sr-only">Click link to expand information about linked </text>Questions: {result.questions && result.questions.length}</a></li>
          </ul>
        );
      case 'form_question':
        if(result.responseType && result.responseType.name && result.responseType.name !== 'Choice' && result.responseType.name !== 'Open Choice') {
          return (
            <ul className="list-inline result-linked-number result-linked-item associated__responseset" aria-label="Additional Question details.">
              <li><i className="fa fa-comments" aria-hidden="true"></i>Response Type: {result.responseType.name}</li>
            </ul>
          );
        } else {
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
                <a title="Search Response Sets to Link" id="search-response-sets" href="#" onClick={this.props.showResponseSetSearch}><i className="fa fa-search fa-2x response-set-search"></i><span className="sr-only">Click link to search all Response Sets and select one to link to this question</span></a>
              </div>
            </div>
          );
        }
      case 'survey':
        return (
          <ul className="list-inline result-linked-number result-linked-item associated__form" aria-label="Additional Survey details.">
            <li><a className="panel-toggle" data-toggle="collapse" href={`#collapse-${result.id}-survey`}><i className="fa fa-bars" aria-hidden="true"></i><text className="sr-only">Click link to expand information about linked </text>Forms: {result.forms && result.forms.length}</a></li>
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
              <text className="sr-only">List of links to response sets on this question:</text>
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
              <text className="sr-only">List of responses on this response set:</text>
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
      case 'survey_form':
        return (
          <div className="panel-collapse panel-details collapse" id={`collapse-${result.id}-${type}`}>
            <div className="panel-body">
              <text className="sr-only">List of links and names of questions linked to this form:</text>
              {result.questions && result.questions.length > 0 &&
                result.questions.map((q, i) => {
                  return(
                    <div key={`question-${q.id}-${i}`} className="result-details-content">
                      <text>
                        <Link to={`/questions/${q.id}`}> {q.name || q.content}</Link>
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
              <text className="sr-only">List of links and names of forms on this survey</text>
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
    const iconMap = {'response_set': 'fa-list', 'question': 'fa-tasks', 'form_question': 'fa-tasks', 'form': 'fa-list-alt', 'survey_form': 'fa-list-alt', 'survey': 'fa-clipboard'};
    return (
      <div className="u-result-group">
        <div className="u-result" id={`${type}_id_${result.id}`}>
          <div className="u-result-container">
            <ul className="u-result-content" aria-label="Summary of a search result or linked object's attributes.">
              <li className="u-result-content-item">
                <div className={`u-result-details result__${type}`}>
                  <div className="result">
                    <ul className="list-inline result-type-wrapper">
                      <li className="result-type-icon"><span className={`fa ${iconMap[type]} fa-2x`} aria-hidden="true"></span></li>
                      <li className="result-name" aria-label="Item Name.">
                        {this.resultName(result, highlight, type, isEditPage)}
                      </li>
                    </ul>
                  </div>
                  <div className="result-description" aria-label="Item Description.">
                    {highlight && highlight.description ? <text dangerouslySetInnerHTML={{__html: highlight.description[0]}} /> : result.description}
                  </div>
                  <div className="result-analytics">
                    <ul className="list-inline">
                      {result.surveillancePrograms && this.programsInfo(result)}
                      {result.surveillanceSystems && this.systemsInfo(result)}
                      {result.status && this.resultStatus(result.status)}
                      <li className={`result-timestamp pull-right ${this.props.programVar && 'list-program-var'}`}>
                        <p>{ moment(result.createdAt,'').format('MMMM Do, YYYY') }</p>
                        <p><text className="sr-only">Item Version Number: </text>version {result.version && result.version} | <text className="sr-only">Item type: </text>{type}</p>
                        {this.props.programVar && (<p><text className="sr-only">Item program defined Variable: </text>{this.props.programVar}</p>)}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="result-linked-details">
                  {this.linkedDetails(result, type)}
                </div>
                {(type !== "form_question") && this.detailsPanel(result, type)}
              </li>
              <li className="u-result-content-item result-nav" role="navigation" aria-label="Search Result">
                <div className="result-nav-item"><Link to={`/${type.replace('_s','S')}s/${result.id}`}><i className="fa fa-eye fa-lg" aria-hidden="true"></i><span className="sr-only">View Item Details</span></Link></div>
                <div className="result-nav-item">
                  {handleSelectSearchResult ? (
                    this.selectResultButton(result, handleSelectSearchResult)
                  ) : (
                    <div className="dropdown">
                      <a id={`${type}_${result.id}_menu`} role="navigation" href="#item-menu" className="dropdown-toggle widget-dropdown-toggle" data-toggle="dropdown">
                        <span className="fa fa-ellipsis-h" aria-hidden="true"></span>
                        <span className="sr-only">View Item Action Menu</span>
                      </a>
                      {this.resultDropdownMenu(result, type, actionName, action)}
                    </div>
                  )}
                </div>
              </li>
            </ul>
          </div>
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
