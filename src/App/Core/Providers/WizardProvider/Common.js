import styled from 'styled-components';

export const WizardContainer = styled.article`
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    border: 0;

    display: flex;
    flex-flow: column nowrap;
`;

export const WizardButtons = styled.footer`
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-content: center;
    align-items: center;
    height: 40px;
    width: 100%;
    border-top: solid 1px rgb(170, 170, 170);
    background-color: ${props => props.theme.backgroundDark};
    padding: 1em;
`;

export const ButtonContainer = styled.div`
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    align-content: center;
    padding: 0;
    margin: 0;
    border: 0;

    justify-content: ${props => (props.position === 'end' ? 'flex-end' : 'flex-start')};
    
    & > * {
        margin-left: ${props => (props.position === 'end' ? '1em' : '0')};
        margin-right: ${props => (props.position === 'end' ? '0' : '1em')};
    }
`;

export const WizardTitle = styled.header`
    display: flex;
    flex-flow: row nowrap;
    align-content: center;
    align-items: center;
    padding: .25em;
    height: 40px;
    width: 100%;
    background-color: ${({ theme }) => theme.primaryColor};
    color: ${({ theme }) => theme.onPrimary};
    border-bottom: solid 1px #dedede;
    
    & > h4 {
        margin: 0;
        display: flex;
        flex-flow: row nowrap;
        align-content: center;
        align-items: center;
    }
`;

export const WizardContent = styled.main`
    height: calc(100% - 80px);
    width: 100%;
    padding: 0;
    margin: 0;
    border: 0;

    overflow-x: hidden;
    overflow-y: auto;
`;

export const SlidePanel = styled.section`
    height: 100%;
    width: 100%;
    top: 0;
    left: 105%;
`;