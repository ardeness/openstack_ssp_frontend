import React from 'react';
import ReactDOM from 'react-dom';
//tabular';
import cloneDeep from 'lodash/cloneDeep';
import { connect } from 'react-redux';
import Pagination from 'material-ui-pagination';

import TextField from 'material-ui/TextField';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import RaisedButton from 'material-ui/RaisedButton';
import IconMenu from 'material-ui/IconMenu';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import ExtensionIcon from 'material-ui/svg-icons/navigation/menu';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';

import Flexbox from 'flexbox-react';

import {TopMenu, TargetCheck, ToggleAll} from './Grossary';
import MaterialTable from './MaterialTable';
import CreateVolume from './CreateVolume';
//import $ from 'jquery';

// Table data as a list of array.
const columns = [
    {
        property: 'checkBox',
        header: {
            label: ''
        },
        style: {
            width: '5%'
        }
    },
    {
        property: 'name',
        header: {
            label: '볼륨명'
        },
        style: {
            width: '20%'
        }
    },
    {
        property: 'volume_type',
        header: {
            label: '타입'
        },
        style: {
            width: '8%'
        }
    },
    {
        property: 'created_at',
        header: {
            label: '생성일'
        },
        style: {
            width: '13%'
        }
    },
    {
        property: 'size',
        header: {
            label: '크기'
        },
        style: {
            width: '5%'
        }
    },
    {
        property: 'status',
        header: {
            label: '상태',
        },
        style: {
            width: '8%'
        }
    },
    {
        property: 'bootable',
        header: {
            label: '부트 가능',
        },
        style: {
            width: '12%'
        }
    },
    {
        property: 'job',
        header: {
            label: '작업',
        },
        style: {
            width: '5%'
        }
    }
];

class JobButton extends React.Component{

    attachVolume = (instanceID) => {
        let actionData = {};
        let sourceID = [];
        let targetID = instanceID;

        sourceID.push(this.props.volumeID);
        actionData['sourceID'] = sourceID;
        actionData['targetID'] = targetID;
        actionData['action'] = "attachvolume";

        let keyName = 'status';
        let stateList = ['in-use', 'error'];

        return fetch(this.props.appRoot+'openstack/'+this.props.projectID+'/action/',{
            method: 'PUT',
            headers: {
                'X-Auth-Token': this.props.authToken,
            },
            body: JSON.stringify(actionData)
        })
        .then( (response) => response.json() )
        .then( (data) =>  {
            this.props.updateMe(this.props.volumeID, keyName, stateList);
        })
        .catch( (error) => {
            console.log('attachVolume error : ' + error.message);
        });
    }

    detachVolume = () => {
        let actionData = {};
        let sourceID = [];
        let targetID = '';

        sourceID.push(this.props.volumeID);
        actionData['sourceID'] = sourceID;
        actionData['targetID'] = targetID;
        actionData['action'] = "removevolume";

        return fetch(this.props.appRoot+'openstack/'+this.props.projectID+'/action/',{
            method: 'PUT',
            headers: {
                'X-Auth-Token': this.props.authToken,
            },
            body: JSON.stringify(actionData)
        })
        .then( (response) => response.json() )
        .then( (data) =>  {
            this.props.callBack();
        })
        .catch( (error) => {
            console.log('detatchVolume error : ' + error.message);
        });
    }

    deleteVolume = () => {
        let actionData = {};
        let sourceID = [];
        let targetID = '';

        sourceID.push(this.props.volumeID);
        actionData['sourceID'] = sourceID;
        actionData['targetID'] = targetID;
        actionData['action'] = "deletevolume";

        return fetch(this.props.appRoot+'openstack/'+this.props.projectID+'/action/',{
            method: 'PUT',
            headers: {
                'X-Auth-Token': this.props.authToken,
            },
            body: JSON.stringify(actionData)
        })
        .then( (response) => response.json() )
        .then( (data) =>  {
            this.props.callBack();
        })
        .catch( (error) => {
            console.log('deleteVolume error : ' + error.message);
        });
    }

