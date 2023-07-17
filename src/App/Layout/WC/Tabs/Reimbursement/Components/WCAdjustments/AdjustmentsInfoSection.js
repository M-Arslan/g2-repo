import { MenuItem } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import { Panel, PanelContent, SelectList, TextInput, PanelHeader, DatePicker, CurrencyInput, Spinner } from '../../../../../../Core/Forms/Common';
import { useDispatch, useSelector } from 'react-redux';


import {
    ASYNC_STATES
} from '../../../../../../Core/Enumerations/redux/async-states';
import { useSnackbar } from 'notistack';

import { TotalAdjustmentsListSection } from './TotalAdjustmentsListSection';
import { CurrentAdjustmentListSection } from './CurrentAdjustmentListSection';
import { TotalPriorAdjustmentListSection } from './TotalPriorAdjustmentListSection';
import {
    WCReimbursementtAdjustmentsSelectors,
    WCReimbursementAdjustmentsActions,
    WCReimbursementAdjustmentsSaveSelectors,
    WCReimbursementAdjustmentsSaveActions,
} from '../../../../../../Core/State/slices/reimbursement-adjustments'
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
export const AdjustmentsInfoSection = ({ claim, request, dispatch }) => {
    const { enqueueSnackbar } = useSnackbar();

    let currentReimbursementAdjustment = request.currentReimbursementAdjustment;
    let $dispatch = useDispatch();
    const onValueChanged = (evt) => {
        request.currentReimbursementAdjustment[evt.target.name] = evt.target.value;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
    };
    const onDropDownChanged = (evt) => {
        request.currentReimbursementAdjustment[evt.target.name] = evt.target.value;

        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
    };
    const onDateChanged = (evt) => {
        request.currentReimbursementAdjustment[evt.target.name] = evt.target.value;
        request.currentReimbursementAdjustment[evt.target.name] = request.currentReimbursementAdjustment[evt.target.name] ? new Date(request.currentReimbursementAdjustment[evt.target.name]).toISOString() : null;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
        //onSave();
    };
    const reimbursementAdjustmentState = useSelector(WCReimbursementtAdjustmentsSelectors.selectLoading());
    const reimbursementAdjustment = useSelector(WCReimbursementtAdjustmentsSelectors.selectData());

    const reimbursementAdjustmentSaveState = useSelector(WCReimbursementAdjustmentsSaveSelectors.selectLoading());
    const reimbursementAdjustmentSave = useSelector(WCReimbursementAdjustmentsSaveSelectors.selectData());

        const convertFloatStringToFloat = (evt) => {
        let val = evt.target.value;
        val = val.replace("$", "");
        val = val.replaceAll(",", "");
        currentReimbursementAdjustment[evt.target.name] = !isNaN(parseFloat(val)) ? parseFloat(val) : val;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
    };
    React.useEffect(() => {
        if (reimbursementAdjustmentState === ASYNC_STATES.SUCCESS) {
            $dispatch(WCReimbursementAdjustmentsActions.clearStatus());
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, originalReimbursementAdjustment: JSON.parse(JSON.stringify(reimbursementAdjustment)), currentReimbursementAdjustment: JSON.parse(JSON.stringify(reimbursementAdjustment)), editModeAdjustments: true, isProcessing: false, isSaving: false } });
        } else if (reimbursementAdjustmentState === ASYNC_STATES.ERROR) {
            $dispatch(WCReimbursementAdjustmentsActions.clearStatus());
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });
        }

    }, [reimbursementAdjustmentState]);
    React.useEffect(() => {
        if (reimbursementAdjustmentSaveState === ASYNC_STATES.SUCCESS) {
            if (request.isProcessing) {
                enqueueSnackbar("Adjustment information has been saved successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                $dispatch(WCReimbursementAdjustmentsActions.get({ reimbursementAdjustmentID: reimbursementAdjustmentSave.reimbursementAdjustmentID }));
            } else {
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, originalReimbursementAdjustment: JSON.parse(JSON.stringify(request.currentReimbursementAdjustment)), isSaving: false, isProcessing: false } });
            }
        } else if (reimbursementAdjustmentSaveState === ASYNC_STATES.ERROR) {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
            enqueueSnackbar("Unable to save Adjustment information.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }, [reimbursementAdjustmentSaveState]);
    return (
        <>
            <Panel>
                <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Workers Compensation Reimbursement Adjustments</span></PanelHeader>

                    {   reimbursementAdjustmentSaveState === ASYNC_STATES.WORKING ?
                        <Spinner />
                        :   request?.currentReimbursement?.claimStatusTypeID == 33 ?
                            <>

                                <PanelContent>
                            <ContentRow>
                                <ContentCell width="50%">
                                    <SelectList
                                        id="adjustmentTypeID"
                                        name="adjustmentTypeID"
                                        label="Adjustment Type"
                                        fullWidth={true}
                                        required
                                        defaultValue
                                        variant="outlined"
                                        value={currentReimbursementAdjustment?.adjustmentTypeID ? currentReimbursementAdjustment?.adjustmentTypeID : null}
                                        onChange={onDropDownChanged}
                                    >
                                        <MenuItem value="1" >Adjusted from Medical Loss to Expense</MenuItem>
                                        <MenuItem value="2" >Adjusted from Indemnity Loss</MenuItem>
                                        <MenuItem value="3" >Adjusted from Medical Loss</MenuItem>
                                        <MenuItem value="4" >Adjusted from Expense</MenuItem>
                                    </SelectList>
                                </ContentCell>
                                <ContentCell width="50%">
                                    <CurrencyInput
                                        id="amountAdjusted"
                                        name="amountAdjusted"
                                        label="Amount Adjusted"
                                        onChange={onValueChanged}
                                    allowDecimal={true}
                                        value={currentReimbursementAdjustment?.amountAdjusted}
                                    onBlur={convertFloatStringToFloat}

                                    />
                                </ContentCell>
                            </ContentRow>
                            <ContentRow>
                                {/*<ContentCell width="50%">*/}
                                {/*    <SelectList*/}
                                {/*        id="claimStatusTypeID"*/}
                                {/*        name="claimStatusTypeID"*/}
                                {/*        label="Status Type"*/}
                                {/*        fullWidth={true}*/}
                                {/*        required*/}
                                {/*        defaultValue*/}
                                {/*        variant="outlined"*/}
                                {/*        value={currentReimbursementAdjustment?.claimStatusTypeID ? currentReimbursementAdjustment?.claimStatusTypeID : null}*/}
                                {/*        onChange={onDropDownChanged}*/}
                                {/*    >*/}
                                {/*        <MenuItem value="33" >Adjusted from Medical Loss to Expense</MenuItem>*/}
                                {/*    </SelectList>*/}
                                {/*</ContentCell>*/}
                                <ContentCell width="50%">
                                    <DatePicker
                                        id="billingDate"
                                        name="billingDate"
                                        label="Billing Date"
                                        format="MM/dd/yyyy"
                                        fullWidth={true}
                                        onChange={onDateChanged}
                                        variant="outlined"
                                        required
                                        disableFuture={true}
                                        value={currentReimbursementAdjustment?.billingDate}
                                    />
                                </ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell width="50%">
                                    <TextInput
                                        id="adjustmentExplanation"
                                        name="adjustmentExplanation"
                                        label="Adjustment Explanation"
                                        variant="outlined"
                                        onChange={onValueChanged}
                                        value={currentReimbursementAdjustment?.adjustmentExplanation ? currentReimbursementAdjustment?.adjustmentExplanation : ""}

                                    />
                                </ContentCell>
                            </ContentRow>
                        </PanelContent>

                                <TotalPriorAdjustmentListSection claim={claim} request={request} dispatch={dispatch} />
                                <CurrentAdjustmentListSection claim={claim} request={request} dispatch={dispatch} />
                                <TotalAdjustmentsListSection claim={claim} request={request} dispatch={dispatch} />
                            </> 
                             :   <TotalAdjustmentsListSection claim={claim} request={request} dispatch={dispatch} />
                        }
            </Panel>
        </>
    )
}

