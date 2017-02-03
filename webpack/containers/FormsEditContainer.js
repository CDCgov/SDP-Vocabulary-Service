import React, { Component, PropTypes } from 'react';
import FormList from '../components/FormList';
import Routes from '../routes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchForm } from '../actions/form_actions';
import { removeQuestion, reorderQuestion, addQuestion } from '../actions/questions_actions';
import QuestionItem from '../components/QuestionItem';
import { fetchResponseSets } from '../actions/response_set_actions';
import { fetchQuestions } from '../actions/questions_actions';
import QuestionSearch from './QuestionSearch';



let AddedQuestions = ({form, reorderQuestion, removeQuestion, responseSets}) => {
  return (
    <div id="added-questions" aria-label="Added">
    <div className="question-group">
      <div className="row">
        <div className="col-md-1"><b>ID</b></div>
          <div>
            <div className="col-md-5"><b>Content</b></div>
            <div className="col-md-6"><b>Response Sets</b></div>
          </div>
      </div>
      <br/>
      {form.questions.map((q, i) =>
        <div className="row" key={q.id}>
          <QuestionItem question={q} responseSets={responseSets} index={i}
                        removeQuestion={removeQuestion}
                        reorderQuestion={reorderQuestion}/>
          <div className="col-md-3">
            <div className="btn btn-small btn-default move-up"
                 onClick={() => reorderQuestion(form, i, 1)}>
              <b>Move Up</b>
            </div>
            <div className="btn btn-small btn-default move-down"
                 onClick={() => reorderQuestion(form, i, -1)}>
              <b>Move Down</b>
            </div>
            <div className="btn btn-small btn-default"
                 onClick={() => removeQuestion(form, i)}>
              <b>Remove</b>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  )
}



class FormsContainer extends Component {
  componentWillMount() {
    this.props.fetchForm(this.props.params.id);
    this.props.fetchResponseSets();
    this.props.fetchQuestions();
  }
  
  render() {
    if(this.props.forms.loading == true){
      return (
        <div>Loading...</div>
      );
    }
    let form = this.props.forms[this.props.params.id];
    return (
      <div className="container basic-bg">
        <div className="row">
          <div className="col-md-4">
            <QuestionSearch allQs={this.props.questions}
              allRs={this.props.responseSets}
              addQuestion={this.props.addQuestion}
              form={form} />
          </div>
          <div className="col-md-8">
          <div className="col-md-8" id='form-div'>
          <div className="row" id="form-button-div">
            <div className="col-md-2">
              <div className="btn btn-default btn-sm" disabled>
                <span className="fa fa-navicon"></span>
              </div>
            </div>
            <div className="col-md-7"></div>
            <div className="col-md-3">
              <div className="col-md-6">
                <div className="btn btn-default" disabled>Export</div>
              </div>
              <div className="col-md-6">
                <div className="actions">
                  SUBMIT
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <hr />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              FORM NAME
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              CONTROL NUMBER
            </div>
          </div>
          <b>Form Questions:</b>
          <AddedQuestions form={form}
            responseSets={this.props.responseSets}
            reorderQuestion={this.props.reorderQuestion}
            removeQuestion={this.props.removeQuestion}/>


          </div>
          </div>
        </div>
      </div>

  )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchResponseSets, fetchQuestions, fetchForm, removeQuestion, reorderQuestion}, dispatch);
}
function mapStateToProps(state) {
  return {
    forms: state.forms,
    responseSets: _.values(state.responseSets),
    questions: _.values(state.questions)
  };
}
FormsContainer.propTypes = {
  forms: FormList.propTypes.forms,
  fetchForm: PropTypes.func,
  removeQuestion: React.PropTypes.func.isRequired,
  reorderQuestion: React.PropTypes.func.isRequired,
  fetchResponseSets: React.PropTypes.func.isRequired,
  fetchQuestions: React.PropTypes.func.isRequired
};
export default connect(mapStateToProps, mapDispatchToProps)(FormsContainer);
