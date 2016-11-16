import React, { Component, PropTypes } from 'react';

export default class ResponseSetTable extends Component {
  constructor(props) {
    super(props);
    this.state = {responses: props.initialResponses};
  }

  addResponseRow() {
    let newResponses = this.state.responses;
    newResponses.push({display_name: "", code_system: "", value: ""});
    this.setState({responses: newResponses});
  }

  removeResponseRow(rowNumber) {
    let newResponses = this.state.responses;
    newResponses.splice(rowNumber, 1);
    this.setState({responses: newResponses});
  }

  render() {
    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Response Code</th>
            <th>Code System</th>
            <th>Display Name</th>
          </tr>
        </thead>
        <tbody>
          {this.state.responses.map((r, i) => {
            return (
              <tr key={i}>
                <td>
                  <label className="hidden" htmlFor={`response_set_responses_attributes_${i}_value`}>Value</label>
                  <input type="text" defaultValue={r.value} name={`response_set[responses_attributes][${i}][value]`} id={`response_set_responses_attributes_${i}_value`}/>
                </td>
                <td>
                  <label className="hidden" htmlFor={`response_set_responses_attributes_${i}_code_system`}>Code system</label>
                  <input type="text" defaultValue={r.code_system} name={`response_set[responses_attributes][${i}][code_system]`} id={`response_set_responses_attributes_${i}_code_system`}/>
                </td>
                <td>
                  <label className="hidden" htmlFor={`response_set_responses_attributes_${i}_display_name`}>Display name</label>
                  <input type="text" defaultValue={r.display_name} name={`response_set[responses_attributes][${i}][display_name]`} id={`response_set_responses_attributes_${i}_display_name`}/>
                </td>
                <td>
                  <a href="#" onClick={() => this.removeResponseRow(i)}>Remove</a>
                </td>
              </tr>
            );
          })}
          <tr>
            <td>
              <a href="#" onClick={() => this.addResponseRow()}>Add Row</a>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}
