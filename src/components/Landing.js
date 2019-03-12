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
      <div className="landing clearfix">
        
        <span><i class="fab fa-readme"></i></span>
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
            <li>
              <p>Track your reading progress</p>
            </li>
          </ol>
        </div>
      </div>
    )
  }
}

export default Landing;