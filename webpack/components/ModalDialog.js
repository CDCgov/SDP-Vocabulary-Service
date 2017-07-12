import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Modal, Button} from 'react-bootstrap';

class ModalDialog extends Component{
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
            <Modal.Title componentClass="h1">{this.props.warning && <span className={'fa fa-exclamation-circle'}></span>} {this.props.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.props.subTitle && <h1 style={{fontWeight: 'bold'}}>{this.props.subTitle}</h1>}
            {this.props.message}
          </Modal.Body>
          <br/>
          <br/>
          <Modal.Footer>
          {this.getButton(this.props.cancelButtonAction,this.props.cancelButtonMessage, 'left', 'link')}
          {this.getButton(this.props.secondaryButtonAction,this.props.secondaryButtonMessage)}
          <Button onClick={this.props.primaryButtonAction} bsStyle="primary">{this.props.primaryButtonMessage}</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

ModalDialog.propTypes = {
  show:  PropTypes.bool,
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  message:  PropTypes.string.isRequired,
  warning:  PropTypes.bool,
  primaryButtonMessage: PropTypes.string.isRequired,
  primaryButtonAction:  PropTypes.func.isRequired,
  cancelButtonMessage:  PropTypes.string,
  cancelButtonAction:   PropTypes.func,
  secondaryButtonMessage: PropTypes.string,
  secondaryButtonAction:  PropTypes.func
};

export default ModalDialog;
