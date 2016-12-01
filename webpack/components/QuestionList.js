import React, { Component, PropTypes } from 'react';
import QuestionWidget from './QuestionWidget';
import QuestionItem from './QuestionItem';
import { add_question } from '../FormBuild';

export default class QuestionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: props.questions,
      response_sets: props.response_sets
    };
  }

export default class QuestionList extends Component {
  render() {
    return (
     <div className="question-group">
       <div className="row">
         <div className="col-md-1"><b>ID</b></div>
         <div className="col-md-5"><b>Content</b></div>
         <div className="col-md-6"><b>Response Sets</b></div>
       </div>
       {this.state.questions.map((q, i) => {
       // Each List Item Component needs a key attribute for uniqueness:
       // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
       // In addition, we pass in our item data and a handleOnClick function that executes a callback that passes
       // the item value
       // <QuestionWidget key={q.id} question={q} routes={this.props.routes} />;
         return (
           <div className="row" key={i}>
             <QuestionItem question={q} response_sets={this.state.response_sets} />
             <div className="col-md-3">
               <div className="btn btn-small btn-default"
                    onClick={() => add_question( q )}>
                 <b>Add</b>
               </div>
             </div>
           </div>
         );
       })}
     </div>
    );
  }
}

QuestionList.propTypes = {
  questions: PropTypes.arrayOf(QuestionWidget.propTypes.question).isRequired,
  routes: QuestionWidget.propTypes.routes.isRequired
};
