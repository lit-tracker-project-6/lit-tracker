import React, { Component } from 'react';
import './Active.css';



class Active extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  // when called, renders books in the active list window
  renderBooks = () => {
    // variable to store books object from passedState
    const books = this.props.passedState.activeListObj.books
    // prepare a variable array to store the books
    const booksToRender = []

    // Object.keys gets the key values for the objects inside books and returns an array
      // .forEach then applies a function to each of those keys
    Object.keys(books).forEach(key => {
      // combine keys with books to push the individual books into the array
      booksToRender.push(books[key])
    })

    return (
      // use map to render the books in the booksToRender array
      booksToRender.map(each => {
        return (
          <div className="book">
            <p>Title:{each.bookTitle}</p>
            <p>Author:{each.author}</p>
            <p>Rating:{each.rating}</p>
          </div>
        )
      })
    )
  } // FUNCTION ENDS

  // Calculates the # of books read and renders percentage complete
  calculateProgress = () => {
    // create a variable to manipulate th activeList's books
    const books = this.props.passedState.activeList.books

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
        { this.props.passedState.activeList !== null ?
          <div className="activeListDisplay">
            <h2>{this.props.passedState.activeList}</h2>
            <button onClick={() => this.props.deleteList(this.props.passedState.activeListId)}>Remove this 📘</button>
            <p onClick={this.props.handleSearchModalOn}> Add Books to this list</p>

            <div className="books">
              {this.renderBooks()}
            </div>
          </div>
          : null 
        }
      </div>
    );
  }
}

export default Active;