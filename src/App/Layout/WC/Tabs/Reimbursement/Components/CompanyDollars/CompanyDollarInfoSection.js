import { MenuItem } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import { Panel, PanelContent, SelectList, TextInput, PanelHeader, CurrencyInput } from '../../../../../../Core/Forms/Common';
import { useDispatch, useSelector } from 'react-redux';


import {
    ASYNC_STATES
} from '../../../../../../Core/Enumerations/redux/async-states';
import { useSnackbar } from 'notistack';

import {
    ReimbursementCompanyDollarActions,
    ReimbursementCompanyDollarSelectors,
    ReimbursementCompanyDollarSaveSelectors,
    ReimbursementCompanyDollarListActions,
} from '../../../../../../Core/State/slices/reimbursement'
import {
    WCClaimantSaveActions, WCClaimantListSelectors, WCClaimantListActions,
} from '../../../../../../Core/State/slices/wc-claimant'
import { CompanyDollarListSection } from "./CompanyDollarListSection"
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
padding: 1em;
`;
export const CompanyDollarInfoSection = ({ claim, request, dispatch }) => {
    const { enqueueSnackbar } = useSnackbar();

    let currentReimbursementCompanyDollar = request.currentReimbursementCompanyDollar;
    let $dispatch = useDispatch();

    const onValueChanged = (evt) => {
        request.currentReimbursementCompanyDollar[evt.target.name] = evt.target.value;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
    };
    const onDropDownChanged = (evt) => {
        request.currentReimbursementCompanyDollar[evt.target.name] = evt.target.value;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
    };

    const reimbursementCompanyDollarState = useSelector(ReimbursementCompanyDollarSelectors.selectLoading());
    const reimbursementCompanyDollars = useSelector(ReimbursementCompanyDollarSelectors.selectData());

    const reimbursementCompanyDollarSaveState = useSelector(ReimbursementCompanyDollarSaveSelectors.selectLoading());
    const reimbursementCompanyDollarSave = useSelector(ReimbursementCompanyDollarSaveSelectors.selectData());

    const wcClaimantListState = useSelector(WCClaimantListSelectors.selectLoading());
    const wcClaimantList = useSelector(WCClaimantListSelectors.selectData());

    const convertFloatStringToFloat = (evt) => {
        let val = evt.target.value;
        val = val.replace("$", "");
        val = val.replaceAll(",", "");
        currentReimbursementCompanyDollar[evt.target.name] = !isNaN(parseFloat(val)) ? parseFloat(val) : val;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
    };
    React.useEffect(() => {
            $dispatch(WCClaimantListActions.list({ claimMasterID: claim.claimMasterID }));
        return () => {
            $dispatch(WCClaimantSaveActions.clearStatus());
        }

    }, []);

    React.useEffect(() => {
        if (reimbursementCompanyDollarState === ASYNC_STATES.SUCCESS) {
            $dispatch(ReimbursementCompanyDollarActions.clearStatus());
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, originalReimbursementCompanyDollar: JSON.parse(JSON.stringify(reimbursementCompanyDollars)), currentReimbursementCompanyDollar: JSON.parse(JSON.stringify(reimbursementCompanyDollars)), editMOdeCompanyDollar: true, isProcessing: false, isSaving: false } });
        } else if (reimbursementCompanyDollarState === ASYNC_STATES.ERROR) {
            $dispatch(ReimbursementCompanyDollarActions.clearStatus());
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });
        }

    }, [reimbursementCompanyDollarState]);
    React.useEffect(() => {
        if (reimbursementCompanyDollarSaveState === ASYNC_STATES.SUCCESS) {
            if (request.isProcessing) {
                enqueueSnackbar("Company Dollar information has been saved successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                $dispatch(ReimbursementCompanyDollarActions.get({ reimbursementCompanyDollarID: reimbursementCompanyDollarSave.reimbursementCompanyDollarID }));
            } else {
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, originalReimbursementCompanyDollar: JSON.parse(JSON.stringify(request.currentReimbursementCompanyDollar)), isSaving: false, isProcessing: false } });
            }
        } else if (reimbursementCompanyDollarSaveState === ASYNC_STATES.ERROR) {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
        }
    }, [reimbursementCompanyDollarSaveState]);



    return (
        <>
            <Panel>
                <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Company Dollar Details</span></PanelHeader>
                <PanelContent>
                    <ContentRow>
                        <ContentCell width="33%">
                            <SelectList
                                id="wCClaimantID"
                                name="wCClaimantID"
                                label="Claimants"
                                fullWidth={true}
                                required
                                defaultValue
                                variant="outlined"
                                value={currentReimbursementCompanyDollar?.wCClaimantID ? currentReimbursementCompanyDollar?.wCClaimantID : ""}
                                onChange={onDropDownChanged}
                            >
                                {
                                    wcClaimantList?.map((rs, idx) => <MenuItem value={`${rs.wCClaimantID}`} key={idx}>{rs.claimantName}</MenuItem>)
                                }
                            </SelectList>
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="33%">
                            <CurrencyInput
                                id="paidToDateIndemnity"
                                name="paidToDateIndemnity"
                                label="Paid To Date Indemnity"
                                onChange={onValueChanged}
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                                value={currentReimbursementCompanyDollar?.paidToDateIndemnity}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <CurrencyInput
                                id="outstandingIndemnityReserves"
                                name="outstandingIndemnityReserves"
                                label="Outstanding Indemnity Reserves"
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                                onChange={onValueChanged}
                                value={currentReimbursementCompanyDollar?.outstandingIndemnityReserves}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <CurrencyInput
                                id="subrogation"
                                name="subrogation"
                                onChange={onValueChanged}
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                                label="Subrogation"
                                value={currentReimbursementCompanyDollar?.subrogation}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="33%">
                            <CurrencyInput
                                id="paidToDateMedical"
                                name="paidToDateMedical"
                                label="Paid To Date Medical"
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                                onChange={onValueChanged}
                                value={currentReimbursementCompanyDollar?.paidToDateMedical}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <CurrencyInput
                                id="outstandingMedicalReserves"
                                name="outstandingMedicalReserves"
                                label="Outstanding Medical Reserves"
                                onBlur={convertFloatStringToFloat}
                                allowDecimal={true}
                                onChange={onValueChanged}
                                value={currentReimbursementCompanyDollar?.outstandingMedicalReserves}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <CurrencyInput
                                id="secondInjuryFund"
                                name="secondInjuryFund"
                                onBlur={convertFloatStringToFloat}
                                allowDecimal={true}
                                onChange={onValueChanged}
                                value={currentReimbursementCompanyDollar?.secondInjuryFund}
                                label="Second Injury Fund"
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="50%">
                            <CurrencyInput
                                id="totalLossPaid"
                                name="totalLossPaid"
                                label="Total Loss Paid"
                                onBlur={convertFloatStringToFloat}
                                allowDecimal={true}
                                onChange={onValueChanged}
                                value={(Number(currentReimbursementCompanyDollar?.paidToDateMedical ?
                                    currentReimbursementCompanyDollar?.paidToDateMedical : 0) +
                                    Number(currentReimbursementCompanyDollar?.paidToDateIndemnity ?
                                        currentReimbursementCompanyDollar?.paidToDateIndemnity : 0)).toFixed(2)}
                                InputProps={{ readOnly: true }}
                            />
                        </ContentCell>
                        <ContentCell width="50%">
                            <CurrencyInput
                                id="totalOutstandingLossReserves"
                                name="totalOutstandingLossReserves"
                                label="Total Outstanding Loss Reserves"
                                onBlur={convertFloatStringToFloat}
                                allowDecimal={true}
                                onChange={onValueChanged}
                                value={(Number(currentReimbursementCompanyDollar?.outstandingIndemnityReserves ?
                                    currentReimbursementCompanyDollar?.outstandingIndemnityReserves : 0) +
                                    Number(currentReimbursementCompanyDollar?.outstandingMedicalReserves ?
                                        currentReimbursementCompanyDollar?.outstandingMedicalReserves : 0)).toFixed(2)}
                                InputProps={{ readOnly: true }}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="50%">
                            <CurrencyInput
                                id="paidToDateExpense"
                                name="paidToDateExpense"
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                                onChange={onValueChanged}
                                value={currentReimbursementCompanyDollar?.paidToDateExpense}
                                label="Paid To Date Expense"
                            />
                        </ContentCell>
                        <ContentCell width="50%">
                            <CurrencyInput
                                id="outstandingExpenseReserves"
                                name="outstandingExpenseReserves"
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                                onChange={onValueChanged}
                                value={currentReimbursementCompanyDollar?.outstandingExpenseReserves}
                                label="Outstanding Expense Reserves"
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="100%">
                            <TextInput
                                multiLine={true}
                                id="comments"
                                name="comments"
                                label="Comments"
                                maxLength="1024"
                                inputProps={{ maxlength: 1024 }}
                                onChange={onValueChanged}
                                value={currentReimbursementCompanyDollar?.comments}
                                multiline
                                InputLabelProps={{ shrink: true }}  
                                rows={3}
                            />
                        </ContentCell>
                    </ContentRow>
                </PanelContent>
                <CompanyDollarListSection claim={claim} request={request} dispatch={dispatch} />
            </Panel>
        </>
    )
}

