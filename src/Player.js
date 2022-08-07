import React from 'react';
import player from './resources/player.png'
import { CellComponent } from './Cell.js'
import { Bomb, BombFeature } from './Bomb.js';


class PlayerFeature {
    constructor() {
        this.speed = 2;         // speed of moving
        this.bombFeature = new BombFeature();
    }
}

export class Player {
    constructor(x, y, field) {
        this.x = x;
        this.y = y;
        this.field = field;
        this.features = new PlayerFeature();

        this.moveCallback = null;
    }

    move(dx, dy) {
        let cell = this.field.getCell(this.x + dx, this.y + dy);
        if (!cell.destroyed)
            return;
        this.x += dx;
        this.y += dy;
        if (this.moveCallback) {
            this.moveCallback();
        }
    }

    placeBomb() {
        this.field.placeBomb(new Bomb(this.x, this.y, this));
    }
}


export class PlayerComponent extends React.Component {
    constructor(props) {
        super(props);
        this.animateMovingTimer = null;

        this.player = props.player;
        this.player.moveCallback = this.playerMoveHandler.bind(this);

        this.state = {
            absx: this.xToAbdsolute(this.player.x),
            absy: this.yToAbdsolute(this.player.y)
        };
    }

    playerMoveHandler() {
        if (this.animateMovingTimer)
            return;
        this.animateMoving();
    }

    yToAbdsolute(y) {
        return y * (CellComponent.HEIGHT + CellComponent.MARGIN) + CellComponent.OFFESET;
    }

    xToAbdsolute(x) {
        return x * (CellComponent.WIDTH + CellComponent.MARGIN) + CellComponent.WIDTH / 3 + CellComponent.OFFESET;
    }

    updateAnimation() {
        let targetX = this.xToAbdsolute(this.player.x);
        let targetY = this.yToAbdsolute(this.player.y);

        let _absx = this.state.absx +
            Math.sign(targetX - this.state.absx) *
            Math.min(
                Math.abs(targetX - this.state.absx),
                this.player.features.speed
            );
        let _absy = this.state.absy +
            Math.sign(targetY - this.state.absy) *
            Math.min(
                Math.abs(targetY - this.state.absy),
                this.player.features.speed
            );

        if (targetX === this.state.absx && targetY === this.state.absy) {
            clearInterval(this.animateMovingTimer);
            this.animateMovingTimer = null;
            return;
        }
        this.setState({
            absx: _absx,
            absy: _absy,
        });
    }

    animateMoving() {
        this.animateMovingTimer = setInterval(
            () => this.updateAnimation(),
            30
        );
    }

    componentDidMount() {
        this.keyDownHandler = this.keyDownHandler.bind(this);
        this._mounted = false;
        if (!this._mounted) {
            this._mounted = true;
            document.addEventListener('keydown', this.keyDownHandler);
        }
    }

    keyDownHandler(e) {
        // if (this.animateMovingTimer) {
        //     e.preventDefault();
        //     return false
        // }

        if (e.code === "ArrowLeft") {
            this.player.move(-1, 0);
        }
        else if (e.code === "ArrowRight") {
            this.player.move(1, 0);
        }
        else if (e.code === "ArrowUp") {
            this.player.move(0, -1);
        }
        else if (e.code === "ArrowDown") {
            this.player.move(0, 1);
        }
        else if (e.code === "Space") {
            this.player.placeBomb();
        }
        else {
            return false;
        }
        // console.log(e.code);
        e.preventDefault();
        return false;
    }

    render() {
        return (
            <img src={player} alt=""
                width={CellComponent.WIDTH / 2}
                height={CellComponent.HEIGHT}
                onKeyDown={this.keyDownHandler}
                style={{
                    position: 'absolute',
                    left: this.state.absx,
                    top: this.state.absy
                }} />
        );
    }
}