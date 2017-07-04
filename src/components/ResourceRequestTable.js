import React from 'react';
import ReactDOM from 'react-dom';
//import {Table} from 'reactabular';
import { connect } from 'react-redux';

import {ActionButton} from './Grossary';
//import ReactPaginate from 'react-paginate';


// Table data as a list of array.
const columns = [
    {
        property: 'blank'
    },
    {
        property: 'id',
        header: {
            label: '요청ID',
            props: {
                style: {
                    width: '120px'
                }
            }
        }
    },
    {
        property: 'created',
        header: {
            label: '요청시간'
        }
    },
    {
        property: 'projectName',
        header: {
            label: '프로젝트'
        }
    },
    {
        property: 'userID',
        header: {
            label: '요청자'
        }
    },
    {
        property: 'adminID',
        header: {
            label: '결재자'
        }
    },
    {
        property: 'job',
        header: {
            label: '스펙'
        }
    },
    {
        property: 'stateButton',
        header: {
            label: '상태',
            props: {
                style: {
                    width: '200px'
                }
            }
        }
    }
];



class ApprovalButton extends React.Component {

    // Event handling functions
    handleClick = (index, id, isAccepted, e) => {
        if(e && e.preventDefault) e.preventDefault();
        this.props.handleClick(index, id, isAccepted);
    }


    render = () => {
        let acceptButton = React.createElement(ActionButton, {
                            className:"ui label blue",
                            icon:"",
                            label:"승인",
                            handleClick:this.handleClick.bind(
                                this, this.props.index, this.props.rrid, true)
                            });
        let denyButton = React.createElement(ActionButton, {
                            className:"ui label red",
                            icon:"",
                            label:"반려",
                            handleClick:this.handleClick.bind(
                                this, this.props.index, this.props.rrid, false)
                            });
        return (
            <div className="ui inline fields">
                {acceptButton}
                {denyButton}
            </div>
        );
    }
};



class ResourceRequestTable extends React.Component{

    // Life-cycle functions
    constructor(props) {
        super(props);
        this.state = {
            columns             : [],
            viewData            : [],
            resourceRequestList : [],
            filteredData        : [],
            projectList         : {},
            projectID           : "",
            pageNum             : 0,
            listPerPage         : 10,
            currentPage         : 0,
            searchKeyWord       : '',
            searchGroup         : '',
        };
    }

    componentDidMount = () => {
        this.setState({projectList:this.props.projectList,projectID:this.props.projectID});
        this.loadResourceRequestList(this.props.projectID, this.props.projectList);
    }

    componentWillReceiveProps = (nextProps) => {
        if(nextProps.listPerPage) {
            this.setState({listPerPage:nextProps.listPerPage});
        }
        if(nextProps.projectID && nextProps.projectID != this.props.projectID) {
            this.setState({projectList:nextProps.projectList,projectID:nextProps.projectID});
            this.loadResourceRequestList(nextProps.projectID, nextProps.projectList);
        }
    }


