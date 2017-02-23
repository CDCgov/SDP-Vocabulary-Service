import React, { Component, PropTypes } from 'react';
import FormWidget from './FormWidget';
import allRoutes from '../prop-types/route_props';
import _ from 'lodash';

class FormList extends Component {
  render() {
    let values = _.values(this.props.forms);
    let numberPerRow = 3;
    let numberOfRows = Math.ceil(values.length / numberPerRow);
    let rows = [];
    for(var i = 0; i < numberOfRows; i++){
      let startIndex = i*numberPerRow;
      let endIndex = startIndex+numberPerRow;
      rows.push(this.renderRow(values.slice(startIndex, endIndex)));
    }
    return (<div>{rows}</div>);
  }

  renderRow(rowValues) {
    let items = _.values(rowValues).map( (aForm) => {
      return <FormWidget key={aForm.id} form={aForm} routes={this.props.routes} />;
    }
    );

    return (
      <div className='form-group row'>
      {items}
      </div>
    );
  }

}

FormList.propTypes = {
  forms: PropTypes.object.isRequired,
  routes: allRoutes
};

export default FormList;
