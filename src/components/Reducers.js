import { combineReducers } from 'redux';
import { APPROOT, USERID, AUTHTOKEN, PROJECTID, PROJECTLIST, LOGINHANDLER, LOGOUTHANDLER } from './Action';

const appRoot = (state = '', action) => {
    switch(action.type) {
        case APPROOT:
            return action.appRoot;
            
        default:
            return state;
    }
}

const userID = (state = null, action) => {
    switch(action.type) {
        case USERID:
            return action.userID;
        default:
            return state;
    }
}

const authToken = (state = null, action) => {
    switch(action.type) {
        case AUTHTOKEN:
            return action.authToken;

        default:
            return state;
    }
}

const projectID = (state = null, action) => {
    switch(action.type) {
        case PROJECTID:
            return action.projectID;

        default:
            return state;
    }
}

const projectList = (state = {}, action) => {
    switch(action.type) {
        case PROJECTLIST:
            return action.projectList;

        default:
            return state;
    }
}

const loginHandler = (state = null, action) => {
    switch(action.type) {
        case LOGINHANDLER:
            return action.loginHandler;

        default:
            return state;
    }
}

const logoutHandler = (state = null, action) => {
    switch(action.type) {
        case LOGOUTHANDLER:
            return action.logoutHandler;

        default:
            return state;
    }
}

const updateStatus = combineReducers({
    appRoot,
    userID,
    authToken,
    projectID,
    projectList,
    loginHandler,
    logoutHandler
});

export default updateStatus;
