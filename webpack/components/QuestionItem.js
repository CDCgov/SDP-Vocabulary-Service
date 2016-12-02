import React, { Component } from 'react';
import { add_question } from '../FormBuild';
import { remove_question } from '../FormBuild';

const QuestionItem = ({question, response_sets, btn_type}) => {
  if (!question || !response_sets) {
    return "Loading...";
  }

  return (
    <div>
      <div className="col-md-1" >{question.id}</div>
      {(() => {
        if(btn_type == 'add') {
          return(
            <div data-question-id={question.id}>
              <div className="col-md-8" name="question_content" >{question.content}</div>
              <div className="col-md-3">
                <div className="btn btn-small btn-default"
                     onClick={() => add_question( question )}>
                  <b>Add</b>
                </div>
              </div>
            </div>
          );
        } else if (btn_type == 'remove') {
          return(
            <div>
              <div className="col-md-5" id={question.id} >{question.content}</div>
              <div className="col-md-3" >
                <input aria-label="Question IDs" id={"question_id_"+question.id} type="hidden" name="question_ids[]" value={question.id}/>
                <select className="col-md-12" aria-label="Response Set IDs" name='response_set_ids[]' id='response_set_ids'>
                  {response_sets.map((r, i) => {
                   return (
                      <option value={r.id} key={i} >{r.name}</option>
                    );
                  })}
                  <option aria-label=' '></option>
                </select>
              </div>
              <div className="col-md-3">
                <div className="btn btn-small btn-default" 
                     onClick={() => remove_question( question )}>
                  <b>Remove</b>
                </div>
              </div>
            </div>
          );
        }
      })()}
    </div>
  );
}

export default QuestionItem;
