import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { surveyProps } from '../prop-types/survey_props';
import { formProps } from '../prop-types/form_props';
import SearchResult from './SearchResult';
import Errors from './Errors';
import ModalDialog from './ModalDialog';
import _ from 'lodash';

let AddedForms = ({survey, reorderForm, removeForm, forms}) => {
  let formsLookup = _.keyBy(forms, 'id');
  survey.surveyForms = survey.surveyForms || [];
  survey.version = survey.version || 1;
  return (
    <div id="added-forms" aria-label="Added">
    <div className="form-group">
      {survey.surveyForms.map((q, i) =>
        <div className="row" key={i}>
          <div className="col-md-9">
            <SearchResult form={formsLookup[q.formId]} index={i}
                          removeForm={removeForm}
                          reorderForm={reorderForm}
                          />
          </div>
          <div className="survey-group">
            <div className="col-md-3">
              <div className="btn btn-small btn-default move-up"
                   onClick={() => reorderForm(survey, i, 1)}>
                <i title="Move Up" className="fa fa fa-arrow-up"></i>
              </div>
              <div className="btn btn-small btn-default move-down"
                   onClick={() => reorderForm(survey, i, -1)}>
                <i className="fa fa fa-arrow-down" title="Move Down"></i>
              </div>
              <div className="btn btn-small btn-default"
                   onClick={() => removeForm(survey, i)}>
                <i className="fa fa fa-trash" title="Remove"></i>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

AddedForms.propTypes = {
  survey: surveyProps,
  forms: PropTypes.arrayOf(formProps),
  reorderForm: PropTypes.func.isRequired,
  removeForm: PropTypes.func.isRequired
};


class SurveyForm extends Component {

  stateForEdit(survey) {
    const id = survey.id;
    const name = survey.name || '';
    const version = survey.version;
    const showModal = false;
    const description = survey.description || '';
    const surveyForms = survey.surveyForms;
    const controlNumber = survey.controlNumber;
    const versionIndependentId = survey.versionIndependentId;
    return {surveyForms, name, id, version, versionIndependentId, controlNumber, description, showModal};
  }

  stateForRevise(survey) {
    var newState = this.stateForEdit(survey);
    newState.version += 1;
    return newState;
  }

  constructor(props) {
    super(props);
    // This switch is currently effectively a no-op but I retained the structure
    // from ResponseSetForm to make it easier to adapt in the future and be
    // consistent.
    switch (this.props.action) {
      case 'revise':
        this.state = this.stateForRevise(props.survey);
        break;
      case 'edit':
        this.state = this.stateForEdit(props.survey);
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
      let survey = Object.assign({}, this.state);
      survey.linkedForms = this.state.surveyForms.map((q) => q.formId);
      survey.linkedResponseSets = this.state.surveyForms.map((q) => q.responseSetId);
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
    survey.linkedForms = this.state.surveyForms.map((q) => q.formId);
    this.props.surveySubmitter(survey, (response) => {
      this.unsavedState = false;
      this.props.router.push(`/surveys/${response.data.id}`);
    }, (failureResponse) => {
      this.setState({errors: failureResponse.response.data});
    });
  }

  cancelButton() {
    if(this.props.survey && this.props.survey.id) {
      return(<Link className="btn btn-default pull-right" to={`/surveys/${this.props.survey.id}`}>Cancel</Link>);
    }
    return(<Link className="btn btn-default pull-right" to='/surveys/'>Cancel</Link>);
  }

  render() {
    return (
      <div className="col-md-8">
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
      <survey onSubmit={(e) => this.handleSubmit(e)}>
        <Errors errors={this.state.errors} />
          <div className="survey-inline">
            <button className="btn btn-default btn-sm" disabled><span className="fa fa-navicon"></span></button>
            <input className='btn btn-default pull-right' name="Save Survey" type="submit" value={`Save`}/>
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
                <label htmlFor="name" hidden>Name</label>
                <input className="input-format" placeholder="Name" type="text" value={this.state.name} name="name" id="name" onChange={this.handleChange('name')}/>
              </div>
            </div>
            <div className="row">
              <div className="survey-group col-md-8">
                <label htmlFor="description">Description</label>
                <input className="input-format" type="text" value={this.state.description || ''} name="description" id="description" onChange={this.handleChange('description')}/>
              </div>
              <div className="survey-group col-md-4">
                <label htmlFor="controlNumber">OMB Approval</label>
                <input className="input-format" type="text" value={this.state.controlNumber || ''} name="controlNumber" id="controlNumber" onChange={this.handleChange('controlNumber')}/>
              </div>
            </div>
          </div>
        </div>
        <AddedForms survey={this.state}
                    forms ={this.props.forms}
                    reorderForm={this.props.reorderForm}
                    removeForm ={this.props.removeForm} />
      </survey>
      </div>
      </div>
    );
  }
}

SurveyForm.propTypes = {
  survey: surveyProps,
  forms:  PropTypes.arrayOf(formProps).isRequired,
  action: PropTypes.string.isRequired,
  surveySubmitter: PropTypes.func.isRequired,
  removeForm:  PropTypes.func.isRequired,
  reorderForm: PropTypes.func.isRequired,
  route:  PropTypes.object.isRequired,
  router: PropTypes.object.isRequired
};

export default SurveyForm;
