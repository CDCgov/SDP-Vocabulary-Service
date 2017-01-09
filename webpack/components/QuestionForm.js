import React, { Component, PropTypes } from 'react';
import { Draggable, Droppable } from './Draggable';
import ResponseSetWidget from './ResponseSetWidget';


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
  selectedResponseSets: PropTypes.array,
  routes: PropTypes.object,
  isValidDrop: PropTypes.bool
};

let DroppableTarget = Droppable(DropTarget, onDrop);

let QuestionForm = ({question= {}, selectedResponseSets=[], responseSets = [], routes, questionTypes = [], responseTypes = []}) => {
  let submitText = "Create Question";
  let titleText = "New Question";
  if (question.version_independent_id) {
    submitText = "Revise Question";
    titleText = "Revise Question";
  }
  return (
    <div className="row"><br/>
      <div>
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">{titleText}</h3>
          </div>
          <div className="panel-body">
          <div className="row">
              <div className="col-md-8 question-form-group">
                  <label className="input-label" htmlFor="question_content">Question</label>
                  <input className="input-format" placeholder="Question text" type="text" name="question[content]" id="question_content" defaultValue={question.content}/>
              </div>

              <div className="col-md-4 question-form-group">
                  <label className="input-label" htmlFor="question_question_type_id">Type</label>
                  <select className="input-format" name="question[question_type_id]" id="question_question_type_id" defaultValue={question.question_type_id}>
                    <option value=""></option>
                    {questionTypes.map((qt) => {
                      return <option key={qt.id} value={qt.id}>{qt.name}</option>;
                    })}
                  </select>
              </div>
          </div>

          <div className="row ">
              <div className="col-md-8 question-form-group">
                  <label className="input-label" htmlFor="response_type_id">Primary Response Type</label>
                  <select name="response_type_id" id="response_type_id" className="input-format" defaultValue={question.response_type_id}>
                    {responseTypes.map((rt) => {
                      return (<option key={rt.id} value={rt.id}>{rt.name}</option>);
                    })}
                  </select>
              </div>
              <div className="col-md-4 question-form-group"></div>
          </div>

          <div className="row ">

              <div className="col-md-6 question-form-group">
                <label htmlFor="linked_response_sets">Response Sets</label>
                  <div name="linked_response_sets">
                    {responseSets.map((rs, i) => {
                      return <DraggableResponseSet key={i} responseSet={rs} routes={routes}/>;
                    })}
                  </div>
              </div>
              <div className="col-md-6 drop-target selected_response_sets">
                <label htmlFor="selected_response_sets">Selected</label>
                <DroppableTarget selectedResponseSets={selectedResponseSets} routes={routes}/>
              </div>
          </div>

          <div className="panel-footer">
            <div className="actions form-group">
              <button type="submit" name="commit" className="btn btn-default" data-disable-with={submitText}>{submitText}</button>
              <a className="btn btn-default" href={routes.questions_path()}>Cancel</a>
            </div>
          </div>


          </div>
        </div>
      </div>
    </div>
  );
};

QuestionForm.propTypes = {
  question: PropTypes.object,
  selectedResponseSets:PropTypes.array,
  responseSets: PropTypes.array,
  routes: PropTypes.object,
  questionTypes: PropTypes.array,
  responseTypes: PropTypes.array
};

export default QuestionForm;
