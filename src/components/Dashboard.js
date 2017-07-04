import React from 'react';
import {TopMenu, SideMenu} from './Grossary';
import CreateInstance from './CreateInstance';
import CreateVolume from './CreateVolume';
import ResourceRequestTable from './ResourceRequestTable';
import cloneDeep from 'lodash/cloneDeep';
import { connect } from 'react-redux';
import { Doughnut } from 'react-chartjs-2';

import Flexbox from 'flexbox-react';

import Divider from 'material-ui/Divider';
import { GridList, GridTile } from 'material-ui/GridList';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import DashboardIcon from 'material-ui/svg-icons/action/dashboard';



const chartColorSet = {
    instance: {
        use : {
            color:'#3498DB',
            highlight:'#5CB1DB',
        },
        avail : {
            color: "#ddd",
            highlight: "#e7e7e7",
        }
    },
    vcpu: {
        use : {
            color:'#3498DB',
            highlight:'#5CB1DB',
        },
        avail : {
            color: "#ddd",
            highlight: "#e7e7e7",
        }
    },
    memory: {
        use : {
            color: "#3498DB",
            highlight: "#5CB1DB",
        },
        avail : {
            color: "#ddd",
            highlight: "#e7e7e7",
        }
    },
    floatingIP: {
        use : {
            color: "#3498DB",
            highlight: "#5CB1DB",
        },
        avail : {
            color: "#ddd",
            highlight: "#e7e7e7",
        }
    },
    securityGroup: {
        use : {
            color: "#3498DB",
            highlight: "#5CB1DB",
        },
        avail : {
            color: "#ddd",
            highlight: "#e7e7e7",
        }
    },
    volumeCount: {
        use : {
            color: "#3498DB",
            highlight: "#5CB1DB",
        },
        avail : {
            color: "#ddd",
            highlight: "#e7e7e7",
        }
    },
    volumeSize: {
        use : {
            color: "#3498DB",
            highlight: "#5CB1DB",
        },
        avail : {
            color: "#ddd",
            highlight: "#e7e7e7",
        }
    }
};

const chartOptions = {
    responsive: false,
    maintainAspectRatio: true,
    animationSteps : 30,
    elements: {
        arc : {
            borderWidth : 0
        }
    }
};

const initialData = {
    instance        : { use : 0, quota : 0},
    vcpu            : { use : 0, quota : 0},
    memory          : { use : 0, quota : 0},
    floatingIp      : { use : 0, quota : 0},
    security_group  : { use : 0, quota : 0},
    volume          : { use : 0, quota : 0},
    volume_storage  : { use : 0, quota : 0}
};

const initialInstanceData = {
    labels: [
        'Used',
        'Available'
    ],
    datasets: [{
        data:[10,20],
        backgroundColor: [
            chartColorSet.instance.use.color,
            chartColorSet.instance.avail.color,
        ],
        hoverBackgroundColor: [
            chartColorSet.instance.use.highlight,
            chartColorSet.instance.avail.highlight,
        ]
    }]
};

const initialVcpuData = {
    labels: [
        'Used',
        'Available'
    ],
    datasets: [{
        data:[0,0],
        backgroundColor: [
            chartColorSet.vcpu.use.color,
            chartColorSet.vcpu.avail.color,
        ],
        hoverBackgroundColor: [
            chartColorSet.vcpu.use.highlight,
            chartColorSet.vcpu.avail.highlight,
        ]
    }]
};

const initialMemoryData = {
    labels: [
        'Used',
        'Available'
    ],
    datasets: [{
        data:[0,0],
        backgroundColor: [
            chartColorSet.memory.use.color,
            chartColorSet.memory.avail.color,
        ],
        hoverBackgroundColor: [
            chartColorSet.memory.use.highlight,
            chartColorSet.memory.avail.highlight,
        ]
    }]
};

const initialFloatingIPData = {
    labels: [
        'Used',
        'Available'
    ],
    datasets: [{
        data:[0,0],
        backgroundColor: [
            chartColorSet.floatingIP.use.color,
            chartColorSet.floatingIP.avail.color,
        ],
        hoverBackgroundColor: [
            chartColorSet.floatingIP.use.highlight,
            chartColorSet.floatingIP.avail.highlight,
        ]
    }]
};

const initialSecurityGroupData = {
    labels: [
        'Used',
        'Available'
    ],
    datasets: [{
        data:[0,0],
        backgroundColor: [
            chartColorSet.securityGroup.use.color,
            chartColorSet.securityGroup.avail.color,
        ],
        hoverBackgroundColor: [
            chartColorSet.securityGroup.use.highlight,
            chartColorSet.securityGroup.avail.highlight,
        ]
    }]
};

