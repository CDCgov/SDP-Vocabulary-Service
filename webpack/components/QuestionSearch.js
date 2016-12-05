import React, { Component } from 'react';
import FormsQuestionList from './FormsQuestionList';
import SearchBar from './SearchBar';

class QuestionSearch extends Component {
    constructor(props) {
        super(props);

        this.state = {
            questions: props.all_qs,
            response_sets: props.all_rs,
            all_qs: props.all_qs
        };
    }

    questionFilter(term) {
        var questions_filtered = [];

        if (term == '') {
            questions_filtered = this.state.all_qs;
        } else {
            this.state.all_qs.map((q) => {
                if (q.content.toLowerCase().includes(term.toLowerCase())){
                    questions_filtered.push(q);
                }
            });
        }

        this.setState({
            questions: questions_filtered
        });
    }

    render() {
        return (
            <div>
                <SearchBar onSearchTermChange={term => this.questionFilter(term)} />
                <FormsQuestionList questions={this.state.questions} response_sets={this.state.response_sets} btn_type={'add'} />
            </div>
        );
    }
}


QuestionSearch.propTypes = {
  all_qs: React.PropTypes.array,
  all_rs: React.PropTypes.array
};

export default QuestionSearch;
