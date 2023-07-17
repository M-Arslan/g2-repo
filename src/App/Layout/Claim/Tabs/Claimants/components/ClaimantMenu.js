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
import { validateCIB } from '../validations/validateCIB';
import { validateClaimant } from '../validations/validateClaimant';


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

export const ClaimantMenu = ({ request, dispatch, formValidator }) => {
    const triggerValidation = formValidator.trigger;;
    const $auth = useSelector(userSelectors.selectAuthContext());
    const isClaimExaminerOrAccountant = $auth.isInRole(ROLES.Claims_Examiner) || $auth.isInRole(ROLES.Claims_Accountant);

    const classes = useStyles();
    const onMenuClicked = async (e,name) => {
        let originalClaimant = JSON.parse(JSON.stringify(request.originalClaimant));
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimant: originalClaimant, selectedMenu: e, helpContainerName: name, currentCMSRejectedLog: {} } });

    }
    //const validate = async () => {
    //    let isValid = true;
    //    if (request.selectedMenu === "CLAIMANT") {
    //        isValid = await validateClaimant(triggerValidation);
    //    }
    //    if (request.selectedMenu === "FILECIB") {
    //        isValid = await validateCIB(triggerValidation);
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
                            <ListItem button onClick={() => { onMenuClicked("CLAIMANT", "Claimant Details") }} selected={request.selectedMenu ==="CLAIMANT"}>
                                <ListItemIcon>
                                    <Details />
                                </ListItemIcon>
                                <ListItemText primary="Claimant Details" secondary="Claimant Details"/>
                            </ListItem>
                            <Divider />
                            {
                                (request.currentClaimant.medicareEligible && request.currentClaimant.cIBRequested && request.currentClaimant.bIClaimant && isClaimExaminerOrAccountant  ) && <>
                                    <ListItem button onClick={() => { onMenuClicked("MEDICARE", "Medicare Details") }} selected={request.selectedMenu === "MEDICARE"}>
                                        <ListItemIcon>
                                            <LocalHospital />
                                        </ListItemIcon>
                                        <ListItemText primary="Medicare Details" secondary="Medicare Details" />
                                    </ListItem>
                                    <Divider />
                                    <ListItem button onClick={() => { onMenuClicked("TPOCPAYMENT", "Medicare Payment") }} selected={request.selectedMenu === "TPOCPAYMENT"}>
                                        <ListItemIcon>
                                            <AttachMoney />
                                        </ListItemIcon>
                                        <ListItemText primary="Medicare Payment" secondary="Medicare Payment" />
                                    </ListItem>
                                    <Divider />
                                    <ListItem button onClick={() => { onMenuClicked("ICDCODE", "Medicare ICD Code") }} selected={request.selectedMenu === "ICDCODE"}>
                                        <ListItemIcon>
                                            <AttachMoney />
                                        </ListItemIcon>
                                        <ListItemText primary="Medicare ICD Code" secondary="Medicare ICD Code" />
                                    </ListItem>
                                    <Divider />
                                    < ListItem button onClick={() => { onMenuClicked("ATTORNEY", "Medicare Attorney") }} selected={request.selectedMenu === "ATTORNEY"}>
                                        <ListItemIcon>
                                            <Gavel />
                                        </ListItemIcon>
                                        <ListItemText primary="Medicare Attorney" secondary="Medicare Attorney" />
                                    </ListItem>
                                    <Divider />
                                    <ListItem button onClick={() => { onMenuClicked("CMSREJECTEDLOGS","CMS Rejected Logs") }} selected={request.selectedMenu === "CMSREJECTEDLOGS"}>
                                        <ListItemIcon>
                                            <Block />
                                        </ListItemIcon>
                                        <ListItemText primary="CMS Rejected Logs" secondary="CMS Rejected Logs" />
                                    </ListItem>
                                    <Divider />
                                </>
                            }
                            {(request.currentClaimant.claimantID && isClaimExaminerOrAccountant ) && <>
                                <ListItem button onClick={() => { onMenuClicked("FILECIB","CIB Details") }} selected={request.selectedMenu === "FILECIB"}>
                                    <ListItemIcon>
                                        <Person />
                                    </ListItemIcon>
                                    <ListItemText primary="CIB Details" secondary="CIB Details" />
                                </ListItem>
                                <Divider />
                            </>
                            }
                            {(window.location.href.toLowerCase().indexOf("activity") > -1 && isClaimExaminerOrAccountant ) ?
                                <>
                                    <ListItem button onClick={() => { onMenuClicked("FILECIBTASK", "CIB Task Details") }} selected={request.selectedMenu === "FILECIBTASK"}>
                                        <ListItemIcon>
                                            <Person />
                                        </ListItemIcon>
                                        <ListItemText primary="CIB Task Details" secondary="CIB Task Details" />
                                    </ListItem>
                                    <Divider />
          
                                </> : ''}
                            {(window.location.href.toLowerCase().indexOf("activity") > -1 && isClaimExaminerOrAccountant ) ?
                                <>
                                    <ListItem button onClick={() => { onMenuClicked("ISSUELOG", "Issue Logs") }} selected={request.selectedMenu === "ISSUELOG"}>
                                        <ListItemIcon>
                                            <Person />
                                        </ListItemIcon>
                                        <ListItemText primary="Issue Logs" secondary="Issue Logs" />
                                    </ListItem>
                                    <Divider />
                                </> : ''}
                            
                            {(window.location.href.toLowerCase().indexOf("activity") > -1 && isClaimExaminerOrAccountant  ) ? <>
                                <ListItem button onClick={() => { onMenuClicked("ACTIVITYHISTORY", "ACTIVITYHISTORY") }} selected={request.selectedMenu === "ACTIVITYHISTORY"}>
                                    <ListItemIcon>
                                        <Details />
                                    </ListItemIcon>
                                    <ListItemText primary="Activity History" secondary="Activity Logs" />
                                </ListItem>
                            </>
                                : ''
                            }
                        </List>
                    </ContentCell>
                </ContentRow >
            </PanelContent>
        </Panel>
    );
};




