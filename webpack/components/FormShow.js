import React, { Component, PropTypes } from 'react';
import allRoutes from '../prop-types/route_props';
import formProps from '../prop-types/form_props';

class FormShow extends Component {
  render() {
/*    if(this.props.forms.loading == true){
      return (//basically can't happen
        <div>Loading...</div>
      );
    }*/
    return (
      <div className="form" id={"form_id_"+this.props.form.id}>
        <p>Name: {this.props.form.name} </p>
        <p>Questions: {this.props.form.questions} </p>
        <p>Created By: {this.props.form.userId} </p>
      
        <div className="no-print">
          <a className="btn btn-default" href={this.props.routes.reviseFormPath(this.props.form)}>Revise</a>
          <button className="btn btn-default">Print</button>  
          <a className="btn btn-default" href={this.props.routes.formPath(this.props.form)}>Export to Redcap</a>
          <a className="btn btn-default" href={this.props.routes.formsPath}>Back</a>
        </div>
      </div>
    );
  }
}

FormShow.propTypes = {
  form: formProps,
  routes: allRoutes
};

export default FormShow;
