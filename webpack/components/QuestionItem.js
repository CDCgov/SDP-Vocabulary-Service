import React from 'react';
import { questionProps } from "../prop-types/question_props";

const QuestionItem = ({question, responseSets, index, removeQuestion, reorderQuestion}) => {
  if (!question || !responseSets) {
    return "Loading...";
  }
  return (
    <div className='question-item'>
      <div className="col-md-1" >{question.id}</div>
      <div>
        <div className="col-md-5" id={`question_id_${question.id}`} >{question.content}</div>
        <div className="col-md-3" >
          <input aria-label="Question IDs" type="hidden" name="question_ids[]" value={question.id}/>
          <select className="col-md-12" aria-label="Response Set IDs" name='response_set_ids[]' id='response_set_ids' selected={question.responseTypeId}>
            {responseSets.map((r, i) => {
              return (
                <option value={r.id} key={i}>{r.name} </option>
              );
            })}
            <option aria-label=' '></option>
          </select>

        </div>
      </div>
    </div>
  );
};

QuestionItem.propTypes = {
  question: questionProps,
  responseSets: React.PropTypes.array.isRequired,
  index: React.PropTypes.number.isRequired,
  removeQuestion: React.PropTypes.func.isRequired,
  reorderQuestion: React.PropTypes.func.isRequired
};

export default QuestionItem;
