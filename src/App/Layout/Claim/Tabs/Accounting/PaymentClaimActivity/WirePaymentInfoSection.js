import { Divider, MenuItem } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { APP_TYPES } from '../../../../../Core/Enumerations/app/app-types';
import { CurrencyInput, Panel, PanelContent, PanelHeader, SelectList, TextInput } from '../../../../../Core/Forms/Common';
import { riskStatesSelectors } from '../../../../../Core/State/slices/metadata/risk-states';
import { userSelectors } from '../../../../../Core/State/slices/user';
import { currencySelectors } from '../../../../../Core/State/slices/metadata/currency';
import { findHelpTextByTag, loadHelpTags } from '../../../../Help/Queries';
import { ClaimActivityStatusInfoSection } from '../ClaimActivityStatusInfoSection';
import { ACCOUNTING_TRANS_TYPES } from '../../../../../Core/Enumerations/app/accounting-trans-type';
import { CLAIM_STATUS_TYPE } from '../../../../../Core/Enumerations/app/claim-status-type';
import { CLAIM_TYPES } from '../../../../../Core/Enumerations/app/claim-type';


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

export const WirePaymentInfoSection = ({ claim, request, dispatch, formValidator, onSave }) => {
    const $auth = useSelector(userSelectors.selectAuthContext());
    const riskStates = useSelector(riskStatesSelectors.selectData());
    const currencies = useSelector(currencySelectors.selectData());

    let isViewer = $auth.isReadOnly(APP_TYPES.Financials);
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
        else if (request.currentClaimActivity.activityID) {
            isViewer = true;
        }
    }


    const currentClaimActivity = request.currentClaimActivity || {};
   
    const currentPayment = currentClaimActivity.payments || {};
    currentPayment.paymentWires = currentPayment.paymentWires || [{}];
    let currentWirePayment = (currentPayment.paymentWires || [{}])[0];
    currentWirePayment = !currentWirePayment ? {} : currentWirePayment;
    const paymentVendors = currentPayment.paymentVendors || [];
    if (paymentVendors.length > 0) {
        if (!currentWirePayment.paymentVendorID) {
            currentWirePayment.paymentVendorID = paymentVendors[0].paymentVendorID;
            currentWirePayment.wireAmount = paymentVendors[0].paymentAmount;
        } else {

            currentWirePayment.wireAmount = paymentVendors.filter(X => X.paymentVendorID === currentWirePayment.paymentVendorID)[0].paymentAmount;
        }
    }
    const { register, formState: { errors }, setValue } = formValidator;

    setValue("paymentVendorID", currentWirePayment.paymentVendorID ? currentWirePayment.paymentVendorID : null);
    setValue("wireCurrencyISO", currentWirePayment.wireCurrencyISO ? currentWirePayment.wireCurrencyISO : null);
    setValue("wireAmount", currentWirePayment.wireAmount ? currentWirePayment.wireAmount : null);
    setValue("bankName", currentWirePayment.bankName ? currentWirePayment.bankName : null);
    setValue("bankAddressZIP", currentWirePayment.bankAddressZIP ? currentWirePayment.bankAddressZIP : null);

    const [metadata, setMetadata] = React.useState({
        loading: true,
        helpTags: [],
    });

    const onValueChanged = (evt) => {
        currentWirePayment[evt.target.name] = evt.target.value.trimStart();
        currentPayment.paymentWires[0] = currentWirePayment;
        currentClaimActivity.payments = currentPayment;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentClaimActivity: currentClaimActivity } });
    };
    const onDropDownChanged = (evt) => {
        setValue(evt.target.name, evt.target.value ? evt.target.value : null);

        currentWirePayment[evt.target.name] = evt.target.value;
        currentPayment.paymentWires[0] = currentWirePayment;
        currentClaimActivity.payments = currentPayment;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentClaimActivity: currentClaimActivity } });
    };
    const onCurrencyChanged = (evt) => {
        currentWirePayment[evt.target.name] = evt.target.value;
        currentPayment.paymentWires[0] = currentWirePayment;
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
        currentWirePayment.wireCurrencyISO = !currentWirePayment.wireCurrencyISO ? "USD" : currentWirePayment.wireCurrencyISO;
        currentPayment.paymentWires[0] = currentWirePayment;
        currentClaimActivity.payments = currentPayment;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentClaimActivity: currentClaimActivity } });
    }

    return (
        <Panel>
            <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Wire Payment Details</span></PanelHeader>
            <PanelContent>
                <ClaimActivityStatusInfoSection claim={claim} request={request} dispatch={dispatch} />
                <Divider />
                {request.currentClaimActivity.accountingTransTypeID !== ACCOUNTING_TRANS_TYPES.GENESIS_PAYMENT && <>
                    {request.currentClaimActivity.accountingTransTypeID !== ACCOUNTING_TRANS_TYPES.WC_PAYMENT_RESERVE && request.currentClaimActivity.accountingTransTypeID !== ACCOUNTING_TRANS_TYPES.WC_EXPENSE_PAYMENT &&
                        <ContentRow>
                            <ContentCell width="66%">
                                <SelectList
                                    disabled={isViewer}
                                    id="paymentVendorID"
                                    name="paymentVendorID"
                                    required
                                    label={currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT ? "Vendor" : "Payee"}
                                    fullWidth={true}
                                    variant="outlined"
                                    {...register("paymentVendorID",
                                        {
                                            required: "This is required.",
                                            onChange: onDropDownChanged
                                        }
                                    )
                                    }
                                    value={currentWirePayment.paymentVendorID}
                                    tooltip={findHelpTextByTag("paymentVendorID", metadata.helpTags)}
                                    error={errors.paymentVendorID}
                                    helperText={errors.paymentVendorID ? errors.paymentVendorID.message : ""}
                                >
                                    {
                                        paymentVendors.map(X => <MenuItem value={X.paymentVendorID}>{X.payeeName}</MenuItem>)
                                    }
                                </SelectList>
                            </ContentCell>
                        </ContentRow>
                    }
                <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Wire Details</span></PanelHeader>
                <ContentRow>
                    <ContentCell width="33%">
                        <CurrencyInput
                            label="Wire Amount"
                            disabled={isViewer}
                            id="wireAmount"
                            name="wireAmount"
                            fullWidth={true}
                            inputProps={{ maxlength: 15 }}
                            variant="outlined"
                            required
                            value={request.claim.claimType !== CLAIM_TYPES.WORKERS_COMP ? currentWirePayment.wireAmount : currentWirePayment.wireAmount || (currentPayment?.reserveAuthorityCheckAmount || null)}
                            tooltip={findHelpTextByTag("wireAmount", metadata.helpTags)}
                            InputProps={{ readOnly: true }}
                            {...register("wireAmount",
                                {
                                    required: "This is required.",
                                    onChange: onCurrencyChanged
                                }
                            )
                            }
                            error={errors.wireAmount}
                            helperText={errors.wireAmount ? errors.wireAmount.message : ""}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <SelectList
                            disabled={isViewer}
                            id="wireCurrencyISO"
                            name="wireCurrencyISO"
                            label="Currency (if not USD)"
                            required
                            fullWidth={true}
                            variant="outlined"
                            value={currentWirePayment.wireCurrencyISO}
                            key={currentWirePayment.wireCurrencyISO}
                            tooltip={findHelpTextByTag("wireCurrencyISO", metadata.helpTags)}
                            {...register("wireCurrencyISO",
                                {
                                    required: "This is required.",
                                    onChange: onDropDownChanged
                                }
                            )
                            }

                            error={errors.wireCurrencyISO}
                            helperText={errors.wireCurrencyISO ? errors.wireCurrencyISO.message : ""}
                        >
                            {
                                currencies.map(X => <MenuItem value={X.iSO}>{X.name}</MenuItem>)
                            }
                        </SelectList>
                    </ContentCell>
                    </ContentRow>
                    </>
                }
                <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Bank Details</span></PanelHeader>
                <ContentRow>
                    <ContentCell width="33%">
                        <TextInput
                            label="Bank Name"
                            disabled={isViewer}
                            id="bankName"
                            name="bankName"
                            required
                            fullWidth={true}
                            variant="outlined"
                            value={currentWirePayment.bankName}
                            tooltip={findHelpTextByTag("bankName", metadata.helpTags)}
                            {...register("bankName",
                                {
                                    required: "This is required.",
                                    onChange: onValueChanged
                                }
                            )
                            }
                            error={errors.bankName}
                            helperText={errors.bankName ? errors.bankName.message : ""}
                            inputProps={{ maxlength: 100 }}
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="66%">
                        <TextInput
                            label="Bank Address Street 1"
                            disabled={isViewer}
                            id="bankAddressStreet1"
                            name="bankAddressStreet1"
                            fullWidth={true}
                            variant="outlined"
                            onChange={onValueChanged}
                            value={currentWirePayment.bankAddressStreet1}
                            tooltip={findHelpTextByTag("bankAddressStreet1", metadata.helpTags)}
                            inputProps={{ maxlength: 250 }}
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="66%">
                        <TextInput
                            label="Bank Address Street 2"
                            disabled={isViewer}
                            id="bankAddressStreet2"
                            name="bankAddressStreet2"
                            fullWidth={true}
                            variant="outlined"
                            onChange={onValueChanged}
                            value={currentWirePayment.bankAddressStreet2}
                            tooltip={findHelpTextByTag("bankAddressStreet2", metadata.helpTags)}
                            inputProps={{ maxlength: 250 }}
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        <TextInput
                            label="Bank Address City"
                            disabled={isViewer}
                            id="bankAddressCity"
                            name="bankAddressCity"
                            fullWidth={true}
                            variant="outlined"
                            onChange={onValueChanged}
                            value={currentWirePayment.bankAddressCity}
                            tooltip={findHelpTextByTag("bankAddressCity", metadata.helpTags)}
                            inputProps={{ maxlength: 50 }}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <SelectList
                            disabled={isViewer}
                            id="bankAddressState"
                            name="bankAddressState"
                            label="State"
                            fullWidth={true}
                            onChange={onDropDownChanged}
                            variant="outlined"
                            value={currentWirePayment.bankAddressState}
                            tooltip={findHelpTextByTag("bankAddressState", metadata.helpTags)}
                        >
                            {
                                riskStates.map(rs => <MenuItem value={rs.stateCode}>{rs.stateName}</MenuItem>)
                            }
                        </SelectList>

                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            label="Bank Address Zip"
                            disabled={isViewer}
                            id="bankAddressZIP"
                            name="bankAddressZIP"
                            fullWidth={true}
                            variant="outlined"
                            value={currentWirePayment.bankAddressZIP}
                            tooltip={findHelpTextByTag("bankAddressZIP", metadata.helpTags)}
                            inputProps={{ maxlength: 15 }}
                            {...register("bankAddressZIP",
                                {
                                    pattern: {
                                        value: /(\d{5}([\-]\d{4})?)/i,
                                        message: "Zip Code must be numeric"
                                    },
                                    onChange: onValueChanged
                                }
                            )
                            }
                            error={errors.bankAddressZIP}
                            helperText={errors.bankAddressZIP ? errors.bankAddressZIP : ""}
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        <TextInput
                            label="ABA Number"
                            disabled={isViewer}
                            id="bankABANumber"
                            name="bankABANumber"
                            fullWidth={true}
                            variant="outlined"
                            onChange={onValueChanged}
                            value={currentWirePayment.bankABANumber}
                            tooltip={findHelpTextByTag("bankABANumber", metadata.helpTags)}
                            inputProps={{ maxlength: 20 }}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            label="For credit to the account of"
                            disabled={isViewer}
                            id="bankCreditAccountOf"
                            name="bankCreditAccountOf"
                            fullWidth={true}
                            variant="outlined"
                            onChange={onValueChanged}
                            value={currentWirePayment.bankCreditAccountOf}
                            tooltip={findHelpTextByTag("bankCreditAccountOf", metadata.helpTags)}
                            inputProps={{ maxlength: 100 }}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            label="Account Number"
                            disabled={isViewer}
                            id="bankAccountNumber"
                            name="bankAccountNumber"
                            fullWidth={true}
                            variant="outlined"
                            onChange={onValueChanged}
                            value={currentWirePayment.bankAccountNumber}
                            tooltip={findHelpTextByTag("bankAccountNumber", metadata.helpTags)}
                            inputProps={{ maxlength: 30 }}
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="99%">
                        <TextInput
                            label="Message"
                            disabled={isViewer}
                            id="bankMessage"
                            name="bankMessage"
                            fullWidth={true}
                            variant="outlined"
                            onChange={onValueChanged}
                            value={currentWirePayment.bankMessage}
                            tooltip={findHelpTextByTag("bankMessage", metadata.helpTags)}
                            inputProps={{ maxlength: 35 }}
                        />
                    </ContentCell>
                </ContentRow>
                <Divider />
            </PanelContent>

        </Panel>
    );
};
