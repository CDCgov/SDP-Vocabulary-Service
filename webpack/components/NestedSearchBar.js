import React, { Component } from 'react';

class NestedSearchBar extends Component {
  constructor(props){
    super(props);
    this.state = { term: '' };
  }

  render() {
    return (
      <div className="search-bar input-group nested-search-group">
        <input
            className="search-input"
            placeholder={`Search ${this.props.modelName}s...`}
            value={this.state.term}
            aria-label={`Search ${this.props.modelName}s`}
            onChange={event => this.onInputChange(event.target.value)}
            onKeyPress={event => this.onEnter(event)} />
          <span className="input-group-btn">
            <button id="search-btn" className="search-btn search-btn-default" aria-label="search-button" onClick={(event) => this.onButtonClick(event)}><i className="fa fa-search search-btn-icon" aria-hidden="true"></i></button>
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
  modelName: React.PropTypes.string,
  onSearchTermChange: React.PropTypes.func
};

export default NestedSearchBar;