    render = () => {
        let instanceSelect = this.props.instanceList.length > 0
            ?
            this.props.instanceList.map(function(instance) {
                return (
                    <MenuItem   key={instance.id}
                                primaryText={instance.vmname}
                                onClick={this.attachVolume.bind(this, instance.id)}
                    />
                );
            }.bind(this))
            :
            React.createElement('div', {className:"item"}, "No available instance");

        return (
            <IconMenu
                iconButtonElement={<IconButton><ExtensionIcon/></IconButton>}
                useLayerForClickAway={true}
            >
            { this.props.status == "available" ?
                <MenuItem   primaryText="볼륨 연결"
                            rightIcon={<ArrowDropRight/>}
                            menuItems={instanceSelect}
                />
                :
                <MenuItem   primaryText="볼륨 연결 해제"
                            onClick={this.detachVolume}
                />
            }
                <MenuItem   primaryText="볼륨 삭제"
                            onClick={this.deleteVolume}
                />
            </IconMenu>
        );
    }
};

class VolumeTable extends React.Component{

    // Life-cycle functions
    constructor(props) {
        super(props);
        this.state = {
            toggleStatus    : false,
            columns         : columns,
            viewData        : [],
            volumeList      : [],
            instanceList    : [],
            projectList     : {},
            projectID       : "",
            pageNum         : 0,
            listPerPage     : 10,
            currentPage     : 1,
            filteredData    : [],
            searchGroup     : '',
            searchKeyWord   : '',

            showVolumeJobMenu   : false,
            volumeJobMenuAnchor : null,
        };
    }

    componentDidMount = () => {
        /*
        $('#createvolume').popup({
                            detachable      : true,
                            inline          :false,
                            hoverable       : false,
                            on              : 'click'
                            });
        $('#createvolume').modal({observeChanges : true});
        $('#createvolume').modal('hide');
        */
        this.setState({ projectID:this.props.projectID,
                        projectList:this.props.projectList});
        this.loadServerList(this.props.projectID);
        this.resetToggle();
    }

    componentWillReceiveProps = (nextProps) => {
        if(nextProps.projectID != this.props.projectID) {
            this.setState({ projectList:nextProps.projectList,
                            projectID:nextProps.projectID});
            this.loadServerList(nextProps.projectID);
            this.resetToggle();
        }
    }

    componentDidUpdate = () => {
        //$('.dropdown').dropdown();
    }


    // Event handling functions
    handlePageClick = (pageIndex, e) => {
        if(e && e.preventDefault) e.preventDefault;

        this.resetToggle();
        this.setState({currentPage:pageIndex});
        this.pagenate(this.state.filteredData, pageIndex);
    }

    handleCheckBoxClick = (index, isChecked) => {
        let volumeList = cloneDeep(this.state.volumeList);
        volumeList[index].isChecked = isChecked;
        this.setState({volumeList});
        this.filterData(volumeList, this.state.searchGroup, this.state.searchKeyWord);
    }

    handleListPerPageChange = (e, index, value) => {
        let listPerPage = Number(value);
        let len = this.state.filteredData.length;
        if(listPerPage < 1) listPerPage = 1;
        this.state.listPerPage = listPerPage;
        this.setState({pageNum:Math.ceil(len/listPerPage), currentPage: 1});
        this.pagenate(this.state.filteredData, 1);
    }

    attachMultiVolumes = (instanceID) => {
        let actionData = {};
        let sourceID = this.getTargetList();
        let targetID = instanceID;

        //sourceID.push(ipaddress);
        actionData['sourceID'] = sourceID;
        actionData['targetID'] = targetID;
        actionData['action'] = 'attachvolume';

        this.closeVolumeJobMenu();

        return fetch(this.props.appRoot+'openstack/'+this.props.projectID+'/action/',{
            method: 'PUT',
            headers: {
                'X-Auth-Token': this.props.authToken,
            },
            body: JSON.stringify(actionData)
        })
        .then( (response) => response.json() )
        .then( (data) =>  {
            this.resetToggle();
            this.loadVolumeList(this.props.projectID);
        })
        .catch( (error) => {
            console.log('attachMultiVolumes error : ' + error.message);
        });
    }

    detachMultiVolumes = () => {
        let actionData = {};
        let sourceID = this.getTargetList();
        let targetID = "";

        //sourceID.push(ipaddress);
        actionData['sourceID']  = sourceID;
        actionData['targetID']  = targetID;
        actionData['action']    = 'removevolume';

        this.closeVolumeJobMenu();

        return fetch(this.props.appRoot+'openstack/'+this.props.projectID+'/action/',{
            method: 'PUT',
            headers: {
                'X-Auth-Token': this.props.authToken,
            },
            body: JSON.stringify(actionData)
        })
        .then( (response) => response.json() )
        .then( (data) =>  {
            this.loadVolumeList(this.props.projectID);
            this.resetToggle();
        })
        .catch( (error) => {
            console.log('detachMultiVolumes error : ' + error.message);
        });
    }

