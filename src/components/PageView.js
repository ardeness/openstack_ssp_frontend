import React from 'react';

export default class PageView extends React.Component {

    render() {
        let linkClassName = this.props.pageLinkClassName;
        let cssClassName = this.props.pageClassName;
        let onClick = this.props.onClick;

        if (this.props.selected) {
            if (typeof(cssClassName) !== 'undefined') {
                cssClassName = cssClassName + ' ' + this.props.activeClassName;
            }
            else {
                cssClassName = this.props.activeClassName;
            }
            linkClassName = 'active blue ' + linkClassName;
        }

        return (
            <a className={linkClassName} onClick={onClick}>
                {this.props.page}
            </a>
        );
    }
};
