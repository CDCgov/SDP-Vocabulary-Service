/* eslint react/no-danger: 0 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import { displayVersion, isSimpleEditable } from '../utilities/componentHelpers';
import PDVModal from '../components/PDVModal';
import currentUserProps from '../prop-types/current_user_props';
import { responseSetProps } from '../prop-types/response_set_props';
import iconMap from '../styles/iconMap';

// Note, acceptable type strings are: response_set, question, section_nested_item, section, survey, survey_section, nested_section
export default class SearchResult extends Component {
  constructor(props) {
    super(props);
    this.state = { pdvModalOpen: false };
  }

  render() {
    const renderFn = (this.props.resultStyle=='condensed') ? this.baseResultCondensed.bind(this) : this.baseResult.bind(this);
    return (renderFn(this.props.type,
                            this.props.result.Source,
                            this.props.result.highlight,
                            this.props.handleSelectSearchResult,
                            this.props.isSelected,
                            this.props.isEditPage,
                            this.props.extraActionName,
                            this.props.extraAction));
  }

  isRevisable(source) {
    // Needs concept of source.mostRecent === source.version
    // Currently no way to do this in ES schema
    if (source.createdById || source.createdBy) {
      return source.status === 'published' &&
        (source.createdById || source.createdBy.id) === this.props.currentUser.id;
    } else {
      return false;
    }
  }

  isEditable(source) {
    if (source.createdById || source.createdBy) {
      return source.status === 'draft' &&
        (source.createdById || source.createdBy.id) === this.props.currentUser.id;
    } else {
      return false;
    }
  }

  isExtendable(source) {
    return source.status === 'published';
  }

  resultDropdownMenu(result, originalType, extraActionName, extraAction) {
    var type = originalType.replace('_s','S').replace('section_','').replace('survey_','').replace('nested_','').replace('_dropped','');
    return (
      <ul className="dropdown-menu dropdown-menu-right">
        {(originalType === 'section_nested_item' || originalType == 'nested_section') && <li>
          <a title={this.props.programVar ? 'Modify Program Variable Value' : 'Add Program Variable Value'} href="#" onClick={this.props.showProgramVarModal}>{this.props.programVar ? 'Modify' : 'Add'} Program Variable</a>
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
          <a className="menu-action" id={`action_for_${result.id}`} onClick={extraAction}>
            {extraActionName}
          </a>
        </li>}
      </ul>
    );
  }

  resultStage(stage) {
    if(stage === 'Published') {
      return(
        <li className="result-analytics-item">
          <span className="fa fa-check-square-o fa-lg item-status-published" aria-hidden="true"></span>
          <p className="item-description"><text className="sr-only">Content stage: </text>published</p>
        </li>
      );
    } else if (stage === 'Draft') {
      return(
        <li className="result-analytics-item">
          <span className="fa fa-pencil fa-lg item-status-draft" aria-hidden="true"></span>
          <p className="item-description"><text className="sr-only">Content stage: </text>draft</p>
        </li>
      );
    } else if (stage === 'Comment Only') {
      return(
        <li className="result-analytics-item">
          <span className="fa fa-comments fa-lg item-status-draft" aria-hidden="true"></span>
          <p className="item-description"><text className="sr-only">Content stage: </text>comment only</p>
        </li>
      );
    } else if (stage === 'Trial Use') {
      return(
        <li className="result-analytics-item">
          <span className="fa fa-gavel fa-lg item-status-draft" aria-hidden="true"></span>
          <p className="item-description"><text className="sr-only">Content stage: </text>trial use</p>
        </li>
      );
    } else if (stage === 'Duplicate') {
      return(
        <li className="result-analytics-item">
          <span className="fa fa-files-o fa-lg item-status-draft" aria-hidden="true"></span>
          <p className="item-description"><text className="sr-only">Content stage: </text>Duplicate</p>
        </li>
      );
    } else if (stage === 'Retired') {
      return(
        <li className="result-analytics-item">
          <span className="fa fa-ban fa-lg item-status-draft" aria-hidden="true"></span>
          <p className="item-description"><text className="sr-only">Content stage: </text>retired</p>
        </li>
      );
    } else {
      return(
        <li className="result-analytics-item">
          <span className="fa fa-question-circle fa-lg item-status-undefined" aria-hidden="true"></span>
          <p className="item-description"><text className="sr-only">Content stage: </text>Undefined Stage</p>
        </li>
      );
    }
  }

  resultStatusCondensed(status,version,type,date) {
    if(status === 'published') {
      return(
          <p className="item-description" title={`Updated: ${date}`}><span className="fa fa-check-square-o fa-lg item-status-published" aria-hidden="true"></span> <text className="sr-only">Item visibility status: </text>published (<text className="sr-only">Item Version Number: </text><span title={type.replace('_s','S').replace('section_','').replace('survey_','').replace('nested_','').replace('_dropped','').replace('nested','').replace('item','question')}>v{version}</span>)</p>
      );
    } else if (status === 'draft') {
      return(
          <p className="item-description" title={`Updated: ${date}`}><span className="fa fa-pencil fa-lg item-status-draft" aria-hidden="true"></span> <text className="sr-only">Item visibility status: </text>draft (<text className="sr-only">Item Version Number: </text><span title={`Item type:${type}`}>v{version}</span>)</p>
      );
    } else {
      return(
          <p className="item-description" title={`Updated: ${date}`}><span className="fa fa-question-circle fa-lg item-status-undefined" aria-hidden="true"></span> <text className="sr-only">Item visibility status: </text>Undefined Status (<text className="sr-only">Item Version Number: </text><span title={`Item type:${type}`}>v{version}</span>)</p>
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
        <Link to={`/${type.replace('_s','S').replace('section_','').replace('survey_','').replace('nested_','').replace('_dropped','')}s/${result.id}`}>
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

  resultSetSourceInfo(result) {
    return (
      <li className="result-analytics-item">
        <span className="small"><text className="sr-only">Result set source: </text>{this.responseSetSourceLink(result)}</span>
        <p className="item-description" aria-hidden="true">Source</p>
      </li>
    );
  }

  responseSetSourceLink(responseSet) {
    if(responseSet.source === 'PHIN_VADS' && responseSet.oid && responseSet.version === responseSet.mostRecent) {
      return <a href={`https://phinvads.cdc.gov/vads/ViewValueSet.action?oid=${responseSet.oid}`} target="_blank">PHIN VADS</a>;
    } else if (responseSet.source === 'PHIN_VADS') {
      return <a href="https://phinvads.cdc.gov">PHIN VADS</a>;
    } else {
      return <text>{responseSet.source[0].toUpperCase() + responseSet.source.slice(1)}</text>;
    }
  }
  selectResultButton(result, isSelected, handleSelectSearchResult, type) {
    if(isSelected){
      return (
        <div>
          <i className="fa fa-check-square fa-2x" title="Result Already Added"></i>
          <span className="sr-only">Result Already Added</span>
        </div>
      );
    } else {
      return (
        <a title="Select Search Result" href="#" id={`select-${result.name}`} onClick={(e) => {
          e.preventDefault();
          handleSelectSearchResult(result, type);
        }}><i className="fa fa-plus-square fa-2x"></i><span className="sr-only">Add or Select Result</span></a>
      );
    }
  }

  questionCollapsable(result) {
    if(result.responseType && result.responseType.name && result.responseType.name !== 'Choice' && result.responseType.name !== 'Open Choice') {
      return (<li><i className="fa fa-comments" aria-hidden="true"></i>Response Type: {result.responseType.name}</li>);
    } else if (result.responseSets && result.responseSets.length === 1) {
      return (<li><a className="panel-toggle" data-toggle="collapse" href={`#collapse-${result.id}-question`}><i className="fa fa-bars" aria-hidden="true"></i><text className="sr-only">Click link to expand information about </text>Linked Response Set</a></li>);
    } else if (result.responseSets == undefined) {
      return (<li>Click question name to view additional question information.</li>);
    } else {
      return (<li><a className="panel-toggle" data-toggle="collapse" href={`#collapse-${result.id}-question`}><i className="fa fa-bars" aria-hidden="true"></i><text className="sr-only">Click link to expand information about </text>Author Recommended Response Sets: {result.responseSets && result.responseSets.length}</a></li>);
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
      case 'response_set_dropped':
        return (
          <ul className="list-inline result-linked-number result-linked-item associated__question" aria-label="Additional Response Set details.">
            {result.codes && <li><a className="panel-toggle" data-toggle="collapse" href={`#collapse-${result.id}-rs${type === 'response_set_dropped' ? '-drop' : ''}`}><i className="fa fa-bars" aria-hidden="true"></i><text className="sr-only">Click link to expand information about linked </text>Responses: {result.codes && result.codes.length}</a></li>}
          </ul>
        );
      case 'section':
      case 'nested_section':
      case 'survey_section':
        return (
          <ul className="list-inline result-linked-number result-linked-item associated__question" aria-label="Additional Section details.">
            {result.sectionNestedItems && <li><a className="panel-toggle" data-toggle="collapse" href={`#collapse-${result.id}-${type}`}><i className="fa fa-bars" aria-hidden="true"></i><text className="sr-only">Click link to expand information about linked </text>Questions and Nested Sections: {result.sectionNestedItems && result.sectionNestedItems.length}</a></li>}
          </ul>
        );
      case 'section_nested_item':
        if(result.responseType && result.responseType.name && result.responseType.name !== 'Choice' && result.responseType.name !== 'Open Choice') {
          return (
            <ul className="list-inline result-linked-number result-linked-item associated__responseset" aria-label="Additional Question details.">
              <li><i className="fa fa-comments" aria-hidden="true"></i>Response Type: {result.responseType.name}</li>
            </ul>
          );
        } else {
          var selectedResponseSet = this.props.responseSets.find((r) => r.id == this.props.selectedResponseSetId);
          return (
            <div className="panel-body panel-body-section-nested-item associated__responseset">
              <span className="selected-response-set" aria-label={`Selected Response set for Question ${result.content}`}>Response Set: {(selectedResponseSet && selectedResponseSet.name) || '(None)'}</span>
              <div className="section-nested-item-group">
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
          <ul className="list-inline result-linked-number result-linked-item associated__section" aria-label="Additional Survey details.">
            {result.sections && <li><a className="panel-toggle" data-toggle="collapse" href={`#collapse-${result.id}-survey`}><i className="fa fa-bars" aria-hidden="true"></i><text className="sr-only">Click link to expand information about linked </text>Sections: {result.sections && result.sections.length}</a></li>}
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
                      {rs.name === 'None' ? <text>No Associated Response Set.</text> : <span><span className={`fa ${iconMap['response_set']}`} aria-hidden="true"></span> <Link to={`/responseSets/${rs.id}`}>{rs.name}</Link></span>}
                    </div>
                  );
                })
              }
            </div>
          </div>
        );
      case 'response_set':
      case 'response_set_dropped':
        return (
          <div className="panel-collapse panel-details collapse" id={`collapse-${result.id}-rs${type === 'response_set_dropped' ? '-drop' : ''}`}>
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
      case 'section':
      case 'nested_section':
      case 'survey_section':
        return (
          <div className="panel-collapse panel-details collapse" id={`collapse-${result.id}-${type}`}>
            <div className="panel-body">
              <text className="sr-only">List of links and names of questions and nested sections linked to this section:</text>
              {this.sectionPanel(result)}
            </div>
          </div>
        );
      case 'survey':
        return (
          <div className="panel-collapse panel-details collapse" id={`collapse-${result.id}-survey`}>
            <div className="panel-body">
              <text className="sr-only">List of links and names of sections on this survey</text>
              {result.sections && result.sections.length > 0 &&
                result.sections.map((sect, i) => {
                  return(
                    <div key={`section-${sect.id}-${i}`} className="result-details-content">
                      <span className={`fa ${iconMap[type]}`} aria-hidden="true"></span> <Link to={`/sections/${sect.id}`}>{sect.name}</Link>
                    </div>
                  );
                })
              }
            </div>
          </div>
        );
    }
  }

  sectionPanel(result) {
    if (result.sectionNestedItems && result.sectionNestedItems.length > 0) {
      if (result.sectionNestedItems[0] && result.sectionNestedItems[0].type) {
        return (result.sectionNestedItems.map((ni, i) => {
          if(ni !== undefined) {
            return(
              <div key={`nested-item-${ni.id}-${i}`} className="result-details-content">
                <span className={`fa ${iconMap[ni.type]}`} aria-hidden="true"></span> <Link to={`/${ni.type}s/${ni.id}`}> {ni.name || ni.content}</Link>
              </div>
            );
          } else {
            return;
          }
        }));
      } else {
        return <div className="result-details-content">Click details view in top right for more info and full list of nested items.</div>;
      }
    }
  }

  //we only want to show this if it is a question with a result set
  showLinkedDetails(result,type) {
    if ( (type== 'section_nested_item' || type == 'question') && result.responseType && result.responseType.code == 'choice') {
      return(
        <div>
          <div className="result-linked-details">
            {this.linkedDetails(result, type)}
          </div>
          {(type !== "section_nested_item") && this.detailsPanel(result, type)}
        </div>
      );
    }
  }

  baseResultCondensed(type, result, highlight, handleSelectSearchResult, isSelected, isEditPage, actionName, action) {
    return (
      <ul className="u-result-group u-result u-result-content" id={`${type}_id_${result.id}`} aria-label="Summary of a search result or linked object's attributes.">
        <li className="u-result-content-item condensed">
          <div className={`u-result-details result__${type}`}>
            <div className="list-inline result-type-wrapper">
              <div className="result-type-icon"><span className={`fa ${iconMap[type]} fa-2x`} aria-hidden="true"></span></div>
              <div className={isEditPage ? "unlinked-result-name" : "result-name"} aria-label="Item Name.">
                <div className="result-status-condensed">
                  {this.resultStatusCondensed(result.status,result.version,type,format(parse(result.createdAt,''), 'MMMM Do, YYYY'))}
                  {isSimpleEditable(result, this.props.currentUser) ? (
                    <a className="tag-modal-link" href="#" onClick={(e) => {
                      e.preventDefault();
                      this.setState({ pdvModalOpen: true });
                    }}>
                      <PDVModal show={this.state.pdvModalOpen || false}
                        cancelButtonAction={() => this.setState({ pdvModalOpen: false })}
                        pdv={this.props.programVar || ''}
                        saveButtonAction={(pdv) => {
                          this.props.updatePDV(result.sectionId, result.sniId, pdv);
                          this.setState({ pdvModalOpen: false });
                        }} />
                      <text className="sr-only">Item program defined variable: </text>{this.props.programVar ? this.props.programVar : 'Add Variable'} {'\u00A0'}
                      <i className="fa fa-pencil-square-o" aria-hidden="true"> <text className="sr-only">Click to edit program defined variable</text></i>
                    </a>
                  ) : ( this.props.programVar &&
                    <p>
                      <text className="sr-only">Item program defined variable: </text>{this.props.programVar}
                    </p>
                  )}
                </div>
                <span className="da-name">{this.resultName(result, highlight, type, isEditPage)}</span>
                <div className="result-description" aria-label="Item Description.">
                  {highlight && highlight.description ? <text dangerouslySetInnerHTML={{__html: highlight.description[0]}} /> : result.description}
                </div>
              </div>
            </div>
          </div>
          {this.showLinkedDetails(result, type)}
        </li>
        <li className="u-result-content-item condensed result-nav text-center" role="navigation" aria-label="Search Result">
          <div><Link to={`/${type.replace('_s','S').replace('section_','').replace('survey_','').replace('nested_','').replace('_dropped','').replace('nested','').replace('item','question')}s/${result.id}`} title="View Item Details"><i className="fa fa-eye fa-lg" aria-hidden="true"></i><span className="sr-only">View Item Details</span></Link></div>
          <div>
            {handleSelectSearchResult ? (
              this.selectResultButton(result, isSelected, handleSelectSearchResult, type)
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
    );
  }

  baseResult(type, result, highlight, handleSelectSearchResult, isSelected, isEditPage, actionName, action) {
    return (
      <ul className="u-result-group u-result u-result-content" id={`${type}_id_${result.id}`} aria-label="Summary of a search result or linked object's attributes.">
        <li className="u-result-content-item">
          <div className={`u-result-details result__${type}`}>
            <div className="list-inline result-type-wrapper">
              <div className="result-type-icon"><span className={`fa ${iconMap[type]} fa-2x`} aria-hidden="true"></span></div>
              <div className={isEditPage ? "unlinked-result-name" : "result-name"} aria-label="Item Name.">
                {this.resultName(result, highlight, type, isEditPage)}
              </div>
            </div>
            <div className="result-description" aria-label="Item Description.">
              {highlight && highlight.description ? <text dangerouslySetInnerHTML={{__html: highlight.description[0]}} /> : result.description}
            </div>
            <div className="result-analytics">
              <ul className="list-inline">
                {result.preferred && <li className="result-analytics-item">
                  <div className="cdc-preferred-search-result" aria-hidden="true"><text className="sr-only">This content is marked as preferred by the CDC</text>&nbsp;</div>
                  <p className="item-description">Preferred</p>
                </li>}
                {result.surveillancePrograms && this.programsInfo(result)}
                {result.surveillanceSystems && this.systemsInfo(result)}
                {this.resultStage(result.contentStage)}
                {result.source && this.resultSetSourceInfo(result)}
                <li className={`result-timestamp ${(this.props.programVar || isSimpleEditable(result, this.props.currentUser)) && 'list-program-var'}`}>
                  <p>{ format(parse(result.createdAt,''), 'MMMM Do, YYYY') }</p>
                  <p><text className="sr-only">Item Version Number: </text>version {displayVersion(result.version, result.mostRecentPublished)} | <text className="sr-only">Item type: </text>{type.replace('_s','S').replace('section_','').replace('survey_','').replace('nested_','').replace('_dropped','').replace('nested','').replace('item','question')}</p>
                  {isSimpleEditable(result, this.props.currentUser) ? (
                    <a className="pull-right tag-modal-link" href="#" onClick={(e) => {
                      e.preventDefault();
                      this.setState({ pdvModalOpen: true });
                    }}>
                      <PDVModal show={this.state.pdvModalOpen || false}
                        cancelButtonAction={() => this.setState({ pdvModalOpen: false })}
                        pdv={this.props.programVar || ''}
                        saveButtonAction={(pdv) => {
                          this.props.updatePDV(result.sectionId, result.sniId, pdv);
                          this.setState({ pdvModalOpen: false });
                        }} />
                      <text className="sr-only">Item program defined variable: </text>{this.props.programVar ? this.props.programVar : 'Add Variable'} {'\u00A0'}
                      <i className="fa fa-pencil-square-o" aria-hidden="true"><text className="sr-only">Click to edit program defined variable</text></i>
                    </a>
                  ) : ( this.props.programVar &&
                    <p>
                      <text className="sr-only">Item program defined variable: </text>{this.props.programVar}
                    </p>
                  )}
                </li>
              </ul>
            </div>
          </div>
          <div className="result-linked-details">
            {this.linkedDetails(result, type)}
          </div>
          {(type !== "section_nested_item") && this.detailsPanel(result, type)}
        </li>
        <li className="u-result-content-item result-nav" role="navigation" aria-label="Search Result">
          <div className="result-nav-item"><Link to={`/${type.replace('_s','S').replace('section_','').replace('survey_','').replace('nested_','').replace('_dropped','').replace('nested','').replace('item','question')}s/${result.id}`} title="View Item Details"><i className="fa fa-eye fa-lg" aria-hidden="true"></i><span className="sr-only">View Item Details</span></Link></div>
          <div className="result-nav-item">
            {handleSelectSearchResult ? (
              this.selectResultButton(result, isSelected, handleSelectSearchResult, type)
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
    );
  }
}

SearchResult.propTypes = {
  type:   PropTypes.string,
  index:  PropTypes.number,
  result: PropTypes.object.isRequired,
  programVar: PropTypes.string,
  isEditPage: PropTypes.bool,
  resultStyle: PropTypes.string,
  currentUser:  currentUserProps,
  extraAction:  PropTypes.func,
  responseSets: PropTypes.arrayOf(responseSetProps),
  extraActionName: PropTypes.string,
  showProgramVarModal: PropTypes.func,
  selectedResponseSetId: PropTypes.number,
  showResponseSetSearch: PropTypes.func,
  handleResponseSetChange:  PropTypes.func,
  handleSelectSearchResult: PropTypes.func,
  updatePDV: PropTypes.func,
  isSelected: PropTypes.bool
};
