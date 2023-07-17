import { Button } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { APP_TYPES } from '../../../../../Core/Enumerations/app/app-types';
import { DatePicker, Panel, PanelHeader, ConfirmationDialog, CurrencyInput} from '../../../../../Core/Forms/Common';
import { userSelectors } from '../../../../../Core/State/slices/user';
import { findHelpTextByTag } from '../../../../Help/Queries';
import { ROLES } from '../../../../../Core/Enumerations/security/roles';

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

export const TPOCPaymentInfoSection = ({ request, dispatch, formValidator, onSave, helpTags}) => {
    const $auth = useSelector(userSelectors.selectAuthContext());
    const isViewer = $auth.isReadOnly(APP_TYPES.Claimant);
    const [showConfimationDialog, setShowConfimationDialog] = React.useState(false);
    const isClaimExaminer = $auth.isInRole(ROLES.Claims_Examiner);
    
    let currentTPOCPayment = request.currentPayment || {};
    const { register, formState: { errors }, setValue } = formValidator;
    setValue("amount", currentTPOCPayment.amount ? currentTPOCPayment.amount : null);
    setValue("payDate", currentTPOCPayment.payDate ? currentTPOCPayment.payDate : null);
    const onCurrencyChanged = (evt) => {
        if (evt.target.value > -1) {
            setValue(evt.target.name, evt.target.value);
        } else {
            setValue(evt.target.name, null);
        }
        request.currentPayment[evt.target.name] = evt.target.value;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
    };
    const convertFloatStringToFloat = (evt) => {
        let val = evt.target.value;
        val = val.replace("$", "");
        val = val.replaceAll(",", "");
        request.currentPayment[evt.target.name] = val;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
    };

    const onDateChanged = (evt) => {
        let newVal = new Date(evt.target.value).toISOString();
        request.currentPayment[evt.target.name] = newVal;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
    };
    const validateTPOC = async (triggerValidation) => {
        let isTPOCValid = true, result = true, isClaimantValid= true;

        result = await triggerValidation("amount");
        if (!result)
            isTPOCValid = result;

        result = await triggerValidation("payDate");
        if (!result)
            isClaimantValid = result;
        return isTPOCValid;
    }
    const onSavePaymentClick = async () => {
        let result = false;
        result = await validateTPOC(formValidator.trigger);
        if (result) {
            request.currentClaimant.medicare = request.currentClaimant.medicare || {};
            let payments = request.currentClaimant.medicare.payments || [];
            request.currentPayment.amount = parseFloat(request.currentPayment.amount);
            payments.push({ ...request.currentPayment });
            request.currentPayment = {};
            request.selectedPaymentIndex = -1;
            request.currentClaimant.medicare.payments = payments;
            dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
            onSave()
        } 
    };
    const onDeletePaymentClick = async () => {
        setShowConfimationDialog(true);
    }
    const onDialogCancel = () => {
        setShowConfimationDialog(false);
    };
    const onDialogOk = () => {
        setShowConfimationDialog(false);
        request.currentClaimant.medicare.payments[request.selectedPaymentIndex].isDeleted = true;
        request.currentPayment = {};
        request.selectedPaymentIndex = -1;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
        onSave()
    };

    return (
        <Panel style={{ border:'0px' }}>
            <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>TPOC Payment</span></PanelHeader>
            <ConfirmationDialog
                id="tpocPaymentConfirmation"
                keepMounted
                open={showConfimationDialog}
                onCancel={onDialogCancel}
                onOk={onDialogOk}
                title="Confirmation"
                description="Are you sure you want to delete TPOC payment?"
            />
            <ContentRow>
                <ContentCell width="33%">
                    <CurrencyInput
                        disabled={isViewer || currentTPOCPayment.tPOCPaymentID}
                        id="amount"
                        name="amount"
                        required
                        label="TPOC Payment Amount"
                        value={currentTPOCPayment.amount}
                        {...register("amount",
                            {
                                required: "This is required.",
                                onChange: onCurrencyChanged
                            }
                        )
                        }
                        error={errors.amount}
                        helperText={errors.amount ? errors.amount.message : ""}
                        inputProps={{ maxlength: 15 }}
                        allowDecimal={isClaimExaminer}
                        onBlur={convertFloatStringToFloat}
                    />
                </ContentCell>
                <ContentCell width="33%">
                    <DatePicker
                        disabled={isViewer || currentTPOCPayment.tPOCPaymentID}
                        id="payDate"
                        name="payDate"
                        label="TPOC Payment Date"
                        fullWidth={true}
                        variant="outlined"
                        value={currentTPOCPayment.payDate || null}
                        required
                        error={errors.payDate}
                        helperText={errors.payDate ? errors.payDate.message : ""}
                        {...register("payDate",
                            {
                                required: "This field is required.",
                                onChange: onDateChanged
                            }
                        )
                        }
                        tooltip={findHelpTextByTag("payDate", helpTags)}
                    />

                </ContentCell>
                <ContentCell width="34%">
                    <Button variant="contained" color="primary" onClick={onSavePaymentClick} style={{ margin: '10px' }} disabled={isViewer || currentTPOCPayment.tPOCPaymentID}>Add</Button>
                    <Button variant="contained" color="primary" onClick={onDeletePaymentClick} style={{ margin: '10px' }} disabled={isViewer || (request.selectedPaymentIndex<0)}>Delete</Button>
                </ContentCell>
            </ContentRow>
        </Panel>
    );
};
