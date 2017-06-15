import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { saveResponseSet } from '../actions/response_set_actions';
import {Modal, Button} from 'react-bootstrap';
import Errors from '../components/Errors';
import ResponseSetForm from './ResponseSetForm';
import $ from 'jquery';

class ResponseSetModal extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.saveNewResponseSet = this.saveNewResponseSet.bind(this);
  }

  saveNewResponseSet(newResponseSet){
    this.props.saveResponseSet(newResponseSet, (successResponse) => {
      this.setState({errors: null});
      this.props.saveResponseSetSuccess(successResponse);
    }, (failureResponse) => {
      this.setState({errors: failureResponse.response.data});
    });
  }

  render() {
    return (
      <Modal bsStyle='response-set' show={this.props.show} onHide={this.props.closeModal} aria-label="New Response Set">
        <Modal.Header closeButton bsStyle='response-set'>
          <Modal.Title componentClass="h1">New Response Set</Modal.Title>
        </Modal.Header>
        <Errors errors={this.state.errors} />
        <Modal.Body bsStyle='response-set'>
          <ResponseSetForm action={'new'}
                           router={this.props.router}
                           responseSetSubmitter={this.saveNewResponseSet}/>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeModal}>Cancel</Button>
          <Button onClick={()=> $('#submit-response-set-form').click()} bsStyle="primary">Add Response Set</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({saveResponseSet}, dispatch);
}

ResponseSetModal.propTypes = {
  show: PropTypes.bool.isRequired,
  router: PropTypes.object,
  closeModal: PropTypes.func.isRequired,
  saveResponseSet: PropTypes.func,
  saveResponseSetSuccess: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(ResponseSetModal);
