import { Player } from "./Player.js";
import { Bomb } from "./Bomb.js";

export class CellContent {
    constructor(cell) {
        // private
        this._destoyed_score = 0;
        this._movable = false;
        this._freeToMove = false;
        this._destructibleContent = true;

        // public
        this.cell = cell;
        this.destroyCallback = null;
    }

    get x() {
        return this.cell.x;
    }

    get y() {
        return this.cell.y;
    }

    get moveable() {
        return this._movable;
    }

    get freeToMove() {
        return this._freeToMove;
    }

    get destoyed_score() {
        return this._destoyed_score;
    }

    // applyBonus(playerFeature) {
    //     console.log(`Cell content has not bonus for player`);
    // }

    destroyContent() {
        // console.log(`Idle destroy of ${this}`);
    }

    destroy() {
        this.destroyContent();
        if (this.destroyCallback)
            this.destroyCallback();
        return this._destructibleContent;
    }
}

export class Cell {
    constructor(x, y) {
        // private
        this._content = new Set();

        // public
        this.x = x;
        this.y = y;
        this.contentUpdated = null;
    }

    set content(new_content) {
        this._content.add(new_content);
        if (this.contentUpdated)
            this.contentUpdated();
    }

    hasContent(contentObj) {
        return this._content.has(contentObj);
    }

    deleteContent(content) {
        if (this._content.has(content)) {
            // console.log(`Content ${content} deleted from cell ${this}`);
            this._content.delete(content);
        }
    }

    get content() {
        return this._content;
    }

    get moveAvailable() {
        let res = true;
        for (let content of this._content)
            res &= content.freeToMove;
        return res;
    }

    get destroyScore() {
        let res = 0;
        for (let content of this._content)
            res += content.destoyed_score;
        return res;
    }

    get contentType() {
        let type = 0;  // 0 is empty

        // cell can containt more 1 content only if has player and bomb
        // we prefer bomb content, because if player stayed in bomb he will die
        if (this.bomb) type = 0.1;
        else if (this.players.length > 0) type = 0.2;
        else if (this.wall) type = 0.3;

        return type;
    }

    get bomb() {
        for (let content of this._content) {
            if (content instanceof Bomb) {
                console.log(`${this} has ${content}`);
                return content;
            }
        }
        return null;
    }

    get wall() {
        for (let content of this._content) {
            if (content instanceof Wall)
                return content;
        }
        return null;
    }

    get players() {
        let players = [];
        for (let content of this._content) {
            if (content instanceof Player)
                players.push(content);
        }
        return players;
    }

    // applyBonus(playerFeature) {
    //     if (this._content)
    //         this._content.applyBonus(playerFeature);
    // }

    destroy() {
        let res = false;
        for (let content of this._content.values()) {
            res |= content.destroy();
            this.deleteContent(content);
        }
        return res;
    }

    toString() {
        return `${this.x}:${this.y}`;
    }
}

export class Wall extends CellContent {
    constructor(cell) {
        super(cell);
        // this.destroyCallback = null;
        this._destoyed_score = 2;
        this._destructibleContent = true;
    }

    toString() {
        return `Wall ${this.cell}`;
    }
}