import React from "react";
import { CellComponent } from './Cell.js'
import { AnimationCompoent } from './Animation.js'
import bomb from './resources/bomb.png'

export class BombFeature{
    constructor() {
        this.strength = 3;  // length of explosion
        this.timer = 2000;  //milliseconds
    }
}

export class Bomb {
    constructor(x, y, owner) {
        this.x = x;
        this.y = y;
        this.owner = owner;
        this.exploded = false;

        this.explosionTimer = setInterval(
            () => this.explosion(), 
            this.owner.features.bombFeature.timer);

        this.explosionCallback = [];
    }

    get features(){
        return this.owner.features.bombFeature;
    }

    explosion() {
        console.log(`${this} exploded!`);
        this.exploded = true;
        clearInterval(this.explosionTimer);
        for (let callback of this.explosionCallback) {
            callback(this);
        }
    }

    toString() {
        return `bomb ${this.x}:${this.y}`;
    }
}



export class BombComponent extends AnimationCompoent {
    constructor(props) {
        super(props);
        this.bomb = props.bomb;
        this.state = {
            x: this.bomb.x,
            y: this.bomb.y,
            scale: 1.0,
            exploded: this.bomb.exploded,
        };
        this.animationDirection = -1;
        this.bomb.explosionCallback.push(this.explosionHandler.bind(this));
    }

    explosionHandler() {
        this.finishAnimation();
        this.setState({ exploded: this.bomb.exploded });
    }

    updateAnimation() {
        if (this.state.scale < 0.7)
            this.animationDirection = 1;
        if (this.state.scale > 1)
            this.animationDirection = -1;
        this.setState((state) => ({ 
            scale: state.scale + this.animationDirection * 0.02
        }));
    }

    render() {
        if (this.state.exploded)
            return null;

        let _width = this.state.scale * CellComponent.WIDTH;
        let _heigth = this.state.scale * CellComponent.HEIGHT;
        let _left = this.state.x * (CellComponent.WIDTH + CellComponent.MARGIN) + CellComponent.OFFESET;
        let _top = this.state.y * (CellComponent.HEIGHT + CellComponent.MARGIN) + CellComponent.OFFESET;
        _left += (CellComponent.WIDTH - _width) / 2;
        _top += (CellComponent.HEIGHT - _heigth) / 2;

        return (
            <img src={bomb} alt="" width={_width} height={_heigth}
                style={{
                    position: 'absolute', 
                    left: _left, 
                    top: _top
                }} />
        );
    }
}