import { AttachMoney, Block, Details, Gavel, LocalHospital, Person } from '@mui/icons-material';
import {
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { ROLES } from '../../../../../Core/Enumerations/security/roles';
import { Panel, PanelContent, PanelHeader } from '../../../../../Core/Forms/Common';
import { userSelectors } from '../../../../../Core/State/slices/user';


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,

        margin: '0px',
    },
}));
const ContentRow = styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
`;

const ContentCell = styled.div`
    width: ${props => props.width || '50%'};
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    padding: .5em;
`;

export const WCClaimantMenu = ({ request, dispatch, formValidator }) => {
    const triggerValidation = formValidator?.trigger;
    const $auth = useSelector(userSelectors.selectAuthContext());
    const isClaimExaminerOrAccountant = $auth.isInRole(ROLES.Claims_Examiner) || $auth.isInRole(ROLES.Claims_Accountant);

    const classes = useStyles();
    const onMenuClicked = async (e, name) => {
        let originalClaimant = JSON.parse(JSON.stringify(request.originalClaimant));
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimant: originalClaimant, selectedMenu: e, helpContainerName: name, currentCMSRejectedLog: {} } });

    }
    //const validate = async () => {
    //    let isValid = true;
    //    if (request.selectedMenu === "WCCLAIMANT") {
    //        isValid = await validateClaimant(triggerValidation);
    //    }

    //    return isValid;
    //}

    return (
        <Panel padding="0" margin="0" border="0">
            <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Claimant Information</span></PanelHeader>

            <PanelContent>
                <ContentRow>
                    <ContentCell width="100%" >
                        <List component="nav" className={classes.root} aria-label="mailbox folders">
                            <ListItem button onClick={() => { onMenuClicked("WCCLAIMANT", "Claimant Details") }} selected={request.selectedMenu === "WCCLAIMANT"}>
                                <ListItemIcon>
                                    <Details />
                                </ListItemIcon>
                                <ListItemText primary="WC Claimant Details" secondary="WC Claimant Details" />
                            </ListItem>
                        </List>
                    </ContentCell>
                </ContentRow >
            </PanelContent>
        </Panel>
    );
};




