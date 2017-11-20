import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Modal, Button} from 'react-bootstrap';

/* Quick hack to show dialog */
class GroupMembers extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: ''
    };
  }

  listMembers(members) {
    return members.map((member) => {
      return (
        <p key={member.id} className="admin-group"><strong>{member.name}</strong> ({member.email})
          <button id={`remove_${member.email}`} onClick={() => this.props.removeUserFromGroup(member.email, this.props.group.name, null, null)} className="btn btn-default pull-right"><i className="fa fa-trash search-btn-icon" aria-hidden="true"></i> Remove<text className="sr-only">{`- click to remove ${member.name} from group`}</text></button>
        </p>);
    });
  }

  render() {
    let group = this.props.group || {};
    return (
      <Modal show={this.props.show} onHide={this.props.close} animation={false} aria-label={group.name}>
        <Modal.Header closeButton>
          <Modal.Title componentClass="h1">Name: {group.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {group.description && <p><strong>Description:</strong> {group.description}</p>}
          <p>Add users to this group by typing their email below:</p>
          <form>
            <div className="input-group search-group">
              <input value={this.state.email}  type="text" id="email-input" name="email" aria-label="Enter email of user to add to group" className="search-input" placeholder="Enter email of user to add to group.. (Format: example@gmail.com)" onChange={(e) => this.setState({email: e.target.value})} />
              <span className="input-group-btn">
                <button id="submit-email" onClick={(e) => {e.preventDefault(); this.props.addUserToGroup(this.state.email, group.name, null, null);}} className="search-btn search-btn-default" aria-label="Click to submit user email and add to group" type="submit"><i className="fa fa-plus search-btn-icon" aria-hidden="true"></i></button>
              </span>
            </div>
          </form>
          {group.users && this.listMembers(group.users)}
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-default" onClick={this.props.close}>Close</button>
        </Modal.Footer>
      </Modal>
    );
  }
}

GroupMembers.propTypes = {
  show: PropTypes.bool,
  group: PropTypes.object,
  close: PropTypes.func,
  addUserToGroup: PropTypes.func,
  removeUserFromGroup: PropTypes.func
}

export default GroupMembers;
