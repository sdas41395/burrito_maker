import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { withRouter } from 'react-router-dom'
import { Provider } from "react-redux";
import burrito_maker from './reducers/reducers'
import Routes from './Routes'
import { createStore } from 'redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'


// INTIALIZING THE STORE

import {
  intialize_app
} from './actions/actions'

const store = createStore(burrito_maker)
store.dispatch(intialize_app())
console.log(store.getState())


ReactDOM.render(

  <div>
    <Provider store={store} >
      <Router>
        <Routes />
      </Router>
    </Provider>
  </div>,

  document.getElementById('root'));

