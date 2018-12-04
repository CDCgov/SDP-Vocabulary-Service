import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import TagsInput from 'react-tagsinput';

class TagModal extends Component{
  constructor(props) {
    super(props);
    this.state = {
      tagList: this.props.tagList || []
    };
    this.handleTagChange = this.handleTagChange.bind(this);
  }

  render() {
    return(
      <div className="static-modal">
        <Modal animation={false} show={this.props.show} onHide={this.props.cancelButtonAction} role="dialog" aria-label="Tag Editing Modal">
          <Modal.Header>
            <Modal.Title componentClass="h2">Update Tags</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <label className="input-label" htmlFor="response-set-tags" aria-hidden='true'>Tags</label>
            <p>Press 'Tab' or 'Enter' after typing a tag to add it to the list. Press 'Backspace' or click the 'x' icon to remove a tag.</p>
            <TagsInput value={this.state.tagList} onChange={this.handleTagChange} inputProps={{tabIndex: '3', id: 'response-set-tags'}} />
          </Modal.Body>
          <br/>
          <br/>
          <Modal.Footer>
            <Button onClick={() => this.props.saveButtonAction(this.state.tagList)} bsStyle="primary">Save</Button>
            <Button onClick={this.props.cancelButtonAction} bsStyle="default">Cancel</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  handleTagChange(tagList) {
    this.setState({tagList});
  }
}

TagModal.propTypes = {
  show: PropTypes.bool,
  cancelButtonAction: PropTypes.func,
  saveButtonAction: PropTypes.func,
  tagList: PropTypes.array
};

export default TagModal;
