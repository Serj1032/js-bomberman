import React from "react";
import wall from './../resources/wall.png';
import grass from './../resources/grass.png';
import { ImageComponent } from './ImageComponent.js';
import { BombComponent } from './BombComponent.js';
import { Wall } from './../Cell.js';
import { Bomb } from './../Bomb.js';

export class WallComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            destroyed: false
        };
    }

    componentDidMount() {
        this.props.wall.destroyCallback = this.destroyCallback.bind(this);
    }

    componentWillUnmount() {
        this.props.wall.destroyCallback = null;
    }

    destroyCallback() {
        this.setState({
            destroyed: true,
        });
    }

    render() {
        return (
            !this.state.destroyed && <ImageComponent img={wall}
                x={this.props.wall.x}
                y={this.props.wall.y}
                onClick={() => { this.props.wall.destroy() }}
            >
            </ImageComponent>
        );
    }
}

export class CellComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            content: this.#getContentComponent(),
        };
    }

    componentDidMount() {
        this.props.cell.contentUpdated = this.updateContnet.bind(this);
    }

    #getContentComponent() {
        let components = [];
        for (let content of this.props.cell.content) {
            if (content instanceof Wall) {
                components.push(<WallComponent key={content.toString()} wall={content} />);
            }
            if (content instanceof Bomb) {
                components.push(<BombComponent key={content.toString()} bomb={content} />);
            }
        }
        return components;
    }

    updateContnet() {
        this.setState({
            content: this.#getContentComponent(),
        });
    }

    render() {

        return (
            <>
                <ImageComponent img={grass}
                    x={this.props.cell.x}
                    y={this.props.cell.y}
                />
                {this.state.content}
            </>
        );
    }
}