import React, { Component } from 'react';
import styled from 'styled-components';
import {
    Button
} from '@mui/material';
import {
    Stop
} from '@mui/icons-material';

const ButtonContainer = styled.div`
    min-width: 50px;
    width: 100%;
    text-align: center;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-content: center;
    align-items: center;
    padding: 0;
    margin: 0;
`;

export class ButtonCellRenderer extends Component {
    constructor(props) {
        super(props);
        this.btnClickedHandler = this.btnClickedHandler.bind(this);
        this.btnDisabled = (typeof props.isDisabled === 'function' ? props.isDisabled(props.data) : (props.isDisabled === true));
    }

    btnClickedHandler() {
        this.props.clicked(this.props.data);
    }

    render() {
        const Icon = (this.props.icon || Stop);
        return <ButtonContainer><Button onClick={this.btnClickedHandler} disabled={this.btnDisabled}><Icon /></Button></ButtonContainer>;
    }
}
