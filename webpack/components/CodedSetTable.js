import React, { Component, PropTypes } from 'react';

export default class CodedSetTable extends Component {

  render() {
    if(!this.props.items || this.props.items.length < 1){
      return (<h3>No {this.props.itemName}s Selected</h3>);
    }
    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th>{this.props.itemName} Code</th>
            <th>Code System</th>
            <th>Display Name</th>
          </tr>
        </thead>
        <tbody>
          {this.props.items.map((item,i) => {
            return (
              <tr key={i}>
                <td>{item.value}</td>
                <td>{item.codeSystem}</td>
                <td>{item.displayName}</td>
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
