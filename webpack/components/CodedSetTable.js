import React, { Component, PropTypes } from 'react';

export default class CodedSetTable extends Component {

  render() {
    if(!this.props.items || this.props.items.length < 1){
      return (<strong>No {this.props.itemName}s Selected</strong>);
    }
    return (
      <table className="table table-striped">
        <caption>Information about associated {this.props.itemName}s:</caption>
        <thead>
          <tr>
            <th scope="col" id="display-name-column">Display Name</th>
            <th scope="col" id="code-column">{this.props.itemName} Code</th>
            <th scope="col" id="code-system-column">Code System</th>
          </tr>
        </thead>
        <tbody>
          {this.props.items.map((item,i) => {
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
}

CodedSetTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    code:    PropTypes.string,
    system:  PropTypes.string,
    display: PropTypes.string
  })),
  itemName:  PropTypes.string
};
