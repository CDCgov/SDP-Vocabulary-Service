import React, { Component, PropTypes } from 'react';
import { hashHistory, Link } from 'react-router';

import { surveyProps } from '../../prop-types/survey_props';
import { formProps } from '../../prop-types/form_props';
import VersionInfo from '../VersionInfo';


class SurveyShow extends Component{
  historyBar(survey) {
    return (
      <div className="col-md-3 nopadding no-print">
        <div className="showpage_sidenav_subtitle">
          <ul className="list-inline">
            <li className="subtitle_icon"><span className="fa fa-history" aria-hidden="true"></span></li>
            <li className="subtitle">History</li>
          </ul>
        </div>
        <VersionInfo versionable={survey} versionableType='survey' />
      </div>
    );
  }

  mainContent(survey, forms) {
    return (
      <div className="col-md-9 nopadding maincontent">
        <div className="action_bar no-print">
          <button className="btn btn-default" onClick={() => window.print()}>Print</button>
        </div>
        <div className="maincontent-details">
          <h3 className="maincontent-item-name"><strong>Name:</strong> {survey.name} </h3>
          <p className="maincontent-item-info">Version: {survey.version} - Author: {survey.userId} </p>
          {forms.map((f,i ) =>
            <div  key={i} className="basic-c-box panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">{f.name}</h3>
              </div>
              <div className="box-content">
                <ul>
                  {f.questions.map((q,i) =>
                    <li key={i}>{q.content}</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  render() {
    let {survey, forms} = this.props;
    if(!survey || !forms){
      return (
        <div>Loading...</div>
      );
    }
    return (
      <div id={"survey_id_"+survey.id}>
        <div className="showpage_header_container no-print">
          <ul className="list-inline">
            <li className="showpage_button"><span className="fa fa-arrow-left fa-2x" aria-hidden="true" onClick={hashHistory.goBack}></span></li>
            <li className="showpage_title">Survey Details</li>
            {this.historyBar(survey)}
            {this.mainContent(survey, forms)}
          </ul>
        </div>

      </div>
    );
  }
}

SurveyShow.propTypes = {
  survey: surveyProps,
  forms: PropTypes.arrayOf(formProps)
}

export default SurveyShow;