    deleteMultiVolumes = () => {
        let actionData = {};
        let sourceID = this.getTargetList();
        let targetID = '';

        //sourceID.push(ipaddress);
        actionData['sourceID'] = sourceID;
        actionData['targetID'] = targetID;
        actionData['action'] = 'deletevolume';

        this.closeVolumeJobMenu();

        return fetch(this.props.appRoot+'openstack/'+this.props.projectID+'/action/',{
            method: 'PUT',
            headers: {
                'X-Auth-Token': this.props.authToken,
            },
            body: JSON.stringify(actionData)
        })
        .then( (response) => response.json() )
        .then( (data) =>  {
            this.loadVolumeList(this.props.projectID);
            this.resetToggle();
        })
        .catch( (error) => {
            console.log('deleteMultiVolumes error : ' + error.message);
        });
    }

    handleJob = (action) => {
        let sourceID = this.getTargetList();
        let actionData = {};
        let targetID = '';

        //sourceID.push(this.props.vmID);
        actionData['sourceID']  = sourceID;
        actionData['targetID']  = targetID;
        actionData['action']    = action;

        return fetch(this.props.appRoot+'openstack/'+this.props.projectID+'/action/',{
            method: 'PUT',
            headers: {
                'X-Auth-Token': this.props.authToken,
            },
            body: JSON.stringify(actionData)
        })
        .then( (response) => response.json() )
        .then( (data) =>  {
        })
        .catch( (error) => {
            console.log('handleJob error : ' + error.message);
        });

        this.resetToggle();
    }

    handleSelectSearchGroupChange = (e, index, value) => {
        if(e && e.preventDefault) e.preventDefault();
        let searchGroup = value;
        this.setState({searchGroup});
        this.filterData(this.state.volumeList, searchGroup, this.state.searchKeyWord);
    }

    handleKeyWordChange = (e) => {
        if(e && e.preventDefault) e.preventDefault();
        let searchKeyWord = e.target.value;
        this.setState({searchKeyWord});
        this.filterData(this.state.volumeList, this.state.searchGroup, searchKeyWord);
    }

    showVolumeJobMenu = (e) => {
        this.setState({
            showVolumeJobMenu:true,
            volumeJobMenuAnchor:e.currentTarget
        });
    }

    closeVolumeJobMenu = () => {
        this.setState({showVolumeJobMenu:false});
    }


    // Utility functions
    pagenate = (data, currentPage) => {
        let pagenum = currentPage - 1;
        let start = pagenum * this.state.listPerPage;
        let src = data;
        let viewData=[];
        let len = (start + this.state.listPerPage) > src.length ?
                src.length :
                start + this.state.listPerPage ;

        for(let i=start; i<len; i++) {
            src[i]['checkBox'] = React.createElement(
                                            TargetCheck,
                                            {
                                                isChecked:src[i].isChecked,
                                                setChecked:this.handleCheckBoxClick,
                                                index:src[i].index,
                                            }
                                        );
            viewData.push(src[i]);
        }
        this.setState({viewData});
    }

    getTargetList = () => {
        let targetList = [];
        let data = this.state.volumeList;
        let length = data.length;
        for(let i=0; i < length; i++) {
            if(data[i].isChecked) {
                targetList.push(data[i].id);
            }
        }
        return targetList;
    }

    resetToggle = () => {
        let toggleStatus = false;
        let viewData = cloneDeep(this.state.viewData);
        let volumeList = cloneDeep(this.state.volumeList);
        let len = viewData.length;
        for(let i = 0; i < len; i++)
            volumeList[viewData[i].index].isChecked = toggleStatus;

        this.setState({volumeList, toggleStatus});
    }

    toggleAll = () => {
        let toggleStatus = !this.state.toggleStatus;
        let viewData = cloneDeep(this.state.viewData);
        let volumeList = cloneDeep(this.state.volumeList);
        let len = viewData.length;
        for(let i = 0; i < len; i++)
            volumeList[viewData[i].index].isChecked = toggleStatus;

        this.setState({volumeList, toggleStatus});
        this.filterData(volumeList,
                        this.state.searchGroup,
                        this.state.searchKeyWord);
    }

    callBack = () => {
        this.loadVolumeList(this.props.projectID);
    }

