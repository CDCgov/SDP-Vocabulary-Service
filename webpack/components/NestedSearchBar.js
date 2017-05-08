import React, { Component } from 'react';

class NestedSearchBar extends Component {
  constructor(props){
    super(props);
    this.state = { term: '' };
  }

  render() {
    return (
      <div className="search-bar">
        <input
            className="input-format"
            placeholder={`Search ${this.props.modelName}s...`}
            value={this.state.term}
            onChange={event => this.onInputChange(event.target.value)}
            onKeyPress={event => this.onEnter(event)} />
      </div>
    );
  }

  onEnter(e) {
    if(e.key === 'Enter') {
      e.preventDefault();
      this.props.onSearchTermChange(this.state.term);
    }
  }

  onInputChange(term) {
    this.setState({term});
    this.props.onSearchTermChange(term);
  }
}


NestedSearchBar.propTypes = {
  modelName: React.PropTypes.string,
  onSearchTermChange: React.PropTypes.func
};

export default NestedSearchBar;
