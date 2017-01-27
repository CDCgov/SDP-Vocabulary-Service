import React, { Component, PropTypes } from 'react';

import CodedSetTableForm from './CodedSetTableForm';
import { responseSetProps } from '../prop-types/response_set_props';

export default class ResponseSetForm extends Component {
  constructor(props) {
    super(props);
    switch (this.props.action) {
      case 'revise':
        this.state = this.stateForRevise(this.props.responseSet);
        break;
      case 'extend':
        this.state = this.stateForExtend(this.props.responseSet);
        break;
      case 'new':
        this.state = this.stateForNew();
        break;
    }
  }

  stateForRevise(responseSet) {
    const name = responseSet.name || '';
    const oid = responseSet.oid || '';
    const coded = responseSet.coded || false;
    const description = responseSet.description || '';
    const responsesAttributes = filterResponses(responseSet.responses);
    const version = responseSet.version + 1;
    const versionIndependentId = responseSet.versionIndependentId;
    return {name, oid, description, coded, responsesAttributes,
      version, versionIndependentId};
  }

  stateForNew() {
    return {
      name: '', oid: '', coded: false, description: '',
      responsesAttributes: [{displayName: '', value: '', codeSystem: ''}],
      version: 1, versionIndependentId: null
    };
  }

  stateForExtend(responseSet) {
    const name = responseSet.name || '';
    const oid = '';
    const coded = responseSet.coded || false;
    const description = responseSet.description || '';
    const responsesAttributes = filterResponses(responseSet.responses);
    const version = 1;
    const versionIndependentId = null;
    return {name, oid, description, coded, responsesAttributes,
      version, versionIndependentId};
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
