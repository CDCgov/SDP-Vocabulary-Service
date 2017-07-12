import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Draggable, Droppable } from './Draggable';
import SearchResult from './SearchResult';
import NestedSearchBar from '../components/NestedSearchBar';
import currentUserProps from '../prop-types/current_user_props';
import { fetchSearchResults, fetchMoreSearchResults } from '../actions/search_results_actions';
import { responseSetsProps } from '../prop-types/response_set_props';

let setData = function(){
  return {"Text": JSON.stringify(this.props.result.Source)};
};

let DraggableResponseSet = Draggable(SearchResult, setData);

let onDrop = (evt, self) => {
  let rs = JSON.parse(evt.dataTransfer.getData("Text"));
  if(!self.props.selectedResponseSets.find((r) => {
    return r.id == rs.id;
  })) {
    self.props.handleResponseSetsChange(self.props.selectedResponseSets.concat([rs]));
  }
};

class DropTarget extends Component {

  render() {
    let isValidDrop = this.props.isValidDrop;
    let selectedResponseSets = this.props.selectedResponseSets || [];

    let removeResponseSet = (id) => {
      this.props.handleResponseSetsChange(this.props.selectedResponseSets.filter((rs) => rs.id != id));
    };

    return (
      <div style={{minHeight: '440px', backgroundColor:isValidDrop?'green':'grey'}}>
        {selectedResponseSets.map((rs) => {
          return (
          <div key={rs.id}>
          <button className="pull-right" onClick={(event) => {
            event.preventDefault();
            removeResponseSet(rs.id);
          }
          }><i className='fa fa-close' aria-hidden="true"/><span className="sr-only">Remove Selected Response Set</span></button>
          <DraggableResponseSet type='response_set' result={{Source: rs}} currentUser={{id: -1}} />
          </div>);
        })}
        <select readOnly={true} value={selectedResponseSets.map((rs) => rs.id )} name="linked_response_sets[]" id="linked_response_sets" aria-label="Selected Response Sets" size="5" multiple="multiple" className="form-control"  style={{display: 'none'}}>
          {selectedResponseSets.map((rs) => {
            return <option key={rs.id} value={rs.id}>a</option>;
          })}
        </select>
      </div>
    );
  }
}

DropTarget.propTypes = {
  handleResponseSetsChange: PropTypes.func.isRequired,
  selectedResponseSets: PropTypes.array,
  isValidDrop: PropTypes.bool
};

let DroppableTarget = Droppable(DropTarget, onDrop);

const DRAG_WIDGET_CONTEXT = 'DRAG_WIDGET_CONTEXT';

class ResponseSetDragWidget extends Component {
  constructor(props){
    super(props);
    this.search = this.search.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.addRsButtonHandler = this.addRsButtonHandler.bind(this);
    this.state = {
      searchTerms: '',
      page: 1
    };
  }

  componentWillMount() {
    this.search('');
  }

  search(searchTerms) {
    if(searchTerms === ''){
      searchTerms = null;
    }
    this.setState({searchTerms: searchTerms});
    this.props.fetchSearchResults(DRAG_WIDGET_CONTEXT, searchTerms, 'response_set');
  }

  loadMore() {
    let searchTerms = this.state.searchTerms;
    let tempState = this.state.page + 1;
    if(this.state.searchTerms === '') {
      searchTerms = null;
    }
    this.props.fetchMoreSearchResults(DRAG_WIDGET_CONTEXT, searchTerms, 'response_set', tempState);
    this.setState({page: tempState});
  }

  addRsButtonHandler(rs) {
    if(!this.props.selectedResponseSets.find((r) => {
      return r.id === rs.Source.id;
    })) {
      this.props.handleResponseSetsChange(this.props.selectedResponseSets.concat([rs.Source]));
    }
  }

  render(){
    const searchResults = this.props.searchResults;
    return (
      <div className="row response-set-row">
        <div className="col-md-6 question-form-group">
          <NestedSearchBar onSearchTermChange={this.search} modelName="Response Set" /><br/>
          <div className="fixed-height-list" name="linked_response_sets">
            {searchResults.hits && searchResults.hits.hits.map((rs, i) => {
              return <DraggableResponseSet key={i} type={rs.Type} result={rs}
                      currentUser={this.props.currentUser}
                      handleSelectSearchResult={() => this.addRsButtonHandler(rs)} />;
            })}
            {searchResults.hits && searchResults.hits.total > 0 && this.state.page <= Math.floor((searchResults.hits.total-1) / 10) &&
              <button id="load-more-btn" className="button button-action center-block" onClick={() => this.loadMore()}>LOAD MORE</button>
            }
          </div>
        </div>
        <div className="col-md-6 drop-target selected_response_sets" name="selected_response_sets">
          <DroppableTarget handleResponseSetsChange={this.props.handleResponseSetsChange} selectedResponseSets={this.props.selectedResponseSets} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    searchResults: state.searchResults[DRAG_WIDGET_CONTEXT] || {},
    currentUser: state.currentUser
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchSearchResults, fetchMoreSearchResults}, dispatch);
}

ResponseSetDragWidget.propTypes = {
  responseSets: responseSetsProps.isRequired,
  selectedResponseSets: PropTypes.array,
  fetchSearchResults: PropTypes.func,
  fetchMoreSearchResults: PropTypes.func,
  currentUser: currentUserProps,
  searchResults: PropTypes.object,
  handleResponseSetsChange: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(ResponseSetDragWidget);
