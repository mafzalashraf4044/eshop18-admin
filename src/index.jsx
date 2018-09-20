import React from 'react';
import ReactDOM from 'react-dom';

import {
  BrowserRouter as Router,
} from 'react-router-dom';
import { browserHistory } from 'react-router'

//  redux
import store from './store/configureStore';
import { Provider } from 'react-redux';

import App from './components/App';

//  styles
import 'assets/css/styles.scss';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const favIcon = require('assets/images/fav.ico');

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory} basename="admin">
      <App />
    </Router>
  </Provider>,
  document.getElementById('root'),
);
