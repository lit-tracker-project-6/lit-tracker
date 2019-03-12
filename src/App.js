import React, { Component } from "react";
import "./App.css";
import firebase from "./firebase.js";
import Header from "./components/Header.js";
import Landing from "./components/Landing.js";
import Lists from "./components/Lists.js";
import ListsMobile from "./components/ListsMobile.js";
import Active from "./components/Active.js";
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
      activeListObj: {},
      listModal: false
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
    Swal.fire({
      // position: "top-end",
      type: "success",
      title: "Book added",
      showConfirmButton: false,
      timer: 1200,
      width: 300
    });
  };

  // when called in Active.js, accepts the element data
  deleteBook = data => {
    // variables to store the target list id and target book id
    const targetList = this.state.activeListId;
    const targetBook = data.target.value;
    //prompt for sweetalert popup
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.value) {
        // create reference to the target book in the target list
        const dbRef = firebase
          .database()
          .ref(`lists/${targetList}/books/${targetBook}`);

        // remove target book from Firebase
        dbRef.remove();

        this.handleRefresh();
      }
    });
  };

  markCompleted = (event) => {
    // variables to store the target list id and target book id
    const targetList = this.state.activeListId;
    const targetBook = event.currentTarget.value;
    //

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
    //the key is tied to the button when it is rendered
    let listObj = {};
    // take a snapshot of the data
    dbRef.on("value", function(snapshot) {
      listObj = snapshot.val();
    });
    this.setState({
      activeList: list.listTitle,
      activeListId: list.key,
      activeListObj: listObj
    });
  };

  handleActiveListMobile = list => {
    this.handleSearchModalOff();
    this.handleListModal();
    // make a reference to the list node location
    const dbRef = firebase.database().ref(`lists/${list.key}`);
    //the key is tied to the button when it is rendered
    let listObj = {};
    // take a snapshot of the data
    dbRef.on("value", function (snapshot) {
      listObj = snapshot.val();
    });
    this.setState({
      activeList: list.listTitle,
      activeListId: list.key,
      activeListObj: listObj
    });
  };

  handleListModal = () => {
    const listModal = !this.state.listModal;
    this.setState({
      activeList: null,
      activeListId: null,
      searchModal: false,
      activeListObj: {},
      listModal
    })
  }

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
    })
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

  getListData = () => {
    const dbRef = firebase.database().ref("lists");
    
    dbRef.on("value", response => {
      const newState = [];
      const data = response.val();
      
      for (let list in data) {
        newState.push({
          key: list,
          listTitle: data[list].listTitle
        })
      };
      
      this.setState({
        lists: newState
      });
    });
  }

  setNewListToActive = () => {
    this.handleSearchModalOff()
    const dbRef = firebase.database().ref("lists");
    let newChild;
    //below code sourecd from: https://stackoverflow.com/questions/46447951/child-added-get-last-item-added-javascript
    //reason the event listener is writen last is because the event listener expects a callback so you cannot chain. you must chain the methods before hand - t he query is fired when a new child is added to the database
    dbRef.orderByKey().limitToLast(1).on('child_added', function (snapshot) {
      //without the orderByKey and limitToLast this function will return ALL the lists
      //orderByKey and limitToLast are query methods - results are filtered according to the functions defined within these methods. See below
        //orderByKey method orders by the last added item (works well with push, as we are pushing new lists) 
        //limitToLast method limit results from the end of the ordered list results. The value passed is 1, the method is returning one item from the bottom of the list (the latest added item) 
      newChild = snapshot.val();
    });
    this.setState({
      activeListObj: newChild,
      activeList: newChild.listTitle
    })
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
      .push(newList)
      this.setNewListToActive();
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
        <Header 
          passedState={this.state}
          handleListModal={this.handleListModal}
        />
        <div className="banner"></div>
        <div className="mainContent clearfix" aria-live='polite'>
          {this.state.activeList === null && this.state.listModal === false &&
            this.state.searchModal !== true && <Landing />}
          <Lists
            passedState={this.state}
            handleActiveList={this.handleActiveList}
            addList={this.addList}
            deleteList={this.deleteList}
          />
          {this.state.listModal === true && (
            <ListsMobile
              passedState={this.state}
              handleActiveListMobile={this.handleActiveListMobile}
              addList={this.addList}
              deleteList={this.deleteList}
            />
          )}
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
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.getListData();
  } 
}

export default App;
