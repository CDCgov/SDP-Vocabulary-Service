import React, { Component, PropTypes } from 'react';
import { formsProps } from "../prop-types/form_props";
import { questionsProps } from "../prop-types/question_props";

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
                <div>Loading...</div>
              );
            } else {
              return (
              <div  key={i} className="basic-c-box panel-default survey-form" id={`form_id_${f.id}`}>
                <div className="panel-heading">
                  <h3 className="panel-title">{f.name}</h3>
                  <div className='form-group-controls'>
                    <div className="btn btn-small btn-default move-up"
                         onClick={() => this.props.reorderForm(survey, i, 1)}>
                      <i title="Move Up" className="fa fa fa-arrow-up"></i>
                    </div>
                    <div className="btn btn-small btn-default move-down"
                         onClick={() => this.props.reorderForm(survey, i, -1)}>
                      <i className="fa fa fa-arrow-down" title="Move Down"></i>
                    </div>
                    <div className="btn btn-small btn-default"
                         onClick={() => this.props.removeForm(survey, i)}>
                      <i className="fa fa fa-trash" title="Remove"></i>
                    </div>
                  </div>
                </div>
                <div className="box-content">
                  <ul>
                    {f.formQuestions.map((q,i) =>
                      <li key={i}>{this.props.questions[q.questionId].content}</li>
                    )}
                  </ul>
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
