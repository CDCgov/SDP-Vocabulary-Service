import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { hashHistory, Link } from 'react-router';
import Pagination from 'rc-pagination';
import $ from 'jquery';

import SectionNestedItemList from '../../containers/sections/SectionNestedItemList';
import SurveyList from '../surveys/SurveyList';
import CodedSetTable from "../CodedSetTable";
import VersionInfo from '../VersionInfo';
import PublisherLookUp from "../shared_show/PublisherLookUp";
import GroupLookUp from "../shared_show/GroupLookUp";
import ChangeHistoryTab from "../shared_show/ChangeHistoryTab";
import TagModal from "../TagModal";

import { sectionProps } from '../../prop-types/section_props';
import currentUserProps from '../../prop-types/current_user_props';
import { publishersProps } from "../../prop-types/publisher_props";
import { isEditable, isRevisable, isPublishable, isExtendable, isGroupable, isSimpleEditable } from '../../utilities/componentHelpers';
import ResultStyleControl from '../shared_show/ResultStyleControl';

const PAGE_SIZE = 10;

class SectionShow extends Component {
  constructor(props) {
    super(props);
    this.state = { page: 1, tagModalOpen: false, selectedTab: 'main' };
    this.nestedItemsForPage = this.nestedItemsForPage.bind(this);
    this.pageChange = this.pageChange.bind(this);
  }

  render() {
    const {section} = this.props;
    if(!section){
      return (
        <div>Loading...</div>
      );
    }
    return (
      <div id={"section_id_"+section.id}>
        <div className="showpage_header_container no-print">
          <ul className="list-inline">
            <li className="showpage_button"><span className="fa fa-arrow-left fa-2x" aria-hidden="true" onClick={hashHistory.goBack}></span></li>
            <li className="showpage_title"><h1>Section Details {section.status && (<text>[{section.status.toUpperCase()}]</text>)}</h1></li>
          </ul>
        </div>
        {this.historyBar(section)}
        {this.mainContent(section)}
      </div>
    );
  }

  historyBar(section){
    return (
      <div className="col-md-3 nopadding no-print">
        <h2 className="showpage_sidenav_subtitle">
          <text className="sr-only">Version History Navigation Links</text>
          <ul className="list-inline">
            <li className="subtitle_icon"><span className="fa fa-history" aria-hidden="true"></span></li>
            <li className="subtitle">History</li>
          </ul>
        </h2>
        <VersionInfo versionable={section} versionableType='section' currentUser={this.props.currentUser} />
      </div>
    );
  }

  toggleExpand() {
    $('#collapse-linked-questions').collapse('toggle');
    this.props.toggleResultControl(this.props.resultControlVisibility);
  }

  pageChange(nextPage) {
    this.setState({page: nextPage});
  }

  nestedItemsForPage(section) {
    const startIndex = (this.state.page - 1) * PAGE_SIZE;
    const endIndex = this.state.page * PAGE_SIZE;
    const sectionNestedItemPage = section.sectionNestedItems.slice(startIndex, endIndex);
    return sectionNestedItemPage.map((sni) => {
      var sectionNestedItem = {};
      if (sni.nestedSectionId) {
        sectionNestedItem = Object.assign({}, section.nestedSections.find(s => s.id === sni.nestedSectionId));
        sectionNestedItem.programVar = sni.programVar || '';
        sectionNestedItem.sniId = sni.id;
        sectionNestedItem.sectionId = section.id;
        sectionNestedItem.groups = section.groups;
      } else {
        sectionNestedItem = Object.assign({}, section.questions.find(q => q.id === sni.questionId));
        sectionNestedItem.programVar = sni.programVar || '';
        sectionNestedItem.sniId = sni.id;
        sectionNestedItem.sectionId = section.id;
        sectionNestedItem.groups = section.groups;
        sectionNestedItem.responseSets = [{name: 'None'}];
        if (sni.responseSetId) {
          var responseSet = section.responseSets.find(rs => rs.id === sni.responseSetId);
          if(responseSet) {
            sectionNestedItem.responseSets = [responseSet];
          } else {
            sectionNestedItem.responseSets = [{name: 'Loading...'}];
          }
        }
      }
      return sectionNestedItem;
    });
  }

