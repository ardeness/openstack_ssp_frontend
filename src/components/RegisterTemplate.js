import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';

class RegisterTemplate extends React.Component{

    // Life-cycle functions
    constructor(props) {
        super(props);
        this.state = {
            userID          : "",
            userPassword    : "",
            selectproject   : [],
            open            : false
        };
    }

    componentDidMount = () => {
    }

    // Event handling functions
    handleJoinUserIDChange = (e) => {
        if(e) e.preventDefault();
        this.setState({ joinUserID: e.target.value });
    }

    handleJoinUserPasswordChange = (e) => {
        if(e) e.preventDefault();
        this.setState({ joinUserPassword: e.target.value });
    }

    handleJoinUserPasswordCheckChange = (e) => {
        if(e) e.preventDefault();
        this.setState({ joinUserPasswordCheck: e.target.value });
    }

    handleJoinUserEmailChange = (e) => {
        if(e) e.preventDefault();
        this.setState({ joinUserEmail: e.target.value });
    }

    handleJoinUserTeamChange = (e) => {
        if(e) e.preventDefault();
        this.setState({ joinUserTeam: e.target.value });
    }

    handleJoinUserNameChange = (e) => {
        if(e) e.preventDefault();
        this.setState({ joinUserName: e.target.value });
    }

    handleJoinUserEmployeeNumberChange = (e) => {
        if(e) e.preventDefault();
        this.setState({ joinUserEmployeeNumber: e.target.value });
    }

    handleJoinUserProjectChange = (e, index, value) => {
        if(e) e.preventDefault();
        this.setState({ joinUserProject: value });
    }

    handleJoinSelectProjectChange = (e) => {
        if(e) e.preventDefault();
        $('#selectproject').val();
        this.setState({ selectproject:e.target.value });
    }

    handleSubmit = (e) => {

    }

    showRegister = () => {
        this.setState({open:true});
    }
    handleClose = () => {
        this.setState({open:false});
    }



    render = () => {

        const actions=[
            <RaisedButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleClose}
            />,
            <RaisedButton
                label="Submit"
                primary={true}
                onTouchTap={this.handleSubmit}
            />
        ];

        return (
            <div>
                <RaisedButton   label="Register"
                                onClick={this.showRegister}
                />
                <Dialog title="사용자 등록 정보"
                        actions={actions}
                        modal={true}
                        open={this.state.open}
                >
                    <form id="register_form">
                        <TextField  floatingLabelText="사용자 ID"
                                    value={this.state.joinUserID}
                                    onChange={this.handleJoinUserIDChange}
                        />
                        <br/>
                        <TextField  floatingLabelText="패스워드"
                                    value={this.state.joinUserPassword}
                                    onChange={this.handleJoinUserPasswordChange}
                                    type="password"
                        />
                        <br/>
                        <TextField  floatingLabelText="패스워드 확인"
                                    value={this.state.joinUserPasswordCheck}
                                    onChange={this.handleJoinUserPasswordCheckChange}
                                    type="password"
                        />
                        <br/>
                        <TextField  floatingLabelText="E-mail"
                                    value={this.state.joinUserEmail}
                                    onChange={this.handleJoinUserEmailChange}
                        />
                        <br/>
                        <TextField  floatingLabelText="소속"
                                    value={this.state.joinUserTeam}
                                    onChange={this.handleJoinUserTeamChange}
                        />
                        <br/>
                        <TextField  floatingLabelText="이름"
                                    value={this.state.joinUserName}
                                    onChange={this.handleJoinUserNameChange}
                        />
                        <br/>
                        <TextField  floatingLabelText="사번"
                                    value={this.state.joinUserEmployeeNumber}
                                    onChange={this.handleJoinUserEmployeeNumberChange}
                        />
                        <br/>
                        <SelectField    floatingLabelText="프로젝트"
                                        value={this.state.joinUserProject}
                                        onChange={this.handleJoinUserProjectChange}
                        >
                            <MenuItem   value="hadoop" primaryText="Hadoop"/>
                            <MenuItem   value="admin" primaryText="admin"/>
                            <MenuItem   value="tms" primaryText="tms"/>
                        </SelectField>
                    </form>
                </Dialog>
            </div>
        );
    }
};

export default RegisterTemplate;
