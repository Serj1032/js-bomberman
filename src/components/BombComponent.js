import React from "react";
import bomb from './../resources/bomb.png'
import * as C from './../constants.js'
import { AnimationCompoent } from './Animation.js'



export class BombComponent extends AnimationCompoent {
    constructor(props) {
        super(props);

        this.props.bomb.destroyCallback = this.#updatedHandler.bind(this);
        this.state = {
            scale: 1.0,
            x: this.props.bomb.x,
            y: this.props.bomb.y,
            exploded: this.props.bomb.exploded,
        };
        this.animationDirection = -1;
    }

    #updatedHandler() {
        this.finishAnimation();
        this.setState({
            x: this.props.bomb.x,
            y: this.props.bomb.y,
            exploded: this.props.bomb.exploded
        });
    }

    updateAnimation() {
        if (this.state.scale < 0.7)
            this.animationDirection = 1;
        if (this.state.scale > 1)
            this.animationDirection = -1;
        this.setState((state) => ({
            scale: state.scale + this.animationDirection * 0.015
        }));
    }

    render() {
        let _width = this.state.scale * C.CELL_WIDTH;
        let _heigth = this.state.scale * C.CELL_HEIGHT;
        let _left = this.state.x * (C.CELL_WIDTH + C.CELL_MARGIN) + C.CELL_OFFESET;
        let _top = this.state.y * (C.CELL_HEIGHT + C.CELL_MARGIN) + C.CELL_OFFESET;
        _left += (C.CELL_WIDTH - _width) / 2;
        _top += (C.CELL_HEIGHT - _heigth) / 2;

        return (
            !this.state.exploded && <img src={bomb} alt="" width={_width} height={_heigth}
                style={{
                    position: 'absolute',
                    left: _left,
                    top: _top
                }} />
        );
    }
}