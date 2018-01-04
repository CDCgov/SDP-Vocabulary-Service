import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

import CodedSetTableEditContainer from '../containers/CodedSetTableEditContainer';

class TagModal extends Component{
  constructor(props) {
    super(props);
    this.state = {
      conceptsAttributes: filterConcepts(this.props.concepts) || []
    };
  }

  render() {
    return(
      <div className="static-modal">
        <Modal animation={false} show={this.props.show} onHide={this.props.cancelButtonAction} role="dialog" aria-label="Tag Editing Modal">
          <Modal.Header>
            <Modal.Title componentClass="h2">Update Tags</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CodedSetTableEditContainer itemWatcher={(r) => this.handleConceptsChange(r)}
                     initialItems={this.state.conceptsAttributes}
                     childName={'tag'} />
          </Modal.Body>
          <br/>
          <br/>
          <Modal.Footer>
            <Button bsStyle="primary">Save</Button>
            <Button onClick={this.props.cancelButtonAction} bsStyle="default">Cancel</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  handleConceptsChange(newConcepts) {
    this.setState({conceptsAttributes: filterConcepts(newConcepts)});
  }
}

function filterConcepts(concepts) {
  if(!concepts){
    return [];
  }
  return concepts.filter((nc) => {
    return (nc.value !=='' ||  nc.codeSystem !== '' || nc.displayName !=='');
  }).map((nc) => {
    return {value: nc.value, codeSystem: nc.codeSystem, displayName: nc.displayName};
  });
}

TagModal.propTypes = {
  show:  PropTypes.bool,
  cancelButtonAction:   PropTypes.func,
  concepts: PropTypes.object
};

export default TagModal;
