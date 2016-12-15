import React, { Component, PropTypes } from 'react';

class SearchWidgetBar extends Component {
    constructor(props){
        super(props);

        this.state = { 
          term: '',
          category: 'Select Category'
        };
    }

    render() {
        return (
            <div>
              <div className="search-group" id="search-group">
                <div className="search-group-btn">
                  <button type="button" id="search-group-btn" className="search-category-btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{this.state.category}<span className="search-caret"></span></button>
                    <ul className="dropdown-menu">
                      <li><a onClick={() => this.changeCategory('Questions')} >Questions</a></li>
                      <li><a onClick={() => this.changeCategory('Response Sets')} >Response Sets</a></li>
                      <li><a onClick={() => this.changeCategory('Forms')} >Forms</a></li>
                      <li><a onClick={() => this.changeCategory('Select Category')} >Clear Filter</a></li>
                    </ul>
                </div>

                <input 
                  type="text" className="search-input" 
                  id="search"
                  name="search"
                  value={this.state.term}
                  onChange={event => this.onInputChange(event.target.value)}
                  onKeyUp={event => {if (event.keyCode ==13) this.onBtnClick(this.state.term, this.state.category);}}
                  placeholder="Search..." />
                
                <div className="input-group-btn">
                  <button 
                    className="search-btn search-btn-default"
                    id="search-btn"
                    aria-label="search-btn"
                    onClick={() => this.onBtnClick(this.state.term, this.state.category)}
                    type="button">
                    <i className="fa fa-search search-btn-icon" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>
        );
    }

    onBtnClick(term, category) {
        this.props.onSearchTermChange(term, category);
    }

    onInputChange(term) {
        this.setState({term});
    }

    changeCategory(category) {
        this.setState({category});
    }
}

SearchWidgetBar.propTypes = {
  onSearchTermChange: PropTypes.func.isRequired
};



export default SearchWidgetBar;
