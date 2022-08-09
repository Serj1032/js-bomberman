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
        let new_content = null;
        let content = this.props.cell.content;
        if (content) {
            if (content instanceof Wall) {
                new_content = <WallComponent wall={content} />;
            }
            if (content instanceof Bomb) {
                new_content = <BombComponent bomb={content} />;
            }
        }
        return new_content;
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