const initialVolumeCountData = {
    labels: [
        'Used',
        'Available'
    ],
    datasets: [{
        data:[0,0],
        backgroundColor: [
            chartColorSet.volumeCount.use.color,
            chartColorSet.volumeCount.avail.color,
        ],
        hoverBackgroundColor: [
            chartColorSet.volumeCount.use.highlight,
            chartColorSet.volumeCount.avail.highlight,
        ]
    }]
};

const initialVolumeSizeData = {
    labels: [
        'Used',
        'Available'
    ],
    datasets: [{
        data:[0,0],
        backgroundColor: [
            chartColorSet.volumeSize.use.color,
            chartColorSet.volumeSize.avail.color,
        ],
        hoverBackgroundColor: [
            chartColorSet.volumeSize.use.highlight,
            chartColorSet.volumeSize.avail.highlight,
        ]
    }]
};

class Dashboard extends React.Component {

    // Life-cycle functions
    constructor(props){
        super(props);
        this.state = {
            data                : initialData,
            instanceData        : initialInstanceData,
            vcpuData            : initialVcpuData,
            memoryData          : initialMemoryData,
            floatingIPData      : initialFloatingIPData,
            volumeCountData     : initialVolumeCountData,
            volumeSizeData      : initialVolumeSizeData,
            securityGroupData   : initialSecurityGroupData,
        };
    }

