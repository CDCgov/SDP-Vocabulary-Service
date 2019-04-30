import React, { Component } from 'react';
import { denormalize } from 'normalizr';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-bootstrap';
import { hashHistory } from 'react-router';

import { fetchSection, publishSection, fetchSectionParents, retireSection, updateStageSection, addSectionToGroup, removeSectionFromGroup, deleteSection, updateSectionTags } from '../../actions/section_actions';
import { setSteps } from '../../actions/tutorial_actions';
import { setStats } from '../../actions/landing';
import { hideResultControl, toggleResultControl } from '../../actions/display_style_actions';
import { addPreferred, removePreferred } from '../../actions/preferred_actions';
import { clearBreadcrumb, addBreadcrumbItem } from '../../actions/breadcrumb_actions';
import LoadingSpinner from '../../components/LoadingSpinner';
import NotFoundAlert from '../../containers/NotFoundAlert';
import BasicAlert from '../../components/BasicAlert';
import SectionShow from '../../components/sections/SectionShow';
import { sectionProps } from '../../prop-types/section_props';
import { sectionSchema } from '../../schema';
import CommentList from '../../containers/CommentList';
import currentUserProps from '../../prop-types/current_user_props';
import { publishersProps } from "../../prop-types/publisher_props";
import { gaSend } from '../../utilities/GoogleAnalytics';

class SectionShowContainer extends Component {
  componentWillMount() {
    this.props.fetchSection(this.props.params.sectionId);
  }

  componentDidMount() {
    gaSend('send', 'pageview', window.location.toString());
    if (this.props.section){
      this.props.fetchSectionParents(this.props.params.sectionId);
    }
    this.props.setSteps([
      {
        title: 'Help',
        text: 'Click next to see a step by step walkthrough for using this page. To see more detailed information about this application and actions you can take <a class="tutorial-link" href="#help">click here to view the full Help Documentation.</a> Accessible versions of these steps are also duplicated in the help documentation.',
        selector: '.help-link',
        position: 'bottom',
      },
      {
        title: 'Version Navigation',
        text: 'Use the history side bar to switch between revisions of an item if more than one exists.',
        selector: '.nav-stacked',
        position: 'right',
      },
      {
        title: 'View Details',
        text: 'See all of the details including linked items on this section of the page. Use the buttons in the top right to do various actions with the content depending on your user permissions. For full details on what an action does please see the "Create and Edit Content" section of the <a class="tutorial-link" href="#help">Help Documentation (linked here).</a>',
        selector: '.action_bar',
        position: 'left',
      },
      {
        title: 'Comment Threads',
        text: 'At the bottom of each details page is a section for public comments. People can view and respond to these comments in threads on public content.',
        selector: '.showpage-comments-title',
        position: 'top',
      }]);
    // The default is for the nested section items to be collapsed, so hide the controls by default
    this.props.hideResultControl();
  }

  componentDidUpdate(prevProps) {
    if(prevProps.params.sectionId != this.props.params.sectionId){
      this.props.fetchSection(this.props.params.sectionId);
    } else if (this.props.section && this.props.section.parentItems === undefined) {
      this.props.fetchSectionParents(this.props.params.sectionId);
    }
  }

