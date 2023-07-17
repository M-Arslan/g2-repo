import {
    IconButton,
    ButtonGroup,
    Dialog,
    DialogContent,
    Slide,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import React from 'react';
import styled from 'styled-components';
import {
    Spinner,
} from '../../Core/Forms/Common';
import { AppContainer } from '../Claim/Tabs/TabContainer';
import { InfoSectionSelector } from './Components/InfoSectionSelector';
import { ClaimSupportMenu } from './Components/ClaimSupportMenu';

const TabContainer = styled.article`
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
    border: 0;
    background: white;
    overflow-x: hidden;
    overflow-y: auto;
`;



const ContentRow = styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
`;

const ContentCell = styled.div`
    width: ${props => props.width || '50%'};
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
    padding: .5em;
`;

const Toolbar = styled.nav`
    width: 100%;
    height: auto;
    padding: 0;
    margin: 0;
    border: 0;
    border-top: solid 1px rgb(170, 170, 170);
    border-bottom: solid 1px rgb(170, 170, 170);
    background-color: ${props => props.theme.backgroundDark};

    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-content: center;
    align-items: center;
`;
const Title = styled.div`
    display: flex;
    padding: 12px;
    font-weight: bold;
`;


export const ClaimSupportApp = ({ users,claim,policy, NotificationID, handleDetail, claimMasterID }) => {
    const reducer = (state, action) => {
        switch (action.type) {
            case 'UPDATE_UNIVERSAL_REQUEST':
                return Object.assign({}, state, action.request);
            default:
                return state;
        }
    };
    const initialState = {
        currentPropertyInsuranceLossRegister: {},
        propertyPolicCoding: {},
        isProcessing: false,
        isSaving: false,
        editMode: false,
        addressStates: [],
        selectedPaymentIndex: -1,
        selectedICDCodeIndex: -1,
        errorMessages: [],
        selectedMenu : 'CLAIMSUPPORT',
        showErrorMessages: false,
        currentCMSRejectedLog: {},
        cMSRejectedLogKey: 787,
        helpContainerName: 'PropertyInsuranceLossRegisters',
        claim: claim,
        insuredContact: {},
        users: [],
        isClaimAccountant: false,
        show: false,
        claimDetail: null,
    };

    const [request, dispatch] = React.useReducer(reducer, initialState);

    const goback = () => {
        handleDetail();
    }

    const handleShow = () => {
        goback();
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, show: false, claimDetail:null } }); 
    /*    $dispatch(claimActions.clearStatus());*/
    };


    return (
        request.isProcessing  ? <Spinner /> :
            <>
                <ErrorListDialog request={request} dispatch={dispatch} />

                <AppContainer>
                    <Toolbar>
                        <ButtonGroup variant="text">
                            <IconButton name="Cancel" title="Go Back" onClick={() => handleShow()}><ArrowBack /></IconButton>
                        </ButtonGroup>
                        <Title>Claim Support Dashboard</Title>
                        <ButtonGroup>

                        </ButtonGroup>
                    </Toolbar>

                    <TabContainer>

                            <ContentRow>
                                <ContentCell width="80%" >
                                <InfoSectionSelector policy={policy} users={users} claimMasterID={claimMasterID} NotificationID={NotificationID} claim={claim} request={request} dispatch={dispatch} />
                                </ContentCell>
                                <ContentCell width="20%" style={{ justifyContent: "flex-start", alignItems: "flex-start" }}>
                                    <ClaimSupportMenu request={request} dispatch={dispatch}  />
                                </ContentCell>
                            </ContentRow >
                           
                    </TabContainer>

                </AppContainer>

            </>
    );
};



const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export default function ErrorListDialog({ request, dispatch }) {

    const handleClose = () => {
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, showErrorMessages: false } });
    };

    return (
        <div>
            <Dialog
                open={request.showErrorMessages}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
                style={{ backgroundColor: 'transparent' }}

            >
                <DialogContent style={{ backgroundColor: '#d32f2f' }}>
                    <div>
                        {
                            request.errorMessages.map(item =>
                                <>       <span style={{ color: '#fff', fontSize: '0.875rem', fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', fontWeight: '400', padding: '10px,10px,10px,10px' }}>
                                    {item}
                                </span>
                                    <br />
                                </>
                            )
                        }
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}


