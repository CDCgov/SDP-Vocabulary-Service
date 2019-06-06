import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Modal, Button} from 'react-bootstrap';

class InfoModal extends Component{
  getButton(action, message, float='none', buttonStyle='default'){
    if(action && message){
      return (<Button style={{float: float}} bsStyle={buttonStyle} onClick={action}>{message}</Button>);
    }
    return null;
  }

  render(){
    return(
      <div className="static-modal" id='saveModal'>
        <Modal show={this.props.show} onHide={this.props.cancelButtonAction} role="dialog" aria-label={this.props.title}>
          <Modal.Header>
            <Modal.Title componentClass="h3"><span className={'fa fa-info-circle'}></span> {this.props.header}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.props.body}
          </Modal.Body>
          <Modal.Footer>
          {this.getButton(this.props.hideInfo, 'Close', 'right', 'primary')}
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

InfoModal.propTypes = {
  show: PropTypes.bool,
  header: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  hideInfo: PropTypes.func
};

export default InfoModal;
