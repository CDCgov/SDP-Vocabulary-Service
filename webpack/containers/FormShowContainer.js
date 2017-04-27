import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchForm, publishForm, deleteForm } from '../actions/form_actions';
import { fetchQuestions } from '../actions/questions_actions';
import { fetchResponseSets } from '../actions/response_set_actions';
import FormShow from '../components/FormShow';
import { formProps } from '../prop-types/form_props';
import { questionsProps } from '../prop-types/question_props';
import { responseSetsProps } from '../prop-types/response_set_props';
import CommentList from '../containers/CommentList';
import currentUserProps from '../prop-types/current_user_props';
import { publishersProps } from "../prop-types/publisher_props";

class FormShowContainer extends Component {
  componentWillMount() {
    this.props.fetchForm(this.props.params.formId);
    this.props.fetchQuestions();
    this.props.fetchResponseSets();
  }

  componentDidUpdate(prevProps) {
    if(prevProps.params.formId != this.props.params.formId){
      this.props.fetchForm(this.props.params.formId);
      this.props.fetchQuestions();
      this.props.fetchResponseSets();
    }
  }

  // this.props.form.formQuestions doesn't have all the needed data
  // Also, if you just modify the props directly to add the data, things can break
  // So this function takes the form, clones it, then adds the extra data
  getCompleteForm(){
    var form = Object.assign({}, this.props.form);
    if (form.formQuestions && form.formQuestions.length > 0) {
      form.formQuestions = this.props.form.formQuestions.map((fq) => {
        var formQuestion = Object.assign({}, this.props.questions[fq.questionId]);
        formQuestion.programVar = fq.programVar || '';
        formQuestion.responseSets = [{name: 'None'}];
        if (fq.responseSetId) {
          if(this.props.responseSets[fq.responseSetId]) {
            formQuestion.responseSets = [this.props.responseSets[fq.responseSetId]];
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
    responseSets: state.responseSets,
    questions: state.questions,
    form: state.forms[ownProps.params.formId],
    publishers: state.publishers
  };
  return props;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchForm, fetchQuestions, fetchResponseSets, publishForm, deleteForm}, dispatch);
}

FormShowContainer.propTypes = {
  form: formProps,
  questions: questionsProps,
  responseSets: responseSetsProps,
  params: PropTypes.object,
  router: PropTypes.object.isRequired,
  currentUser: currentUserProps,
  fetchForm: PropTypes.func,
  fetchQuestions: PropTypes.func,
  fetchResponseSets: PropTypes.func,
  deleteForm:  PropTypes.func,
  publishForm: PropTypes.func,
  publishers: publishersProps
};

export default connect(mapStateToProps, mapDispatchToProps)(FormShowContainer);
