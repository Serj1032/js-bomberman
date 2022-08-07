import React from 'react';
import { Cell, CellComponent } from './Cell.js'
import { BombComponent } from './Bomb.js'


export class Field {
    constructor(width, height) {
        this.cells = [];
        this.width = width;
        this.height = height;
        this.bombs = [];
        this.constructField();

        this.bombPlaceCallback = null;
    }

    constructField() {
        for (let j = 0; j < this.height; j++) {
            for (let i = 0; i < this.width; i++) {
                let destroyed = i > this.width / 3 && i < 2 * this.width / 3 && j > this.height / 3 && j < 2 * this.height / 3;
                this.cells.push(new Cell(i, j, destroyed));
            }
        }
    }

    getCell(x, y) {
        let cell = this.cells[this.width * y + x];
        // console.log(`Field get cell ${x}:${y}: ${cell}`);
        return cell;
    }

    placeBomb(bomb) {
        bomb.explosionCallback.push(this.bombExplosionHandler.bind(this));
        this.bombs.push(bomb);
        if (this.bombPlaceCallback)
            this.bombPlaceCallback();
    }

    bombExplosionHandler(bomb) {
        let xl = bomb.x;
        let xr = bomb.x;
        let yt = bomb.y;
        let yb = bomb.y;
        while (xl >= 0 && xl < this.width && Math.abs(bomb.x - xl) <= bomb.features.strength) {
            let cell = this.getCell(xl, bomb.y);
            if (!cell.destroyed) {
                cell.blowUp();
                break
            };
            xl -= 1;
        }
        while (xr >= 0 && xr < this.width && Math.abs(bomb.x - xr) <= bomb.features.strength) {
            let cell = this.getCell(xr, bomb.y);
            if (!cell.destroyed) {
                cell.blowUp();
                break;
            }
            xr += 1;
        }
        while (yt >= 0 && yt < this.height && Math.abs(bomb.y - yt) <= bomb.features.strength) {
            let cell = this.getCell(bomb.x, yt);
            if (!cell.destroyed) {
                cell.blowUp();
                break;
            }
            yt -= 1;
        }
        while (yb >= 0 && yb < this.height && Math.abs(bomb.y - yb) <= bomb.features.strength) {
            let cell = this.getCell(bomb.x, yb);
            if (!cell.destroyed) {
                cell.blowUp();
                break;
            }
            yb += 1;
        }
    }
}


export class FieldComponent extends React.Component {

    constructor(props) {
        super(props);
        this.field = props.field;
        this.state = {
            bombs: props.field.bombs,
            cells: props.field.cells,
            width: props.field.width,
            height: props.field.height,
        };

        this.field.bombPlaceCallback = this.bombPlaceHandler.bind(this);
    }

    bombPlaceHandler() {
        this.setState({ bombs: this.field.bombs });
    }

    render() {
        return (
            <>
                {this.state.cells.map((cell) =>
                    <CellComponent
                        key={`cell:${this.state.width * cell.x + cell.y}`}
                        cell={cell}
                    />)}
                {this.state.bombs.map((bomb) =>
                    <BombComponent
                        key={`bomb:${this.state.width * bomb.x + bomb.y}`}
                        bomb={bomb}
                    />)}
            </>);
    }
}