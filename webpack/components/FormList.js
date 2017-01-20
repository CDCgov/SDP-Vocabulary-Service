import React, { Component, PropTypes } from 'react';
import FormWidget from './FormWidget';
import _ from 'lodash';

class FormList extends Component {
  render() {
    return (
      <div className='form-group'>
        {_.values(this.props.forms).map((aForm) => {
          return <FormWidget key={aForm.id} form={aForm} routes={this.props.routes} />;
        })}
      </div>
    );
  }
}

FormList.propTypes = {
  forms: PropTypes.object.isRequired,
  routes: FormWidget.propTypes.routes.isRequired
};

export default FormList;
