import React from 'react';

const QuestionItem = ({question, responseSets, index, removeQuestion, reorderQuestion}) => {
  if (!question || !responseSets) {
    return "Loading...";
  }
  return (
    <div>
      <div className="col-md-1" >{question.id}</div>
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
               onClick={() => reorderQuestion(index, 1)}>
            <b>Move Up</b>
          </div>
          <div className="btn btn-small btn-default"
               onClick={() => reorderQuestion(index, -1)}>
            <b>Move Down</b>
          </div>
          <div className="btn btn-small btn-default"
               onClick={() => removeQuestion(index)}>
            <b>Remove</b>
          </div>
        </div>
      </div>
    </div>
  );
};

QuestionItem.propTypes = {
  question: React.PropTypes.object.isRequired,
  responseSets: React.PropTypes.array.isRequired,
  index: React.PropTypes.number.isRequired,
  removeQuestion: React.PropTypes.func.isRequired,
  reorderQuestion: React.PropTypes.func.isRequired
};

export default QuestionItem;
