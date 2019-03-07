import React, { Component } from 'react';
import firebase from 'firebase';
import './Lists.css';

class Lists extends Component{
  constructor(props) {
    super(props);
    this.state = {
      newListName: '',
      lists:[]
    }
  }
  
  //listens to keypresses inside the form and records that in this.state.NewListName
  handleChange = (event) => {
    this.setState({
      newListName: event.target.value
    })
  }


  addList = (bookList) => {
    const newList = {
      listTitle: `${bookList}`,
      progress: '0%',
      books: false
    }
    firebase.database().ref(`lists`).push(newList);
  }

  //Deletes the list when the button it's attached to is clicked
  deleteList = (bookId) => {
    const dbRef = firebase.database().ref('lists/' + bookId);
    dbRef.remove();
  }

  // The function that will access our lists in the database to do a thing
  pullLists = () => {
    const dbRef = firebase.database().ref("lists");
    dbRef.on('value', (data) => {
      console.log(data.val());
    })
  }

  // Grabs objects from within firebase convert them into an array and put that array in this.state.lists
  componentDidMount() {
    const dbRef = firebase.database().ref("lists");
    dbRef.on('value', (response) => {
      const newState = [];
      const data = response.val();
      for (let list in data) {
        newState.push({
          key: list,
          listTitle: data[list].listTitle
        });
        console.log(newState);
      }
      this.setState({
        lists: newState
      })
    })
  }

  render() {
    return(
      <div className='lists'>
        <div className="addList">
          <h2>Create New List</h2>
          <form action="submit" onSubmit={() => {this.addList(this.state.newListName)}} >
            <input type="text" onChange={this.handleChange} required/>
            <input type="submit"/>
          </form>
        </div>
        <div className="showLists">
            {
              this.state.lists.map(data => {
                return(
                  <div className="list" key={data.key}>
                    <p onClick={() => {this.props.handleActiveList(data)}}>{data.listTitle}</p>
                    <button onClick={() => this.deleteList(data.key)}>Remove this 📘</button>
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