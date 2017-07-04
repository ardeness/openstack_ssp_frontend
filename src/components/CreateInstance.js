import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import {blue500} from 'material-ui/styles/colors';
import Snackbar from 'material-ui/Snackbar';

import Flexbox from 'flexbox-react';

import {SubmitButton} from './Grossary';

class CreateInstance extends React.Component {

    // Life-cycle functions
    constructor(props){
        super(props);
        this.state = {
            oszone          : '',
            vmname          : '',
            flavor          : '',
            image           : '',
            secgroup        : '',
            network         : '',
            osvolumesize    : 50,
            keypair         : '',
            volumetype      : '',
            floatingip      : '',

            oszoneList      : [],
            networkList     : [],
            volumetypeList  : [],
            flavorList      : [],
            secgroupList    : [],
            imageList       : [],
            keypairList     : [],
            floatingipList  : [],

            showCreateInstance  : false,
            snackbarOpen        : false,
            snackbarMessage     : '',
        };
    }

    componentDidMount = () => {
        if(this.props.projectID && this.props.projectID != "") {
            let projectID = this.props.projectID;

            this.setState({
                oszone          : '',
                vmname          : '',
                flavor          : '',
                image           : '',
                secgroup        : '',
                network         : '',
                floatingip      : '',
                osvolumesize    : 50,
                keypair         :'',
                volumetype      :''
            });

            this.loadOSAvailabilityZoneList(projectID);
            this.loadNetworkList(projectID);
            this.loadVolumeTypeList(projectID);
            this.loadFlavorList(projectID);
            this.loadSecgroupList(projectID);
            this.loadImageList(projectID);
            this.loadKeypairList(projectID);
            this.loadFloatingIPList(projectID);
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if(this.props.projectID != nextProps.projectID) {
            let projectID = nextProps.projectID;

            this.setState({
                oszone          : '',
                vmname          : '',
                flavor          : '',
                image           : '',
                secgroup        : '',
                network         : '',
                floatingip      : '',
                osvolumesize    : 50,
                keypair         :'',
                volumetype      :''
            });

            this.loadOSAvailabilityZoneList(projectID);
            this.loadNetworkList(projectID);
            this.loadVolumeTypeList(projectID);
            this.loadFlavorList(projectID);
            this.loadSecgroupList(projectID);
            this.loadImageList(projectID);
            this.loadKeypairList(projectID);
            this.loadFloatingIPList(projectID);
        }
    }

    // Event handling functions

    handleOpen = () => {
        this.setState({showCreateInstance:true});
    }

    handleClose = () => {
        this.setState({showCreateInstance:false})
    }

    handleVMNameChange = (e) => {
        this.setState({vmname:e.target.value});
    }

    handleOSZoneChange = (e, index, value) => {
        this.setState({oszone:value});
    }

    handleVolumeSizeChange = (e) => {
        this.setState({osvolumesize:e.target.value});
    }

    handleFlavorChange = (e, index, value) => {
        this.setState({flavor:value});
    }

    handleVolumeTypeChange = (e, index, value) => {
        this.setState({volumetype:value});
    }

    handleImageChange = (e, index, value) => {
        this.setState({image:value});
    }

    handleNetworkChange = (e, index, value) => {
        this.setState({network:value});
    }

    handleSecgroupChange = (e, index, value) => {
        this.setState({secgroup:value});
    }

    handleKeypairChange = (e, index, value) => {
        this.setState({keypair:value});
    }

    handleFloatingIpChange = (e, index, value) => {
        this.setState({floatingip:value});
    }

    isCorrect = () => {
        if( this.state.oszone       == '' ||
            this.state.vmname       == '' ||
            this.state.volumetype   == '' ||
            this.state.image        == '' ||
            this.state.flavor       == '' ||
            this.state.osvolumesize == 0  ||
            this.state.network      == '' ||
            this.state.secgroup     == '')
            return false;

        return true;
    }

    handleSubmit = () => {
        //console.log("handleSubmit");
        if(!this.isCorrect()) {
            return false;
        }

        let submitdata = {};
        submitdata["oszone"]        = this.state.oszone;
        submitdata["name"]          = this.state.vmname;
        submitdata["volumetype"]    = this.state.volumetype;
        submitdata["image"]         = this.state.image;
        submitdata["flavor"]        = this.state.flavor;
        submitdata["size"]          = this.state.osvolumesize;
        submitdata["network"]       = this.state.network;
        submitdata["secgroup"]      = this.state.secgroup;

        if(this.state.keypair != '') {
            submitdata["keypair"]   = this.state.keypair;
        }

        if(this.state.floatingip != '') {
            submitdata["floatingip"]= this.state.floatingip;
        }

        this.requestCreateInstance(submitdata);
        return true;
    }

    requestCreateInstance = (data) => {
        data["projectID"] = this.props.projectID;

        /*
        let job = JSON.stringify(data);
        let approvalData={};

        approvalData['userID']      = this.props.userID;
        approvalData['projectID']   = this.props.projectID;
        approvalData['job']         = job;
        approvalData['state']       = 'wait';
        approvalData['resourceURL'] = 'createvm';
        */
        return fetch(this.props.appRoot+'openstack/'+this.props.projectID+'/createvm/',{
            method: 'POST',
            headers: {
                'X-Auth-Token': this.props.authToken,
            },
            body : JSON.stringify(data)
        })
        .then( (response) => response.json() )
        .then( (data) =>  {
            this.handleClose();
        })
        .catch( (error) => {
            this.setState({snackbarMessage:"Failed to create instance", snackbarOpen:true});
        });
    }

    requestSnackbarClose = () => {
        this.setState({snackbarOpen:false});
    }



    // Load functions
    loadNetworkList = (projectID) => {
        return fetch(this.props.appRoot+'openstack/'+projectID+'/networklist/',{
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
            this.setState({networkList:data});
        })
        .catch( (error) => {
            console.log('loadNetworkList : ' + error.message);
        });
    }

    loadFlavorList = (projectID) => {
        return fetch(this.props.appRoot+'openstack/'+projectID+'/flavorlist/',{
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
            this.setState({flavorList:data});
        })
        .catch( (error) => {
            console.log('loadFlavorList : ' + error.message);
        });
    }

    loadSecgroupList = (projectID) => {
        return fetch(this.props.appRoot+'openstack/'+projectID+'/secgrouplist/',{
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
            this.setState({secgroupList:data});
        })
        .catch( (error) => {
            console.log('loadSecgroupList : ' + error.message);
        });
    }

    loadImageList = (projectID) => {
        return fetch(this.props.appRoot+'openstack/'+projectID+'/imagelist/',{
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
            this.setState({imageList:data});
        })
        .catch( (error) => {
            console.log('loadImageList : ' + error.message);
        });
    }

    loadKeypairList = (projectID) => {
        return fetch(this.props.appRoot+'openstack/'+projectID+'/keypairlist/',{
            method: 'GET',
            headers: {
                'X-Auth-Token': this.props.authToken,
            }
        })
        .then( (response) => response.json() )
        .then( (data) =>  {
            data.sort(function(a, b) {
                if(a.keypair.name > b.keypair.name) return 1;
                if(a.keypair.name < b.keypair.name) return -1;
                return 0;
            });
            this.setState({keypairList:data});
        })
        .catch( (error) => {
            console.log('loadKeypairList : ' + error.message);
        });
    }

    loadOSAvailabilityZoneList = (projectID) => {
        return fetch(this.props.appRoot+'openstack/'+projectID+'/osavailzonelist/',{
            method: 'GET',
            headers: {
                'X-Auth-Token': this.props.authToken,
            }
        })
        .then( (response) => response.json() )
        .then( (data) =>  {
            data.sort(function(a, b) {
                if(a.zoneName > b.zoneName) return 1;
                if(a.zoneName < b.zoneName) return -1;
                return 0;
            });
            this.setState({oszoneList:data});
        })
        .catch( (error) => {
            console.log('loadOSAvailabilityZoneList : ' + error.message);
        });
    }

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
            this.setState({volumetypeList:data});
        })
        .catch( (error) => {
            console.log('loadVolumeTypeList : ' + error.message);
        });
    }

    loadFloatingIPList = (projectID) => {
        return fetch(this.props.appRoot+'openstack/'+projectID+'/floatingiplist/',{
            method: 'GET',
            headers: {
                'X-Auth-Token': this.props.authToken,
            }
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
            this.setState({floatingipList:data});
        })
        .catch( (error) => {
            console.log('loadFloatingIPList : ' + error.message);
        });
    }


    render(){

        const actions=[
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleClose}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                onTouchTap={this.handleSubmit}
            />
        ];

        return(
            <Flexbox>
                <RaisedButton label="인스턴스 생성" onTouchTap={this.handleOpen}/>
                <Dialog title="Instance 생성 정보"
                        actions={actions}
                        modal={true}
                        open={this.state.showCreateInstance}
                >
                    <Flexbox flexDirection="column">
                        <h4>VM Information</h4>
                        <Divider/>
                    </Flexbox>
                    <Flexbox>
                        <DropDownMenu   value={this.state.oszone}
                                        onChange={this.handleOSZoneChange}
                        >
                                <MenuItem value='' primaryText="OS Availability Zone"/>
                                {this.state.oszoneList.map((oszone) =>
                                    <MenuItem   key={oszone.zoneName}
                                                value={oszone.zoneName}
                                                primaryText={oszone.zoneName}
                                    />)
                                }
                        </DropDownMenu>

                        <TextField  hintText="VM Name"
                                    value={this.state.vmname}
                                    onChange={this.handleVMNameChange}
                        />

                        <DropDownMenu   value={this.state.flavor}
                                        onChange={this.handleFlavorChange}
                        >
                                <MenuItem value='' primaryText="Flavor"/>
                                {this.state.flavorList.map((flavor) =>
                                    <MenuItem   key={flavor.id}
                                                value={flavor.name}
                                                primaryText={flavor.name}
                                    />)
                                }
                        </DropDownMenu>
                    </Flexbox>

                    <Flexbox flexDirection="column">
                        <h4>Volume Information</h4>
                        <Divider/>
                    </Flexbox>
                    <Flexbox>
                        <DropDownMenu   value={this.state.volumetype}
                                        onChange={this.handleVolumeTypeChange}
                        >
                            <MenuItem value='' primaryText="Volume Type"/>
                            {this.state.volumetypeList.map((volumetype) =>
                                    <MenuItem   key={volumetype.name}
                                                value={volumetype.name}
                                                primaryText={volumetype.name}
                                    />)
                            }
                        </DropDownMenu>

                        <DropDownMenu   value={this.state.image}
                                        onChange={this.handleImageChange}
                        >
                            <MenuItem value='' primaryText="OS Image"/>
                            {this.state.imageList.map((image) =>
                                <MenuItem   key={image.id}
                                            value={image.name}
                                            primaryText={image.name}
                                />)
                            }
                        </DropDownMenu>

                        <TextField  value={this.state.osvolumesize}
                                    onChange={this.handleVolumeSizeChange}
                                    errorText="OS Volume Size in GByte"
                                    errorStyle={{color:blue500}}
                        />
                    </Flexbox>

                    <Flexbox flexDirection="column">
                        <h4>Connection Information</h4>
                        <Divider/>
                    </Flexbox>
                    <Flexbox>
                        <DropDownMenu   value={this.state.network}
                                        onChange={this.handleNetworkChange}
                        >
                            <MenuItem   value='' primaryText="Network"/>
                            {this.state.networkList.map((network) =>
                                <MenuItem   key={network.name}
                                            value={network.name}
                                            primaryText={network.name}
                                />)
                            }
                        </DropDownMenu>

                        <DropDownMenu   value={this.state.secgroup}
                                        onChange={this.handleSecgroupChange}
                        >
                            <MenuItem   value='' primaryText="Security Group"/>
                            {this.state.secgroupList.map((secgroup) =>
                                <MenuItem   key={secgroup.id}
                                            value={secgroup.id}
                                            primaryText={secgroup.name}
                                />)
                            }
                        </DropDownMenu>

                        <DropDownMenu   value={this.state.keypair}
                                        onChange={this.handleKeypairChange}
                        >
                            <MenuItem   value='' primaryText="Keypair"/>
                            {this.state.keypairList.map((keypair) =>
                                <MenuItem   key={keypair.keypair.fingerprint}
                                            value={keypair.keypair.name}
                                            primaryText={keypair.keypair.name}
                                />)
                            }
                        </DropDownMenu>

                        <DropDownMenu   value={this.state.floatingip}
                                        onChange={this.handleFloatingIpChange}
                        >
                            <MenuItem   value='' primaryText="Floating IP"/>
                            {this.state.floatingipList.map((floatingip) =>
                                <MenuItem   key={floatingip.id}
                                            value={floatingip.floating_ip_address}
                                            primaryText={floatingip.floating_ip_address}
                                />)
                            }
                        </DropDownMenu>
                    </Flexbox>
                    <Flexbox>
                        <Snackbar   open={this.state.snackbarOpen}
                                    message={this.state.snackbarMessage}
                                    autoHideDuration={4000}
                                    onRequestClose={this.requestSnackbarClose}
                        />
                    </Flexbox>
                </Dialog>
            </Flexbox>
        );
    }
};

export default CreateInstance;
