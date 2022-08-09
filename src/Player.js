import { Bomb, BombFeature } from './Bomb.js';
import { CellContent } from './Cell.js'
const tf = require('@tensorflow/tfjs');


class PlayerFeature {
    constructor() {
        this.speed = 2;         // speed of moving
        this.bombCapacity = 2;
        this.bombFeature = new BombFeature();
    }
}

class AbstractPlayer extends CellContent {
    constructor(name, cell, field) {
        super(cell);
        cell.content = this;
        // private
        this._name = name;
        this._field = field;
        this._moveCallbacks = new Set();
        this.diedCallback = null;

        // public
        this.features = new PlayerFeature();

        this._state = {
            hasDied: false,
            bombsAmount: 0,
        };
    }

    #notifyMoveCallback() {
        for (let callback of this._moveCallbacks)
            callback();
    }

    addMoveCallback(callback) {
        this._moveCallbacks.add(callback);
    }

    move(dx, dy) {
        if (this._state.hasDied) return;

        let cell = this._field.getCell(this.x + dx, this.y + dy);
        if (!cell) return;
        if (!cell.moveAvailable)
            return;
        cell.applyBonus(this.features);

        // если игрок поставил бомбу в клетку, он уже не является 
        // содержимым этой клетки, теперь там бомба
        if (this.cell.content === this)
            this.cell.content = null;
        this.cell = cell;
        this.cell.content = this;
        this.#notifyMoveCallback();
    }

    placeBomb() {
        if (this._state.hasDied) return;

        if (this._state.bombsAmount >= this.features.bombCapacity) {
            console.log(`Max bomb amount ${this._state.bombsAmount}`);
            return;
        }

        let cell = this._field.getCell(this.x, this.y);
        if (cell.content === this) {
            let bomb = new Bomb(cell, this, this._field);
            this._state.bombsAmount += 1;
            this._field.getCell(this.x, this.y).content = bomb;
        }
        else {
            console.log(`Cell ${cell} already has ${cell.content}`);
            return;

        }
    }

    bombExploded(bomb) {
        if (bomb.cell === this.cell) {
            this.destroy(); // сам себя подорвал!
        }

        this._state.bombsAmount -= 1;
        if (this._state.bombsAmount < 0)
            console.log(`${this} has bombsAmount < 0!`);
    }

    destroyContent() {
        if (this._state.hasDied) return;

        console.log(`${this} has died!`);
        this._state.hasDied = true;
        if (this.diedCallback)
            this.diedCallback();
    }

    toString() {
        return `${this._name}`;
    }
}

export class Player extends AbstractPlayer {

}


export class Bot extends AbstractPlayer {
    // https://www.tensorflow.org/tutorials/reinforcement_learning/actor_critic

}