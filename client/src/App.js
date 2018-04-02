import React, { Component } from 'react';
import './App.css';

// Components
import Header from './Header';
import Calendar from './Calendar';

class App extends Component {
  render() {
    return (
      <div className="App">
      	<Header />
      	<Calendar />
      </div>
    );
  }
}

export default App;
