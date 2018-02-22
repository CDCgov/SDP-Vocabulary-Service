import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import shallowCompare from 'react-addons-shallow-compare';

import SearchResult from '../../components/SearchResult';
import { updatePDV } from "../../actions/section_actions";

class SectionNestedItemList extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }


  render() {
    if(!this.props.items){
      return (
        <div>Loading...</div>
      );
    }

    return (
      <div className="question-group">
        {this.props.items.map((sni, i) => {
          let sniType = sni.content ? 'question' : 'section';
          return <SearchResult key={i} resultStyle={this.props.resultStyle} type={sniType} result={{Source: sni}} programVar={sni.programVar} currentUser={this.props.currentUser} updatePDV={this.props.updatePDV}/>;
        })}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ updatePDV }, dispatch);
}

SectionNestedItemList.propTypes = {
  items: PropTypes.array,
  updatePDV: PropTypes.func,
  currentUser: PropTypes.object,
  resultStyle: PropTypes.string
};

export default connect(null, mapDispatchToProps)(SectionNestedItemList);
