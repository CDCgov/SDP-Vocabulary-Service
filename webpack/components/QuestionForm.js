import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Draggable, Droppable } from './Draggable';
import Errors from './Errors';
import ResponseSetWidget from './ResponseSetWidget';
import CodedSetTableEditContainer from '../containers/CodedSetTableEditContainer';
import { questionProps } from '../prop-types/question_props';
import { responseSetsProps } from '../prop-types/response_set_props';
import allRoutes from '../prop-types/route_props';
import _ from 'lodash';
import ModalDialog from './ModalDialog';

let setData = function(){
  return {"json/responseSet": JSON.stringify(this.props.responseSet)};
};

let DraggableResponseSet = Draggable(ResponseSetWidget, setData);

let onDrop = (evt, self) => {
  let rs = JSON.parse(evt.dataTransfer.getData("json/responseSet"));
  let { selectedResponseSets } = self.state;
  if(!selectedResponseSets.find((r) => {
    return r.id == rs.id;
  })) {
    selectedResponseSets.push(rs);
    self.props.handleResponseSetsChange(selectedResponseSets);
    self.setState({selectedResponseSets});
  }
};


class DropTarget extends Component {
  constructor(props) {
    super(props);
    this.state = {selectedResponseSets: this.props.selectedResponseSets};
  }

  render() {
    let {routes, isValidDrop } = this.props;

    let removeResponseSet = (id) => {
      let selectedResponseSets = this.state.selectedResponseSets.filter((rs) => rs.id != id);
      this.props.handleResponseSetsChange(selectedResponseSets);
      this.setState({selectedResponseSets});
    };

    return <div style={{minHeight: '40px', backgroundColor:isValidDrop?'green':'grey'}}>
      {this.state.selectedResponseSets.map((rs, i) => {
        return (
        <div key={i}>
        <i className='pull-right fa fa-close' onClick={() => removeResponseSet(rs.id)}/>
        <DraggableResponseSet  responseSet={rs} routes={routes}/>
        </div>);
      })}
      <select readOnly={true} value={this.state.selectedResponseSets.map((rs) => rs.id )} name="linked_response_sets[]" id="linked_response_sets" size="5" multiple="multiple" className="form-control"  style={{display: 'none'}}>
        {this.state.selectedResponseSets.map((rs) => {
          return <option key={rs.id} value={rs.id}>a</option>;
        })}
      </select>
    </div>;
  }
}


DropTarget.propTypes = {
  handleResponseSetsChange: PropTypes.func.isRequired,
  selectedResponseSets: PropTypes.array,
  routes: PropTypes.object,
  isValidDrop: PropTypes.bool
};

let DroppableTarget = Droppable(DropTarget, onDrop);

class QuestionForm extends Component{

