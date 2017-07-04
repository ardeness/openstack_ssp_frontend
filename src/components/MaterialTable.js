import React from 'react';

import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

class MaterialTable extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            columnKeys  : [],
            tableHeader : [],
            tableRows   : [],
        };
    }

    componentDidMount = () => {
        this.updateTable(this.props.columns, this.props.rows);
    }

    componentWillReceiveProps = (nextProps) => {
        this.updateTable(nextProps.columns, nextProps.rows);
    }

    updateTable = (columns, rows) => {
        if(columns) {
            let tableHeader = columns.map((columnInfo) => {
                //return <TableHeaderColumn key={columnInfo.header.label} style={columnInfo.style}>{columnInfo.header.label}</TableHeaderColumn>;
                return <TableRowColumn key={columnInfo.header.label} style={columnInfo.style}>{columnInfo.header.label}</TableRowColumn>;
            });

            //let tableHeader = <TableRow>{tableHeaderColumns}</TableRow>;
            //let tableHeader = React.createElement(TableRow, {}, tableHeaderColumns);
            let columnKeys = [];

            for(let i=0; i<columns.length; i++) {
                columnKeys.push(columns[i].property);
            }

            //console.log(columnKeys);
            let tableRows = rows.map(function(columnKeys, row, index){
                let bodyRows = columnKeys.map(function(row, key){
                    return <TableRowColumn key={key}>{row[key]}</TableRowColumn>;
                }.bind(null, row));
                return <TableRow key={index}>{bodyRows}</TableRow>;

            }.bind(null, columnKeys));

            this.setState({tableHeader, tableRows});
        }
    }

    render = () => {
        return (
            <Table  selectable={false}
                    multiSelectable={false}
            >
                <TableHeader    displaySelectAll={false}
                                adjustForCheckbox={false}
                                enableSelectAll={false}
                                adjustForCheckbox={false}
                >
                    <TableRow/>
                </TableHeader>
                <TableBody  displayRowCheckbox={false}>
                    <TableRow key={'tableHeader'}>
                        {this.state.tableHeader}
                    </TableRow>
                    {this.state.tableRows}
                </TableBody>
            </Table>
        );
    }



};

export default MaterialTable;
