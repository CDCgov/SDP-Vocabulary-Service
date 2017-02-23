import React, { Component, PropTypes } from 'react';

export default class CodedSetTableForm extends Component {
  constructor(props) {
    super(props);
    this.state = {items: props.initialItems, parentName: props.parentName, childName: props.childName};
  }

  addItemRow() {
    let newItems = this.state.items;
    newItems.push({displayName: "", codeSystem: "", value: ""});
    this.setState({items: newItems});
    if (this.props.itemWatcher) {
      this.props.itemWatcher(newItems);
    }
  }

  removeItemRow(rowNumber) {
    let newItems = this.state.items;
    newItems.splice(rowNumber, 1);
    this.setState({items: newItems});
    if (this.props.itemWatcher) {
      this.props.itemWatcher(newItems);
    }
  }

  handleChange(rowNumber, field) {
    return (event) => {
      let newItems = this.state.items;
      newItems[rowNumber][field] = event.target.value;
      this.setState({items: newItems});
      if (this.props.itemWatcher) {
        this.props.itemWatcher(newItems);
      }
    };
  }

  render() {
    let idPrefix  = `${this.state.parentName}_${this.state.childName}s_attributes`;
    let attrsName = `${this.state.parentName}[${this.state.childName}s_attributes]`;
    return (
      <table className="set-table ">
        <thead>
          <tr>
            <th>{this.state.childName[0].toUpperCase() + this.state.childName.slice(1)} Code</th>
            <th>Code System</th>
            <th>Display Name</th>
            <th > <a  title="Add Row" href="#" onClick={(e) => {
              e.preventDefault();
              this.addItemRow();
            }}><i className="fa fa-plus fa-2x"></i></a>
            </th>
          </tr>
        </thead>
        <tbody>
          {this.state.items.map((r, i) => {
            return (
              <tr key={i}>
                <td>
                  <label className="hidden" htmlFor={`${idPrefix}_${i}_value`}>Value</label>
                  <input className="input-format"  type="text" value={r.value}    name={`${attrsName}[${i}][value]`} id={`${idPrefix}_${i}_value`} onChange={this.handleChange(i, 'value')}/>
                </td>
                <td>
                  <label className="hidden" htmlFor={`${idPrefix}_${i}_code_system`}>Code system</label>
                  <input className="input-format"  type="text" value={r.codeSystem}  name={`${attrsName}[${i}][code_system]`} id={`${idPrefix}_${i}_code_system`} onChange={this.handleChange(i, 'codeSystem')}/>
                </td>
                <td>
                  <label className="hidden" htmlFor={`${idPrefix}_${i}_display_name`}>Display name</label>
                  <input className="input-format" type="text" value={r.displayName} name={`${attrsName}[${i}][display_name]`} id={`${idPrefix}_${i}_display_name`} onChange={this.handleChange(i, 'displayName')}/>
                </td>
                <td>
                  <a href="#" title="Remove" onClick={(e) => {
                    e.preventDefault();
                    this.removeItemRow(i);
                  }}><i className="fa fa-2x fa-trash"></i></a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}

CodedSetTableForm.propTypes = {
  initialItems: PropTypes.arrayOf(PropTypes.shape({
    value:       PropTypes.string,
    codeSystem:  PropTypes.string,
    displayName: PropTypes.string
  })),
  parentName: PropTypes.string,
  childName:  PropTypes.string,
  itemWatcher: PropTypes.func
};
