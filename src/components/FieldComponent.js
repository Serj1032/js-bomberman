import React from 'react';
import { CellComponent } from './CellComponent.js'


export class FieldComponent extends React.Component {
    render() {
        return (
            <>
                {Array.from(this.props.field.cells, ([key, cell]) =>
                    <CellComponent
                        key={key}
                        cell={cell}
                    />)}
            </>);
    }
}