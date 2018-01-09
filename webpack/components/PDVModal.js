import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

class PDVModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pdv: this.props.pdv || ''
    };
  }

  render() {
    return(
      <div className="static-modal">
        <Modal animation={false} show={this.props.show} onHide={this.props.cancelButtonAction} role="dialog" aria-label="Program Defined Variable Editing Modal">
          <Modal.Header>
            <Modal.Title componentClass="h2">Update Program Defined Variable</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input className="input-format" type="text" value={this.state.pdv} name="program-defined-variable" id="program-defined-variable" aria-label="Enter program defined variable" placeholder="Enter program defined variable" onChange={(e) => this.setState({ pdv: e.target.value })} />
          </Modal.Body>
          <br/>
          <Modal.Footer>
            <Button onClick={() => this.props.saveButtonAction(this.state.pdv)} bsStyle="primary">Save</Button>
            <Button onClick={this.props.cancelButtonAction} bsStyle="default">Cancel</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

PDVModal.propTypes = {
  show: PropTypes.bool,
  cancelButtonAction: PropTypes.func,
  saveButtonAction: PropTypes.func,
  pdv: PropTypes.string
};

export default PDVModal;
