import React, { Component, PropTypes } from 'react';

import CodedSetTableForm from './CodedSetTableForm';
import { responseSetProps } from '../prop-types/response_set_props';

export default class ResponseSetForm extends Component {
  constructor(props) {
    super(props);
    // TODO: Extract building of new response sets to
    // their own methods to clean things up.
    let version = 1;
    let versionIndependentId;
    let oid = this.props.responseSet.oid || '';
    if (props.action === 'extend') {
      oid = '';
    }
    if (props.action === 'revise') {
      version = this.props.responseSet.version + 1;
      versionIndependentId = this.props.responseSet.versionIndependentId;
    }
    let startingResponses;
    if (this.props.responseSet.responses) {
      startingResponses = filterResponses(this.props.responseSet.responses);
    } else {
      startingResponses = [{displayName: '', value: '', codeSystem: ''}];
    }
    this.state = {name: this.props.responseSet.name,
      oid,
      coded: this.props.responseSet.coded || false,
      description: this.props.responseSet.description || '',
      responsesAttributes: startingResponses,
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
                             initialItems={this.state.responsesAttributes}
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
    this.props.responseSetSubmitter(this.state, (response) => {
      // TODO: Handle when the saving response set fails.
      if (response.status === 201) {
        this.props.router.push(`/responseSets/${response.data.id}`);
      }
    });
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

function filterResponses(responses) {
  return responses.map((nr) => {
    return {value: nr.value, codeSystem: nr.codeSystem, displayName: nr.displayName};
  });
}

ResponseSetForm.propTypes = {
  responseSet: responseSetProps.isRequired,
  responseSetSubmitter: PropTypes.func.isRequired,
  action: PropTypes.string.isRequired,
  router: PropTypes.object.isRequired
};
