import React, { Component } from 'react';

class SearchBar extends Component {
  constructor(props){
    super(props);

    this.state = { term: '' };
  }

  render() {
    return (
            <div className="search-bar">
                <input
                    name="search"
                    placeholder="Search Questions"
                    value={this.state.term}
                    onChange={event => this.onInputChange(event.target.value)} />
            </div>
    );
  }

  onInputChange(term) {
    this.setState({term});
    this.props.onSearchTermChange(term);
  }
}


SearchBar.propTypes = {
  onSearchTermChange: React.PropTypes.func
};

export default SearchBar;
