import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import {ActionButton, SubmitButton} from './Grossary';

import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import RemoveIcon from 'material-ui/svg-icons/content/remove-circle';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import Flexbox from 'flexbox-react';


class VolumeInfo extends React.Component {

    // Life-cycle functions
    constructor(props) {
        super(props);
        this.state = {
            volumeName  :'',
            volumeType  :'',
            volumeSize  :0,
        };
    }

    componentDidMount = () => {
        this.setState({
            volumeName  :this.props.volumeName,
            volumeType  :this.props.volumeType,
            volumeSize  :this.props.volumeSize
        });
    }

    // Event handling functions
    handleVolumeNameChange = (e) => {
        this.props.handleVolumeNameChange(this.props.id, e.target.value);
        this.setState({volumeName:e.target.value});
    }

    handleVolumeTypeChange = (e, index, value) => {
        this.props.handleVolumeTypeChange(this.props.id, value);
        this.setState({volumeType:value});
    }
    handleVolumeSizeChange = (e) => {
        this.props.handleVolumeSizeChange(this.props.id, e.target.value);
        this.setState({volumeSize:e.target.value});
    }
    handleRemoveItem = () => {
        this.props.handleRemoveItem(this.props.id);
    }


    render = () => {
        let volnameBoxId=this.props.id + "_volumename";
        let volsizeBoxId=this.props.id + "_volumesize";

        return (
            <TableRow key={volnameBoxId}>
                <TableRowColumn>
                    <DropDownMenu   value={this.state.volumeType}
                                    onChange={this.handleVolumeTypeChange}
                    >
                            {this.props.volumeTypeSelect}
                    </DropDownMenu>
                </TableRowColumn>
                <TableRowColumn>
                    <TextField  hintText="Volume Name"
                                value={this.state.volumeName}
                                onChange={this.handleVolumeNameChange}
                    />
                </TableRowColumn>
                <TableRowColumn>
                    <TextField  hintText="Volume Size"
                                value={this.state.volumeSize}
                                onChange={this.handleVolumeSizeChange}
                    />
                </TableRowColumn>
                <TableRowColumn>
                    <IconButton tooltip="Remove This Volume Entry"
                                onClick={this.handleRemoveItem}
                    >
                        <RemoveIcon/>
                    </IconButton>
                </TableRowColumn>
            </TableRow>
        );
    }
};


class CreateVolume extends React.Component {

    // Life-cycle functions
    constructor(props) {
        super(props);
        this.state = {
            volumeTypeList      : [],
            volumeCreateList    : [],
            volumeCreateCount   : 0,
            volumePrefix        : '',
            volumeDefaultType   : '',
            volumeCount         : 0,
            volumeDefaultSize   : 0,
            showCreateVolume    : false
        };
    }

