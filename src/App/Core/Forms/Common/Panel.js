import styled from 'styled-components';

const Panel = styled.section`
    width: ${props => props.width || '100%'};
    min-height: ${props => props.minHeight || props.height || 'auto'};
    height: ${props => props.height || 'auto'};
    padding: ${props => props.padding || '0'};
    margin: ${props => props.margin || '0'};
    border: solid ${props => props.border || '1px'} ${props => props.theme.primaryColor};
    display: flex;
    flex-flow: column nowrap;
    overflow: ${props => (props.scrollable ? 'auto' : 'visible')};
`;

const PanelHeader = styled.header`
    width: 100%;
    height: 40px;
    padding: .5em;
    display: flex;
    flex-flow: row no-wrap;
    justify-content: space-between;
    align-content: center;
    border-bottom: solid 1px ${props => props.theme.onBackground};
    background-color: ${props => props.theme.primaryColor};
    color: ${props => props.theme.onPrimary};

    & > span {
        font-weight: normal;
        font-size: 14px;
    }
`;

const PanelTitle = styled.h2`
    display: inline-block;
    font-size: 14px;
    font-weight: bold;
    padding: 0;
    margin: 0;
    border: 0;
`;

const PanelContent = styled.main`
    height: 100%;
    width: 100%;
    padding: ${props => props.padded ? '1em' : '0'};
`;

export { Panel, PanelHeader, PanelTitle, PanelContent };
