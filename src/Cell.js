
export class CellContent {
    constructor(cell) {
        this.cell = cell;
    }

    get x(){
        return this.cell.x;
    }

    get y(){
        return this.cell.y;
    }

    get moveAvailable() {
        return false;
    }

    applyBonus(playerFeature) {
        console.log(`Cell content has not bonus for player`);
        this.cell.content = null;
    }

    destroyContent() {
        throw new Error('destroyContent must be emplemented!');
    }

    destroy() {
        let res = this.destroyContent();
        this.cell.content = null;
        return res;
    }
}

export class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this._content = null;
        this.contentUpdated = null;
    }

    toString() {
        return `${this.x}:${this.y}`;
    }

    set content(new_content) {
        this._content = new_content;
        if (this.contentUpdated)
            this.contentUpdated();
    }

    get content() {
        return this._content;
    }

    get moveAvailable() {
        if (this._content)
            return this._content.moveAvailable;
        return true;
    }

    applyBonus(playerFeature) {
        if (this._content)
            this._content.applyBonus(playerFeature);
    }

    destroy() {
        let res = false;
        if (this._content)
            res = this._content.destroy();
        // this._content = null;
        return res;
    }

}

export class Wall extends CellContent {
    constructor(cell) {
        super(cell);
        // this._destroyed = false;
        this.destroyCallback = null;
    }

    destroyContent() {
        // this._destroyed = true;
        if (this.destroyCallback)
            this.destroyCallback();
        return true;
    }
}