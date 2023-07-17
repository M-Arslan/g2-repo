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
    WCReimbursementtCalculationSelectors,
    WCReimbursementCalculationActions,
    WCReimbursementCalculationSaveSelectors,
    WCReimbursementCalculationSaveActions
} from '../../../../../../Core/State/slices/reimbursement-calculation'
import {
    GetCalculationetail
} from '../../../../../../Core/State/slices/reimbursement-calculation/queries/GetCalculationDetail'
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
export const CalculationInfoSection = ({ claim, request, dispatch, onSave }) => {
    const { enqueueSnackbar } = useSnackbar();

    /*    let currentReimbursementCalculation = request.reimbursementCalculation;*/
    let $dispatch = useDispatch();

    const reimbursementCalculationState = useSelector(WCReimbursementtCalculationSelectors.selectLoading());
    const reimbursementCalculation = useSelector(WCReimbursementtCalculationSelectors.selectData());

    const currentReimbursementCalculation = reimbursementCalculation ? reimbursementCalculation[0] : null;
    const reimbursementCalculationSaveState = useSelector(WCReimbursementCalculationSaveSelectors.selectLoading());
    const reimbursementCalculationSave = useSelector(WCReimbursementCalculationSaveSelectors.selectData());

    React.useEffect(() => {
        $dispatch(WCReimbursementCalculationActions.list({ wCReimbursementID: request.currentReimbursement.wCReimbursementID }));
        if (reimbursementCalculationState === ASYNC_STATES.SUCCESS) {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentReimbursementCalculation: JSON.parse(JSON.stringify(reimbursementCalculation)), isProcessing: false, isSaving: false } });
        } else if (reimbursementCalculationState === ASYNC_STATES.ERROR) {
            $dispatch(WCReimbursementCalculationActions.clearStatus());
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });
        }

    }, []);

    React.useEffect(() => {
        if (reimbursementCalculationState === ASYNC_STATES.SUCCESS) {
            $dispatch(WCReimbursementCalculationActions.clearStatus());
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentReimbursementCalculation: JSON.parse(JSON.stringify(reimbursementCalculation)), isProcessing: false, isSaving: false } });
        } else if (reimbursementCalculationState === ASYNC_STATES.ERROR) {
            $dispatch(WCReimbursementCalculationActions.clearStatus());
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });
        }

    }, [reimbursementCalculationState]);
    React.useEffect(() => {
        if (reimbursementCalculationSaveState === ASYNC_STATES.SUCCESS) {
            if (request.isProcessing) {
                enqueueSnackbar("Company Dollar information has been saved successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                $dispatch(WCReimbursementCalculationActions.get({ reimbursementCalculationID: reimbursementCalculationSave.reimbursementCalculationID }));
            } else {
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
            }
        } else if (reimbursementCalculationSaveState === ASYNC_STATES.ERROR) {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
        }
    }, [reimbursementCalculationSaveState]);

    //Formulas
    const netLossToGenesis = (currentReimbursementCalculation?.totalAdjustedLossPaid || 0) - (currentReimbursementCalculation?.bobRetention || 0)

    const totalLossDue = ((currentReimbursementCalculation?.totalAdjustedLossPaid || 0) -
        ((currentReimbursementCalculation?.bobRetention || 1) *
            (currentReimbursementCalculation?.totalAdjustedLossPaid || 1)) /
        ((currentReimbursementCalculation?.totalAdjustedLossPaid || 0) +
            (currentReimbursementCalculation?.totalAdjustedPaidExpense || 0)) -
        (currentReimbursementCalculation?.totalRecovery || 0)) *
        (currentReimbursementCalculation?.grcParticipation || 1);
    const totalLossDueALEA = ((currentReimbursementCalculation?.totalAdjustedLossPaid || 0) -
        (currentReimbursementCalculation?.totalRecovery || 0) -
        (currentReimbursementCalculation?.bobRetention || 0)) *
        (currentReimbursementCalculation?.grcParticipation || 1);

    const expensePercentage = (totalLossDue || 1) / (currentReimbursementCalculation?.totalAdjustedLossPaid || 1)
    const expensePercentageALEA = (totalLossDueALEA || 1) / (currentReimbursementCalculation?.totalAdjustedLossPaid || 1)

    const totalExpenseDue = (expensePercentage || 1) * (currentReimbursementCalculation?.totalAdjustedPaidExpense || 1)
    const totalExpenseDueALEA = (expensePercentageALEA || 1) * (currentReimbursementCalculation?.totalAdjustedPaidExpense || 1)
    return (
        <>
            <Panel>
                <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Workers Compensation Reimbursement Calculation</span></PanelHeader>
                <PanelContent>
                    <ContentRow>
                        <ContentCell width="50%">
                            <CurrencyInput
                                id="totalAdjustedPaidIndemnity"
                                name="totalAdjustedPaidIndemnity"
                                label="Total Adjusted/Reconciled Paid Indemnity"
                                value={currentReimbursementCalculation?.totalAdjustedPaidIndemnity}
                                allowDecimal={true}
                                InputProps={{ readOnly: true }}
                            />
                        </ContentCell>
                        <ContentCell width="50%">
                            <CurrencyInput
                                id="totalOutstandingAdjustedLossReserves"
                                name="totalOutstandingAdjustedLossReserves"
                                label="Total Outstanding Adjusted/Reconciles Loss Reserves"
                                value={currentReimbursementCalculation?.totalOutstandingAdjustedLossReserves}
                                allowDecimal={true}
                                InputProps={{ readOnly: true }}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="50%">
                            <CurrencyInput
                                id="totalAdjustedMedical"
                                name="totalAdjustedMedical"
                                label="Total Adjusted/Reconciled Medical"
                                value={currentReimbursementCalculation?.totalAdjustedMedical}
                                allowDecimal={true}
                                InputProps={{ readOnly: true }}

                            />
                        </ContentCell>
                        <ContentCell width="50%">
                            <CurrencyInput
                                id="totalOutstandingAdjustedMedicalReserves"
                                name="totalOutstandingAdjustedMedicalReserves"
                                label="Total Outstanding Adjusted/Reconciled Medical Reserves"
                                value={currentReimbursementCalculation?.totalOutstandingAdjustedMedicalReserves}
                                allowDecimal={true}
                                InputProps={{ readOnly: true }}

                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="50%">
                            <CurrencyInput
                                id="totalAdjustedLossPaid"
                                name="totalAdjustedLossPaid"
                                label="Total Adjusted/Reconciled Loss Paid"
                                value={currentReimbursementCalculation?.totalAdjustedLossPaid}
                                allowDecimal={true}
                                InputProps={{ readOnly: true }}
                                //H33

                            />
                        </ContentCell>
                        <ContentCell width="50%">
                            <CurrencyInput
                                id="totalOutstandingReconciledLossReserves"
                                name="totalOutstandingReconciledLossReserves"
                                label="Total Outstanding Adjusted/Reconciled Loss Reserves"
                                value={currentReimbursementCalculation?.totalOutstandingReconciledLossReserves}
                                allowDecimal={true}
                                InputProps={{ readOnly: true }}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="50%">
                            <CurrencyInput
                                id="totalAdjustedPaidExpense"
                                name="totalAdjustedPaidExpense"
                                value={currentReimbursementCalculation?.totalAdjustedPaidExpense}
                                label="Total Adjusted/Reconciled Paid Expense"
                                allowDecimal={true}
                                InputProps={{ readOnly: true }}
                                //H34
                            />
                        </ContentCell>
                        <ContentCell width="50%">
                            <CurrencyInput
                                id="totalOutstandingExpenseReserves"
                                name="totalOutstandingExpenseReserves"
                                value={currentReimbursementCalculation?.totalOutstandingExpenseReserves}
                                label="Total Adjusted/Reconciled Outstanding Expense Reserves"
                                allowDecimal={true}
                                InputProps={{ readOnly: true }}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="50%">
                            <CurrencyInput
                                id="totalAdjustedPaidExpense"
                                name="totalAdjustedPaidExpense"
                                value={!currentReimbursementCalculation?.alaeTreatementID === 2 ? totalLossDue.toFixed(2) : totalExpenseDueALEA.toFixed(2)}
                                label="Total Loss Due"
                                allowDecimal={true}
                                InputProps={{ readOnly: true }}
                                allowNegative
                            />
                        </ContentCell>
                        <ContentCell width="50%">
                            <CurrencyInput
                                id="totalExpenseDue"
                                name="totalExpenseDue"
                                value={(!currentReimbursementCalculation?.alaeTreatementID === 2 ? totalExpenseDue.toFixed(2) : totalLossDueALEA.toFixed(2)) || null}
                                value={totalExpenseDue.toFixed(2)}
                                label="Total Expense Due"
                                allowDecimal={true}
                                InputProps={{ readOnly: true }}
                            />
                        </ContentCell>
                        <ContentCell width="50%">
                            <TextInput
                                id="expensePercentage"
                                name="expensePercentage"
                                value={(!currentReimbursementCalculation?.alaeTreatementID === 2 ? `0.${expensePercentage?.toFixed(4)}` : `0.${expensePercentageALEA.toFixed(4)}`) || null}
                                label="Expense Percentage (share or added to loss)"
                                InputProps={{ readOnly: true }}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="50%">
                            <CurrencyInput
                                id="totalAdjustedPaidExpense"
                                name="totalAdjustedPaidExpense"
                                value={currentReimbursementCalculation?.totalAdjustedPaidExpense}
                                allowDecimal={true}
                                label="Prior Loss Reimbursements"
                                InputProps={{ readOnly: true }}
                            />
                        </ContentCell>
                        <ContentCell width="50%">
                            <CurrencyInput
                                id="totalOutstandingExpenseReserves"
                                allowDecimal={true}
                                name="totalOutstandingExpenseReserves"
                                value={currentReimbursementCalculation?.totalOutstandingExpenseReserves}
                                label="Prior Expense Reimbursements"
                                InputProps={{ readOnly: true }}
                            />
                        </ContentCell>
                        <ContentCell width="50%">
                            <CurrencyInput
                                id="totalOutstandingExpenseReserves"
                                allowDecimal={true}
                                name="totalOutstandingExpenseReserves"
                                value={currentReimbursementCalculation?.totalOutstandingExpenseReserves}
                                label="Loss Balance Due"
                                InputProps={{ readOnly: true }}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="50%">
                            <CurrencyInput
                                id="totalAdjustedPaidExpense"
                                allowDecimal={true}
                                name="totalAdjustedPaidExpense"
                                value={currentReimbursementCalculation?.totalAdjustedPaidExpense}
                                label="Expense Balance Due"
                                InputProps={{ readOnly: true }}
                            />
                        </ContentCell>
                        <ContentCell width="50%">
                            <CurrencyInput
                                id="totalOutstandingExpenseReserves"
                                allowDecimal={true}
                                name="totalOutstandingExpenseReserves"
                                value={currentReimbursementCalculation?.totalOutstandingExpenseReserves}
                                label="Total Balance Due (Loss plus Expense)"
                                InputProps={{ readOnly: true }}
                            />
                        </ContentCell>
                    </ContentRow>
                </PanelContent>
                
            </Panel>
        </>
    )
}

