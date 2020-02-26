import React, { Component } from "react";

export default class CategoryGridButtonRenderer extends Component {
    constructor(props) {
        super(props);
        this.invokeParentMethod = this.invokeParentMethod.bind(this);
    }

    invokeParentMethod() {
        this.props.context.componentParent.deleteCategory(`Row: ${this.props.node.rowIndex}, Col: ${this.props.colDef.headerName}`)
    }

    render() {
        return (
            <span><button style={{ height: 20, lineHeight: 0.5 }} onClick={this.invokeParentMethod} className="btn btn-info">Delete</button></span>
        );
    }
};