    componentDidMount = () => {
        //$('#createvm').popup({inline:false, hoverable: false, on: 'click'});
        //$('#createvolume').popup({inline:false, hoverable: false, on: 'click'});
        //$('#createvm').modal('hide');
        //$('#createvolume').modal('hide');

        this.updateChart(this.state.data);

        if(this.props.projectID && this.props.projectID != "") {
            let projectID = this.props.projectID;
            this.loadDashboardInfo(projectID);
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if(nextProps.projectID) {
            let projectID = nextProps.projectID;
            this.loadDashboardInfo(projectID);
        }
    }

    // Event handling functions

    // Chart functions
    updateChart = (data) => {
        let instanceData        = this.state.instanceData;
        let vcpuData            = this.state.vcpuData;
        let memoryData          = this.state.memoryData;
        let floatingIPData      = this.state.floatingIPData;
        let securityGroupData   = this.state.securityGroupData;
        let volumeCountData     = this.state.volumeCountData;
        let volumeSizeData      = this.state.volumeSizeData;

        // 1 index denotes available resources. Note that the value should be 1
        // to prevent draw null circle by "DoughnutChart"

        instanceData.datasets[0].data      = [  data.instance.use,
                                                data.instance.quota - data.instance.use ?
                                                data.instance.quota - data.instance.use : 1 ];

        vcpuData.datasets[0].data          = [  data.vcpu.use,
                                                data.vcpu.quota - data.vcpu.use ?
                                                data.vcpu.quota - data.vcpu.use : 1 ];

        memoryData.datasets[0].data        = [  data.memory.use,
                                                data.memory.quota - data.memory.use ?
                                                data.memory.quota - data.memory.use : 1 ];

        floatingIPData.datasets[0].data    = [  data.floatingIp.use,
                                                data.floatingIp.quota - data.floatingIp.use ?
                                                data.floatingIp.quota - data.floatingIp.use : 1 ];

        securityGroupData.datasets[0].data = [  data.security_group.use,
                                                data.security_group.quota - data.security_group.use ?
                                                data.security_group.quota - data.security_group.use : 1 ];

        volumeCountData.datasets[0].data   = [  data.volume.use,
                                                data.volume.quota - data.volume.use ?
                                                data.volume.quota - data.volume.use : 1 ];

        volumeSizeData.datasets[0].data    = [  data.volume_storage.use,
                                                data.volume_storage.quota - data.volume_storage.use ?
                                                data.volume_storage.quota - data.volume_storage.use : 1 ];

        //console.log(instanceData);

        this.setState({data, instanceData, vcpuData, memoryData, floatingIPData,
                        securityGroupData, volumeCountData, volumeSizeData});
    }

    loadDashboardInfo = (projectID) => {

        return fetch(this.props.appRoot+'openstack/'+projectID+'/dashboard/', {
                method: 'GET',
                headers: {
                    'X-Auth-Token': this.props.authToken,
                }
            })
            .then( (response)       => response.json() )
            .then( (data)   => { this.updateChart(data)})
            .catch( (error)         => { console.log('loadDashboardInfo : ' + error.message)});
    }

    render = () => {
        const closeInstanceModal = [
            <RaisedButton label="Cancel" primary={true} onTouchTap={this.closeCreateInstance}/>
        ];

        return (
            <Flexbox flexDirection="column" alignContent='space-around'>
                <Flexbox    alignContent='flex-start'>
                    <h2>
                        <DashboardIcon/>Dashboard
                    </h2>
                </Flexbox>
                <Flexbox>
                    <h3>
                        리소스 사용률
                    </h3>
                </Flexbox>

                <Flexbox flexDirection="row" alignContent='space-around' alignItems='center' padding='10px'>
                    <div>
                        <Doughnut   data={this.state.instanceData}
                                    options={chartOptions}

                        />
                        <div>
                            인스턴스&nbsp;
                            {this.state.data.instance.use}
                            <span style={{ color: '#999' }}>/</span>
                            {this.state.data.instance.quota}
                            <span style={{ fontSize: 10 }}> 개</span>
                        </div>
                    </div>
                    <div>
                        <Doughnut data={this.state.vcpuData} options={chartOptions}/>
                        <div className="label">
                            vCPU&nbsp;
                            {this.state.data.vcpu.use}
                            <span style={{ color: '#999' }}>/</span>
                            {this.state.data.vcpu.quota}
                            <span style={{ fontSize: 10 }}> 개</span>
                        </div>
                    </div>
                    <div>
                        <Doughnut data={this.state.memoryData} options={chartOptions}/>
                        <div className="label">
                            메모리 용량&nbsp;
                            {this.state.data.memory.use}
                            <span style={{ color: '#999' }}>/</span>
                            {this.state.data.memory.quota}
                            <span style={{ fontSize: 10 }}> GB</span>
                        </div>
                    </div>
                    <div>
                        <Doughnut data={this.state.floatingIPData} options={chartOptions}/>
                        <div className="label">
                            Floating IP&nbsp;
                            {this.state.data.floatingIp.use}
                            <span style={{ color: '#999' }}>/</span>
                            {this.state.data.floatingIp.quota}
                            <span style={{ fontSize: 10 }}> 개</span>
                        </div>
                    </div>
                </Flexbox>
                <Flexbox flexDirection="row" alignContent='space-around' padding='10px'>
                    <div>
                        <Doughnut data={this.state.volumeCountData} options={chartOptions}/>
                        <div className="label">
                            Volume 수&nbsp;
                            {this.state.data.volume.use}
                            <span style={{ color: '#999' }}>/</span>
                            {this.state.data.volume.quota}
                            <span style={{ fontSize: 10 }}> 개</span>
                        </div>
                    </div>
                    <div>
                        <Doughnut data={this.state.volumeSizeData} options={chartOptions}/>
                        <div className="label">
                            Volume 용량&nbsp;
                            {this.state.data.volume_storage.use}
                            <span style={{ color: '#999' }}>/</span>
                            {this.state.data.volume_storage.quota}
                            <span style={{ fontSize: 10 }}> GB</span>
                        </div>
                    </div>
                    <div>
                        <Doughnut data={this.state.securityGroupData} options={chartOptions}/>
                        <div className="label">
                            Security Group&nbsp;
                            {this.state.data.security_group.use}
                            <span style={{ color: '#999' }}>/</span>
                            {this.state.data.security_group.quota}
                            <span style={{ fontSize: 10 }}> 개</span>
                        </div>
                    </div>
                </Flexbox>
                <Divider/>
                <Flexbox alignContent='flex-start'>
                    <h3>
                        Quick Menu
                    </h3>
                </Flexbox>
                <Flexbox alignContent='flex-start'>
                    <p style={{ fontSize: 12 }}>
                        오픈스택 클라우드 플랫폼의 가상화 서버와 스토리지를 생성할 수 있습니다.
                    </p>
                </Flexbox>
                <Flexbox alignContent='space-around'>
                    <CreateInstance userID={this.props.userID}
                                    authToken={this.props.authToken}
                                    projectID={this.props.projectID}
                                    appRoot={this.props.appRoot}
                    />
                    &nbsp;
                    <CreateVolume   userID={this.props.userID}
                                    authToken={this.props.authToken}
                                    projectID={this.props.projectID}
                                    appRoot={this.props.appRoot}
                    />
                </Flexbox>
            </Flexbox>
        );
    }
};

let mapStateToProps = (state) => {
    return {
        appRoot         : state.appRoot,
        userID          : state.userID,
        authToken       : state.authToken,
        projectID       : state.projectID,
        logoutHandler   : state.logoutHandler
    }
}

Dashboard = connect(mapStateToProps)(Dashboard);
export default Dashboard;
