import React, { Component } from 'react';
import { denormalize } from 'normalizr';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchResponseSet, publishResponseSet, retireResponseSet, updateStageResponseSet, addResponseSetToGroup, removeResponseSetFromGroup, deleteResponseSet, fetchResponseSetUsage } from '../../actions/response_set_actions';
import { setSteps } from '../../actions/tutorial_actions';
import { setStats } from '../../actions/landing';
import { addPreferred, removePreferred } from '../../actions/preferred_actions';
import ResponseSetShow from '../../components/response_sets/ResponseSetShow';
import { responseSetProps } from '../../prop-types/response_set_props';
import { responseSetSchema } from '../../schema';
import CommentList from '../../containers/CommentList';
import currentUserProps from "../../prop-types/current_user_props";
import { publishersProps } from "../../prop-types/publisher_props";

class ResponseSetShowContainer extends Component {
  componentWillMount() {
    this.props.fetchResponseSet(this.props.params.rsId);
  }

  componentDidMount() {
    if (this.props.responseSet && this.props.responseSet.status === 'published') {
      this.props.fetchResponseSetUsage(this.props.params.rsId);
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
        text: 'At the bottom of each details page is a section for public comments. People can view and respond to these comments in threads on published content.',
        selector: '.showpage-comments-title',
        position: 'top',
      }]);
  }

  componentDidUpdate(prevProps) {
    if(prevProps.params.rsId != this.props.params.rsId){
      this.props.fetchResponseSet(this.props.params.rsId);
    } else {
      if (this.props.responseSet && this.props.responseSet.status === 'published' &&
          this.props.responseSet.surveillancePrograms === undefined) {
        this.props.fetchResponseSetUsage(this.props.params.rsId);
      }
    }
  }

  render() {
    if(this.props.responseSet === undefined || this.props.responseSet.name === undefined){
      return (
        <div>Loading..</div>
      );
    }
    return (
      <div className="container">
        <div className="row basic-bg">
          <div className="col-md-12">
            <ResponseSetShow {...this.props} />
            <div className="col-md-12 showpage-comments-title">Public Comments:</div>
            <CommentList commentableType='ResponseSet' commentableId={this.props.responseSet.id} />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const props = {};
  props.currentUser = state.currentUser;
  props.responseSet = denormalize(state.responseSets[ownProps.params.rsId], responseSetSchema, state);
  props.publishers = state.publishers;
  props.stats = state.stats;
  return props;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({setSteps, setStats, fetchResponseSet, publishResponseSet, addPreferred, removePreferred,
    addResponseSetToGroup, removeResponseSetFromGroup, deleteResponseSet, updateStageResponseSet, fetchResponseSetUsage, retireResponseSet}, dispatch);
}

ResponseSetShowContainer.propTypes = {
  responseSet: responseSetProps,
  currentUser: currentUserProps,
  fetchResponseSet: PropTypes.func,
  publishResponseSet: PropTypes.func,
  retireResponseSet: PropTypes.func,
  fetchResponseSetUsage: PropTypes.func,
  deleteResponseSet:  PropTypes.func,
  addResponseSetToGroup: PropTypes.func,
  removeResponseSetFromGroup: PropTypes.func,
  updateStageResponseSet: PropTypes.func,
  addPreferred: PropTypes.func,
  removePreferred: PropTypes.func,
  setSteps: PropTypes.func,
  setStats: PropTypes.func,
  stats: PropTypes.object,
  params: PropTypes.object,
  router: PropTypes.object.isRequired,
  publishers: publishersProps
};

export default connect(mapStateToProps, mapDispatchToProps)(ResponseSetShowContainer);
