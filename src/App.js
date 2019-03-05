import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import Qs from 'qs';

class App extends Component {
  constructor() {
    super();
    this.state = {

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
      console.log(response);
    })
  }

  render() {
    return (
      <div className="App">

      </div>
    );
  }
}

export default App;