import React, { Component } from 'react';
import axios from 'axios';
import Qs from 'qs';
import './Search.css'

class Search extends Component {
  constructor() {
    super();
    this.state = {
      searchQuery: "",
      searchResults: []
    }
  }
  
  getSearchResults = (event) => {
    event.preventDefault();
    axios({
      url: 'https://proxy.hackeryou.com',
      dataResponse: 'json',
      paramsSerializer: function (params) {
        return Qs.stringify(params, { arrayFormat: 'brackets' })
      },
      params: {
        reqUrl: `https://www.goodreads.com/search/index.xml`,
        params: {
          q: this.state.searchQuery,
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

  handleChange = (event) => {
    this.setState({
      searchQuery: event.target.value
    })
  }


  render() {
    return (
      <div className="search">
        <h2>This is the search modal</h2>
        <p onClick={this.props.handleSearchModalOff}>close this modal</p>

        <h3>Search for a book!</h3>
        <form action="submit" onSubmit={this.getSearchResults}>
          <input type="text" onChange={this.handleChange}/>
          <input type="submit"/>
        </form>

        <div className="searchedBooks">
          {
            this.state.searchResults.map(data => {
              return(
                <div key={data.id["$t"]} className="bookOption" data-key={data.id["$t"]}>
                  <img src={data.best_book.image_url} alt={`Book cover of ${data.best_book.title}`} />
                  <p>{data.best_book.title}</p>
                  <p>{data.best_book.author.name}</p>
                  <p>{data.average_rating}</p>
                </div>
              )
            })
          }

        </div>
        
      </div>
    )
  }
}

export default Search;