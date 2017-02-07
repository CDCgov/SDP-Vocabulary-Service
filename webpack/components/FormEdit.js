import React, { Component } from 'react';
import {formProps} from '../prop-types/form_props';
import QuestionItem from './QuestionItem';
import Routes from '../routes';

let AddedQuestions = ({form, reorderQuestion, removeQuestion, responseSets}) => {
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
      {form.questions.map((q, i) =>
        <div className="row" key={q.id}>
          <QuestionItem question={q} responseSets={responseSets} index={i}
                        removeQuestion={removeQuestion}
                        reorderQuestion={reorderQuestion}/>
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
  )
}


class FormEdit extends Component {

  stateForRevise(form) {
    const id = form.id;
    const versionIndependentId = form.versionIndependentId;
    const version = form.version + 1;
    const name = form.name || '';
    const linkedQuestions = form.questions || [];
    return {name, linkedQuestions, id, version, versionIndependentId}
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
    let form = Object.assign({}, this.state)
    form.linkedQuestions = this.props.form.questions.map((q) => q.id)
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
        <AddedQuestions form={this.props.form}
          responseSets={this.props.responseSets}
          reorderQuestion={this.props.reorderQuestion}
          removeQuestion={this.props.removeQuestion}/>
      </form>
      </div>
      </div>
    )
  }
}


export default FormEdit;
