import { Divider, MenuItem } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { APP_TYPES } from '../../../../../Core/Enumerations/app/app-types';
import { Panel, PanelContent, PanelHeader, SelectList, TextInput, CurrencyInput, DatePicker } from '../../../../../Core/Forms/Common';
import { conferFinancialDB2Selectors, fsriFinancialDB2Selectors } from '../../../../../Core/State/slices/metadata/financial-db2';

import { accountingTransCodeSelectors } from '../../../../../Core/State/slices/metadata/accountingTransCode';
import { userSelectors } from '../../../../../Core/State/slices/user';
import { findHelpTextByTag, loadHelpTags } from '../../../../Help/Queries';
import { ApproverSection } from '../ApproverSection';
import { ClaimActivityStatusInfoSection } from '../ClaimActivityStatusInfoSection';
import { LEGAL_ENTITY } from '../../../../../Core/Enumerations/app/legal-entity';
import { ACCOUNTING_TRANS_TYPES } from '../../../../../Core/Enumerations/app/accounting-trans-type';
import { CLAIM_STATUS_TYPE } from '../../../../../Core/Enumerations/app/claim-status-type';
import { CLAIM_TYPES } from '../../../../../Core/Enumerations/app/claim-type';
import { STATUTORY_SYSTEM } from '../../../../../Core/Enumerations/app/statutory-system';


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

