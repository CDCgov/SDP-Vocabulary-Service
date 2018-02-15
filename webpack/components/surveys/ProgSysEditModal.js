import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import values from 'lodash/values';
import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';

import Errors from '../Errors';
import NestedSearchBar from '../NestedSearchBar';
import { surveillanceSystemsProps } from '../../prop-types/surveillance_system_props';
import { surveillanceProgramsProps } from '../../prop-types/surveillance_program_props';
import currentUserProps from '../../prop-types/current_user_props';

export default class ProgSysEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastProgramId: this.props.programId || -1,
      lastSystemId:  this.props.systemId  || -1,
      errors: {} };
    this.programSearch = this.programSearch.bind(this);
    this.systemSearch  = this.systemSearch.bind(this);
  }

  componentWillReceiveProps(nextProps){
    var surveillanceSystems  =  values(nextProps.surveillanceSystems);
    var surveillancePrograms =  values(nextProps.surveillancePrograms);
    this.setState({
      surveillanceSystems:  surveillanceSystems,
      surveillancePrograms: surveillancePrograms
    });
  }

  render() {
    return (
      <Modal animation={false} show={this.props.show} onHide={this.props.closer} aria-label='Update Program and System'>
        <Modal.Header closeButton>
          <Modal.Title componentClass="h1">Update Program and System</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <Errors errors={this.state.errors} />
            <div className="field">
              {this.surveillanceProgramsField()}
            </div><br/>
            <div className="field">
              {this.surveillanceSystemsField()}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-default" onClick={this.props.closer}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={() => this.props.update(this.state.lastSystemId, this.state.lastProgramId) }>Update</button>
        </Modal.Footer>
      </Modal>
    );
  }

  programSearch(programSearchTerm){
    var surveillancePrograms = values(this.props.surveillancePrograms);
    if(programSearchTerm && programSearchTerm.length > 1){
      surveillancePrograms = filter(surveillancePrograms, (sp) => sp.name.toLowerCase().includes(programSearchTerm.toLowerCase()) || sp.id === this.state.lastProgramId || sp.id.toString() === this.state.lastProgramId);
    }
    this.setState({surveillancePrograms: surveillancePrograms});
  }

  systemSearch(systemSearchTerm){
    var surveillanceSystems = values(this.props.surveillanceSystems);
    if(systemSearchTerm && systemSearchTerm.length > 1){
      surveillanceSystems = filter(surveillanceSystems, (ss) => ss.name.toLowerCase().includes(systemSearchTerm.toLowerCase()) || ss.id === this.state.lastSystemId || ss.id.toString() === this.state.lastSystemId);
    }
    this.setState({surveillanceSystems: surveillanceSystems});
  }

  surveillanceProgramsField() {
    if (isEmpty(this.props.surveillancePrograms)) {
      return <p>No surveillance programs loaded in the database</p>;
    } else {
      return (<div id="search-programs">
          <label className="control-label" htmlFor="lastProgramId">Surveillance Program</label>
          <NestedSearchBar onSearchTermChange={this.programSearch} modelName="Program" />
          <select size='5' className="form-control" name="lastProgramId" id="lastProgramId" value={this.state.lastProgramId} onChange={this.handleChange('lastProgramId')} >
            {this.state.surveillancePrograms && this.state.surveillancePrograms.map((sp) => {
              return <option key={sp.id} value={sp.id}>{sp.name}</option>;
            })}
          </select>
        </div>);
    }
  }

  surveillanceSystemsField() {
    if (isEmpty(this.props.surveillanceSystems)) {
      return <p>No surveillance systems loaded in the database</p>;
    } else {
      return (<div id="search-systems">
          <label className="control-label" htmlFor="lastSystemId">Surveillance System</label>
          <NestedSearchBar onSearchTermChange={this.systemSearch} modelName="System" />
          <select size='5' className="form-control" name="lastSystemId" id="lastSystemId" value={this.state.lastSystemId} onChange={this.handleChange('lastSystemId')} >
            {this.state.surveillanceSystems && this.state.surveillanceSystems.map((ss) => {
              return <option key={ss.id} value={ss.id}>{ss.name}</option>;
            })}
          </select>
        </div>);
    }
  }

  handleChange(field) {
    return (event) => {
      let newState = {};
      newState[field] = event.target.value;
      this.setState(newState);
    };
  }
}

ProgSysEditModal.propTypes = {
  closer: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  update: PropTypes.func.isRequired,
  programId: PropTypes.number,
  systemId: PropTypes.number,
  currentUser: currentUserProps,
  surveillanceSystems: surveillanceSystemsProps,
  surveillancePrograms: surveillanceProgramsProps
};
