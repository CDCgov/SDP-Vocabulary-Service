import React, { Component } from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';

export default class CodedSetTable extends Component {

  render() {
    if(!this.props.items || this.props.items.length < 1){
      return (<strong>No {this.props.itemName}s Selected</strong>);
    }
    return (
      <table className="table table-striped coded-set-table">
        <caption>Table of {this.props.itemName}s:</caption>
        <thead>
          <tr>
            <th scope="col" id="display-name-column">{this.props.itemName === 'Response' ? 'Display Name' : 'Concept Name'}</th>
            <th scope="col" id="code-column">Value</th>
            <th scope="col" id="code-system-column">Code System Identifier {this.props.itemName === 'Response' && '(Optional)'}</th>
          </tr>
        </thead>
        <tbody>
          {this.sortedItems().map((item,i) => {
            return (
              <tr key={i}>
                <td headers="display-name-column">{item.displayName}</td>
                <td headers="code-column">{item.value}</td>
                <td headers="code-system-column">{item.codeSystem}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  sortedItems() {
    return sortBy(this.props.items, ['codeSystem', 'value']);
  }
}

CodedSetTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    value:    PropTypes.string,
    codeSystem:  PropTypes.string,
    displayName: PropTypes.string
  })),
  itemName:  PropTypes.string
};
