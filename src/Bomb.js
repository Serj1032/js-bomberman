import { CellContent } from './Cell.js';

export class BombFeature {
    static MAX_BOMB_TIMER = 5000;
    constructor() {
        this.strength = 3;  // length of explosion
        this.timer = 2000;  //milliseconds
    }
}


export class Bomb extends CellContent {
    constructor(owner, field) {
        super(owner.cell);
        this.cell.content = this;
        this._field = field;
        this._owner = owner;
        this._exploded = false;
        this._destoyed_score = -5;
        this._destructibleContent = true;

        this.explosionTimer = setTimeout(() => this.destroy(), this.features.timer);
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
        if (depth < 0) return 0;
        let cell = this._field.getCell(x + dx, y + dy);
        let score = 0;
        if (cell) {
            score += cell.destroyScore;
            if (!cell.destroy())
                score += this.#destroyDirection(x + dx, y + dy, dx, dy, depth - 1);
        }
        return score;
    }

    destroyContent() {
        if (this._exploded) return;
        
        let score = 0;
        // console.log(`${this} exploded!`);
        this._exploded = true;
        score += this.#destroyDirection(this.x, this.y, 1, 0, this.features.strength - 1);
        score += this.#destroyDirection(this.x, this.y, -1, 0, this.features.strength - 1);
        score += this.#destroyDirection(this.x, this.y, 0, 1, this.features.strength - 1);
        score += this.#destroyDirection(this.x, this.y, 0, -1, this.features.strength - 1);

        let cell = this._field.getCell(this.x, this.y);
        cell.deleteContent(this);

        score += cell.destroyScore;
        cell.destroy();  // there is may be player
        
        this._owner.bombExploded(score);
        
        clearInterval(this.explosionTimer);
    }

    toString() {
        return `Bomb ${this.cell}`;
    }
}


