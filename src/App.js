import React from 'react';
import { Field, FieldComponent } from './Field.js'
import { Player, PlayerComponent } from './Player.js';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.field = new Field(21, 11);
    this.player = new Player(10 ,6, this.field);
    
    this.state = {
      field: this.field,
      player: this.player,
    };
  }

  render() {
    return (
      <>
        <FieldComponent field={this.state.field} />
        <PlayerComponent key="player" player={this.state.player} />
      </>
    );
  }
}

export default App;
