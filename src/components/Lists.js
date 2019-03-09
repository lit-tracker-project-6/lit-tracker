import React, { Component } from 'react';
import firebase from 'firebase';
import './Lists.css';

class Lists extends Component{
  constructor(props) {
    super(props);
    this.state = {
      newListName: '',
    }
  }
  
  //listens to keypresses inside the form and records that in this.state.NewListName
  handleChange = (event) => {
    this.setState({
      newListName: event.target.value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.submitList();
  }
  
  submitList = () => { 
    this.props.addList(this.state.newListName);
   }


  render() {
    return(
      <div className='lists'>
        <div className="addList">
          <h2>Create New List</h2>

          <form action="submit" onSubmit={this.handleSubmit}>

            <input type="text" onChange={this.handleChange} required/>
            <input type="submit"/>
          </form>
        </div>
        <div className="showLists">
            {
              this.props.passedState.lists.map(data => {
                return(
                  <div className="list" key={data.key}>
                    <p onClick={() => {this.props.handleActiveList(data)}}>{data.listTitle}</p>
                    <button onClick={() => this.props.deleteList(data.key)}>Remove this 📘</button>
                  </div>
                )
              })
            }
        </div>
      </div>
    )
  }
}

export default Lists;