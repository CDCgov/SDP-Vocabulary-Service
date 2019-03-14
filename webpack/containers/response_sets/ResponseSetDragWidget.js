import React, { Component } from 'react';
import SearchManagerComponent from '../../components/SearchManagerComponent';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import debounce from 'lodash/debounce';
import { Draggable, Droppable } from '../../components/Draggable';
import SearchResult from '../../components/SearchResult';
import DashboardSearch from '../../components/DashboardSearch';
import currentUserProps from '../../prop-types/current_user_props';
import { surveillanceSystemsProps }from '../../prop-types/surveillance_system_props';
import { surveillanceProgramsProps } from '../../prop-types/surveillance_program_props';
import { fetchSearchResults, fetchMoreSearchResults, fetchSuggestions } from '../../actions/search_results_actions';

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
          <DraggableResponseSet type='response_set_dropped' result={{Source: rs}} currentUser={{id: -1}} />
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

class ResponseSetDragWidget extends SearchManagerComponent {
  constructor(props){
    super(props);
    this.search = this.search.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.addRsButtonHandler = this.addRsButtonHandler.bind(this);
    this.changeFiltersCallback = this.changeFiltersCallback.bind(this);
    this.state = {
      searchTerms: '',
      programFilter: [],
      systemFilter: [],
      page: 1,
      type: 'response_set'
    };
  }

  componentWillMount() {
    this.search(this.currentSearchParameters());
  }

  search(searchParameters) {
    searchParameters.type = 'response_set';
    super.search(searchParameters, DRAG_WIDGET_CONTEXT);
  }

  loadMore() {
    super.loadMore(DRAG_WIDGET_CONTEXT);
  }

  addRsButtonHandler(rs) {
    const selectedResponseSets = this.props.selectedResponseSets || [];
    if(!selectedResponseSets.find((r) => {
      return r.id === rs.Source.id;
    })) {
      this.props.handleResponseSetsChange(selectedResponseSets.concat([rs.Source]));
    }
  }

  render(){
    const searchResults = this.props.searchResults;
    const selectedResponseSets = this.props.selectedResponseSets || [];
    const fetchSuggestions = debounce(this.props.fetchSuggestions, 300);
    return (
      <div className="row response-set-row">
        <div className="col-md-6 question-form-group">
          <DashboardSearch search={this.search} surveillanceSystems={this.props.surveillanceSystems}
                           surveillancePrograms={this.props.surveillancePrograms}
                           changeFiltersCallback={this.changeFiltersCallback}
                           searchSource={this.props.searchResults.Source}
                           suggestions={this.props.suggestions}
                           fetchSuggestions={fetchSuggestions}
                           placeholder="Search Response Sets..." />
          <br/>
          <div className="fixed-height-list" name="linked_response_sets">
            {searchResults.hits && searchResults.hits.hits.map((rs, i) => {
              var isSelected = selectedResponseSets.findIndex((r) => r.id == rs.Id) > -1;
              return <DraggableResponseSet key={i} type={rs.Type} result={rs}
                      currentUser={this.props.currentUser}
                      isSelected ={isSelected}
                      handleSelectSearchResult={() => this.addRsButtonHandler(rs)} />;
            })}
            {searchResults.hits && searchResults.hits.total > 0 && this.state.page <= Math.floor((searchResults.hits.total-1) / 10) &&
              <button id="load-more-btn" className="button button-action center-block" onClick={(event) => this.loadMore(event)}>LOAD MORE</button>
            }
          </div>
        </div>
        <div className="col-md-6 drop-target selected_response_sets" name="selected_response_sets">
          <DroppableTarget handleResponseSetsChange={this.props.handleResponseSetsChange} selectedResponseSets={selectedResponseSets} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    searchResults: state.searchResults[DRAG_WIDGET_CONTEXT] || {},
    currentUser: state.currentUser,
    surveillanceSystems: state.surveillanceSystems,
    surveillancePrograms: state.surveillancePrograms,
    suggestions: state.suggestions
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchSearchResults, fetchMoreSearchResults, fetchSuggestions}, dispatch);
}

ResponseSetDragWidget.propTypes = {
  selectedResponseSets: PropTypes.array,
  fetchSearchResults: PropTypes.func,
  fetchMoreSearchResults: PropTypes.func,
  fetchSuggestions: PropTypes.func,
  surveillanceSystems: surveillanceSystemsProps,
  surveillancePrograms: surveillanceProgramsProps,
  currentUser: currentUserProps,
  searchResults: PropTypes.object,
  handleResponseSetsChange: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(ResponseSetDragWidget);
