import { MenuItem } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';


import {
    ASYNC_STATES
} from '../../../../../../../Core/Enumerations/redux/async-states';
import { useSnackbar } from 'notistack';

import {
    GetCalculationetail
} from '../../../../../../../Core/State/slices/reimbursement-calculation/queries/GetCalculationDetail'


import { useEffect } from 'react';
import { useState } from 'react';
import { getRiskStates } from '../../../../../../../Core/Services/EntityGateway';
import { CurrencyInput, DatePicker, formatDate, Panel, PanelContent, PanelHeader, SelectList, SwitchInput, TextInput } from '../../../../../../../Core/Forms/Common';
import {
    WCReimbursementtCalculationSelectors,
    WCReimbursementCalculationActions,
    WCReimbursementCalculationSaveSelectors,
    WCReimbursementCalculationSaveActions
} from '../../../../../../../Core/State/slices/reimbursement-calculation'
import { ClaimActivityStatusInfoSection } from '../../../../../../Claim/Tabs/Accounting/ClaimActivityStatusInfoSection';
import { Divider } from '@mui/material';

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
export const ReimbursementPaymentInfoSection = ({ claim, request, dispatch, onSave, formValidator }) => {
    const { enqueueSnackbar } = useSnackbar();

    let $dispatch = useDispatch();
    let currentReimbursement = request.currentReimbursement || {};
    const reimbursementCalculationState = useSelector(WCReimbursementtCalculationSelectors.selectLoading());
    const reimbursementCalculation = useSelector(WCReimbursementtCalculationSelectors.selectData());

    const currentReimbursementCalculation = reimbursementCalculation ? reimbursementCalculation[0] : null;
    const [riskStatesList, setRiskList] = useState(null);
    const onValueChanged = (evt) => {
        const { name, value } = evt.target;
        request.currentReimbursement[evt.target.name] = evt.target.value.trimStart();
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });

    };
    const onDateChanged = (evt) => {
        request.currentReimbursement[evt.target.name] = evt.target.value;
        request.currentReimbursement[evt.target.name] = request.currentReimbursement[evt.target.name] ? new Date(request.currentReimbursement[evt.target.name]).toISOString() : null;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
        //onSave();
    };
    const onDropDownChanged = (evt) => {
        request.currentReimbursement[evt.target.name] = evt.target.value;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
        //onSave();
    };
    React.useEffect(() => {
        $dispatch(WCReimbursementCalculationActions.list({ wCReimbursementID: request.currentReimbursement.wCReimbursementID }));        
    }, []);
    useEffect(() => {
        async function fetchRisksData() {
            const riskStates = await getRiskStates()
            setRiskList(riskStates);
        }
        fetchRisksData();
    }, [])
    return (
        <>
            <Panel>
                <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Workers Compensation Reimbursement Payment Request</span></PanelHeader>
                <PanelContent>
                    <ClaimActivityStatusInfoSection claim={claim} request={request} dispatch={dispatch} />
                    <Divider />


                    <ContentRow>
                        <ContentCell width="33%">
                            <TextInput
                                id="payeeName"
                                name="payeeName"
                                label="Payee Name"
                                required
                                fullWidth={true}
                                variant="outlined"
                                value={currentReimbursement.payeeName}
                                InputProps={{ readOnly: true }}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <TextInput
                                id="vendorNumber"
                                name="vendorNumber"
                                label="Vendor Number"
                                required
                                fullWidth={true}
                                variant="outlined"
                                InputProps={{ readOnly: true }}
                                value={currentReimbursement.vendorNumber}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <TextInput
                                id="mailingStreetAddress"
                                name="mailingStreetAddress"
                                label="Mailing Street Address"
                                required
                                fullWidth={true}
                                variant="outlined"
                                value={currentReimbursement.mailingStreetAddress}
                                InputProps={{ readOnly: true }}

                            />
                        </ContentCell>
                    </ContentRow>

                    <ContentRow>
                        <ContentCell width="33%">
                            <TextInput
                                id="mailingStreetCity"
                                name="mailingStreetCity"
                                label="Mailing Street City"
                                required
                                fullWidth={true}
                                variant="outlined"
                                value={currentReimbursement.mailingStreetCity}
                                InputProps={{ readOnly: true }}

                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <SelectList
                                id="mailingStreetState"
                                name="mailingStreetState"
                                label="Mailing Street State"
                                fullWidth={true}
                                value={currentReimbursement?.mailingStreetState}
                                variant="outlined"
                                InputProps={{ readOnly: true }}

                            >
                                {
                                    riskStatesList?.map((rs, idx) => <MenuItem value={`${rs.stateCode}`} key={`state-option-${idx}`}>{rs.stateName}</MenuItem>)
                                }
                            </SelectList>
                        </ContentCell>

                        <ContentCell width="33%">
                            <TextInput
                                id="mailingStreetZip"
                                name="mailingStreetZip"
                                label="Mailing Zip"
                                required
                                fullWidth={true}
                                variant="outlined"
                                inputProps={{ maxlength: 5 }}
                                value={currentReimbursement.mailingStreetZip}
                                InputProps={{ readOnly: true }}

                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="25%">
                            <TextInput
                                id="email"
                                name="email"
                                label="Email"
                                fullWidth={true}
                                variant="outlined"
                                value={currentReimbursement.email}
                                onChange={onValueChanged}
                                InputProps={{ readOnly: true }}

                            />
                        </ContentCell>
                        <ContentCell width="25%">
                            <TextInput
                                id="paymentThrough"
                                name="paymentThrough"
                                label="Payment Through"
                                fullWidth={true}
                                variant="outlined"
                                value={formatDate(currentReimbursement.paymentThrough) || null}
                                InputProps={{ readOnly: true }}

                            />
                        </ContentCell>
                        <ContentCell width="25%">
                            <TextInput
                                id="createdBy"
                                name="createdBy"
                                label="Submitted By"
                                fullWidth={true}
                                variant="outlined"
                                value={currentReimbursement.createdBy}
                                InputProps={{ readOnly: true }}
                            />
                        </ContentCell>
                        <ContentCell width="25%">
                            <TextInput
                                id="createdDate"
                                name="createdDate"
                                label="Submitted Date"
                                fullWidth={true}
                                onChange={onDateChanged}
                                variant="outlined"
                                value={formatDate(currentReimbursement.createdDate) || null}
                                InputProps={{ readOnly: true }}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="100%">
                            <TextInput
                                id="comments"
                                name="comments"
                                label="Comments"
                                fullWidth={true}
                                maxLength="250"
                                variant="outlined"
                                value={currentReimbursement.comments}
                                defaultValue={currentReimbursement.comments}
                                onChange={onValueChanged}
                                multiline
                                rows={3}
                                InputProps={{ readOnly: true }}

                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
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
                    </ContentRow>
                </PanelContent>

            </Panel>
        </>
    )
}

