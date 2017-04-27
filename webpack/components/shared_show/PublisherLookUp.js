import React, { Component, PropTypes } from 'react';
import { publishersProps } from '../../prop-types/publisher_props';
import _ from 'lodash';
import strictUriEncode from 'strict-uri-encode';

class PublisherLookUp extends Component {
  render() {
    return (<div className="btn-group">
              <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span className="fa fa-envelope-o"></span> Send to publisher <span className="fa fa-users"></span><span className="caret"></span>
              </button>
              <ul className="dropdown-menu">
                <li key="header" className="dropdown-header">Publishers</li>
                {_.values(this.props.publishers).map((p, i) => {
                  return <li key={i}><a href={this.link(p)}>{p.name} &lt;{p.email}&gt;</a></li>;
                })}
              </ul>
            </div>);
  }

  link(publisher) {
    const subject = `Publish New ${this.props.itemType} - CDC Vocabulary Service`;
    const body = `Hello ${publisher.firstName},

Please review and publish my recently authored ${this.props.itemType}: ${window.location.href}

Thanks!`;
    return `mailto:${publisher.email}?subject=${strictUriEncode(subject)}&body=${strictUriEncode(body)}`;
  }
}

PublisherLookUp.propTypes = {
  itemType: PropTypes.string.isRequired,
  publishers: publishersProps
};

export default PublisherLookUp;
