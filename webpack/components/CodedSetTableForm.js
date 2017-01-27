import React, { Component, PropTypes } from 'react';

export default class CodedSetTableForm extends Component {
  constructor(props) {
    super(props);
    this.state = {items: props.initialItems, parentName: props.parentName, childName: props.childName};
  }

  addItemRow() {
    let newItems = this.state.items;
    newItems.push({display: "", system: "", code: ""});
    this.setState({items: newItems});
  }

  removeItemRow(rowNumber) {
    let newItems = this.state.items;
    newItems.splice(rowNumber, 1);
    this.setState({items: newItems});
  }

  handleChange(rowNumber, field) {
    return (event) => {
      let newItems = this.state.items;
      newItems[rowNumber][field] = event.target.value;
      this.setState({items: newItems});
    };
  }

  render() {
    let idPrefix  = `${this.state.parentName}_${this.state.childName}s_attributes`;
    let attrsName = `${this.state.parentName}[${this.state.childName}s_attributes]`;
    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th>{this.state.childName[0].toUpperCase() + this.state.childName.slice(1)} Code</th>
            <th>Code System</th>
            <th>Display Name</th>
          </tr>
        </thead>
        <tbody>
          {this.state.items.map((r, i) => {
            return (
              <tr key={i}>
                <td>
                  <label className="hidden" htmlFor={`${idPrefix}_${i}_value`}>Value</label>
                  <input type="text" value={r.code}    name={`${attrsName}[${i}][value]`} id={`${idPrefix}_${i}_value`} onChange={this.handleChange(i, 'code')}/>
                </td>
                <td>
                  <label className="hidden" htmlFor={`${idPrefix}_${i}_code_system`}>Code system</label>
                  <input type="text" value={r.system}  name={`${attrsName}[${i}][code_system]`} id={`${idPrefix}_${i}_code_system`} onChange={this.handleChange(i, 'system')}/>
                </td>
                <td>
                  <label className="hidden" htmlFor={`${idPrefix}_${i}_display_name`}>Display name</label>
                  <input type="text" value={r.display} name={`${attrsName}[${i}][display_name]`} id={`${idPrefix}_${i}_display_name`} onChange={this.handleChange(i, 'display')}/>
                </td>
                <td>
                  <a href="#" onClick={() => this.removeItemRow(i)}>Remove</a>
                </td>
              </tr>
            );
          })}
          <tr>
            <td>
              <a href="#" onClick={() => this.addItemRow()}>Add Row</a>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

CodedSetTableForm.propTypes = {
  initialItems: PropTypes.arrayOf(PropTypes.shape({
    code:    PropTypes.string,
    system:  PropTypes.string,
    display: PropTypes.string
  })),
  parentName: PropTypes.string,
  childName:  PropTypes.string
};
