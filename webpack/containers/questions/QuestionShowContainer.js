import React, { Component } from 'react';
import { denormalize } from 'normalizr';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchQuestion, publishQuestion, addQuestionToGroup, deleteQuestion, fetchQuestionUsage } from '../../actions/questions_actions';
import { setSteps } from '../../actions/tutorial_actions';
import { setStats } from '../../actions/landing';
import { questionProps } from "../../prop-types/question_props";
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

  componentDidUpdate(prevProps){
    if(prevProps.params.qId !== this.props.params.qId){
      this.props.fetchQuestion(this.props.params.qId);
    } else {
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
    if(!this.props.question){
      return null;
    }
    return (
      <div className="container">
        <div className="row basic-bg">
          <div className="col-md-12">
            <QuestionShow question={this.props.question}
                             stats={this.props.stats}
                             setStats={this.props.setStats}
                             router={this.props.router}
                             currentUser={this.props.currentUser}
                             handlePublish={this.handlePublish.bind(this)}
                             deleteQuestion={this.props.deleteQuestion}
                             addQuestionToGroup={this.props.addQuestionToGroup}
                             publishers={this.props.publishers} />
            <div className="col-md-12 showpage-comments-title">Public Comments:</div>
            <CommentList commentableType='Question' commentableId={this.props.question.id} />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const props = {};
  props.question = denormalize(state.questions[ownProps.params.qId], questionSchema, state);
  props.currentUser = state.currentUser;
  props.publishers = state.publishers;
  props.stats = state.stats;
  return props;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchQuestion, deleteQuestion, addQuestionToGroup, fetchQuestionUsage, setSteps, setStats}, dispatch);
}

// Avoiding a lint error, but if you supply a question when you create this class, it will be ignored and overwritten!
QuestionShowContainer.propTypes = {
  question: questionProps,
  params:   PropTypes.object,
  router:   PropTypes.object,
  currentUser:   currentUserProps,
  fetchQuestion: PropTypes.func,
  fetchQuestionUsage: PropTypes.func,
  setSteps: PropTypes.func,
  setStats: PropTypes.func,
  stats: PropTypes.object,
  deleteQuestion: PropTypes.func,
  addQuestionToGroup: PropTypes.func,
  publishers: publishersProps
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionShowContainer);
