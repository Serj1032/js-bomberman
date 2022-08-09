import React from "react";
import * as C from './../constants.js';


export class ImageComponent extends React.Component{
    constructor(props){
        super(props);
        this.onClick = this.onClick.bind(this);
        this.state = {
            scale: 1.0, 
            // img: props.img,
        };
    }

    onClick(e){
        if (this.props.onClick)
            this.props.onClick(e);
    }

    render() {
        return (
            <img src={this.props.img} alt=""
                width={C.CELL_WIDTH}
                height={C.CELL_HEIGHT}
                onClick={this.onClick}
                style={{
                    position: 'absolute',
                    left: this.props.x * (C.CELL_WIDTH + C.CELL_MARGIN) + C.CELL_OFFESET,
                    top: this.props.y * (C.CELL_HEIGHT + C.CELL_MARGIN) + C.CELL_OFFESET
                }} />
        );
    }
}