import {
    Divider,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import styled from 'styled-components';
import { Panel, PanelContent, PanelHeader } from '../../../Core/Forms/Common';



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

export const ClaimSupportMenu = ({ request, dispatch }) => {

    const classes = useStyles();
    const onMenuClicked = async (e, name) => {
        //let originalClaimant = JSON.parse(JSON.stringify(request.originalClaimant));
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, selectedMenu: e } });

    }


    return (
        <Panel padding="0" margin="0" border="0">
            <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Claim Support Information</span></PanelHeader>
            <PanelContent>
                <ContentRow>
                    <ContentCell width="100%" >
                        <List component="nav" className={classes.root} aria-label="mailbox folders">
                            <ListItem button onClick={() => { onMenuClicked("CLAIMSUPPORT", "Claim Support") }} selected={request.selectedMenu === "CLAIMSUPPORT"}>
{/*                                <ListItemIcon>
                                    */}{/* <Details />*/}{/*
                                </ListItemIcon>*/}
                                <ListItemText primary="Claim Support" secondary="Claim Support" />
                            </ListItem>
                            <Divider />

                            <ListItem button onClick={() => { onMenuClicked("NOTIFICATIONCOMMENT", "Notification Comments") }} selected={request.selectedMenu === "NOTIFICATIONCOMMENT"}>
{/*                                <ListItemIcon>
                                   */}{/* <Details />*/}{/*
                                </ListItemIcon>*/}
                                <ListItemText primary="General Comments" secondary="General Comments" />
                            </ListItem>
                            <Divider />


                            <ListItem button onClick={() => { onMenuClicked("PRIORNOTIFICATIONS", "Activity Log") }} selected={request.selectedMenu === "PRIORNOTIFICATIONS"}>
                                <ListItemText primary="Activity Log" secondary="Activity Log" />
                            </ListItem>
                            <Divider />
                        </List>
                    </ContentCell>
                </ContentRow>
            </PanelContent>
        </Panel>
    );
};




