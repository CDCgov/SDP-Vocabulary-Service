import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { publishersProps } from '../../prop-types/publisher_props';
import values from 'lodash/values';
import strictUriEncode from 'strict-uri-encode';

class PublisherLookUp extends Component {
  render() {
    return (<div className="btn-group">
              <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span className="fa fa-envelope-o"></span> Send <span className="caret"></span>
              </button>
              <ul className="dropdown-menu">
                <li key="header" className="dropdown-header">Select publisher name below to generate an email requesting they {this.props.publishOrRetire} your content:</li>
                {values(this.props.publishers).map((p, i) => {
                  return <li key={i}><a href={this.link(p)}>{p.name} &lt;{p.email}&gt;</a></li>;
                })}
              </ul>
            </div>);
  }

  link(publisher) {
    let subject = '';
    let body = '';
    if(this.props.publishOrRetire === 'publish') {
      subject = `Publish New ${this.props.itemType} - CDC Vocabulary Service`;
      body = `Hello ${publisher.firstName},

  Please review and publish my recently authored ${this.props.itemType}: ${window.location.href}

  Thanks!`;
      return `mailto:${publisher.email}?subject=${strictUriEncode(subject)}&body=${strictUriEncode(body)}`;
    } else {
      subject = `Retire ${this.props.itemType} - CDC Vocabulary Service`;
      body = `Hello ${publisher.firstName},

  Please review and retire my ${this.props.itemType}: ${window.location.href}

  Thanks!`;
      return `mailto:${publisher.email}?subject=${strictUriEncode(subject)}&body=${strictUriEncode(body)}`;
    }
  }
}

PublisherLookUp.propTypes = {
  itemType: PropTypes.string.isRequired,
  publishers: publishersProps,
  publishOrRetire: PropTypes.string
};

export default PublisherLookUp;
