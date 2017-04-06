import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { questionProps } from "../prop-types/question_props";
import currentUserProps from '../prop-types/current_user_props';
import { fetchSearchResults } from '../actions/search_results_actions';
import SearchResult from './SearchResult';
import DashboardSearch from './DashboardSearch';
import SearchResultList from '../components/SearchResultList';
import { Modal, Button } from 'react-bootstrap';

class QuestionItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSearchModal: false,
      selectedSearchResult: false,
      selectedResponseSet: {},
      searchTerms: ''
    };
    this.showResponseSetSearch = this.showResponseSetSearch.bind(this);
    this.hideResponseSetSearch = this.hideResponseSetSearch.bind(this);
    this.handleSelectSearchResult = this.handleSelectSearchResult.bind(this);
    this.search = this.search.bind(this);
  }

  showResponseSetSearch() {
    this.setState({ showSearchModal: true });
  }

  hideResponseSetSearch() {
    this.setState({ showSearchModal: false });
  }

  handleSelectSearchResult(rs) {
    this.setState({ selectedSearchResult: true, selectedResponseSet: rs, showSearchModal: false });
  }

  search(searchTerms) {
    let searchType = 'response_set';
    if(searchTerms === ''){
      searchTerms = null;
    }
    this.setState({searchTerms: searchTerms});
    this.props.fetchSearchResults(searchTerms, searchType);
  }

  searchModal() {
    return (
      <Modal show={this.state.showSearchModal} onHide={this.hideResponseSetSearch}>
        <Modal.Header closeButton bsStyle='search'>
          <Modal.Title>Search Response Sets</Modal.Title>
        </Modal.Header>
        <Modal.Body bsStyle='search'>
          <DashboardSearch search={this.search} />
          <SearchResultList searchResults={this.props.searchResults} currentUser={this.props.currentUser} handleSelectSearchResult={this.handleSelectSearchResult} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => this.hideResponseSetSearch()} bsStyle="primary">Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  render() {
    if (!this.props.question) {
      return (<div>"Loading..."</div>);
    }
    return (
      <div className='question-item'>
        {this.searchModal()}
        <div className="col-md-9"><SearchResult type='question' result={{Source:this.props.question}} currentUser={{id: -1}} /></div>
        <div className="col-md-3" >
          <div className="form-group">
            <input aria-label="Question IDs" type="hidden" name="question_ids[]" value={this.props.question.id}/>
            <select className="col-md-12" aria-label="Response Set IDs" name='responseSet' data-question={this.props.index} value={this.props.responseSetId} onChange={this.props.handleResponseSetChange(this.props.index)}>
              {this.props.responseSets.length > 0 && this.props.responseSets.map((r, i) => {
                return (
                  <option value={r.id} key={`${r.id}-${i}`}>{r.name} </option>
                );
              })}
              {this.state.selectedSearchResult &&
                <option value={this.state.selectedResponseSet.id} selected>{this.state.selectedResponseSet.name}</option>
              }
              <option aria-label=' '></option>
            </select>
            <a title="Search Response Sets" href="#" onClick={(e) => {
              e.preventDefault();
              this.showResponseSetSearch();
              this.props.fetchSearchResults('', 'response_set');
            }}><i className="fa fa-search fa-2x"></i>Search All</a>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    searchResults: state.searchResults,
    currentUser: state.currentUser
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchSearchResults}, dispatch);
}

QuestionItem.propTypes = {
  question: questionProps,
  responseSets: PropTypes.array,
  index: PropTypes.number.isRequired,
  handleResponseSetChange: PropTypes.func,
  fetchSearchResults: PropTypes.func,
  responseSetId: PropTypes.number,
  searchResults: PropTypes.object,
  currentUser: currentUserProps
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionItem);
