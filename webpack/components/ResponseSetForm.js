import React, { Component, PropTypes } from 'react';

import CodedSetTableForm from './CodedSetTableForm';
import { responseSetProps } from '../prop-types/response_set_props';

export default class ResponseSetForm extends Component {
  constructor(props) {
    super(props);
    let version = 1;
    let versionIndependentId;
    if (props.action === 'revise') {
      version = this.props.responseSet.version + 1;
      versionIndependentId = this.props.responseSet.versionIndependentId;
    }
    this.state = {name: this.props.responseSet.name,
      oid: this.props.responseSet.oid,
      coded: this.props.responseSet.coded,
      description: this.props.responseSet.description,
      responses: this.props.responseSet.responses,
      version: version,
      versionIndependentId: versionIndependentId
    };
  }

  render() {
    return (
      <form onSubmit={(e) => this.handleSubmit(e)}>
        <div className="row">
          <div className="row">
            <div className="col-md-4">
              <label htmlFor="name">Name</label>
              <input type="text" value={this.state.name} name="name" id="name" onChange={this.handleChange('name')}/>
            </div>

            <div className="col-md-4">
              <label htmlFor="oid">OID</label>
              <input type="text" value={this.state.oid} name="oid" id="oid" onChange={this.handleChange('oid')}/>
            </div>

            <div className="col-md-2">
              <label htmlFor="coded">Coded</label>
              <input type="checkbox" value={this.state.coded} name="coded" id="coded" onChange={this.handleChange('coded')}/>
            </div>

          </div>

          <div className="row">
            <div className="col-md-4">
              <label htmlFor="description">Description</label>
              <textarea value={this.state.description} name="description" id="description" onChange={this.handleChange('description')}/>
            </div>
          </div>

          <CodedSetTableForm itemWatcher={(r) => this.handleResponsesChange(r)}
                             initialItems={this.state.responses}
                             parentName={'response_set'}
                             childName={'response'} />

          <div className="actions">
            <input type="submit" value={`${this.props.action} Response Set`}/>
          </div>
        </div>
      </form>
    );
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.responseSetSubmitter(this.state, () => {});
  }

  handleResponsesChange(newResponses) {
    this.setState({responsesAttributes: newResponses});
  }

  handleChange(field) {
    return (event) => {
      let newState = {};
      newState[field] = event.target.value;
      this.setState(newState);
    };
  }
}

ResponseSetForm.propTypes = {
  responseSet: responseSetProps.isRequired,
  responseSetSubmitter: PropTypes.func.isRequired,
  action: PropTypes.string.isRequired
};
