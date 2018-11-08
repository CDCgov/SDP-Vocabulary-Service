import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Row, Col } from 'react-bootstrap';
import TagsInput from 'react-tagsinput';

import { responseSetProps } from '../../prop-types/response_set_props';
import Errors from '../Errors';
import ModalDialog from '../ModalDialog';
import CodedSetTableEditContainer from '../../containers/CodedSetTableEditContainer';

export default class ResponseSetEdit extends Component {
  constructor(props) {
    super(props);
    this.unsavedState = false;
    this.associationChanges = {};
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
    this.handleTagChange = this.handleTagChange.bind(this);
  }

  componentDidMount() {
    if(this.props.router && this.props.route){
      this.unbindHook = this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave.bind(this));
      window.onbeforeunload = this.windowWillUnload.bind(this);
    }
  }

  componentWillUnmount() {
    this.unsavedState = false;
    this.associationChanges = {};
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
      this.props.responseSetSubmitter(this.state, this.state.comment, this.unsavedState, this.associationChanges, () => {
        this.unsavedState = false;
        this.associationChanges = {};
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
    const parentId  = responseSet.parent || ''; // Cannot use null, must use undefined or blank string
    const versionIndependentId = responseSet.versionIndependentId;
    const showModal = false;
    const groups = responseSet.groups || [];
    const tagList = responseSet.tagList || [];
    return {name, oid, description, responsesAttributes, groups,
      version, parentId, versionIndependentId, showModal, tagList};
  }

  stateForNew() {
    return {
      name: '', oid: '', description: '', comment: '',
      responsesAttributes: [], tagList: [],
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
    const tagList = responseSet.tagList || [];
    return {name, oid, description, responsesAttributes, tagList,
      version, versionIndependentId, parentId, showModal};
  }

  stateForEdit(responseSet) {
    const id = responseSet.id;
    const name = responseSet.name || '';
    const oid  = responseSet.oid  || '';
    const description = responseSet.description || '';
    const responsesAttributes = filterResponses(responseSet.responses);
    const version = responseSet.version;
    const parentId  = responseSet.parent || ''; // null not allowed here
    const versionIndependentId = responseSet.versionIndependentId;
    const showModal = false;
    const groups = responseSet.groups || [];
    const tagList = responseSet.tagList || [];
    return {id, name, oid, description, responsesAttributes, groups,
      version, parentId, versionIndependentId, showModal, tagList};
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
        <Row>
          <div className="panel panel-default">
            <div className="panel-heading">
              <h1 className="panel-title">{`${this.actionWord()} Response Set`}</h1>
            </div>
            <div className="panel-body">
                <Row>
                  <Col md={8} className="question-form-group">
                    <label className="input-label" htmlFor="response-set-name">Name</label>
                    <input className="input-format" tabIndex="3" type="text" value={this.state.name} name="response-set-name" id="response-set-name" onChange={this.handleChange('name')}/>
                  </Col>

                  <div className="hidden">
                    <input type="hidden" name="parentId" id="parentId" value={this.state.parentId} />
                  </div>
                </Row>
                <Row>
                  <Col md={8} className="question-form-group">
                    <label className="input-label" htmlFor="response-set-tags">Tags</label>
                    <TagsInput value={this.state.tagList} onChange={this.handleTagChange} inputProps={{tabIndex: '3', id: 'response-set-tags'}} />
                  </Col>
                </Row>
                <Row>
                  <Col md={8} className="question-form-group">
                    <label className="input-label"  htmlFor="response-set-description">Description</label>
                    <textarea className="input-format" tabIndex="3"  value={this.state.description} name="response-set-description" id="response-set-description" onChange={this.handleChange('description')}/>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <h2 className="tags-table-header"><strong>Responses</strong></h2>
                  </Col>
                </Row>
                <CodedSetTableEditContainer itemWatcher={(r) => this.handleResponsesChange(r)}
                                   initialItems={this.state.responsesAttributes}
                                   parentName={'response_set'}
                                   childName={'response'} />

                {this.props.action === 'edit' && <Row>
                  <Col md={8} className="question-form-group">
                    <label className="input-label"  htmlFor="save-with-comment">Notes / Comments About Changes Made (Optional)</label>
                    <textarea className="input-format" tabIndex="3" placeholder="Add notes about the changes here..." value={this.state.comment} name="save-with-comment" id="save-with-comment" onChange={this.handleChange('comment')}/>
                  </Col>
                </Row>}
            </div>
            <div className="panel-footer">
              <input className="btn btn-default" id='submit-response-set-form' type="submit" name="Save Response Set" value="Save" />
              {this.cancelButton()}
            </div>
          </div>
        </Row>
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
    this.props.responseSetSubmitter(responseSet, this.state.comment, this.unsavedState, this.associationChanges, (successResponse) => {
      this.unsavedState = false;
      this.associationChanges = {};
      if (this.props.action === 'new') {
        let stats = Object.assign({}, this.props.stats);
        stats.responseSetCount = this.props.stats.responseSetCount + 1;
        stats.myResponseSetCount = this.props.stats.myResponseSetCount + 1;
        this.props.setStats(stats);
      }
      this.props.router.push(`/responseSets/${successResponse.data.id}`);
    }, (failureResponse) => {
      this.setState({errors: failureResponse.response.data});
    });
  }

  handleResponsesChange(newResponses) {
    if (this.associationChanges['responses']) {
      this.associationChanges['responses']['updated'] = newResponses;
    } else {
      this.associationChanges['responses'] = {original: this.state.responsesAttributes, updated: newResponses};
    }
    this.setState({responsesAttributes: newResponses});
    this.unsavedState = true;
  }

  handleTagChange(tagList) {
    this.setState({tagList});
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

ResponseSetEdit.propTypes = {
  responseSet: responseSetProps,
  responseSetSubmitter: PropTypes.func.isRequired,
  action: PropTypes.string.isRequired,
  setStats: PropTypes.func,
  isLoading: PropTypes.bool,
  loadStatus : PropTypes.string,
  loadStatusText : PropTypes.string,
  stats: PropTypes.object,
  route:  PropTypes.object,
  router: PropTypes.object
};
