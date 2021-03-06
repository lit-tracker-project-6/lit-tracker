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

  getSearchResults = event => {
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
    })
    .then(response => {
      const res = response.data.GoodreadsResponse.search.results.work;
      // console.log(res);
      this.setState({
        isLoading: false,
        searchResults: res
      })
    });
  };

  noResults = () => {
    return <p>No results, please try another search.</p>;
  };

  handleChange = event => {
    this.setState({
      searchQuery: event.target.value
    });
  };



  printSearchedBooks = () => {

      let searchedBooks;
      //declare variable otherwise the variable would be locally scoped in the below if statement

      if( Array.isArray(this.state.searchResults) ){
        
        //if results is an array - more than one result. map through the results and return
        searchedBooks = this.state.searchResults.map((data,i) => {
          return (
            !isNaN(data.average_rating) && <BookObject key={i} data={data} addBook={this.props.addBook} />
          )
          //book object is the book being printed, pass it props and create this book object for every result in the array
        })

      } else {

        //if results is not an array - there is only one result (which is an object)

        const data = this.state.searchResults;
        
        //check if there is an average rating, if there is, print the book. otherwise print no results
        return (
          !isNaN(data.average_rating) ? 
            <BookObject data={data}/> :
          this.noResults()
        )

      }
    return searchedBooks; //when this function is called, it returns all the printed book results
  };

  render() {
    return (
      <div className="search">
        <div className="searchHeader clearfix">
          <button aria-label="Close Search and return to List" className="closeSearch" title="Close Search" onClick={this.props.closeAndRefresh}><i className="fas fa-times"></i></button>
          <h2>Add books!</h2>
          <form action="submit" onSubmit={this.getSearchResults}>
            <label htmlFor="searchInput" className="visuallyHidden">Search by book or author</label>
            <input id="searchInput" type="text" placeholder="Title/Author" onChange={this.handleChange} />
            <button aria-label="Submit search" type="submit" className="searchButton"><i className="fas fa-search"></i></button>
          </form>
        </div>
        <div aria-live="polite" className="searchedBooks">
          {
            this.state.isLoading ? <Loading /> : 
              this.state.searchResults ? this.printSearchedBooks() : this.noResults()
          }
        </div>
      </div>
    );
  }

}

//creating a component for books - makes conditional rendering less messy
const BookObject = (props) => {

  const data = props['data'];
  
  return (
    <div key={data.id["$t"]} className="book" data-key={data.id["$t"]}>
      { printBookCover(data) }
      <div className="bookInfo">
        <p className="bookTitle">Title: {data.best_book.title}</p>
        <p>Author: {data.best_book.author.name}</p>
        <p>Rating: {data.average_rating}</p>
        <button aria-label={`Add ${data.best_book.title} to reading list`} title="Add book to list" className="addBook" onClick={e => props.addBook(data)}>Add <span className="hide_1015">Book</span><i className="fas fa-book-medical"></i></button>
      </div>
    </div>
  )

}

//loading component - easier to make changes to loading message if segregated as a component
const Loading = () => {
  return(
    <p className="loading">Searching . . .</p>
  )
}


//checks if book cover image exists (based on string length), if it does use the image URL, else use a placeholder image
//this has to be a simple component because it is being called in the book object component 

const printBookCover = (data) => {

  if (data.best_book.image_url.length < 60) {
    return <img className="bookCover" src={data.best_book.image_url.substring(0, 45) + `l` + data.best_book.image_url.substring(46)} alt={`Book cover of ${data.best_book.title}`} />
  } else {
    return <img className="bookCover" src='https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png' alt={`Book cover of ${data.best_book.title}`} />
  }

}

export default Search;
