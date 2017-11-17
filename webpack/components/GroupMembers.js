import React, { Component } from 'react';
import {Modal, Button} from 'react-bootstrap';

/* Quick hack to show dialog */
const GroupMembers = ({show,group,members,close}) => {
function listMembers(members) {
  return members.map((member) => {
    return (
      <p key={member.id} className="admin-group"><strong>{member.name}</strong> ({member.email}) 
        <button id={`remove_${member.email}`} className="btn btn-default pull-right"><i className="fa fa-trash search-btn-icon" aria-hidden="true"></i> Remove<text className="sr-only">{`- click to remove ${member.name} from group`}</text></button>
      </p>);
  });
}
  return  (
      <Modal show={show} animation={false}  aria-label={group.name}>
        <Modal.Header closeButton>
          <Modal.Title componentClass="h1">{group.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Add users to this group</p>
          <form>
            <div className="input-group search-group">
              <input value={""} type="text" id="email-input" name="email" aria-label="Enter email of user to add to group" className="search-input" placeholder="Enter email of user to add to group.. (Format: example@gmail.com)"/>
              <span className="input-group-btn">
                <button id="submit-email" className="search-btn search-btn-default" aria-label="Click to submit user email and add to group" type="submit"><i className="fa fa-plus search-btn-icon" aria-hidden="true"></i></button>
              </span>
            </div>
          </form>
          {listMembers(members)}

        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-default" onClick={close}>Close</button>
        </Modal.Footer>
      </Modal>
  )
}

export default GroupMembers;
