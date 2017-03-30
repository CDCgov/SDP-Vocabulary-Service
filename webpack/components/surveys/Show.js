import React, { Component, PropTypes } from 'react';
import { hashHistory, Link} from 'react-router';
import { surveyProps } from '../../prop-types/survey_props';
import { formProps } from '../../prop-types/form_props';
import currentUserProps from '../../prop-types/current_user_props';
import VersionInfo from '../VersionInfo';
import { isEditable, isRevisable, isPublishable } from '../../utilities/componentHelpers';

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
          {isPublishable(survey, this.props.currentUser) &&
              <a className="btn btn-default" href="#" onClick={(e) => {
                e.preventDefault();
                this.props.publishSurvey(survey.id);
                return false;
              }}>Publish</a>
          }
          {isRevisable(survey, this.props.currentUser) &&
              <Link className="btn btn-default" to={`surveys/${survey.id}/revise`}>Revise</Link>
          }
          {isEditable(survey, this.props.currentUser) &&
              <Link className="btn btn-default" to={`surveys/${survey.id}/edit`}>Edit</Link>
          }
          {isEditable(survey, this.props.currentUser) &&
            <a className="btn btn-default" href="#" onClick={(e) => {
              e.preventDefault();
              if(confirm('Are you sure you want to delete this Survey?')){
                this.props.deleteSurvey(survey.id, (response) => {
                  if (response.status == 200) {
                    this.props.router.push('/');
                  }
                });
              }
              return false;
            }}>Delete</a>
          }
          <button className="btn btn-default" onClick={() => window.print()}>Print</button>
        </div>
        <div className="maincontent-details">
          <h3 className="maincontent-item-name"><strong>Name:</strong> {survey.name} </h3>
          <p className="maincontent-item-info">Version: {survey.version} - Author: {survey.userId} </p>
          <div className="basic-c-box panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">Description</h3>
            </div>
            <div className="box-content">
              {survey.description}
            </div>
          </div>
          {forms.map((f,i ) =>
            <div  key={i} className="basic-c-box panel-default survey-form">
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
          </ul>
        </div>
        {this.historyBar(survey)}
        {this.mainContent(survey, forms)}
      </div>
    );
  }
}

SurveyShow.propTypes = {
  survey: surveyProps,
  forms:  PropTypes.arrayOf(formProps),
  router: PropTypes.object,
  currentUser: currentUserProps,
  publishSurvey: PropTypes.func,
  deleteSurvey:  PropTypes.func
};

export default SurveyShow;
