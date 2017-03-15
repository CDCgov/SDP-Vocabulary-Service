import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { saveQuestion } from '../actions/questions_actions';
import Errors from '../components/Errors';
import QuestionForm from '../components/QuestionForm';
import ResponseSetList  from '../components/ResponseSetList';
import ResponseSetDragWidget  from '../components/ResponseSetDragWidget';
import { responseSetsProps }  from '../prop-types/response_set_props';
import { fetchResponseTypes } from '../actions/response_type_actions';
import { fetchQuestionTypes } from '../actions/question_type_actions';
import { fetchResponseSets }  from '../actions/response_set_actions';
import { getMostRecentResponseSets } from '../selectors/response_set_selectors';
import {Modal, Button} from 'react-bootstrap';
import _ from 'lodash';
import $ from 'jquery';

class QuestionModalContainer extends Component {

  constructor(props) {
    super(props);
    this.saveNewQuestion = this.saveNewQuestion.bind(this);
    this.closeQuestionModal = this.closeQuestionModal.bind(this);
    this.handleResponseSetsChange = this.handleResponseSetsChange.bind(this);
    this.state = {linkedResponseSets:{}, showResponseSetWidget: false};
  }

  componentWillMount() {
    this.props.fetchQuestionTypes();
    this.props.fetchResponseTypes();
    this.props.fetchResponseSets();
  }

  handleResponseSetsChange(newResponseSets){
    this.setState({linkedResponseSets: _.keyBy(newResponseSets, 'id')});
    this.unsavedState = true;
  }

  saveNewQuestion(newQuestion){
    newQuestion.linkedResponseSets = _.values(this.state.linkedResponseSets).map((r)=> r.id);
    this.props.saveQuestion(newQuestion, (successResponse) => {
      this.setState({showResponseSetWidget:false, linkedResponseSets: {}, errors: null});
      this.props.saveQuestionSuccess(successResponse);
    }, (failureResponse) => {
      this.setState({errors: failureResponse.response.data});
    });
  }

  closeQuestionModal(){
    this.setState({showResponseSetWidget:false, linkedResponseSets: {}, errors: null});
    this.props.closeQuestionModal();
  }

  responseSetWidgetBody(){
    return (
      <div className={this.state.showResponseSetWidget ? '' : 'hidden'}>
        <Modal.Body bsStyle='response-set'>
          <ResponseSetDragWidget handleResponseSetsChange={this.handleResponseSetsChange}
                                 responseSets={this.props.responseSets}
                                 selectedResponseSets={_.values(this.state.linkedResponseSets)} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={()=>this.setState({showResponseSetWidget:false})} bsStyle="primary">Done</Button>
        </Modal.Footer>
      </div>
    );
  }

  questionFormBody(){
    return (
      <div className={this.state.showResponseSetWidget ? 'hidden' : ''}>
        <Modal.Body bsStyle='question'>
          <QuestionForm draftSubmitter   ={()=>{}}
                        deleteSubmitter  ={()=>{}}
                        publishSubmitter ={()=>{}}
                        questionSubmitter={this.saveNewQuestion}
                        question = {{}}
                        action={'new'}
                        questionTypes={this.props.questionTypes}
                        responseSets ={this.props.responseSets}
                        responseTypes={this.props.responseTypes}/>
          <div className="row selected-response-sets">
            <label className="input-label" htmlFor="response-set-list">Response Sets</label>
            <div className="col-md-12">
                <div className="panel panel-default">
                  <div className="panel-body">
                    {_.keys(this.state.linkedResponseSets).length > 0 ? <ResponseSetList responseSets={this.state.linkedResponseSets} /> : 'No Response Sets selected'}
                  </div>
                </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
        <Button onClick={()=> $('#submit-question-form').click()}>Add Question</Button>
        <Button onClick={()=> this.setState({showResponseSetWidget:true})} bsStyle="primary">Response Sets</Button>
        </Modal.Footer>
      </div>
    );
  }

  render() {
    if(!this.props.questionTypes || !this.props.responseSets || !this.props.responseTypes){
      return (
        <div>Loading...</div>
      );
    }
    return (
      <Modal bsStyle='question' show={this.props.showModal} onHide={this.closeQuestionModal} >
        <Modal.Header closeButton bsStyle='question'>
          <Modal.Title>New Question</Modal.Title>
        </Modal.Header>
        <Errors errors={this.state.errors} />
        {this.questionFormBody()}
        {this.responseSetWidgetBody()}
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {questionTypes: state.questionTypes, responseTypes: state.responseTypes, responseSets: getMostRecentResponseSets(state)};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchQuestionTypes, fetchResponseTypes, fetchResponseSets, saveQuestion}, dispatch);
}

QuestionModalContainer.propTypes = {
  responseSets:  responseSetsProps,
  questionTypes: PropTypes.object,
  responseTypes: PropTypes.object,
  closeQuestionModal:  PropTypes.func.isRequired,
  saveQuestion: PropTypes.func,
  saveQuestionSuccess: PropTypes.func.isRequired,
  fetchResponseSets:  PropTypes.func,
  fetchQuestionTypes: PropTypes.func,
  fetchResponseTypes: PropTypes.func,
  route:  PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  showModal: PropTypes.bool.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionModalContainer);
