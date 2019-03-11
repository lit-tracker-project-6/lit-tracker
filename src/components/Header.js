import React, { Component } from 'react';
import './Header.css';

class Header extends Component {
  constructor() {
    super();
    this.state = {

    }
  }
  render() {
    return (
      <div className='header'>
        <h1>Lit Tracker</h1>
      </div>
    )
  }
}

export default Header;