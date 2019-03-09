import React, { Component } from "react";
import "./Landing.css";

class Landing extends Component {
  constructor(){
    super();
    this.state = {

    }
  }

  render() {
    return (
      <div className="landing">
        
        <div className="landingHeader">
          <h2>Lit Tracker</h2>
          <h3>Guiding you toward your reading goals</h3>
        </div>
        <div className="landingContent">
          <h3>Get Started:</h3>
          <ol>
            <li>
              <p>Create a new reading list</p>
            </li>
            <li>
              <p>Search and add new books</p>
            </li>
          </ol>
        </div>
      </div>
    )
  }
}

export default Landing;