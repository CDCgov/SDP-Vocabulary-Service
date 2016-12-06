import React, { Component } from 'react';
import FormsQuestionList from './FormsQuestionList';
import SearchBar from './SearchBar';

class QuestionSearch extends Component {
    constructor(props) {
        super(props);

        this.state = {
            questions: props.allQs,
            responseSets: props.allRs,
            allQs: props.allQs
        };
    }

    questionFilter(term) {
        var questionsFiltered = [];

        if (term == '') {
            questionsFiltered = this.state.allQs;
        } else {
            this.state.allQs.map((q) => {
                if (q.content.toLowerCase().includes(term.toLowerCase())){
                    questionsFiltered.push(q);
                }
            });
        }

        this.setState({
            questions: questionsFiltered
        });
    }

    render() {
        return (
            <div>
                <SearchBar onSearchTermChange={term => this.questionFilter(term)} />
                <FormsQuestionList questions={this.state.questions} responseSets={this.state.responseSets} btnType={'add'} />
            </div>
        );
    }
}


QuestionSearch.propTypes = {
  allQs: React.PropTypes.array,
  allRs: React.PropTypes.array
};

export default QuestionSearch;
