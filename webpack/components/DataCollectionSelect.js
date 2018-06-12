import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class DataCollectionSelect extends Component {
  render() {
    return (
      <select multiple className="form-control" name="dataCollectionMethod" id="dataCollectionMethod" value={this.props.methods} onChange={e => this.props.onChangeFunc(e)}>
        <option value='Electronic (e.g., machine to machine)'>Electronic (e.g., machine to machine)</option>
        <option value='Record review'>Record review</option>
        <option value='Self-Administered (Web or Mobile)'>Self-Administered (Web or Mobile)</option>
        <option value='Self-Administered (Paper)'>Self-Administered (Paper)</option>
        <option value='Facilitated by Interviewer (Phone)'>Facilitated by Interviewer (Phone)</option>
        <option value='Facilitated by Interviewer (In-Person)'>Facilitated by Interviewer (In-Person)</option>
      </select>
    );
  }
}

DataCollectionSelect.propTypes = {
  methods: PropTypes.array,
  onChangeFunc: PropTypes.func
};
