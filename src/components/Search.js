import React, { Component } from "react";
import axios from "axios";
import Qs from "qs";
import "./Search.css";

class Search extends Component {
  constructor() {
    super();
    this.state = {
      searchQuery: "",
      searchResults: [],
      isLoading: ""
    };
  }

  
  getSearchResults = (event) => {
    event.preventDefault();
    this.setState({
      isLoading: true
    });
    axios({
      url: "https://proxy.hackeryou.com",
      dataResponse: "json",
      paramsSerializer: function(params) {
        return Qs.stringify(params, { arrayFormat: "brackets" });
      },
      params: {
        reqUrl: `https://www.goodreads.com/search/index.xml`,
        params: {
          q: this.state.searchQuery,
          key: "WpabDZgBfnIW2CiYFtXKw",
          search: "all"
        },
        proxyHeaders: {
          header_params: "value"
        },
        xmlToJSON: true
      }
    }).then(response => {
      const res = response.data.GoodreadsResponse.search.results.work;
      console.log(res);
      this.setState({
        isLoading: false,
        searchResults: res
      });
    });
  };

  noResults = () => {
    return (
      <p>No results, please try another search.</p>
    )
  }

  handleChange = (event) => {
    this.setState({
      searchQuery: event.target.value
    })
  }

  printSearchedBooks = () => {

    const searchedBooks = this.state.searchResults.map(data => {
      return (

        !isNaN(data.average_rating) &&
        //when there is no average_rating, the value is an object. Return the below JSX when the value is a number (negative NaN)

        <div key={data.id["$t"]} className="bookOption" data-key={data.id["$t"]}>
         
          <img src={data.best_book.image_url.substring(0, 45) + `l` + data.best_book.image_url.substring(46)} alt={`Book cover of ${data.best_book.title}`} />
          <img src={data.best_book.image_url} alt={`Book cover of ${data.best_book.title}`} />
          <p>{data.best_book.title}</p>
          <p>{data.best_book.author.name}</p>
          <p>{data.average_rating}</p>
        </div>
        // console.log(data.id)

      )
    })

    return searchedBooks
  }



  render() {
    return (

      <div className="search">
        <h2>This is the search modal</h2>
        <p onClick={this.props.handleSearchModalOff}>close this modal</p>

        <h3>Search for a book!</h3>
        <form action="submit" onSubmit={this.getSearchResults}>
          <input type="text" onChange={this.handleChange} />
          <input type="submit" />
        </form>

        <div className="searchedBooks">
          {this.state.isLoading ? (
            <p>Loading...</p>
          ) : (
            this.state.searchResults.map(data => {
              return (
                <div
                  key={data.id["$t"]}
                  className="bookOption"
                  data-key={data.id["$t"]}
                >
                  <img
                    src={
                      data.best_book.image_url.substring(0, 45) +
                      "l" +
                      data.best_book.image_url.substring(46)
                    }
                    alt={`Book cover of ${data.best_book.title}`}
                  />
                  <p>{data.best_book.title}</p>
                  <p>{data.best_book.author.name}</p>
                  <p>{data.average_rating}</p>
                </div>
              );
            })
          )}
//======================================================
  //FIX THIS
          {
            //if searchResults is truthy (when there are no results, searchResults is undefined) print the results otherwise print the error handling message
            this.state.searchResults ?
            //don't use length or it will always call noResults - because searchResults is initialized as an empty array
            this.printSearchedBooks() :
            this.noResults()
          }

        </div>
      </div>
    );
  }
}

export default Search;
