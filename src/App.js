import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import Qs from 'qs';
import firebase from './firebase.js';
import Header from './components/Header.js';
import Lists from './components/Lists.js';
import Active from './components/Active.js';
import Footer from './components/Footer.js';


const dbRef = firebase.database().ref();

firebase.database().ref('lists').set({booklist1: [{ name: 'book1', author: 'author1' }, { name: 'book2', author: 'author2' } ]});


class App extends Component {

  
  constructor(props) {
    super(props);
    this.state = {
      // activeList: null,
      // lists: Lists from Firebase Goes here
    }
  }
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