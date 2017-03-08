import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchForm, saveForm, newForm, saveDraftForm } from '../actions/form_actions';
import { removeQuestion, reorderQuestion, fetchQuestion, fetchQuestions } from '../actions/questions_actions';
import FormEdit from '../components/FormEdit';
import { fetchResponseSets }   from '../actions/response_set_actions';
import QuestionModalContainer  from './QuestionModalContainer';
import QuestionSearchContainer from './QuestionSearchContainer';
import { formProps } from '../prop-types/form_props';
import { questionProps } from '../prop-types/question_props';
import { responseSetProps } from '../prop-types/response_set_props';
import {Button} from 'react-bootstrap';
import _ from 'lodash';

class FormsEditContainer extends Component {

  constructor(props) {
    super(props);
    let selectedFormSaver = this.props.saveForm;
    if (this.props.params.formId) {
      this.props.fetchForm(this.props.params.formId);
      if (this.props.params.action === 'edit') {
        selectedFormSaver = this.props.saveDraftForm;
      }
    } else {
      this.props.newForm();
      this.props.params.formId = 0;
      this.props.params.action = 'new';
    }
    this.state = {selectedFormSaver: selectedFormSaver, showQuestionModal: false};
    this.closeQuestionModal  = this.closeQuestionModal.bind(this);
    this.saveQuestionSuccess = this.saveQuestionSuccess.bind(this);
  }

  componentWillMount() {
    this.props.fetchResponseSets();
    this.props.fetchQuestions();
  }

  componentDidUpdate(prevProps) {
    if(prevProps.params.formId != this.props.params.formId){
      this.props.fetchForm(this.props.params.formId);
    }
    if(this.props.form && this.props.form.formQuestions) {
      this.refs.form.setState(Object.assign(this.refs.form.state, {formQuestions: this.props.form.formQuestions}));
    }
  }

  closeQuestionModal(){
    this.setState({showQuestionModal: false});
  }

  saveQuestionSuccess(successResponse){
    this.setState({showQuestionModal: false});
    this.props.fetchQuestion(successResponse.data.id);
  }

  render() {
    if(!this.props.form || !this.props.questions){
      return (
        <div>Loading...</div>
      );
    }
    return (
      <div className="container basic-bg form-edit-container">
      <QuestionModalContainer showModal={this.state.showQuestionModal}
                              closeQuestionModal={()=>this.setState({showQuestionModal: false})}
                              route={this.props.route}
                              router={this.props.router}
                              saveQuestionSuccess={this.saveQuestionSuccess}/>
        <div className="row">
          <h2>{_.capitalize(this.props.params.action)} Form </h2>
          <div className="col-md-6">
            <div className="row add-question">
              <Button onClick={()=>this.setState({showQuestionModal: true})} bsStyle="primary">Add New Question</Button>
            </div>
          <QuestionSearchContainer
            allQs={this.props.questions}
            allRs={this.props.responseSets}
            form={this.props.form} />
          </div>
          <FormEdit form={this.props.form}
            responseSets={this.props.responseSets}
            reorderQuestion={this.props.reorderQuestion}
            removeQuestion={this.props.removeQuestion}
            action={this.props.params.action || 'new'}
            formSubmitter={this.state.selectedFormSaver}
            route={this.props.route}
            router={this.props.router}
            questions={this.props.questions}
            ref='form'
            />
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchResponseSets, fetchQuestions, fetchQuestion,
    newForm, fetchForm, removeQuestion, reorderQuestion,
    saveForm, saveDraftForm}, dispatch);
}

function mapStateToProps(state, ownProps) {
  return {
    form: state.forms[ownProps.params.formId||0],
    responseSets: _.values(state.responseSets),
    questions: _.values(state.questions)
  };
}

FormsEditContainer.propTypes = {
  form: formProps,
  newForm: PropTypes.func,
  saveForm: PropTypes.func,
  fetchForm: PropTypes.func,
  fetchQuestion:  PropTypes.func,
  fetchQuestions: PropTypes.func,
  removeQuestion: PropTypes.func,
  reorderQuestion: PropTypes.func,
  fetchResponseSets: PropTypes.func,
  params: PropTypes.object.isRequired,
  questions: PropTypes.arrayOf(questionProps),
  responseSets: PropTypes.arrayOf(responseSetProps),
  saveDraftForm: PropTypes.func,
  route:  PropTypes.object.isRequired,
  router: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(FormsEditContainer);
