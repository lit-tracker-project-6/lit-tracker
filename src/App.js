import React, { Component } from "react";
import "./App.css";
import firebase from "./firebase.js";
import Header from "./components/Header.js";
import Landing from "./components/Landing.js";
import Lists from "./components/Lists.js";
import Active from "./components/Active.js";
import Footer from "./components/Footer.js";
import Search from "./components/Search.js";
import Swal from "sweetalert2";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeList: null,
      activeListId: null,
      searchModal: false,
      lists: [],
      activeListObj: {}
    };
  }

  // on call, accepts book data from Search.js to adds a book to the active list
  addBook = data => {
    // using the passed data, defines the book object
    const bookToAdd = {
      bookTitle: data.best_book.title,
      author: data.best_book.author.name,
      rating: data.average_rating,
      image: data.best_book.image_url,
      isCompleted: false
    };
    // create a reference to the active list in Firebase
    const targetList = this.state.activeListId;
    const dbRef = firebase.database().ref(`lists/${targetList}/books`);
    // pushs the book object to the active list's Firebase node
    dbRef.push(bookToAdd).then(() => {
      this.handleRefresh();
    });
  };

  // when called in Active.js, accepts the element data
  deleteBook = data => {
    // *TEMPORARY* confirmation of book deletion
    if (window.confirm("Are you sure you want to remove this book?")) {
      // variables to store the target list id and target book id
      const targetList = this.state.activeListId;
      const targetBook = data.target.value;
      // console.log('key of book to delete', targetBook)

      // create reference to the target book in the target list
      const dbRef = firebase
        .database()
        .ref(`lists/${targetList}/books/${targetBook}`);
      // console.log("path to target", dbRef.path.pieces_);

      // remove target book from Firebase
      dbRef.remove();

      this.handleRefresh();
    }
  };

  markCompleted = data => {
    // variables to store the target list id and target book id
    const targetList = this.state.activeListId;
    const targetBook = data.target.value;

    // create reference to the target book in the target list
    const dbRef = firebase
      .database()
      .ref(`lists/${targetList}/books/${targetBook}`);
    let updateCompleted;

    // checking/evaluating value of completion in firebase
    let checkCompletion;
    dbRef.on("value", function(snapshot) {
      checkCompletion = snapshot.val();
    });
    // conditional statement to "toggle" value of isCompleted state
    if (checkCompletion.isCompleted === false) {
      updateCompleted = {
        isCompleted: true
      };
      dbRef.update(updateCompleted);
    } else {
      updateCompleted = {
        isCompleted: false
      };
    }
    // update firebase with completion status of current book
    dbRef.update(updateCompleted);

    this.handleRefresh();
  };

  //This function will be called when a list in the Lists panel is clicked on, to set the state of the Active List to be that clicked list
  handleActiveList = list => {
    this.handleSearchModalOff();
    // make a reference to the list node location
    const dbRef = firebase.database().ref(`lists/${list.key}`);
    let listObj = {};
    // take a snapshot of the data
    dbRef.on("value", function(snapshot) {
      listObj = snapshot.val();
    });
    // console.log('list?',listObj)
    this.setState({
      activeList: list.listTitle,
      activeListId: list.key,
      activeListObj: listObj
    });
  };

  handleRefresh = () => {
    const database = firebase.database();
    database
      .ref(`lists/${this.state.activeListId}/books`)
      .once("value")
      .then(snapshot => {
        const val = snapshot.val();
        this.setState({
          activeListObj: {
            books: val
          }
        });
      });
  };

  closeActiveList = () => {
    this.setState({
      activeList: null,
      activeListId: null
    });
  };

  closeAndRefresh = () => {
    this.handleRefresh();
    this.handleSearchModalOff();
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
        // console.log(newState);
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

  //Deletes the list when the button it's attached to is clicked after confirming sweetalert popup
  deleteList = bookId => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.value) {
        const dbRef = firebase.database().ref("lists/" + bookId);
        dbRef.remove();
        this.setState({
          activeList: null,
          activeListId: null
        });
      }
    });
  };

  render() {
    return (
      <div className="App">
        <Header />
        <div className="mainContent clearfix">
          <Lists
            passedState={this.state}
            handleActiveList={this.handleActiveList}
            addList={this.addList}
            deleteList={this.deleteList}
          />
          {this.state.activeList === null &&
            this.state.searchModal !== true && <Landing />}
          {this.state.activeList !== null &&
            this.state.searchModal !== true && (
              <Active
                passedState={this.state}
                handleSearchModalOn={this.handleSearchModalOn}
                deleteList={this.deleteList}
                deleteBook={this.deleteBook}
                handleRefresh={this.handleRefresh}
                markCompleted={this.markCompleted}
                closeActiveList={this.closeActiveList}
              />
            )}

          {this.state.searchModal === true && (
            <Search
              passedState={this.state}
              addBook={this.addBook}
              closeAndRefresh={this.closeAndRefresh}
            />
          )}

          {/* {this.state.activeList !== null ? (
            <Active
              passedState={this.state}
              handleSearchModalOn={this.handleSearchModalOn}
              deleteList={this.deleteList}
              deleteBook={this.deleteBook}
              handleRefresh={this.handleRefresh}
              markCompleted={this.markCompleted}
              closeActiveList={this.closeActiveList}
            />
          ) : (
            <Landing />
          )} */}
        </div>
        {/* {this.state.searchModal === true ? (
          <Search 
            passedState={this.state}
            addBook={this.addBook}
            closeAndRefresh={this.closeAndRefresh}
          />
        ) : null} */}
        <Footer />
      </div>
    );
  }
}

export default App;
