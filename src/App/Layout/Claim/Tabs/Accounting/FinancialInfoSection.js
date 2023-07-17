import { Divider, MenuItem } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { APP_TYPES } from '../../../../Core/Enumerations/app/app-types';
import { LEGAL_ENTITY } from '../../../../Core/Enumerations/app/legal-entity';
import { CurrencyInput, DatePicker, formatDate, Panel, PanelContent, PanelHeader, SwitchInput, TextInput, SelectList } from '../../../../Core/Forms/Common';
import { userSelectors } from '../../../../Core/State/slices/user';
import { usersSelectors } from '../../../../Core/State/slices/users';
import { findHelpTextByTag, loadHelpTags } from '../../../Help/Queries';
import { ClaimActivityStatusInfoSection } from '../Accounting/ClaimActivityStatusInfoSection';
import { ACCOUNTING_TRANS_TYPES } from '../../../../Core/Enumerations/app/accounting-trans-type';
import { CLAIM_TYPES } from '../../../../Core/Enumerations/app/claim-type';


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

export const FinancialInfoSection = ({ request, dispatch, formValidator, onSave }) => {
    const $auth = useSelector(userSelectors.selectAuthContext());
    const isViewer = $auth.isReadOnly(APP_TYPES.Financials);
    const users = useSelector(usersSelectors.selectData());

    const register = formValidator.register, errors = formValidator.errors;

    let currentFinancial = request.currentFinancial;
    const [metadata, setMetadata] = React.useState({
        loading: true,
        helpTags: []
    });

    const onValueChanged = (evt) => {
        request.currentFinancial[evt.target.name] = evt.target.value;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
    };
    const onCheckBoxChanged = (evt) => {
        request.currentFinancial[evt.target.name] = evt.target.checked;

        if (evt.target.name === "deductibleApplies") {

            request.currentFinancial["deductibleHasBeenMet"] = false;
            request.currentFinancial["deductibleAmount"] = null;
            request.currentFinancial["deductibleAmountRemaining"] = null;
            request.currentFinancial["doNotSetDeductibleReserve"] = false;
            request.currentFinancial["deductibleMasterPolicies"] = false;

        }
        else if (evt.target.name === "sIRApplies") {

            request.currentFinancial["sIRAmount"] = null;

        }
        else if (evt.target.name === "supplementalPaymentLimit") {

            request.currentFinancial["supplementalPaymentRemaining"] = null;

        }
        else if (evt.target.name === "salvageSubroApplies") {

            request.currentFinancial["salvageSubroDemand"] = null;
            request.currentFinancial["salvageSubroDemandDate"] = null;

            request.currentFinancial["salvageSubroCollected"] = false;
            request.currentFinancial["salvageSubroAmountCollected"] = null;
            request.currentFinancial["salvageSubroDateCollected"] = null;
            request.currentFinancial["salvageSubroRemarks"] = null;

        }
        else if (evt.target.name === "salvageSubroCollected") {

            request.currentFinancial["salvageSubroAmountCollected"] = null;
            request.currentFinancial["salvageSubroDateCollected"] = null;

        }
        else if (evt.target.name === "specialCoverages") {

            request.currentFinancial["specialCoverageType"] = null;
        }
        else if (evt.target.name === "offsetApplies") {

            request.currentFinancial["offsetType"] = null;
        }

        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
        onSave();
    };
    const onDateChanged = (evt) => {
        request.currentFinancial[evt.target.name] = evt.target.value ? new Date(evt.target.value).toISOString() : null;

        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
        onSave();
    };
    //const onDropDownChanged = (evt) => {
    //    request.currentFinancial[evt.target.name] = evt.target.value;
    //    dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
    //    onSave();
    //};
    const onCurrencyChanged = (evt) => {
        request.currentFinancial[evt.target.name] = evt.target.value;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
    };
    React.useEffect(() => {
        Promise.all([
            loadHelpTags(request.helpContainerName)
        ])
            .then(([helpTags]) => {
                setMetadata({
                    loading: false,
                    helpTags: (helpTags.data.list || []),
                });
            });
    }, []);

    return (
        <Panel>
            <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>{(request.currentClaimActivity || {}).accountingTransTypeText ? (request.currentClaimActivity || {}).accountingTransTypeText : "Financials"}</span></PanelHeader>
            <PanelContent>
                {
                    request.currentClaimActivity && (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.INITIAL_RI_NOTICE || request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.DEDUCTIBLE_COLLECTION) &&
                    <>
                        <ClaimActivityStatusInfoSection claim={request.claim} request={request} dispatch={dispatch} />
                        <Divider />
                    </>
                }
                {request.claim.g2LegalEntityID !== LEGAL_ENTITY.GENESIS_REINSURANCE && request.claim.claimType !== CLAIM_TYPES.WORKERS_COMP &&
                    <>
                        {request.claim.g2LegalEntityID !== LEGAL_ENTITY.GENESIS_INSURANCE &&
                            <ContentRow>
                                <ContentCell width="33%">
                                    <SwitchInput
                                        disabled={isViewer}
                                        id="facRIApplies"
                                        name="facRIApplies"
                                        label="Fac R/I Applies"
                                        checked={currentFinancial.facRIApplies}
                                        onChange={onCheckBoxChanged}
                                        tooltip={findHelpTextByTag("facRIApplies", metadata.helpTags)}
                                    />
                                </ContentCell>
                                <ContentCell width="33%">
                                    <TextInput
                                        InputProps={{ readOnly: true }}
                                        label="Fac R/I Checked By"
                                        fullWidth={true}
                                        variant="outlined"
                                        value={(users.filter(x => x.userID.toLowerCase() === ((request.lastFacRICheckedActionLog || {}).createdBy || "").toLowerCase())[0] || {}).fullName}
                                        key={(request.lastFacRICheckedActionLog || {}).createdBy}
                                    />
                                </ContentCell>
                                <ContentCell width="33%">
                                    <TextInput
                                        InputProps={{ readOnly: true }}
                                        label="Fac R/I Checked Date"
                                        fullWidth={true}
                                        variant="outlined"
                                        value={formatDate((request.lastFacRICheckedActionLog || {}).createdDate)}
                                        key={formatDate((request.lastFacRICheckedActionLog || {}).createdDate)}
                                    />
                                </ContentCell>
                            </ContentRow>
                        }
                        <ContentRow>
                            <ContentCell width="33%">
                                <SwitchInput
                                    disabled={isViewer}
                                    id="treatyRIApplies"
                                    name="treatyRIApplies"
                                    label="Treaty R/I Applies"
                                    checked={currentFinancial.treatyRIApplies}
                                    onChange={onCheckBoxChanged}
                                    tooltip={findHelpTextByTag("treatyRIApplies", metadata.helpTags)}
                                />
                            </ContentCell>
                        </ContentRow>
                        <Divider />
                        <ContentRow>
                            <ContentCell width="33%">
                                <SwitchInput
                                    disabled={isViewer}
                                    id="deductibleApplies"
                                    name="deductibleApplies"
                                    label="Deductible Applies"
                                    checked={currentFinancial.deductibleApplies}
                                    onChange={onCheckBoxChanged}
                                    tooltip={findHelpTextByTag("deductibleApplies", metadata.helpTags)}
                                />
                            </ContentCell>
                        </ContentRow>
                        {currentFinancial.deductibleApplies &&
                            <>
                                <ContentRow>
                                    <ContentCell width="33%">
                                        <SwitchInput
                                            disabled={isViewer}
                                            id="deductibleHasBeenMet"
                                            name="deductibleHasBeenMet"
                                            label="Deductible has been met"
                                            checked={currentFinancial.deductibleHasBeenMet}
                                            onChange={onCheckBoxChanged}
                                            tooltip={findHelpTextByTag("deductibleHasBeenMet", metadata.helpTags)}
                                        />
                                    </ContentCell>
                                    <ContentCell width="33%">
                                        <CurrencyInput
                                            disabled={isViewer}
                                            id="deductibleAmount"
                                            name="deductibleAmount"
                                            label="Deductible Amount"
                                            value={currentFinancial.deductibleAmount}
                                            onChange={onCurrencyChanged}
                                            onBlur={onSave}
                                            inputProps={{ maxlength: 15 }}
                                            tooltip={findHelpTextByTag("deductibleAmount", metadata.helpTags)}
                                        />
                                    </ContentCell>
                                    <ContentCell width="33%">
                                        <CurrencyInput
                                            disabled={isViewer}
                                            id="deductibleAmountRemaining"
                                            name="deductibleAmountRemaining"
                                            label="Deductible Amount Remaining"
                                            value={currentFinancial.deductibleAmountRemaining}
                                            onChange={onCurrencyChanged}
                                            onBlur={onSave}
                                            inputProps={{ maxlength: 15 }}
                                            tooltip={findHelpTextByTag("deductibleAmountRemaining", metadata.helpTags)}
                                        />
                                    </ContentCell>
                                </ContentRow>
                                <ContentRow>
                                    <ContentCell width="33%">
                                        <SwitchInput
                                            disabled={isViewer}
                                            id="doNotSetDeductibleReserve"
                                            name="doNotSetDeductibleReserve"
                                            label="Do not set a deductible reserve"
                                            checked={currentFinancial.doNotSetDeductibleReserve}
                                            onChange={onCheckBoxChanged}
                                            tooltip={findHelpTextByTag("doNotSetDeductibleReserve", metadata.helpTags)}
                                        />
                                    </ContentCell>
                                </ContentRow>
                                <ContentRow>
                                    <ContentCell width="33%">
                                        <CurrencyInput
                                            InputProps={{ readOnly: true }}
                                            label="Deductible Collection Amount"
                                            fullWidth={true}
                                            variant="outlined"
                                            value={currentFinancial.deductibleCollectionAmount ? parseFloat(currentFinancial.deductibleCollectionAmount).toFixed(2) : ""}
                                            key={currentFinancial.deductibleCollectionAmount}
                                        />
                                    </ContentCell>
                                    <ContentCell width="33%">
                                        <TextInput
                                            InputProps={{ readOnly: true }}
                                            label="Deductible Requested By"
                                            fullWidth={true}
                                            variant="outlined"
                                            value={(users.filter(x => x.userID.toLowerCase() === ((request.lastDeductibleCollectionActionLog || {}).createdBy || "").toLowerCase())[0] || {}).fullName}
                                            key={(request.lastDeductibleCollectionActionLog || {}).createdBy}
                                        />
                                    </ContentCell>
                                    <ContentCell width="33%">
                                        <TextInput
                                            InputProps={{ readOnly: true }}
                                            label="Deductible Requested Date"
                                            fullWidth={true}
                                            variant="outlined"
                                            value={formatDate((request.lastDeductibleCollectionActionLog || {}).createdDate)}
                                            key={formatDate((request.lastDeductibleCollectionActionLog || {}).createdDate)}
                                        />
                                    </ContentCell>
                                </ContentRow>
                                <ContentRow>
                                    <ContentCell width="33%">
                                        <SwitchInput
                                            disabled={isViewer}
                                            id="deductibleMasterPolicies"
                                            name="deductibleMasterPolicies"
                                            label="Deductible on Master Policies"
                                            checked={currentFinancial.deductibleMasterPolicies}
                                            onChange={onCheckBoxChanged}
                                            tooltip={findHelpTextByTag("deductibleMasterPolicies", metadata.helpTags)}
                                        />
                                    </ContentCell>
                                </ContentRow>
                            </>
                        }
                        <Divider />
                        <ContentRow>
                            <ContentCell width="33%">
                                <SwitchInput
                                    disabled={isViewer}
                                    id="sIRApplies"
                                    name="sIRApplies"
                                    label="SIR Applies"
                                    onChange={onCheckBoxChanged}
                                    checked={currentFinancial.sIRApplies}
                                    tooltip={findHelpTextByTag("sIRApplies", metadata.helpTags)}
                                />
                            </ContentCell>
                            {currentFinancial.sIRApplies &&
                                <ContentCell width="33%">
                                    <CurrencyInput
                                        disabled={isViewer}
                                        id="sIRAmount"
                                        name="sIRAmount"
                                        label="SIR Amount"
                                        value={currentFinancial.sIRAmount}
                                        onChange={onCurrencyChanged}
                                        onBlur={onSave}
                                        inputProps={{ maxlength: 15 }}
                                        tooltip={findHelpTextByTag("sIRAmount", metadata.helpTags)}
                                    />
                                </ContentCell>
                            }
                        </ContentRow>
                        <Divider />
                        <ContentRow>
                            <ContentCell width="33%">
                                <SwitchInput
                                    disabled={isViewer}
                                    id="supplementalPaymentLimit"
                                    name="supplementalPaymentLimit"
                                    label="Supplemental Payment Limit"
                                    onChange={onCheckBoxChanged}
                                    checked={currentFinancial.supplementalPaymentLimit}
                                    tooltip={findHelpTextByTag("supplementalPaymentLimit", metadata.helpTags)}
                                />
                            </ContentCell>
                            {currentFinancial.supplementalPaymentLimit &&
                                <ContentCell width="33%">
                                    <CurrencyInput
                                        disabled={isViewer}
                                        id="supplementalPaymentRemaining"
                                        name="supplementalPaymentRemaining"
                                        label="Supplemental Payment Remaining"
                                        value={currentFinancial.supplementalPaymentRemaining}
                                        onChange={onCurrencyChanged}
                                        onBlur={onSave}
                                        inputProps={{ maxlength: 15 }}
                                        tooltip={findHelpTextByTag("supplementalPaymentRemaining", metadata.helpTags)}
                                    />
                                </ContentCell>
                            }
                        </ContentRow>
                        <Divider />
                    </>
                }
                {request.claim.claimType === CLAIM_TYPES.WORKERS_COMP &&
                    <>
                        <ContentRow>
                            <ContentCell width="33%">
                                <SwitchInput
                                    disabled={isViewer}
                                    id="specialCoverages"
                                    name="specialCoverages"
                                    label="Special Coverages"
                                    onChange={onCheckBoxChanged}
                                    checked={currentFinancial.specialCoverages}
                                    tooltip={findHelpTextByTag("specialCoverages", metadata.helpTags)}
                                />
                            </ContentCell>
                            {currentFinancial.specialCoverages &&
                                <ContentCell width="33%">
                                    <SelectList
                                        disabled={isViewer}
                                        id="specialCoverageType"
                                        name="specialCoverageType"
                                        label="Special Coverages Type"
                                        fullWidth={true}
                                        allowempty={true}
                                        onChange={onValueChanged}
                                        onBlur={onSave}
                                        variant="outlined"
                                        value={currentFinancial.specialCoverageType}
                                    >
                                        <MenuItem value={"Pappy"} key={"1"}>Pappy</MenuItem>
                                        <MenuItem value={"PappyNoE-Cap"} key={"2"}>Pappy, No E-Cap</MenuItem>
                                        <MenuItem value={"AnnualAggregateDeductible"} key={"3"}>Annual Aggregate Deductible (or AAD)</MenuItem>
                                        <MenuItem value={"PolicySub-Limit"} key={"4"}>Policy Sub-Limit</MenuItem>

                                    </SelectList>
                                </ContentCell>}
                        </ContentRow>

                        <ContentRow>
                            <ContentCell width="33%">
                                <SwitchInput
                                    disabled={isViewer}
                                    id="offsetApplies"
                                    name="offsetApplies"
                                    label="Offset Applies"
                                    onChange={onCheckBoxChanged}
                                    checked={currentFinancial.offsetApplies}
                                    tooltip={findHelpTextByTag("offsetApplies", metadata.helpTags)}
                                />
                            </ContentCell>
                            {currentFinancial.offsetApplies &&
                                <ContentCell width="33%">
                                    <SelectList
                                        disabled={isViewer}
                                        id="offsetType"
                                        name="offsetType"
                                        label="Offset Type"
                                        fullWidth={true}
                                        allowempty={true}
                                        onChange={onValueChanged}
                                        onBlur={onSave}
                                        variant="outlined"
                                        value={currentFinancial.offsetType}
                                    >
                                        <MenuItem value={"SecondInjuryFund-Full"} key={"1"}>Second Injury Fund - Full</MenuItem>
                                        <MenuItem value={"SecondInjuryFund-Partial"} key={"2"}>Second Injury Fund - Partial</MenuItem>
                                        <MenuItem value={"Subrogation"} key={"3"}>Subrogation</MenuItem>
                                        <MenuItem value={"COLA"} key={"4"}>COLA</MenuItem>
                                    </SelectList>
                                </ContentCell>
                        }
                        </ContentRow>
                    </>
                }
                {request.claim.claimType !== CLAIM_TYPES.WORKERS_COMP &&
                    <ContentRow>
                        <ContentCell width="33%">
                            <SwitchInput
                                disabled={isViewer}
                                id="salvageSubroApplies"
                                name="salvageSubroApplies"
                                label="Salvage/Subro applies"
                                onChange={onCheckBoxChanged}
                                checked={currentFinancial.salvageSubroApplies}
                                tooltip={findHelpTextByTag("salvageSubroApplies", metadata.helpTags)}
                            />
                        </ContentCell>
                    </ContentRow>
                }
                {currentFinancial.salvageSubroApplies &&
                    <>
                        <ContentRow>
                            <ContentCell width="33%">
                                <CurrencyInput
                                    disabled={isViewer}
                                    id="salvageSubroDemand"
                                    name="salvageSubroDemand"
                                    label="Salvage/Subro Demand"
                                    value={currentFinancial.salvageSubroDemand}
                                    onChange={onCurrencyChanged}
                                    onBlur={onSave}
                                    inputProps={{ maxlength: 15 }}
                                    tooltip={findHelpTextByTag("salvageSubroDemand", metadata.helpTags)}
                                />
                            </ContentCell>
                            <ContentCell width="33%">
                                <DatePicker
                                    disabled={isViewer}
                                    id="salvageSubroDemandDate"
                                    name="salvageSubroDemandDate"
                                    label="Salvage/Subro Demand Date"
                                    fullWidth={true}
                                    onChange={onDateChanged}
                                    variant="outlined"
                                    value={currentFinancial.salvageSubroDemandDate}
                                    disableFuture={true}
                                    required
                                    error={errors?.salvageSubroDemandDate}
                                    helperText={errors?.salvageSubroDemandDate ? errors.salvageSubroDemandDate.message : ""}
                                    inputRef={
                                        register
                                            (
                                                'salvageSubroDemandDate',
                                                {
                                                    required: "This field is required.",
                                                    pattern: { value: /^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d$/i, message: "Invalid date" }
                                                }
                                            )
                                    }
                                    tooltip={findHelpTextByTag("salvageSubroDemandDate", metadata.helpTags)}
                                />
                            </ContentCell>
                        </ContentRow>
                        <Divider />
                        <ContentRow>
                            <ContentCell width="33%">
                                <SwitchInput
                                    disabled={isViewer}
                                    id="salvageSubroCollected"
                                    name="salvageSubroCollected"
                                    label="Salvage/Subro Collected"
                                    onChange={onCheckBoxChanged}
                                    checked={currentFinancial.salvageSubroCollected}
                                    tooltip={findHelpTextByTag("salvageSubroCollected", metadata.helpTags)}
                                />
                            </ContentCell>
                            {currentFinancial.salvageSubroCollected &&
                                <>
                                    <ContentCell width="33%">
                                        <CurrencyInput
                                            disabled={isViewer}
                                            id="salvageSubroAmountCollected"
                                            name="salvageSubroAmountCollected"
                                            label="Salvage/Subro Amount Collected"
                                            value={currentFinancial.salvageSubroAmountCollected}
                                            onChange={onCurrencyChanged}
                                            onBlur={onSave}
                                            inputProps={{ maxlength: 15 }}
                                            tooltip={findHelpTextByTag("salvageSubroAmountCollected", metadata.helpTags)}
                                        />
                                    </ContentCell>
                                    <ContentCell width="33%">
                                        <DatePicker
                                            disabled={isViewer}
                                            id="salvageSubroDateCollected"
                                            name="salvageSubroDateCollected"
                                            label="Salvage/Subro Date Collected"
                                            fullWidth={true}
                                            onChange={onDateChanged}
                                            variant="outlined"
                                            value={currentFinancial.salvageSubroDateCollected}
                                            disableFuture={true}
                                            required
                                            error={errors?.salvageSubroDateCollected}
                                            helperText={errors?.salvageSubroDateCollected ? errors.salvageSubroDateCollected.message : ""}
                                            inputRef={
                                                register
                                                    (
                                                        'salvageSubroDateCollected',
                                                        {
                                                            required: "This field is required.",
                                                            pattern: { value: /^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d$/i, message: "Invalid date" }
                                                        }
                                                    )
                                            }
                                            tooltip={findHelpTextByTag("salvageSubroDateCollected", metadata.helpTags)}
                                        />
                                    </ContentCell>
                                </>
                            }
                        </ContentRow>
                        <Divider />
                        <ContentRow>
                            <ContentCell width="99%">
                                <TextInput
                                    disabled={isViewer}
                                    id="salvageSubroRemarks"
                                    name="salvageSubroRemarks"
                                    label="Salvage/Subro Remarks"
                                    fullWidth={true}
                                    onChange={onValueChanged}
                                    variant="outlined"
                                    value={currentFinancial.salvageSubroRemarks}
                                    inputProps={{ maxlength: 250 }}
                                    onBlur={onSave}
                                    tooltip={findHelpTextByTag("salvageSubroRemarks", metadata.helpTags)}
                                    inputRef={
                                        register
                                            (
                                                'salvageSubroRemarks',
                                                {
                                                    pattern: {
                                                        value: /^[a-zA-Z ]*$/i,
                                                        message: "Must contain characters only"
                                                    }
                                                }
                                            )
                                    }
                                    error={errors?.salvageSubroRemarks}
                                    helperText={errors?.salvageSubroRemarks ? errors.salvageSubroRemarks.message : ""}
                                />
                            </ContentCell>
                        </ContentRow>
                    </>
                }
                {request.claim.g2LegalEntityID !== LEGAL_ENTITY.GENESIS_REINSURANCE && request.claim.claimType !== CLAIM_TYPES.WORKERS_COMP &&
                    <>
                        <ContentRow>
                            <ContentCell width="33%">
                                <TextInput
                                    InputProps={{ readOnly: true }}
                                    label="Initial R/I Requested By"
                                    fullWidth={true}
                                    variant="outlined"
                                    value={(users.filter(x => x.userID.toLowerCase() === ((request.lastInitialRINoticeActionLog || {}).createdBy || "").toLowerCase())[0] || {}).fullName}
                                    key={(request.lastInitialRINoticeActionLog || {}).createdBy}
                                />
                            </ContentCell>
                            <ContentCell width="33%">
                                <TextInput
                                    InputProps={{ readOnly: true }}
                                    label="Initial R/I Requested Date"
                                    fullWidth={true}
                                    variant="outlined"
                                    value={formatDate((request.lastInitialRINoticeActionLog || {}).createdDate)}
                                    key={formatDate((request.lastInitialRINoticeActionLog || {}).createdDate)}
                                />
                            </ContentCell>
                        </ContentRow>
                        <ContentRow>
                            <ContentCell width="99%">
                                <TextInput
                                    InputProps={{ readOnly: true }}
                                    label="Initial R/I Notice Comment"
                                    fullWidth={true}
                                    multiline
                                    rows={3}
                                    variant="outlined"
                                    value={currentFinancial.initialRINoticeComment}
                                    key={currentFinancial.initialRINoticeComment}
                                />
                            </ContentCell>
                        </ContentRow>
                    </>
                }
            </PanelContent>
        </Panel>
    );
};