    // Event handling functions
    handlePageClick = (data) => {
        this.setState({currentPage:data.selected});
        this.pagenate(this.state.filteredData, data.selected);
    }
    handleClick = (index, id, isAccepted) => {
        var self = this;
        var updateData={};
        let url='http://10.12.11.135:1111/';
        updateData['state']='denied';
        if(isAccepted){
            updateData['state']='approved';
            url += 'test/'+id;
        }
        else {
            url += 'approval_detail/'+id+'/';
        }

        return fetch('http://10.12.11.135:1111/approval_detail/'+id+'/',{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': this.props.authToken,
            },
            body: JSON.stringify(updateData)
        })
        //.then( (response) => response.json() )
        .then( (response) => response.json() )
        .then( (data) => {
            this.updateList(data.id, data.state);
        })
        .catch( (error) => {
            console.log('handleClick error : ' + error.message);
        });
    }

    handleListPerPageChange = (value) => {
        let listPerPage = Number(value);
        let len = this.state.resourceRequestList.length;
        if(listPerPage < 1) listPerPage = 1;
        this.state.listPerPage = listPerPage;
        this.setState({pageNum:Math.ceil(len/listPerPage), currentPage: 0});
        this.pagenate(this.state.filteredData, 0);
    }

    handleSelectSearchGroupChange = (e) => {
        if(e && e.preventDefault) e.preventDefault();
        let searchGroup = e.target.value;
        this.setState({searchGroup});
        this.filterData(this.state.resourceRequestList,
                        searchGroup,
                        this.state.searchKeyWord);
    }

    handleKeyWordChange = (e) => {
        if(e && e.preventDefault) e.preventDefault();
        let searchKeyWord = e.target.value;
        this.setState({searchKeyWord});
        this.filterData(this.state.resourceRequestList,
                        this.state.searchGroup,
                        searchKeyWord);
    }



    // Load functions
    loadResourceRequestList = (projectID, projectList) => {
        let self = this;
        let url = 'http://10.12.11.135:1111/approval/?projectID='+projectID;

        if(this.props.isManager) {
            url += '&adminID='+this.props.userID;
        }
        else {
            url += '&userID='+this.props.userID;
        }
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            headers: {
                'Content-Type':'application/json; application/x-www-form-urlencoded; charset=UTF-8',
                'X-Auth-Token':this.props.authToken,
            },
            success: function(data) {
                let filteredData=data;
                let len = data.length;

                for(let i=0; i<len; i++) {
                    filteredData[i].job = this.parseJob(
                                            filteredData[i].resourceURL,
                                            filteredData[i].job
                                            );
                    if(filteredData[i].created != null) {
                        let timestamp = filteredData[i].created;
                        timestamp = timestamp.replace("T", " ");
                        timestamp = timestamp.replace("Z", " ");
                        filteredData[i].created = timestamp;
                    }
                    filteredData[i]['stateButton'] = this.makeStateButton(i, filteredData[i].id,
                                            filteredData[i].state);
                    filteredData[i].projectName = projectList[filteredData[i].projectID];
                    filteredData[i].id = String(filteredData[i].id);
                }
                this.setState({
                                pageNum:Math.ceil(len/this.state.listPerPage),
                                resourceRequestList: filteredData,
                                filteredData: filteredData,
                                columns:columns
                            });
                //this.pagenate(filteredData, this.state.currentPage);
                this.filterData(filteredData,
                                this.state.searchGroup,
                                this.state.searchKeyWord);

            }.bind(this),
            error: function(xhr, status, err) {
                console.error('loadResourceRequestList', status, err.toString());
            }.bind(this)
        });
    }


    // Utility functions
    parseJob = (url, job) => {
        let str = '';
        let spec = JSON.parse(job);
        let child = [];
        let component = null;
        if(url == 'createvm') {
            component = React.createElement('div',
                                            {className:'ui small label', key:'vms'},
                                            'VM');
            child.push(component);
            str = spec.name + " : " + spec.flavor;
            component = React.createElement('div',
                                            {className:'', key:1},
                                            str);
            child.push(component);
        }
        else {
            let len = spec.length;
            component = React.createElement(
                                'div',
                                {className:'ui small label',key:'volumes'},
                                'Volume'
                            );
            child.push(component);
            for(let i=0; i<len; i++) {
                str = '['+spec[i].volumeType+'] '+
                        spec[i].volumeName + ' : ' +
                        spec[i].volumeSize+'GB';
                component = React.createElement(
                                'div',
                                {className:'',key:i},
                                str
                            );
                child.push(component);
            }
        }
        component = React.createElement(
                            'div',
                            {className:'ui',id:'jobspec'},
                            child
                        );
        return component;
    }

    makeStateButton = (index, rrid, state) => {
        let button=null;
        let buttonicon=null;
        if(state == 'wait') {
            if(this.props.isManager) {
                button = React.createElement(
                                ApprovalButton,
                                {
                                    index       : index,
                                    rrid        :rrid,
                                    handleClick :this.handleClick
                                }
                            );
            }
            else {
                buttonicon = React.createElement(
                                    'i',
                                    {className:'minus circle icon'}
                                );
                button = React.createElement(
                                    'div',
                                    {className:'ui label'},
                                    buttonicon,
                                    "결재중"
                                );
            }
        }
        else if(state == 'approved') {
            buttonicon = React.createElement(
                                'i',
                                {className:'check blue circle icon'}
                            );
            button = React.createElement(
                                'div',
                                {className:"ui label"},
                                buttonicon,
                                "승인됨"
                            );
        }
        else{
            buttonicon = React.createElement(
                                    'i',
                                    {className:'remove red circle icon'}
                                );
            button = React.createElement(
                                    'div',
                                    {className:"ui label"},
                                    buttonicon,
                                    "반려됨"
                                );
        }
        return button;
    }

    pagenate = (data, pagenum) => {
        let start = pagenum * this.state.listPerPage;
        let src = data;
        let viewData=[];
        let len = (start + this.state.listPerPage) > src.length ?
                    src.length
                    :
                    start + this.state.listPerPage ;

        for(let i=start; i<len; i++) {
            viewData.push(src[i]);
        }
        this.setState({viewData:viewData});
    }

    updateList = (rrid, state) => {
        let list = this.state.resourceRequestList.slice();
        let idx = -1;
        let len = list.length;
        let id = Number(rrid);

        for(let i=0; i<len; i++) {
            if(list[i].id == id) {
                idx = i;
                break;
            }
        }
        if(idx > -1) {
            var row = {};//list[idx];
            var button = null;
            var buttonicon = null;
            row['id']           = list[idx].id;
            row['adminID']      = list[idx].adminID;
            row['created']      = list[idx].created;
            row['job']          = list[idx].job;
            row['projectID']    = list[idx].projectID;
            row['projectName']  = list[idx].projectName;
            row['userID']       = list[idx].userID;
            row['state']        = state;
            row['stateButton']  = this.makeStateButton(idx, rrid, state);

            list[idx] = row;
            this.setState({resourceRequestList: list});
        }
        //this.pagenate(list, this.state.currentPage);
        this.filterData(list, this.state.searchGroup, this.state.searchKeyWord);
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
                    if( srcData[i][key] &&
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




    render = () => {

        let isUsingPusher = "";
        return (
            <div className={isUsingPusher}>
            {!this.props.renderCompact ?
                <div>
                    <div    className="ui two column grid"
                            style={{ marginTop: '0', marginBottom: '10px' }}
                    >
                        <div className="column"/>
                        <div className="column right aligned">
                            <select className="ui dropdown"
                                    value={this.state.searchGroup}
                                    onChange={this.handleSelectSearchGroupChange}
                            >
                                <option value="">전체</option>
                                <option value="id">결재 ID</option>
                                <option value="created">요청 시각</option>
                                <option value="projectName">프로젝트</option>
                                <option value="userID">요청자 ID</option>
                                <option value="adminID">결재자 ID</option>
                                <option value="state">상태</option>
                            </select>
                            <div    className="ui action input"
                                    style={{ marginLeft: "5px" }}
                            >
                                <input  type="text"
                                        placeholder="Search"
                                        value={this.state.searchKeyWord}
                                        onChange={this.handleKeyWordChange}
                                />
                                <button className="ui basic icon button">
                                    <i className="search icon"/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div/>
            }
                <div className="ui center aligned">

{/*}
                    <Table.Provider
                        className={"ui very compact very basic selectable table"}
                        columns={this.state.columns}
                    >
                        <Table.Header/>
                        <Table.Body
                            rows={this.state.viewData}
                            rowKey="id"
                        />
                    </Table.Provider>
*/}
                    {!this.props.renderCompact ?
                    <div className="ui center grid">
                        <div className="center aligned column">
                        <PaginationBoxView
                            previousLabel={'이전'}
                            nextLabel={'다음'}
                            breakLabel='...'
                            breakClassName='item'
                            pageNum={this.state.pageNum}
                            marginPagesDisplayed={1}
                            pageRangeDisplayed={5}
                            clickCallback={this.handlePageClick}
                            containerClassName="ui pagination menu center aligned grid"
                            pageClassName="item center aligned grid bold"
                            pageLinkClassName="item center aligned grid"
                            previousClassName="item center aligned"
                            nextClassName="item center aligned"
                            previousLinkClassName="item center aligned"
                            nextLinkClassName="item center aligned"
                            subContainerClassName="item center aligned"
                            activeClassName="active item center aligned"
                            handleListPerPageChange={this.handleListPerPageChange}
                            initialSelected={this.state.currentPage}
                            forceSelected={this.state.currentPage}
                        />
                        </div>
                    </div>
                    : <div/>
                    }
                </div>
            </div>
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

export default connect(mapStateToProps)(ResourceRequestTable);
