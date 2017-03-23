import React, { Component, PropTypes } from 'react';
import { formProps, formsProps } from "../prop-types/form_props";
import { questionsProps } from "../prop-types/question_props";
import { Link } from 'react-router';

const FormItem = ({form, index}) => {
  if (!form) {
    return (<div>"Loading..."</div>);
  }
  return (
    <div className='form-item'>
        <div className="col-md-9">
        <span>{form.name}</span>
        <div className="question-group" id={`form_id_${form.id}_${index}`}>
          <div className="panel panel-default">
                <div className="question-container">
                <ul className="list-inline">
        {form.questions.map((q) => {
          return (
            <li key={q.id}><Link  to={`/questions/${q.id}`}>{q.content}</Link></li>
          );
        })}
        </ul>
           </div>
          </div>
        </div>
        </div>
    </div>
  );
};

FormItem.propTypes = {
  form: formProps,
  index: PropTypes.number
};
class SurveyFormList extends Component {
  render() {
    if(!this.props.forms || this.props.survey.surveyForms.length < 1){
      return (<div className="form-group">No Forms Selected</div>);
    }
    var survey = this.props.survey;
    return (
      <div className="form-group">
          {this.props.survey.surveyForms.map((form, i) => {
            var f = this.props.forms[form.formId];
            return (
            <div  key={i} className="basic-c-box panel-default survey-form">
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
