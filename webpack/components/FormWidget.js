import React, { Component } from 'react';
import { Link } from 'react-router';
import { formProps } from '../prop-types/form_props';

export default class FormWidget extends Component {
  render() {
    return (
  <div className="col-sm-4">
  <div className="form" id={"form_id_"+this.props.form.id}>
  <div className="form-title">
    <ul className="list-inline">
      <li ><Link to={'/forms/'+this.props.form.id}>{this.props.form.name}</Link></li>
    </ul>
  </div>
    <div className="form-container">

      <ul className="form-list-group list-inline">
        <li className="form-list-group-item"><h2 className="form-item-title">Systems</h2><i className="fa fa-info-circle fa-lg form-item-icon" aria-hidden="true"></i><p className="form-item-value">145</p></li>
        <li className="form-list-group-item"><h2 className="form-item-title">Programs</h2><i className="fa fa-info-circle fa-lg form-item-icon" aria-hidden="true"></i><p className="form-item-value">89</p></li>
      </ul>
      <div className="form-info">{"Author: "+this.props.form.userId}</div>
    </div>
    <div className="question-set-details">
      <ul className="list-inline question-set-items">
        <li className="question-number"><i className="fa fa-question-circle fa-2x" aria-hidden="true"></i><p>{this.props.form.questions && this.props.form.questions.length}</p></li>
        <li className="pull-right question-menu">
          <div className="dropdown">
            <a id={"form_"+this.props.form.id+"_menu"} className="dropdown-toggle" type="" data-toggle="dropdown" role="navigation">
              <span className="glyphicon glyphicon-option-horizontal"></span><span className="sr-only">Question Menu</span>
            </a>
            <ul className="dropdown-menu dropdown-menu-right">
              <li><Link to={`/forms/${this.props.form.id}/revise`}>Revise</Link></li>
              <li><Link to={'/forms/'+this.props.form.id}>View</Link></li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </div>
  </div>
    );
  }
}

FormWidget.propTypes = {
  form: formProps
};
