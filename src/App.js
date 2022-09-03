import React from 'react';
import { Player, Bot } from './Player.js'
import { Field } from './Field.js'
import { A2CAgent } from './nn.js';
import { PlayerComponent, BotComponent } from './components/PlayerComponent.js';
import { FieldComponent } from './components/FieldComponent.js';


class App extends React.Component {
  constructor(props) {
    super(props);

    this.field = new Field(21, 11);
    this.player = null;
    this.bots = [];
    
    this.state = {
      field: null,
      player: null,
      bots: [],
    };
    
    // this.player = new Player("PLayer1", this.field.getCell(10, 6), this.field);
    let bot = new Bot(this.field.getCell(12, 6), this.field);
    this.a2c = new A2CAgent(bot.botState.length, bot.actions.length);
    
    this.addBot(12, 7);
    this.addBot(11, 6);
    this.addBot(10, 5);
    this.addBot(9, 4);

    setTimeout(() => this.trainingBot(), 2000);
  }

  componentDidMount() {
    this.setState({
      field: this.field,
      player: this.player,
      bots: this.bots,
    });
  }

  addBot(x, y, botName = '') {
    let bot = new Bot(this.field.getCell(x, y), this.field);
    bot.a2c = this.a2c;
    bot.diedCallback = () => setTimeout(() => {
      // resapawn bot
      this.addBot(x, y);
    }, 1000);
    this.bots.push(bot);
    console.log(`${bot} was born!`);

    this.setState({ bots: this.bots });
  }

  async trainingBot(){
    for (let bot of this.bots) {
      await bot.training();
    }
    this.bots = this.bots.filter(function (bot) {
      return !bot.isDied;
    });
    this.setState({
      bots: this.bots
    });
    setTimeout(() => this.trainingBot(), 200);
  }

  render() {
    return (
      <>
        {this.state.field && <FieldComponent field={this.state.field} />}
        {this.state.player && <PlayerComponent player={this.state.player} />}
        {this.state.bots.map(bot => <BotComponent key={`${bot}`} player={bot} />)}
      </>
    );
  }
}

export default App;
