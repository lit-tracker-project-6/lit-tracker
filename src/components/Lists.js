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


  // The function that will access our lists in the database to do a thing
  pullLists = () => {
    const dbRef = firebase.database().ref("lists");
    dbRef.on('value', (data) => {
      console.log(data.val());
    })
  }

  render() {
    return(
      <div className='lists'>
        <div className="addList">
          <h2>Create New List</h2>
          <form action="submit" onSubmit={() => {this.props.addList(this.state.newListName)}} >
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