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
import CalculateIcon from '@mui/icons-material/Calculate';
import PaymentIcon from '@mui/icons-material/Payment';
import HistoryIcon from '@mui/icons-material/History';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useSnackbar } from 'notistack';
import { isObjEmpty } from '../../../../../Core/Utility/common';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
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
export const ReimbursementMenu = ({ request, dispatch, formValidator }) => {
    const triggerValidation = formValidator.trigger;;
    const $auth = useSelector(userSelectors.selectAuthContext());
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();

    const onMenuClicked = async (e, name) => {
        let originalReimbursement = JSON.parse(JSON.stringify(request.originalReimbursement));        
        // if(e === "CALCULATION" && (request.CompanyDollarsList.length ==0 || isObjEmpty(request.currentPriorTPAPaid) || request.Adjustments.length == 0)){
        //     enqueueSnackbar("Please Enter Prior details First.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        //     return
        // }
        if(e === "CALCULATION") {
        if(request.CompanyDollarsList.length ==0 ){
            enqueueSnackbar("Please Enter Company Dollar First.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });

        }else if( isObjEmpty(request.currentPriorTPAPaid)){
            enqueueSnackbar("Please Enter Prior TPA details First.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            return

        }
        else if(request.Adjustments.length == 0){
            enqueueSnackbar("Please Enter Adjustment First.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            return
        }
        }
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentReimbursement: originalReimbursement, selectedMenu: e, helpContainerName: name, currentCMSRejectedLog: {} } });
    }
    return (
        <Panel padding="0" margin="0" border="0">
            <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Reimbursement Information</span></PanelHeader>
            <PanelContent>
                <ContentRow>
                    <ContentCell width="100%" >
                        <List component="nav" className={classes.root} aria-label="mailbox folders">
                            <ListItem button onClick={() => { onMenuClicked("REIMBURSEMENT", "Reimbursement Details") }}>
                                <ListItemIcon>
                                    <PaymentIcon />
                                </ListItemIcon>
                                <ListItemText primary="Reimbursement Details" secondary="Reimbursement Details" />
                            </ListItem>
                            <Divider />
                            {request.currentReimbursement.wCReimbursementID ?
                                <>
                             <ListItem button onClick={() => { onMenuClicked("COMPANYDOLLAR", "Company Dollars") }}>
                                <ListItemIcon>
                                    <AttachMoneyIcon />
                                </ListItemIcon>
                                <ListItemText primary="Company Dollars" secondary="Company Dollars"/>
                            </ListItem>
                            <Divider />
                            <ListItem button onClick={() => { onMenuClicked("PRIORTPA", "Prior TPA Paids") }}>
                                <ListItemIcon>
                                    <HistoryIcon />
                                </ListItemIcon>
                                <ListItemText primary="Prior TPA Paids" secondary="Prior TPA Paids"/>
                            </ListItem>
                            <Divider />
                            <ListItem button onClick={() => { onMenuClicked("ADJUSTMENTS", "Adjustments") }}>
                                <ListItemIcon>
                                    <EqualizerIcon />
                                </ListItemIcon>
                                <ListItemText primary="Adjustments" secondary="Adjustments"/>
                            </ListItem>
                            <Divider />
                            <ListItem button onClick={() => { onMenuClicked("CALCULATION", "Calculation") }}>
                                <ListItemIcon>
                                    <CalculateIcon />
                                </ListItemIcon>
                                <ListItemText primary="Calculation" secondary="Calculation"/>
                                    </ListItem>
                                <Divider />
                                    {request.currentClaimActivity && request.currentClaimActivity.activityID &&
                                    <ListItem button onClick={() => { onMenuClicked("REQUESTREIMBURSEMENTPAYMENT", "Reimbursement Payment") }}>
                                        <ListItemIcon>
                                            <RequestQuoteIcon sx={{ marginRight: 5 }} />
                                        </ListItemIcon>
                                        <ListItemText primary="Reimbursement Payment" secondary="Reimbursement Payment" />
                                    </ListItem>
                                }

                                </>
                                : null
                            }


                        </List>
                    </ContentCell>
                </ContentRow >
            </PanelContent>
        </Panel>
    );
}