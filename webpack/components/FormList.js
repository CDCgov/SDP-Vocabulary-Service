import React, { Component, PropTypes } from 'react';
import FormWidget from './FormWidget';

export default class FormList extends Component {
  render() {
    return (
      <div className='form-group'>
        {this.props.forms.map((aForm) => {
          return <FormWidget key={aForm.id} form={aForm} routes={this.props.routes} />;
        })}
      </div>
    );
  }
}

FormList.propTypes = {
  forms: PropTypes.arrayOf(FormWidget.propTypes.form).isRequired,
  routes: FormWidget.propTypes.routes.isRequired
};