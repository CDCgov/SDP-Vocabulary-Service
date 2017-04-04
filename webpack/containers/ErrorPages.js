import React, { Component } from 'react';
class ErrorPage extends Component {

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

export default ErrorPage;

export const GenericError = () => {
  return <p> An error has occurred</p>
}

export class Forbidden403 extends Component {

  render() {
    return (
          <p>You do not have access to this resource.</p>
    );
  }
}
