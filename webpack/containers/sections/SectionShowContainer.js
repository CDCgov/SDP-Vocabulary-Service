import React, { Component } from 'react';
import { denormalize } from 'normalizr';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchSection, publishSection, retireSection, addSectionToGroup, removeSectionFromGroup, deleteSection, updateSectionTags } from '../../actions/section_actions';
import { setSteps } from '../../actions/tutorial_actions';
import { setStats } from '../../actions/landing';
import { hideResultControl, toggleResultControl } from '../../actions/display_style_actions';
import { addPreferred, removePreferred } from '../../actions/preferred_actions';
import SectionShow from '../../components/sections/SectionShow';
import { sectionProps } from '../../prop-types/section_props';
import { sectionSchema } from '../../schema';
import CommentList from '../../containers/CommentList';
import currentUserProps from '../../prop-types/current_user_props';
import { publishersProps } from "../../prop-types/publisher_props";

class SectionShowContainer extends Component {
  componentWillMount() {
    this.props.fetchSection(this.props.params.sectionId);
  }

  componentDidMount() {
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
        text: 'At the bottom of each details page is a section for public comments. People can view and respond to these comments in threads on published content.',
        selector: '.showpage-comments-title',
        position: 'top',
      }]);
    // The default is for the nested section items to be collapsed, so hide the controls by default
    this.props.hideResultControl();
  }

  componentDidUpdate(prevProps) {
    if(prevProps.params.sectionId != this.props.params.sectionId){
      this.props.fetchSection(this.props.params.sectionId);
    }
  }

  render() {
    if(!this.props.section){
      return (
        <div>Loading..</div>
      );
    }
    return (
      <div className="container">
        <div className="row basic-bg">
          <div className="col-md-12">
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
                      publishers ={this.props.publishers}
                      resultStyle={this.props.resultStyle}
                      resultControlVisibility={this.props.resultControlVisibility}
                      toggleResultControl={this.props.toggleResultControl}
                     />
            <div className="col-md-12 showpage-comments-title">Public Comments:</div>
            <CommentList commentableType='Section' commentableId={this.props.section.id} />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const props = {
    currentUser: state.currentUser,
    stats: state.stats,
    section: denormalize(state.sections[ownProps.params.sectionId], sectionSchema, state),
    publishers: state.publishers,
    resultControlVisibility : state.displayStyle.resultControlVisibility,
    resultStyle : state.displayStyle.resultStyle
  };
  return props;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({setSteps, setStats, fetchSection, publishSection, addSectionToGroup, addPreferred, removePreferred,
    removeSectionFromGroup, deleteSection, updateSectionTags, hideResultControl, toggleResultControl, retireSection}, dispatch);
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
  deleteSection:  PropTypes.func,
  addSectionToGroup: PropTypes.func,
  removeSectionFromGroup: PropTypes.func,
  addPreferred: PropTypes.func,
  removePreferred: PropTypes.func,
  updateSectionTags: PropTypes.func,
  publishSection: PropTypes.func,
  retireSection: PropTypes.func,
  publishers: publishersProps,
  hideResultControl: PropTypes.func,
  toggleResultControl: PropTypes.func,
  displayStyle: PropTypes.object,
  resultStyle: PropTypes.string,
  resultControlVisibility: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(SectionShowContainer);
