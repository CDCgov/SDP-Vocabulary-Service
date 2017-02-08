import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchForm, saveForm } from '../actions/form_actions';
import { removeQuestion, reorderQuestion } from '../actions/questions_actions';
import FormEdit from '../components/FormEdit';
import { fetchResponseSets } from '../actions/response_set_actions';
import { fetchQuestions } from '../actions/questions_actions';
import QuestionSearchContainer from './QuestionSearchContainer';
import { formProps } from '../prop-types/form_props';
import { questionsProps } from '../prop-types/question_props';
import { responseSetsProps } from '../prop-types/response_set_props';
import _ from 'lodash';

class FormsContainer extends Component {
  componentWillMount() {
    this.props.fetchForm(this.props.params.formId);
    this.props.fetchResponseSets();
    this.props.fetchQuestions();
  }

  render() {
    if(!this.props.form){
      return (
        <div>Loading...</div>
      );
    }
    return (
      <div className="container basic-bg">
        <div className="row">
          <div className="col-md-4">
          <QuestionSearchContainer
            allQs={this.props.questions}
            allRs={this.props.responseSets}
            addQuestion={this.props.addQuestion}
            form={this.props.form} />
          </div>
          <FormEdit form={this.props.form}
            responseSets={this.props.responseSets}
            reorderQuestion={this.props.reorderQuestion}
            removeQuestion={this.props.removeQuestion}
            action={this.props.params.action}
            formSubmitter={this.props.saveForm}
            router={this.props.router}
            />
        </div>
      </div>

    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchResponseSets, fetchQuestions, fetchForm, removeQuestion, reorderQuestion, saveForm}, dispatch);
}
function mapStateToProps(state, ownProps) {
  return {
    form: state.forms[ownProps.params.formId],
    responseSets: _.values(state.responseSets),
    questions: _.values(state.questions)
  };
}
FormsContainer.propTypes = {
  form: formProps,
  fetchForm: PropTypes.func,
  removeQuestion: React.PropTypes.func.isRequired,
  reorderQuestion: React.PropTypes.func.isRequired,
  fetchResponseSets: React.PropTypes.func.isRequired,
  fetchQuestions: React.PropTypes.func.isRequired,
  params: React.PropTypes.object.isRequired,
  questions: questionsProps,
  responseSets: responseSetsProps,
  addQuestion: React.PropTypes.func.isRequired,
  saveForm: React.PropTypes.func.isRequired,
  router: React.PropTypes.object.isRequired
};
export default connect(mapStateToProps, mapDispatchToProps)(FormsContainer);
