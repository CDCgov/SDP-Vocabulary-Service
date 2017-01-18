import React, { Component } from 'react';


class App extends Component {
  render() {
    return (
      <div>
        <div>Header Stuff</div>
        {this.props.children}
        <footer className="footer">
          <div className="container">
            2016 Centers for Disease Control and Prevention. All rights reserved.
            <div className="nav-links">
              <span href="#">Privacy</span>
              <span href="#">Security</span>
              <span href="#">Terms of Service</span>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
