import React, { Component } from 'react';
import PropTypes from 'prop-types';
import currentUserProps from '../../prop-types/current_user_props';

class GroupLookUp extends Component {
  render() {
    return (
      <div className="btn-group">
        <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
           <span className="fa fa-users"></span> Groups <span className="caret"></span>
        </button>
        <ul className="dropdown-menu">
          <li key="header" className="dropdown-header">Current Groups:</li>
          {this.props.item.groups.length > 0 ? (
              this.props.item.groups.map((g) => {
                return <li className='current-group-menu-item' key={g.id}><span className="fa fa-check-square-o" aria-hidden="true"></span> {g.name}</li>;
              })
            ) : (
              <li className='current-group-menu-item'>None</li>
            )
          }
          <li key="add-header" className="dropdown-header">Add to Group:</li>
          {this.props.currentUser.groups.filter((group) => !this.props.item.groups.map(g => g.id).includes(group.id)).map((g) => {
            return <li key={g.id}><a href="#" onClick={(e)=>{
              e.preventDefault();
              this.props.addFunc(this.props.item.id, g.id);
              return false;
            }}>{g.name}</a></li>;
          })}
        </ul>
      </div>
    );
  }
}

GroupLookUp.propTypes = {
  addFunc: PropTypes.func,
  item: PropTypes.object,
  currentUser: currentUserProps
};

export default GroupLookUp;
