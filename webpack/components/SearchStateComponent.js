import { Component } from 'react';
import { SearchParameters } from '../actions/search_results_actions';

// Provides a function to pull the search parameters out of a components state
export default class SearchStateComponent extends Component {
  constructor(props) {
    super(props);
  }

  currentSearchParameters() {
    let params = Object.assign({}, this.state);
    if(this.state.type === '') {
      params.type = null;
    }
    if(this.state.searchTerms === ''){
      params.searchTerms = null;
    }
    return new SearchParameters(params);
  }
}