  constructor(props) {
    super(props);
    if(this.props.action === 'new'){
      this.state = this.stateForNew();
    }else{
      this.state = this.stateForRevise(this.props.question);
    }
    this.handleResponseSetsChange = this.handleResponseSetsChange.bind(this);
    this.unsavedState = false;
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
      this.props.questionSubmitter(this.state, () => {
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

  stateForRevise(question) {
    var reviseState = {};
    _.forOwn(this.stateForNew(), (v, k) => reviseState[k] = question[k] || v);
    reviseState.conceptsAttributes = filterConcepts(question.concepts);
    reviseState.linkedResponseSets = question.responseSets;
    if (this.props.action === 'revise') {
      reviseState.version += 1;
    }
    return reviseState;
  }

  stateForNew() {
    return {
      content: '',
      description: '',
      questionTypeId: null,
      versionIndependentId: null,
      version: 1,
      harmonized: false,
      responseTypeId: null,
      conceptsAttributes: [],
      linkedResponseSets: [],
      showModal: false
    };
  }

  render(){
    const {question, questionTypes, responseSets, responseTypes, routes} = this.props;
    const state = this.state;
    if(!question || !questionTypes || !responseSets || !responseTypes){
      return (<div>Loading....</div>);
    }

    let submitText = "Create Question";
    let titleText  = "New Question";
    if (this.props.action === 'revise') {
      submitText = "Revise Question";
      titleText  = "Revise Question";
    } else if (this.props.action === 'edit') {
      submitText = "Edit Draft";
      titleText  = "Edit Draft";
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
        <div className="row"><br/>
          <div>
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">{titleText}</h3>
              </div>
              <div className="panel-body">
              <div className="row">
                  <div className="col-md-8 question-form-group">
                      <label className="input-label" htmlFor="content">Question</label>
                      <input className="input-format" placeholder="Question text" type="text" name="content" id="content" defaultValue={state.content} onChange={this.handleChange('content')} />
                  </div>

                  <div className="col-md-4 question-form-group">
                      <label className="input-label" htmlFor="questionTypeId">Category</label>
                      <select className="input-format" name="questionTypeId" id="questionTypeId" defaultValue={state.questionTypeId} onChange={this.handleChange('questionTypeId')} >
                        <option value=""></option>
                        {_.values(questionTypes).map((qt) => {
                          return <option key={qt.id} value={qt.id}>{qt.name}</option>;
                        })}
                      </select>
                  </div>
              </div>

              <div className="row ">
                <div className="col-md-8 question-form-group">
                  <label className="input-label" htmlFor="description">Description</label>
                  <textarea className="input-format" placeholder="Question description" type="text" name="description" id="description" defaultValue={state.description} onChange={this.handleChange('description')} />
                </div>
                <div className="col-md-4 question-form-group">
                  <label className="input-label" htmlFor="responseTypeId">Primary Response Type</label>
                  <select name="responseTypeId" id="responseTypeId" className="input-format" defaultValue={state.responseTypeId} onChange={this.handleChange('responseTypeId')} >
                    {_.values(responseTypes).map((rt) => {
                      return (<option key={rt.id} value={rt.id}>{rt.name}</option>);
                    })}
                  </select>
                </div>
                <div className="col-md-8 question-form-group">
                  <label className="input-label" htmlFor="harmonized">Harmonized: </label>
                  <input className="form-ckeck-input" type="checkbox" name="harmonized" id="harmonized" checked={state.harmonized} onChange={() => this.toggelHarmonized()} />
                </div>
              </div>

              <div className="row ">
                  <div className="col-md-12 ">
                      <label className="input-label" htmlFor="concept_id">Concepts</label>
                      <CodedSetTableEditContainer itemWatcher={(r) => this.handleConceptsChange(r)}
                               initialItems={this.state.conceptsAttributes}
                               parentName={'question'}
                               childName={'concept'} />
                  </div>
              </div>

              <div className="row ">
                  <div className="col-md-6 question-form-group">
                    <label htmlFor="linked_response_sets">Response Sets</label>
                      <div name="linked_response_sets">
                        {_.values(responseSets).map((rs, i) => {
                          return <DraggableResponseSet key={i} responseSet={rs} routes={routes}/>;
                        })}
                      </div>
                  </div>
                  <div className="col-md-6 drop-target selected_response_sets">
                    <label htmlFor="selected_response_sets">Selected Response Sets</label>
                    <DroppableTarget handleResponseSetsChange={this.handleResponseSetsChange} selectedResponseSets={question.responseSets.map((id) => this.props.responseSets[id])} routes={routes}/>
                  </div>
              </div>

              <div className="panel-footer">
                <div className="actions form-group">
                  <button type="submit" name="commit" className="btn btn-default" data-disable-with={submitText}>{submitText}</button>
                  {this.publishButton()}
                  {this.deleteButton()}
                  {this.cancelButton()}
                </div>
              </div>

              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }

  cancelButton() {
    if (this.props.question && this.props.question.id) {
      return(<Link className="btn btn-default" to={`/questions/${this.props.question.id}`}>Cancel</Link>);
    }
    return(<Link className="btn btn-default" to='/questions/'>Cancel</Link>);
  }

  publishButton() {
    if (this.props.action === 'edit') {
      return (
        <button name="publish" className="btn btn-default" data-disable-with='Publish' onClick={() => this.handlePublish()}>Publish</button>
      );
    }
  }

  deleteButton() {
    if (this.props.action === 'edit') {
      return (
        <button name="delete" className="btn btn-default" data-disable-with='Delete' onClick={(e) => this.handleDelete(e)}>Delete</button>
      );
    }
  }

  handlePublish() {
    this.props.publishSubmitter(this.props.id, (response) => {
      if (response.status == 200) {
        this.props.router.push(`/questions/${response.data.id}`);
      }
    });
  }

  handleDelete(e) {
    e.preventDefault();
    this.props.deleteSubmitter(this.props.id, (response) => {
      if (response.status == 200) {
        this.props.router.push(`/questions`);
      }
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.props.action === 'edit') {
      this.props.draftSubmitter(this.props.id, this.state, (response) => {
        // TODO: Handle when the saving question fails.
        this.unsavedState = false;
        if (response.status === 200) {
          this.props.router.push(`/questions/${response.data.id}`);
        }
      });
    } else {
      this.props.questionSubmitter(this.state, (successResponse) => {
        this.unsavedState = false;
        this.props.router.push(`/questions/${successResponse.data.id}`);
      }, (failureResponse) => {
        this.setState({errors: failureResponse.response.data});
      });
    }
  }

  handleConceptsChange(newConcepts) {
    this.setState({conceptsAttributes: filterConcepts(newConcepts)});
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

  toggelHarmonized() {
    this.setState({harmonized: !this.state.harmonized});
  }

  handleResponseSetsChange(newResponseSets){
    this.setState({linkedResponseSets: newResponseSets.map((r)=> r.id)});
    this.unsavedState = true;
  }
}

function filterConcepts(concepts) {
  return concepts.filter((nc)=>{
    return (nc.value!=='' ||  nc.codeSystem !== '' || nc.displayName !=='');
  }).map((nc) => {
    return {value: nc.value, codeSystem: nc.codeSystem, displayName: nc.displayName};
  });
}

QuestionForm.propTypes = {
  question: questionProps,
  questionSubmitter: PropTypes.func.isRequired,
  draftSubmitter: PropTypes.func.isRequired,
  publishSubmitter: PropTypes.func.isRequired,
  deleteSubmitter: PropTypes.func.isRequired,
  responseSets: responseSetsProps,
  routes: allRoutes,
  questionTypes: PropTypes.object,
  responseTypes: PropTypes.object,
  route:  PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  action: PropTypes.string,
  id: PropTypes.string
};

export default QuestionForm;
