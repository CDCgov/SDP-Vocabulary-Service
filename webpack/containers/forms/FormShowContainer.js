import React, { Component } from 'react';
import { denormalize } from 'normalizr';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchForm, publishForm, deleteForm } from '../../actions/form_actions';
import { setSteps } from '../../actions/tutorial_actions';
import { setStats } from '../../actions/landing';
import FormShow from '../../components/forms/FormShow';
import { formProps } from '../../prop-types/form_props';
import { formSchema } from '../../schema';
import CommentList from '../../containers/CommentList';
import currentUserProps from '../../prop-types/current_user_props';
import { publishersProps } from "../../prop-types/publisher_props";

class FormShowContainer extends Component {
  componentWillMount() {
    this.props.fetchForm(this.props.params.formId);
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
    if(prevProps.params.formId != this.props.params.formId){
      this.props.fetchForm(this.props.params.formId);
    }
  }

  // this.props.form.formQuestions doesn't have all the needed data
  // Also, if you just modify the props directly to add the data, things can break
  // So this function takes the form, clones it, then adds the extra data
  getCompleteForm(){
    var form = Object.assign({}, this.props.form);
    if (form.questions && form.formQuestions && form.formQuestions.length > 0) {
      form.formQuestions = this.props.form.formQuestions.map((fq) => {
        var formQuestion = Object.assign({}, form.questions.find(q => q.id === fq.questionId));
        formQuestion.programVar = fq.programVar || '';
        formQuestion.responseSets = [{name: 'None'}];
        if (fq.responseSetId) {
          var responseSet = form.responseSets.find(rs => rs.id === fq.responseSetId);
          if(responseSet) {
            formQuestion.responseSets = [responseSet];
          } else {
            formQuestion.responseSets = [{name: 'Loading...'}];
          }
        }
        return formQuestion;
      });
    }
    return form;
  }

  render() {
    if(!this.props.form){
      return (
        <div>Loading..</div>
      );
    }
    return (
      <div className="container">
        <div className="row basic-bg">
          <div className="col-md-12">
            <FormShow form={this.getCompleteForm()}
                      router={this.props.router}
                      currentUser={this.props.currentUser}
                      publishForm={this.props.publishForm}
                      stats={this.props.stats}
                      setStats={this.props.setStats}
                      deleteForm ={this.props.deleteForm}
                      publishers ={this.props.publishers} />
            <div className="col-md-12 showpage-comments-title">Public Comments:</div>
            <CommentList commentableType='Form' commentableId={this.props.form.id} />
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
    form: denormalize(state.forms[ownProps.params.formId], formSchema, state),
    publishers: state.publishers
  };
  return props;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({setSteps, setStats, fetchForm, publishForm, deleteForm}, dispatch);
}

FormShowContainer.propTypes = {
  form: formProps,
  params: PropTypes.object,
  router: PropTypes.object.isRequired,
  currentUser: currentUserProps,
  setSteps: PropTypes.func,
  setStats: PropTypes.func,
  stats: PropTypes.object,
  fetchForm: PropTypes.func,
  deleteForm:  PropTypes.func,
  publishForm: PropTypes.func,
  publishers: publishersProps
};

export default connect(mapStateToProps, mapDispatchToProps)(FormShowContainer);
