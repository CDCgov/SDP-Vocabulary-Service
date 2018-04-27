import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setSteps } from '../../actions/tutorial_actions';
import { createImportSession, updateImportSession, attemptImportFile } from '../../actions/survey_actions';

class SurveyImportContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileValid: false,
      importAttempted: false,
      importSessionId: null,
      importErrors: [],
      importWarnings: ['Attempting Import...'],
      fileFormatCheck: null,
      file: null,
      survey: {},
      fileChosen: false,
      filePromiseReturned: false
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.attemptImport = this.attemptImport.bind(this);
    this.cancelImport = this.cancelImport.bind(this);
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
      this.props.updateImportSession(this.state.importSessionId, e.target.files[0], (successResponse) => {
        this.setState({importErrors: successResponse.data.importErrors, importSessionId: successResponse.data.id, filePromiseReturned: true});
      });
    } else {
      this.props.createImportSession(e.target.files[0], (successResponse) => {
        this.setState({importErrors: successResponse.data.importErrors, importSessionId: successResponse.data.id, filePromiseReturned: true});
      });
    }
    this.setState({file: e.target.files[0], fileChosen: true});
  }

  fileSelector() {
    if (this.state.file === null) {
      return (<div className="import-drop-zone drag-drop-target">
        <h3>Please select the file you wish to import</h3>
        <label htmlFor="file-select">Choose a Microsoft Excel formatted file (.xls, .xlsx, .xslm)</label>
        <input id="file-select" name="file-select" type="file" value={this.state.file} onChange={this.onChange} accept=".xls, .xlsx, .xlsm, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
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
    this.props.attemptImportFile(this.state.importSessionId, (successResponse)=>{
      this.setState({importWarnings: successResponse.data.importErrors,
        importErrors: successResponse.data.importErrors,
        importSessionId: successResponse.data.id,
        survey: successResponse.data.survey});
    });
    this.setState({importAttempted: true, importErrors: []});
  }

  cancelImport() {
    this.setState({file: null, importAttempted: false, importErrors: [], fileChosen: false, filePromiseReturned: false, survey: {}});
  }

  fileActions() {
    if (this.state.importErrors && this.state.importErrors.length > 0 && !this.state.importAttempted) {
      return (
        <div>
          <div className="import-action-message error" role="alert">
            <button className="btn btn-default" onClick={this.cancelImport}><span className="fa fa-trash"></span> Remove</button>
            <button className="btn btn-primary" onClick={this.attemptImport}>Attempt Import</button>
            File not recognized as MMG Excel spreadsheet
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
    } else if (!this.state.importAttempted && this.state.filePromiseReturned){
      return (
        <div className="import-action-message success" role="alert">
          <button className="btn btn-primary" onClick={this.attemptImport}>Import</button>
          <button className="btn btn-default" onClick={this.cancelImport}>Cancel</button>
          File recognized as MMG Excel spreadsheet
        </div>
      );
    } else if (this.state.fileChosen && !this.state.filePromiseReturned) {
      return <div className="import-action-message warning" role="alert">Checking file format... Please wait.</div>;
    } else {
      return;
    }
  }

  importStatus() {
    if (this.state.importAttempted && this.state.importErrors && this.state.importErrors.length > 0 && this.state.survey === null) {
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
      return <div className="import-action-message warning" role="alert">Attempting Import... Please wait.</div>;
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
              <h1 className="panel-title">Import MMG Spreadsheet</h1>
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