  render() {
    if(!this.props.section || this.props.isLoading || this.props.loadStatus == 'failure'){
      return (
              <Grid className="basic-bg">
                <div>
                  <div className="showpage_header_container no-print">
                    <ul className="list-inline">
                      <li className="showpage_button"><span className="fa fa-arrow-left fa-2x" aria-hidden="true" onClick={hashHistory.goBack}></span></li>
                      <li className="showpage_title"><h1>Section Details</h1></li>
                    </ul>
                  </div>
                </div>
                <Row>
                  <Col xs={12}>
                      <div className="main-content">
                        {this.props.isLoading && <LoadingSpinner msg="Loading section..." />}
                        {this.props.loadStatus == 'failure' &&
                          <NotFoundAlert msg={this.props.loadStatusText} severity='danger' type='Section' id={this.props.params.sectionId} />
                        }
                        {this.props.loadStatus == 'success' &&
                         <BasicAlert msg="Sorry, there is a problem loading this section." severity='warning' />
                        }
                      </div>
                  </Col>
                </Row>
              </Grid>
      );
    }
    return (
      <Grid className="basic-bg">
        <SectionShow section={this.props.section}
                  router={this.props.router}
                  currentUser={this.props.currentUser}
                  publishSection={this.props.publishSection}
                  retireSection={this.props.retireSection}
                  stats={this.props.stats}
                  setStats={this.props.setStats}
                  deleteSection={this.props.deleteSection}
                  addSectionToGroup={this.props.addSectionToGroup}
                  removeSectionFromGroup={this.props.removeSectionFromGroup}
                  addPreferred={this.props.addPreferred}
                  removePreferred={this.props.removePreferred}
                  fetchSection={this.props.fetchSection}
                  updateSectionTags={this.props.updateSectionTags}
                  updateStageSection={this.props.updateStageSection}
                  publishers ={this.props.publishers}
                  resultStyle={this.props.resultStyle}
                  resultControlVisibility={this.props.resultControlVisibility}
                  toggleResultControl={this.props.toggleResultControl}
                  addBreadcrumbItem={this.props.addBreadcrumbItem}
                  isLoading={this.props.isLoading}
                  loadStatus={this.props.loadStatus}
                  loadStatusText={this.props.loadStatusText}
                 />
        <div className="showpage-comments-title">Public Comments:</div>
        <CommentList commentableType='Section' commentableId={this.props.section.id} />
      </Grid>
    );
  }
}

function mapStateToProps(state, ownProps) {
  let section = {};
  if (state.sections[ownProps.params.sectionId] && state.sections[ownProps.params.sectionId].questions && typeof state.sections[ownProps.params.sectionId].questions[0] !== 'object') {
    section = denormalize(state.sections[ownProps.params.sectionId], sectionSchema, state);
  } else {
    section = state.sections[ownProps.params.sectionId];
  }
  const props = {
    currentUser: state.currentUser,
    stats: state.stats,
    section: section,
    publishers: state.publishers,
    resultControlVisibility : state.displayStyle.resultControlVisibility,
    resultStyle : state.displayStyle.resultStyle,
    isLoading : state.ajaxStatus.section.isLoading,
    loadStatus : state.ajaxStatus.section.loadStatus,
    loadStatusText : state.ajaxStatus.section.loadStatusText
  };
  return props;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({setSteps, setStats, fetchSection, fetchSectionParents, publishSection, addSectionToGroup, addPreferred, removePreferred,
    removeSectionFromGroup, deleteSection, updateSectionTags, hideResultControl, updateStageSection, toggleResultControl, retireSection, clearBreadcrumb, addBreadcrumbItem}, dispatch);
}

SectionShowContainer.propTypes = {
  section: sectionProps,
  params: PropTypes.object,
  router: PropTypes.object.isRequired,
  currentUser: currentUserProps,
  setSteps: PropTypes.func,
  setStats: PropTypes.func,
  stats: PropTypes.object,
  fetchSection: PropTypes.func,
  fetchSectionParents: PropTypes.func,
  deleteSection:  PropTypes.func,
  addSectionToGroup: PropTypes.func,
  removeSectionFromGroup: PropTypes.func,
  addPreferred: PropTypes.func,
  removePreferred: PropTypes.func,
  updateSectionTags: PropTypes.func,
  updateStageSection: PropTypes.func,
  publishSection: PropTypes.func,
  retireSection: PropTypes.func,
  publishers: publishersProps,
  hideResultControl: PropTypes.func,
  toggleResultControl: PropTypes.func,
  displayStyle: PropTypes.object,
  resultStyle: PropTypes.string,
  resultControlVisibility: PropTypes.string,
  isLoading: PropTypes.bool,
  loadStatus : PropTypes.string,
  loadStatusText : PropTypes.string,
  addBreadcrumbItem: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(SectionShowContainer);
