import React from 'react';
//import { Link } from 'react-router';
import Link from 'react-router/lib/Link'
import { connect } from 'react-redux';

import DropDownMenu from 'material-ui/DropDownMenu';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { List, ListItem } from 'material-ui/List'
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import Checkbox from 'material-ui/Checkbox';
import Drawer from 'material-ui/Drawer';

import { setProjectID } from './Action';



let mapStateToProps = (state) => {
    return {
        projectID       : state.projectID,
        projectList     : state.projectList
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        updateProjectID     : (value) => dispatch(setProjectID(value)),
    }
}

let select = (state) => {
    return {
        userID          : state.userID,
        logoutHandler   : state.logoutHandler
    }
}

class ProjectList extends React.Component{

    // Life-cycle functions
    constructor(props){
        super(props);
        this.state = {
            projectID   : props.projectID,
            optionList  : [],
            projectList : props.projectList
        };
    }

    componentDidMount = () => {
        if( this.props.projectList.length > 0) {
            let firstKey = Object.keys(this.props.projectList)[0];
            if(this.props.projectID != "") {
                firstKey = this.props.projectID;
            }
            let optionList = this.updateOptionList(this.props.projectList, firstKey);
            this.setState({ projectID:firstKey,
                            projectList:this.props.projectList,
                            optionList:optionList
                            });
            //$('.dropdown').dropdown();
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if( nextProps.projectList &&
            nextProps.projectList != this.props.projectList) {
            let projectID=Object.keys(nextProps.projectList)[0];
            if(nextProps.projectID != null) {
                projectID = nextProps.projectID;
            }
            let optionList = this.updateOptionList(nextProps.projectList, projectID);
            this.setState({ projectID,
                            projectList:nextProps.projectList,
                            optionList:optionList
                            });
            //this.props.updateProjectID(projectID);
            //$('.dropdown').dropdown();
        }
    }


    // Event handling functions
    handleProjectSelect = (event, index, projectID) => {
        this.setState({projectID});
        this.props.updateProjectID(projectID);
        sessionStorage.setItem('projectID',projectID);
    }

    updateOptionList = (projectList, projectID) => {
        let optionList=[];
        for(let key in projectList) {
            let value = key;
            let primaryText = projectList[key];
            let component = React.createElement(MenuItem,
                            {key, value, primaryText});
            optionList.push(component);
        };
        return optionList;
    }

/*
    <div className="ui dropdown item">
        <span id="topmenufont">
            Project: {this.state.projectList[this.state.projectID]}
        </span>
        <i className="dropdown icon"/>
        <div className="menu">
            {this.state.optionList}
        </div>
    </div>
*/

    render = () => {
        let title = "Project : " + this.state.projectList[this.state.projectID];
        let optionList = this.updateOptionList(this.props.projectList, this.props.projectID);
        return(
            <DropDownMenu value={this.props.projectID} onChange={this.handleProjectSelect}>
                {optionList}
            </DropDownMenu>
        );
    }
};

ProjectList = connect(mapStateToProps, mapDispatchToProps)(ProjectList);

class AccountMenu extends React.Component{

    render = () => {
        return (
            <DropDownMenu value='default'>
                <MenuItem value='default' primaryText={this.props.userID}/>
                <MenuItem primaryText="사용자 설정"/>
                <MenuItem primaryText="비밀번호 변경"/>
                <MenuItem primaryText="로그아웃" onClick={this.props.logoutHandler}/>
            </DropDownMenu>
        );
    }
};

AccountMenu = connect(select)(AccountMenu);

class TopMenu extends React.Component{

    // Life-cycle functions
    constructor(props) {
        super(props);
        this.state = {
            projectList:{}
        };
    }

    componentDidMount = () => {
        this.setState({
            projectList : this.props.projectList,
            projectID   : this.props.projectID
        })
    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({
            projectList : nextProps.projectList,
            projectID   : nextProps.projectID
        });
    }