    componentDidMount = () => {
        if(this.props.projectID && this.props.projectID != "") {
            let projectID = this.props.projectID;

            this.state.volumeCreateList = [];
            this.state.volumeCount = 0;
            this.state.volumeDefaultType = '';
            this.state.volumeDefaultSize = 0;
            this.state.volumePrevix = '';

            this.setState({
                volumeTypeList      : [],
                volumeCreateList    : [],
                volumeCreateCount   : 0,
                volumePrefix        : '',
                volumeDefaultType   : '',
                volumeCount         : 0,
                volumeDefaultSize   : 0
            });
            this.loadVolumeTypeList(projectID);
            //this.addVolumeCreateTarget(null);
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if(this.props.projectID != nextProps.projectID) {
            let projectID = nextProps.projectID;

            this.state.volumeCreateList = [];
            this.state.volumeCount = 0;
            this.state.volumeDefaultType = '';
            this.state.volumeDefaultSize = 0;
            this.state.volumePrevix = '';

            this.setState({
                volumeTypeList      : [],
                volumeCreateList    : [],
                volumeCreateCount   : 0,
                volumePrefix        : '',
                volumeDefaultType   : '',
                volumeCount         : 0,
                volumeDefaultSize   : 0
            });
            this.loadVolumeTypeList(projectID);
            //this.addVolumeCreateTarget(null);
        }
    }

    // Event handling functions
    handleClose = () => {
        this.setState({showCreateVolume:false});
    }

    handleOpen = () => {
        this.setState({showCreateVolume:true});
    }

    handleRemoveItem = (id) => {
        let volumeCreateList = this.state.volumeCreateList.slice();
        let idx = -1;
        for(let i=0; i<volumeCreateList.length; i++) {
            if(volumeCreateList[i].id == id) {
                idx = i;
                break;
            }
        }
        volumeCreateList.splice(idx, 1);
        this.setState({volumeCreateList});
        this.props.changeCallBack();
    }

    handleCreateVolumes = (callBack) => {
        let data = this.state.volumeCreateList;
        this.requestCreateVolume(data, callBack);
    }

    addVolumeCreateTarget = (e) => {
        if(e) e.preventDefault();

        let volumeInfo = {};
        let volumeCreateList = cloneDeep(this.state.volumeCreateList);

        volumeInfo['volumeName']    = this.state.volumePrefix +
                                    ("0" + (this.state.volumeCount + 1)).slice(-2);
        volumeInfo['volumeType']    = this.state.volumeDefaultType;
        volumeInfo['volumeSize']    = this.state.volumeDefaultSize;
        volumeInfo['id']            = volumeInfo['volumeName']+Date.now();

        volumeCreateList.push(volumeInfo);
        this.setState({volumeCreateList,volumeCount:this.state.volumeCount+1});
    }

    handleVolumeCreateInfo = (id, key, value) => {
        let volumeCreateList = this.state.volumeCreateList.slice();
        let idx = -1;
        let i = 0;
        for(i=0; i<volumeCreateList.length; i++) {
            if(volumeCreateList[i].id == id) {
                idx = i;
                break;
            }
        }
        let row = volumeCreateList[idx];
        row[key] = value;
        volumeCreateList[idx] = row;
        this.setState({volumeCreateList});
    }

    handleVolumeNameChange = (id, value) => {
        let volumeName = value;
        let token = volumeName.split(/[-,_]/);
        let volumeCount = this.state.volumeCount;
        let volumePrefix = volumeName;

        // Last integer number starts with '-' or '_' will be the start number
        // of volume name group, and the string before '-' or '_' will become
        // volume name prefix.
        if(token.length > 1 && /^\d+$/.test(token[token.length - 1])) {
            let regex = '[-,_]'+token[token.length - 1]+'$';
            regex = new RegExp(regex, 'gi');
            volumeCount = parseInt(token[token.length - 1]);
            let dummy = volumeName.match(regex);
            let separator = dummy[0][0];
            volumePrefix = volumeName.replace(regex,'')+separator;
            this.setState({volumePrefix, volumeCount});
        }
        this.handleVolumeCreateInfo(id, 'volumeName', value);
    }

    handleVolumeTypeChange = (id, value) => {
        this.setState({volumeDefaultType:value});
        this.handleVolumeCreateInfo(id, 'volumeType', value);
    }

    handleVolumeSizeChange = (id, value) => {
        this.setState({volumeDefaultSize:value});
        this.handleVolumeCreateInfo(id, 'volumeSize', value);
    }

    handleCreateVolumes = (callBack) => {
        var self = this;
        let data = this.state.volumeCreateList;
        this.requestCreateVolume(data, callBack);
    }

    requestCreateVolume = (data, callBack) => {
        data["projectID"] = this.state.projectID;

        return fetch(this.props.appRoot+'openstack/'+this.props.projectID+'/createvolumes/',{
            method: 'POST',
            headers: {
                'X-Auth-Token': this.props.authToken,
            },
            body : JSON.stringify(data)
        })
        .then( (response) => response.json() )
        .then( (data) =>  {
            callBack(false);
            $('#createvolume').modal('hide');
            this.setState({volumeCreateList:[]});
            this.addVolumeCreateTarget();
        })
        .catch( (error) => {
            callBack(false);
            console.log('create volume request fail :' + error.message);
            $('#createvolume').modal('hide');
        });
    }


    // Load functions
    loadVolumeTypeList = (projectID) => {
        return fetch(this.props.appRoot+'openstack/'+projectID+'/volumetypelist/',{
            method: 'GET',
            headers: {
                'X-Auth-Token': this.props.authToken,
            }
        })
        .then( (response) => response.json() )
        .then( (data) =>  {
            data.sort(function(a, b) {
                if(a.name > b.name) return 1;
                if(a.name < b.name) return -1;
                return 0;
            });
            this.setState({volumeTypeList:data, volumeDefaultType:data[0].name});
        })
        .catch( (error) => {
            console.log('loadVolumeTypeList : ' + error.message);
        });
    }

    render = () => {
        let volumeTypeSelect = this.state.volumeTypeList.map((volumeType) =>
                <MenuItem   key={volumeType.name}
                            value={volumeType.name}
                            primaryText={volumeType.name}
                 />
            );

        let VolumeCreateList = this.state.volumeCreateList.map((volumeInfo) =>
                <VolumeInfo key={volumeInfo.id}
                            id={volumeInfo.id}
                            volumeType={volumeInfo.volumeType}
                            volumeName={volumeInfo.volumeName}
                            volumeSize={volumeInfo.volumeSize}
                            volumeTypeSelect={volumeTypeSelect}
                            handleVolumeNameChange={this.handleVolumeNameChange}
                            handleVolumeTypeChange={this.handleVolumeTypeChange}
                            handleVolumeSizeChange={this.handleVolumeSizeChange}
                            handleRemoveItem={this.handleRemoveItem}
                />
            );

        const actions=[
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleClose}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                onTouchTap={this.handleCreateVolumes}
            />
        ];

        return(
            <div>
                <RaisedButton label="볼륨 생성" onTouchTap={this.handleOpen}/>
                <Dialog title="볼륨 생성 정보"
                        actions={actions}
                        modal={true}
                        open={this.state.showCreateVolume}
                >
                    <Flexbox>
                        <Flexbox alignItems='flex-start'>
                            <p style={{ fontSize: 12 }}>
                                * 아래의 볼륨추가 버튼을 이용해 여러개의 볼륨을 동시에 생성할 수 있습니다.
                            </p>
                        </Flexbox>
                        <Flexbox alignItems='center'>
                            <FlatButton label="볼륨 추가"
                                        onClick={this.addVolumeCreateTarget}
                            />
                        </Flexbox>
                    </Flexbox>

                    <Flexbox flexDirection='row'>
                        <Flexbox flexDirection='column' justifyContent='space-around'>
                            <Divider/>
                            <Table>
                                <TableHeader
                                    adjustForCheckbox={false}
                                    displaySelectAll={false}
                                >
                                    <TableRow>
                                        <TableHeaderColumn>
                                            <label>볼륨타입</label>
                                        </TableHeaderColumn>
                                        <TableHeaderColumn>
                                            <label>볼륨이름</label>
                                        </TableHeaderColumn>
                                        <TableHeaderColumn>
                                            <label>용량(GB)</label>
                                        </TableHeaderColumn>
                                        <TableHeaderColumn>
                                            <label>삭제</label>
                                        </TableHeaderColumn>
                                    </TableRow>
                                </TableHeader>
                                <TableBody displayRowCheckbox={false}>
                                    {VolumeCreateList}
                                </TableBody>
                            </Table>
                        </Flexbox>
                    </Flexbox>
                </Dialog>
            </div>
        );
    }
};

export default CreateVolume;
