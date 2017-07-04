import React from 'react';
import RegisterTemplate from './RegisterTemplate';
import 'whatwg-fetch';
import Promise from 'promise-polyfill';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import updateStatus from  './Reducers';

//import { Field, reduxForm } from 'redux-form';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import Paper from 'material-ui/Paper';

import Flexbox from 'flexbox-react';

let store = createStore(updateStatus);

if (!window.Promise) {
    window.Promise = Promise;
}

class LoginTemplate extends React.Component{

    // Life-cycle functions
    constructor(props) {
        super(props);
        this.state = {
            userID          : "",
            userPassword    : "",
            selectproject   : [],
            snackbarOpen    : false,
        };
    }

    componentDidMount = () => {
        //$('#forgotpassword').popup({ inline: true, position: 'bottom left' });
        //$('.united.modal').modal({ allowMultiple: false });
        //$('#registuser').modal('hide');
    }


    // Event handling functions
    handleUserIDChange = (e) => {
        e && e.preventDefault ? e.preventDefault() : e.returnValue=false;
        this.setState({ userID: e.target.value });
    }

    handlePasswordChange = (e) => {
        if(e) e.preventDefault();
        this.setState({ userPassword: e.target.value });
    }

    requestSnackbarClose = () => {
        this.setState({snackbarOpen:false});
    }

    handleLogin = (e) => {
        e.preventDefault();
        let userID = this.state.userID;
        let logindata = {};
        let appRoot = this.props.appRoot;

        if(!(appRoot.endsWith("/"))) appRoot = appRoot+'/';
        logindata["userID"] = this.state.userID;
        logindata["userPassword"] = this.state.userPassword;
        return fetch(appRoot+'openstack/login/',{
            method: 'POST',
            body: JSON.stringify(logindata)
        })
        //.then( (response) => response.json() )
        .then( (response) => {
            //if(response.status === 401) {
            if(response.status != 200 && response.status != 201) {
                this.setState({snackbarOpen:true});
                throw new Error("Unauthorized");
            }
            else return response.text();
        })
        .then( (data) => {
            this.props.callback(data, this.state.userID);
        })
        .catch( (error) => {
            console.log('handleLogin error : ' + error.message);
        });
    }

    render = () => {
        const userIDBox = (props) => (
            <TextField  floatingLabelText="User ID"
                        type="text"
                        value={this.state.userID}
                        onChange={this.handleUserIDChange}/>
        );
        return (
            <Flexbox alignItems='center' alignContent='center' alignSelf='center' justifyContent='space-around' padding='30px'>
                <Paper zDepth={2} rounded={true} style={{width:'350px'}}>
                    <h2 style={{textAlign:'center'}}>Self-service portal login</h2>
                    <form id="login_form" onSubmit={this.handleLogin}>
                        <Flexbox flexDirection='column' padding='10px' alignContent='center' alignItems='center'>
                            <TextField  floatingLabelText="User ID"
                                        type="text"
                                        value={this.state.userID}
                                        onChange={this.handleUserIDChange}
                            />
                            <TextField  floatingLabelText="Password"
                                        type="password"
                                        value={this.state.userPassword}
                                        onChange={this.handlePasswordChange}
                            />
                        </Flexbox>
                        <Flexbox justifyContent='space-around' padding='10px'>
                            <RaisedButton   label="Log in"  type="submit"/>
                            <RegisterTemplate/>
                        </Flexbox>
                    </form>
                    <Snackbar   open={this.state.snackbarOpen}
                                message="Invalid credential information. Please login again"
                                autoHideDuration={4000}
                                onRequestClose={this.requestSnackbarClose}
                    />
                    <div style={{height:'40px'}}/>
                </Paper>
            </Flexbox>
        );
    }
};

export default LoginTemplate;
/*
export default reduxForm({
    form: 'loginTemplate'
})(LoginTemplate);
*/
