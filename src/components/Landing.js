import React, { Component } from "react";
import "./Landing.css";


class Landing extends Component {
  render() {
    return (
      <div className="landing clearfix">
        <span><i className="fab fa-readme"></i></span>
        <div className="landingHeader">
          <h2>Lit Tracker</h2>
          <h3>
            Guiding you toward <span className="landingHeaderSpan">your reading goals</span>
          </h3>
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
    );
  }
}

export default Landing;