export const PaymentActivityInfoSection = ({ claim, request, dispatch, formValidator, onSave, onPaymentClaimActivityDraft, db2Claim, lossExpenseReserve }) => {
    const $auth = useSelector(userSelectors.selectAuthContext());
    let isViewer = $auth.isReadOnly(APP_TYPES.Financials);
    if (!isViewer) {
        if (request.currentClaimActivity.activityID
            && (request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.SUBMITTED_TO_ACCOUNTANT_AUTHORITY_CHECK)
            && [ACCOUNTING_TRANS_TYPES.GENESIS_PAYMENT, ACCOUNTING_TRANS_TYPES.WC_PAYMENT_RESERVE, ACCOUNTING_TRANS_TYPES.WC_EXPENSE_PAYMENT].includes(request.currentClaimActivity.accountingTransTypeID)
            && request.isClaimAccountant
        ) {
            isViewer = false;
        }
        else if (request.currentClaimActivity.activityID
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
        else if (request.currentClaimActivity.activityID) {
            isViewer = true;
        }
    }

    const currentClaimActivity = request.currentClaimActivity || {};
    const currentPayment = currentClaimActivity.payments || {};
    let accountingTransCodes = useSelector(accountingTransCodeSelectors.selectData());
    let accountingTransCodesIndemity = accountingTransCodes.filter(X => X.category === "Indemity");
    let accountingTransCodesExpense = accountingTransCodes.filter(X => X.category === "Expense");

    const [metadata, setMetadata] = React.useState({
        loading: true,
        reasonTypes: [],
        helpTags: [],
    });
    const fsriFinancialDB2 = useSelector(fsriFinancialDB2Selectors.selectData());
    const conferFinancialDB2 = useSelector(conferFinancialDB2Selectors.selectData());
    

    if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.NAT_RE) {
        currentPayment.beginningCededPaidLoss = currentPayment.beginningCededPaidLoss != null ? currentPayment.beginningCededPaidLoss : null;
        currentPayment.beginningCededPaidExpense = currentPayment.beginningCededPaidExpense != null ? currentPayment.beginningCededPaidExpense : null;
        currentPayment.beginningCededLossReserve = currentPayment.beginningCededLossReserve != null ? currentPayment.beginningCededLossReserve : null;
        currentPayment.beginningCededExpenseReserve = currentPayment.beginningCededExpenseReserve != null ? currentPayment.beginningCededExpenseReserve : null;
        currentPayment.beginningACR = currentPayment.beginningACR != null ? currentPayment.beginningACR : null;
        currentPayment.beginningAER = currentPayment.beginningAER != null ? currentPayment.beginningAER : null;
        request.salvage = null;
        request.subrogation = null;


    }
    if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.FSRI) {
        currentPayment.beginningCededPaidLoss = currentPayment.beginningCededPaidLoss != null ? currentPayment.beginningCededPaidLoss : fsriFinancialDB2.paidLoss;
        currentPayment.beginningCededPaidExpense = currentPayment.beginningCededPaidExpense != null ? currentPayment.beginningCededPaidExpense : fsriFinancialDB2.paidExpense;
        currentPayment.beginningCededLossReserve = currentPayment.beginningCededLossReserve != null ? currentPayment.beginningCededLossReserve : fsriFinancialDB2.lossReserve;
        currentPayment.beginningCededExpenseReserve = currentPayment.beginningCededExpenseReserve != null ? currentPayment.beginningCededExpenseReserve : fsriFinancialDB2.expenseReserve;
        currentPayment.beginningACR = currentPayment.beginningACR != null ? currentPayment.beginningACR : fsriFinancialDB2.additionalLossRes;
        currentPayment.beginningAER = currentPayment.beginningAER != null ? currentPayment.beginningAER : fsriFinancialDB2.additionalExpenseRes;
        request.salvage = isNaN(parseFloat(fsriFinancialDB2.salvage)) ? fsriFinancialDB2.salvage : parseFloat(fsriFinancialDB2.salvage);
        request.subrogation = isNaN(parseFloat(fsriFinancialDB2.subrogation)) ? fsriFinancialDB2.paidExpense : parseFloat(fsriFinancialDB2.subrogation);


    }
    if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.CONFER) {
        currentPayment.beginningCededPaidLoss = currentPayment.beginningCededPaidLoss != null ? currentPayment.beginningCededPaidLoss : conferFinancialDB2.totalPaidLoss;
        currentPayment.beginningCededPaidExpense = currentPayment.beginningCededPaidExpense != null ? currentPayment.beginningCededPaidExpense : conferFinancialDB2.totalPaidExpense;
        currentPayment.beginningCededLossReserve = currentPayment.beginningCededLossReserve != null ? currentPayment.beginningCededLossReserve : conferFinancialDB2.totalLossReserve;
        currentPayment.beginningCededExpenseReserve = currentPayment.beginningCededExpenseReserve != null ? currentPayment.beginningCededExpenseReserve : conferFinancialDB2.totalExpenseReserve;
        currentPayment.beginningACR = currentPayment.beginningACR != null ? currentPayment.beginningACR : conferFinancialDB2.totalACR;
        currentPayment.beginningAER = currentPayment.beginningAER != null ? currentPayment.beginningAER : conferFinancialDB2.totalAER;
        request.salvage = isNaN(parseFloat(conferFinancialDB2.totalSalvage)) ? conferFinancialDB2.totalSalvage : parseFloat(conferFinancialDB2.totalSalvage);
        request.subrogation  = isNaN(parseFloat(conferFinancialDB2.totalSubrogation)) ? conferFinancialDB2.totalSubrogation : parseFloat(conferFinancialDB2.totalSubrogation);
    }










    const { register, formState: { errors }, setValue } = formValidator;

    setValue("paymentTypeCode", currentPayment.paymentTypeCode ? currentPayment.paymentTypeCode : null);
    setValue("lossReserveTotal", isNaN(parseFloat(currentPayment.lossReserveTotal)) ? null : currentPayment.lossReserveTotal);
    setValue("lossDescCode", currentPayment.lossDescCode ? currentPayment.lossDescCode : null);
    setValue("expenseReserveTotal", isNaN(parseFloat(currentPayment.expenseReserveTotal)) ? null : currentPayment.expenseReserveTotal);
    setValue("expenseDescCode", currentPayment.expenseDescCode ? currentPayment.expenseDescCode : null);
    setValue("companyPaidLoss", isNaN(parseFloat(currentPayment.companyPaidLoss)) ? null : currentPayment.companyPaidLoss);
    setValue("companyLossReserves", isNaN(parseFloat(currentPayment.companyLossReserves)) ? null : currentPayment.companyLossReserves);
    setValue("companyPaidExpense", isNaN(parseFloat(currentPayment.companyPaidExpense)) ? null : currentPayment.companyPaidExpense);
    setValue("companyExpenseReserve", isNaN(parseFloat(currentPayment.companyExpenseReserve)) ? null : currentPayment.companyExpenseReserve);
    setValue("cededPaidLoss", isNaN(parseFloat(currentPayment.cededPaidLoss)) ? null : currentPayment.cededPaidLoss);
    setValue("cededLossReserves", isNaN(parseFloat(currentPayment.cededLossReserves)) ? null : currentPayment.cededLossReserves);
    setValue("cededPaidExpense", isNaN(parseFloat(currentPayment.cededPaidExpense)) ? null : currentPayment.cededPaidExpense);
    setValue("cededExpenseReserve", isNaN(parseFloat(currentPayment.cededExpenseReserve)) ? null : currentPayment.cededExpenseReserve);
    setValue("acr", isNaN(parseFloat(currentPayment.acr)) ? null : currentPayment.acr);
    setValue("aer", isNaN(parseFloat(currentPayment.aer)) ? null : currentPayment.aer);
    setValue("comment", currentPayment.comment ? currentPayment.comment : null);


    const onValueChanged = (evt) => {
        currentPayment[evt.target.name] = evt.target.value;
        currentClaimActivity.payments = currentPayment;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentClaimActivity: currentClaimActivity } });
    };
    const onDropDownChanged = (evt) => {

        if (evt.target.name === "paymentTypeCode") {
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
        }

        currentPayment[evt.target.name] = evt.target.value;
        currentClaimActivity.payments = currentPayment;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentClaimActivity: currentClaimActivity } });
        //onSave();
    };

    const onCurrencyChanged = (evt) => {
        currentPayment[evt.target.name] = evt.target.value;
        currentClaimActivity.payments = currentPayment;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentClaimActivity: currentClaimActivity } });
    };

    const onDateChanged = (evt) => {
        currentPayment[evt.target.name] = evt.target.value;
        currentClaimActivity.payments = currentPayment;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentClaimActivity: currentClaimActivity } });
    };

    const convertFloatStringToFloat = (evt) => {
        let val = evt.target.value;
        val = val.replace("$", "");
        val = val.replaceAll(",", "");
        currentPayment[evt.target.name] = !isNaN(parseFloat(val)) ? parseFloat(val) : val;
        currentClaimActivity.payments = currentPayment;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentClaimActivity: currentClaimActivity } });
    };


    React.useEffect(() => {
        loadMetaData();
    }, []);

    async function loadMetaData() {
        let helpTags = await loadHelpTags(request.helpContainerName);
        setMetadata({
            loading: false,
            helpTags: (helpTags.data.list || []),
        });

    }

    return (
        <Panel>
            <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>{currentClaimActivity.accountingTransTypeText}</span></PanelHeader>
            <PanelContent>
                <ClaimActivityStatusInfoSection claim={claim} request={request} dispatch={dispatch} />
                <Divider />
                {![ACCOUNTING_TRANS_TYPES.WC_PAYMENT_RESERVE, ACCOUNTING_TRANS_TYPES.WC_EXPENSE_PAYMENT].includes(request.currentClaimActivity.accountingTransTypeID) &&
                    <>
                    <ContentRow>
                        <ContentCell width="33%">
                            <SelectList
                                disabled={isViewer}
                                id="paymentTypeCode"
                                name="paymentTypeCode"
                                label="Payment Type"
                                fullWidth={true}
                                {...register("paymentTypeCode",
                                    {
                                        onChange: onDropDownChanged
                                    }
                                )
                                }
                                variant="outlined"
                                value={currentPayment.paymentTypeCode}
                                tooltip={findHelpTextByTag("paymentTypeCode", metadata.helpTags)}
                                error={errors.paymentTypeCode}
                                helperText={errors.paymentTypeCode ? errors.paymentTypeCode.message : ""}
                            >
                                <MenuItem value="W">Wire Payment</MenuItem>
                                <MenuItem value="F">Fedex Payment</MenuItem>
                            </SelectList>
                        </ContentCell>
                    </ContentRow>
                
                    {currentClaimActivity.accountingTransTypeID !== ACCOUNTING_TRANS_TYPES.GENESIS_PAYMENT &&
                        <>
                            <ContentRow>
                                <ContentCell width="33%">
                                    <CurrencyInput
                                        label="Current Loss Reserve"
                                        disabled={isViewer}
                                        InputProps={{ readOnly: true }}
                                        id="lossReserves"
                                        name="lossReserves"
                                        fullWidth={true}
                                        variant="outlined"
                                        onChange={onValueChanged}
                                        value={(lossExpenseReserve || {}).lossReserves}
                                        tooltip={findHelpTextByTag("lossReserves", metadata.helpTags)}
                                        allowNegative={true}

                                    />
                                </ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell width="33%">
                                    <CurrencyInput
                                        label="Current Expense Reserve"
                                        disabled={isViewer}
                                        InputProps={{ readOnly: true }}
                                        id="expenseReserves"
                                        name="expenseReserves"
                                        fullWidth={true}
                                        variant="outlined"
                                        onChange={onValueChanged}
                                        value={(lossExpenseReserve || {}).expenseReserves}
                                        tooltip={findHelpTextByTag("expenseReserves", metadata.helpTags)}
                                        allowNegative={true}

                                    />
                                </ContentCell>
                            </ContentRow>
                        </>
                    }
                {claim.g2LegalEntityID !== LEGAL_ENTITY.GENESIS_INSURANCE && currentClaimActivity.accountingTransTypeID !== ACCOUNTING_TRANS_TYPES.GENESIS_PAYMENT &&
                    claim.g2LegalEntityID !== LEGAL_ENTITY.GENESIS_REINSURANCE && currentClaimActivity.accountingTransTypeID !== ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT &&
                    <ContentRow>
                        <ContentCell width="33%">
                            <CurrencyInput
                                label="Current Med Pay Reserve"
                                disabled={isViewer}
                                InputProps={{ readOnly: true }}
                                id="medPayLossReserves"
                                name="medPayLossReserves"
                                fullWidth={true}
                                variant="outlined"
                                onChange={onValueChanged}
                                value={((lossExpenseReserve || {}).medPayLossReserves + (lossExpenseReserve || {}).medPayExpenseReserves) || ""}
                                tooltip={findHelpTextByTag("medPayLossReserves", metadata.helpTags)}
                            />
                        </ContentCell>
                    </ContentRow>
                }



                {currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.GENESIS_PAYMENT &&
                    <>
                        <ContentRow>
                            <ContentCell width="33%">
                                <CurrencyInput
                                    disabled={isViewer}
                                    inputProps={{ readOnly: true }}
                                    id="currentCededPaidLoss"
                                    name="currentCededPaidLoss"
                                    label="Current Ceded Paid Loss"
                                    value={currentPayment.beginningCededPaidLoss}
                                    allowNegative={true}

                                />
                            </ContentCell>
                            <ContentCell width="33%">
                                <CurrencyInput
                                    disabled={isViewer}
                                    inputProps={{ readOnly: true }}
                                    id="currentCededLossReserves"
                                    name="currentCededLossReserves"
                                    label="Current Ceded Loss Reserves"
                                    value={currentPayment.beginningCededLossReserve}
                                    allowNegative={true}

                                />
                            </ContentCell>
                            <ContentCell width="33%">
                                <CurrencyInput
                                    disabled={true}
                                    inputProps={{ readOnly: true }}
                                    id="salvage"
                                    name="salvage"
                                    label="Salvage"
                                    value={request?.salvage}
                                    allowNegative={true}

                                />
                            </ContentCell>
                        </ContentRow>
                        <ContentRow>
                            <ContentCell width="33%">
                                <CurrencyInput
                                    disabled={isViewer}
                                    inputProps={{ readOnly: true }}
                                    id="currentCededPaidExpense"
                                    name="currentCededPaidExpense"
                                    label="Current Ceded Paid Expense"
                                    value={currentPayment.beginningCededPaidExpense}
                                    allowNegative={true}

                                />
                            </ContentCell>
                            <ContentCell width="33%">
                                <CurrencyInput
                                    disabled={isViewer}
                                    inputProps={{ readOnly: true }}

                                    id="currentCededExpenseReserve"
                                    name="currentCededExpenseReserve"
                                    label="Current Ceded Expense Reserve"
                                    value={currentPayment.beginningCededExpenseReserve}
                                    allowNegative={true}

                                />
                            </ContentCell>
                            <ContentCell width="33%">
                                <CurrencyInput
                                    disabled={true}
                                    inputProps={{ readOnly: true }}

                                    id="subro"
                                    name="Subro"
                                    label="Subrogation"
                                    value={request?.subrogation}    
                                    allowNegative={true}

                                />
                            </ContentCell>
                        </ContentRow>
                        <ContentRow>
                            <ContentCell width="33%">
                                <CurrencyInput
                                    disabled={isViewer}
                                    inputProps={{ readOnly: true }}
                                    id="currentAcr"
                                    name="currentAcr"
                                    label="Current ACR"
                                    value={currentPayment.beginningACR}
                                    allowNegative={true}

                                />
                            </ContentCell>
                            <ContentCell width="33%">
                                <CurrencyInput
                                    disabled={isViewer}
                                    inputProps={{ readOnly: true }}
                                    id="currentAer"
                                    name="currentAer"
                                    label="Current AER"
                                    value={currentPayment.beginningAER}
                                    allowNegative={true}

                                />
                            </ContentCell>
                        </ContentRow>


                        <ContentRow>

                            <ContentCell width="33%">
                                <CurrencyInput
                                    disabled={isViewer}
                                    label="Loss Payment Amount"
                                    required
                                    id="lossReserveTotal"
                                    name="lossReserveTotal"
                                    tooltip={findHelpTextByTag("lossReserveTotal", metadata.helpTags)}
                                    {...register("lossReserveTotal",
                                        {
                                            required: "This is required.",
                                            onChange: onCurrencyChanged

                                        }
                                    )}
                                    value={(currentPayment || {}).lossReserveTotal}
                                    error={errors.lossReserveTotal}
                                    inputProps={{ maxlength: 15 }}
                                    helperText={errors.lossReserveTotal ? errors.lossReserveTotal.message : ""}
                                    allowDecimal={true}
                                    onBlur={convertFloatStringToFloat}

                                />
                            </ContentCell>
                            {request.claim.g2LegalEntityID !== LEGAL_ENTITY.GENESIS_REINSURANCE &&
                                <ContentCell width="33%">
                                    <SelectList
                                        disabled={isViewer}
                                        required
                                        id="lossDescCode"
                                        name="lossDescCode"
                                        label="Loss Desc Code"
                                        fullWidth={true}
                                        {...register("lossDescCode",
                                            {
                                                required: "This is required.",
                                                onChange: onDropDownChanged
                                            }
                                        )
                                        }
                                        variant="outlined"
                                        value={(currentPayment || {}).lossDescCode}
                                        tooltip={findHelpTextByTag("lossDescCode", metadata.helpTags)}
                                        error={errors.lossDescCode}
                                        helperText={errors.lossDescCode ? errors.lossDescCode.message : ""}
                                    >
                                        {
                                            accountingTransCodesIndemity
                                                .map((item, idx) => <MenuItem value={item.transCode}>{item.transCodeDesc}</MenuItem>)
                                        }
                                    </SelectList>
                                </ContentCell>
                            }
                        </ContentRow>

                        <ContentRow>
                            <ContentCell width="33%">
                                <CurrencyInput
                                    disabled={isViewer}
                                    label="Expense Payment Amount"
                                    required
                                    id="expenseReserveTotal"
                                    name="expenseReserveTotal"
                                    tooltip={findHelpTextByTag("expenseReserveTotal", metadata.helpTags)}
                                    {...register("expenseReserveTotal",
                                        {
                                            required: "This is required.",
                                            onChange: onCurrencyChanged

                                        }
                                    )
                                    }
                                    value={(currentPayment || {}).expenseReserveTotal}
                                    error={errors.expenseReserveTotal}
                                    inputProps={{ maxlength: 15 }}
                                    helperText={errors.expenseReserveTotal ? errors.expenseReserveTotal.message : ""}
                                    allowDecimal={true}
                                    onBlur={convertFloatStringToFloat}
                                />
                            </ContentCell>
                            {request.claim.g2LegalEntityID !== LEGAL_ENTITY.GENESIS_REINSURANCE &&
                                <ContentCell width="33%">
                                    <SelectList
                                        disabled={isViewer}
                                        required
                                        id="expenseDescCode"
                                        name="expenseDescCode"
                                        label="Expense Desc Code"
                                        fullWidth={true}
                                        {...register("expenseDescCode",
                                            {
                                                required: "This is required.",
                                                onChange: onDropDownChanged
                                            }
                                        )
                                        }
                                        variant="outlined"
                                        value={(currentPayment || {}).expenseDescCode}
                                        tooltip={findHelpTextByTag("expenseDescCode", metadata.helpTags)}
                                        error={errors.expenseDescCode}
                                        helperText={errors.expenseDescCode ? errors.expenseDescCode.message : ""}
                                    >
                                        {
                                            accountingTransCodesExpense
                                                .map((item, idx) => <MenuItem value={item.transCode}>{item.transCodeDesc}</MenuItem>)
                                        }
                                    </SelectList>
                                </ContentCell>
                            }
                        </ContentRow>
                        <Divider />
                        <ContentCell width="100%">
                            <span style={{ fontWeight: 'bold' }}>Please supply Company dollars and any additional Reserves (ACR/AER) you might wish to post</span>
                        </ContentCell>
                        <ContentRow>
                            <ContentCell width="33%">
                                <CurrencyInput
                                    disabled={isViewer}
                                    required
                                    label="Company Paid Loss"
                                    id="companyPaidLoss"
                                    name="companyPaidLoss"
                                    tooltip={findHelpTextByTag("companyPaidLoss", metadata.helpTags)}
                                    {...register("companyPaidLoss",
                                        {
                                            required: "This is required.",
                                            onChange: onCurrencyChanged

                                        }
                                    )
                                    }
                                    value={(currentPayment || {}).companyPaidLoss}
                                    error={errors.companyPaidLoss}
                                    inputProps={{ maxlength: 15 }}
                                    helperText={errors.companyPaidLoss ? errors.companyPaidLoss.message : ""}
                                    allowDecimal={true}
                                    onBlur={convertFloatStringToFloat}
                                />
                            </ContentCell>

                            <ContentCell width="33%">
                                <CurrencyInput
                                    disabled={isViewer}
                                    required
                                    label="Company Loss Reserves"
                                    id="companyLossReserves"
                                    name="companyLossReserves"
                                    tooltip={findHelpTextByTag("companyLossReserves", metadata.helpTags)}
                                    {...register("companyLossReserves",
                                        {
                                            required: "This is required.",
                                            onChange: onCurrencyChanged

                                        }
                                    )
                                    }
                                    value={(currentPayment || {}).companyLossReserves}
                                    error={errors.companyLossReserves}
                                    inputProps={{ maxlength: 15 }}
                                    helperText={errors.companyLossReserves ? errors.companyLossReserves.message : ""}
                                    allowDecimal={true}
                                    onBlur={convertFloatStringToFloat}
                                />
                            </ContentCell>
                        </ContentRow>

                        <ContentRow>
                            <ContentCell width="33%">
                                <CurrencyInput
                                    disabled={isViewer}
                                    required
                                    label="Company Paid Expense"
                                    id="companyPaidExpense"
                                    name="companyPaidExpense"
                                    tooltip={findHelpTextByTag("companyPaidExpense", metadata.helpTags)}
                                    {...register("companyPaidExpense",
                                        {
                                            required: "This is required.",
                                            onChange: onCurrencyChanged

                                        }
                                    )
                                    }
                                    value={(currentPayment || {}).companyPaidExpense}
                                    error={errors.companyPaidExpense}
                                    inputProps={{ maxlength: 15 }}
                                    helperText={errors.companyPaidExpense ? errors.companyPaidExpense.message : ""}
                                    allowDecimal={true}
                                    onBlur={convertFloatStringToFloat}
                                />
                            </ContentCell>

                            <ContentCell width="33%">
                                <CurrencyInput
                                    disabled={isViewer}
                                    required
                                    label="Company Expense Reserve"
                                    id="companyExpenseReserve"
                                    name="companyExpenseReserve"
                                    tooltip={findHelpTextByTag("companyExpenseReserve", metadata.helpTags)}
                                    {...register("companyExpenseReserve",
                                        {
                                            required: "This is required.",
                                            onChange: onCurrencyChanged

                                        }
                                    )
                                    }
                                    value={(currentPayment || {}).companyExpenseReserve}
                                    error={errors.companyExpenseReserve}
                                    inputProps={{ maxlength: 15 }}
                                    helperText={errors.companyExpenseReserve ? errors.companyExpenseReserve.message : ""}
                                    allowDecimal={true}
                                    onBlur={convertFloatStringToFloat}
                                />
                            </ContentCell>
                        </ContentRow>
                        <ContentRow>
                            <ContentCell width="33%">
                                <CurrencyInput
                                    disabled={isViewer}
                                    label="ACR"
                                    id="acr"
                                    name="acr"
                                    tooltip={findHelpTextByTag("acr", metadata.helpTags)}
                                    {...register("acr",
                                        {
                                            required: "This is required.",
                                            onChange: onCurrencyChanged

                                        }
                                    )
                                    }
                                    value={(currentPayment || {}).acr}
                                    required
                                    error={errors.acr}
                                    inputProps={{ maxlength: 15 }}
                                    helperText={errors.acr ? errors.acr.message : ""}
                                />
                            </ContentCell>

                            <ContentCell width="33%">
                                <CurrencyInput
                                    disabled={isViewer}
                                    label="AER"
                                    id="aer"
                                    name="aer"
                                    required
                                    tooltip={findHelpTextByTag("aer", metadata.helpTags)}
                                    {...register("aer",
                                        {
                                            required: "This is required.",
                                            onChange: onCurrencyChanged

                                        }
                                    )
                                    }
                                    value={(currentPayment || {}).aer}
                                    error={errors.aer}
                                    inputProps={{ maxlength: 15 }}
                                    helperText={errors.aer ? errors.aer.message : ""}
                                    allowDecimal={true}
                                    onBlur={convertFloatStringToFloat}
                                />
                            </ContentCell>
                        </ContentRow>
                        <Divider />
                        <ContentCell width="100%">
                            <span style={{ fontWeight: 'bold' }}>Claims accounting will complete these amounts based on the company dollars provided above</span>
                        </ContentCell>
                        <ContentRow>
                            <ContentCell width="33%">
                                <CurrencyInput
                                    disabled={isViewer}
                                    label="Ceded Paid Loss"
                                    id="cededPaidLoss"
                                    name="cededPaidLoss"
                                    tooltip={findHelpTextByTag("cededPaidLoss", metadata.helpTags)}
                                    {...register("cededPaidLoss",
                                        {
                                            required: "This is required.",
                                            onChange: onCurrencyChanged

                                        }
                                    )
                                    }
                                    value={(currentPayment || {}).cededPaidLoss}
                                    error={errors.cededPaidLoss}
                                    inputProps={{ maxlength: 15 }}
                                    helperText={errors.cededPaidLoss ? errors.cededPaidLoss.message : ""}
                                    allowDecimal={true}
                                    onBlur={convertFloatStringToFloat}
                                />
                            </ContentCell>

                            <ContentCell width="33%">
                                <CurrencyInput
                                    disabled={isViewer}
                                    label="Ceded Loss Reserves"
                                    id="cededLossReserves"
                                    name="cededLossReserves"
                                    tooltip={findHelpTextByTag("cededLossReserves", metadata.helpTags)}
                                    {...register("cededLossReserves",
                                        {
                                            required: "This is required.",
                                            onChange: onCurrencyChanged

                                        }
                                    )
                                    }
                                    value={(currentPayment || {}).cededLossReserves}
                                    error={errors.cededLossReserves}
                                    inputProps={{ maxlength: 15 }}
                                    helperText={errors.cededLossReserves ? errors.cededLossReserves.message : ""}
                                    allowDecimal={true}
                                    onBlur={convertFloatStringToFloat}
                                />
                            </ContentCell>
                        </ContentRow>

                        <ContentRow>
                            <ContentCell width="33%">
                                <CurrencyInput
                                    disabled={isViewer}
                                    label="Ceded Paid Expense"
                                    id="cededPaidExpense"
                                    name="cededPaidExpense"
                                    tooltip={findHelpTextByTag("cededPaidExpense", metadata.helpTags)}
                                    {...register("cededPaidExpense",
                                        {
                                            required: "This is required.",
                                            onChange: onCurrencyChanged

                                        }
                                    )
                                    }
                                    value={(currentPayment || {}).cededPaidExpense}
                                    error={errors.cededPaidExpense}
                                    inputProps={{ maxlength: 15 }}
                                    helperText={errors.cededPaidExpense ? errors.cededPaidExpense.message : ""}
                                    allowDecimal={true}
                                    onBlur={convertFloatStringToFloat}
                                />
                            </ContentCell>

                            <ContentCell width="33%">
                                <CurrencyInput
                                    disabled={isViewer}
                                    label="Ceded Expense Reserve"
                                    id="cededExpenseReserve"
                                    name="cededExpenseReserve"
                                    tooltip={findHelpTextByTag("cededExpenseReserve", metadata.helpTags)}
                                    {...register("cededExpenseReserve",
                                        {
                                            required: "This is required.",
                                            onChange: onCurrencyChanged

                                        }
                                    )
                                    }
                                    value={(currentPayment || {}).cededExpenseReserve}
                                    error={errors.cededExpenseReserve}
                                    inputProps={{ maxlength: 15 }}
                                    helperText={errors.cededExpenseReserve ? errors.cededExpenseReserve.message : ""}
                                    allowDecimal={true}
                                    onBlur={convertFloatStringToFloat}
                                />
                            </ContentCell>
                        </ContentRow>

                        <ContentRow>
                            <ContentCell width="66%">
                                <TextInput
                                    disabled={isViewer}
                                    label="Comment"
                                    id="comment"
                                    name="comment"
                                    multiline
                                    rows={3}
                                    fullWidth={true}
                                    variant="outlined"
                                    onChange={onValueChanged}
                                    value={(currentPayment || {}).comment}
                                    tooltip={findHelpTextByTag("comment", metadata.helpTags)}
                                />
                            </ContentCell>
                        </ContentRow>

                    </>
                    }
                    </>
                }
                {[ACCOUNTING_TRANS_TYPES.WC_PAYMENT_RESERVE, ACCOUNTING_TRANS_TYPES.WC_EXPENSE_PAYMENT].includes(request.currentClaimActivity.accountingTransTypeID) &&
                    <>
                        <ContentRow>
                            <ContentCell width="33%">
                                <DatePicker
                                    disabled={isViewer}
                                    id="companyFinancialDate"
                                    name="companyFinancialDate"
                                    label="Company Financials as of date"
                                    fullWidth={true}
                                    value={currentPayment?.companyFinancialDate}
                                    onBlur={onDateChanged}
                                    onChange={onDateChanged}
                                    tooltip={findHelpTextByTag("companyFinancialDate", metadata.helpTags)}
                                    {...register("companyFinancialDate",
                                        {
                                            required: "This is required.",
                                            onChange: onDateChanged
                                        }
                                    )
                                    }
                                    error={errors.companyFinancialDate}
                                    helperText={errors.companyFinancialDate ? errors.companyFinancialDate.message : ""}
                                    variant="outlined"
                                    disableFuture={true}
                                />
                            </ContentCell>
                    </ContentRow>
                    <ContentCell width="66%" style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <span style={{ fontWeight: 'bold' }}>Current Company Financials</span>
                    </ContentCell>
                    {currentClaimActivity.accountingTransTypeID !== ACCOUNTING_TRANS_TYPES.WC_EXPENSE_PAYMENT &&
                        <>
                            <ContentRow>
                                <ContentCell width="33%">
                                    <CurrencyInput
                                        disabled={isViewer}
                                        label="Indemnity Paid"
                                        id="companyPaidLoss"
                                        name="companyPaidLoss"
                                        value={currentPayment.companyPaidLoss}
                                        tooltip={findHelpTextByTag("companyIndemnityPaid", metadata.helpTags)}
                                        {...register("companyPaidLoss",
                                            {
                                                required: "This is required.",
                                                onChange: onCurrencyChanged
                                            }
                                        )
                                        }
                                        error={errors.companyPaidLoss}
                                        inputProps={{ maxlength: 15 }}
                                        helperText={errors.companyPaidLoss ? errors.companyPaidLoss.message : ""}
                                        allowDecimal={true}
                                        onBlur={convertFloatStringToFloat}
                                    />
                                </ContentCell>
                                <ContentCell width="33%">
                                    <CurrencyInput
                                        disabled={isViewer}
                                        label="Indemnity Reserves"
                                        id="companyLossReserves"
                                        name="companyLossReserves"
                                        value={currentPayment.companyLossReserves}
                                        tooltip={findHelpTextByTag("companyLossReserves", metadata.helpTags)}
                                        {...register("companyLossReserves",
                                            {
                                                required: "This is required.",
                                                onChange: onCurrencyChanged
                                            }
                                        )
                                        }
                                        error={errors.companyLossReserves}
                                        inputProps={{ maxlength: 15 }}
                                        helperText={errors.companyLossReserves ? errors.companyLossReserves.message : ""}
                                        allowDecimal={true}
                                        onBlur={convertFloatStringToFloat}
                                    />
                                </ContentCell>
                            </ContentRow>
                            <ContentRow>
                        <ContentCell width="33%">
                            <CurrencyInput
                                disabled={isViewer}
                                label="Medical Paid"
                                id="companyMedicalPaid"
                                name="companyMedicalPaid"
                                value={currentPayment.companyMedicalPaid}
                                tooltip={findHelpTextByTag("companyMedicalPaid", metadata.helpTags)}
                                {...register("companyMedicalPaid",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged
                                    }
                                )
                                }
                                error={errors.companyMedicalPaid}
                                inputProps={{ maxlength: 15 }}
                                helperText={errors.companyMedicalPaid ? errors.companyMedicalPaid.message : ""}
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <CurrencyInput
                                disabled={isViewer}
                                label="Medical Reserves"
                                id="companyMedicalReserves"
                                name="companyMedicalReserves"
                                value={currentPayment.companyMedicalReserves}
                                tooltip={findHelpTextByTag("companyMedicalReserves", metadata.helpTags)}
                                {...register("companyMedicalReserves",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged
                                    }
                                )
                                }
                                error={errors.companyMedicalReserves}
                                inputProps={{ maxlength: 15 }}
                                helperText={errors.companyMedicalReserves ? errors.companyMedicalReserves.message : ""}
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                            />
                        </ContentCell>
                    </ContentRow>
                        </>
                        }
                    <ContentRow>
                        <ContentCell width="33%">
                            <CurrencyInput
                                disabled={isViewer}
                                label="Expense Paid"
                                id="companyPaidExpense"
                                name="companyPaidExpense"
                                tooltip={findHelpTextByTag("companyPaidExpense", metadata.helpTags)}
                                {...register("companyPaidExpense",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged

                                    }
                                )
                                }
                                value={currentPayment.companyPaidExpense}
                                error={errors.companyPaidExpense}
                                inputProps={{ maxlength: 15 }}
                                helperText={errors.companyPaidExpense ? errors.companyPaidExpense.message : ""}
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <CurrencyInput
                                disabled={isViewer}
                                label="Expense Reserves"
                                id="companyExpenseReserve"
                                name="companyExpenseReserve"
                                tooltip={findHelpTextByTag("companyExpenseReserve", metadata.helpTags)}
                                {...register("companyExpenseReserve",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged

                                    }
                                )
                                }
                                value={currentPayment.companyExpenseReserve}
                                error={errors.companyExpenseReserve}
                                inputProps={{ maxlength: 15 }}
                                helperText={errors.companyExpenseReserve ? errors.companyExpenseReserve.message : ""}
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                            />
                        </ContentCell>
                    </ContentRow>
                    {currentClaimActivity.accountingTransTypeID !== ACCOUNTING_TRANS_TYPES.WC_EXPENSE_PAYMENT &&                        
                        <ContentRow>
                        <ContentCell width="33%">
                            <CurrencyInput
                                disabled={isViewer}
                                label="Subro/SIF"
                                id="companySubroSIF"
                                name="companySubroSIF"
                                tooltip={findHelpTextByTag("companySubroSIF", metadata.helpTags)}
                                {...register("companySubroSIF",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged

                                    }
                                )
                                }
                                value={currentPayment.companySubroSIF}
                                error={errors.companySubroSIF}
                                inputProps={{ maxlength: 15 }}
                                helperText={errors.companySubroSIF ? errors.companySubroSIF.message : ""}
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                            />
                        </ContentCell>
                        </ContentRow>
                    }
                    <ContentRow>
                        {currentClaimActivity.accountingTransTypeID !== ACCOUNTING_TRANS_TYPES.WC_EXPENSE_PAYMENT &&
                            <ContentCell width="33%">
                                <CurrencyInput
                                    disabled={isViewer}
                                    label="Loss Payment Amount"
                                    id="lossReserveTotal"
                                    name="lossReserveTotal"
                                    tooltip={findHelpTextByTag("lossReserveTotal", metadata.helpTags)}
                                    {...register("lossReserveTotal",
                                        {
                                            required: "This is required.",
                                            onChange: onCurrencyChanged

                                        }
                                    )}
                                    value={(currentPayment || {}).lossReserveTotal}
                                    error={errors.lossReserveTotal}
                                    inputProps={{ maxlength: 15 }}
                                    helperText={errors.lossReserveTotal ? errors.lossReserveTotal.message : ""}
                                    allowDecimal={true}
                                    onBlur={convertFloatStringToFloat}

                                />
                            </ContentCell>
                        }
                        <ContentCell width="33%">
                            <CurrencyInput
                                disabled={isViewer}
                                label="Expense Payment Amount"
                                id="expenseReserveTotal"
                                name="expenseReserveTotal"
                                tooltip={findHelpTextByTag("expenseReserveTotal", metadata.helpTags)}
                                {...register("expenseReserveTotal",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged

                                    }
                                )}
                                value={(currentPayment || {}).expenseReserveTotal}
                                error={errors.expenseReserveTotal}
                                inputProps={{ maxlength: 15 }}
                                helperText={errors.expenseReserveTotal ? errors.expenseReserveTotal.message : ""}
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={isViewer}
                                label="Payee"
                                id="payee"
                                name="payee"
                                tooltip={findHelpTextByTag("payee", metadata.helpTags)}
                                {...register("payee",
                                    {
                                        required: "This is required.",
                                        onChange: onValueChanged

                                    }
                                )}
                                value={(currentPayment || {}).payee}
                                error={errors.payee}
                                inputProps={{ maxlength: 15 }}
                                helperText={errors.payee ? errors.payee.message : ""}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={isViewer}
                                label="Vendor Number"
                                id="vendorNumber"
                                name="vendorNumber"
                                tooltip={findHelpTextByTag("vendorNumber", metadata.helpTags)}
                                {...register("vendorNumber",
                                    {
                                        required: "This is required.",
                                        onChange: onValueChanged

                                    }
                                )}
                                value={(currentPayment || {}).vendorNumber}
                                error={errors.vendorNumber}
                                inputProps={{ maxlength: 15 }}
                                helperText={errors.vendorNumber ? errors.vendorNumber.message : ""}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="33%">
                            <SelectList
                                disabled={isViewer}
                                id="paymentTypeCode"
                                name="paymentTypeCode"
                                label="Payment Type"
                                fullWidth={true}
                                {...register("paymentTypeCode",
                                    {
                                        onChange: onDropDownChanged
                                    }
                                )
                                }
                                variant="outlined"
                                value={currentPayment.paymentTypeCode}
                                tooltip={findHelpTextByTag("paymentTypeCode", metadata.helpTags)}
                                error={errors.paymentTypeCode}
                                helperText={errors.paymentTypeCode ? errors.paymentTypeCode.message : ""}
                            >
                                <MenuItem value="W">Wire Payment</MenuItem>
                                <MenuItem value="F">Fedex Payment</MenuItem>
                            </SelectList>
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="100%">
                            <TextInput
                                label="Payment Comments/Instructions"
                                disabled={isViewer}
                                id="paymentComment"
                                name="paymentComment"
                                fullWidth={true}
                                multiline
                                rows={3}
                                variant="outlined"
                                value={currentPayment.paymentComment}
                                tooltip={findHelpTextByTag("paymentComment", metadata.helpTags)}
                                {...register("paymentComment",
                                    {
                                        onChange: onValueChanged
                                    }
                                )
                                }
                                error={errors.paymentComment}
                                helperText={errors.paymentComment ? errors.paymentComment.message : ""}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="100%">
                            <TextInput
                                label="General Comments/Instructions"
                                disabled={isViewer}
                                id="comment"
                                name="comment"
                                fullWidth={true}
                                multiline
                                rows={3}
                                variant="outlined"
                                value={currentPayment.comment}
                                tooltip={findHelpTextByTag("comment", metadata.helpTags)}
                                {...register("comment",
                                    {
                                        onChange: onValueChanged
                                    }
                                )
                                }
                                error={errors.comment}
                                helperText={errors.comment ? errors.comment.message : ""}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="100%">
                            <TextInput
                                label="Link to Cara docs"
                                disabled={isViewer}
                                id="caraDocs"
                                name="caraDocs"
                                fullWidth={true}
                                variant="outlined"
                                value={currentPayment.caraDocs}
                                tooltip={findHelpTextByTag("caraDocs", metadata.helpTags)}
                                {...register("caraDocs",
                                    {
                                        onChange: onValueChanged
                                    }
                                )
                                }
                                error={errors.caraDocs}
                                helperText={errors.caraDocs ? errors.caraDocs.message : ""}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentCell width="100%">
                        <span>**Ceded Financial (Updated) is to be input by Claims Accounting after the transaction has been processed in the statutory system</span>
                    </ContentCell>
                    <ContentRow>
                        <ContentCell width="50%" style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <span style={{ fontWeight: 'bold' }}>Ceded Financials (Prior)</span>
                        </ContentCell>
                        <ContentCell width="50%" style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <span style={{ fontWeight: 'bold' }}>Ceded Financials (Updated)</span>
                        </ContentCell>

                    </ContentRow>
                    {currentClaimActivity.accountingTransTypeID !== ACCOUNTING_TRANS_TYPES.WC_EXPENSE_PAYMENT &&
                        <ContentRow>
                        <ContentCell width="25%">
                            <CurrencyInput
                                label="Indemnity Paid"
                                id="beginningCededPaidLoss"
                                name="beginningCededPaidLoss"
                                disabled={isViewer}
                                tooltip={findHelpTextByTag("beginningCededPaidLoss", metadata.helpTags)}
                                {...register("beginningCededPaidLoss",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged

                                    }
                                )
                                }
                                error={errors.beginningCededPaidLoss}
                                helperText={errors.beginningCededPaidLoss ? errors.beginningCededPaidLoss.message : ""}
                                InputProps={claim.claimType === CLAIM_TYPES.WORKERS_COMP && claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.NAT_RE ? { readOnly: false, maxlength: 13 } : { readOnly: true }}
                                onBlur={convertFloatStringToFloat}
                                value={currentPayment.beginningCededPaidLoss}
                                allowDecimal={true}
                            />
                        </ContentCell>
                        <ContentCell width="25%">
                            <CurrencyInput
                                label="Indemnity Reserves"
                                id="beginningCededLossReserve"
                                name="beginningCededLossReserve"
                                disabled={isViewer}
                                tooltip={findHelpTextByTag("beginningCededLossReserve", metadata.helpTags)}
                                {...register("beginningCededLossReserve",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged

                                    }
                                )
                                }
                                error={errors.beginningCededLossReserve}
                                helperText={errors.beginningCededLossReserve ? errors.beginningCededLossReserve.message : ""}
                                InputProps={claim.claimType === CLAIM_TYPES.WORKERS_COMP && claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.NAT_RE ? { readOnly: false, maxlength: 13 } : { readOnly: true }}
                                onBlur={convertFloatStringToFloat}
                                value={currentPayment.beginningCededLossReserve}
                                allowDecimal={true}
                            />
                        </ContentCell>
                        <ContentCell width="25%">
                            <CurrencyInput
                                disabled={isViewer}
                                label="Indemnity Paid"
                                id="cededPaidLoss"
                                name="cededPaidLoss"
                                disabled={isViewer}
                                value={currentPayment.cededPaidLoss}
                                tooltip={findHelpTextByTag("cededPaidLoss", metadata.helpTags)}
                                {...register("cededPaidLoss",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged

                                    }
                                )
                                }
                                error={errors.cededPaidLoss}
                                inputProps={{ maxlength: 15 }}
                                helperText={errors.cededPaidLoss ? errors.cededPaidLoss.message : ""}
                                onBlur={convertFloatStringToFloat}
                                allowDecimal={true}
                            />
                        </ContentCell>
                        <ContentCell width="25%">
                            <CurrencyInput
                                disabled={isViewer}
                                label="Indemnity Reserves"
                                id="cededLossReserves"
                                name="cededLossReserves"
                                tooltip={findHelpTextByTag("cededLossReserves", metadata.helpTags)}
                                {...register("cededLossReserves",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged

                                    }
                                )
                                }
                                value={currentPayment.cededLossReserves}
                                error={errors.cededLossReserves}
                                inputProps={{ maxlength: 15 }}
                                helperText={errors.cededLossReserves ? errors.cededLossReserves.message : ""}
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                            />
                        </ContentCell>
                    </ContentRow>
                    }
                    <ContentRow>
                        <ContentCell width="25%">
                            <CurrencyInput
                                label="Expense Paid"
                                id="beginningCededPaidExpense"
                                name="beginningCededPaidExpense"
                                disabled={isViewer}
                                tooltip={findHelpTextByTag("beginningCededPaidExpense", metadata.helpTags)}
                                {...register("beginningCededPaidExpense",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged

                                    }
                                )
                                }
                                error={errors.beginningCededPaidExpense}
                                helperText={errors.beginningCededPaidExpense ? errors.beginningCededPaidExpense.message : ""}
                                InputProps={claim.claimType === CLAIM_TYPES.WORKERS_COMP && claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.NAT_RE ? { readOnly: false, maxlength: 13 } : { readOnly: true }}
                                onBlur={convertFloatStringToFloat}
                                value={currentPayment.beginningCededPaidExpense}
                                allowDecimal={true}
                            />
                        </ContentCell>
                        <ContentCell width="25%">
                            <CurrencyInput
                                label="Expense Reserves"
                                id="beginningCededExpenseReserve"
                                name="beginningCededExpenseReserve"
                                disabled={isViewer}
                                tooltip={findHelpTextByTag("beginningCededExpenseReserve", metadata.helpTags)}
                                {...register("beginningCededExpenseReserve",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged

                                    }
                                )
                                }
                                error={errors.beginningCededExpenseReserve}
                                helperText={errors.beginningCededExpenseReserve ? errors.beginningCededExpenseReserve.message : ""}
                                InputProps={claim.claimType === CLAIM_TYPES.WORKERS_COMP && claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.NAT_RE ? { readOnly: false, maxlength: 13 } : { readOnly: true }}
                                onBlur={convertFloatStringToFloat}
                                value={currentPayment.beginningCededExpenseReserve}
                                allowDecimal={true}
                            />
                        </ContentCell>
                        <ContentCell width="25%">
                            <CurrencyInput
                                disabled={isViewer}
                                label="Expense Paid"
                                id="cededPaidExpense"
                                name="cededPaidExpense"
                                disabled={isViewer}
                                value={currentPayment.cededPaidExpense}
                                tooltip={findHelpTextByTag("cededPaidExpense", metadata.helpTags)}
                                {...register("cededPaidExpense",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged

                                    }
                                )
                                }
                                error={errors.cededPaidExpense}
                                inputProps={{ maxlength: 15 }}
                                helperText={errors.cededPaidExpense ? errors.cededPaidExpense.message : ""}
                                onBlur={convertFloatStringToFloat}
                                allowDecimal={true}
                            />
                        </ContentCell>
                        <ContentCell width="25%">
                            <CurrencyInput
                                disabled={isViewer}
                                label="Expense Reserves"
                                id="cededExpenseReserve"
                                name="cededExpenseReserve"
                                tooltip={findHelpTextByTag("cededExpenseReserve", metadata.helpTags)}
                                {...register("cededExpenseReserve",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged

                                    }
                                )
                                }
                                value={currentPayment.cededExpenseReserve}
                                error={errors.cededExpenseReserve}
                                inputProps={{ maxlength: 15 }}
                                helperText={errors.cededExpenseReserve ? errors.cededExpenseReserve.message : ""}
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                            />
                        </ContentCell>
                    </ContentRow>
                    {currentClaimActivity.accountingTransTypeID !== ACCOUNTING_TRANS_TYPES.WC_EXPENSE_PAYMENT &&
                        <>
                            <ContentRow>
                                <ContentCell width="25%"></ContentCell>
                                <ContentCell width="25%">
                                    <CurrencyInput
                                        label="ACR"
                                        id="beginningACR"
                                        name="beginningACR"
                                        disabled={isViewer}
                                        tooltip={findHelpTextByTag("beginningACR", metadata.helpTags)}
                                        {...register("beginningACR",
                                                {
                                                    required: "This is required.",
                                                    onChange: onCurrencyChanged

                                                }
                                            )
                                        }
                                        error={errors.beginningACR}
                                        helperText={errors.beginningACR ? errors.beginningACR.message : ""}
                                        InputProps={claim.claimType === CLAIM_TYPES.WORKERS_COMP && claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.NAT_RE ? { readOnly: false, maxlength: 13 } : { readOnly: true }}
                                        onBlur={convertFloatStringToFloat}
                                        value={currentPayment.beginningACR}
                                        allowDecimal={true}
                                    />
                                </ContentCell>
                                <ContentCell width="25%"></ContentCell>
                                <ContentCell width="25%">
                                    <CurrencyInput
                                        disabled={isViewer}
                                        label="ACR"
                                        id="acr"
                                        name="acr"
                                        tooltip={findHelpTextByTag("acr", metadata.helpTags)}
                                        {...register("acr",
                                            {
                                                required: "This is required.",
                                                onChange: onCurrencyChanged

                                            }
                                        )
                                        }
                                        value={currentPayment.acr}
                                        error={errors.acr}
                                        inputProps={{ maxlength: 15 }}
                                        helperText={errors.acr ? errors.acr.message : ""}
                                        allowDecimal={true}
                                        onBlur={convertFloatStringToFloat}
                                    />
                                </ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell width="25%"></ContentCell>
                                <ContentCell width="25%">
                                    <CurrencyInput
                                        label="AER"
                                        id="beginningAER"
                                        name="beginningAER"
                                        disabled={isViewer}
                                        tooltip={findHelpTextByTag("beginningAER", metadata.helpTags)}
                                        {...register("beginningAER",
                                            {
                                                required: "This is required.",
                                                onChange: onCurrencyChanged

                                            }
                                        )
                                        }
                                        error={errors.beginningAER}
                                        InputProps={claim.claimType === CLAIM_TYPES.WORKERS_COMP && claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.NAT_RE ? { readOnly: false, maxlength: 13 } : { readOnly: true }}
                                        helperText={errors.beginningAER ? errors.beginningAER.message : ""}
                                        onBlur={convertFloatStringToFloat}
                                        value={currentPayment.beginningAER}
                                        allowDecimal={true}
                                    />
                                </ContentCell>
                                <ContentCell width="25%"></ContentCell>
                                <ContentCell width="25%">
                                    <CurrencyInput
                                        disabled={isViewer}
                                        label="AER"
                                        id="aer"
                                        name="aer"
                                        tooltip={findHelpTextByTag("aer", metadata.helpTags)}
                                        {...register("aer",
                                            {
                                                required: "This is required.",
                                                onChange: onCurrencyChanged

                                            }
                                        )
                                        }
                                        value={currentPayment.aer}
                                        error={errors.aer}
                                        inputProps={{ maxlength: 15 }}
                                        helperText={errors.aer ? errors.aer.message : ""}
                                        allowDecimal={true}
                                        onBlur={convertFloatStringToFloat}
                                    />
                                </ContentCell>
                            </ContentRow>
                        </>
                    }
                    <ContentRow>
                        <ContentCell width="75%"></ContentCell>
                        <ContentCell width="25%">
                            <CurrencyInput
                                disabled={isViewer}
                                label={currentClaimActivity.accountingTransTypeID !== ACCOUNTING_TRANS_TYPES.WC_EXPENSE_PAYMENT ? "Total Incured Change Amount" : "Transaction Reserve Change Amount"}
                                id="reserveAuthorityCheckAmount"
                                name="reserveAuthorityCheckAmount"
                                allowNegative={true}
                                tooltip={findHelpTextByTag("reserveAuthorityCheckAmount", metadata.helpTags)}
                                {...register("reserveAuthorityCheckAmount",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged

                                    }
                                )
                                }
                                value={currentPayment.reserveAuthorityCheckAmount}
                                error={errors.reserveAuthorityCheckAmount}
                                inputProps={{ maxlength: 15 }}
                                helperText={errors.reserveAuthorityCheckAmount ? errors.reserveAuthorityCheckAmount.message : ""}
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                            />
                        </ContentCell>
                    </ContentRow>
                    </>
                }
                <Divider />
                <ApproverSection claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} />
            </PanelContent>
        </Panel>
    );
};
