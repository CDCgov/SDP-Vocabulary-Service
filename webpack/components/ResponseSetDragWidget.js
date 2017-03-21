import React, { Component, PropTypes } from 'react';
import { Draggable, Droppable } from './Draggable';
import ResponseSetWidget from './ResponseSetWidget';
import { responseSetsProps } from '../prop-types/response_set_props';
import _ from 'lodash';

let setData = function(){
  return {"json/responseSet": JSON.stringify(this.props.responseSet)};
};

let DraggableResponseSet = Draggable(ResponseSetWidget, setData);

let onDrop = (evt, self) => {
  let rs = JSON.parse(evt.dataTransfer.getData("json/responseSet"));
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
      <div style={{minHeight: '40px', backgroundColor:isValidDrop?'green':'grey'}}>
        {selectedResponseSets.map((rs, i) => {
          return (
          <div key={i}>
          <i className='pull-right fa fa-close' onClick={() => removeResponseSet(rs.id)}/>
          <DraggableResponseSet responseSet={rs}/>
          </div>);
        })}
        <select readOnly={true} value={selectedResponseSets.map((rs) => rs.id )} name="linked_response_sets[]" id="linked_response_sets" size="5" multiple="multiple" className="form-control"  style={{display: 'none'}}>
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

class ResponseSetDragWidget extends Component{
  render(){
    if(!this.props.responseSets){
      return (<div>Loading....</div>);
    }
    return (
      <div className="row response-set-row">
          <div className="col-md-6 question-form-group">
              <div className="fixed-height-list" name="linked_response_sets">
                {this.props.responseSets && _.values(this.props.responseSets).map((rs, i) => {
                  return <DraggableResponseSet key={i} responseSet={rs}/>;
                })}
              </div>
          </div>
          <div className="col-md-6 drop-target selected_response_sets" name="selected_response_sets">
            <DroppableTarget handleResponseSetsChange={this.props.handleResponseSetsChange} selectedResponseSets={this.props.selectedResponseSets} />
          </div>
      </div>
    );
  }
}

ResponseSetDragWidget.propTypes = {
  responseSets: responseSetsProps.isRequired,
  selectedResponseSets: PropTypes.array,
  handleResponseSetsChange: PropTypes.func.isRequired
};

export default ResponseSetDragWidget;
