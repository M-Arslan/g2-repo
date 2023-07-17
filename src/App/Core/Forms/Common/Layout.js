import styled from 'styled-components';

export const ContentRow = styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: ${props => (props.justify || 'flex-start')};
    align-items: center;
    align-content: center;
`;

export const ContentCell = styled.div`
    width: ${props => props.width || '50%'};
    display: flex;
    flex-flow: row nowrap;
    justify-content: ${props => (props.justify || 'flex-start')};
    align-items: center;
    align-content: center;
    padding: ${props => (props.padding || '1em')};
`;
