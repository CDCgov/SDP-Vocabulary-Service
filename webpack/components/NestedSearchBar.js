import React, { Component } from 'react';
import PropTypes from 'prop-types';

class NestedSearchBar extends Component {
  constructor(props){
    super(props);
    this.state = { term: '' };
  }

  render() {
    return (
      <div className="search-bar nested-search-group">
        <input
            className="search-input form-control"
            placeholder={`Search ${this.props.modelName}s...`}
            value={this.state.term}
            aria-label={`Search ${this.props.modelName}s`}
            name={`Search${this.props.modelName}s`}
            onChange={event => this.onInputChange(event.target.value)}
            onKeyPress={event => this.onEnter(event)} />
          <span className="input-group-btn">
            <button id={`search-btn-${this.props.modelName}`} className="search-btn search-btn-default" aria-label="Click to submit search" onClick={(event) => this.onButtonClick(event)}><i className="fa fa-search search-btn-icon" aria-hidden="true"></i></button>
          </span>
      </div>
    );
  }

  onButtonClick(e) {
    e.preventDefault();
    this.props.onSearchTermChange(this.state.term);
  }

  onEnter(e) {
    if(e.key === 'Enter') {
      e.preventDefault();
      this.props.onSearchTermChange(this.state.term);
    }
  }

  onInputChange(term) {
    this.setState({term});
  }
}


NestedSearchBar.propTypes = {
  modelName: PropTypes.string,
  onSearchTermChange: PropTypes.func
};

export default NestedSearchBar;
