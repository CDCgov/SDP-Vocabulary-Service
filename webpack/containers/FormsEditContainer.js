import React, { Component, PropTypes } from 'react';
import FormList from '../components/FormList';
import Routes from '../routes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchForm, saveForm } from '../actions/form_actions';
import { removeQuestion, reorderQuestion, addQuestion } from '../actions/questions_actions';
import FormEdit from '../components/FormEdit';
import { fetchResponseSets } from '../actions/response_set_actions';
import { fetchQuestions } from '../actions/questions_actions';
import QuestionSearchContainer from './QuestionSearchContainer';
import { formProps } from '../prop-types/form_props';

class FormsContainer extends Component {
  componentWillMount() {
    this.props.fetchForm(this.props.params.formId);
    this.props.fetchResponseSets();
    this.props.fetchQuestions();
  }

  componentWillUpdate(nextProps) {
    if(this.props.params.formId != nextProps.params.formId) {
      console.debug("New Form");
    }
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

  )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchResponseSets, fetchQuestions, fetchForm, removeQuestion, reorderQuestion, saveForm}, dispatch);
}
function mapStateToProps(state, ownProps) {
  console.log("Map State");
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
  fetchQuestions: React.PropTypes.func.isRequired
};
export default connect(mapStateToProps, mapDispatchToProps)(FormsContainer);