  mainContent(section) {
    return (
      <div className="col-md-9 nopadding maincontent">
        <div className="action_bar no-print">
          {isEditable(section, this.props.currentUser) &&
            <PublisherLookUp publishers={this.props.publishers}
                           itemType="Section" />
          }
          {isGroupable(section, this.props.currentUser) &&
            <GroupLookUp item={section} addFunc={this.props.addSectionToGroup} removeFunc={this.props.removeSectionFromGroup} currentUser={this.props.currentUser} />
          }
          <div className="btn-group">
            <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span className="fa fa-arrow-circle-down"></span> Export <span className="caret"></span>
            </button>
            <ul className="dropdown-menu">
              <li key="header" className="dropdown-header">Export format:</li>
              <li><a href={`/sections/${this.props.section.id}/epi_info`}>Epi Info (XML)</a></li>
              <li><a href={`/sections/${this.props.section.id}/redcap`}>REDCap (XML)</a></li>
              <li><a href='#' onClick={(e) => {
                e.preventDefault();
                window.print();
              }}>Print</a></li>
            </ul>
          </div>
          {isPublishable(section, this.props.currentUser) &&
              <a className="btn btn-default" href="#" onClick={(e) => {
                e.preventDefault();
                this.props.publishSection(section.id);
                return false;
              }}>Publish</a>
          }
          {isRevisable(section, this.props.currentUser) &&
            <Link className="btn btn-default" to={`sections/${section.id}/revise`}>Revise</Link>
          }
          {isEditable(section, this.props.currentUser) &&
            <Link className="btn btn-default" to={`sections/${section.id}/edit`}>Edit</Link>
          }
          {isEditable(section, this.props.currentUser) &&
            <a className="btn btn-default" href="#" onClick={(e) => {
              e.preventDefault();
              if(confirm('Are you sure you want to delete this Section? This action cannot be undone.')){
                this.props.deleteSection(section.id, (response) => {
                  if (response.status == 200) {
                    let stats = Object.assign({}, this.props.stats);
                    stats.sectionCount = this.props.stats.sectionCount - 1;
                    stats.mySectionCount = this.props.stats.mySectionCount - 1;
                    this.props.setStats(stats);
                    this.props.router.push('/');
                  }
                });
              }
              return false;
            }}>Delete</a>
          }
          {isExtendable(section, this.props.currentUser) &&
            <Link className="btn btn-default" to={`/sections/${section.id}/extend`}>Extend</Link>
          }
        </div>
        <div className="maincontent-details">
          <h1 className="maincontent-item-name"><strong>Section Name:</strong> {section.name} </h1>
          <p className="maincontent-item-info">Version: {section.version} - Author: {section.userId} </p>
          <ul className="nav nav-tabs" role="tablist">
            <li id="main-content-tab" className="nav-item active" role="tab" onClick={() => this.setState({selectedTab: 'main'})} aria-selected={this.state.selectedTab === 'main'} aria-controls="main">
              <a className="nav-link" data-toggle="tab" href="#main-content" role="tab">Information</a>
            </li>
            <li id="change-history-tab" className="nav-item" role="tab" onClick={() => this.setState({selectedTab: 'changes'})} aria-selected={this.state.selectedTab === 'changes'} aria-controls="changes">
              <a className="nav-link" data-toggle="tab" href="#change-history" role="tab">Change History</a>
            </li>
          </ul>
          <div className="tab-content">
            <div className={`tab-pane ${this.state.selectedTab === 'changes' && 'active'}`} id="changes" role="tabpanel" aria-hidden={this.state.selectedTab !== 'changes'} aria-labelledby="change-history-tab">
              <ChangeHistoryTab versions={section.versions} type='section' majorVersion={section.version} />
            </div>
            <div className={`tab-pane ${this.state.selectedTab === 'main' && 'active'}`} id="main" role="tabpanel" aria-hidden={this.state.selectedTab !== 'main'} aria-labelledby="main-content-tab">
              <div className="basic-c-box panel-default section-type">
                <div className="panel-heading">
                  <h2 className="panel-title">Description</h2>
                </div>
                <div className="box-content">
                  {section.description}
                </div>
                { section.status === 'published' && section.publishedBy && section.publishedBy.email &&
                <div className="box-content">
                  <strong>Published By: </strong>
                  {section.publishedBy.email}
                </div>
                }
                { section.parent &&
                <div className="box-content">
                  <strong>Extended from: </strong>
                  <Link to={`/sections/${section.parent.id}`}>{ section.parent.name && section.parent.name }</Link>
                </div>
                }
              </div>
              <div className="basic-c-box panel-default">
                <div className="panel-heading">
                  <h2 className="panel-title">
                    Tags
                    {isSimpleEditable(section, this.props.currentUser) &&
                      <a className="pull-right tag-modal-link" href="#" onClick={(e) => {
                        e.preventDefault();
                        this.setState({ tagModalOpen: true });
                      }}>
                        <TagModal show={this.state.tagModalOpen || false}
                          cancelButtonAction={() => this.setState({ tagModalOpen: false })}
                          concepts={section.concepts}
                          saveButtonAction={(conceptsAttributes) => {
                            this.props.updateSectionTags(section.id, conceptsAttributes);
                            this.setState({ tagModalOpen: false });
                          }} />
                        <i className="fa fa-pencil-square-o" aria-hidden="true"></i> Update
                      </a>
                    }
                  </h2>
                </div>
                <div className="box-content">
                  <div id="concepts-table">
                    <CodedSetTable items={section.concepts} itemName={'Tag'} />
                  </div>
                </div>
              </div>
              {section.sectionNestedItems && section.sectionNestedItems.length > 0 && ((section.questions && section.questions.length > 0) || (section.nestedSections && section.nestedSections.length > 0)) &&
                <div className="basic-c-box panel-default">
                  <div className="panel-heading">
                    <h2 className="panel-title">
                      <a className="panel-toggle" onClick={(e) => {
                        e.preventDefault();
                        this.toggleExpand();
                      }} href={`#collapse-linked-questions`}><i className="fa fa-bars" aria-hidden="true"></i>
                      <text className="sr-only">Click link to expand information about linked </text>Linked Questions and Sections: {section.sectionNestedItems && section.sectionNestedItems.length}</a>
                    </h2>
                    <ResultStyleControl resultControlVisibility={this.props.resultControlVisibility} resultStyle={this.props.resultStyle} />
                  </div>
                  <div className="box-content panel-collapse panel-details collapse" id="collapse-linked-questions">
                    <div className="panel-body">
                      <SectionNestedItemList resultStyle={this.props.resultStyle} items={this.nestedItemsForPage(section)} currentUser={this.props.currentUser} />
                      {this.props.section.sectionNestedItems.length > 10 &&
                      <Pagination onChange={this.pageChange} current={this.state.page} total={this.props.section.sectionNestedItems.length} />
                      }
                    </div>
                  </div>
                </div>
              }
              {section.surveys && section.surveys.length > 0 &&
                <div className="basic-c-box panel-default">
                  <div className="panel-heading">
                    <h2 className="panel-title">
                      <a className="panel-toggle" data-toggle="collapse" href={`#collapse-linked-surveys`}><i className="fa fa-bars" aria-hidden="true"></i>
                      <text className="sr-only">Click link to expand information about linked </text>Linked Surveys: {section.surveys && section.surveys.length}</a>
                    </h2>
                  </div>
                  <div className="box-content panel-collapse panel-details collapse" id="collapse-linked-surveys">
                    <div className="panel-body">
                      <SurveyList surveys={section.surveys} currentUser={this.props.currentUser} />
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SectionShow.propTypes = {
  section: sectionProps,
  router: PropTypes.object,
  currentUser: currentUserProps,
  publishSection: PropTypes.func,
  deleteSection:  PropTypes.func.isRequired,
  addSectionToGroup: PropTypes.func,
  removeSectionFromGroup: PropTypes.func,
  updateSectionTags: PropTypes.func,
  setStats: PropTypes.func,
  stats: PropTypes.object,
  publishers: publishersProps,
  resultControlVisibility: PropTypes.string,
  resultStyle: PropTypes.string,
  toggleResultControl: PropTypes.func
};

export default SectionShow;
