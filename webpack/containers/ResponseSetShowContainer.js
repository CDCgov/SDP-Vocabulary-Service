import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchResponseSet, publishResponseSet, deleteResponseSet, fetchResponseSetUsage } from '../actions/response_set_actions';
import { setSteps } from '../actions/tutorial_actions';
import ResponseSetDetails from '../components/ResponseSetDetails';
import { responseSetProps } from '../prop-types/response_set_props';
import { questionProps } from '../prop-types/question_props';
import CommentList from '../containers/CommentList';
import currentUserProps from "../prop-types/current_user_props";
import { publishersProps } from "../prop-types/publisher_props";
import _ from 'lodash';

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
        text: 'Click next to see a step by step walkthrough for using this page.',
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
        text: 'See all of the details including linked items on this section of the page. Use the buttons in the top right to do various actions with the content depending on your user permissions.',
        selector: '.maincontent',
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
            <ResponseSetDetails {...this.props} />
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
  props.responseSet = state.responseSets[ownProps.params.rsId];
  props.publishers = state.publishers;
  if (props.responseSet && props.responseSet.questions) {
    props.questions = _.compact(props.responseSet.questions.map((qId) => state.questions[qId]));
  }
  return props;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({setSteps, fetchResponseSet, publishResponseSet, deleteResponseSet, fetchResponseSetUsage}, dispatch);
}

ResponseSetShowContainer.propTypes = {
  responseSet: responseSetProps,
  currentUser: currentUserProps,
  questions: PropTypes.arrayOf(questionProps),
  fetchResponseSet: PropTypes.func,
  publishResponseSet: PropTypes.func,
  fetchResponseSetUsage: PropTypes.func,
  deleteResponseSet:  PropTypes.func,
  setSteps: PropTypes.func,
  params: PropTypes.object,
  router: PropTypes.object.isRequired,
  publishers: publishersProps
};

export default connect(mapStateToProps, mapDispatchToProps)(ResponseSetShowContainer);
