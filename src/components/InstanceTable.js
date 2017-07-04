import React from 'react';
import {TopMenu, SideMenu, TargetCheck, ToggleAll} from './Grossary';
//import {Table} from 'reactabular';
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

import CreateInstance from './CreateInstance';
import MaterialTable from './MaterialTable';

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
        property: 'vmname',
        header: {
            label: 'Name'
        },
        style: {
            width: '15%'
        }
    },
    {
        property: 'flavor',
        header: {
            label: 'Flavor'
        },
        style: {
            width: '5%'
        }
    },
    {
        property: 'IP',
        header: {
            label: 'IP'
        },
        style: {
            width: '20%'
        }
    },
    {
        property: 'availzone',
        header: {
            label: 'Zone',
        },
        style: {
            width: '5%'
        }
    },
    {
        property: 'vmstate',
        header: {
            label: 'Status',
        },
        style: {
            width: '5%'
        }
    },
    {
        property: 'job',
        header: {
            label: 'Job',
        },
        style: {
            width: '5%'
        }
    }
];



class JobButton extends React.Component{

    // Event handling functions
    allocFloatingIP = (ipaddress, e) => {
        if(e) e.preventDefault();

        let actionData = {};
        let sourceID = [];
        let targetID = this.props.vmID;

        sourceID.push(ipaddress);
        actionData['sourceID'] = sourceID;
        actionData['targetID'] = targetID;
        actionData['action'] = 'addfloatingip';

        let keyName = 'floatingIp';
        let stateList = sourceID;

        return fetch(this.props.appRoot+'openstack/'+this.props.projectID+'/action/',{
            method: 'PUT',
            headers: {
                'X-Auth-Token': this.props.authToken,
            },
            body: JSON.stringify(actionData)
        })
        .then( (response) => response.json() )
        .then( (data) =>  {
            this.props.updateMe(this.props.vmID, keyName, stateList);
            this.props.refreshFloatingIP();
        })
        .catch( (error) => {
            console.log('action error : ' + error.message);
        });
    }

    deallocFloatingIP = (ipaddress, e) => {
        if(e) e.preventDefault();

        let actionData = {};
        let sourceID = [];
        let targetID = this.props.vmID;

        sourceID.push(ipaddress);
        actionData['sourceID'] = sourceID;
        actionData['targetID'] = targetID;
        actionData['action'] = 'removefloatingip';

        let keyName = 'floatingIp';
        let stateList = [''];

        return fetch(this.props.appRoot+'openstack/'+this.props.projectID+'/action/',{
            method: 'PUT',
            headers: {
                'X-Auth-Token': this.props.authToken,
            },
            body: JSON.stringify(actionData)
        })
        .then( (response) => response.json() )
        .then( (data) =>  {
            this.props.updateMe(this.props.vmID, keyName, stateList);
            this.props.refreshFloatingIP();
        })
        .catch( (error) => {
            console.log('action error : ' + error.message);
        });

    }

    handleClick = (action, e) => {
        if(e) e.preventDefault();
        let actionData = {};
        let sourceID = [];
        let targetID = '';

        sourceID.push(this.props.vmID);
        actionData['sourceID'] = sourceID;
        actionData['targetID'] = targetID;
        actionData['action'] = action;

        let keyName = '';
        let stateList = '';

        if(action == 'start') {
            keyName = 'vmstate';
            stateList = ['active', 'error'];
        }
        else if(action == 'stop') {
            keyName = 'vmstate';
            stateList = ['stopped', 'error'];
        }
        else if(action == 'rebootsoft') {
            keyName = 'vmstate';
            stateList = ['stopped', 'error'];
        }
        else if(action == 'reboothard') {
            keyName = 'vmstate';
            stateList = ['stopped', 'error'];
        }
        else if(action == 'deleteserver') {
            keyName = 'vmstate';
            stateList = ['stopped', 'error'];
        }

        return fetch(this.props.appRoot+'openstack/'+this.props.projectID+'/action/',{
            method: 'PUT',
            headers: {
                'X-Auth-Token': this.props.authToken,
            },
            body: JSON.stringify(actionData)
        })
        .then( (response) => response.json() )
        .then( (data) =>  {
            this.props.updateMe(this.props.vmID, keyName, stateList);
        })
        .catch( (error) => {
            console.log('action error : ' + error.message);
        });
    }

