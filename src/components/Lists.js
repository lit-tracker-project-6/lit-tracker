import React, { Component } from 'react';
import firebase from 'firebase';
import './Lists.css';

class Lists extends Component{
  constructor(props) {
    super(props);
    this.state = {
      newListName: '',
    }
  }
  
  //listens to keypresses inside the form and records that in this.state.NewListName
  handleChange = (event) => {
    this.setState({
      newListName: event.target.value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.submitList();
  }
  
  submitList = () => { 
    this.props.addList(this.state.newListName);
   }


  render() {
    return(
      <div className='lists'>
        <h2>Reading Lists</h2>
        <div className="addList">
          <form action="submit" onSubmit={this.handleSubmit}>
            <input type="text" onChange={this.handleChange} placeholder="Create new list" required/>
            <button type="submit"><i class="fas fa-plus"></i></button>
          </form>
        </div>
        <div className="showLists">
            {
              this.props.passedState.lists.map(data => {
                return(
                  <div className="list clearfix" key={data.key}>
                    <i className="fas fa-bookmark"></i>
                    <p onClick={() => {this.props.handleActiveList(data)}}>{data.listTitle}</p>
                    <button className="hidden" onClick={() => this.props.deleteList(data.key)}><i className="fas fa-trash"></i></button>
                  </div>
                )
              })
            }
        </div>
      </div>
    )
  }
}

export default Lists;