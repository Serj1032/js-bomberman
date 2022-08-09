import React from 'react';
import { Player, Bot} from './Player.js'
import { Field } from './Field.js'
import { PlayerComponent, BotComponent } from './components/PlayerComponent.js';
import { FieldComponent } from './components/FieldComponent.js';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.field = new Field(21, 11);
    this.player = new Player("PLayer1", this.field.getCell(10, 6), this.field);
    this.bot = new Bot("Bot1", this.field.getCell(12, 6), this.field);

    this.state = {
      field: this.field,
      player: this.player,
      bot: this.bot,
    };
  }

  render() {
    return (
      <>
        <FieldComponent field={this.state.field} />
        <PlayerComponent player={this.state.player} />
        <BotComponent player={this.state.bot} />
      </>
    );
  }
}

export default App;
