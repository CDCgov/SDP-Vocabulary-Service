import React from 'react';
import { addQuestion } from '../FormBuild';
import { removeQuestion } from '../FormBuild';

const QuestionItem = ({question, responseSets, btnType}) => {
  if (!question || !responseSets) {
    return "Loading...";
  }

  return (
    <div>
      <div className="col-md-1" >{question.id}</div>
      {(() => {
        if(btnType == 'add') {
          return(
            <div data-question-id={question.id}>
              <div className="col-md-8" name="question_content" >{question.content}</div>
              <div className="col-md-3">
                <div id={"question_"+question.id+"_add"} className="btn btn-small btn-default"
                     onClick={() => addQuestion( question )}>
                  <b>Add</b>
                </div>
              </div>
            </div>
          );
        } else if (btnType == 'remove') {
          return(
            <div>
              <div className="col-md-5" id={question.id} >{question.content}</div>
              <div className="col-md-3" >
                <input aria-label="Question IDs" type="hidden" name="question_ids[]" value={question.id}/>
                <select className="col-md-12" aria-label="Response Set IDs" name='response_set_ids[]' id='response_set_ids'>
                  {responseSets.map((r, i) => {
                   return (
                      <option value={r.id} key={i} >{r.name}</option>
                    );
                  })}
                  <option aria-label=' '></option>
                </select>
              </div>
              <div className="col-md-3">
                <div className="btn btn-small btn-default" 
                     onClick={() => removeQuestion( question )}>
                  <b>Remove</b>
                </div>
              </div>
            </div>
          );
        }
      })()}
    </div>
  );
};

QuestionItem.propTypes = {
  question: React.PropTypes.object,
  responseSets: React.PropTypes.array,
  btnType: React.PropTypes.string
};

export default QuestionItem;
