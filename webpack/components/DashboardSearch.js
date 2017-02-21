import React, { Component, PropTypes } from 'react';

class DashboardSearch extends Component {

  constructor(props){
    super(props);
    this.state={searchTerms: ''};
    this.onInputChange = this.onInputChange.bind(this);
    this.onFormSubmit  = this.onFormSubmit.bind(this);
  }

  onInputChange(event){
    this.setState({searchTerms: event.target.value});
  }

  onFormSubmit(event){
    event.preventDefault();
    this.props.search(this.state.searchTerms);
    this.setState({searchTerms: ''});
  }

  render() {
    return (
      <form onSubmit={this.onFormSubmit}>
      <div className="row">
        <div className="col-md-12">
          <div className="input-group search-group">
            <label htmlFor="search" className="hidden">Search</label>
            <input onChange={this.onInputChange} type="text" id="search" name="search" className="search-input" placeholder="Search..."/>
            <span className="input-group-btn">
              <button className="search-btn search-btn-default" type="submit"><i className="fa fa-search search-btn-icon" aria-hidden="true"></i></button>
            </span>
          </div>
        </div>
      </div>
    </form>
    );
  }
}

DashboardSearch.propTypes = {
  search: PropTypes.func.isRequired
};

export default DashboardSearch;
