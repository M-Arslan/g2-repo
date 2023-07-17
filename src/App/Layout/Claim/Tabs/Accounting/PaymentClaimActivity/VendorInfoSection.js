import { Search as SearchIcon } from '@mui/icons-material';
import { Button, Divider, IconButton, MenuItem } from '@mui/material';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { APP_TYPES } from '../../../../../Core/Enumerations/app/app-types';
import { LEGAL_ENTITY } from '../../../../../Core/Enumerations/app/legal-entity';
import { CurrencyInput, Panel, PanelContent, PanelHeader, SelectList, TextInput } from '../../../../../Core/Forms/Common';
import { accountingTransCodeSelectors } from '../../../../../Core/State/slices/metadata/accountingTransCode';
import { riskStatesSelectors } from '../../../../../Core/State/slices/metadata/risk-states';
import { userSelectors } from '../../../../../Core/State/slices/user';
import {
    uuid
} from '../../../../../Core/Utility/uuid';
import { findHelpTextByTag, loadHelpTags } from '../../../../Help/Queries';
import { ClaimActivityStatusInfoSection } from '../ClaimActivityStatusInfoSection';
import { validatePaymentVendor } from '../Validations/validateFinancial';
import { VendorListSection } from './VendorListSection';
import { VendorSearchDrawer } from './VendorSearchDrawer';
import { ACCOUNTING_TRANS_TYPES } from '../../../../../Core/Enumerations/app/accounting-trans-type';
import { CLAIM_STATUS_TYPE, GENSERVE_CLAIM_STATUS_TYPE } from '../../../../../Core/Enumerations/app/claim-status-type';
import { PAYMENT_TYPE_CODE } from '../../../../../Core/Enumerations/app/payment-type-code';
import { USZip } from '../../../../../Core/Providers/FormProvider';
import { zipFormat } from '../../../../../Core/Utility/common';

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
    padding: 1em;tr
