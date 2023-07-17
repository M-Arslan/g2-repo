import {
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Details } from '@mui/icons-material';
import React from 'react';
import styled from 'styled-components';
import { Panel, PanelContent, PanelHeader } from '../../../../Core/Forms/Common';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import BlockIcon from '@mui/icons-material/Block';
import CloseIcon from '@mui/icons-material/Close';
import PaymentIcon from '@mui/icons-material/Payment';
import InventoryIcon from '@mui/icons-material/Inventory';
import LaunchIcon from '@mui/icons-material/Launch';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import GradingIcon from '@mui/icons-material/Grading';
import PendingIcon from '@mui/icons-material/Pending';
import EventIcon from '@mui/icons-material/Event';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import CampaignIcon from '@mui/icons-material/Campaign';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import DetailsIcon from '@mui/icons-material/Details';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import { ACCOUNTING_TRANS_TYPES } from '../../../../Core/Enumerations/app/accounting-trans-type';
import { CLAIM_STATUS_TYPE } from '../../../../Core/Enumerations/app/claim-status-type';
import { PAYMENT_TYPE_CODE } from '../../../../Core/Enumerations/app/payment-type-code';


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

export const AccountingMenu = ({ request, dispatch, formValidator ,claim}) => {
    const currentClaimActivity = request.currentClaimActivity || {};
    const activityName = currentClaimActivity.accountingTransTypeText;
    const currentPayment = currentClaimActivity.payments || {};

    const classes = useStyles();
    const onMenuClicked = async (e, name) => {
        if (request.currentVendor && request.currentVendor.paymentVendorID)
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, selectedMenu: e, updateVendorMode: false, helpContainerName: name, currentCMSRejectedLog: {} } });
        else
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, selectedMenu: e, updateVendorMode: false, currentVendor: {}, helpContainerName: name, currentCMSRejectedLog: {} } });
    }

    const viewClaimFinancialFlag = () => {
        if (claim?.claimType == 'W' && claim?.statutorySystem == 'N') {
            return false;
        }
        return true;
    }

    return (
        <Panel padding="0" margin="0" border="0">
            <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Financials Information</span></PanelHeader>

            <PanelContent>
                <ContentRow>
                    <ContentCell width="100%" >
                        <List component="nav" className={classes.root}>
                            {(request.menusToDisplay.indexOf("FINANCIAL")) > -1 &&
                                <>
                                    <ListItem button onClick={() => { onMenuClicked("FINANCIAL", "Financials") }} selected={request.selectedMenu === "FINANCIAL"}>
                                        {activityName ? ((activityName === "Open") && <LockOpenIcon sx={{ marginRight: 5 }} />) ||
                                            ((activityName === "Stop Payment") && <BlockIcon sx={{ marginRight: 5 }} />) ||
                                            ((activityName === "W/C Tabular Update") && <InventoryIcon sx={{ marginRight: 5 }} />) ||
                                            ((activityName === "Close") && <CloseIcon sx={{ marginRight: 5 }} />) ||
                                            ((activityName === "Expense Payment") && <PaymentIcon sx={{ marginRight: 5 }} />) ||
                                            ((activityName === "Indemnity Payment") && <PaymentIcon sx={{ marginRight: 5 }} />) ||
                                            ((activityName === "MedPay Payment") && <PaymentIcon sx={{ marginRight: 5 }} />) ||
                                            ((activityName === "MLA Reserve") && <InventoryIcon sx={{ marginRight: 5 }} />) ||
                                            ((activityName === "Reopen") && <LaunchIcon sx={{ marginRight: 5 }} />) ||
                                            ((activityName === "Reserve") && <InventoryIcon sx={{ marginRight: 5 }} />) ||
                                            ((activityName === "Recovery") && <SettingsBackupRestoreIcon sx={{ marginRight: 5 }} />) ||
                                            ((activityName === "Check Copy") && <GradingIcon sx={{ marginRight: 5 }} />) ||
                                            ((activityName === "Void Payment") && <BlockIcon sx={{ marginRight: 5 }} />) ||
                                            ((activityName === "Open Pending") && <PendingIcon sx={{ marginRight: 5 }} />) ||
                                            ((activityName === "Open/Close Pending") && <PendingIcon sx={{ marginRight: 5 }} />) ||
                                            ((activityName === "MLA Suspension") && <BlockIcon sx={{ marginRight: 5 }} />) ||
                                            ((activityName === "Date of Loss Correction") && <EventIcon sx={{ marginRight: 5 }} />) ||
                                            ((activityName === "Request Copy of Check") && <RequestQuoteIcon sx={{ marginRight: 5 }} />) ||
                                            ((activityName === "U/L Carrier Tendered") &&
                                                (<ListItemIcon>
                                                    <Details />
                                                </ListItemIcon>) ||
                                                ((activityName === "Other") && <AltRouteIcon sx={{ marginRight: 5 }} />) ||
                                                ((activityName === "Initial RI Notice") && <CampaignIcon sx={{ marginRight: 5 }} />) ||
                                                ((activityName === "Deductible Collection") && <CreateNewFolderIcon sx={{ marginRight: 5 }} />) ||
                                                ((activityName === "File CIB") && <CreditScoreIcon sx={{ marginRight: 5 }} />) ||
                                                ((activityName === "PILR") && <AppRegistrationIcon sx={{ marginRight: 5 }} />) ||
                                                ((activityName === "Genesis MLA") && <PaymentIcon sx={{ marginRight: 5 }} />) ||
                                                ((activityName === "Genesis Payment") && <PaymentIcon sx={{ marginRight: 5 }} />))
                                            : (<LocalAtmIcon sx={{ marginRight: 5 }} />)}

                                        <ListItemText primary={activityName || "Financials"} secondary={activityName || "Financials"} />
                                    </ListItem>
                                    <Divider />
                                </>
                            }
                            {(request.menusToDisplay.indexOf("PRIORCLAIMACTIVITY")) > -1 &&
                                <>
                                    <ListItem button onClick={() => { onMenuClicked("PRIORCLAIMACTIVITY", "View Prior Claim Activity") }} selected={request.selectedMenu === "PRIORCLAIMACTIVITY"}>
                                        <LocalActivityIcon sx={{ marginRight: 5 }} />
                                        <ListItemText primary="View Prior Claim Activity" secondary="View Prior Claim Activity" />
                                    </ListItem>
                                    <Divider />
                                </>}
                            {((request.menusToDisplay.indexOf("CLAIMFINANCIAL")) > -1 && viewClaimFinancialFlag() ) &&
                                <>
                                    <ListItem button onClick={() => { onMenuClicked("CLAIMFINANCIAL", "View Claim Financials") }} selected={request.selectedMenu === "CLAIMFINANCIAL"}>
                                        <PriceCheckIcon sx={{ marginRight: 5 }} />
                                        <ListItemText primary="View Claim Financials" secondary="View Claim Financials" />
                                    </ListItem>
                                    <Divider />
                                </>
                            }
                            {request.currentClaimActivity && request.menusToDisplay.indexOf("OPENCLAIMACTIVTY") > -1 && <>
                                <ListItem button onClick={() => { onMenuClicked("OPENCLAIMACTIVTY", activityName) }} selected={request.selectedMenu === "OPENCLAIMACTIVTY"}>
                                    <LockOpenIcon sx={{ marginRight: 5 }} />
                                    <ListItemText primary={activityName} secondary={activityName} />
                                </ListItem>
                                <Divider />
                            </>
                            }
                            {request.currentClaimActivity && request.menusToDisplay.indexOf("WCTABULARUPDATECLAIMACTIVITY") > -1 && <>
                                <ListItem button onClick={() => { onMenuClicked("WCTABULARUPDATECLAIMACTIVITY", activityName) }} selected={request.selectedMenu === "WCTABULARUPDATECLAIMACTIVITY"}>
                                    <InventoryIcon sx={{ marginRight: 5 }} />
                                    <ListItemText primary={activityName} secondary={activityName} />
                                </ListItem>
                                <Divider />
                            </>
                            }
                            {request.currentClaimActivity && request.menusToDisplay.indexOf("GENESISMLA") > -1 && <>
                                <ListItem button onClick={() => { onMenuClicked("GENESISMLA", activityName) }} selected={request.selectedMenu === "GENESISMLA"}>
                                    <PaymentIcon sx={{ marginRight: 5 }} />
                                    <ListItemText primary={activityName} secondary={activityName} />
                                </ListItem>
                                <Divider />
                            </>
                            }                            {request.currentClaimActivity && request.menusToDisplay.indexOf("MLASUPPRESSIONCLAIMACTIVTY") > -1 && <>
                                <ListItem button onClick={() => { onMenuClicked("MLASUPPRESSIONCLAIMACTIVTY", activityName) }} selected={request.selectedMenu === "MLASUPPRESSIONCLAIMACTIVTY"}>
                                    <BlockIcon sx={{ marginRight: 5 }} />
                                    <ListItemText primary={activityName} secondary={activityName} />
                                </ListItem>
                                <Divider />
                            </>
                            }
                            {request.currentClaimActivity && request.menusToDisplay.indexOf("EXPENSEPAYMENTCLAIMACTIVITY") > -1 &&
                                <>
                                    <ListItem button onClick={() => { onMenuClicked("EXPENSEPAYMENTCLAIMACTIVITY", activityName) }} selected={request.selectedMenu === "EXPENSEPAYMENTCLAIMACTIVITY"}>
                                        <PaymentIcon sx={{ marginRight: 5 }} />
                                        <ListItemText primary={activityName} secondary={activityName} />
                                    </ListItem>
                                    <Divider />
                                </>
                            }
                            {request.currentClaimActivity && request.menusToDisplay.indexOf("CLOSECLAIMACTIVITY") > -1 &&
                                <>
                                    <ListItem button onClick={() => { onMenuClicked("CLOSECLAIMACTIVITY", activityName) }} selected={request.selectedMenu === "CLOSECLAIMACTIVITY"}>
                                        <CloseIcon sx={{ marginRight: 5 }} />
                                        <ListItemText primary={activityName} secondary={activityName} />
                                    </ListItem>
                                    <Divider />
                                </>
                            }
                            {request.currentClaimActivity && request.menusToDisplay.indexOf("VENDORDETAILS") > -1 && request.currentClaimActivity.accountingTransTypeID !== ACCOUNTING_TRANS_TYPES.GENESIS_PAYMENT && request.currentClaimActivity.accountingTransTypeID !== ACCOUNTING_TRANS_TYPES.WC_EXPENSE_PAYMENT && request.currentClaimActivity.accountingTransTypeID !== ACCOUNTING_TRANS_TYPES.WC_PAYMENT_RESERVE &&
                                <>
                                    <ListItem button onClick={() => { onMenuClicked("VENDORDETAILS", request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT ? "Vendor Details" : "Payee Details") }} selected={request.selectedMenu === "VENDORDETAILS"}>
                                    <DetailsIcon sx={{ marginRight: 5 }} />
                                    <ListItemText primary={request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT ? "Vendor Details" : "Payee Details"} secondary={request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT ? "Vendor Details" : "Payee Details"} />
                                    </ListItem>
                                    <Divider />
                                </>
                            }
                            {request.currentClaimActivity && request.menusToDisplay.indexOf("WIREPAYMENTDETAILS") > -1 && currentPayment.paymentTypeCode === PAYMENT_TYPE_CODE.WIRED &&
                                <>
                                    <ListItem button onClick={() => { onMenuClicked("WIREPAYMENTDETAILS", "WIREPAYMENTDETAILS") }} selected={request.selectedMenu === "WIREPAYMENTDETAILS"}>
                                        <PaymentIcon sx={{ marginRight: 5 }} />
                                        <ListItemText primary="Wire Details" secondary="Wire Details" />
                                    </ListItem>
                                    <Divider />
                                </>
                            }

                            {request.currentClaimActivity && request.menusToDisplay.indexOf("SPECIALINSTRUCTIONSACTIVTY") > -1 && <>

                                <ListItem button onClick={() => { onMenuClicked("SPECIALINSTRUCTIONSACTIVTY", activityName) }} selected={request.selectedMenu === "SPECIALINSTRUCTIONSACTIVTY"}>
                                    <FolderSpecialIcon sx={{ marginRight: 5 }} />

                                    <ListItemText primary={activityName} secondary={activityName} />
                                </ListItem>
                                <Divider />
                            </>
                            }
                            {request.currentClaimActivity && request.menusToDisplay.indexOf("REOPENACTIVTY") > -1 && <>
                                <ListItem button onClick={() => { onMenuClicked("REOPENACTIVTY", activityName) }} selected={request.selectedMenu === "REOPENACTIVTY"}>
                                    <LaunchIcon sx={{ marginRight: 5 }} />
                                    <ListItemText primary={activityName} secondary={activityName} />
                                </ListItem>
                                <Divider />
                            </>
                            }
                            {request.currentClaimActivity && request.menusToDisplay.indexOf("RESERVECHANGEACTIVTY") > -1 && <>
                                <ListItem button onClick={() => { onMenuClicked("RESERVECHANGEACTIVTY", activityName) }} selected={request.selectedMenu === "RESERVECHANGEACTIVTY"}>
                                    <InventoryIcon sx={{ marginRight: 5 }} />
                                    <ListItemText primary={activityName} secondary={activityName} />
                                </ListItem>
                                <Divider />
                            </>
                            }
                            {(request.currentClaimActivity || {}).activityID && (request.currentClaimActivity || {}).claimStatusTypeID !== CLAIM_STATUS_TYPE.DRAFT && request.menusToDisplay.indexOf("ISSUELOG") > -1 && <>
                                <ListItem button onClick={() => { onMenuClicked("ISSUELOG", "Issue Log") }} selected={request.selectedMenu === "ISSUELOG"}>
                                    <ListItemIcon>
                                        <Details />
                                    </ListItemIcon>
                                    <ListItemText primary="Issue Log" secondary="Issue Log" />
                                </ListItem>
                                <Divider />
                            </>
                            }
                            {currentClaimActivity && (request.currentClaimActivity || {}).activityID && (request.currentClaimActivity || {}).claimStatusTypeID !== CLAIM_STATUS_TYPE.DRAFT && <>

                                <ListItem button onClick={() => { onMenuClicked("QAUI", "QAUI") }} selected={request.selectedMenu === "QAUI"}>
                                    <ListItemIcon>
                                        <Details />
                                    </ListItemIcon>
                                    <ListItemText primary="QA Logs" secondary="QA Logs" />
                                </ListItem>
                                <Divider />
                            </>
                            }

                            {(request.currentClaimActivity || {}).activityID && <>
                                <ListItem button onClick={() => { onMenuClicked("ACTIVITYHISTORY", "ACTIVITYHISTORY") }} selected={request.selectedMenu === "ACTIVITYHISTORY"}>
                                    <ListItemIcon>
                                        <Details />
                                    </ListItemIcon>
                                    <ListItemText primary="Activity History" secondary="Activity Logs" />
                                </ListItem>
                                <Divider />
                            </>
                            }
                            {(request.currentClaimActivity || {}).activityID && <>
                                <ListItem button onClick={() => { onMenuClicked("GENERALCOMMENTS", "GENERALCOMMENTS") }} selected={request.selectedMenu === "GENERALCOMMENTS"}>
                                    <ListItemIcon>
                                        <Details />
                                    </ListItemIcon>
                                    <ListItemText primary="General Comments" secondary="General Comments" />
                                </ListItem>
                                <Divider />
                            </>
                            }
                        </List>
                    </ContentCell>
                </ContentRow >
            </PanelContent>
        </Panel>
    );
};




