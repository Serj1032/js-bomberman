import { Cell, Wall } from './Cell.js'


export class Field {
    constructor(width, height) {
        this.cells = new Map();
        this._width = width;
        this._height = height;
        this.#constructField();
    }

    #constructField() {
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

}
