import { Bomb, BombFeature } from './Bomb.js';
import { CellContent } from './Cell.js';


class PlayerFeature {
    constructor() {
        this.speed = 2;         // speed of moving
        this.bombCapacity = 1;
        this.bombFeature = new BombFeature();
    }
}

class AbstractPlayer extends CellContent {
    constructor(name, cell, field) {
        super(cell);
        cell.content = this;
        // private
        this._destoyed_score = 5;
        this._freeToMove = true;
        this._destructibleContent = true;

        this._score = 0;
        this._name = name;
        this._field = field;
        this._moveCallbacks = new Set();
        this._diedCallbacks = new Set();

        // public
        this.features = new PlayerFeature();

        this._state = {
            hasDied: false,
            bombsAmount: 0,
        };
    }

    get isDied() {
        return this._state.hasDied;
    }

    get score() {
        return this._score;
    }

    set diedCallback(callback) {
        this._diedCallbacks.add(callback);
    }

    #notifyDied() {
        for (let callback of this._diedCallbacks)
            callback();
    }

    set moveCallback(callback) {
        this._moveCallbacks.add(callback);
    }

    #notifyMoved() {
        for (let callback of this._moveCallbacks)
            callback();
    }

    move(dx, dy) {
        if (this.isDied) return;

        let cell = this._field.getCell(this.x + dx, this.y + dy);
        if (!cell) return;
        if (!cell.moveAvailable) return;
        console.log(`${this} move to ${cell} dx(${dx}) dy(${dy})`);
        // cell.applyBonus(this.features);

        // move player to other cell
        this.cell.deleteContent(this);
        cell.content = this;
        this.cell = cell;
        this.#notifyMoved();
    }

    placeBomb() {
        if (this.isDied) return;

        if (this._state.bombsAmount >= this.features.bombCapacity) {
            console.log(`Max bomb amount ${this._state.bombsAmount}`);
            return;
        }

        if (this.cell.moveAvailable) {
            let bomb = new Bomb(this, this._field);
            this._state.bombsAmount += 1;
            console.log(`Place ${bomb}`);
        }
        else {
            console.log(`Cell ${this.cell} already has: ${Array.from(this.cell.content).join(", ")}`);
        }
    }

    // underBombThreat() {
    //     let threat = false;
    //     threat |= this._field.getDirectionCell(this.x, this.y, 0, 0)?.bomb ? true : false;
    //     threat |= this._field.getDirectionCell(this.x, this.y, 1, 0)?.bomb ? true : false;
    //     threat |= this._field.getDirectionCell(this.x, this.y, -1, 0)?.bomb ? true : false;
    //     threat |= this._field.getDirectionCell(this.x, this.y, 0, 1)?.bomb ? true : false;
    //     threat |= this._field.getDirectionCell(this.x, this.y, 0, -1)?.bomb ? true : false;
    //     return threat;
    // }

    bombExploded(score) {
        this._score += score;
        console.log(`${this} got score: ${this._score}`);
        this._state.bombsAmount -= 1;
        if (this._state.bombsAmount < 0)
            console.log(`${this} has bombsAmount < 0!`);
    }

    destroyContent() {
        if (this.isDied) return;

        console.log(`${this} has died!`);
        this._state.hasDied = true;
        this.#notifyDied();
    }

    toString() {
        return `${this._name}`;
    }
}

export class Player extends AbstractPlayer {

}


export class Bot extends AbstractPlayer {
    static THREAT_BOMB_REWARD = -1;
    static INLINE_PLAYER_REWARD = 0.2;
    static INLINE_WALL_REWARD = 0.03;
    static PLACED_BOMB_REWARD = 0.1;
    static botNumber = 1;

    // https://www.tensorflow.org/tutorials/reinforcement_learning/actor_critic
    constructor(cell, field, name = '') {
        if (name === '') {
            name = `Bot_${Bot.botNumber}`;
            Bot.botNumber += 1;
        }
        super(name, cell, field);

        this._waitCounter = 0;
        this._lastAction = 0;
        this._lastCell = this.cell;
        // this._lastState = this.stateFromField(field).concat(this.botState);
        this._lastState = this.botState;

        this.actions = [
            () => this.move(1, 0),
            () => this.move(-1, 0),
            () => this.move(0, 1),
            () => this.move(0, -1),
            // () => console.log(`${this} wait...`),
            () => this.placeBomb(),
        ];

        this._a2c = null;

        this._was_ubt = false;
    }

    set a2c(a2c) {
        this._a2c = a2c;
        setTimeout(() => this.training(), 2000);
    }

