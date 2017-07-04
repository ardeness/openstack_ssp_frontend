export const APPROOT        = 'APPROOT';
export const USERID         = 'USERID';
export const AUTHTOKEN      = 'AUTHTOKEN';
export const PROJECTID      = 'PROJECTID';
export const PROJECTLIST    = 'PROJECTLIST';
export const LOGINHANDLER   = 'LOGINHANDLER';
export const LOGOUTHANDLER  = 'LOGOUTHANDLER';

export function setAppRoot(appRoot){
    return {
        type: 'APPROOT',
        appRoot
    };
}

export function setUserID(userID){
    return {
        type: 'USERID',
        userID
    };
}

export function setAuthToken(authToken) {
    return {
        type: 'AUTHTOKEN',
        authToken
    };
}

export function setProjectID(projectID) {
    return {
        type: 'PROJECTID',
        projectID
    };
}

export function setProjectList(projectList) {
    return {
        type: 'PROJECTLIST',
        projectList
    };
}

export function setLoginHandler(loginHandler) {
    return {
        type: 'LOGINHANDLER',
        loginHandler
    }
}

export function setLogoutHandler(logoutHandler) {
    return {
        type: 'LOGOUTHANDLER',
        logoutHandler
    }
}
