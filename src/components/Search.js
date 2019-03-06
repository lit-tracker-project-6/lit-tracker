import React, { Component } from 'react';
import axios from 'axios';
import Qs from 'qs';

class Search extends Component {
  constructor() {
    super();
    this.state = {
      searchResults: []

    }
  }
  //This function will be called on form submit to make the API call!
  getSearchResults = (event) => {
    event.preventDefault();
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
      this.setState({
        searchResults: res
      })
    })
  }

  render() {
    return (
      <div>
        
      </div>
    )
  }
}

export default Search;