    training() {
        // save last cell and do action
        let action = this._a2c.get_action(this._lastState);
        let reward = this.getReward(action);
        this.actions[action]();

        if (action === 4 && this._lastAction === 4) {
            this._waitCounter += 1;
            if (this._waitCounter > 20)
                this.destroy();
        }
        else {
            this._waitCounter = 0;
        }

        // new state after action
        let state = this.botState;

        // train a2c
        this._a2c.train(
            this._lastState,
            action,
            reward,
            state,
            this.isDied).then(
                () => {
                    if (!this.isDied)
                        setTimeout(() => this.training(), 200);
                }
            );

        // update state
        this._lastAction = action;
        this._lastCell = this.cell;
        this._lastState = state;
    }

    get botState() {
        let state = [];

        // placed bombs amount
        state.push(this._state.bombsAmount / this.features.bombCapacity);
        // moving direction
        state.push(this.x - this._lastCell.x);
        state.push(this.y - this._lastCell.y);
        // walls environment
        // TODO: надо поменять стену на проверку, что туда можно переместиться
        state.push(this._field.getCell(this.x - 1, this.y)?.wall ? 1 : 0);
        state.push(this._field.getCell(this.x + 1, this.y)?.wall ? 1 : 0);
        state.push(this._field.getCell(this.x, this.y + 1)?.wall ? 1 : 0);
        state.push(this._field.getCell(this.x, this.y - 1)?.wall ? 1 : 0);
        // bot under bomb threat
        state.push(this._field.getDirectionCell(this.x, this.y, 0, 0)?.bomb ? 1 : 0);
        state.push(this._field.getDirectionCell(this.x, this.y, 1, 0)?.bomb ? 1 : 0);
        state.push(this._field.getDirectionCell(this.x, this.y, -1, 0)?.bomb ? 1 : 0);
        state.push(this._field.getDirectionCell(this.x, this.y, 0, 1)?.bomb ? 1 : 0);
        state.push(this._field.getDirectionCell(this.x, this.y, 0, -1)?.bomb ? 1 : 0);
        // cell under bomb threat
        state.push(this._field.underBombThreat(this.x + 1, this.y) ? 1 - state[7] : 0);
        state.push(this._field.underBombThreat(this.x - 1, this.y) ? 1 - state[7] : 0);
        state.push(this._field.underBombThreat(this.x, this.y + 1) ? 1 - state[7] : 0);
        state.push(this._field.underBombThreat(this.x, this.y - 1) ? 1 - state[7] : 0);

        let i = 0;
        let s = `ba:${state[i++]} | dx:${state[i++]} dy:${state[i++]} |`
        s += ` wl:${state[i++]} wr:${state[i++]} wt:${state[i++]} wb:${state[i++]} |`
        s += ` b:${state[i++]} bl:${state[i++]} br:${state[i++]} bt:${state[i++]} bb:${state[i++]}|`
        s += ` ct_r:${state[i++]} ct_l:${state[i++]} ct_b:${state[i++]} ct_t:${state[i++]}`
        console.log(`Bot ${this.cell} state:\n\t${s}`);
        return state;
    }

    getReward(action) {
        // надо смываться а он бомбы ставит
        if (this._lastAction === 5 && action === 5)
            return -2;

        // наградим за то что поставил бомбу
        if (action === 5) {
            return 0.5;
        }

        if (this._field.underBombThreat(this.x, this.y)) {
            this._was_ubt = true;
            return Bot.THREAT_BOMB_REWARD;
        }
        else{
            if (this._was_ubt){
                this._was_ubt = false;
                return 5;
            }
        }

        // let reward = 0.05;

        // // награда за количество поставленных бомб
        // if (this._state.bombsAmount !== 0)
        //     reward += this._state.bombsAmount * Bot.PLACED_BOMB_REWARD;

        // накажем за бездействие
        if (this._lastCell === this.cell) {
            // reward += -0.2;
            return -0.2;
        }

        return 0;
        // if (action === 0 && !this._field.getCell(this.x + 1, this.y)?.moveAvailable) {
        //     reward += -0.5;
        //     console.log('Move right prohibited!');
        // }
        // if (action === 1 && !this._field.getCell(this.x - 1, this.y)?.moveAvailable) {
        //     reward += -0.5;
        //     console.log('Move left prohibited!');
        // }
        // if (action === 2 && !this._field.getCell(this.x, this.y + 1)?.moveAvailable) {
        //     reward += -0.5;
        //     console.log('Move bottom prohibited!');
        // }
        // if (action === 3 && !this._field.getCell(this.x, this.y - 1)?.moveAvailable) {
        //     console.log('Move top prohibited!');
        //     reward += -0.5;
        // }
        // return reward;
    }
}