    showConsole = () => {
        window.open(this.props.console);
    }


    render = () => {
        let floatingIPSelect = this.props.floatingIPList.length > 0
        ?
            this.props.floatingIPList.map(function(floatingIP) {
            return (
                <MenuItem   key={floatingIP.floating_ip_address}
                            primaryText={floatingIP.floating_ip_address}
                            onClick={this.allocFloatingIP.bind(this,
                                floatingIP.floating_ip_address)}
                />
            );
        }.bind(this))
        :
        React.createElement(
                        MenuItem,
                        {primaryText:"No available floating ip"}
                    );

        return (
            <IconMenu
                iconButtonElement={<IconButton><ExtensionIcon/></IconButton>}
                useLayerForClickAway={true}
            >
                <MenuItem   primaryText="Remote console"
                            onClick={this.showConsole}
                />

            { this.props.hasFloatingIP
            ?
                <MenuItem   primaryText="Floating IP 해제"
                            onClick={this.deallocFloatingIP.bind(
                                        this,this.props.floatingIP)}
                />
                :
                <MenuItem   primaryText="Floating IP 연결"
                            rightIcon={<ArrowDropRight/>}
                            menuItems={floatingIPSelect}
                />
            }
                <MenuItem   primaryText="Test"
                            onClick={this.deallocFloatingIP.bind(
                                        this,this.props.floatingIP)}
                />
                <MenuItem   primaryText="Power On"
                            onClick={this.handleClick.bind(this, "start")}
                />
                <MenuItem   primaryText="Power Off"
                            onClick={this.handleClick.bind(this, "stop")}
                />
                <MenuItem   primaryText="Reboot (Soft)"
                            onClick={this.handleClick.bind(this, "rebootsoft")}
                />
                <MenuItem   primaryText="Reboot (Hart)"
                            onClick={this.handleClick.bind(this, "reboothard")}
                />
                <MenuItem   primaryText="인스턴스 삭제"
                            onClick={this.handleClick.bind(this, "deleteserver")}
                />
            </IconMenu>
        );
    }
};

class InstanceTable extends React.Component{

    // Life-cycle functions
    constructor(props) {
        super(props);
        this.state = {
            toggleStatus    : false,
            columns         : columns,
            instanceList    : [],
            floatingIPList  : [],
            instanceSearch  : "",
            projectList     : {},
            projectID       : "",
            filteredData    : [],
            viewData        : [],
            pageNum         : 0,
            listPerPage     : 10,
            currentPage     : 1,
            searchGroup     : '',
            searchKeyWord   : '',
            updateList      : {},

            showInstanceJobMenu     : false,
            instanceJobMenuAnchor   : null,
        };
    }

    componentDidMount = () => {
        //$('#createvm').popup({inline:false, hoverable: false, on: 'click'});
        //$('#createvm').modal('hide');

        this.setState({projectID:this.props.projectID, projectList:this.props.projectList});
        this.loadFloatingIPList(this.props.projectID);
        this.resetToggle();
    }

    componentWillReceiveProps = (nextProps) => {
        if(this.props != nextProps) {
            this.setState({projectID:nextProps.projectID,projectList:nextProps.projectList});
            //this.loadServerList(nextProps.projectID);
            this.loadFloatingIPList(nextProps.projectID);
            this.resetToggle();
        }
    }

    componentDidUpdate = () => {
        //$('.dropdown').dropdown();
    }



    // Event handling functions
    resetToggle = (e) => {
        if(e && e.preventDefault) e.preventDefault;

        let toggleStatus = false;
        let viewData = cloneDeep(this.state.viewData);
        let instanceList = cloneDeep(this.state.instanceList);
        let len = viewData.length;

        for(let i = 0; i < len; i++) {
            instanceList[viewData[i].index].isChecked = toggleStatus;
        }
        this.setState({instanceList, toggleStatus});
        //this.pagenate(instanceList, this.state.currentPage);
        this.filterData(instanceList,
                        this.state.searchGroup,
                        this.state.searchKeyWord);
    }

