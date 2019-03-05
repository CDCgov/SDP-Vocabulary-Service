import React, { Component } from 'react';
import { denormalize } from 'normalizr';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { hashHistory } from 'react-router';

import { Grid, Row, Col } from 'react-bootstrap';
import { fetchResponseSet, fetchMoreResponses, publishResponseSet, retireResponseSet,
         updateStageResponseSet, addResponseSetToGroup, removeResponseSetFromGroup, deleteResponseSet,
         fetchResponseSetUsage, updateResponseSetTags } from '../../actions/response_set_actions';
import { setSteps } from '../../actions/tutorial_actions';
import { setStats } from '../../actions/landing';
import { addPreferred, removePreferred } from '../../actions/preferred_actions';
import { addBreadcrumbItem } from '../../actions/breadcrumb_actions';
import LoadingSpinner from '../../components/LoadingSpinner';
import BasicAlert from '../../components/BasicAlert';
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
    if(this.props.responseSet === undefined || this.props.responseSet.name === undefined || this.props.isLoading || this.props.loadStatus == 'failure'){
      return (
              <Grid className="basic-bg">
                <div>
                  <div className="showpage_header_container no-print">
                    <ul className="list-inline">
                      <li className="showpage_button"><span className="fa fa-arrow-left fa-2x" aria-hidden="true" onClick={hashHistory.goBack}></span></li>
                      <li className="showpage_title"><h1>Response Set Details</h1></li>
                    </ul>
                  </div>
                </div>
                <Row>
                  <Col xs={12}>
                      <div className="main-content">
                        {this.props.isLoading && <LoadingSpinner msg="Loading response set..." />}
                        {this.props.loadStatus == 'failure' &&
                          <BasicAlert msg={this.props.loadStatusText} severity='danger' />
                        }
                        {this.props.loadStatus == 'success' &&
                         <BasicAlert msg="Sorry, there is a problem loading this response set." severity='warning' />
                        }
                      </div>
                  </Col>
                </Row>
              </Grid>
      );
    }
    return (
      <Grid className="basic-bg">
        <ResponseSetShow {...this.props} />
        <div className="showpage-comments-title">Public Comments:</div>
        <CommentList commentableType='ResponseSet' commentableId={this.props.responseSet.id} />
      </Grid>
    );
  }
}

function mapStateToProps(state, ownProps) {
  let rs = {};
  if (state.responseSets[ownProps.params.rsId] && state.responseSets[ownProps.params.rsId].questions && typeof state.responseSets[ownProps.params.rsId].questions[0] === 'number') {
    rs = denormalize(state.responseSets[ownProps.params.rsId], responseSetSchema, state);
  } else {
    rs = state.responseSets[ownProps.params.rsId];
  }
  const props = {};
  props.currentUser = state.currentUser;
  props.responseSet = rs;
  props.publishers = state.publishers;
  props.stats = state.stats;
  props.isLoading = state.ajaxStatus.responseSet.isLoading;
  props.loadStatus = state.ajaxStatus.responseSet.loadStatus;
  props.loadStatusText = state.ajaxStatus.responseSet.loadStatusText;
  return props;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({setSteps, setStats, fetchResponseSet, publishResponseSet, addPreferred, removePreferred, fetchMoreResponses, updateResponseSetTags,
    addResponseSetToGroup, removeResponseSetFromGroup, deleteResponseSet, updateStageResponseSet, fetchResponseSetUsage, retireResponseSet, addBreadcrumbItem}, dispatch);
}

ResponseSetShowContainer.propTypes = {
  responseSet: responseSetProps,
  currentUser: currentUserProps,
  fetchResponseSet: PropTypes.func,
  fetchMoreResponses: PropTypes.func,
  publishResponseSet: PropTypes.func,
  retireResponseSet: PropTypes.func,
  fetchResponseSetUsage: PropTypes.func,
  updateResponseSetTags: PropTypes.func,
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
  isLoading: PropTypes.bool,
  loadStatus : PropTypes.string,
  loadStatusText : PropTypes.string,
  publishers: publishersProps
};

export default connect(mapStateToProps, mapDispatchToProps)(ResponseSetShowContainer);
