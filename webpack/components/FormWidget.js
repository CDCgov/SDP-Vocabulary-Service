import React, { Component, PropTypes } from 'react';

export default class FormWidget extends Component {
  render() {
    return (

  <div className="form" id={"form_id_"+this.props.form.id}>
    <div className="form-container">
    
      <ul className="list-inline">
        <li className="form-title">{this.props.form.name}</li>
      </ul>

      <ul className="form-list-group list-inline">
        <li className="form-list-group-item"><h2 className="form-item-title">Systems</h2><i className="fa fa-info-circle fa-lg form-item-icon" aria-hidden="true"></i><p className="form-item-value">145</p></li>
        <li className="form-list-group-item"><h2 className="form-item-title">Programs</h2><i className="fa fa-info-circle fa-lg form-item-icon" aria-hidden="true"></i><p className="form-item-value">89</p></li>
      </ul>

      <div className="form-info">{"Author: "+this.props.form.created_by_id}</div>
      
    </div>

    <div className="question-set-details">
      <ul className="list-inline question-set-items">
        <li className="question-number"><i className="fa fa-question-circle fa-2x" aria-hidden="true"></i><p>15</p></li>
        <li className="pull-right question-menu">
          <div className="dropdown">
            <a id={"form_"+this.props.form.id+"_menu"} className="dropdown-toggle" type="" data-toggle="dropdown" role="navigation">
              <span className="glyphicon glyphicon-option-horizontal"></span><span className="sr-only">Question Menu</span>
            </a>
            <ul className="dropdown-menu dropdown-menu-right">
              <li><a href={this.props.routes.revise_form_path(this.props.form)}>Revise</a></li>
              <li><a href={this.props.routes.form_path(this.props.form)}>View</a></li>
              <li><a data-confirm="Are you sure?" rel="nofollow" data-method="delete" href={this.props.routes.form_path(this.props.form)}>Delete</a></li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </div>

    );
  }
}

FormWidget.propTypes = {
  form: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }),
  routes: PropTypes.shape({
    form_path: PropTypes.func.isRequired,
    revise_form_path: PropTypes.func.isRequired
  })
};