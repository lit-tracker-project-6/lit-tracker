import React, { Component } from 'react';
import './Active.css';


class Active extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortedBooks: [],
      listRenameInput: false,
      activeListObj: null
    };
  }

  // when called, renders books in the active list window
  renderBooks = () => {
    // variable to store books object
    const books = this.props.passedState.activeListObj.books;

    // check if books is empty
    if (books === undefined) {
      // if yes, render empty
      return <p>This list is currently empty.</p>;
      // if no, render books
    } else {
      // prepare a variable array to store the books
      const booksToRender = [];

      // Object.keys gets the key values for the objects inside books and returns an array
      // .forEach then applies a function to each of those keys
      const booksKeys = Object.keys(books);

      booksKeys.forEach(key => {
        // combine keys with books to push the individual books into the array
        booksToRender.push(books[key])
      })
    return (

      //if sort button is clicked and the array is filled, render from this array
      this.state.sortedBooks.length > 0 ?
        this.state.sortedBooks.map((each, i) => {
          return (
            <div className="book">
              <p>Title:{each.bookTitle}</p>
              <p>Author:{each.author}</p>
              <p>Rating:{each.rating}</p>
              {
                this.printBookCover(each)
              }
              <button value={booksKeys[i]} onClick={(e) => { this.props.deleteBook(e) }}>Remove Book</button>
              <button value={booksKeys[i]} onClick={(e) => { this.props.markCompleted(e) }}>Mark as Completed</button>
            </div>
          )
        }) :
      
        // use map to render the books in the booksToRender array
        booksToRender.map((each, i) => {
          return (
            <div key={i} className="book">
              <p>Title:{each.bookTitle}</p>
              <p>Author:{each.author}</p>
              <p>Rating:{each.rating}</p>
              {
                this.printBookCover(each)
              }
              {/* on deletion of book, pass it the attribute of the Firebase key */}
              <button value={booksKeys[i]} onClick={(e)=>{this.props.deleteBook(e)}}>Remove Book</button>
              <button value={booksKeys[i]} onClick={(e) => {this.props.markCompleted(e)}}>Mark as Completed</button>
            </div>
                       
          )
        })
        
      );
    } // else ends
  }; // FUNCTION ENDS

  // Calculates the # of books read and renders percentage complete
  calculateProgress = () => {
    // create a variable to manipulate th activeList's books
    const books = this.props.passedState.activeListObj.books;

    // create variables to store total books and completed books
    let numBooks = 0;
    let completedBooks = 0;

    // use Object.keys to return an array of book key values
    Object.keys(books).forEach(key => {
      // for each key we'll count how many there are
      numBooks++;
      // using the key in the books object, we can target a specific book's completion status
      if (books[key].isCompleted === true) {
        // count up if a book was completed (or read)
        completedBooks++;
      }
    });
    // calculate the percent of books read with the previous mentioned variables
    const percentRead = (completedBooks / numBooks) * 100;
    // return the percent read, rounded to the nearest integer

    return <p>Reading List Progress: {Math.round(percentRead)}%</p>;
  };
  // calculateProgress function ends

  //this function is called onClick
  sortBooksByRating = () => {
    // variable to store books object from passedState
    const books = this.props.passedState.activeListObj.books;
    // prepare a variable array to store the books
    const sortedBookList = [];
    // Object.keys gets the key values for the objects inside books and returns an array
    // .forEach then applies a function to each of those keys
    Object.keys(books).forEach(key => {
      // combine keys with books to push the individual books into the array
      sortedBookList.push(books[key]);
    });

    //sort re-arranges and returns the sorted array - pass it a callback function with a conditional to check the objects at each index
    sortedBookList.sort((a, b) => {
      if (a.rating < b.rating) {
        return 1;
        //return 1 means if A is less than B, sort A to an index higher than B (A comes after B)
      }

      if (a.rating > b.rating) {
        return -1;
        //return -1 means if A is greater than B, sort A to a lower index than B (A comes before B)
      }
    });

    //setState triggering the render lifecycle. renderBooks has a check for sortedResults
    this.setState({
      sortedBooks: sortedBookList
    });
  };

  listRenameInputOn = () => {
    this.setState({
      listRenameInput: true
    });
  };

  listRenameInputOff = () => {
    this.setState({
      listRenameInput: false
    });
  };

  // FOR EDITING LIST NAME
  handleChange = event => {
    // props.setState({
    //   newListName: event.target.value
    // });
  };

  // FOR EDITING LIST NAME
  handleSubmit = event => {
    event.preventDefault();

    this.listRenameInputOff();
  };

  //onclick sort books by date added - we can get fancy and only show one button at a time
  sortBooksByDateAdded = () => {
    //setState triggering the render lifecycle method to run and renderBooks will not map sortedbooks
    this.setState({
      sortedBooks: []
    })
  }

  //this exists in search as well, we could pass it a as a prop but search doesnt need information from active and it takes wayyy too much code to pass this same function to App and then down to Active
  //this function checks if a placeholder image should be rendered (book cover image does not exist) if it exists, print the book cover image otherwise use a placeholder image
  printBookCover = (each) => {

    if (each.image.length < 60) {
      return <img src={each.image.substring(0, 45) + `l` + each.image.substring(46)} alt={`Book cover of ${each.bookTitle}`} />
    } else {
      return <img src='https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png' alt={`Book cover of ${each.bookTitle}`} />
    }
  }

  render() {
    return (
      <div className="active">
        {this.props.passedState.activeList !== null ? (
          <div className="activeListDisplay">
            <h2>{this.props.passedState.activeList}</h2>
            {this.calculateProgress()}
            <button
              onClick={() =>
                this.props.deleteList(this.props.passedState.activeListId)
              }
            >
              Remove this 📘
            </button>
            <button onClick={this.sortBooksByRating}>
              Sort by Average Reviews
            </button>
            <button onClick={this.sortBooksByDateAdded}>
              Sort by Date Added
            </button>

            {/* FOR EDITING LIST NAME */}
            {this.state.listRenameInput === true ? (
              <form action="submit" onSubmit={this.handleSubmit}>
                <input type="text" onChange={this.handleChange} required />
                <input type="submit" />
              </form>
            ) : (
              <button onClick={this.listRenameInputOn}>Edit List Name</button>
            )}

            <p onClick={this.props.handleSearchModalOn}>
              {" "}
              Add Books to this list
            </p>
            <p onClick={this.props.handleRefresh}> REFRESH</p>

            <div className="books">{this.renderBooks()}</div>
          </div>
        ) : null}
      </div>
    );
  }

  componentDidMount() {
    //this will cause the render method to run again
    this.setState({
      activeListObj: this.props.passedState.activeListObj
    })
  }

}

export default Active;
