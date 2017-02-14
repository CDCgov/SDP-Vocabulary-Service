import React, { Component, PropTypes } from 'react';

class FormListSearch extends Component {

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
          <div className="input-group form-group">
            <label htmlFor="search" className="hidden">Search Forms</label>
            <input onChange={this.onInputChange} type="text" id="search" name="search" className="form-control" placeholder="Search Forms..."/>
            <span className="input-group-btn">
              <button className="btn btn-default" type="submit">Go!</button>
            </span>
          </div>
        </div>
      </div>
    </form>
    );
  }
}

FormListSearch.propTypes = {
  search: PropTypes.func.isRequired
};

export default FormListSearch;