`;


export const VendorInfoSection = ({ claim, request, dispatch, formValidator, onSave, onPaymentClaimActivityDraft, db2Claim,  lossExpenseReserve  }) => {
    const $auth = useSelector(userSelectors.selectAuthContext());
    const riskStates = useSelector(riskStatesSelectors.selectData());

    let accountingTransCodes = useSelector(accountingTransCodeSelectors.selectData());
    if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT) {
        accountingTransCodes = accountingTransCodes.filter(X => X.category === "Expense");
        if (db2Claim?.statusCode === GENSERVE_CLAIM_STATUS_TYPE.CLOSED) {
            accountingTransCodes = accountingTransCodes.filter(X => X.transCode.search(ACCOUNTING_TRANS_TYPES.RESERVE) === 0);
        }
        if (db2Claim?.statusCode === GENSERVE_CLAIM_STATUS_TYPE.OPEN) {
            accountingTransCodes = accountingTransCodes.filter(X => X.transCode.search(ACCOUNTING_TRANS_TYPES.RESERVE) !== 0);
        }
    }
    else if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.MEDPAY_PAYMENT) {
        accountingTransCodes = accountingTransCodes.filter(X => X.category === "Indemity");
        if (db2Claim?.statusCode === GENSERVE_CLAIM_STATUS_TYPE.CLOSED) {
            accountingTransCodes = accountingTransCodes.filter(X => X.transCode.search(ACCOUNTING_TRANS_TYPES.RESERVE) === 0);
        }
        if (db2Claim?.statusCode === GENSERVE_CLAIM_STATUS_TYPE.OPEN) {
            accountingTransCodes = accountingTransCodes.filter(X => X.transCode.search(ACCOUNTING_TRANS_TYPES.RESERVE) !== 0);
        }
    }

    const { enqueueSnackbar } = useSnackbar();
    let isViewer = $auth.isReadOnly(APP_TYPES.Financials)
    if (!isViewer) {
        if (request.currentClaimActivity.activityID
            &&
            (
                (
                request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.NEW_PI_2
                    && request.isExpenseAdmin
                )
                || (
                    request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.IN_PROGRESS_PI_2
                    &&
                    (
                        request.isExpenseAdmin
                        || request.isClaimAccountant
                    )
                )
                || request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.VENDOR_SETUP_COMPLETE
                || request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.SUBMIT_TO_CE_FOR_APPROVAL
                || request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.DRAFT
                || request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.OUTSTANDING_ISSUE
                

            )
        ) {
            isViewer = false;
        }
        else if (request.currentClaimActivity.activityID || request.vendorReadOnlyMode) {
            isViewer = true;
        }


    }
    request.enableVendorUI = request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT && request.claim.g2LegalEntityID === LEGAL_ENTITY.GENERAL_STAR ? false : request.enableVendorUI;
    const currentClaimActivity = request.currentClaimActivity || {};
    const currentPayment = currentClaimActivity.payments || {};
    let currentVendor = JSON.parse(JSON.stringify(request.currentVendor));
    let key = request.vendorKey;
    const [metadata, setMetadata] = React.useState({
        loading: true,
        helpTags: [],
    });

    const { register, formState: { errors }, setValue, unregister } = formValidator;

    setValue("transCode", currentVendor.transCode ? currentVendor.transCode : null);
    setValue("payeeName", currentVendor.payeeName ? currentVendor.payeeName : null);
    setValue("payeeAddressStreet1", currentVendor.payeeAddressStreet1 ? currentVendor.payeeAddressStreet1 : null);
    setValue("mailToName", currentVendor.mailToName ? currentVendor.mailToName : null);
    setValue("payeeAddressCity", currentVendor.payeeAddressCity ? currentVendor.payeeAddressCity : null);
    setValue("payeeAddressZIP", currentVendor.payeeAddressZIP ? currentVendor.payeeAddressZIP : null);
    setValue("mailToAddressZIP", currentVendor.mailToAddressZIP ? currentVendor.mailToAddressZIP : null);
    setValue("paymentAmount", currentVendor.paymentAmount);
    setValue("invoiceNumber", currentVendor.invoiceNumber ? currentVendor.invoiceNumber : null);
    setValue("taxID", currentVendor.taxID ? currentVendor.taxID : null);
    setValue("paymentTypeCode1", currentVendor.paymentTypeCode1 ? currentVendor.paymentTypeCode1 : null);

    const onValueChanged = (evt) => {
        currentVendor[evt.target.name] = evt.target.value.trimStart();
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentVendor: JSON.parse(JSON.stringify(currentVendor)) } });
    };

    const onDropDownChanged = (evt) => {
        if (evt.target.name === "payeeAddressState") {
            setValue(evt.target.name, evt.target.value ? evt.target.value : null);
            currentVendor[evt.target.name] = evt.target.value;
        }
        else if (evt.target.name === "transCode") {
            currentVendor["transCodeDescription"] = accountingTransCodes.filter(X => X.transCode === evt.target.value).length > 0 ? accountingTransCodes.filter(X => X.transCode === evt.target.value)[0].transCodeDesc : "";
            currentVendor["accountingTransCode"] = accountingTransCodes.filter(X => X.transCode === evt.target.value).length > 0 ? accountingTransCodes.filter(X => X.transCode === evt.target.value)[0] : null;
            setValue(evt.target.name, evt.target.value ? evt.target.value : null);
            currentVendor[evt.target.name] = evt.target.value;
        }
        else if (evt.target.name === "paymentTypeCode1") {
            currentVendor["paymentTypeCode"] = evt.target.value;
            if (evt.target.value === "I")
                currentVendor["paymentType"] = "Iterm";
            if (evt.target.value === "S")
                currentVendor["paymentType"] = "Supplemental";
            if (evt.target.value === "F")
                currentVendor["paymentType"] = "Final";
            setValue("paymentTypeCode1", evt.target.value ? evt.target.value : null);
        } else {
            currentVendor[evt.target.name] = evt.target.value;
        }
        //setCurrentVendor(JSON.parse(JSON.stringify(currentVendor)));
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentVendor: JSON.parse(JSON.stringify(currentVendor)) } });

    };
    const onCurrencyChanged = (evt) => {
        currentVendor[evt.target.name] = evt.target.value;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentVendor: currentVendor } });
    };
    const onResourceSelected = (vendor) => {
        if (vendor.vendorName1) {
            currentVendor.payeeName = vendor.vendorName1;
            currentVendor.payeeName2 = vendor.vendorName2;
            currentVendor.payeeAddressStreet1 = vendor.address;
            currentVendor.payeeAddressCity = vendor.city;
            currentVendor.payeeAddressState = vendor.state;
            currentVendor.payeeAddressZIP = vendor.postalCode;
            currentVendor.vendorCode = vendor.vendorCode;
            currentVendor.taxID = vendor.taxIDIndicator;
            currentVendor.invoiceNumber = null;
            setValue("payeeAddressState", currentVendor.payeeAddressState ? currentVendor.payeeAddressState : null);
            dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentVendor: currentVendor, vendorKey: key + 1, openVendorSearchDrawer: false, enableVendorUI: false } });
        } else {
            dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentVendor: {}, vendorKey: key + 1, openVendorSearchDrawer: false, enableVendorUI: true } });
        }
    }

    const onAddVendor = async () => {
        let isValid = await validatePaymentVendor(formValidator.trigger, request);
        if (!isValid) {
            if (!currentVendor.payeeName) {
                enqueueSnackbar("Payee/Vendor Name is required.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            }
            if (isNaN(parseFloat(currentVendor.paymentAmount))) {
                enqueueSnackbar("Payment amount is required.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            }
            if (!currentVendor.payeeAddressStreet1) {
                enqueueSnackbar("Street Address 1 is required.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            }

            if (!currentVendor.payeeAddressCity) {
                enqueueSnackbar("City is required.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            }

            if (!currentVendor.payeeAddressState) {
                enqueueSnackbar("State is required.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            }

            if (!currentVendor.payeeAddressZIP) {
                enqueueSnackbar("Zip is required.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            }
            if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT) {
                if (!currentVendor.taxID) {
                    enqueueSnackbar("Tax ID is required.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                }
                if (!currentVendor.invoiceNumber) {
                    enqueueSnackbar("Invoice Number is required.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                }
            }

        }
        if (isValid) {
            let newVendor = JSON.parse(JSON.stringify(currentVendor))
            newVendor["paymentVendorID"] = uuid();
            delete newVendor.createdBy;
            delete newVendor.createdDate;
            delete newVendor.modifiedBy;
            delete newVendor.modifiedDate;
            newVendor.paymentAmount = parseFloat(newVendor.paymentAmount);
            currentPayment.paymentVendors = currentPayment.paymentVendors || [];
            currentPayment.paymentVendors.push(JSON.parse(JSON.stringify(newVendor)));


            currentPayment.paymentWires = (!currentPayment.paymentWires || (currentPayment.paymentWires || []).length === 0) ? [{}] : currentPayment.paymentWires;
            const paymentVendors = currentPayment.paymentVendors || [];
            if (paymentVendors.length > 0) {
                if (!currentPayment.paymentWires[0].paymentVendorID) {
                    currentPayment.paymentWires[0].paymentVendorID = paymentVendors[0].paymentVendorID;
                    currentPayment.paymentWires[0].wireAmount = paymentVendors[0].paymentAmount;
                    currentPayment.paymentWires[0].wireCurrencyISO = !currentPayment.paymentWires[0].wireCurrencyISO ? "USD" : currentPayment.paymentWires[0].wireCurrencyISO;
                } else {
                    currentPayment.paymentWires[0].wireAmount = paymentVendors.filter(X => X.paymentVendorID === currentPayment.paymentWires[0].paymentVendorID)[0].paymentAmount;
                    currentPayment.paymentWires[0].wireCurrencyISO = !currentPayment.paymentWires[0].wireCurrencyISO ? "USD" : currentPayment.paymentWires[0].wireCurrencyISO;
                }
            }

            currentClaimActivity.payments = currentPayment;

            dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentClaimActivity: currentClaimActivity } });
            setValue("transCode", null);
            setValue("paymentTypeCode1", null);
            setValue("payeeAddressState", null);
            onPaymentClaimActivityDraft();

        }
    }
    const onUpdateVendor = async () => {
        let isValid = await validatePaymentVendor(formValidator.trigger, request);
        if (!isValid) {
            if (!currentVendor.payeeName) {
                enqueueSnackbar("Payee/Vendor Name is required.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            }
            if (isNaN(parseFloat(currentVendor.paymentAmount))) {
                enqueueSnackbar("Payment amount is required.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            }
            if (!currentVendor.payeeAddressStreet1) {
                enqueueSnackbar("Street Address 1 is required.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            }
            if (!currentVendor.payeeAddressCity) {
                enqueueSnackbar("City is required.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            }
            if (!currentVendor.payeeAddressState) {
                enqueueSnackbar("State is required.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            }
            if (!currentVendor.payeeAddressZIP) {
                enqueueSnackbar("Zip is required.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            }
            if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT) {
                if (!currentVendor.taxID) {
                    enqueueSnackbar("Tax ID is required.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                }
                if (!currentVendor.invoiceNumber) {
                    enqueueSnackbar("Invoice Number is required.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                }
            }
        }
        if (isValid) {
            function findVendor(X) {
                return X.paymentVendorID === currentVendor["paymentVendorID"];
            }

            currentPayment.paymentVendors = currentPayment.paymentVendors || [];
            let index = currentPayment.paymentVendors.findIndex(findVendor);
            if (index > -1) {
                currentPayment.paymentVendors[index] = JSON.parse(JSON.stringify(currentVendor));
                currentPayment.paymentVendors[index].paymentAmount = parseFloat(currentPayment.paymentVendors[index].paymentAmount);
}
            currentPayment.paymentWires = (!currentPayment.paymentWires || (currentPayment.paymentWires || []).length === 0) ? [{}] : currentPayment.paymentWires;
            const paymentVendors = currentPayment.paymentVendors || [];
            if (paymentVendors.length > 0) {
                if (currentPayment.paymentWires[0].paymentVendorID === currentVendor.paymentVendorID) {
                    currentPayment.paymentWires[0].wireAmount = paymentVendors[0].paymentAmount;
                    currentPayment.paymentWires[0].wireCurrencyISO = !currentPayment.paymentWires[0].wireCurrencyISO ? "USD" : currentPayment.paymentWires[0].wireCurrencyISO;
                }
            }


            currentClaimActivity.payments = currentPayment;
            request.currentClaimActivity = currentClaimActivity;
            request.updateVendorMode = false;
            dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
            onPaymentClaimActivityDraft();

        }
    }

    const onCancelVendor = async () => {
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentVendor: {}, enableVendorUI: false, updateVendorMode: false, vendorKey: key + 1, vendorReadOnlyMode: false } });
    }
    const convertFloatStringToFloat = (evt) => {
        let val = evt.target.value;
        val = val.replace("$", "");
        val = val.replaceAll(",", "");
        currentVendor[evt.target.name] = val;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentVendor: currentVendor } });
    };

    React.useEffect(() => {
        loadMetaData();        
        if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT) {
            register("paymentTypeCode1", { required: "This is required." });
        }
        return () => {
            unregister("paymentTypeCode1");
        }
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentVendor: {} } });
    }, [register]);

    async function loadMetaData() {
        let helpTags = await loadHelpTags(request.helpContainerName);
        setMetadata({
            loading: false,
            helpTags: (helpTags.data.list || []),
        });

    }
    const onSearchClick = () => {
        request.onResourceSelected = onResourceSelected
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openVendorSearchDrawer: true } });
    }
    return (
        <Panel>
            <VendorSearchDrawer open={request.openVendorSearchDrawer} onResourceSelected={request.onResourceSelected} />
            <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>{currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT ? "Vendor List" : "Payee List"}</span></PanelHeader>
            <VendorListSection claim={claim} request={request} dispatch={dispatch} isViewer={isViewer} onPaymentClaimActivityDraft={onPaymentClaimActivityDraft} />
            <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>{currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT ? "Vendor Details" : "Payee Details"}</span></PanelHeader>
            <PanelContent>
                <ClaimActivityStatusInfoSection claim={claim} request={request} dispatch={dispatch} />
                {request.claim.g2LegalEntityID !== LEGAL_ENTITY.GENESIS_REINSURANCE && <>
                <Divider />
                <ContentRow>
                    <ContentCell width="66%">
                        <SelectList
                            disabled={isViewer || request.vendorReadOnlyMode}
                            id="transCode"
                            name="transCode"
                            label="Financial Transaction Code"
                            fullWidth={true}
                            required
                            variant="outlined"
                            value={currentVendor.transCode}
                            key={currentVendor.transCode}
                            tooltip={findHelpTextByTag("transCode", metadata.helpTags)}
                            {...register("transCode",
                                {
                                    required: "This is required.",
                                    onChange: onDropDownChanged
                                }
                            )
                            }

                            error={errors.transCode}
                            helperText={errors.transCode ? errors.transCode.message : ""}
                        >
                            {
                                accountingTransCodes
                                    .map((item, idx) => <MenuItem value={item.transCode}>{item.transCodeDesc}</MenuItem>)
                            }
                        </SelectList>
                    </ContentCell>
                    </ContentRow>
                </>}
                <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>{currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT ? "Currently Added Vendor" : "Currently Added Payee"}</span></PanelHeader>
                <ContentRow>
                    <ContentCell width="45%">
                        {
                            request.enableVendorUI ?
                                <TextInput
                                    label={currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT ? "Vendor Name" : "Payee Name"}
                                    disabled={isViewer || !request.enableVendorUI}
                                    id="payeeName"
                                    name="payeeName"
                                    fullWidth={true}
                                    variant="outlined"
                                    required
                                    value={currentVendor.payeeName}
                                    key={key}
                                    tooltip={findHelpTextByTag("payeeName", metadata.helpTags)}
                                    inputProps={{ maxlength: 120 }}
                                    {...register("payeeName",
                                        {
                                            required: "This is required.",
                                            onChange: onValueChanged
                                        }
                                    )
                                    }
                                    error={errors.payeeName}
                                    helperText={errors.payeeName ? errors.payeeName.message : ""}
                                />
                                :
                                <TextInput
                                    label={currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT ? "Vendor Name" : "Payee Name"}
                                    disabled={isViewer || !request.enableVendorUI}
                                    id="payeeName"
                                    name="payeeName"
                                    fullWidth={true}
                                    variant="outlined"
                                    required
                                    value={((currentVendor.payeeName ? currentVendor.payeeName : "") + (currentVendor.payeeName2 ? (" " + currentVendor.payeeName2) : ""))}
                                    key={key}
                                    tooltip={findHelpTextByTag("payeeName", metadata.helpTags)}
                                    inputProps={{ maxlength: 120 }}
                                    {...register("payeeName",
                                        {
                                            required: "This is required.",
                                            onChange: onValueChanged
                                        }
                                    )
                                    }
                                    error={errors.payeeName}
                                    helperText={errors.payeeName ? errors.payeeName.message : ""}
                                />

                        }
                    </ContentCell>
                    <ContentCell width="5%">
                        {(currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT && request.claim.g2LegalEntityID === LEGAL_ENTITY.GENERAL_STAR) ? <IconButton onClick={onSearchClick} disabled={isViewer || request.updateVendorMode}><SearchIcon /></IconButton> : ''}
                    </ContentCell>
                    <ContentCell width="50%">
                        <TextInput
                            label="Mail To Name"
                            disabled={isViewer || request.vendorReadOnlyMode}
                            id="mailToName"
                            name="mailToName"
                            fullWidth={true}
                            variant="outlined"
                            onChange={onValueChanged}
                            value={currentVendor.mailToName}
                            key={key}
                            tooltip={findHelpTextByTag("mailToName", metadata.helpTags)}
                            inputProps={{ maxlength: 30 }}
                        />
                    </ContentCell>

                </ContentRow>
                <ContentRow>
                    <ContentCell width="50%">
                        <TextInput
                            label="Street Address 1"
                            disabled={isViewer || !request.enableVendorUI}
                            id="payeeAddressStreet1"
                            name="payeeAddressStreet1"
                            fullWidth={true}
                            required
                            variant="outlined"
                            value={currentVendor.payeeAddressStreet1}
                            key={key}
                            tooltip={findHelpTextByTag("payeeAddressStreet1", metadata.helpTags)}
                            {...register("payeeAddressStreet1",
                                {
                                    required: "This is required.",
                                    onChange: onValueChanged
                                }
                            )
                            }
                            error={errors.payeeAddressStreet1}
                            helperText={errors.payeeAddressStreet1 ? errors.payeeAddressStreet1.message : ""}
                            inputProps={{ maxlength: 30 }}
                        />
                    </ContentCell>
                    <ContentCell width="50%">
                        <TextInput
                            label="Mail To Attention"
                            disabled={isViewer || request.vendorReadOnlyMode}
                            id="mailToAttention"
                            name="mailToAttention"
                            fullWidth={true}
                            variant="outlined"
                            onChange={onValueChanged}
                            value={currentVendor.mailToAttention}
                            key={key}
                            tooltip={findHelpTextByTag("mailToName", metadata.helpTags)}
                            inputProps={{ maxlength: 30 }}
                        />
                    </ContentCell>

                </ContentRow>
                <ContentRow>
                    <ContentCell width="50%">
                        <TextInput
                            label="Street Address 2"
                            disabled={isViewer || !request.enableVendorUI}
                            id="payeeAddressStreet2"
                            name="payeeAddressStreet2"
                            fullWidth={true}
                            variant="outlined"
                            onChange={onValueChanged}
                            value={currentVendor.payeeAddressStreet2}
                            key={key}
                            tooltip={findHelpTextByTag("payeeAddressStreet2", metadata.helpTags)}
                            inputProps={{ maxlength: 30 }}
                        />
                    </ContentCell>
                    <ContentCell width="50%">
                        <TextInput
                            label="Mail To Street Address 1"
                            disabled={isViewer || request.vendorReadOnlyMode}
                            id="mailToAddressStreet1"
                            name="mailToAddressStreet1"
                            fullWidth={true}
                            variant="outlined"
                            onChange={onValueChanged}
                            value={currentVendor.mailToAddressStreet1}
                            key={key}
                            tooltip={findHelpTextByTag("mailToAddressStreet1", metadata.helpTags)}
                            inputProps={{ maxlength: 30 }}
                        />
                    </ContentCell>

                </ContentRow>
                <ContentRow>
                    <ContentCell width="50%">
                        <TextInput
                            label="City"
                            disabled={isViewer || !request.enableVendorUI}
                            id="payeeAddressCity"
                            name="payeeAddressCity"
                            fullWidth={true}
                            required
                            variant="outlined"
                            value={currentVendor.payeeAddressCity}
                            key={key}
                            tooltip={findHelpTextByTag("payeeAddressCity", metadata.helpTags)}
                            inputProps={{ maxlength: 30 }}
                            {...register("payeeAddressCity",
                                {
                                    required: "This is required.",
                                    onChange: onValueChanged
                                }
                            )
                            }
                            error={errors.payeeAddressCity}
                            helperText={errors.payeeAddressCity ? errors.payeeAddressCity.message : ""}
                        />
                    </ContentCell>
                    <ContentCell width="50%">
                        <TextInput
                            label="Mail To Street Address 2"
                            disabled={isViewer || request.vendorReadOnlyMode}
                            id="mailToAddressStreet2"
                            name="mailToAddressStreet2"
                            fullWidth={true}
                            variant="outlined"
                            onChange={onValueChanged}
                            value={currentVendor.mailToAddressStreet2}
                            key={key}
                            tooltip={findHelpTextByTag("mailToAddressStreet2", metadata.helpTags)}
                            inputProps={{ maxlength: 30 }}
                        />
                    </ContentCell>

                </ContentRow>
                <ContentRow>
                    <ContentCell width="50%">
                        <SelectList
                            disabled={isViewer || !request.enableVendorUI}
                            id="payeeAddressState"
                            name="payeeAddressState"
                            label="State"
                            fullWidth={true}
                            onChange={onDropDownChanged}
                            variant="outlined"
                            value={currentVendor.payeeAddressState}
                            key={currentVendor.payeeAddressState}
                            tooltip={findHelpTextByTag("payeeAddressState", metadata.helpTags)}
                            error={errors.payeeAddressState}
                            helperText={errors.payeeAddressState ? errors.payeeAddressState.message : ""}
                        >
                            {
                                riskStates.map(rs => <MenuItem value={rs.stateCode}>{rs.stateName}</MenuItem>)
                            }
                        </SelectList>
                    </ContentCell>
                    <ContentCell width="50%">
                        <TextInput
                            label="Mail To City"
                            disabled={isViewer || request.vendorReadOnlyMode}
                            id="mailToAddressCity"
                            name="mailToAddressCity"
                            fullWidth={true}
                            variant="outlined"
                            onChange={onValueChanged}
                            value={currentVendor.mailToAddressCity}
                            key={key}
                            tooltip={findHelpTextByTag("mailToAddressCity", metadata.helpTags)}
                            inputProps={{ maxlength: 30 }}
                        />
                    </ContentCell>

                </ContentRow>
                <ContentRow>
                    <ContentCell width="50%">
                        <TextInput
                            label="Zip"
                            disabled={isViewer || !request.enableVendorUI}
                            id="payeeAddressZIP"
                            name="payeeAddressZIP"
                            fullWidth={true}
                            variant="outlined"
                            required
                            value={currentVendor.payeeAddressZIP}
                            key={key}
                            tooltip={findHelpTextByTag("payeeAddressZIP", metadata.helpTags)}
                            inputProps={{ maxlength: 9 }}
                            {...register("payeeAddressZIP",
                                {
                                    required: "This is required.",
                                    pattern: {
                                        value: /(\d{5}([\-]\d{4})?)/i,
                                        message: "This field is invalid."
                                    },
                                    onChange: onValueChanged
                                }
                            )
                            }
                            error={errors.payeeAddressZIP}
                            helperText={errors.payeeAddressZIP ? errors.payeeAddressZIP.message : ""}
                        />
                    </ContentCell>
                    <ContentCell width="50%">
                        <SelectList
                            disabled={isViewer || request.vendorReadOnlyMode}
                            id="mailToAddressState"
                            name="mailToAddressState"
                            label="Mail To State"
                            fullWidth={true}
                            onChange={onDropDownChanged}
                            variant="outlined"
                            value={currentVendor.mailToAddressState}
                            tooltip={findHelpTextByTag("mailToAddressState", metadata.helpTags)}
                        >
                            {
                                riskStates.map(rs => <MenuItem value={rs.stateCode}>{rs.stateName}</MenuItem>)
                            }
                        </SelectList>
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="50%" />
                    <ContentCell width="50%">
                        <TextInput
                            label="Mail To Zip"
                            disabled={isViewer || request.vendorReadOnlyMode}
                            id="mailToAddressZIP"
                            name="mailToAddressZIP"
                            fullWidth={true}
                            variant="outlined"
                            value={currentVendor.mailToAddressZIP}
                            key={key}
                            tooltip={findHelpTextByTag("mailToAddressZIP", metadata.helpTags)}
                            inputProps={{ maxlength: 10 }}
                            {...register("mailToAddressZIP",
                                {
                                    required: "This is required.",
                                    pattern: {
                                        value: USZip,
                                        message: "This field is invalid."
                                    },
                                    onChange: (e) => zipFormat(onValueChanged,e)
                                }
                            )
                            }
                            error={errors.mailToAddressZIP}
                            helperText={errors.mailToAddressZIP ? errors.mailToAddressZIP.message : ""}

                        />
                    </ContentCell>
                </ContentRow>
                <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Other Details</span></PanelHeader>
                <ContentRow>
                    <ContentCell width="33%">
                        <CurrencyInput
                            label="Payment Amount"
                            disabled={isViewer || request.vendorReadOnlyMode}
                            id="paymentAmount"
                            name="paymentAmount"
                            inputProps={{ maxlength: 15 }}
                            allowDecimal={true}
                            required
                            fullWidth={true}
                            variant="outlined"
                            value={currentVendor.paymentAmount}
                            key={key}
                            tooltip={findHelpTextByTag("paymentAmount", metadata.helpTags)}
                            {...register("paymentAmount",
                                {
                                    required: "This is required.",
                                    onChange: onCurrencyChanged
                                }
                            )
                            }
                            error={errors.paymentAmount}
                            helperText={errors.paymentAmount ? errors.paymentAmount.message : ""}
                            onBlur={convertFloatStringToFloat}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            label="Check Comments"
                            disabled={isViewer || request.vendorReadOnlyMode}
                            id="checkComment"
                            name="checkComment"
                            fullWidth={true}
                            variant="outlined"
                            onChange={onValueChanged}
                            value={currentVendor.checkComment}
                            key={key}
                            tooltip={findHelpTextByTag("checkComment", metadata.helpTags)}
                            inputProps={{ maxlength: 45 }}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            label="Instruction to Accounting"
                            disabled={isViewer || request.vendorReadOnlyMode}
                            id="accountingInstructions"
                            name="accountingInstructions"
                            fullWidth={true}
                            variant="outlined"
                            onChange={onValueChanged}
                            value={currentVendor.accountingInstructions}
                            key={key}
                            tooltip={findHelpTextByTag("accountingInstructions", metadata.helpTags)}
                            inputProps={{ maxlength: 500 }}

                        />
                    </ContentCell>
                </ContentRow>
                {request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT &&
                    <ContentRow>
                        <ContentCell width="33%">
                            <TextInput
                                label="Invoice Number"
                                disabled={isViewer || request.vendorReadOnlyMode}
                                id="invoiceNumber"
                                name="invoiceNumber"
                                fullWidth={true}
                                required
                                variant="outlined"
                                onChange={onValueChanged}
                                value={currentVendor.invoiceNumber}
                                key={key}
                                tooltip={findHelpTextByTag("invoiceNumber", metadata.helpTags)}
                                inputProps={{ maxlength: 20 }}
                                {...register("invoiceNumber",
                                    {
                                        required: "This is required.",
                                        onChange: onValueChanged
                                    }
                                )
                                }
                                error={errors.invoiceNumber}
                                helperText={errors.invoiceNumber ? errors.invoiceNumber.message : ""}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <TextInput
                                label="Tax ID"
                                disabled={isViewer || !request.enableVendorUI}
                                id="taxID"
                                name="taxID"
                                fullWidth={true}
                                variant="outlined"
                                required
                                onChange={onValueChanged}
                                value={currentVendor.taxID}
                                key={key}
                                tooltip={findHelpTextByTag("taxID", metadata.helpTags)}
                                inputProps={{ maxlength: 20 }}
                                {...register("taxID",
                                    {
                                        required: "This is required.",
                                        onChange: onValueChanged
                                    }
                                )
                                }
                                error={errors.taxID}
                                helperText={errors.taxID ? errors.taxID.message : ""}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <SelectList
                                disabled={isViewer || request.vendorReadOnlyMode}
                                id="paymentTypeCode1"
                                name="paymentTypeCode1"
                                label="Payment Type"
                                required
                                fullWidth={true}
                                onChange={onDropDownChanged}
                                variant="outlined"
                                value={currentVendor.paymentTypeCode}
                                key={key}
                                tooltip={findHelpTextByTag("paymentTypeCode", metadata.helpTags)}
                                error={errors.paymentTypeCode1}
                                helperText={errors.paymentTypeCode1 ? errors.paymentTypeCode1.message : ""}

                            >
                                <MenuItem value="I">Interim</MenuItem>
                                <MenuItem value="S">Supplemental</MenuItem>
                                <MenuItem value="F">Final</MenuItem>
                            </SelectList>
                        </ContentCell>
                    </ContentRow>
                }
                {request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.INDEMNITY_PAYMENT &&
                    <ContentRow>
                        <ContentCell width="33%">
                            <TextInput
                                label="Tax ID"
                                disabled={isViewer || !request.enableVendorUI}
                                id="taxID"
                                name="taxID"
                                fullWidth={true}
                                variant="outlined"
                                onChange={onValueChanged}
                                value={currentVendor.taxID}
                                key={key}
                                tooltip={findHelpTextByTag("taxID", metadata.helpTags)}
                                inputProps={{ maxlength: 20 }}
                            />
                        </ContentCell>
                    </ContentRow>
                }
                <ContentCell width="34%">
                    {

                        (
                            (
                                currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT &&
                                (currentPayment.paymentVendors || []).length === 0
                            )
                            ||
                            (
                                currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.INDEMNITY_PAYMENT && currentPayment.paymentTypeCode !== PAYMENT_TYPE_CODE.WIRED
                            )
                            ||
                            (
                                currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.INDEMNITY_PAYMENT && currentPayment.paymentTypeCode === PAYMENT_TYPE_CODE.WIRED &&
                                (currentPayment.paymentVendors || []).length === 0
                            )
                            ||
                            (
                                currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.MEDPAY_PAYMENT &&
                                (currentPayment.paymentVendors || []).length === 0
                            )
                        )
                        &&
                        !request.updateVendorMode && !request.vendorReadOnlyMode
                        &&
                        <Button variant="contained" color="primary" onClick={onAddVendor} style={{ margin: '10px' }} disabled={isViewer}>Add</Button>
                    }
                    {
                        request.updateVendorMode && !request.vendorReadOnlyMode
                        &&
                        <Button variant="contained" color="primary" onClick={onUpdateVendor} style={{ margin: '10px' }} disabled={isViewer}>Save</Button>
                    }
                    {
                        (request.updateVendorMode || request.vendorReadOnlyMode)
                        &&
                        <Button variant="contained" color="primary" onClick={onCancelVendor} style={{ margin: '10px' }} disabled={isViewer}>Cancel</Button>
                    }
                </ContentCell>
            </PanelContent>
        </Panel>
    );
};
