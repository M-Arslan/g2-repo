import React from 'react';
import styled from 'styled-components';
import {
    Icon
} from '@mui/material';
import {
    Lock
} from '@mui/icons-material';

const ErrorMessage = styled.div`
    width: 100%;
    height: 100%;

    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-content: center;
    align-items: center;
`;

const MessageContainer = styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-content: center;
    padding: 2em;

    width: 50%;
    height: 50%;
    background-color: rgba(240, 240, 255, .75);
    color: ${props => (props.error ? 'rgba(128, 45, 45, 1)' : props.theme.primaryColor)};
    border: solid 2px ${props => (props.error ? 'rgba(128, 45, 45, 1)' : props.theme.primaryColor)};
    border-radius: 5px;

    & > div {
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-content: center;
        align-items: center;
    }
`;

const Title = styled.h2`
    width: 100%;
`;

const Message = styled.p`
`;

export const Unauthorized = () => {
    return (
        <ErrorMessage>
            <MessageContainer error={true}>
                <div style={{ paddingRight: '4em' }}>
                    <Icon style={{ fontSize: '96px' }}>warning_rounded</Icon>
                </div>
                <div>
                    <div>
                        <Title>Unauthorized</Title>
                        <Message>
                                You are not authorized to access this system. Please contact the system administrator for assistance.
                        </Message>
                    </div>
                </div>
            </MessageContainer>
        </ErrorMessage>
    );
}

export const Unauthenticated = () => {
    return (
        <ErrorMessage>
            <MessageContainer>
                <div style={{ paddingRight: '4em' }}>
                    <Lock style={{ fontSize: '96px' }} />
                </div>
                <div>
                    <div>
                        <Title>Authenticating</Title>
                        <Message>
                            We are currently trying to log you in.  Please wait a moment.
                        </Message>
                    </div>
                </div>
            </MessageContainer>
        </ErrorMessage>
    );
}