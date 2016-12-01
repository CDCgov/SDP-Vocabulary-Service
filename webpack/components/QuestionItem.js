import React, { Component } from 'react';

const QuestionItem = ({question, response_sets}) => {
   if (!question || !response_sets) {
     return "Loading...";
   }
   return (
     <div>
       <div className="col-md-1" >{question.id}</div>
       <div className="col-md-5" >{question.content}</div>
       <div className="col-md-3" >
         <input aria-label="Question IDs" id={"question_id_"+question.id} type="hidden" name="question_ids[]" value={question.id}/>
         <select aria-label="Response Set IDs" name='response_set_ids[]' id='response_set_ids'>
           {response_sets.map((r, i) => {
             return (
               <option value={r.id} key={i} >{r.name}</option>
             );
           })}
           <option aria-label=' '></option>
         </select>
       </div>
     </div>
   );
}
export default QuestionItem;
