import React, { Component } from 'react';
import {formProps} from '../prop-types/form_props';
import QuestionList from './QuestionList';
import Routes from '../routes';
import _ from 'lodash';

class FormShow extends Component {
  render() {
    const {form} = this.props;
    if(!form){
      return (
        <div>Loading...</div>
      );
    }
    return (
      <div id={"form_id_"+form.id}>
        <p><strong>Name:</strong> {form.name} </p>
        <p><strong>Created By:</strong> {form.userId} </p>
        <QuestionList questions={_.keyBy(form.questions, 'id')} routes={Routes} />
        <div className="no-print">
          <a className="btn btn-default" href={`/landing#/forms/${this.props.form.id}/revise`}>Revise</a>
          <button className="btn btn-default">Print</button>
          <a className="btn btn-default" href={Routes.formPath(form)}>Export to Redcap</a>
        </div>
      </div>
    );
  }
}

FormShow.propTypes = {
  form: formProps
};

export default FormShow;
