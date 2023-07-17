import { ChevronLeft } from '@mui/icons-material';
import {
    Button,
    Divider,


    Drawer, IconButton, MenuItem
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { APP_TYPES } from '../../../../Core/Enumerations/app/app-types';
import { CLAIM_TYPES } from '../../../../Core/Enumerations/app/claim-type';
import { LEGAL_ENTITY } from '../../../../Core/Enumerations/app/legal-entity';
import { ConfirmationDialog, SelectList, SwitchInput } from '../../../../Core/Forms/Common';
import { accountingTransTypeSelectors } from '../../../../Core/State/slices/metadata/accountingTransType';
import { userSelectors } from '../../../../Core/State/slices/user';
import { findHelpTextByTag } from '../../../Help/Queries';
import { ACCOUNTING_TRANS_TYPES } from '../../../../Core/Enumerations/app/accounting-trans-type';
import { GENSERVE_CLAIM_STATUS_TYPE } from '../../../../Core/Enumerations/app/claim-status-type';
import { STATUTORY_SYSTEM } from '../../../../Core/Enumerations/app/statutory-system';

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
    justify-content: ${props => props.alignContent || 'flex-start'};
    align-items: ${props => props.alignContent || 'flex-start'};
    align-content: ${props => props.alignContent || 'flex-start'};
    padding: .5em;
`;

export const ClaimActivityDrawer = ({ open, onClose, request, claim, dispatch, formValidator, onNext, db2Claim, financialDB2, lossExpenseReserve  }) => {
    const drawerWidth = 350;
    const useStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
            flex: 1,
            width: '100%',

        },
        backdrop: {
            zIndex: 5,
            color: '#fff',
        },

        hide: {
            display: 'none',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
            listStyle: 'none',
            listStyleType: 'none',
        },
        drawerPaper: {
            width: drawerWidth,
            top: '60px',
        },
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: '0 1em',
            // necessary for content to be below app bar
            //...theme.mixins.toolbar,
            justifyContent: 'flex-start',
            backgroundColor: '#bdc3c7',
            fontSize: '15px',

        },
        content: {
            flexGrow: 1,
            padding: '3em',
            marginRight: -drawerWidth,
        },
        contentShift: {
            marginRight: 0,
        },
        heading: {
            fontSize: '15px',
            fontWeight: '400',
        },

    }));
    const classes = useStyles();
    const [helpTags, setHelpTags] = useState([]);
    const currentClaimActivity = request.currentClaimActivity || {};
    let currentDB2Claim = db2Claim;
    
    const $auth = useSelector(userSelectors.selectAuthContext());
    const isViewer = $auth.isReadOnly(APP_TYPES.Financials);
    const { enqueueSnackbar } = useSnackbar();
    const [showConfimationDialog, setShowConfimationDialog] = useState(false);
    const [showCloseActivityConfimationDialog, setShowCloseActivityConfimationDialog] = useState(false);

    const { register, formState: { errors }, setValue} = formValidator;

    let accountingTransTypes = useSelector(accountingTransTypeSelectors.selectData());
    const voidStop = accountingTransTypes.filter(X => [
            ACCOUNTING_TRANS_TYPES.STOP_PAYMENT,
            ACCOUNTING_TRANS_TYPES.VOID_PAYMENT
    ].includes(parseInt(X.accountingTransTypeID)));
    if (claim.claimType !== CLAIM_TYPES.WORKERS_COMP) {
        if (claim.g2LegalEntityID !== LEGAL_ENTITY.GENESIS_REINSURANCE || claim.claimType === CLAIM_TYPES.LEGAL) {
            if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_INSURANCE) {
                if (!currentDB2Claim) {
                    accountingTransTypes = accountingTransTypes.filter(X => [
                        ACCOUNTING_TRANS_TYPES.OPEN,
                        ACCOUNTING_TRANS_TYPES.OPEN_PENDING,
                        ACCOUNTING_TRANS_TYPES.OPEN_CLOSE_PENDING
                    ].includes(parseInt(X.accountingTransTypeID)));
                }
                else if ((currentDB2Claim || {}).statusCode === GENSERVE_CLAIM_STATUS_TYPE.OPEN || (currentDB2Claim || {}).statusCode === "OPEN")
                    accountingTransTypes = accountingTransTypes.filter(X => [
                        ACCOUNTING_TRANS_TYPES.CLOSE,
                        ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT,
                        ACCOUNTING_TRANS_TYPES.INDEMNITY_PAYMENT,
                        ACCOUNTING_TRANS_TYPES.RESERVE,
                        ACCOUNTING_TRANS_TYPES.RECOVERY,
                        ACCOUNTING_TRANS_TYPES.CHECK_COPY,
                        ACCOUNTING_TRANS_TYPES.STOP_PAYMENT,
                        ACCOUNTING_TRANS_TYPES.VOID_PAYMENT,
                        ACCOUNTING_TRANS_TYPES.MLA_SUPPRESSION,
                        ACCOUNTING_TRANS_TYPES.DATE_OF_LOSS_CORRECTION,
                        ACCOUNTING_TRANS_TYPES.REQUEST_COPY_OF_CHECK,
                        ACCOUNTING_TRANS_TYPES.UL_CARRIER_TENDERED,
                        ACCOUNTING_TRANS_TYPES.OTHER
                    ].includes(parseInt(X.accountingTransTypeID)));
                else if ((currentDB2Claim || {}).statusCode === GENSERVE_CLAIM_STATUS_TYPE.PENDING)
                    accountingTransTypes = accountingTransTypes.filter(X => [
                        ACCOUNTING_TRANS_TYPES.CLOSE,
                        ACCOUNTING_TRANS_TYPES.RESERVE,
                    ].includes(parseInt(X.accountingTransTypeID)));
                else if ((currentDB2Claim || {}).statusCode === GENSERVE_CLAIM_STATUS_TYPE.CLOSED || (currentDB2Claim || {}).statusCode === "CLOSE" || (currentDB2Claim || {}).statusCode === "CLOSED")
                    accountingTransTypes = accountingTransTypes.filter(X => [
                        ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT,
                        ACCOUNTING_TRANS_TYPES.INDEMNITY_PAYMENT,
                        ACCOUNTING_TRANS_TYPES.REOPEN,
                        ACCOUNTING_TRANS_TYPES.RECOVERY,
                        ACCOUNTING_TRANS_TYPES.CHECK_COPY,
                        ACCOUNTING_TRANS_TYPES.STOP_PAYMENT,
                        ACCOUNTING_TRANS_TYPES.VOID_PAYMENT,
                        ACCOUNTING_TRANS_TYPES.MLA_SUPPRESSION,
                        ACCOUNTING_TRANS_TYPES.UL_CARRIER_TENDERED,
                        ACCOUNTING_TRANS_TYPES.OTHER
                    ].includes(parseInt(X.accountingTransTypeID)));
                else if ((currentDB2Claim || {}).statusCode === GENSERVE_CLAIM_STATUS_TYPE.CLOSED_PENDING)
                    accountingTransTypes = accountingTransTypes.filter(X => [ACCOUNTING_TRANS_TYPES.REOPEN].includes(parseInt(X.accountingTransTypeID)));
            }
            else {
                if (!currentDB2Claim) {
                    accountingTransTypes = accountingTransTypes.filter(X => [
                        ACCOUNTING_TRANS_TYPES.OPEN,
                        ACCOUNTING_TRANS_TYPES.OPEN_PENDING,
                        ACCOUNTING_TRANS_TYPES.OPEN_CLOSE_PENDING
                    ].includes(parseInt(X.accountingTransTypeID)));
                }
                else if ((currentDB2Claim || {}).statusCode === GENSERVE_CLAIM_STATUS_TYPE.OPEN || (currentDB2Claim || {}).statusCode === "OPEN")
                    accountingTransTypes = accountingTransTypes.filter(X => [
                        ACCOUNTING_TRANS_TYPES.CLOSE,
                        ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT,
                        ACCOUNTING_TRANS_TYPES.INDEMNITY_PAYMENT,
                        ACCOUNTING_TRANS_TYPES.RESERVE,
                        ACCOUNTING_TRANS_TYPES.RECOVERY,
                        ACCOUNTING_TRANS_TYPES.MEDPAY_PAYMENT,
                        ACCOUNTING_TRANS_TYPES.CHECK_COPY,
                        ACCOUNTING_TRANS_TYPES.STOP_PAYMENT,
                        ACCOUNTING_TRANS_TYPES.VOID_PAYMENT,
                        ACCOUNTING_TRANS_TYPES.MLA_SUPPRESSION,
                        ACCOUNTING_TRANS_TYPES.DATE_OF_LOSS_CORRECTION,
                        ACCOUNTING_TRANS_TYPES.REQUEST_COPY_OF_CHECK,
                        ACCOUNTING_TRANS_TYPES.UL_CARRIER_TENDERED,
                        ACCOUNTING_TRANS_TYPES.OTHER
                    ].includes(parseInt(X.accountingTransTypeID)));
                else if ((currentDB2Claim || {}).statusCode === GENSERVE_CLAIM_STATUS_TYPE.PENDING)
                    accountingTransTypes = accountingTransTypes.filter(X => [
                        ACCOUNTING_TRANS_TYPES.CLOSE,
                        ACCOUNTING_TRANS_TYPES.RESERVE
                    ].includes(parseInt(X.accountingTransTypeID)));
                else if ((currentDB2Claim || {}).statusCode === GENSERVE_CLAIM_STATUS_TYPE.CLOSED || (currentDB2Claim || {}).statusCode === "CLOSE" || (currentDB2Claim || {}).statusCode === "CLOSED")
                    accountingTransTypes = accountingTransTypes.filter(X => [
                        ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT,
                        ACCOUNTING_TRANS_TYPES.INDEMNITY_PAYMENT,
                        ACCOUNTING_TRANS_TYPES.REOPEN,
                        ACCOUNTING_TRANS_TYPES.RECOVERY,
                        ACCOUNTING_TRANS_TYPES.MEDPAY_PAYMENT,
                        ACCOUNTING_TRANS_TYPES.CHECK_COPY,
                        ACCOUNTING_TRANS_TYPES.STOP_PAYMENT,
                        ACCOUNTING_TRANS_TYPES.VOID_PAYMENT,
                        ACCOUNTING_TRANS_TYPES.MLA_SUPPRESSION,
                        ACCOUNTING_TRANS_TYPES.UL_CARRIER_TENDERED,
                        ACCOUNTING_TRANS_TYPES.OTHER
                    ].includes(parseInt(X.accountingTransTypeID)));
                else if ((currentDB2Claim || {}).statusCode === GENSERVE_CLAIM_STATUS_TYPE.CLOSED_PENDING)
                    accountingTransTypes = accountingTransTypes.filter(X => [ACCOUNTING_TRANS_TYPES.REOPEN].includes(parseInt(X.accountingTransTypeID)));
            }
        }
        else {
            //accountingTransTypes = accountingTransTypes.filter(X => [1, 2, 3, 8, 12, 13, 20, 25, 26].includes(parseInt(X.accountingTransTypeID)));

            if (!currentDB2Claim) {
                accountingTransTypes = accountingTransTypes.filter(X => [ACCOUNTING_TRANS_TYPES.OPEN].includes(parseInt(X.accountingTransTypeID)));
            }
            else if ((currentDB2Claim || {}).statusCode === GENSERVE_CLAIM_STATUS_TYPE.OPEN || (currentDB2Claim || {}).statusCode === "OPEN")
                accountingTransTypes = accountingTransTypes.filter(X => [
                    ACCOUNTING_TRANS_TYPES.CLOSE,
                    ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT,
                    ACCOUNTING_TRANS_TYPES.RESERVE,
                    ACCOUNTING_TRANS_TYPES.STOP_PAYMENT,
                    ACCOUNTING_TRANS_TYPES.VOID_PAYMENT,
                    ACCOUNTING_TRANS_TYPES.OTHER,
                    ACCOUNTING_TRANS_TYPES.GENESIS_MLA,
                    ACCOUNTING_TRANS_TYPES.GENESIS_PAYMENT
                ].includes(parseInt(X.accountingTransTypeID)));
            else if ((currentDB2Claim || {}).statusCode === GENSERVE_CLAIM_STATUS_TYPE.PENDING)
                accountingTransTypes = accountingTransTypes.filter(X => [
                    ACCOUNTING_TRANS_TYPES.CLOSE,
                    ACCOUNTING_TRANS_TYPES.RESERVE,
                    ACCOUNTING_TRANS_TYPES.GENESIS_MLA,
                    ACCOUNTING_TRANS_TYPES.GENESIS_PAYMENT
                ].includes(parseInt(X.accountingTransTypeID)));
            else if ((currentDB2Claim || {}).statusCode === GENSERVE_CLAIM_STATUS_TYPE.CLOSED || (currentDB2Claim || {}).statusCode === "CLOSE" || (currentDB2Claim || {}).statusCode === "CLOSED") {
                accountingTransTypes = accountingTransTypes.filter(X => [
                    ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT,
                    ACCOUNTING_TRANS_TYPES.STOP_PAYMENT,
                    ACCOUNTING_TRANS_TYPES.VOID_PAYMENT,
                    ACCOUNTING_TRANS_TYPES.OTHER,
                    ACCOUNTING_TRANS_TYPES.GENESIS_MLA,
                    ACCOUNTING_TRANS_TYPES.GENESIS_PAYMENT
                ].includes(parseInt(X.accountingTransTypeID)));
            }
            else {
                accountingTransTypes = accountingTransTypes.filter(X => ![
                    ACCOUNTING_TRANS_TYPES.WC_TABULAR_UPDATE,
                    ACCOUNTING_TRANS_TYPES.WC_PAYMENT_RESERVE,
                    ACCOUNTING_TRANS_TYPES.WC_EXPENSE_PAYMENT,
                    ACCOUNTING_TRANS_TYPES.WC_RESERVE,
                    ACCOUNTING_TRANS_TYPES.WC_REIMBURSEMENT_PAYMENT
                ].includes(parseInt(X.accountingTransTypeID)));

            }
        }
    }
    else {
        if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && !(claim.statutoryClaimID && claim.statutorySystem)) {
            accountingTransTypes = accountingTransTypes.filter(X => [ACCOUNTING_TRANS_TYPES.OPEN].includes(parseInt(X.accountingTransTypeID)));
        }
        else {
        accountingTransTypes = accountingTransTypes.filter(X => [
            ACCOUNTING_TRANS_TYPES.CLOSE,
            ACCOUNTING_TRANS_TYPES.WC_TABULAR_UPDATE,
            ACCOUNTING_TRANS_TYPES.WC_PAYMENT_RESERVE,
            ACCOUNTING_TRANS_TYPES.WC_EXPENSE_PAYMENT,
            ACCOUNTING_TRANS_TYPES.WC_RESERVE,
            ACCOUNTING_TRANS_TYPES.STOP_PAYMENT,
            ACCOUNTING_TRANS_TYPES.VOID_PAYMENT,
            ACCOUNTING_TRANS_TYPES.OTHER
        ].includes(parseInt(X.accountingTransTypeID)));
        }
    }

    
    if ([LEGAL_ENTITY.GENESIS_INSURANCE, LEGAL_ENTITY.GENESIS_REINSURANCE].includes(claim.g2LegalEntityID) && claim.claimType !== CLAIM_TYPES.WORKERS_COMP && (accountingTransTypes.filter(X => [
            ACCOUNTING_TRANS_TYPES.STOP_PAYMENT,
            ACCOUNTING_TRANS_TYPES.VOID_PAYMENT
        ].includes(parseInt(X.accountingTransTypeID))))?.length === 0) {
        accountingTransTypes = accountingTransTypes.concat(voidStop);
    }
    accountingTransTypes = accountingTransTypes.filter(X => X.newActivityVisible === true);

    setValue("accountingTransTypeID", currentClaimActivity.accountingTransTypeID);

    const onCheckBoxChanged = (evt) => {
        request.currentClaimActivity[evt.target.name] = evt.target.checked;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
        //onSave();
    };
    const onDropDownChanged = (evt) => {
        request.currentClaimActivity[evt.target.name] = parseInt(evt.target.value);
        request.currentClaimActivity["accountingTransTypeText"] = accountingTransTypes.filter(e => (e.accountingTransTypeID === evt.target.value))[0].accountingTransTypeText;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
    };

    const onConfirmationOk = () => {
        setShowConfimationDialog(false);
        onNext();
    }
    const onConfirmationCancel = () => {
        setShowConfimationDialog(false);
        onClose();
    }
    const onCloseActivityConfirmationOk = () => {
        setShowCloseActivityConfimationDialog(false);
        onNext();
    }
    const onCloseActivityConfirmationCancel = () => {
        setShowCloseActivityConfimationDialog(false);
        onClose();
    }
    const onNextClick = async () => {
        if (currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.CLOSE) {
            if (!currentDB2Claim && claim.statutorySystem !== STATUTORY_SYSTEM.NAT_RE ) {
                enqueueSnackbar("Claim not found in GenServe", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            } else {
                //    setShowCloseActivityConfimationDialog(true);
                //    return;
                onNext();
            }
        }
        if (currentClaimActivity.accountingTransTypeID) {
            if ((currentDB2Claim || {}).statusCode === GENSERVE_CLAIM_STATUS_TYPE.CLOSED_PENDING) {
                setShowConfimationDialog(true);
            }
            else {
                onNext();
            }
        } else {
            onNext();
        }

    }

    return (
        <>
            <ConfirmationDialog
                id="confirmation"
                keepMounted
                open={showConfimationDialog}
                onCancel={onConfirmationCancel}
                onOk={onConfirmationOk}
                title="Confirmation"
                okText="Yes"
                cancelText="No"
                description="Do you wish to reopen this claim as a pending file?"
            />
            <ConfirmationDialog
                id="confirmation"
                keepMounted
                open={showCloseActivityConfimationDialog}
                onCancel={onCloseActivityConfirmationCancel}
                onOk={onCloseActivityConfirmationOk}
                title="Confirmation"
                okText="Yes"
                cancelText="No"
                description="Are you sure you want to close this claim?"
            />
            <Drawer
                className={classes.drawer}
                anchor="left"
                variant="persistent"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton name="arrowchevron_right" onClick={onClose}>
                        <ChevronLeft />
                        Create Claim Activity
                    </IconButton>
                </div>
                <ContentRow>
                    <ContentCell width="99%">
                        <SelectList
                            disabled={isViewer}
                            id="accountingTransTypeID"
                            name="accountingTransTypeID"
                            required
                            label="Activity Type"
                            fullWidth={true}
                            {...register("accountingTransTypeID",
                                {
                                    required: "This is required.",
                                    onChange: onDropDownChanged
                                }
                            )
                            }

                            variant="outlined"
                            value={currentClaimActivity.accountingTransTypeID || ""}
                            tooltip={findHelpTextByTag("accountingTransTypeID", helpTags)}
                            error={errors.accountingTransTypeID}
                            helperText={errors.accountingTransTypeID ? errors.accountingTransTypeID.message : ""}
                        >
                            {
                                accountingTransTypes
                                    .map((item, idx) => <MenuItem value={item.accountingTransTypeID} key={item.accountingTransTypeID}>{item.accountingTransTypeText}</MenuItem>)
                            }
                        </SelectList>
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="99%">
                        <SwitchInput
                            disabled={isViewer}
                            id="urgent"
                            name="urgent"
                            label="Urgent"
                            checked={currentClaimActivity.urgent}
                            key={currentClaimActivity.urgent}
                            onChange={onCheckBoxChanged}
                            tooltip={findHelpTextByTag("urgent", helpTags)}
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="99%">
                        <SwitchInput
                            disabled={isViewer}
                            id="sendNoticeToReinsurance"
                            name="sendNoticeToReinsurance"
                            label="Send Notice To Reinsurance"
                            checked={currentClaimActivity.sendNoticeToReinsurance}
                            key={currentClaimActivity.sendNoticeToReinsurance}
                            onChange={onCheckBoxChanged}
                            tooltip={findHelpTextByTag("urgent", helpTags)}
                        />
                    </ContentCell>
                </ContentRow>
                <Divider />
                <ContentRow>
                    <ContentCell width="100%" alignContent='flex-end'>
                        <Button variant="contained" color="primary" style={{ marginRight: '10px' }} onClick={onNextClick}>Next</Button>
                        <Button variant="contained" color="secondary" style={{ marginRight: '10px' }} onClick={onClose}>Cancel</Button>
                    </ContentCell>
                </ContentRow>

            </Drawer>

        </>
    );



}