    toggleAll = (e) => {
        if(e && e.preventDefault) e.preventDefault;

        let toggleStatus = !this.state.toggleStatus;
        let viewData = cloneDeep(this.state.viewData);
        let instanceList = cloneDeep(this.state.instanceList);
        let len = viewData.length;
        for(let i = 0; i < len; i++)
            instanceList[viewData[i].index].isChecked = toggleStatus;

        this.setState({instanceList,toggleStatus});
        this.filterData(instanceList,
                        this.state.searchGroup,
                        this.state.searchKeyWord);
    }

    handlePageClick = (pageIndex, e) => {
        if(e && e.preventDefault) e.preventDefault;

        this.resetToggle();
        this.setState({currentPage:pageIndex});
        this.pagenate(this.state.filteredData, pageIndex);
    }

    handleCheckBoxClick = (index, isChecked, e) => {
        if(e && e.preventDefault) e.preventDefault;

        let instanceList = cloneDeep(this.state.instanceList);
        instanceList[index].isChecked = isChecked;

        //this.pagenate(instanceList, this.state.currentPage);
        this.setState({instanceList});
        this.filterData(instanceList, this.state.searchGroup, this.state.searchKeyWord);
    }

    handleListPerPageChange = (e, index, value) => {
        let listPerPage = Number(value);
        let len = this.state.filteredData.length;
        if(listPerPage < 1) listPerPage = 1;
        this.state.listPerPage = listPerPage;
        this.setState({pageNum:Math.ceil(len/listPerPage), currentPage: 1});
        this.pagenate(this.state.filteredData, 1);
    }

    handleJob = (action) => {
        let sourceID = this.getTargetList();
        let actionData = {};
        let targetID = '';

        actionData['sourceID'] = sourceID;
        actionData['targetID'] = targetID;
        actionData['action'] = action;

        let keyName = '';
        let stateList = '';

        if(action == 'start') {
            keyName = 'vmstate';
            stateList = ['active', 'error'];
        }
        else if(action == 'stop') {
            keyName = 'vmstate';
            stateList = ['stopped', 'error'];
        }
        else if(action == 'rebootsoft') {
            keyName = 'vmstate';
            stateList = ['stopped', 'error'];
        }
        else if(action == 'reboothard') {
            keyName = 'vmstate';
            stateList = ['stopped', 'error'];
        }
        else if(action == 'deleteserver') {
            keyName = 'vmstate';
            stateList = ['stopped', 'error'];
        }

        this.resetToggle();

        return fetch(this.props.appRoot+'openstack/'+this.props.projectID+'/action/',{
            method: 'PUT',
            headers: {
                'X-Auth-Token': this.props.authToken,
            },
            body: JSON.stringify(actionData)
        })
        .then( (response) => response.json() )
        .then( (data) =>  {
            let len = sourceID.length;
            for(let i=0; i<len; i++) {
                this.pollDataUntil(sourceID[i], keyName, stateList);
            }
        })
        .catch( (error) => {
            console.log('action error : ' + error.message);
        });
    }

    handleSelectSearchGroupChange = (e, index, value) => {
        if(e && e.preventDefault) e.preventDefault();
        let searchGroup = value;
        this.setState({searchGroup:value});
        this.filterData(this.state.instanceList, searchGroup, this.state.searchKeyWord);
    }

    handleKeyWordChange = (e) => {
        if(e && e.preventDefault) e.preventDefault();
        let searchKeyWord = e.target.value;
        this.setState({searchKeyWord});
        this.filterData(this.state.instanceList, this.state.searchGroup, searchKeyWord);
    }

    showInstanceJobMenu = (e) => {
        this.setState({
            showInstanceJobMenu:true,
            instanceJobMenuAnchor:e.currentTarget
        });
    }

    closeInstanceJobMenu = () => {
        this.setState({showInstanceJobMenu:false});
    }




    // Utility functions
    pagenate = (data, currentPage) => {
        let pagenum = currentPage - 1;
        if(pagenum < 0) pagenum = 0;
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
        let data = this.state.viewData; //this.state.instanceList;
        let length = data.length;
        for(let i=0; i < length; i++) {
            if(data[i].isChecked) {
                targetList.push(data[i].id);
            }
        }
        return targetList;
    }

