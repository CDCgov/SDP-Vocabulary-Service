import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { surveyProps } from '../prop-types/survey_props';
import { formsProps } from '../prop-types/form_props';
import { questionsProps } from "../prop-types/question_props";
import SurveyFormList from './SurveyFormList';
import Errors from './Errors';
import ModalDialog from './ModalDialog';

class SurveyEdit extends Component {

  stateForNew() {
    return {
      id: null,
      name: '',
      version: 1,
      showModal: false,
      description: '',
      surveyForms: [],
      controlNumber: null,
      versionIndependentId: null
    };
  }

  stateForExtend(survey) {
    var state = this.stateForEdit(survey);
    state.id = null;
    state.versionIndependentId = null;
    state.version = 1;
    state.parentId = survey.id;
    state.controlNumber = '';
    return state;
  }

  stateForEdit(survey) {
    var newState = this.stateForNew();
    newState.id = survey.id;
    newState.name = survey.name || '';
    newState.version = survey.version;
    newState.description = survey.description || '';
    newState.surveyForms = survey.surveyForms || [];
    newState.controlNumber = survey.controlNumber;
    newState.parentId = survey.parent ? survey.parent.id : '';
    newState.versionIndependentId = survey.versionIndependentId;
    return newState;
  }

  stateForRevise(survey) {
    var newState = this.stateForEdit(survey);
    newState.version += 1;
    return newState;
  }

  constructor(props) {
    super(props);
    switch (this.props.action) {
      case 'revise':
        this.state = this.stateForRevise(props.survey);
        break;
      case 'extend':
        this.state = this.stateForExtend(props.survey);
        break;
      case 'edit':
        this.state = this.stateForEdit(props.survey);
        break;
      default:
        this.state = this.stateForNew();
    }
    this.unsavedState = false;
    this.lastFormCount = this.state.surveyForms.length;
  }

  componentDidMount() {
    this.unbindHook = this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave.bind(this));
    window.onbeforeunload = this.windowWillUnload.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.lastFormCount !== prevState.surveyForms.length) {
      this.unsavedState  = true;
      this.lastFormCount = prevState.surveyForms.length;
    }
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
      let survey = Object.assign({}, this.state);
      // Because we were saving SurveyForms with null positions for a while, we need to explicitly set position here to avoid sending a null position back to the server
      // At some point, we can remove this code
      survey.linkedForms = this.state.surveyForms.map((f, i) => ({id: f.id, surveyId: f.surveyId, formId: f.formId, position: i}));
      this.props.surveySubmitter(survey, (response) => {
        // TODO: Handle when the saving survey fails.
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
    // Because of the way we have to pass the current forms in we have to manually sync props and state for submit
    let survey = Object.assign({}, this.state);
    survey.linkedForms = this.state.surveyForms;
    this.props.surveySubmitter(survey, (response) => {
      this.unsavedState = false;
      this.props.router.push(`/surveys/${response.data.id}`);
    }, (failureResponse) => {
      this.setState({errors: failureResponse.response.data});
    });
  }

  cancelButton() {
    if(this.props.survey && this.props.survey.id) {
      return(<Link tabIndex="3" className="btn btn-default pull-right" to={`/surveys/${this.props.survey.id}`}>Cancel</Link>);
    }
    return(<Link tabIndex="3" className="btn btn-default pull-right" to='/'>Cancel</Link>);
  }

  render() {
    if(!this.props.forms){
      return ('Loading');
    }
    return (
      <div className="col-md-7 survey-edit-details">
      <div className="" id='survey-div'>
      <ModalDialog  show ={this.state.showModal}
                    title="Warning"
                    subTitle="Unsaved Changes"
                    warning ={true}
                    message ="You are about to leave a page with unsaved changes. How would you like to proceed?"
                    secondaryButtonMessage="Continue Without Saving"
                    primaryButtonMessage="Save & Leave"
                    cancelButtonMessage="Cancel"
                    primaryButtonAction={() => this.handleModalResponse(false)}
                    cancelButtonAction ={() => {
                      this.props.router.push(this.props.route.path);
                      this.setState({ showModal: false });
                    }}
                    secondaryButtonAction={() => this.handleModalResponse(true)} />
      <form onSubmit={(e) => this.handleSubmit(e)}>
        <Errors errors={this.state.errors} />
          <div className="survey-inline">
            <button tabIndex="3" className="btn btn-default btn-sm" disabled><span className="fa fa-navicon"></span><span className="sr-only">Edit Action Menu</span></button>
            <input tabIndex="3" className='btn btn-default pull-right' name="Save Survey" type="submit" value={`Save`}/>
            {this.cancelButton()}
          </div>
        <div className="row">
          <div className="col-md-12">
            <hr />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="row">
              <div className="survey-group col-md-12">
                <label htmlFor="survey-name" hidden>Name</label>
                <input tabIndex="3" className="input-format" placeholder="Name" type="text" value={this.state.name} name="survey-name" id="survey-name" onChange={this.handleChange('name')}/>
              </div>
            </div>
            <div className="row">
              <div className="survey-group col-md-8">
                <label htmlFor="survey-description">Description</label>
                <input tabIndex="3" className="input-format" type="text" value={this.state.description || ''} name="survey-description" id="survey-description" onChange={this.handleChange('description')}/>
              </div>
              <div className="survey-group col-md-4">
                <label htmlFor="controlNumber">OMB Approval</label>
                <input tabIndex="3" className="input-format" placeholder="XXXX-XXXX" type="text" value={this.state.controlNumber || ''} name="controlNumber" id="controlNumber" onChange={this.handleChange('controlNumber')}/>
              </div>
            </div>
          </div>
        </div>
        <SurveyFormList survey={this.state}
                        forms ={this.props.forms}
                        questions  ={this.props.questions}
                        reorderForm={this.props.reorderForm}
                        removeForm ={this.props.removeForm} />
      </form>
      </div>
      </div>
    );
  }
}

SurveyEdit.propTypes = {
  survey: surveyProps,
  forms:  formsProps.isRequired,
  questions:  questionsProps.isRequired,
  action: PropTypes.string.isRequired,
  surveySubmitter: PropTypes.func.isRequired,
  removeForm:  PropTypes.func.isRequired,
  reorderForm: PropTypes.func.isRequired,
  route:  PropTypes.object.isRequired,
  router: PropTypes.object.isRequired
};

export default SurveyEdit;
