import React from 'react';
import ReactDOM from 'react-dom';
//import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import Route from 'react-router/lib/Route';
import Router from 'react-router/lib/Router';
import IndexRoute from 'react-router/lib/IndexRoute';
import browserHistory from 'react-router/lib/browserHistory';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';

import Paper from 'material-ui/Paper';
import { GridList, GridTile } from 'material-ui/GridList';

import LoginTemplate from './LoginTemplate';
import ReactRedirect from 'react-redirect';
import Dashboard from './Dashboard';
import InstanceTable from './InstanceTable';
import VolumeTable from './VolumeTable';
import { TopMenu, SideMenu } from './Grossary';
import updateStatus from './Reducers';
import { setAppRoot, setUserID, setAuthToken, setProjectID, setProjectList, setLoginHandler, setLogoutHandler } from './Action';


let store = createStore(updateStatus);

const styles = {
  div:{
    display: 'flex',
    flexDirection: 'row wrap',
    padding: 0,
    //width: '100%'
  },
  paperLeft:{
    flex: 1,
    height: '100%',
    margin: 0,
    textAlign: 'center',
    padding: 0
  },
  paperRight:{
    height: '100%',
    flex: 10,
    margin: 0,
    textAlign: 'center',
  }
};

const mapStateToProps = (state) => {
    return {
        userID          : state.userID,
        authToken       : state.authToken,
        projectID       : state.projectID,
        projectList     : state.projectList,
        loginHandler    : state.loginHandler,
        logoutHandler   : state.logoutHandler
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateAppRoot       : (value) => dispatch(setAppRoot(value)),
        updateUserID        : (value) => dispatch(setUserID(value)),
        updateAuthToken     : (value) => dispatch(setAuthToken(value)),
        updateProjectID     : (value) => dispatch(setProjectID(value)),
        updateProjectList   : (value) => dispatch(setProjectList(value)),
        updateLoginHandler  : (value) => dispatch(setLoginHandler(value)),
        updateLogoutHandler : (value) => dispatch(setLogoutHandler(value))
    }
}

class MainLayout extends React.Component {
    constructor(props) {
        super(props);
    }

    render = () => {
        return (
            <div style={styles.div}>
                <div style={styles.paperLeft}>
                    <SideMenu appRoot={this.props.appRoot}/>
                </div>
                <div style={styles.paperRight}>
                    <TopMenu />
                    {this.props.children}
                </div>
            </div>
        );
    }
}

const getRoutePath = (state) => {
    return {
        appRoot     : state.appRoot
    }
}


MainLayout = connect(getRoutePath)(MainLayout);


const defaultRoutes = {
    path        : '/',
    component   : MainLayout,
    indexRoute  : { component: Dashboard },
    childRoutes : [
        { path  : 'dashboard', component: Dashboard },
        { path  : 'instance', component: InstanceTable },
        { path  : 'volume', component: VolumeTable }
    ]
};


class App extends React.Component {

    constructor(props) {
        super(props);
        let authToken = sessionStorage.getItem('authToken');
        let userID = sessionStorage.getItem('userID');
        let projectID = sessionStorage.getItem('projectID');
        let projectList = {};
        let isLogedin = authToken ? true : false;
        let appRoot = this.props.appRoot != undefined ? this.props.appRoot : '/';
        if(!(appRoot.endsWith("/"))) appRoot = appRoot+'/';

        this.state = {authToken, userID, projectList, projectID, isLogedin};
        this.props.updateProjectID(projectID);
        this.props.updateAuthToken(authToken);
        this.props.updateUserID(userID);
        this.props.updateLoginHandler(this.handleLogin);
        this.props.updateLogoutHandler(this.handleLogout);
        this.props.updateAppRoot(appRoot);

        if(authToken)
            this.loadProjectList();
    }


    componentDidMount = () => {
        //this.loadProjectList();
        //$('.dropdown').dropdown();
    }

    componentWillReceiveProps = (nextProps) => {
        //this.loadProjectList();
        //$('.dropdown').dropdown();
    }


    handleLogin = (authToken, userID) => {

        sessionStorage.setItem('authToken', authToken);
        sessionStorage.setItem('userID', userID);
        this.setState({ authToken, userID })
        this.props.updateAuthToken(authToken);
        this.props.updateUserID(userID);
        this.loadProjectList();
        //sessionStorage.setItem('authToken', authToken);
        //sessionStorage.setItem('userID', userID);

        this.setState({ authToken, userID, isLogedin:true })
    }

    handleLogout = () => {
        sessionStorage.removeItem('userID');
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('projectID');
        this.setState({ authToken: null,
                        projectID: null,
                        userID: null,
                        projectList: {},
                        isLogedin:false
                    });
    }

    componentDidUpdate = () => {
        //$('.dropdown').dropdown();
    }

    handleProjectSelect = (projectID) => {
        this.setState({projectID});
        sessionStorage.setItem('projectID', projectID);
    }

    // Load functions
    loadProjectList = () => {

        let appRoot = this.props.appRoot;
        if(!(appRoot.endsWith("/"))) appRoot = appRoot + '/';
        return fetch(appRoot+'openstack/tenantlist/',{
            method: 'GET',
            headers: {
                'X-Auth-Token': this.state.authToken,
            }
        })
        .then( (response) => response.json() )
        .then( (data) =>  {
            let projectID = data[0]['tenantID'];
            if(this.state.projectID != null && this.state.projectID != "") {
                projectID = this.state.projectID;
            }

            let projectList = {};
            let len = data.length;
            for(let i=0; i<len; i++) {
                projectList[data[i]['tenantID']] = data[i]['tenantName'];
            }

            this.setState({projectList, projectID});
            this.props.updateProjectList(projectList);
            this.props.updateProjectID(projectID);
            sessionStorage.setItem('projectID', projectID);
        })
        .catch( (error) => {
            console.log('loadProjectList : ' + error.message);
        });
    }

    render = () => {

        let routes = defaultRoutes;
        let appRoot = this.props.appRoot;
        routes.path = this.props.appRoot;

        if (this.state.isLogedin) {
            return (
                <Router history={browserHistory} routes={routes}/>
            );
            //return (<ReactRedirect location='dashboard'/>);
        } else {
            return (
                <LoginTemplate callback={this.handleLogin} appRoot={appRoot}/>
            );
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
