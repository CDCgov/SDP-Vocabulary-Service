import React, { Component, PropTypes } from 'react';
class ErrorPage extends Component {
  // This is the container for error pages
  // It has a default value in case it renders and doesn't have any children
  // Don't want to just present a blank screen without any indication of what went wrong
  render() {
    return (
      <div className="container">
        <div className="row basic-bg">
          <div className="col-md-12">
          <p>
            {this.props.children || 'An error has occured'}
          </p>
          </div>
        </div>
      </div>
    );
  }
}

ErrorPage.propTypes = {
  children:PropTypes.array
};

export default ErrorPage;

// While it would be possible to not use this and just use the default case in the
// ErrorPage it seemed better to have that as a fall back and have a defined page
export const GenericError = () => {
  return <p> An error has occurred</p>;
};

// This is an example of how you can handle specific pages, you'll need to add a route in landing.js
// Check under the Errors route.
export const Forbidden403 = () => {
  return <p>You do not have access to this resource.</p>;
};
