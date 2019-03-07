import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import Qs from 'qs';
import firebase from './firebase.js';
import Header from './components/Header.js';
import Lists from './components/Lists.js';
import Active from './components/Active.js';
import Footer from './components/Footer.js';

class App extends Component {
  
  
  constructor(props) {
    super(props);
    this.state = {
      // activeList: null,
      lists: null
      // Lists from Firebase Goes here
    }
  }
  
  addList = (bookList) => {
    const dbRef = firebase.database().ref('lists');
    const newList = {
        listTitle: `${bookList}`, 
        progress: '0%', 
        books: { Twilight: {title: 'Twilight', author: 'Stephenie Meyer'} }
      }
      // firebase.database().ref(`lists/${name}`).set(testList);
      dbRef.push(newList);
  }
  // this.addList('lit list');
    
  pullLists = (listId) => {
    const dbRef = firebase.database().ref(`lists/${listId}`);
    dbRef.on('value', (data) => {
      const selectedList = data.val()
      console.log(selectedList);
      this.setState({
        lists: selectedList
      })
    })
  }
  // this.pullLists('-L_K7BeJGlAXJQnjDZTr');
  
  addBook = (listId, bookObject) => {
    const dbRef = firebase.database().ref(`lists/${listId}/books`);
    console.log(listId)
    dbRef.push(bookObject)
    console.log("book added", bookObject)
  }
  // this.addBook('-L_KQzxwU_v97JMIGhRg', {title: 'twilight2', author: 'Stephenie Meyer'} )


  deleteBook = (listId, bookId) => {
    //bookId is a unique identifier used to find the book in the database
    //when the bookObjects are being rendered in the activeList - pass the bookID to the button that listens for the event, the event listener will pass this method as a callback function
    const dbRef = firebase.database().ref(`lists/${listId}/books/${bookId}`);
    dbRef.remove();
  }
  // this.deleteBook('-L_KQzxwU_v97JMIGhRg', '-L_KTI_KL2G8dxuOSmRV') - this book is already deleted

  componentDidMount() {

    axios({
      url: 'https://proxy.hackeryou.com',
      dataResponse: 'json',
      paramsSerializer: function (params) {
        return Qs.stringify(params, { arrayFormat: 'brackets' })
      },
      params: {
        reqUrl: `https://www.goodreads.com/search/`,
        params: {
          q: 'Twilight',
          key: 'WpabDZgBfnIW2CiYFtXKw',
          search: 'all'
        },
        proxyHeaders: {
          'header_params': 'value',
        },
        xmlToJSON: true
      }
    }).then(response => {
      const res = response.data.GoodreadsResponse.search.results.work
      console.log(res);
    })
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Active />
        <Lists />
        <Footer />
      </div>
    );
  }
}

export default App;