import React, { Component } from 'react';
import './Active.css';
import Search from './Search.js';

class Active extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <div className='active'>
        <h2>{this.props.passedState.activeList}</h2>
        <p>Delete this list</p>
        <p onClick={this.props.handleSearchModalOn}> Add Books to this list</p>
      </div>
    );
  }
}

export default Active;