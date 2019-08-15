import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setSteps } from '../../actions/tutorial_actions';
import { createImportSession, updateImportSession, attemptImportFile } from '../../actions/survey_actions';
import LoadingSpinner from '../../components/LoadingSpinner';

class SurveyImportContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileValid: false,
      importAttempted: false,
      importSessionId: null,
      importErrors: [],
      importWarnings: ['Attempting Import...'],
      importFailure: null,
      fileFormatCheck: null,
      file: null,
      survey: {},
      fileChosen: false,
      filePromiseReturned: false,
      importType: "generic" //make sure that value matches with default clicked value
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.attemptImport = this.attemptImport.bind(this);
    this.cancelImport = this.cancelImport.bind(this);
    this.changeFormat = this.changeFormat.bind(this); //provide mechanism to bind the event to state object
  }

  componentDidMount() {
    this.props.setSteps([
      {
        title: 'Help',
        text: 'Click next to see a step by step walkthrough for using this page. To see more detailed information about this application and actions you can take <a class="tutorial-link" href="#help">click here to view the full Help Documentation.</a> Accessible versions of these steps are also duplicated in the help documentation.',
        selector: '.help-link',
        position: 'bottom',
      }]);
  }

  onFormSubmit(e){
    e.preventDefault(); // Stop form submit
  }

  onChange(e) {
    if (this.state.importSessionId) {
      this.props.updateImportSession(this.state.importSessionId, e.target.files[0], this.state.importType, (successResponse) => {
        this.setState({importErrors: successResponse.data.importErrors, importWarnings: successResponse.data.importWarnings, importSessionId: successResponse.data.id, filePromiseReturned: true});
      },(error) => {
        this.setState({importErrors: [error.message],filePromiseReturned: true});
      });
    } else {
      this.props.createImportSession(e.target.files[0], this.state.importType, (successResponse) => {
        this.setState({importErrors: successResponse.data.importErrors, importWarnings: successResponse.data.importWarnings, importSessionId: successResponse.data.id, filePromiseReturned: true});
      },(error) => {
        this.setState({importErrors: [error.message],filePromiseReturned: true});
      });
    }
    this.setState({file: e.target.files[0], fileChosen: true});
  }

  //takes the onclick event - returns the target value to the state object.
  changeFormat(e) {
    this.setState({importType : e.target.value});
  }

  fileSelector() {
    if (this.state.file === null) {
      return (<div className="import-drop-zone drag-drop-target">
        <h3>Please select the file you wish to import</h3>
        <label htmlFor="file-select">Choose a Microsoft Excel formatted file (.xls, .xlsx, .xslm)</label>
        <input id="file-select" name="file-select" type="file" value={this.state.file} onChange={this.onChange} accept=".xls, .xlsx, .xlsm, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
        <br/>
        <fieldset>
          <legend>Please select the format of the file you wish to import</legend>
          <div className="radio">
            <label htmlFor="import-type-generic">
              <input type='radio' className='form-radio-input'  value="generic" onClick={this.changeFormat} defaultChecked name='importType' id='import-type-generic'  />
              Generic Import
            </label>
          </div>
          <div className="radio">
            <label htmlFor="import-type-mmg">
              <input type='radio' className='form-radio-input' value="mmg" onClick={this.changeFormat} name='importType' id='import-type-mmg' />
              MMG Import
            </label>
          </div>
        </fieldset>

      </div>);
    } else {
      return (
        <div className="import-action-area">
          <h2>Files to be imported</h2>
          <div className="import-file-info">
            <dl className="dl-horizontal">
              <dt>Filename:</dt>
              <dd>{this.state.file.name}</dd>
              <dt>Size:</dt>
              <dd>{this.state.file.size} bytes</dd>
              <dt>Last Updated:</dt>
              <dd>{this.state.file.lastModifiedDate.toString()}</dd>
            </dl>
          </div>
          {this.fileActions()}
        </div>
      );
    }
  }

  attemptImport() {
    this.props.attemptImportFile(this.state.importSessionId, this.state.importType, (successResponse)=>{
      this.setState({importWarnings: successResponse.data.importWarnings,
        importErrors: successResponse.data.importErrors,
        importSessionId: successResponse.data.id,
        survey: successResponse.data.survey});
    }, (failureResponse)=>{
      this.setState({
        importFailure: failureResponse.message
      });
    });
    this.setState({importAttempted: true, importErrors: [], importWarnings: [], importFormat: null});
  }

  cancelImport() {
    this.setState({file: null, importAttempted: false, importFailure: null, importWarnings: [],importErrors: [], fileChosen: false, importFormat: null, filePromiseReturned: false, survey: {}, importType:"generic"});
  }

  fileActions() {

    if (this.state.importType == "mmg" ){
      var errorText = "File not recognized as MMG Excel spreadsheet";
    } else {
      errorText = "File format not able to be imported";
    }

    if (this.state.importErrors && this.state.importErrors.length > 0 && !this.state.importAttempted) {
      return (
        <div>
          <div className="import-action-message error" role="alert">
            <button className="btn btn-default" onClick={this.cancelImport}><span className="fa fa-trash"></span> Remove</button>
            {errorText}
          </div>
          <div className="import-notes">
            {this.state.importErrors.map((msg, i) => {
              return (
                <div key={i} className="import-note error">
                  <strong>Error</strong>: {msg}<br />
                </div>
              );
            })}
          </div>
        </div>
      );
    }else if (this.state.importWarnings && this.state.importWarnings.length > 0 && !this.state.importAttempted && this.state.filePromiseReturned){
      return (
        <div>
          <div className="import-action-message warning" role="alert">
            <button className="btn btn-primary" onClick={this.attemptImport}>Import</button>
            <button className="btn btn-default" onClick={this.cancelImport}><span className="fa fa-trash"></span> Remove</button>
            File format warnings:
          </div>
          <div className="import-notes">
            {this.state.importWarnings.map((msg, i) => {
              return (
                <div key={i} className="import-note warning">
                  <strong>Warning</strong>: {msg}<br />
                </div>
              );
            })}
          </div>
        </div>
      );
    }else if (this.state.importWarnings && this.state.importWarnings.length > 0 && !this.state.importAttempted && !this.state.filePromiseReturned){
      return (
        <div>
          <div className="import-action-message warning" role="alert">
            Checking file format... Please wait.
            <LoadingSpinner msg="Working..."/>
          </div>
        </div>
      );
    }else if (!this.state.importAttempted && this.state.filePromiseReturned){
      return (
        <div className="import-action-message success" role="alert">
          <button className="btn btn-primary" onClick={this.attemptImport}>Import</button>
          <button className="btn btn-default" onClick={this.cancelImport}>Cancel</button>
          File recognized as {this.state.importType} Excel spreadsheet
        </div>
      );
    } else if (this.state.fileChosen && !this.state.filePromiseReturned) {
      return (
        <div className="import-action-message warning" role="alert">
          Checking file format... Please wait.
          <LoadingSpinner msg="Working..."/>
        </div>
      );
    } else {
      return;
    }
  }

  importStatus() {
    if (this.state.importFailure) {
      return (
        <div>
          <div className="import-action-message error" role="alert">
            <button className="btn btn-default" onClick={this.cancelImport}><span className="fa fa-trash"></span> Remove</button>
            Import failed: {this.state.importFailure} - send this code and spreadsheet to your system administrator at <a href="mailto:surveillanceplatform@cdc.gov">surveillanceplatform@cdc.gov</a>
          </div>
        </div>
      );
    } else if (this.state.importAttempted && this.state.importErrors && this.state.importErrors.length > 0 && this.state.survey === null) {
      return (
        <div>
          <div className="import-action-message error" role="alert">
            <button className="btn btn-default" onClick={this.cancelImport}><span className="fa fa-trash"></span> Remove</button>
            File could not be imported. Try to fix as many of the following errors as possible.
          </div>
          <div className="import-notes">
            {this.state.importErrors.map((msg, i) => {
              return (
                <div key={i} className="import-note error">
                  <strong>Error</strong>: {msg}<br />
                </div>
              );
            })}
          </div>
        </div>
      );
    } else if (this.state.importAttempted && this.state.importWarnings && this.state.importWarnings.length > 0 && this.state.survey && this.state.survey.id) {
      return (
        <div>
          <div className="import-action-message warning" role="alert">
            <a className="btn btn-primary" href={`/#/surveys/${this.state.survey.id}`}>View Survey</a>
            File imported with warnings
          </div>
          <div className="import-notes">
            {this.state.importWarnings.map((msg, i) => {
              return (
                <div key={i} className="import-note warning">
                  <strong>Warning</strong>: {msg}<br />
                </div>
              );
            })}
          </div>
          {this.importResults()}
        </div>
      );
    } else if (this.state.importAttempted && this.state.survey && this.state.survey.id) {
      return (
        <div>
          <div className="import-action-message success" role="alert">
            <a className="btn btn-primary" href={`/#/surveys/${this.state.survey.id}`}>View Survey</a>
            File successfully imported
          </div>
          {this.importResults()}
        </div>
      );
    } else if (this.state.importAttempted) {
      return <div className="import-action-message warning" role="alert">
        Attempting Import... Please wait.
        <LoadingSpinner msg="Working..." />
      </div>;
    } else {
      return;
    }
  }

  importResults() {
    let survey = this.state.survey;
    // TODO: Remove the true statement here and sub in logic to populate this table
    if (survey.id) {
      return;
    } else {
      return (
        <div className="import-results">
          <table className="table table-condensed table-striped table-bordered survey-table">
            <thead>
              <tr>
                <th>Data element name</th>
                <th>Description</th>
                <th>Type</th>
                <th>Value Set Name</th>
              </tr>
            </thead>
            <tbody>
              <tr className="section-row">
                <td colSpan="4">Section: EPIDEMIOLOGIC INFORMATION SECTION</td>
              </tr>
              <tr>
                <td>Reason for testing</td>
                <td>Listing of the reason(s) the subject was tested for Hepatitis. If "Other" has been selected as coded value, specify the free text using "Other Reason for Testing"  data element.</td>
                <td>Coded</td>
                <td>Reason for Test (Hepatitis)</td>
              </tr>
              <tr>
                <td>Other Reason for Testing</td>
                <td>Other reason(s) the subject was tested for Hepatitis (Free text).</td>
                <td>Text</td>
                <td>N/A</td>
               </tr>
               <tr>
                <td>Symtompatic</td>
                <td>Was the subject symptomatic for Hepatitis.</td>
                <td>Coded</td>
                <td>Yes No Unknown (YNU)</td>
               </tr>
               <tr>
                <td>Jaundiced (Symptom)</td>
                <td>Was the subject jaundiced.</td>
                <td>Coded</td>
                <td>Yes No Unknown (YNU)</td>
               </tr>
               <tr>
                <td>Due Date</td>
                <td>Subject&#39;s pregnancy due date.</td>
                <td>Date</td>
                <td>N/A</td>
               </tr>
               <tr>
                <td>Previously Aware of Condition</td>
                <td>Was the subject aware they had Hepatitis prior to lab testing.</td>
                <td>Coded</td>
                <td>Yes No Unknown (YNU)</td>
               </tr>
               <tr>
                <td>Provider of Care for Condition</td>
                <td>Does the subject have a provider of care for Hepatitis? This is any healthcare provider that monitors or treats the patient for viral Hepatitis.</td>
                <td>Coded</td>
                <td>Yes No Unknown (YNU)</td>
               </tr>
               <tr>
                <td>Diabetes</td>
                <td>Does subject have diabetes?</td>
                <td>Coded</td>
                <td>Yes No Unknown (YNU)</td>
               </tr>
            </tbody>
          </table>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h1 className="panel-title">Import Spreadsheet</h1>
            </div>
            <div className="panel-body import-panel">
              <div className="row">
                <div className="col-sm-10 col-sm-offset-1">
                  <form onSubmit={this.onFormSubmit}>
                    {this.fileSelector()}
                  </form>
                  {this.importStatus()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({setSteps, createImportSession, updateImportSession, attemptImportFile}, dispatch);
}

SurveyImportContainer.propTypes = {
  setSteps: PropTypes.func,
  createImportSession: PropTypes.func,
  updateImportSession: PropTypes.func,
  attemptImportFile: PropTypes.func
};

export default connect(null, mapDispatchToProps)(SurveyImportContainer);
