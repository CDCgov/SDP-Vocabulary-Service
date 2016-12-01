import React, { Component } from 'react';
import FormsQuestionList from './FormsQuestionList';
import SearchBar from './SearchBar';

const all_qs = JSON.parse(document.getElementById('all_qs-json').innerHTML);
const all_rs = JSON.parse(document.getElementById('all_rs-json').innerHTML);

class QuestionSearch extends Component {
    constructor(props) {
        super(props);

        this.state = {
            questions: all_qs,
            response_sets: all_rs
        };

        this.questionFilter('');
    }

    questionFilter(term) {
        var questions_filtered = [];

        if (term == '') {
            questions_filtered = all_qs;
        } else {
            all_qs.map((q,i) => {
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
                <FormsQuestionList questions={this.state.questions} response_sets={this.state.response_sets} />
            </div>
        );
    }
}

export default QuestionSearch;
