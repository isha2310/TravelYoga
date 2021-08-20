import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Search from './Components/SearchSuggestions/SearchSuggestions';

function App() {


  return (
    <div className="App">
      <div style={{display: 'flex', color: '#61dafb', padding: '0px 20px'}} ><h1>TravelYoga &nbsp;</h1><h1 className="App-logo" > : )</h1></div>
      <Search />
    </div>
  );
}

export default App;
