import { Cell, Wall } from './Cell.js'


export class Field {
    constructor(width, height) {
        // private
        this._width = width;
        this._height = height;

        // public
        this.cells = new Map();

        this.constructField();
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    constructField() {
        for (let j = 0; j < this._height; j++) {
            for (let i = 0; i < this._width; i++) {
                let destroyed = i > this._width / 3 && i < 2 * this._width / 3 && j > this._height / 3 && j < 2 * this._height / 3;
                let cell = new Cell(i, j);
                if (!destroyed)
                    cell.content = new Wall(cell);
                this.cells.set(`${i}:${j}`, cell);
            }
        }
    }

    getCell(x, y) {
        let cell = this.cells.get(`${x}:${y}`);
        // console.log(`Field get cell ${x}:${y}: ${cell}`);
        return cell;
    }

    underBombThreat(x, y) {
        let threat = false;
        threat |= this.getDirectionCell(x, y, 0, 0)?.bomb ? true : false;
        threat |= this.getDirectionCell(x, y, 1, 0)?.bomb ? true : false;
        threat |= this.getDirectionCell(x, y, -1, 0)?.bomb ? true : false;
        threat |= this.getDirectionCell(x, y, 0, 1)?.bomb ? true : false;
        threat |= this.getDirectionCell(x, y, 0, -1)?.bomb ? true : false;
        return threat;
    }

    getDirectionCell(x, y, dx, dy) {
        let cell = this.getCell(x + dx, y + dy);
        if (!cell) return null;
        if (cell._content.size > 0)
            return cell;
        if (dx === 0 && dy === 0)
            return null;
        return this.getDirectionCell(x + dx, y + dy, dx, dy);
    }
}
