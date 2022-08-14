import React from 'react';
import * as C from './../constants.js'
import player from './../resources/player.png'


class AbstractPlayerComponent extends React.Component {
    constructor(props) {
        super(props);
        this.animateMovingTimer = null;

        // this.props.player = props.player;
        this.props.player.moveCallback = this.playerMoveHandler.bind(this);
        this.props.player.diedCallback = () => { this.setState({ died: true }) };

        this.state = {
            absx: this.xToAbdsolute(this.props.player.x),
            absy: this.yToAbdsolute(this.props.player.y),
            died: this.props.player.isDied,
        };
    }

    playerMoveHandler() {
        if (this.animateMovingTimer)
            return;
        this.animateMoving();
    }

    yToAbdsolute(y) {
        return y * (C.CELL_HEIGHT + C.CELL_MARGIN) + C.CELL_OFFESET;
    }

    xToAbdsolute(x) {
        return x * (C.CELL_WIDTH + C.CELL_MARGIN) + C.CELL_WIDTH / 3 + C.CELL_OFFESET;
    }

    updateAnimation() {
        let targetX = this.xToAbdsolute(this.props.player.x);
        let targetY = this.yToAbdsolute(this.props.player.y);

        let _absx = this.state.absx +
            Math.sign(targetX - this.state.absx) *
            Math.min(
                Math.abs(targetX - this.state.absx),
                this.props.player.features.speed
            );
        let _absy = this.state.absy +
            Math.sign(targetY - this.state.absy) *
            Math.min(
                Math.abs(targetY - this.state.absy),
                this.props.player.features.speed
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
}


export class PlayerComponent extends AbstractPlayerComponent {
    componentDidMount() {
        this.keyDownHandler = this.keyDownHandler.bind(this);
        document.addEventListener('keydown', this.keyDownHandler);
    }

    keyDownHandler(e) {
        if (e.code === "ArrowLeft") {
            this.props.player.move(-1, 0);
        }
        else if (e.code === "ArrowRight") {
            this.props.player.move(1, 0);
        }
        else if (e.code === "ArrowUp") {
            this.props.player.move(0, -1);
        }
        else if (e.code === "ArrowDown") {
            this.props.player.move(0, 1);
        }
        else if (e.code === "Space") {
            this.props.player.placeBomb();
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
            !this.state.died && <img src={player} alt=""
                width={C.CELL_WIDTH / 2}
                height={C.CELL_HEIGHT}
                onKeyDown={this.keyDownHandler}
                style={{
                    position: 'absolute',
                    left: this.state.absx,
                    top: this.state.absy
                }} />
        );
    }
}


export class BotComponent extends AbstractPlayerComponent {
    render() {
        return (
            !this.state.died && <img src={player} alt=""
                width={C.CELL_WIDTH / 2}
                height={C.CELL_HEIGHT}
                style={{
                    position: 'absolute',
                    left: this.state.absx,
                    top: this.state.absy
                }} />
        );
    }
}
