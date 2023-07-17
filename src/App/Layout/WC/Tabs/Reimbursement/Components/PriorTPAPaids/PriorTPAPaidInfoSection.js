


import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { ASYNC_STATES } from '../../../../../../Core/Enumerations/redux/async-states';
import { CurrencyInput, Panel, PanelContent, PanelHeader } from '../../../../../../Core/Forms/Common';
import {
    WCReimbursementPriorTPAPaidSingleSelectors
} from '../../../../../../Core/State/slices/prior-tpa-paids';
import { isObjEmpty } from '../../../../../../Core/Utility/common';


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
export const PriorTPAPaidsInfoSection = ({ claim, request, dispatch, onSave }) => {

    const priorTPAPaidSingleState = useSelector(WCReimbursementPriorTPAPaidSingleSelectors.selectLoading());
    const priorTPAPaidSingle = useSelector(WCReimbursementPriorTPAPaidSingleSelectors.selectData()) || {};

    useEffect(() => {
        if (priorTPAPaidSingleState === ASYNC_STATES.SUCCESS) {
            let singlePriorTPA = JSON.parse(JSON.stringify(priorTPAPaidSingle));
            let priorTPAPaidData = !isObjEmpty(request.currentPriorTPAPaid) ? request.currentPriorTPAPaid : singlePriorTPA[singlePriorTPA.length - 1] || {}
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentPriorTPAPaid: priorTPAPaidData } });
        }

    }, [priorTPAPaidSingleState])
    let currentTPAPaid = request.currentPriorTPAPaid;
    const onValueChanged = (evt) => {
        request.currentPriorTPAPaid[evt.target.name] = evt.target.value;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
    };
    const convertFloatStringToFloat = (evt) => {
        let val = evt.target.value;
        if(val !== ""){
        val = val.replace("$", "");
        val = val.replaceAll(",", "");
        currentTPAPaid[evt.target.name] = !isNaN(parseFloat(val)) ? parseFloat(val) : val;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
        onSave();
        }
    };
    return (
        <>
            <Panel>
                <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Workers Compensation Reimbursement Prior TPA/ Reconciled paids</span></PanelHeader>
                <PanelContent>
                    <ContentRow>
                        <ContentCell width="50%">
                            <CurrencyInput
                                id="paidToDateIndemnity"
                                name="paidToDateIndemnity"
                                label="TPA Paid To Date Indemnity"
                                onChange={onValueChanged}
                                onBlur={convertFloatStringToFloat}
                                allowDecimal={true}
                                value={currentTPAPaid?.paidToDateIndemnity}
                            />
                        </ContentCell>
                        <ContentCell width="50%">
                            <CurrencyInput
                                id="outstandingLossReserves"
                                name="outstandingLossReserves"
                                onBlur={convertFloatStringToFloat}
                                onChange={onValueChanged}
                                label="TPA Outstanding Loss Reserves"
                                allowDecimal={true}
                                value={currentTPAPaid?.outstandingLossReserves}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="50%">
                            <CurrencyInput
                                id="paidToDateMedical"
                                name="paidToDateMedical"
                                onBlur={convertFloatStringToFloat}
                                onChange={onValueChanged}
                                label="TPA Paid To Date Medical"
                                allowDecimal={true}
                                value={currentTPAPaid?.paidToDateMedical}

                            />
                        </ContentCell>
                        <ContentCell width="50%">
                            <CurrencyInput
                                id="outstandingMedicalReserves"
                                name="outstandingMedicalReserves"
                                onBlur={convertFloatStringToFloat}
                                onChange={onValueChanged}
                                label="Outstanding Medical Reserves"
                                allowDecimal={true}
                                value={currentTPAPaid?.outstandingMedicalReserves}

                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="50%">
                            <CurrencyInput
                                id="totalLossPaid"
                                name="totalLossPaid"
                                onBlur={convertFloatStringToFloat}
                                onChange={onValueChanged}
                                allowDecimal={true}
                                label="Total Loss Paid"
                                value={(Number(currentTPAPaid?.paidToDateMedical ? currentTPAPaid?.paidToDateMedical : 0) + Number(currentTPAPaid?.paidToDateIndemnity ? currentTPAPaid?.paidToDateIndemnity : 0)).toFixed(2)}
                                InputProps={{ readOnly: true }}
                            />
                        </ContentCell>
                        <ContentCell width="50%">
                            <CurrencyInput
                                id="totalOutstandingLossReserves"
                                onBlur={convertFloatStringToFloat}
                                onChange={onValueChanged}
                                allowDecimal={true}
                                name="totalOutstandingLossReserves"
                                label="Total Outstanding Loss Reserves"
                                value={(Number(currentTPAPaid?.outstandingLossReserves ? currentTPAPaid?.outstandingLossReserves : 0) + Number(currentTPAPaid?.outstandingMedicalReserves ? currentTPAPaid?.outstandingMedicalReserves : 0)).toFixed(2)}
                                InputProps={{ readOnly: true }}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="50%">
                            <CurrencyInput
                                id="paidToDateExpense"
                                onBlur={convertFloatStringToFloat}
                                onChange={onValueChanged}
                                allowDecimal={true}
                                name="paidToDateExpense"
                                value={currentTPAPaid?.paidToDateExpense}
                                label="TPA Paid To Date Expense"
                            />
                        </ContentCell>
                        <ContentCell width="50%">
                            <CurrencyInput
                                id="outstandingExpenseReserves"
                                onBlur={convertFloatStringToFloat}
                                onChange={onValueChanged}
                                allowDecimal={true}
                                name="outstandingExpenseReserves"
                                value={currentTPAPaid?.outstandingExpenseReserves}
                                label="Outstanding Expense Reserves"
                            />
                        </ContentCell>
                    </ContentRow>
                </PanelContent>  
                {/*<PriorTPAPaidListSection/>*/}
            </Panel>
        </>
    )
}

