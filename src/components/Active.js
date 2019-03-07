import React, { Component } from 'react';
import './Active.css';
import Search from './Search.js';

class Active extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  
  // Calculates the # of books read and renders percentage complete
  calculateProgress = () => {
    // create a variable to manipulate th activeList's books
    const books = this.state.activeList.books

    // create variables to store total books and completed books
    let numBooks = 0
    let completedBooks = 0
    
    // use Object.keys to return an array of book key values
    Object.keys(books).forEach(key => {
      // for each key we'll count how many there are
      numBooks++
      // using the key in the books object, we can target a specific book's completion status
      if (books[key].isCompleted === true) {
        // count up if a book was completed (or read)
        completedBooks++
      }
    })
    // calculate the percent of books read with the previous mentioned variables
    const percentRead = completedBooks/numBooks * 100
    // return the percent read, rounded to the nearest integer
    return Math.round(percentRead)
  } 
  // calculateProgress function ends


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