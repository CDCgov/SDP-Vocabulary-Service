import { Component } from 'react';
import { SearchParameters } from '../actions/search_results_actions';

export class AbstractSearchComponent extends Component {
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
