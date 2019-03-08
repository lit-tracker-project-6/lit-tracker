import React, { Component } from "react";
import "./App.css";
import firebase from "./firebase.js";
import Header from "./components/Header.js";
import Lists from "./components/Lists.js";
import Active from "./components/Active.js";
import Footer from "./components/Footer.js";
import Search from "./components/Search.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeList: null,
      activeListId: null,
      searchModal: false,
      lists: []
    };
  }

// on call, accepts book data from Search.js to adds a book to the active list
  addBook = (data) => {
  // using the passed data, defines the book object
    const bookToAdd = {
      bookTitle: data.best_book.title,
      author: data.best_book.author.name,
      rating: data.average_rating,
      isCompleted: false
    }
  // create a reference to the active list in Firebase
    const targetList = this.state.activeListId
    const dbRef = firebase.database().ref(`lists/${targetList}/books`);
  // pushs the book object to the active list's Firebase node
    dbRef.push(bookToAdd);
  };

  deleteBook = (listId, bookId) => {
    //bookId is a unique identifier used to find the book in the database
    //when the bookObjects are being rendered in the activeList - pass the bookID to the button that listens for the event, the event listener will pass this method as a callback function
    const dbRef = firebase.database().ref(`lists/${listId}/books/${bookId}`);
    dbRef.remove();
  };
  // this.deleteBook('-L_KQzxwU_v97JMIGhRg', '-L_KTI_KL2G8dxuOSmRV') - this book is already deleted

  //This function will be called when a list in the Lists panel is clicked on, to set the state of the Active List to be that clicked list
  handleActiveList = list => {
    this.setState({
      activeList: list.listTitle,
      activeListId: list.key
    });
    console.log(list);
  };

  handleSearchModalOn = () => {
    this.setState({
      searchModal: true
    });
  };

  handleSearchModalOff = () => {
    this.setState({
      searchModal: false
    });
  };

  // Grabs objects from within firebase convert them into an array and put that array in this.state.lists
  componentDidMount() {
    const dbRef = firebase.database().ref("lists");
    dbRef.on("value", response => {
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
      });
    });
  }

  addList = bookList => {
    const newList = {
      listTitle: `${bookList}`,
      progress: "0%",
      books: false
    };
    firebase
      .database()
      .ref(`lists`)
      .push(newList);
  };

  //Deletes the list when the button it's attached to is clicked
  deleteList = bookId => {
    if (window.confirm("Are you sure you want to delete?")) {
      const dbRef = firebase.database().ref("lists/" + bookId);
      dbRef.remove();
      this.setState({
        activeList: null,
        activeListId: null
      });
    }
  };

  render() {
    return (
      <div className="App">
        <Header />
        <div className="mainContent">
          <Active
            passedState={this.state}
            handleSearchModalOn={this.handleSearchModalOn}
            deleteList={this.deleteList}
          />
          <Lists
            passedState={this.state}
            handleActiveList={this.handleActiveList}
            addList={this.addList}
            deleteList={this.deleteList}
          />
        </div>
        {this.state.searchModal === true ? (
          // sent activeListId={this.state.activeListId} props down to <Search>
          <Search activeListId={this.state.activeListId} addBook={this.addBook} handleSearchModalOff={this.handleSearchModalOff} />
        ) : null}
        <Footer />
      </div>
    );
  }
}

export default App;