    refreshFloatingIPList = () => {
            this.loadFloatingIPList(this.props.projectID);
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

    updateInstanceList = (data) => {
        let instanceList = cloneDeep(this.state.instanceList);
        let len = instanceList.length;
        for(let i=0; i<len; i++) {
            if(instanceList[i]['id'] == data['id']) {
                //instanceList[i] = data;

                data['hasFloatingIP'] = false;
                if(data['floatingIp']) {
                    data['IP'] = data['IP'] + ' / ' +
                                 data['floatingIp'];
                    data['hasFloatingIP'] = true;
                }
                let component = React.createElement(JobButton, {
                        vmID                : data['id'],
                        projectID           : this.props.projectID,
                        authToken           : this.props.authToken,
                        hasFloatingIP       : data['hasFloatingIP'],
                        floatingIP          : data['floatingIp'],
                        floatingIPList      : this.state.floatingIPList,
                        refreshFloatingIP   : this.refreshFloatingIPList,
                        refreshInstanceList : this.loadServerList,
                        console             : data['console'],
                        updateMe            : this.pollDataUntil
                        });

                data['job']          = component;
                data['isChecked']    = false;
                data['index']        = i;

                instanceList[i] = data;

                this.state.instanceList = instanceList;
                this.filterData(instanceList, this.state.searchGroup, this.state.searchKeyWord);

                break;
            }
        }
    }

    pollDataUntil = (vmID, keyName, stateList) => {
        let instanceList = cloneDeep(this.state.instanceList);
        let len = instanceList.length;

        for(let i=0; i<len; i++) {
            if(instanceList[i]['id'] == vmID) {
                instanceList[i][keyName] = React.createElement('div',{'className':'ui active inline tiny loader center aligned'});
                this.state.instanceList = instanceList;
                this.filterData(instanceList, this.state.searchGroup, this.state.searchKeyWord);
                break;
            }
        }
        (function updateFunction(appRoot, authToken, projectID, vmID, keyName, stateList, callBack) {
            return fetch(appRoot+'openstack/'+projectID+'/instancestatus/'+vmID+'/',{
                method: 'GET',
                headers: {
                    'X-Auth-Token': this.props.authToken,
                },
            })
            .then( (response) => response.json() )
            .then( (data) =>  {
                let i = stateList.indexOf(data[keyName]);
                if(i < 0) {
                    setTimeout(updateFunction, 5000, authToken, projectID, vmID, keyName, stateList, callBack);
                }
                else {
                    callBack(data);
                }
            })
            .catch( (error) => {
                console.log('updateFunction error : ' + error.message);
            });
        })(this.props.appRoot, this.props.authToken, this.props.projectID, vmID, keyName, stateList, this.updateInstanceList);
    }


    // Load functions
    loadServerList = (projectID) => {
        return fetch(this.props.appRoot+'openstack/'+projectID+'/instancelist/',{
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
                filteredData[i]['hasFloatingIP'] = false;
                if(filteredData[i]['floatingIp']) {
                    filteredData[i]['IP'] = filteredData[i]['IP'] + ' / ' +
                                            filteredData[i]['floatingIp'];
                    filteredData[i]['hasFloatingIP'] = true;
                }
                let component = React.createElement(JobButton, {
                        appRoot             :this.props.appRoot,
                        vmID                :filteredData[i].id,
                        projectID           :projectID,
                        authToken           :this.props.authToken,
                        hasFloatingIP       :filteredData[i]['hasFloatingIP'],
                        floatingIP          :filteredData[i]['floatingIp'],
                        floatingIPList      :this.state.floatingIPList,
                        refreshFloatingIP   :this.refreshFloatingIPList,
                        refreshInstanceList :this.loadServerList,
                        console             :filteredData[i]['console'],
                        updateMe            :this.pollDataUntil
                        });

                filteredData[i]['job']          = component;
                filteredData[i]['isChecked']    = false;
                filteredData[i]['index']        = i;
            }
            this.setState({
                            pageNum:Math.ceil(len/this.state.listPerPage),
                            instanceList: filteredData,
                            filteredData: filteredData
                        });
            this.filterData(filteredData, this.state.searchGroup, this.state.searchKeyWord);
        })
        .catch( (error) => {
            console.log('loadServerList error : ' + error.message);
        });
    }

