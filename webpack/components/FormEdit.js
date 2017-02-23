import React, { Component, PropTypes } from 'react';
import {formProps} from '../prop-types/form_props';
import { responseSetProps } from '../prop-types/response_set_props';
import { questionProps } from '../prop-types/question_props';
import QuestionItem from './QuestionItem';
import Errors from './Errors';
import _ from 'lodash';
import ModalDialog from './ModalDialog';

let AddedQuestions = ({form, reorderQuestion, removeQuestion, responseSets, handleResponseSetChange, questions}) => {
  let questionsLookup = _.keyBy(questions, 'id');
  form.formQuestions = form.formQuestions || [];
  form.version = form.version || 1;
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
      {form.formQuestions.map((q, i) =>
        <div className="row" key={i}>
          <QuestionItem question={questionsLookup[q.questionId]} responseSets={responseSets} index={i}
                        removeQuestion={removeQuestion}
                        reorderQuestion={reorderQuestion}
                        handleResponseSetChange={handleResponseSetChange}
                        responseSetId={q.responseSetId}
                        />
          <div className="col-md-3">
            <div className="btn btn-small btn-default move-up"
                 onClick={() => reorderQuestion(form, i, 1)}>
              <i title="Move Up" className="fa fa fa-arrow-up"></i>
            </div>
            <div className="btn btn-small btn-default move-down"
                 onClick={() => reorderQuestion(form, i, -1)}>
              <i className="fa fa fa-arrow-down" title="Move Down"></i>
            </div>
            <div className="btn btn-small btn-default"
                 onClick={() => removeQuestion(form, i)}>
              <i className="fa fa fa-trash" title="Remove"></i>
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
    const description = form.description || '';
    const formQuestions = form.formQuestions;
    const controlNumber = form.controlNumber;
    const showModal = false;
    return {formQuestions, name, id, version, versionIndependentId, controlNumber, description, showModal};
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
    this.unsavedState = false;
  }

  componentDidMount() {
    this.unbindHook = this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave.bind(this));
    window.onbeforeunload = this.windowWillUnload.bind(this);
  }

  componentWillUnmount() {
    this.unsavedState = false;
    this.unbindHook();
  }

  routerWillLeave(nextLocation) {
    this.setState({ showModal: this.unsavedState });
    this.nextLocation = nextLocation;
    return !this.unsavedState;
  }

  handleModalResponse(leavePage){
    this.setState({ showModal: false });
    if(leavePage){
      this.unsavedState = false;
      this.props.router.push(this.nextLocation.pathname);
    }else{
      let form = Object.assign({}, this.state);
      form.linkedQuestions = this.state.formQuestions.map((q) => q.questionId);
      form.linkedResponseSets = this.state.formQuestions.map((q) => q.responseSetId);
      this.props.formSubmitter(form, (response) => {
        // TODO: Handle when the saving form fails.
        this.unsavedState = false;
        if (response.status === 201) {
          this.props.router.push(this.nextLocation.pathname);
        }
      });
    }
  }

  windowWillUnload() {
    return (this.unsavedState || null);
  }

  handleResponseSetChange(container) {
    // This function looks weird, we are passing the container all the way down so we can modify it from within subcomponents
    return () => {
      return (event) => {
        let index = parseInt(event.target.getAttribute("data-question"));
        let newState = Object.assign({}, container.state);
        newState.formQuestions[index].responseSetId = event.target.value;
        container.setState(newState);
        this.unsavedState = true;
      };
    };
  }

  handleChange(field) {
    return (event) => {
      let newState = {};
      newState[field] = event.target.value;
      this.setState(newState);
      this.unsavedState = true;
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    // Because of the way we have to pass the current questions in we have to manually sync props and state for submit
    let form = Object.assign({}, this.state);
    form.linkedQuestions = this.state.formQuestions.map((q) => q.questionId);
    form.linkedResponseSets = this.state.formQuestions.map((q) => q.responseSetId);
    this.props.formSubmitter(form, (response) => {
      // TODO: Handle when the saving form fails.
      this.unsavedState = false;
      if (response.status === 201) {
        this.props.router.push(`/forms/${response.data.id}`);
      }
    }, (failureResponse) => {
      this.setState({errors: failureResponse.response.data});
    });
  }

  render() {
    return (
      <div className="col-md-6">
      <div className="" id='form-div'>
      <ModalDialog  show={this.state.showModal}
        title="Warning"
        subTitle="Unsaved Changes"
        warning={true}
        message="You are about to leave a page with unsaved changes. How would you like to proceed?"
        secondaryButtonMessage="Continue Without Saving"
        primaryButtonMessage="Save & Leave"
        cancelButtonMessage="Cancel"
        primaryButtonAction={()=> this.handleModalResponse(false)}
        cancelButtonAction ={()=> {
          this.props.router.push(this.props.route.path);
          this.setState({ showModal: false });
        }}
        secondaryButtonAction={()=> this.handleModalResponse(true)} />
      <form onSubmit={(e) => this.handleSubmit(e)}>
        <Errors errors={this.state.errors} />
          <div className="form-inline">
            <button className="btn btn-default btn-sm" disabled><span className="fa fa-navicon"></span></button>

            <input className='btn btn-default pull-right' name={`${this.props.action||'New'} Form`} type="submit" value={`Save`}/>
            <button className="btn btn-default pull-right" disabled>Export</button>
          </div>
        <div className="row">
          <div className="col-md-12">
            <hr />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input className="form-control" type="text" value={this.state.name} name="name" id="name" onChange={this.handleChange('name')}/>
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <input className="form-control" type="text" value={this.state.description} name="description" id="description" onChange={this.handleChange('description')}/>
            </div>
            <div className="form-group">
              <label htmlFor="controlNumber">OMB Approval:</label>
              <input className="form-control" type="text" value={this.state.controlNumber} name="controlNumber" id="controlNumber" onChange={this.handleChange('controlNumber')}/>
            </div>

          </div>
        </div>
        <AddedQuestions form={this.state}
          questions={this.props.questions}
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
  form:   formProps,
  action: PropTypes.string.isRequired,
  formSubmitter:   PropTypes.func.isRequired,
  reorderQuestion: PropTypes.func.isRequired,
  removeQuestion:  PropTypes.func.isRequired,
  route:  PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  responseSets: PropTypes.arrayOf(responseSetProps),
  questions: PropTypes.arrayOf(questionProps).isRequired
};

export default FormEdit;
