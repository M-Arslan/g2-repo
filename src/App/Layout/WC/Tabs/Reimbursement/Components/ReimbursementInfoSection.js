import { MenuItem } from '@mui/material';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { DatePicker, formatDate, Panel, PanelContent, PanelHeader, SelectList, TextInput } from '../../../../../Core/Forms/Common';
import { getRiskStates } from '../../../../../Core/Services/EntityGateway';
import { USZip } from '../../../../../Core/Providers/FormProvider';
import { zipFormat } from '../../../../../Core/Utility/common';
import { ReimbursementCompanyDollarListSelectors } from '../../../../../Core/State/slices/reimbursement';
import { WCReimbursementPriorTPAPaidSingleSelectors } from '../../../../../Core/State/slices/prior-tpa-paids';
import { WCReimbursementAdjustmentsListSelectors } from '../../../../../Core/State/slices/reimbursement-adjustments';
import { useSelector } from 'react-redux';

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
export const ReimbursementInfoSection = ({ claim, request, dispatch, formValidator, onSave }) => {
    let currentReimbursement = request.currentReimbursement;
/*    const riskStates = useSelector(riskStatesSelectors.selectData());
*/   const reimbursementCompanyDollarList = useSelector(ReimbursementCompanyDollarListSelectors.selectData());
    const priorTPAPaidSingle = useSelector(WCReimbursementPriorTPAPaidSingleSelectors.selectData()) || {};
    const reimbursementAdjustmentList = useSelector(WCReimbursementAdjustmentsListSelectors.selectData());
    const [riskStatesList, setRiskList] = useState(null);
    const { register, formState: { errors }, setValue, unregister, clearErrors } = formValidator;
    setValue("payeeName", currentReimbursement.payeeName ? currentReimbursement.payeeName : null);
    setValue("vendorNumber", currentReimbursement.vendorNumber ? currentReimbursement.vendorNumber : null);
    setValue("mailingStreetAddress", currentReimbursement.mailingStreetAddress ? currentReimbursement.mailingStreetAddress : null);
    setValue("mailingStreetCity", currentReimbursement.mailingStreetCity ? currentReimbursement.mailingStreetCity : null);
    setValue("mailingStreetState", currentReimbursement.mailingStreetState ? currentReimbursement.mailingStreetState : null);
    setValue("mailingStreetZip", currentReimbursement.mailingStreetZip ? currentReimbursement.mailingStreetZip : null);
    setValue("email", currentReimbursement.email ? currentReimbursement.email : null);
    const onValueChanged = (evt) => {
        const { name, value } = evt.target;
        setValue(name, value ? value : null)
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
    useEffect(() => {
        async function fetchRisksData() {
            const riskStates = await getRiskStates()
            setRiskList(riskStates);
            const priorTPAPaidData = priorTPAPaidSingle && priorTPAPaidSingle.length > 0 ? priorTPAPaidSingle[priorTPAPaidSingle.length-1] : {};
        const companyDollarsList = reimbursementCompanyDollarList ? reimbursementCompanyDollarList : []
        const adjustmentList = reimbursementAdjustmentList ? reimbursementAdjustmentList : []
        await dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request,  currentPriorTPAPaid: JSON.parse(JSON.stringify(priorTPAPaidData)), CompanyDollarsList:JSON.parse(JSON.stringify(companyDollarsList)) , Adjustments:JSON.parse(JSON.stringify(adjustmentList)), isProcessing: false, isSaving: false } });

        }
        fetchRisksData();

    },[])
    return (
        <>
            <Panel>
                <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Reimbursement Detail</span></PanelHeader>
                <PanelContent>
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
                                inputProps={{ maxlength: 50 }}
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
                        </ContentCell>
                        <ContentCell width="33%">
                            <TextInput
                                id="vendorNumber"
                                name="vendorNumber"
                                label="Vendor Number"
                                required
                                fullWidth={true}
                                variant="outlined"
                                inputProps={{ maxlength: 15 }}
                                value={currentReimbursement.vendorNumber}
                                {...register("vendorNumber",
                                    {
                                        required: "This is required.",
                                        pattern: {
                                            value: /^[a-z0-9]+$/i,
                                            message: "This field is invalid"
                                        },
                                        onChange: onValueChanged
                                    }
                                )
                                }
                                error={errors.vendorNumber}
                                helperText={errors.vendorNumber ? errors.vendorNumber.message : ""}
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
                                {...register("mailingStreetAddress",
                                    {
                                        required: "This is required.",
                                        onChange: onValueChanged
                                    }
                                )
                                }
                                error={errors.mailingStreetAddress}
                                helperText={errors.mailingStreetAddress ? errors.mailingStreetAddress.message : ""}

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
                                {...register("mailingStreetCity",
                                    {
                                        required: "This is required.",
                                        onChange: onValueChanged
                                    }
                                )
                                }
                                error={errors.mailingStreetCity}
                                helperText={errors.mailingStreetCity ? errors.mailingStreetCity.message : ""}

                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <SelectList
                                id="mailingStreetState"
                                name="mailingStreetState"
                                label="Mailing Street State"
                                fullWidth={true}
                                value={currentReimbursement?.mailingStreetState}
                                {...register("mailingStreetState",
                                    {
                                        required: "This is required.",
                                        onChange: onDropDownChanged
                                    }
                                )
                                }
                                variant="outlined"
                                error={errors.mailingStreetState}
                                helperText={errors.mailingStreetState ? errors.mailingStreetState.message : ""}

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
                                inputProps={{ maxlength: 10 }}
                                value={currentReimbursement.mailingStreetZip}
                                {...register("mailingStreetZip",
                                    {
                                        required: "This is required.",
                                        pattern: {
                                            value:USZip,
                                            message: "This field is invalid."
                                        },
                                        onChange: (e) => zipFormat(onValueChanged,e)
                                    }
                                )
                                }
                                error={errors.mailingStreetZip}
                                helperText={errors.mailingStreetZip ? errors.mailingStreetZip.message : ""}
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
                                {...register("email",
                                    {
                                        pattern: {
                                            value: /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/gm,
                                            message: "This field is invalid."
                                        },
                                        onChange: onValueChanged
                                    }
                                )
                                }
                                error={errors.email}
                                helperText={errors.email ? errors.email.message : ""}
                                onChange={onValueChanged}
                            />
                        </ContentCell>
                        <ContentCell width="25%">
                            <DatePicker
                                id="paymentThrough"
                                name="paymentThrough"
                                label="Payment Through"
                                fullWidth={true}
                                onChange={onDateChanged}
                                variant="outlined"
                                value={currentReimbursement.paymentThrough || null}
                                disableFuture={true}
                                error={errors?.paymentThrough}
                                helperText={errors?.paymentThrough ? errors?.paymentThrough.message : ""}
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
                                inputProps={{ maxlength: 1024 }}
                            />
                        </ContentCell>
                    </ContentRow>
                </PanelContent>
            </Panel>
        </>
    );
}