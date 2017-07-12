import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { responseSetProps } from '../prop-types/response_set_props';
import Errors from './Errors';
import ModalDialog from './ModalDialog';
import CodedSetTableEditContainer from '../containers/CodedSetTableEditContainer';

export default class ResponseSetForm extends Component {
  constructor(props) {
    super(props);
    this.unsavedState = false;
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
      case 'edit':
        this.state = this.stateForEdit(this.props.responseSet);
        break;
    }
  }

  componentDidMount() {
    if(this.props.router && this.props.route){
      this.unbindHook = this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave.bind(this));
      window.onbeforeunload = this.windowWillUnload.bind(this);
    }
  }

  componentWillUnmount() {
    this.unsavedState = false;
    if(this.unbindHook){
      this.unbindHook();
    }
  }

  routerWillLeave(nextLocation) {
    this.setState({ showModal: this.unsavedState });
    this.nextLocation = nextLocation;
    return !this.unsavedState;
  }

  handleModalResponse(leavePage){
    this.setState({ showModal: false });
    if(leavePage){
      this.unsavedState = false;
      this.props.router.push(this.nextLocation.pathname);
    }else{
      this.props.responseSetSubmitter(this.state, () => {
        this.unsavedState = false;
        this.props.router.push(this.nextLocation.pathname);
      }, (failureResponse) => {
        this.setState({errors: failureResponse.response.data});
      });
    }
  }

  windowWillUnload() {
    return (this.unsavedState || null);
  }

  stateForRevise(responseSet) {
    const name = responseSet.name || '';
    const oid  = responseSet.oid  || '';
    const description = responseSet.description || '';
    const responsesAttributes = filterResponses(responseSet.responses);
    const version = responseSet.version + 1;
    const parentId  = responseSet.parent ? responseSet.parent.id : ''; // Cannot use null, must use undefined or blank string
    const versionIndependentId = responseSet.versionIndependentId;
    const showModal = false;
    return {name, oid, description, responsesAttributes,
      version, parentId, versionIndependentId, showModal};
  }

  stateForNew() {
    return {
      name: '', oid: '', description: '',
      responsesAttributes: [],
      version: 1, versionIndependentId: null, showModal: false
    };
  }

  stateForExtend(responseSet) {
    const name = responseSet.name || '';
    const oid  = '';
    const description = responseSet.description || '';
    const responsesAttributes = filterResponses(responseSet.responses);
    const version = 1;
    const versionIndependentId = null;
    const parentId  = responseSet.id;
    const showModal = false;
    return {name, oid, description, responsesAttributes,
      version, versionIndependentId, parentId, showModal};
  }

  stateForEdit(responseSet) {
    const id = responseSet.id;
    const name = responseSet.name || '';
    const oid  = responseSet.oid  || '';
    const description = responseSet.description || '';
    const responsesAttributes = filterResponses(responseSet.responses);
    const version = responseSet.version;
    const parentId  = responseSet.parent ? responseSet.parent.id : ''; // null not allowed here
    const versionIndependentId = responseSet.versionIndependentId;
    const showModal = false;
    return {id, name, oid, description, responsesAttributes,
      version, parentId, versionIndependentId, showModal};
  }

  cancelButton() {
    if (this.props.responseSet && this.props.responseSet.id) {
      return(<Link className="btn btn-default" to={`/responseSets/${this.props.responseSet.id}`}>Cancel</Link>);
    }
    return(<Link className="btn btn-default" to='/'>Cancel</Link>);
  }

  render() {
    return (
      <form id="response-set-edit-form" onSubmit={(e) => this.handleSubmit(e)}>
        <ModalDialog  show={this.state.showModal}
                title="Warning"
                subTitle="Unsaved Changes"
                warning={true}
                message="You are about to leave a page with unsaved changes. How would you like to proceed?"
                secondaryButtonMessage="Continue Without Saving"
                primaryButtonMessage="Save & Leave"
                cancelButtonMessage="Cancel"
                primaryButtonAction={()=> this.handleModalResponse(false)}
                cancelButtonAction ={()=> {
                  this.props.router.push(this.props.route.path);
                  this.setState({ showModal: false });
                }}
                secondaryButtonAction={()=> this.handleModalResponse(true)} />
        <Errors errors={this.state.errors} />
        <div>
          <div className="panel panel-default">
            <div className="panel-heading">
              <h1 className="panel-title">{`${this.actionWord()} Response Set`}</h1>
            </div>
            <div className="panel-body">
                <div className="row">
                  <div className="col-md-8 question-form-group">
                    <label className="input-label" htmlFor="response-set-name">Name</label>
                    <input className="input-format" type="text" value={this.state.name} name="response-set-name" id="response-set-name" onChange={this.handleChange('name')}/>
                  </div>

                  <div className="hidden">
                    <input type="hidden" name="parentId" id="parentId" value={this.state.parentId} />
                  </div>
                </div>

                <div className="row">
                <div className="col-md-8 question-form-group">
                    <label className="input-label"  htmlFor="response-set-description">Description</label>
                    <textarea className="input-format"  value={this.state.description} name="response-set-description" id="response-set-description" onChange={this.handleChange('description')}/>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <h2 className="tags-table-header"><strong>Responses</strong></h2>
                  </div>
                </div>
                <CodedSetTableEditContainer itemWatcher={(r) => this.handleResponsesChange(r)}
                                   initialItems={this.state.responsesAttributes}
                                   parentName={'response_set'}
                                   childName={'response'} />
                </div>
                <div className="panel-footer">
                  <input className="btn btn-default" id='submit-response-set-form' type="submit" name="Save Response Set" value="Save" />
                  {this.cancelButton()}
                </div>
          </div>
        </div>
      </form>
    );
  }

  actionWord() {
    const wordMap = {'new': 'Create', 'revise': 'Revise', 'extend': 'Extend', 'edit': 'Edit Draft of'};
    return wordMap[this.props.action];
  }

  handleSubmit(event) {
    event.preventDefault();
    let responseSet = Object.assign({}, this.state);
    this.props.responseSetSubmitter(responseSet, (successResponse) => {
      this.unsavedState = false;
      this.props.router.push(`/responseSets/${successResponse.data.id}`);
    }, (failureResponse) => {
      this.setState({errors: failureResponse.response.data});
    });
  }

  handleResponsesChange(newResponses) {
    this.setState({responsesAttributes: newResponses});
    this.unsavedState = true;
  }

  handleChange(field) {
    return (event) => {
      let newState = {};
      newState[field] = event.target.value;
      this.setState(newState);
      this.unsavedState = true;
    };
  }
}

function filterResponses(responses=[]) {
  return responses.filter((r)=>{
    return (r.value!=='' ||  r.codeSystem !== '' || r.displayName !=='');
  }).map((r) => {
    return {value: r.value, codeSystem: r.codeSystem, displayName: r.displayName};
  });
}

ResponseSetForm.propTypes = {
  responseSet: responseSetProps,
  responseSetSubmitter: PropTypes.func.isRequired,
  action: PropTypes.string.isRequired,
  route:  PropTypes.object,
  router: PropTypes.object
};
