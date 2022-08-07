import React from "react";
import wall from './resources/wall.png'
import grass from './resources/grass.png'


export class Cell {
    constructor(x, y, destroyed) {
        this.x = x;
        this.y = y;
        this.destroyed = destroyed;
        this.bonus = null;

        this.blowUpCallback = null;
    }

    toString() {
        return `${this.x}:${this.y} destroyed=${this.destroyed}`;
    }

    blowUp() {
        if (this.destroyed)
            return;
        this.destroyed = true;
        //TODO expand bonus
        if (this.blowUpCallback){
            this.blowUpCallback();
        }
    }
}


export class CellComponent extends React.Component {
    static WIDTH = 30;
    static HEIGHT = 30;
    static OFFESET = 5;
    static MARGIN = 2;

    constructor(props) {
        super(props);
        this.cell = props.cell;
        this.state = {
            x: this.cell.x,
            y: this.cell.y,
            destroyed: this.cell.destroyed
        };
        this.cell.blowUpCallback = this.blowUpHandler.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
    }

    blowUpHandler(){
        this.setState({destroyed: this.cell.destroyed});
    }

    // destroy cell for debug
    onClickHandler(e) {
        e.preventDefault();
        console.log(`Cell ${this.cell} clicked`);
        this.cell.blowUp();
    }

    grassTile() {
        return (
            <img src={grass} alt=""
                width={CellComponent.WIDTH + 2 * CellComponent.MARGIN}
                height={CellComponent.HEIGHT + 2 * CellComponent.MARGIN}
                style={{
                    position: 'absolute',
                    left: this.state.x * (CellComponent.WIDTH + CellComponent.MARGIN) - CellComponent.MARGIN + CellComponent.OFFESET,
                    top: this.state.y * (CellComponent.HEIGHT + CellComponent.MARGIN) - CellComponent.MARGIN + CellComponent.OFFESET
                }} />
        );
    }

    wallTile() {
        return (
            <img src={wall} alt=""
                width={CellComponent.WIDTH}
                height={CellComponent.HEIGHT}
                onClick={this.onClickHandler}
                style={{
                    position: 'absolute',
                    left: this.state.x * (CellComponent.WIDTH + CellComponent.MARGIN) + CellComponent.OFFESET,
                    top: this.state.y * (CellComponent.HEIGHT + CellComponent.MARGIN) + CellComponent.OFFESET
                }} />
        );
    }

    render() {
        return this.state.destroyed ? this.grassTile() : this.wallTile();
    }
}