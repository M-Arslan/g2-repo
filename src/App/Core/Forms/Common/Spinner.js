import styled from 'styled-components';
import {
    SpinnerAnimation
} from './Animations';

export const Spinner = styled.div`
    background: ${props => props.theme.primaryColor};
    animation: ${SpinnerAnimation} 1s infinite ease-in-out;
    width: 1em;
    height: 4em;
    color: ${props => props.theme.primaryColor};
    text-indent: -9999em;
    margin: 88px auto;
    position: relative;
    font-size: 11px;
    transform: translateZ(0);
    animation-delay: -0.16s;

    &:before, &:after {
        background: ${props => props.theme.primaryColor};
        animation: load1 1s infinite ease-in-out;
        width: 1em;
        height: 4em;
        position: absolute;
        top: 0;
        content: '';
    }

    &:before {
        left: -1.5em;
        animation-delay: -0.32s;
    }

    &:after {
        left: 1.5em;
    }
`;

