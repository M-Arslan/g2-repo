import React from 'react';
import styled from 'styled-components';

const FinishedContainer = styled.article`
    width: 100%;
    height: 100%;
    padding: 2em;

    & > * {
        width: 100%;
    }
`;

export const Completed = ({ state }) => {
    return (
        <FinishedContainer>
            <h2>Your correspondence has been saved</h2>
            {
                (state.status === 0 ?
                    <div>A draft of your email has been saved. It has not been delivered to the recipient.  Please edit the correspondence from the list and select the "Send" button in order to send the email to the designated recipients.</div>
                    : <div>Your correspondence email has been sent to the designated recipients.</div>)
            }
        </FinishedContainer>
    );
}