    loadFloatingIPList = (projectID) => {
        return fetch(this.props.appRoot+'openstack/'+projectID+'/floatingiplist/',{
            method: 'GET',
            headers: {
                'X-Auth-Token': this.props.authToken,
            },
        })
        .then( (response) => response.json() )
        .then( (data) =>  {
            data.sort(function(a, b) {
                let ip_a = a.floating_ip_address.split(".");
                let ip_b = b.floating_ip_address.split(".");

                let resulta = ip_a[0]*0x1000000 + ip_a[1]*0x10000 + ip_a[2]*0x100 + ip_a[3]*1;
                let resultb = ip_b[0]*0x1000000 + ip_b[1]*0x10000 + ip_b[2]*0x100 + ip_b[3]*1;
                return resulta - resultb;
            });
            this.setState({floatingIPList:data});
            this.loadServerList(projectID);
        })
        .catch( (error) => {
            console.log('loadFloatingIPList error : ' + error.message);
        });
    }



    render = () => {
        console.log(this.props);
        let columns = this.state.columns;

        columns[0].header.label = React.createElement(ToggleAll, {
                                    handleClick     :this.toggleAll,
                                    toggleStatus    :this.state.toggleStatus
                                });


        return (
            <Flexbox flexDirection="column" alignContent='space-around' padding='10px'>
                <Flexbox    alignContent='flex-start'>
                    <h2>
                        Instance
                    </h2>
                </Flexbox>

                <Flexbox alignItems='center' justifyContent='space-between'>
                    <Flexbox justifyContent='center'>
                        <CreateInstance userID={this.props.userID}
                                        authToken={this.props.authToken}
                                        projectID={this.props.projectID}
                                        appRoot={this.props.appRoot}
                        />
                        &nbsp;
                        <RaisedButton   label="일괄작업"
                                        onTouchTap={this.showInstanceJobMenu}
                        />
                        <Popover    open={this.state.showInstanceJobMenu}
                                    onRequestClose={this.closeInstanceJobMenu}
                                    anchorEl={this.state.instanceJobMenuAnchor}
                        >
                            <Menu>
                                <MenuItem
                                    primaryText="Power On"
                                    onClick={this.handleJob.bind(this, "start")}
                                />
                                <MenuItem
                                    primaryText="Power Off"
                                    onClick={this.handleJob.bind(this, "stop")}
                                />
                                <MenuItem
                                        primaryText="Reboot (soft)"
                                        onClick={this.handleJob.bind(this, "rebootsoft")}
                                />
                                <MenuItem
                                        primaryText="Reboot (Hard)"
                                        onClick={this.handleJob.bind(this, "reboothard")}
                                />
                            </Menu>
                        </Popover>
                    </Flexbox>
                    <Flexbox>
                        <DropDownMenu
                                value={this.state.searchGroup}
                                onChange={this.handleSelectSearchGroupChange}
                                style={{display:'inline-block'}}
                        >
                            <MenuItem value="" primaryText="전체"/>
                            <MenuItem value="vmname" primaryText="인스턴스 이름"/>
                            <MenuItem value="IP" primaryText="IP"/>
                            <MenuItem value="availZone" primaryText="Zone"/>
                            <MenuItem value="vmstate" primaryText="상태"/>
                        </DropDownMenu>
                        <TextField  id="searchField"
                                    hintText="Search keyword"
                                    value={this.state.searchKeyWord}
                                    onChange={this.handleKeyWordChange}
                                    style={{display:'inline-block'}}
                        />
                    </Flexbox>
                </Flexbox>

                <Flexbox justifyContent='space-between'>
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

const mapStateToProps = (state) => {
    return {
        appRoot         : state.appRoot,
        userID          : state.userID,
        authToken       : state.authToken,
        projectID       : state.projectID,
        logoutHandler   : state.logoutHandler
    }
}

export default connect(mapStateToProps)(InstanceTable);
