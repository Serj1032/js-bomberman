import React from 'react';
import * as C from './../constants.js'
import player from './../resources/player.png'
import { ImageComponent } from './ImageComponent.js';


class AbstractPlayerComponent extends React.Component {
    constructor(props) {
        super(props);
        this.props.player.moveCallback = this.playerMoveHandler.bind(this);
        this.props.player.diedCallback = () => { this.setState({ died: true }) };

        this.state = {
            x: this.props.player.x,
            y: this.props.player.y,
            died: this.props.player.isDied,
        };
    }

    playerMoveHandler() {
        if (!this.props.player) return;
        this.setState({
            x: this.props.player.x,
            y: this.props.player.y,
        });
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
            // TODO: add onKeyDown handler
            // !this.state.died && <img src={player} alt=""
            //     width={C.CELL_WIDTH / 2}
            //     height={C.CELL_HEIGHT}
            //     onKeyDown={this.keyDownHandler}
            //     style={{
            //         position: 'absolute',
            //         left: this.state.x,
            //         top:  this.state.y
            //     }} />
            !this.state.died && <ImageComponent img={player}
                x={this.state.x}
                y={this.state.y}/>
        );
    }
}


export class BotComponent extends AbstractPlayerComponent {
    render() {
        return (
            !this.state.died && <ImageComponent img={player}
                x={this.state.x}
                y={this.state.y}/>
        );
    }
}
