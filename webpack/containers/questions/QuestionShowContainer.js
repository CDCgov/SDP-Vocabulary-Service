import React, { Component } from 'react';
import { denormalize } from 'normalizr';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-bootstrap';
import { hashHistory } from 'react-router';

import { fetchQuestion, publishQuestion, retireQuestion, addQuestionToGroup, updateStageQuestion, removeQuestionFromGroup, deleteQuestion, fetchQuestionUsage, fetchQuestionParents, updateQuestionTags } from '../../actions/questions_actions';
import { setSteps } from '../../actions/tutorial_actions';
import { setStats } from '../../actions/landing';
import { addPreferred, removePreferred } from '../../actions/preferred_actions';
import { addBreadcrumbItem } from '../../actions/breadcrumb_actions';
import { questionProps } from "../../prop-types/question_props";
import LoadingSpinner from '../../components/LoadingSpinner';
import BasicAlert from '../../components/BasicAlert';
import NotFoundAlert from '../../containers/NotFoundAlert';
import QuestionShow  from '../../components/questions/QuestionShow';
import { questionSchema } from '../../schema';
import CommentList from '../../containers/CommentList';
import currentUserProps from "../../prop-types/current_user_props";
import { publishersProps } from "../../prop-types/publisher_props";

class QuestionShowContainer extends Component {

  componentWillMount() {
    this.props.fetchQuestion(this.props.params.qId);
  }

  componentDidMount() {
    if (this.props.question && this.props.question.status === 'published') {
      this.props.fetchQuestionUsage(this.props.params.qId);
    }
    if (this.props.question) {
      this.props.fetchQuestionParents(this.props.params.qId);
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
  }

  componentDidUpdate(prevProps){
    if(prevProps.params.qId !== this.props.params.qId){
      this.props.fetchQuestion(this.props.params.qId);
    } else {
      if (this.props.question && this.props.question.parentItems === undefined) {
        this.props.fetchQuestionParents(this.props.params.qId);
      }
      if (this.props.question && this.props.question.status === 'published' &&
          this.props.question.surveillancePrograms === undefined) {
        this.props.fetchQuestionUsage(this.props.params.qId);
      }
    }
  }

  handlePublish(q){
    publishQuestion(q.id, (response) => {
      this.props.fetchQuestion(response.data.id);
    });
  }

  render() {

    if(!this.props.question || this.props.isLoading || this.props.loadStatus == 'failure'){
      return (
              <Grid className="basic-bg questionShowContainer">
                <div>
                  <div className="showpage_header_container no-print">
                    <ul className="list-inline">
                      <li className="showpage_button"><span className="fa fa-arrow-left fa-2x" aria-hidden="true" onClick={hashHistory.goBack}></span></li>
                      <li className="showpage_title"><h1>Question Details</h1></li>
                    </ul>
                  </div>
                </div>
                <Row>
                  <Col xs={12}>
                      <div className="main-content">
                        {this.props.isLoading && <LoadingSpinner msg="Loading question..." />}
                        {this.props.loadStatus == 'failure' &&
                          <NotFoundAlert msg={this.props.loadStatusText} severity='danger' type='Question' id={this.props.params.qId} />
                        }
                        {this.props.loadStatus == 'success' &&
                         <BasicAlert msg="Sorry, there is a problem loading this question." severity='warning' />
                        }
                      </div>
                  </Col>
                </Row>
              </Grid>
      );
    }

    return (
      <Grid className="basic-bg">
        <QuestionShow question={this.props.question}
                         stats={this.props.stats}
                         setStats={this.props.setStats}
                         router={this.props.router}
                         currentUser={this.props.currentUser}
                         handlePublish={this.handlePublish.bind(this)}
                         retireQuestion={this.props.retireQuestion}
                         deleteQuestion={this.props.deleteQuestion}
                         addQuestionToGroup={this.props.addQuestionToGroup}
                         removeQuestionFromGroup={this.props.removeQuestionFromGroup}
                         updateStageQuestion={this.props.updateStageQuestion}
                         fetchQuestion={this.props.fetchQuestion}
                         addPreferred={this.props.addPreferred}
                         removePreferred={this.props.removePreferred}
                         updateQuestionTags={this.props.updateQuestionTags}
                         publishers={this.props.publishers}
                         addBreadcrumbItem={this.props.addBreadcrumbItem}
                         isLoading={this.props.isLoading}
                         loadStatus={this.props.loadStatus}
                         loadStatusText={this.props.loadStatusText}
                        />
        <div className="showpage-comments-title">Public Comments:</div>
        <CommentList commentableType='Question' commentableId={this.props.question.id} />
      </Grid>
    );
  }
}

function mapStateToProps(state, ownProps) {
  let q = {};
  if (state.questions[ownProps.params.qId] && state.questions[ownProps.params.qId].responseSets && typeof state.questions[ownProps.params.qId].responseSets[0] !== 'object') {
    q = denormalize(state.questions[ownProps.params.qId], questionSchema, state);
  } else {
    q = state.questions[ownProps.params.qId];
  }
  const props = {};
  props.question = q;
  props.currentUser = state.currentUser;
  props.publishers = state.publishers;
  props.stats = state.stats;
  props.isLoading = state.ajaxStatus.question.isLoading;
  props.loadStatus = state.ajaxStatus.question.loadStatus;
  props.loadStatusText = state.ajaxStatus.question.loadStatusText;
  return props;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchQuestion, deleteQuestion, addQuestionToGroup, addPreferred, removePreferred, updateStageQuestion,
    removeQuestionFromGroup, fetchQuestionUsage, fetchQuestionParents, setSteps, setStats, updateQuestionTags, retireQuestion, addBreadcrumbItem}, dispatch);
}

// Avoiding a lint error, but if you supply a question when you create this class, it will be ignored and overwritten!
QuestionShowContainer.propTypes = {
  question: questionProps,
  params:   PropTypes.object,
  router:   PropTypes.object,
  currentUser:   currentUserProps,
  fetchQuestion: PropTypes.func,
  fetchQuestionUsage: PropTypes.func,
  fetchQuestionParents: PropTypes.func,
  updateQuestionTags: PropTypes.func,
  updateStageQuestion: PropTypes.func,
  addBreadcrumbItem: PropTypes.func,
  retireQuestion: PropTypes.func,
  setSteps: PropTypes.func,
  setStats: PropTypes.func,
  stats: PropTypes.object,
  deleteQuestion: PropTypes.func,
  addQuestionToGroup: PropTypes.func,
  removeQuestionFromGroup: PropTypes.func,
  addPreferred: PropTypes.func,
  removePreferred: PropTypes.func,
  isLoading: PropTypes.bool,
  loadStatus : PropTypes.string,
  loadStatusText : PropTypes.string,
  publishers: publishersProps
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionShowContainer);
