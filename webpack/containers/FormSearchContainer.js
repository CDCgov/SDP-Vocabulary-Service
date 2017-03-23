import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addForm } from '../actions/form_actions';
import { formProps } from '../prop-types/form_props';
import { surveyProps } from '../prop-types/survey_props';
import SearchBar from '../components/SearchBar';
import SearchResult from '../components/SearchResult';
import currentUserProps from "../prop-types/current_user_props";
//import _ from 'lodash';

class FormSearchContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      forms: props.allForms,
      allForms: props.allForms
    };
  }

  componentWillUpdate(nextProps) {
    if(nextProps.allForms != this.props.allForms) {
      this.setState({forms: nextProps.allForms});
    }
  }

  onSearchTermChange(term) {
    var formsFiltered = [];
    if (term == '') {
      formsFiltered = this.props.allForms;
    } else {
      this.props.allForms.map((q) => {
        if (q.name.toLowerCase().includes(term.toLowerCase())){
          formsFiltered.push(q);
        }
      });
    }
    this.setState({
      forms: formsFiltered,
      term: term
    });
    return formsFiltered;
  }

  render() {
    return (
      <div>
        <SearchBar modelName='Form' onSearchTermChange={term => this.onSearchTermChange(term)} />
        {this.state.forms && this.state.forms.map((f) => {
          return (
            <SearchResult key={f.id} type='form' result={{Source: f}} currentUser={this.props.currentUser} extraActionName='Add to Survey'
            extraAction={() => this.props.addForm(this.props.survey, f)}/>
          );
        })}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({addForm}, dispatch);
}

FormSearchContainer.propTypes = {
  survey: surveyProps,
  allForms: PropTypes.arrayOf(formProps),
  addForm: React.PropTypes.func.isRequired,
  currentUser: currentUserProps
};

export default connect(null, mapDispatchToProps)(FormSearchContainer);
