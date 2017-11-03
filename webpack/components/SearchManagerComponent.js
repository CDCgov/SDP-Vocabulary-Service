import SearchStateComponent from './SearchStateComponent';

// This is for components that will contain DashboardSearch. It provides the
// callback that DashboardSearch needs as well as search and loadMore functions.
export default class SearchManagerComponent extends SearchStateComponent {
  constructor(props) {
    super(props);
  }

  // Callback can be used if other things need to happen with the new search
  // parameters. The callback will be passed the new parameters.
  loadMore(context, callback=null) {
    let searchParameters = this.currentSearchParameters();
    searchParameters.page = this.state.page + 1;
    this.props.fetchMoreSearchResults(context, searchParameters);
    if (callback) {
      callback(searchParameters);
    }
    this.setState({page: searchParameters.page});
  }

  changeFiltersCallback(newState) {
    this.setState(newState);
  }

  // Callback can be used if other things need to happen with the new search
  // parameters. The callback will be passed the new parameters.
  search(searchParameters, context, callback=null) {
    let newParams = Object.assign(this.currentSearchParameters(), searchParameters);
    this.props.fetchSearchResults(context, newParams);
    if (callback) {
      callback(newParams);
    }
    newParams.page = 1;
    this.setState(newParams);
  }
}
