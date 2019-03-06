import React, { Component } from 'react';
import List from './List';

class Active extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //searchModal: false

    }
  }
  render() {
    return (
      <div className='active'>
        <List />


      </div>
    );
  }
}

export default Active;