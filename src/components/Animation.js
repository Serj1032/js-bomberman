import React from "react";

export class AnimationCompoent extends React.Component {
    constructor(props) {
        super(props);
        this.animationTimer = null;
    }

    componentDidMount() {
        this.animationTimer = setInterval(
            () => this.updateAnimation(),
            30
        );
    }

    componentWillUnmount() {
        clearInterval(this.animationTimer);
    }

    updateAnimation() {

    }

    finishAnimation() {
        clearInterval(this.animationTimer);
    }

}
