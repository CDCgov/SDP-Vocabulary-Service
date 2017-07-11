import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formsProps } from "../prop-types/form_props";
import { questionsProps } from "../prop-types/question_props";
import SearchResult from './SearchResult';

class SurveyFormList extends Component {
  render() {
    if(!this.props.forms || this.props.survey.surveyForms.length < 1){
      return (<div className="form-group">No Forms Selected</div>);
    }
    var survey = this.props.survey;
    return (
      <div className="form-group added-form-group">
          {this.props.survey.surveyForms.map((form, i) => {
            var f = this.props.forms[form.formId];
            if(!f) {
              return (
                <div key={i}>Loading...</div>
              );
            } else {
              return (
                      <div className="row survey-form" key={i}>
                        <div className="col-md-11">
                          <SearchResult type  ='survey_form'
                                        result={{Source: f}}
                                        currentUser={{id: -1}}
                                        isEditPage ={true}
                                        index={i} />
                        </div>
                        <div className="col-md-1">
                          <div className="row survey-form-controls">
                              <button className="btn btn-small btn-default move-up"
                                   onClick={(event) => {
                                     event.preventDefault();
                                     this.props.reorderForm(survey, i, 1);
                                   }}>
                                <i title="Move Up" className="fa fa fa-arrow-up"></i><span className="sr-only">{`Move Up form ${f.name} on survey`}</span>
                              </button>
                          </div>
                          <div className="row survey-form-controls">
                              <button className="btn btn-small btn-default move-down"
                                   onClick={(event) => {
                                     event.preventDefault();
                                     this.props.reorderForm(survey, i, -1);
                                   }}>
                                <i className="fa fa fa-arrow-down" title="Move Down"></i><span className="sr-only">{`Move down form ${f.name} on survey`}</span>
                              </button>
                          </div>
                          <div className="row survey-form-controls">
                              <button className="btn btn-small btn-default delete-form"
                                   onClick={(event) => {
                                     event.preventDefault();
                                     this.props.removeForm(survey, i);
                                   }}>
                                <i className="fa fa fa-trash" title="Remove"></i><span className="sr-only">{`Delete form ${f.name} on survey`}</span>
                              </button>
                          </div>
                        </div>
                      </div>
              );
            }
          }
         )}
      </div>
    );
  }
}

SurveyFormList.propTypes = {
  survey: PropTypes.object,
  forms:  formsProps,
  questions:  questionsProps,
  removeForm:  PropTypes.func,
  reorderForm: PropTypes.func
};

export default SurveyFormList;
