import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <h1 className="App-title">Welcome to MORRISON'S JISHO EXTENSION MOTHERFUCKER</h1>
        </header>
        <p className="App-intro">
          To get started, eat some <code>cheese</code> and drink some コーヒー. Then click this button:
        </p>
      </div>
    );
  }
}
