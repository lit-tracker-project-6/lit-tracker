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
      // lists: Lists from Firebase Goes here
    }
  }

  addList = (bookList) => {
    const dbRef = firebase.database().ref();
    const newList = {
        listTitle: `${bookList}`, 
        progress: '0%', 
        books: {}
      }
    
    // firebase.database().ref(`lists/${name}`).set(testList);
    firebase.database().ref(`lists`).push(newList);
  
  }

  pullLists = () => {
    const dbRef = firebase.database().ref("lists");
    dbRef.on('value', (data) => {
      console.log(data.val());
    })
  }

  componentDidMount() {
    this.pullLists();

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