    filterData = (data, searchGroup, searchKeyWord) => {
        let filteredData = [];
        let srcData = data;
        let length = srcData.length;

        if(!searchKeyWord || searchKeyWord=="") {
            this.setState({filteredData:srcData});
            this.pagenate(srcData, this.state.currentPage);
            return;
        }

        for(let i=0; i<length; i++) {
            if(!searchGroup || searchGroup == "") {
                for(let key in srcData[i]) {
                    if( key != "id" &&
                        srcData[i][key] &&
                        srcData[i][key].includes &&
                        srcData[i][key].toLowerCase &&
                        srcData[i][key].toLowerCase().includes(searchKeyWord.toLowerCase())) {
                        filteredData.push(srcData[i]);
                        break;
                    }
                }
            }
            else {
                if(srcData[i][searchGroup].includes(searchKeyWord)) {
                    filteredData.push(srcData[i]);
                }
            }
        }

        let len = filteredData.length;
        this.setState({pageNum:Math.ceil(len/this.state.listPerPage)});
        this.setState({filteredData});
        this.pagenate(filteredData, this.state.currentPage);
        return;
    }

    updateVolumeList = (data) => {
    }

    pollDataUntil = (volumeID, keyName, stateList) => {
        let volumeList = cloneDeep(this.state.volumeList);
        let len = volumeList.length;

        for(let i=0; i<len; i++) {
            if(volumeList[i]['id'] == volumeID) {
                volumeList[i][keyName] = React.createElement('div',{'className':'ui active inline tiny loader center aligned'});
                this.state.volumeList = volumeList;
                this.filterData(volumeList, this.state.searchGroup, this.state.searchKeyWord);
                break;
            }
        }
        (function updateFunction(authToken, projectID, volumeID, keyName, stateList, callBack) {
            return fetch(appRoot+'openstack/'+projectID+'/instancestatus/'+volumeID+'/',{
                method: 'GET',
                headers: {
                    'X-Auth-Token': this.props.authToken,
                },
            })
            .then( (response) => response.json() )
            .then( (data) =>  {
                let i = stateList.indexOf(data[keyName]);
                if(i < 0) {
                    setTimeout(updateFunction, 5000, authToken, projectID, volumeID, keyName, stateList, callBack);
                }
                else {
                    callBack(data);
                }
            })
            .catch( (error) => {
                console.log('updateFunction error : ' + error.message);
            });
        })(this.props.appRoot, this.props.authToken, this.props.projectID, volumeID, keyName, stateList, this.updateVolumeList);
    }


    // Load functions
    loadVolumeList = (projectID) => {
        return fetch(this.props.appRoot+'openstack/'+projectID+'/volumelist/',{
            method: 'GET',
            headers: {
                'X-Auth-Token': this.props.authToken,
            },
        })
        .then( (response) => response.json() )
        .then( (data) =>  {
            let filteredData=data;
            let len=filteredData.length;

            for(let i=0; i<len; i++) {
                let component = React.createElement(
                                    JobButton,
                                    {
                                        appRoot         : this.props.appRoot,
                                        volumeID        : filteredData[i].id,
                                        projectID       : this.state.projectID,
                                        authToken       : this.props.authToken,
                                        instanceList    : this.state.instanceList,
                                        callBack        : this.callBack,
                                        status          : filteredData[i].status,
                                        updateMe        : this.pollDataUntil
                                    }
                                );
                if(filteredData[i]['bootable']=="true")
                    filteredData[i]['bootable'] = '예';
                else
                    filteredData[i]['bootable'] = '아니오';

                if(filteredData[i]['name'] === '' ) {
                    filteredData[i]['name'] = filteredData[i]['id'];
                }
                filteredData[i]['job'] = component;
                filteredData[i]['isChecked'] = false;
                filteredData[i]['index'] = i;
                let timestamp = filteredData[i].created_at;
                timestamp = timestamp.replace("T", " ");
                timestamp = timestamp.substring(0, timestamp.indexOf('.'));
                filteredData[i].created_at = timestamp;
            }
            this.setState({
                            pageNum:Math.ceil(len/this.state.listPerPage),
                            volumeList: filteredData,
                            filteredData: filteredData,
                        });

            this.filterData(filteredData,
                            this.state.searchGroup,
                            this.state.searchKeyWord);
        })
        .catch( (error) => {
            console.log('loadVolumeList error : ' + error.message);
        });
    }

