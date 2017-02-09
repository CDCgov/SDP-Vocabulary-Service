import React, { Component, PropTypes } from 'react';
import {formProps} from '../prop-types/form_props';
import { responseSetProps } from '../prop-types/response_set_props';
import { questionProps } from '../prop-types/question_props';
import QuestionItem from './QuestionItem';

let AddedQuestions = ({form, reorderQuestion, removeQuestion, responseSets, handleResponseSetChange, questions}) => {
  return (
    <div id="added-questions" aria-label="Added">
    <div className="question-group">
      <div className="row">
        <div className="col-md-1"><b>ID</b></div>
          <div>
            <div className="col-md-5"><b>Content</b></div>
            <div className="col-md-6"><b>Response Sets</b></div>
          </div>
      </div>
      <br/>
      {questions.map((q, i) =>
        <div className="row" key={q.id}>
          <QuestionItem question={q} responseSets={responseSets} index={i}
                        removeQuestion={removeQuestion}
                        reorderQuestion={reorderQuestion} handleResponseSetChange={handleResponseSetChange}/>
          <div className="col-md-3">
            <div className="btn btn-small btn-default move-up"
                 onClick={() => reorderQuestion(form, i, 1)}>
              <b>Move Up</b>
            </div>
            <div className="btn btn-small btn-default move-down"
                 onClick={() => reorderQuestion(form, i, -1)}>
              <b>Move Down</b>
            </div>
            <div className="btn btn-small btn-default"
                 onClick={() => removeQuestion(form, i)}>
              <b>Remove</b>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

AddedQuestions.propTypes = {
  form: formProps,
  questions: PropTypes.arrayOf(questionProps),
  reorderQuestion: PropTypes.func.isRequired,
  removeQuestion: PropTypes.func.isRequired,
  handleResponseSetChange: PropTypes.func.isRequired,
  responseSets: PropTypes.arrayOf(responseSetProps)

};


class FormEdit extends Component {

  stateForRevise(form) {
    const id = form.id;
    const versionIndependentId = form.versionIndependentId;
    const version = form.version + 1;
    const name = form.name || '';
    const linkedQuestions = form.questions || [];
    let allQuestions = _.keyBy(this.props.questions, 'id');
    let questions = this.props.form.questions.map((q) =>  allQuestions[q.id]);
    return {name, questions, linkedQuestions, id, version, versionIndependentId};
  }



  constructor(props) {
    super(props);
    // This switch is currently effectively a no-op but I retained the structure
    //  from ResponseSetForm to make it easier to adapt in the future and be
    //  consistent.
    switch (this.props.action) {
      case 'revise':
        this.state = this.stateForRevise(props.form);
        break;
      default:
        this.state = this.stateForRevise({});
    }
  }

  componentWillUpdate(prevProps) {
    let allQuestions = _.keyBy(this.props.questions, 'id');
    let questions = prevProps.form.formQuestions.map((q) =>  {
      let formQuestion = allQuestions[q.questionId]
      formQuestion.responseSetId = q.responseSetId;
      return formQuestion;
    });
    if(!(JSON.stringify(questions) === JSON.stringify(this.state.questions))) {
      this.setState({questions});
    }
  }

  handleResponseSetChange(container) {
    // This function looks weird, we are passing the container all the way down so we can modify it from within subcomponents
    return () => {
      return (event) => {
        let index = parseInt(event.target.getAttribute("data-question"));
        let newState = Object.assign({}, container.state);
        newState.questions[index].responseSetId = event.target.value;
        debugger
        console.log(event.target.value);
        container.setState(newState);
        console.log(newState);
      };
    };
  }

  handleChange(field) {
    return (event) => {
      let newState = {};
      newState[field] = event.target.value;
      this.setState(newState);
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    // Because of the way we have to pass the current questions in we have to manually sync props and state for submit
    let form = Object.assign({}, this.state);
    form.linkedQuestions = this.props.form.questions.map((q) => q.id);
    form.linkedResponseSets = this.state.questions.map((q) => q.responseSetId);
    this.props.formSubmitter(form, (response) => {
      // TODO: Handle when the saving response set fails.
      if (response.status === 201) {
        this.props.router.push(`/forms/${response.data.id}`);
      }
    });
  }

  render() {

    return (
      <div className="col-md-8">
      <div className="col-md-8" id='form-div'>
      <form onSubmit={(e) => this.handleSubmit(e)}>
        <div className="row" id="form-button-div">
          <div className="col-md-2">
            <div className="btn btn-default btn-sm" disabled>
              <span className="fa fa-navicon"></span>
            </div>
          </div>
          <div className="col-md-7"></div>
          <div className="col-md-3">
            <div className="col-md-6">
              <div className="btn btn-default" disabled>Export</div>
            </div>
            <div className="col-md-6">
              <div className="actions">
                <input type="submit" value={`${this.props.action} Form`}/>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <hr />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <label htmlFor="name">Name:</label>
            <input type="text" value={this.state.name} name="name" id="name" onChange={this.handleChange('name')}/>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
          </div>
        </div>
        <b>Form Questions:</b>
        <AddedQuestions form={this.state}
          questions={this.state.questions}
          responseSets={this.props.responseSets}
          reorderQuestion={this.props.reorderQuestion}
          removeQuestion={this.props.removeQuestion}
          handleResponseSetChange={this.handleResponseSetChange(this)}
          />
      </form>
      </div>
      </div>
    );
  }
}

FormEdit.propTypes = {
  form: formProps,
  action: PropTypes.string.isRequired,
  formSubmitter: PropTypes.func.isRequired,
  reorderQuestion: PropTypes.func.isRequired,
  removeQuestion: PropTypes.func.isRequired,
  router: PropTypes.object.isRequired,
  responseSets: PropTypes.arrayOf(responseSetProps),
  questions: PropTypes.arrayOf(questionProps).isRequired



};

export default FormEdit;
