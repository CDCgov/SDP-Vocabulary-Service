import React, { Component, PropTypes } from 'react';
import FormWidget from './FormWidget';
import allRoutes from '../prop-types/route_props';
import _ from 'lodash';

class FormList extends Component {
  render() {
    return (
      <div className='form-group col-md-12 nopadding'>
        {_.values(this.props.forms).map((aForm) => {
          return <FormWidget key={aForm.id} form={aForm} routes={this.props.routes} />;
        })}
      </div>
    );
  }
}

FormList.propTypes = {
  forms: PropTypes.object.isRequired,
  routes: allRoutes
};

export default FormList;