    render = () => {
        return(
            <Toolbar>
                <ToolbarGroup>
                    <ToolbarTitle text="Project"/>
                    <ProjectList/>
                </ToolbarGroup>
                <ToolbarGroup lastChild={true}>
                    <ToolbarTitle text="User"/>
                    <AccountMenu/>
                </ToolbarGroup>
            </Toolbar>
        );
    }
};

const LinkItem = ({active, children, to}) => (
    <Link to={to} className={active? 'active': ''}>
        {children}
    </Link>
);

//<Link to={'/dashboard'} active={this.context.router.}>
class SideMenu extends React.Component{

    render = () => {
        let dashboardLink = this.props.appRoot+'dashboard';
        let instanceLink = this.props.appRoot+'instance';
        let volumeLink = this.props.appRoot+'volume';

        return(
            <List>
                <ListItem>
                    cloud portal
                </ListItem>
                <Link to={dashboardLink}>
                    <ListItem>
                        Dashboard
                    </ListItem>
                </Link>
                <Link to={instanceLink}>
                    <ListItem>
                        Instance
                    </ListItem>
                </Link  >
                <Link to={volumeLink}>
                    <ListItem>
                        volume
                    </ListItem>
                </Link>
            </List>
        );
    }
};

class SubmitButton extends React.Component{

    // Life-cycle functions
    constructor(props) {
        super(props);
        this.state = {status:false};
    }


    // Event-handling functions
    handleClick = (e) => {
        this.setState({status:true});
        this.props.handleClick(this.callBack);
    }

    callBack = (status) => {
        this.setState({status});
    }


    render = () => {
        if(this.state.status) {
            let loadingButton = this.props.className + " loading button";
            return (
                <div className={loadingButton}/>
            )
        }
        else {
            return (
                <div    className={this.props.className}
                        onClick={this.handleClick}
                >
                    {this.props.label}
                    <i className={this.props.icon}  style={{cursor:'pointer'}}/>
                </div>
            );
        }
    }
};


class ActionButton extends React.Component{

    // Event handling functions
    handleClick = (e) => {
        this.props.handleClick(e);
    }


    render = () => {
        return (
            <div    className={this.props.className}
                    style={{cursor:'pointer'}}
                    onClick={this.handleClick}
            >
                {this.props.label}
                <i className={this.props.icon} style={{cursor:'pointer'}}/>
            </div>
        );
    }
};


class SearchBar extends React.Component{

    // Life-cycle function
    constructor(props) {
        super(props);
        this.state = {searchWord:""};
    }


    // Event handling function
    onChange = (e) => {
        this.props.setSearchWord(e.target.value);
        this.setState({searchWord:e.target.value});
    }


    render = () => {
        return (
            <div className="ui fluid search center aligned">
                <div className="ui icon input">
                    <input  className="prompt"
                            placeholder="VM Name or UUID"
                            type="text"
                            value={this.state.searchWord}
                            onChange={this.onChange}
                    />
                    <i className="search icon"/>
                </div>
            </div>
        );
    }
};



class TargetCheck extends React.Component{

    // Event handling functions
    onClick = (e) => {
        this.props.setChecked(this.props.index, !this.props.isChecked);
    }


    render = () => {
        return (
            <Checkbox   checked={this.props.isChecked}
                        onCheck={this.props.onClick || this.onClick}
            />
        );
    }
};



class ToggleAll extends React.Component{

    // Event handling functions
    onClick = (e) => {
        this.props.handleClick();
    }

    render = () => {
        let className = '';
        if(this.props.toggleStatus) {
            className = "checkmark box icon";
        } else {
            className = "square outline icon";
        }
        return (
                <Checkbox   checked={this.props.toggleStatus}
                            onCheck={this.props.onClick || this.onClick}
                />
        );
    }
};

TopMenu = connect(select)(TopMenu);
export {TopMenu, SideMenu, SubmitButton, ActionButton, SearchBar, TargetCheck, ToggleAll};
