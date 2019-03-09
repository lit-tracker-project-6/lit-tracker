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
      console.log(res);
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
        searchedBooks = this.state.searchResults.map(data => {
          return (
            !isNaN(data.average_rating) && <BookObject data={data} addBook={this.props.addBook} />
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

    //TODO: images are also weird, the length of the URL string is different when the image doesnt actually exist
    //condiionally render the image, if the string length is longer than the a url string with an image dont add the l

  };

  render() {
    return (
      <div className="search">
        <h2>This is the search modal</h2>
        <p onClick={this.props.closeAndRefresh}>CLOSE AND REFRESH</p>

        <h3>Search for a book!</h3>
        <form action="submit" onSubmit={this.getSearchResults}>
          <input type="text" onChange={this.handleChange} />
          <input type="submit" />
        </form>

        <div className="searchedBooks">
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

  console.log('url length' + data.best_book.image_url.length);

  return (
    <div key={data.id["$t"]} className="bookOption" data-key={data.id["$t"]}>
      {
        data.best_book.image_url.length < 60 ? 
          <img src={data.best_book.image_url.substring(0, 45) + `l` + data.best_book.image_url.substring(46)} alt={`Book cover of ${data.best_book.title}`} /> 
          :
          <img src='https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png' alt={`Book cover of ${data.best_book.title}`} />
      }
      <p>{data.best_book.title}</p>
      <p>{data.best_book.author.name}</p>
      <p>{data.average_rating}</p>
      <button onClick={e => props.addBook(data)}>Add Book</button>
    </div>
  )

}

//loading component - easier to make changes to loading message if segregated as a component
const Loading = () => {
  return(
    <p>Loading</p>
  )
}

export default Search;
