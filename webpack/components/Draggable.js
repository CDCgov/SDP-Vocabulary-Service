import React, { Component } from 'react';

let Draggable = (ComposedComponent, setData=function(){}, dragStop=function(){}) => class extends Component  {

    constructor(props) {
      super(props);
      this.state = {dragging: false};
    }

    render() {
      let _dragStart = (evt) => {
        let dropData = setData.bind(this)();
        for(let key of Object.keys(dropData)) {
          evt.dataTransfer.setData(key, dropData[key]);
        }
        this.setState({dragging: true});

      };
      let _dragStop = () => {
        dragStop.bind(this)();
        this.setState({dragging: false});
      };
      let { dragging = false } = this.state;
      let dragProps = {draggable: true, onDragStart:_dragStart, onDragEnd:_dragStop};
      return (
        <div  {...dragProps}>
          <ComposedComponent isDragging={dragging} {...this.props}/>
        </div>
      );
    }
  };

  let Droppable = (ComposedComponent, onDrop=function(){}, onDragOver=function(){}) => class extends Component  {
    constructor(props) {
      super(props);
      this.state = {validDrop: false};
    }

    render() {
      let _onDragOver = (evt) => {
        evt.preventDefault();
        this.setState({validDrop: true});
        onDragOver.bind(this)(evt, this.refs.instance);
      };

      let _onDragLeave = () => {
        this.setState({validDrop: false});
      };

      let _onDrop = (evt) => {
        this.setState({validDrop: false});
        onDrop.bind(this)(evt, this.refs.instance);
      };

      let dropProps = {onDragOver: _onDragOver, onDrop: _onDrop, onDragLeave: _onDragLeave};
      return (
        <div  {...dropProps}>
          <ComposedComponent ref='instance' isValidDrop={this.state.validDrop} {...this.props}/>
        </div>
      );
    }
  };

export {Draggable, Droppable};
