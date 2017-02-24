import React, { Component, PropTypes } from 'react';
import CodedSetTableEditContainer from '../containers/CodedSetTableEditContainer';
import Errors from './Errors';
import { responseSetProps } from '../prop-types/response_set_props';
import ModalDialog from './ModalDialog';

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
    }
  }

  componentDidMount() {
    this.unbindHook = this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave.bind(this));
    window.onbeforeunload = this.windowWillUnload.bind(this);
  }

  componentWillUnmount() {
    this.unsavedState = false;
    this.unbindHook();
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
    const coded = responseSet.coded || false;
    const description = responseSet.description || '';
    const responsesAttributes = filterResponses(responseSet.responses);
    const version = responseSet.version + 1;
    const versionIndependentId = responseSet.versionIndependentId;
    const showModal = false;
    return {name, oid, description, coded, responsesAttributes,
      version, versionIndependentId, showModal};
  }

  stateForNew() {
    return {
      name: '', oid: '', coded: false, description: '',
      responsesAttributes: [{displayName: '', value: '', codeSystem: ''}],
      version: 1, versionIndependentId: null, showModal: false
    };
  }

  stateForExtend(responseSet) {
    const name = responseSet.name || '';
    const oid  = '';
    const coded = responseSet.coded || false;
    const description = responseSet.description || '';
    const responsesAttributes = filterResponses(responseSet.responses);
    const version = 1;
    const versionIndependentId = null;
    const parentId  = responseSet.id;
    const showModal = false;
    return {name, oid, description, coded, responsesAttributes,
      version, versionIndependentId, parentId, showModal};
  }

  render() {
    let titleText  = "New Response Set";
    if (this.props.responseSet.versionIndependentId) {
      titleText  = "Revise Response Set";
    }

    return (
      <form onSubmit={(e) => this.handleSubmit(e)}>
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
              <h3 className="panel-title">{titleText}</h3>
            </div>
            <div className="panel-body">
                <div className="row">
                  <div className="col-md-8 question-form-group">
                    <label className="input-label" htmlFor="name">Name</label>
                    <input className="input-format" type="text" value={this.state.name} name="name" id="name" onChange={this.handleChange('name')}/>
                  </div>

                  <div className="col-md-4 question-form-group">
                    <label className="input-label"  htmlFor="coded">Coded</label>
                    <input  className=" big-checkbox checkbox" type="checkbox" value={this.state.coded} name="coded" id="coded" onChange={this.handleChange('coded')}/>
                  </div>
                  <div className="hidden">
                    <input type="hidden" name="parentId" id="parentId" value={this.state.parentId} />
                  </div>
                </div>

                <div className="row">
                <div className="col-md-8 question-form-group">
                    <label className="input-label"  htmlFor="description">Description</label>
                    <textarea className="input-format"  value={this.state.description} name="description" id="description" onChange={this.handleChange('description')}/>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <label className="input-label" >Responses</label>
                    </div>
                  </div>
                <CodedSetTableEditContainer itemWatcher={(r) => this.handleResponsesChange(r)}
                                   initialItems={this.state.responsesAttributes}
                                   parentName={'response_set'}
                                   childName={'response'} />
                </div>
                <div className="panel-footer">

                    <input className=" btn btn-default " type="submit" value={`${this.actionWord()} Response Set`}/>

            </div>
          </div>
        </div>
      </form>
    );
  }

  actionWord() {
    const wordMap = {'new': 'Create', 'revise': 'Revise', 'extend': 'Extend'};
    return wordMap[this.props.action];
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.responseSetSubmitter(this.state, (successResponse) => {
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

function filterResponses(responses) {
  return responses.map((nr) => {
    if(nr.value!=='' ||  nr.codeSystem !== ''|| nr.displayName !==''){
      return {value: nr.value, codeSystem: nr.codeSystem, displayName: nr.displayName};
    }
  });
}

ResponseSetForm.propTypes = {
  responseSet: responseSetProps.isRequired,
  responseSetSubmitter: PropTypes.func.isRequired,
  action: PropTypes.string.isRequired,
  route:  PropTypes.object.isRequired,
  router: PropTypes.object.isRequired
};
