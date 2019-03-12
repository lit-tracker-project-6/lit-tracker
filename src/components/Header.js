import React, { Component } from 'react';
import './Header.css';
import lighthouseLogo from "../assets/lighthouse2.png";

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
        <img src={lighthouseLogo} alt="A logo of a stack of books with a lighthouse"/>
        <button title="view reading lists" onClick={this.props.handleListModal}><i class="fas fa-list"></i></button>
      </div>
    )
  }
}

export default Header;