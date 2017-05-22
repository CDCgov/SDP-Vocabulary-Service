import React, { Component, PropTypes } from 'react';
import { Modal } from 'react-bootstrap';
import _ from 'lodash';

import Errors from '../Errors.js';

import { surveillanceSystemsProps }from '../../prop-types/surveillance_system_props';
import { surveillanceProgramsProps } from '../../prop-types/surveillance_program_props';

// This is an abstract class that is never intended to
// be used directly.
export default class ProfileEditor extends Component {
  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.closer} aria-label={this.title()}>
        <Modal.Header closeButton>
          <Modal.Title>{this.title()}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <Errors errors={this.state.errors} />
            <div className="control-group">
              <label className="control-label" htmlFor="email">E-mail</label>
              <div className="controls">
                <input autoFocus="autofocus" placeholder="" className="form-control input-lg" type="email"
                       value={this.state.email} name="email" id="email" onChange={this.handleChange('email')} />
                <p className="help-block">Please provide your E-mail</p>
              </div>
            </div>
            <div className="field">
              <label className="control-label" htmlFor="firstName">First name</label>
              <input className="form-control input-lg" type="text" name="firstName" id="firstName"
                     value={this.state.firstName} onChange={this.handleChange('firstName')}/>
            </div>
            <div className="field">
              <label className="control-label" htmlFor="lastName">Last name</label>
              <input className="form-control input-lg" type="text" name="lastName" id="lastName"
                     value={this.state.lastName} onChange={this.handleChange('lastName')}/>
            </div>

            {this.extraContent()}

            <div className="field">
              {this.surveillanceProgramsField()}
            </div>
            <div className="field">
              {this.surveillanceSystemsField()}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-default" onClick={this.props.closer}>Close</button>
          {this.actionButton()}
        </Modal.Footer>
      </Modal>
    );
  }

  surveillanceProgramsField() {
    if (_.isEmpty(this.props.surveillancePrograms)) {
      return <p>No surveillance programs loaded in the database</p>;
    } else {
      return (<div>
          <label className="control-label" htmlFor="lastProgramId">Surveillance Program</label>
          <select className="form-control" name="lastProgramId" id="lastProgramId" defaultValue={this.state.lastProgramId} onChange={this.handleChange('lastProgramId')} >
          {this.props.surveillancePrograms && _.values(this.props.surveillancePrograms).map((sp) => {
            return <option key={sp.id} value={sp.id}>{sp.name}</option>;
          })}
          </select>
        </div>);
    }
  }

  surveillanceSystemsField() {
    if (_.isEmpty(this.props.surveillanceSystems)) {
      return <p>No surveillance systems loaded in the database</p>;
    } else {
      return (<div>
          <label className="control-label" htmlFor="lastSystemId">Surveillance System</label>
          <select className="form-control" name="lastSystemId" id="lastSystemId" defaultValue={this.state.lastSystemId} onChange={this.handleChange('lastSystemId')} >
          {this.props.surveillanceSystems && _.values(this.props.surveillanceSystems).map((ss) => {
            return <option key={ss.id} value={ss.id}>{ss.name}</option>;
          })}
          </select>
        </div>);
    }
  }

  profileInformation() {
    let profileInformation = _.clone(this.state);
    delete profileInformation.errors;
    if (profileInformation.lastSystemId === -1) {
      delete profileInformation.lastSystemId;
    }
    if (profileInformation.lastProgramId === -1) {
      delete profileInformation.lastProgramId;
    }
    return profileInformation;
  }

  handleChange(field) {
    return (event) => {
      let newState = {};
      newState[field] = event.target.value;
      this.setState(newState);
    };
  }
}

ProfileEditor.propTypes = {
  closer: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  surveillanceSystems: surveillanceSystemsProps,
  surveillancePrograms: surveillanceProgramsProps
};
