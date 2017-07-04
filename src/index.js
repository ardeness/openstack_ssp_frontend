import React from 'react';
import ReactDOM from 'react-dom';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './components/App';
import updateStatus from './components/Reducers';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
//import {deepOrange500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
//import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
//import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import RaisedButton from 'material-ui/RaisedButton';

import 'babel-polyfill';
import 'whatwg-fetch';
import Promise from 'promise-polyfill';

if (!window.Promise) {
    window.Promise = Promise;
}

injectTapEventPlugin();

let store = createStore(updateStatus);

/*
const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});
*/
let container = document.getElementById('CloudPortal');
render(
    <Provider store = {store}>
        <MuiThemeProvider>
            <App appRoot={container.getAttribute('appRoot')}/>
        </MuiThemeProvider>
    </Provider>,
    container
);
