import { CellContent } from './Cell.js';

export class BombFeature {
    constructor() {
        this.strength = 3;  // length of explosion
        this.timer = 2000;  //milliseconds
    }
}


export class Bomb extends CellContent {
    constructor(cell, owner, field) {
        super(cell);
        this._field = field;
        this._owner = owner;
        this._exploded = false;

        this.explosionTimer = setTimeout(() => this.destroy(), this.features.timer);
        this._updated = null;
    }

    get owner() {
        return this._owner;
    }

    get features() {
        return this._owner.features.bombFeature;
    }

    get exploded() {
        return this._exploded;
    }

    #destroyDirection(x, y, dx, dy, depth) {
        if (depth < 0) return;
        let cell = this._field.getCell(x + dx, y + dy);
        if (!cell) return;
        if (cell.destroy()) return;
        this.#destroyDirection(x + dx, y + dy, dx, dy, depth - 1);
    }

    destroyContent() {
        if (this._exploded) return true;
        // console.log(`${this} exploded!`);
        this._exploded = true;
        this.#destroyDirection(this.x, this.y, 1, 0, this.features.strength - 1);
        this.#destroyDirection(this.x, this.y, -1, 0, this.features.strength - 1);
        this.#destroyDirection(this.x, this.y, 0, 1, this.features.strength - 1);
        this.#destroyDirection(this.x, this.y, 0, -1, this.features.strength - 1);
        
        this._field.getCell(this.x, this.y).content = null;
        this._owner.bombExploded(this);
        clearInterval(this.explosionTimer);
        if (this._updated) {
            this._updated();
        }
        return true;
    }

    toString() {
        return `bomb ${this.x}:${this.y}`;
    }
}