    loadServerList = (projectID) => {
        return fetch(this.props.appRoot+'openstack/'+projectID+'/instancelist/',{
            method: 'GET',
            headers: {
                'X-Auth-Token': this.props.authToken,
            },
        })
        .then( (response) => response.json() )
        .then( (data) =>  {
            this.setState({instanceList:data});
            this.loadVolumeList(projectID);
        })
        .catch( (error) => {
            console.log('loadServerList error : ' + error.message);
        });
    }



    render = () => {
        let columns = this.state.columns;
        columns[0].header.label = React.createElement(
                    ToggleAll,
                    {
                        handleClick:this.toggleAll,
                        toggleStatus:this.state.toggleStatus
                    }
                );

        let instanceSelect = this.state.instanceList.length > 0
            ?
                this.state.instanceList.map(function(instance) {
                    return (
                        <MenuItem   key={instance.id}
                                    primaryText={instance.vmname}
                                    onClick={this.attachMultiVolumes.bind(this, instance.id)}
                        />
                    );
                }.bind(this))
            :
                React.createElement(
                            'div',
                            {className:"item"},
                            "No available instance"
                        );

        return (
            <Flexbox flexDirection="column" alignContent='space-around' padding='10px'>
                <Flexbox    alignContent='flex-start'>
                    <h2>
                        Volume
                    </h2>
                </Flexbox>

                <Flexbox alignItems='center' justifyContent='space-between'>
                    <Flexbox justifyContent='center'>
                        <CreateVolume
                            changeCallBack={this.refreshModal}
                            userID={this.props.userID}
                            authToken={this.props.authToken}
                            projectID={this.state.projectID}
                            appRoot={this.props.appRoot}
                        />
                        &nbsp;
                        <RaisedButton   label="일괄작업"
                                        onTouchTap={this.showVolumeJobMenu}
                        />
                        <Popover    open={this.state.showVolumeJobMenu}
                                    onRequestClose={this.closeVolumeJobMenu}
                                    anchorEl={this.state.volumeJobMenuAnchor}
                                    useLayerForClickAway={true}
                        >
                            <Menu>
                                <MenuItem
                                    primaryText="볼륨 연결"
                                    menuItems={instanceSelect}
                                />
                                <MenuItem
                                    primaryText="볼륨 연결 해제"
                                    onClick={this.detachMultiVolumes}
                                />
                                <MenuItem
                                        primaryText="볼륨 삭제"
                                        onClick={this.deleteMultiVolumes}
                                />
                            </Menu>
                        </Popover>
                    </Flexbox>
                    <Flexbox>
                        <DropDownMenu
                                value={this.state.searchGroup}
                                onChange={this.handleSelectSearchGroupChange}
                        >
                            <MenuItem value="" primaryText="전체"/>
                            <MenuItem value="name" primaryText="볼륨 이름"/>
                            <MenuItem value="volume_type" primaryText="볼륨 타입"/>
                            <MenuItem value="created_at" primaryText="생성일"/>
                            <MenuItem value="size" primaryText="크기"/>
                            <MenuItem value="status" primaryText="상태"/>
                            <MenuItem value="bootable" primaryText="부트가능"/>
                        </DropDownMenu>
                        <TextField  id="searchField"
                                    hintText="Search keyword"
                                    value={this.state.searchKeyWord}
                                    onChange={this.handleKeyWordChange}
                        />
                    </Flexbox>
                </Flexbox>

                <Flexbox alignContent='stretch' alignSelf='stretch'>
                    <MaterialTable  columns={columns}
                                    rows={this.state.viewData}
                    />
                </Flexbox>

                <Flexbox alignContent='space-around' alignItems='center' alignSelf='center'>
                    <Pagination current={this.state.currentPage}
                                total={this.state.pageNum}
                                display={this.state.listPerPage}
                                onChange={this.handlePageClick}
                    />
                    <DropDownMenu   label="페이지 당 표시 개수"
                                    value={this.state.listPerPage}
                                    onChange={this.handleListPerPageChange}
                    >
                            <MenuItem value={5} primaryText="5"/>
                            <MenuItem value={10} primaryText="10"/>
                            <MenuItem value={50} primaryText="50"/>
                            <MenuItem value={100} primaryText="100"/>
                            <MenuItem value={500} primaryText="500"/>
                    </DropDownMenu>
                </Flexbox>
            </Flexbox>
        );
    }
};
// Render your table

const mapStateToProps = (state) => {
    return {
        appRoot         : state.appRoot,
        userID          : state.userID,
        authToken       : state.authToken,
        projectID       : state.projectID,
        logoutHandler   : state.logoutHandler
    }
}

export default connect(mapStateToProps)(VolumeTable);
