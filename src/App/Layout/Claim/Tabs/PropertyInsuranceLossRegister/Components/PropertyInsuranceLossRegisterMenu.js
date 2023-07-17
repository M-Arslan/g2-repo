import {
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import styled from 'styled-components';
import { Panel, PanelContent, PanelHeader } from '../../../../../Core/Forms/Common';
import { Details } from '@mui/icons-material';

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

export const PropertyInsuranceLossRegisterMenu = ({ request, dispatch, formValidator }) => {
    const classes = useStyles();
    const onMenuClicked = async (e, name) => {
        //let originalClaimant = JSON.parse(JSON.stringify(request.originalClaimant));
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, selectedMenu: e, helpContainerName: name, currentCMSRejectedLog: {} } });

    }

    return (
        <Panel padding="0" margin="0" border="0">
            <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>PILR Information</span></PanelHeader>
            <PanelContent>
                <ContentRow>
                    <ContentCell width="100%" >
                        <List component="nav" className={classes.root} aria-label="mailbox folders">
                            <ListItem button onClick={() => { onMenuClicked("PILR", "Property Insurance Loss Register Details") }} selected={request.selectedMenu === "PILR"}>
                                <ListItemIcon>
                                    <Details />
                                </ListItemIcon>
                                <ListItemText primary="PILR Details" secondary="Property Insurance Loss Register Details" />
                            </ListItem>
                            <Divider />
                            {request.currentPropertyInsuranceLossRegister?.activityID &&
                                <ListItem button onClick={() => { onMenuClicked("ISSUELOG", "Issue Log") }} selected={request.selectedMenu === "ISSUELOG"}>
                                    <ListItemIcon>
                                        <Details />
                                    </ListItemIcon>
                                    <ListItemText primary="Issue Log" secondary="Issue Log" />
                                </ListItem>
                            }
                            <Divider />
                            {request.currentPropertyInsuranceLossRegister?.activityID &&
                                <ListItem button onClick={() => { onMenuClicked("ACTIVITYHISTORY", "ACTIVITYHISTORY") }} selected={request.selectedMenu === "ACTIVITYHISTORY"}>
                                    <ListItemIcon>
                                        <Details />
                                    </ListItemIcon>
                                    <ListItemText primary="Activity History" secondary="Activity History" />
                                </ListItem>
                            }
                            <Divider />
                        </List>
                    </ContentCell>
                </ContentRow>
            </PanelContent>
        </Panel>
    );
};




