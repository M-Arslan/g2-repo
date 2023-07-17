import { Divider } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { APP_TYPES } from '../../../../../Core/Enumerations/app/app-types';
import { CLAIM_TYPES } from '../../../../../Core/Enumerations/app/claim-type';
import { LEGAL_ENTITY } from '../../../../../Core/Enumerations/app/legal-entity';
import { CurrencyInput, Panel, PanelContent, PanelHeader, TextInput } from '../../../../../Core/Forms/Common';
import { conferFinancialDB2Selectors, fsriFinancialDB2Selectors } from '../../../../../Core/State/slices/metadata/financial-db2';
import { userSelectors } from '../../../../../Core/State/slices/user';
import { findHelpTextByTag, loadHelpTags } from '../../../../Help/Queries';
import { ApproverSection } from '../ApproverSection';
import { ClaimActivityStatusInfoSection } from '../ClaimActivityStatusInfoSection';
import { ACCOUNTING_TRANS_TYPES } from '../../../../../Core/Enumerations/app/accounting-trans-type';
import { CLAIM_STATUS_TYPE } from '../../../../../Core/Enumerations/app/claim-status-type';
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

export const ReserveChangeActivityInfoSection = ({ claim, request, dispatch, formValidator, onSave, db2Claim,  lossExpenseReserve }) => {
    const $auth = useSelector(userSelectors.selectAuthContext());
    let isViewer = $auth.isReadOnly(APP_TYPES.Financials);
    if (!isViewer && request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.SUBMITTED_TO_ACCOUNTANT_AUTHORITY_CHECK && request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.RESERVE && claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE) {
        isViewer = false;
    }
    else if (!isViewer && request.currentClaimActivity.activityID && request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.OUTSTANDING_ISSUE) {
        isViewer = false;
    } else if (!isViewer && !request.currentClaimActivity.claimStatusTypeID) {
        isViewer = false;
    } else {
        isViewer = true;
    }
    const currentClaimActivity = request.currentClaimActivity || {};
    const currentReserveChange = currentClaimActivity.reserveChanges || {};
    const [metadata, setMetadata] = React.useState({
        loading: true,
        helpTags: [],
    });
    const fsriFinancialDB2 = useSelector(fsriFinancialDB2Selectors.selectData());
    const conferFinancialDB2 = useSelector(conferFinancialDB2Selectors.selectData());        
    let currentCededLossReserves = null;    
    let currentCededExpenseReserve = null;
    let currentAcr = null;
    let currentAer = null;

    if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.FSRI) {
        currentCededLossReserves = currentReserveChange.beginningCededLossReserve != null ? currentReserveChange.beginningCededLossReserve : fsriFinancialDB2.lossReserve;
        currentCededExpenseReserve = currentReserveChange.beginningCededExpenseReserve != null ? currentReserveChange.beginningCededExpenseReserve : fsriFinancialDB2.expenseReserve;
        currentAcr = currentReserveChange.beginningACR != null ? currentReserveChange.beginningACR : fsriFinancialDB2.additionalLossRes;
        currentAer = currentReserveChange.beginningAER != null ? currentReserveChange.beginningAER : fsriFinancialDB2.additionalExpenseRes;
    }
    if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.CONFER) {
        currentCededLossReserves = currentReserveChange.beginningCededLossReserve != null ? currentReserveChange.beginningCededLossReserve : conferFinancialDB2.totalLossReserve;
        currentCededExpenseReserve = currentReserveChange.beginningCededExpenseReserve != null ? currentReserveChange.beginningCededExpenseReserve : conferFinancialDB2.totalExpenseReserve;
        currentAcr = currentReserveChange.beginningACR != null ? currentReserveChange.beginningACR : conferFinancialDB2.totalACR;
        currentAer = currentReserveChange.beginningAER != null ? currentReserveChange.beginningAER : conferFinancialDB2.totalAER;
    }

    const { register, formState: { errors }, setValue } = formValidator;
    setValue("currentLossReserve", isNaN(parseFloat(currentReserveChange.currentLossReserve)) ? null : currentReserveChange.currentLossReserve);
    setValue("endingLossReserve", isNaN(parseFloat(currentReserveChange.endingLossReserve)) ? null : currentReserveChange.endingLossReserve);
    setValue("currentExpenseReserve", isNaN(parseFloat(currentReserveChange.currentExpenseReserve)) ? null : currentReserveChange.currentExpenseReserve);
    setValue("endingExpenseReserve", isNaN(parseFloat(currentReserveChange.endingExpenseReserve)) ? null : currentReserveChange.endingExpenseReserve);
    setValue("endingMedPayReserve", isNaN(parseFloat(currentReserveChange.endingMedPayReserve)) ? null : currentReserveChange.endingMedPayReserve);
    setValue("companyLossReserves", isNaN(parseFloat(currentReserveChange.companyLossReserves)) ? null : currentReserveChange.companyLossReserves);
    setValue("companyExpenseReserve", isNaN(parseFloat(currentReserveChange.companyExpenseReserve)) ? null : currentReserveChange.companyExpenseReserve);
    setValue("cededLossReserves", isNaN(parseFloat(currentReserveChange.cededLossReserves)) ? null : currentReserveChange.cededLossReserves);
    setValue("cededExpenseReserve", isNaN(parseFloat(currentReserveChange.cededExpenseReserve)) ? null : currentReserveChange.cededExpenseReserve);
    setValue("acr", isNaN(parseFloat(currentReserveChange.acr)) ? null : currentReserveChange.acr);
    setValue("aer", isNaN(parseFloat(currentReserveChange.aer)) ? null : currentReserveChange.aer);
    setValue("comments1", isNaN(parseFloat(currentReserveChange.comments)) ? null : currentReserveChange.comments1);
    const onCurrencyChanged = (evt) => {
        currentReserveChange[evt.target.name] = evt.target.value;
        currentClaimActivity.reserveChanges = currentReserveChange;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentClaimActivity: currentClaimActivity } });
    };

    const onValueChanged = (evt) => {
        if (evt.target.name ==="comments1")
            currentReserveChange["comments"] = evt.target.value;
        else
            currentReserveChange[evt.target.name] = evt.target.value;

        currentClaimActivity.reserveChanges = currentReserveChange;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentClaimActivity: currentClaimActivity } });
    };
    const convertFloatStringToFloat = (evt) => {
        let val = evt.target.value;
        val = val.replace("$", "");
        val = val.replaceAll(",", "");
        currentReserveChange[evt.target.name] = val;
        currentClaimActivity.reserveChanges = currentReserveChange;
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
                {(request.claim.g2LegalEntityID !== LEGAL_ENTITY.GENESIS_REINSURANCE || claim.claimType === CLAIM_TYPES.LEGAL) && <>
                    <ContentRow>
                        <ContentCell width="33%">
                            <CurrencyInput
                                disabled={isViewer}
                                id="lossReserves"
                                name="lossReserves"
                                label="Current Loss Reserve"
                                value={(lossExpenseReserve || {}).lossReserves}
                                InputProps={{ readOnly: true }}
                                tooltip={findHelpTextByTag("lossReserves", metadata.helpTags)}
                                allowNegative={true}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <CurrencyInput
                                disabled={isViewer}
                                id="endingLossReserve"
                                name="endingLossReserve"
                                label="Ending Loss Reserve"
                                required
                                inputProps={{ maxlength: 15 }}
                                value={currentReserveChange.endingLossReserve}
                                tooltip={findHelpTextByTag("endingLossReserve", metadata.helpTags)}
                                {...register("endingLossReserve",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged
                                    }
                                )
                                }
                                error={errors.endingLossReserve}
                                helperText={errors.endingLossReserve ? errors.endingLossReserve.message : ""}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="33%">
                            <CurrencyInput
                                disabled={isViewer}
                                inputProps={{ maxlength: 15 }}
                                id="expenseReserves"
                                name="expenseReserves"
                                label="Current Expense Reserve"
                                value={(lossExpenseReserve || {}).expenseReserves}
                                InputProps={{ readOnly: true }}
                                tooltip={findHelpTextByTag("expenseReserves", metadata.helpTags)}
                                allowNegative={true}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <CurrencyInput
                                disabled={isViewer}
                                inputProps={{ maxlength: 15 }}
                                id="endingExpenseReserve"
                                name="endingExpenseReserve"
                                label="Ending Expense Reserve"
                                required
                                value={currentReserveChange.endingExpenseReserve}
                                tooltip={findHelpTextByTag("endingExpenseReserve", metadata.helpTags)}
                                {...register("endingExpenseReserve",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged
                                    }
                                )
                                }
                                error={errors.endingExpenseReserve}
                                helperText={errors.endingExpenseReserve ? errors.endingExpenseReserve.message : ""}

                            />
                        </ContentCell>
                    </ContentRow>
                    {
                        claim.claimType === CLAIM_TYPES.CASUALTY
                        &&
                        claim.g2LegalEntityID !== LEGAL_ENTITY.GENESIS_INSURANCE
                        &&
                        <ContentRow>
                            <ContentCell width="33%">
                                <CurrencyInput
                                    disabled={isViewer}
                                    inputProps={{ maxlength: 15 }}
                                    id="medPayLossReserves"
                                    name="medPayLossReserves"
                                    label="Current Med Pay Reserve"
                                    value={(lossExpenseReserve || {}).medPayLossReserves}
                                    InputProps={{ readOnly: true }}
                                    tooltip={findHelpTextByTag("medPayLossReserves", metadata.helpTags)}
                                    allowNegative={true}
                                />
                            </ContentCell>
                            <ContentCell width="33%">
                                <CurrencyInput
                                    disabled={isViewer}
                                    inputProps={{ maxlength: 15 }}
                                    id="endingMedPayReserve"
                                    name="endingMedPayReserve"
                                    label="Ending MedPay Reserve"
                                    required
                                    value={currentReserveChange.endingMedPayReserve}
                                    tooltip={findHelpTextByTag("endingMedPayReserve", metadata.helpTags)}
                                    {...register("endingMedPayReserve",
                                        {
                                            required: "This is required.",
                                            onChange: onCurrencyChanged
                                        }
                                    )
                                    }
                                    error={errors.endingMedPayReserve}
                                    helperText={errors.endingMedPayReserve ? errors.endingMedPayReserve.message : ""}

                                />
                            </ContentCell>

                        </ContentRow>
                    }
                </>
                }

        
                


                {request.claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.claimType !== CLAIM_TYPES.LEGAL && <>

                    <ContentRow>
                        <ContentCell width="33%">
                            <CurrencyInput
                                disabled={isViewer}
                                inputProps={{ readOnly: true }}
                                id="currentCededLossReserves"
                                name="currentCededLossReserves"
                                label="Current Ceded Loss Reserves"                                
                                value={currentCededLossReserves}                                
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
                                value={currentCededExpenseReserve}
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
                                value={currentAcr}
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
                                value={currentAer}
                                allowNegative={true}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentCell width="100%">
                        <span style={{ fontWeight: 'bold' }}>Please supply Company dollars and any additional Reserves (ACR/AER) you might wish to post</span>
                    </ContentCell>
                    <ContentRow>
                        <ContentCell width="33%">
                            <CurrencyInput
                                disabled={isViewer}
                                inputProps={{ maxlength: 15 }}
                                id="companyLossReserves"
                                name="companyLossReserves"
                                label="Company Loss Reserves"
                                required
                                value={currentReserveChange.companyLossReserves}
                                tooltip={findHelpTextByTag("companyLossReserves", metadata.helpTags)}
                                {...register("companyLossReserves",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged
                                    }
                                )
                                }
                                error={errors.companyLossReserves}
                                helperText={errors.companyLossReserves ? errors.companyLossReserves.message : ""}
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <CurrencyInput
                                disabled={isViewer}
                                inputProps={{ maxlength: 15 }}
                                id="companyExpenseReserve"
                                name="companyExpenseReserve"
                                label="Company Expense Reserve"
                                required
                                value={currentReserveChange.companyExpenseReserve}
                                tooltip={findHelpTextByTag("companyExpenseReserve", metadata.helpTags)}
                                {...register("companyExpenseReserve",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged
                                    }
                                )
                                }
                                error={errors.companyExpenseReserve}
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
                                inputProps={{ maxlength: 15 }}
                                id="acr"
                                name="acr"
                                label="ACR"
                                required
                                value={currentReserveChange.acr}
                                tooltip={findHelpTextByTag("acr", metadata.helpTags)}
                                {...register("acr",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged
                                    }
                                )
                                }
                                error={errors.acr}
                                helperText={errors.acr ? errors.acr.message : ""}
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <CurrencyInput
                                disabled={isViewer}
                                inputProps={{ maxlength: 15 }}
                                id="aer"
                                name="aer"
                                label="AER"
                                required
                                value={currentReserveChange.aer}
                                tooltip={findHelpTextByTag("aer", metadata.helpTags)}
                                {...register("aer",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged
                                    }
                                )
                                }
                                error={errors.aer}
                                helperText={errors.aer ? errors.aer.message : ""}
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentCell width="100%">
                        <span style={{ fontWeight: 'bold' }}>Claims accounting will complete these amounts based on the company dollars provided above</span>
                    </ContentCell>
                    <ContentRow>
                        <ContentCell width="33%">
                            <CurrencyInput
                                disabled={isViewer}
                                inputProps={{ maxlength: 15 }}
                                id="cededLossReserves"
                                name="cededLossReserves"
                                label="Ceded Loss Reserves"
                                value={currentReserveChange.cededLossReserves}
                                tooltip={findHelpTextByTag("cededLossReserves", metadata.helpTags)}
                                {...register("cededLossReserves",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged
                                    }
                                )
                                }
                                error={errors.cededLossReserves}
                                helperText={errors.cededLossReserves ? errors.cededLossReserves.message : ""}
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <CurrencyInput
                                disabled={isViewer}
                                inputProps={{ maxlength: 15 }}
                                id="cededExpenseReserve"
                                name="cededExpenseReserve"
                                label="Ceded Expense Reserve"
                                value={currentReserveChange.cededExpenseReserve}
                                tooltip={findHelpTextByTag("cededExpenseReserve", metadata.helpTags)}
                                {...register("cededExpenseReserve",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged
                                    }
                                )
                                }
                                error={errors.cededExpenseReserve}
                                helperText={errors.cededExpenseReserve ? errors.cededExpenseReserve.message : ""}
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="66%">
                            <TextInput
                                label="Comments"
                                disabled={isViewer}
                                id="comments1"
                                name="comments1"
                                fullWidth={true}
                                variant="outlined"
                                value={currentReserveChange.comments}
                                {...register("comments1",
                                    {
                                        required: "This is required.",                                        
                                    }
                                )
                                }
                                onChange={onValueChanged}
                                error={errors.comments1}
                                helperText={errors.comments1 ? errors.comments1.message : ""}
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
