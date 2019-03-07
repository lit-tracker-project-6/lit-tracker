import React, { Component } from 'react';
import './Active.css';

class Active extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <div className='active'>
        { this.props.passedState.activeList !== null ?
          <div className="activeListDisplay">
            <h2>{this.props.passedState.activeList}</h2>
            <button onClick={() => this.props.deleteList(this.props.passedState.activeListId)}>Remove this 📘</button>
            <p onClick={this.props.handleSearchModalOn}> Add Books to this list</p>
          </div>
          : null 
        }
      </div>
    );
  }
}

export default Active;