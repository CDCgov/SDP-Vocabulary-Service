import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { fetchResponseSets } from '../actions/response_set_actions';
import ResponseSetList from '../components/ResponseSetList';
import ResponseSetListSearch from '../components/ResponseSetListSearch';
import Routes from '../routes';
import { responseSetProps } from '../prop-types/response_set_props';
import { getMostRecentResponseSets } from '../selectors/response_set_selectors';

class ResponseSetsContainer extends Component {
  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
  }

  componentWillMount() {
    this.props.fetchResponseSets();
  }

  search(searchTerms){
    this.props.fetchResponseSets(searchTerms);
  }

  render() {
    if(!this.props.responseSets){
      return (
        <div>Loading..</div>
      );
    }
    return (
      <div className='container'>
        <div className='row basic-bg'>
          <div className='col-md-12'>
            <ResponseSetListSearch search={this.search} />
            <ResponseSetList responseSets={this.props.responseSets} routes={Routes} />
            <Link className='btn btn-default' to='/responseSets/new'>New Response Set</Link>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    responseSets: getMostRecentResponseSets(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchResponseSets}, dispatch);
}

ResponseSetsContainer.propTypes = {
  responseSets: PropTypes.objectOf(responseSetProps),
  fetchResponseSets: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(ResponseSetsContainer);
