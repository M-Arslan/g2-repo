import styled from 'styled-components';

export const SideBySidePanel = styled.section`
    display: flex;
    flex-flow: row nowrap;
    justify-content: stretch;
    align-content: stretch;
    align-items: stretch;
    width: ${props => props.width || '100%'};
    min-width: 250px;
    max-width: 100%;
    height: ${props => props.height || '90%'};
    min-height: 250px;
    max-height: 100%;
`;

export const LeftPanel = styled.div`
    height: 100%;
    width: 50%;
    padding: ${props => props.padding || '0'};
    margin: 0;
    border-right: solid 1px ${props => props.theme.primaryColor};
`;

export const RightPanel = styled.div`
    height: 100%;
    width: 50%;
    padding: ${props => props.padding || '0'};
    margin: 0;
    border-right: solid 1px ${props => props.theme.primaryColor};
`;