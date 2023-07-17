import styled from 'styled-components';

export const FieldContainer = styled.div`
    width: 100%;
    height: 50px;
    padding: .50em 1em;
    margin-bottom: 1em;
`;

export const DescriptionContainer = styled.div`
    width: 100%;
    height: 100px;
    padding: .50em 1em;
    margin-bottom: 1em;
`;

export const ButtonContainer = styled.div`
    width: 100%;
    padding: 1em;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    align-content: center;
`;
export const DropdownContainer = styled.div`
    width: 100%;
    padding: 0.5em 1em 0 1em;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-content: center;
`;

export const ClaimUserContainer = styled.div`
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-content: center;
`;

export const ExaminerContainer = styled.div`
    width: 250px;
     padding: 0 !important;
`;


export const HorizontalDivider = styled.div`
    padding-left : 15px ; 
`


export const TitleContainer = styled.div`
    width: 100%;
    height: 50px;
    padding:15px;
`;

export const Container = styled.div`
   padding : 20px;
`;

export const ScrollPanel = styled.div`
    height: calc(100% - 38px);
    width: 100%;
    padding: 0;
    margin: 0;
    border: 0;
    overflow-x: hidden;
    overflow-y: auto;
`;

export const InputPanel = styled.div`
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-around;
    align-content: flex-start;
`;


export const ClaimLandingContainer = styled.div`
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
`;

export const ClaimLandingToolbar = styled.div`
    background-color: ${props => props.theme.backgroundDark};
    height: 36px;
    width: 100%;
    padding: 0;
    border-bottom: solid 1px ${props => props.theme.onBackground};

    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    align-content: center;
`;

export const Toolbuttons = styled.div`
    height: 36px;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-content: center;
`;

export const ClaimLandingHeader = styled.section`
    width: 100%;
    height:100%;
    padding: .5em;
    margin: 0;
    border: none;
    margin-bottom: .5em;
    background-color: ${props => props.theme.backgroundColor};
`;

export const ContentRow = styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: top;
    align-content: top;
    height:100%;
`;

export const ContentCell = styled.div`
    width: 80%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: top;
    align-content: top;
    padding: .5em;
`;
export const ContentCellHalf = styled.div`
    width: 20%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: top;
    align-content: top;
    padding: .5em;
`;

export const Title = styled.div`
    display: flex;
    padding: 12px;
    font-weight: bold;
`;

export const GridContainer = styled.div`
    height: 90%;
    width: 100%;
`;