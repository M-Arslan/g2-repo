
import { Divider, MenuItem } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { APP_TYPES } from '../../../../../Core/Enumerations/app/app-types';
import { CurrencyInput, DatePicker, Panel, PanelContent, PanelHeader, SelectList, TextInput } from '../../../../../Core/Forms/Common';
import { userSelectors } from '../../../../../Core/State/slices/user';
import { usersSelectors } from '../../../../../Core/State/slices/users';
import { findHelpTextByTag, loadHelpTags } from '../../../../Help/Queries';
import { ApproverSection } from '../ApproverSection';
import { ClaimActivityStatusInfoSection } from '../ClaimActivityStatusInfoSection';
import { CLAIM_TYPES } from '../../../../../Core/Enumerations/app/claim-type';
import { LEGAL_ENTITY } from '../../../../../Core/Enumerations/app/legal-entity';
import { ACCOUNTING_TRANS_TYPES } from '../../../../../Core/Enumerations/app/accounting-trans-type';
import { CLAIM_STATUS_TYPE } from '../../../../../Core/Enumerations/app/claim-status-type';
import { conferFinancialDB2Selectors, fsriFinancialDB2Selectors } from '../../../../../Core/State/slices/metadata/financial-db2';
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

export const WCTabularUpdateActivityInfoSection = ({ claim, request, dispatch, formValidator, onSave }) => {
    const $auth = useSelector(userSelectors.selectAuthContext());
    //const $dispatch = useDispatch();

    const currentUser = $auth.currentUser;
    const supervisors = useSelector(usersSelectors.getSupervisors());
    const isLegalClaim = claim.claimType === CLAIM_TYPES.LEGAL;

    let isViewer = $auth.isReadOnly(APP_TYPES.Financials);
    //if (!isViewer && request.currentClaimActivity?.claimStatusTypeID === CLAIM_STATUS_TYPE.SUBMITTED && request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.WC_TABULAR_UPDATE && claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.claimType === CLAIM_TYPES.WORKERS_COMP) {
    if (!isViewer && request.currentClaimActivity?.claimStatusTypeID === CLAIM_STATUS_TYPE.SUBMITTED_TO_ACCOUNTANT_AUTHORITY_CHECK && [ACCOUNTING_TRANS_TYPES.WC_TABULAR_UPDATE, ACCOUNTING_TRANS_TYPES.WC_RESERVE].includes(request.currentClaimActivity.accountingTransTypeID) && claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.claimType === CLAIM_TYPES.WORKERS_COMP) {
        isViewer = false;
    }
    else if (!isViewer && request.currentClaimActivity?.activityID && request.currentClaimActivity?.claimStatusTypeID === CLAIM_STATUS_TYPE.OUTSTANDING_ISSUE) {
        isViewer = false;
    } else if (!isViewer && !request.currentClaimActivity?.activityID) {
        isViewer = false;
    } else {
        isViewer = true;
    }

    const fsriFinancialDB2 = useSelector(fsriFinancialDB2Selectors.selectData());
    const conferFinancialDB2 = useSelector(conferFinancialDB2Selectors.selectData());
    const currentClaimActivity = request.currentClaimActivity || {};

    const currentWCTabularUpdate = currentClaimActivity.wCTabularUpdate || {};
    const { register, formState: { errors }, setValue } = formValidator;

    setValue("companyFinancialDate", currentWCTabularUpdate.companyFinancialDate);

    setValue("companyIndemnityPaid", currentWCTabularUpdate.companyIndemnityPaid);
    setValue("companyIndemnityReserves", currentWCTabularUpdate.companyIndemnityReserves);
    setValue("companyMedicalPaid", currentWCTabularUpdate.companyMedicalPaid);
    setValue("companyMedicalReserves", currentWCTabularUpdate.companyMedicalReserves);
    setValue("companyExpensePaid", currentWCTabularUpdate.companyExpensePaid);
    setValue("companyExpenseReserves", currentWCTabularUpdate.companyExpenseReserves);

    setValue("companySubroSIF", currentWCTabularUpdate.companySubroSIF);

    setValue("comments1", currentWCTabularUpdate.comments);
    setValue("caraDocs", currentWCTabularUpdate.caraDocs);

    setValue("beginningIndemnityPaid", currentWCTabularUpdate.beginningIndemnityPaid);
    setValue("beginningIndemnityReserves", currentWCTabularUpdate.beginningIndemnityReserves);
    setValue("beginningExpensePaid", currentWCTabularUpdate.beginningExpensePaid);
    setValue("beginningExpenseReserves", currentWCTabularUpdate.beginningExpenseReserves);
    setValue("beginningACR", currentWCTabularUpdate.beginningACR);
    setValue("beginningAER", currentWCTabularUpdate.beginningAER);

    setValue("cededIndemnityPaid", currentWCTabularUpdate.cededIndemnityPaid);
    setValue("cededIndemnityReserves", currentWCTabularUpdate.cededIndemnityReserves);
    setValue("cededExpensePaid", currentWCTabularUpdate.cededExpensePaid);
    setValue("cededExpenseReserves", currentWCTabularUpdate.cededExpenseReserves);
    setValue("cededACR", currentWCTabularUpdate.cededACR);
    setValue("cededAER", currentWCTabularUpdate.cededAER);

    setValue("totalIncuredChangeAmount", currentWCTabularUpdate.totalIncuredChangeAmount);



    const [metadata, setMetadata] = React.useState({
        loading: true,
        helpTags: [],
    });

    const onValueChanged = (evt) => {
        if (evt.target.name === "comments1")
            currentWCTabularUpdate["comments"] = evt.target.value.trimStart();
        else
            currentWCTabularUpdate[evt.target.name] = evt.target.value.trimStart();

        currentClaimActivity.wCTabularUpdate = currentWCTabularUpdate;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentClaimActivity: currentClaimActivity } });
    };
    const onDateChanged = (evt) => {
        currentWCTabularUpdate[evt.target.name] = evt.target.value;
        currentClaimActivity.wCTabularUpdate = currentWCTabularUpdate;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentClaimActivity: currentClaimActivity } });
    };
    const onDropDownChanged = (evt) => {
        if (evt.target.name === "boBCoverageID") {
            let nClaim = JSON.parse(JSON.stringify(claim));
            nClaim.kindOfBusinessID = evt.target.value;
            request.claim = nClaim;

        }
        else {
            currentWCTabularUpdate[evt.target.name] = evt.target.value;
            currentClaimActivity.wCTabularUpdate = currentWCTabularUpdate;
        }

        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentClaimActivity: currentClaimActivity } });
    };
    const onCurrencyChanged = (evt) => {
        currentWCTabularUpdate[evt.target.name] = evt.target.value;
        currentClaimActivity.wCTabularUpdate = currentWCTabularUpdate;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentClaimActivity: currentClaimActivity } });
    };
    const convertFloatStringToFloat = (evt) => {
        let val = evt.target.value;
        val = val.replace("$", "");
        val = val.replaceAll(",", "");
        currentWCTabularUpdate[evt.target.name] = !isNaN(parseFloat(val)) ? parseFloat(val) : val;
        currentClaimActivity.wCTabularUpdate = currentWCTabularUpdate;
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
    if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.NAT_RE) {
        currentWCTabularUpdate.beginningIndemnityPaid = currentWCTabularUpdate.beginningIndemnityPaid != null ? currentWCTabularUpdate.beginningIndemnityPaid : null;
        currentWCTabularUpdate.beginningExpensePaid = currentWCTabularUpdate.beginningExpensePaid != null ? currentWCTabularUpdate.beginningExpensePaid : null;
        currentWCTabularUpdate.beginningIndemnityReserves = currentWCTabularUpdate.beginningIndemnityReserves != null ? currentWCTabularUpdate.beginningIndemnityReserves : null;
        currentWCTabularUpdate.beginningExpenseReserves = currentWCTabularUpdate.beginningExpenseReserves != null ? currentWCTabularUpdate.beginningExpenseReserves : null;
        currentWCTabularUpdate.beginningACR = currentWCTabularUpdate.beginningACR != null ? currentWCTabularUpdate.beginningACR : null;
        currentWCTabularUpdate.beginningAER = currentWCTabularUpdate.beginningAER != null ? currentWCTabularUpdate.beginningAER : null;
    }
    if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.FSRI) {
        currentWCTabularUpdate.beginningIndemnityPaid = currentWCTabularUpdate.beginningIndemnityPaid != null ? currentWCTabularUpdate.beginningIndemnityPaid : fsriFinancialDB2?.paidLoss;
        currentWCTabularUpdate.beginningExpensePaid = currentWCTabularUpdate.beginningExpensePaid != null ? currentWCTabularUpdate.beginningExpensePaid : fsriFinancialDB2?.paidExpense;
        currentWCTabularUpdate.beginningIndemnityReserves = currentWCTabularUpdate.beginningIndemnityReserves != null ? currentWCTabularUpdate.beginningIndemnityReserves : fsriFinancialDB2?.lossReserve;
        currentWCTabularUpdate.beginningExpenseReserves = currentWCTabularUpdate.beginningExpenseReserves != null ? currentWCTabularUpdate.beginningExpenseReserves : fsriFinancialDB2?.expenseReserve;
        currentWCTabularUpdate.beginningACR = currentWCTabularUpdate.beginningACR != null ? currentWCTabularUpdate.beginningACR : fsriFinancialDB2?.additionalLossRes;
        currentWCTabularUpdate.beginningAER = currentWCTabularUpdate.beginningAER != null ? currentWCTabularUpdate.beginningAER : fsriFinancialDB2?.additionalExpenseRes;

    };
    if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.CONFER) {

        currentWCTabularUpdate.beginningIndemnityPaid = currentWCTabularUpdate.beginningIndemnityPaid != null ? currentWCTabularUpdate.beginningIndemnityPaid : conferFinancialDB2?.totalPaidLoss;
        currentWCTabularUpdate.beginningExpensePaid = currentWCTabularUpdate.beginningIndemnityReserves != null ? currentWCTabularUpdate.beginningIndemnityReserves : conferFinancialDB2?.totalPaidExpense;
        currentWCTabularUpdate.beginningIndemnityReserves = currentWCTabularUpdate.beginningExpensePaid != null ? currentWCTabularUpdate.beginningExpensePaid : conferFinancialDB2?.totalLossReserve;
        currentWCTabularUpdate.beginningExpenseReserves = currentWCTabularUpdate.beginningExpenseReserves != null ? currentWCTabularUpdate.beginningExpenseReserves : conferFinancialDB2?.totalExpenseReserve;
        currentWCTabularUpdate.beginningACR = currentWCTabularUpdate.beginningACR != null ? currentWCTabularUpdate.beginningACR : conferFinancialDB2?.totalACR;
        currentWCTabularUpdate.beginningAER = currentWCTabularUpdate.beginningAER != null ? currentWCTabularUpdate.beginningAER : conferFinancialDB2?.totalAER;

    };
    return (
        <Panel>
            <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>{currentClaimActivity.accountingTransTypeText}</span></PanelHeader>
            <PanelContent>

                <ClaimActivityStatusInfoSection claim={claim} request={request} dispatch={dispatch} />


                {(request.claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.claimType === CLAIM_TYPES.WORKERS_COMP) && <>
                    <ContentRow>
                        <ContentCell width="33%">
                            <DatePicker
                                disabled={isViewer}
                                id="companyFinancialDate"
                                name="companyFinancialDate"
                                label="Company Financials as of date"
                                fullWidth={true}
                                value={currentWCTabularUpdate?.companyFinancialDate}
                                onBlur={onDateChanged}
                                onChange={onDateChanged}
                                tooltip={findHelpTextByTag("companyFinancialDate", metadata.helpTags)}
                                {...register("companyFinancialDate",
                                    {
                                        required: "This is required.",
                                        onChange: onDateChanged
                                    }
                                )
                                }
                                error={errors.companyFinancialDate}
                                helperText={errors.companyFinancialDate ? errors.companyFinancialDate.message : ""}
                                variant="outlined"
                                disableFuture={true}
                                error={errors.companyFinancialDate}
                                helperText={errors.companyFinancialDate ? errors.companyFinancialDate.message : ""}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentCell width="66%" style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <span style={{ fontWeight: 'bold'}}>Company Financials</span>
                    </ContentCell>
                    <ContentRow>
                        <ContentCell width="33%">
                            <CurrencyInput
                                disabled={isViewer}
                                label="Indemnity Paid"
                                id="companyIndemnityPaid"
                                name="companyIndemnityPaid"
                                value={currentWCTabularUpdate.companyIndemnityPaid}
                                tooltip={findHelpTextByTag("companyIndemnityPaid", metadata.helpTags)}
                                {...register("companyIndemnityPaid",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged
                                    }
                                )
                                }
                                error={errors.companyIndemnityPaid}
                                inputProps={{ maxlength: 15 }}
                                helperText={errors.companyIndemnityPaid ? errors.companyIndemnityPaid.message : ""}
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <CurrencyInput
                                disabled={isViewer}
                                label="Indemnity Reserves"
                                id="companyIndemnityReserves"
                                name="companyIndemnityReserves"
                                value={currentWCTabularUpdate.companyIndemnityReserves}
                                tooltip={findHelpTextByTag("companyIndemnityReserves", metadata.helpTags)}
                                {...register("companyIndemnityReserves",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged
                                    }
                                )
                                }
                                error={errors.companyIndemnityReserves}
                                inputProps={{ maxlength: 15 }}
                                helperText={errors.companyIndemnityReserves ? errors.companyIndemnityReserves.message : ""}
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="33%">
                            <CurrencyInput
                                disabled={isViewer}
                                label="Medical Paid"
                                id="companyMedicalPaid"
                                name="companyMedicalPaid"
                                value={currentWCTabularUpdate.companyMedicalPaid}
                                tooltip={findHelpTextByTag("companyMedicalPaid", metadata.helpTags)}
                                {...register("companyMedicalPaid",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged
                                    }
                                )
                                }
                                error={errors.companyMedicalPaid}
                                inputProps={{ maxlength: 15 }}
                                helperText={errors.companyMedicalPaid ? errors.companyMedicalPaid.message : ""}
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <CurrencyInput
                                disabled={isViewer}
                                label="Medical Reserves"
                                id="companyMedicalReserves"
                                name="companyMedicalReserves"
                                value={currentWCTabularUpdate.companyMedicalReserves}
                                tooltip={findHelpTextByTag("companyMedicalReserves", metadata.helpTags)}
                                {...register("companyMedicalReserves",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged
                                    }
                                )
                                }
                                error={errors.companyMedicalReserves}
                                inputProps={{ maxlength: 15 }}
                                helperText={errors.companyMedicalReserves ? errors.companyMedicalReserves.message : ""}
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="33%">
                            <CurrencyInput
                                disabled={isViewer}
                                label="Expense Paid"
                                id="companyExpensePaid"
                                name="companyExpensePaid"
                                tooltip={findHelpTextByTag("companyExpensePaid", metadata.helpTags)}
                                {...register("companyExpensePaid",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged

                                    }
                                )
                                }
                                value={currentWCTabularUpdate.companyExpensePaid}
                                error={errors.companyExpensePaid}
                                inputProps={{ maxlength: 15 }}
                                helperText={errors.companyExpensePaid ? errors.companyExpensePaid.message : ""}
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <CurrencyInput
                                disabled={isViewer}
                                label="Expense Reserves"
                                id="companyExpenseReserves"
                                name="companyExpenseReserves"
                                tooltip={findHelpTextByTag("companyExpenseReserves", metadata.helpTags)}
                                {...register("companyExpenseReserves",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged

                                    }
                                )
                                }
                                value={currentWCTabularUpdate.companyExpenseReserves}
                                error={errors.companyExpenseReserves}
                                inputProps={{ maxlength: 15 }}
                                helperText={errors.companyExpenseReserves ? errors.companyExpenseReserves.message : ""}
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="33%">
                            <CurrencyInput
                                disabled={isViewer}
                                label="Subro/SIF"
                                id="companySubroSIF"
                                name="companySubroSIF"
                                tooltip={findHelpTextByTag("companySubroSIF", metadata.helpTags)}
                                {...register("companySubroSIF",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged

                                    }
                                )
                                }
                                value={currentWCTabularUpdate.companySubroSIF}
                                error={errors.companySubroSIF}
                                inputProps={{ maxlength: 15 }}
                                helperText={errors.companySubroSIF ? errors.companySubroSIF.message : ""}
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="100%">
                            <TextInput
                                label="General Comments/Instructions"
                                disabled={isViewer}
                                id="comments1"
                                name="comments1"
                                fullWidth={true}
                                multiline
                                rows={3}
                                variant="outlined"
                                value={currentWCTabularUpdate.comments}
                                tooltip={findHelpTextByTag("comments1", metadata.helpTags)}
                                {...register("comments1",
                                    {
                                        onChange: onValueChanged
                                    }
                                )
                                }
                                error={errors.comments1}
                                helperText={errors.comments1 ? errors.comments1.message : ""}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="100%">
                            <TextInput
                                label="Link to Cara docs"
                                disabled={isViewer}
                                id="caraDocs"
                                name="caraDocs"
                                fullWidth={true}
                                variant="outlined"
                                value={currentWCTabularUpdate.caraDocs}
                                tooltip={findHelpTextByTag("caraDocs", metadata.helpTags)}
                                {...register("caraDocs",
                                    {
                                        onChange: onValueChanged
                                    }
                                )
                                }
                                error={errors.caraDocs}
                                helperText={errors.caraDocs ? errors.caraDocs.message : ""}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentCell width="100%">
                        <span>**Ceded Financial (Updated) is to be input by Claims Accounting after the transaction has been processed in the statutory system</span>
                    </ContentCell>
                    <ContentRow>
                        <ContentCell width="50%" style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <span style={{ fontWeight: 'bold' }}>Ceded Financials (Prior)</span>
                        </ContentCell>
                        <ContentCell width="50%" style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <span style={{ fontWeight: 'bold' }}>Ceded Financials (Updated)</span>
                        </ContentCell>

                    </ContentRow>

                    <ContentRow>
                        <ContentCell width="25%">
                            <CurrencyInput
                                label="Indemnity Paid"
                                id="beginningIndemnityPaid"
                                name="beginningIndemnityPaid"
                                disabled={isViewer}
                                tooltip={findHelpTextByTag("beginningIndemnityPaid", metadata.helpTags)}
                                {...register("beginningIndemnityPaid",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged

                                    }
                                )
                                }
                                error={errors.beginningIndemnityPaid}
                                helperText={errors.beginningIndemnityPaid ? errors.beginningIndemnityPaid.message : ""}
                                onBlur={convertFloatStringToFloat}
                                InputProps={claim.claimType === CLAIM_TYPES.WORKERS_COMP && claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.NAT_RE ? { readOnly: false, maxlength: 13  } : { readOnly: true }}
                                value={currentWCTabularUpdate.beginningIndemnityPaid}
                                allowDecimal={true}
                            />
                        </ContentCell>
                        <ContentCell width="25%">
                            <CurrencyInput
                                label="Indemnity Reserves"
                                id="beginningIndemnityReserves"
                                name="beginningIndemnityReserves"
                                disabled={isViewer}
                                tooltip={findHelpTextByTag("beginningIndemnityReserves", metadata.helpTags)}
                                {...register("beginningIndemnityReserves",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged

                                    }
                                )
                                }
                                error={errors.beginningIndemnityReserves}
                                helperText={errors.beginningIndemnityReserves ? errors.beginningIndemnityReserves.message : ""}
                                onBlur={convertFloatStringToFloat}
                                InputProps={claim.claimType === CLAIM_TYPES.WORKERS_COMP && claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.NAT_RE ? { readOnly: false, maxlength: 13  } : { readOnly: true }}
                                value={currentWCTabularUpdate.beginningIndemnityReserves}
                                allowDecimal={true}
                            />
                        </ContentCell>
                        <ContentCell width="25%"></ContentCell>
                        <ContentCell width="25%">
                            <CurrencyInput
                                disabled={isViewer}
                                label="Indemnity Reserves"
                                id="cededIndemnityReserves"
                                name="cededIndemnityReserves"
                                tooltip={findHelpTextByTag("cededIndemnityReserves", metadata.helpTags)}
                                {...register("cededIndemnityReserves",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged

                                    }
                                )
                                }
                                value={currentWCTabularUpdate.cededIndemnityReserves}
                                error={errors.cededIndemnityReserves}
                                inputProps={{ maxlength: 15 }}
                                helperText={errors.cededIndemnityReserves ? errors.cededIndemnityReserves.message : ""}
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="25%">
                            <CurrencyInput
                                label="Expense Paid"
                                id="beginningExpensePaid"
                                name="beginningExpensePaid"
                                disabled={isViewer}
                                tooltip={findHelpTextByTag("beginningExpensePaid", metadata.helpTags)}
                                {...register("beginningExpensePaid",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged

                                    }
                                )
                                }
                                error={errors.beginningExpensePaid}
                                helperText={errors.beginningExpensePaid ? errors.beginningExpensePaid.message : ""}
                                onBlur={convertFloatStringToFloat}
                                InputProps={claim.claimType === CLAIM_TYPES.WORKERS_COMP && claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.NAT_RE ? { readOnly: false, maxlength: 13  } : { readOnly: true }}
                                value={currentWCTabularUpdate.beginningExpensePaid}
                                allowDecimal={true}
                            />
                        </ContentCell>
                        <ContentCell width="25%">
                            <CurrencyInput
                                label="Expense Reserves"
                                id="beginningExpenseReserves"
                                name="beginningExpenseReserves"
                                disabled={isViewer}
                                tooltip={findHelpTextByTag("beginningExpenseReserves", metadata.helpTags)}
                                {...register("beginningExpenseReserves",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged

                                    }
                                )
                                }
                                error={errors.beginningExpenseReserves}
                                helperText={errors.beginningExpenseReserves ? errors.beginningExpenseReserves.message : ""}
                                onBlur={convertFloatStringToFloat}
                                InputProps={claim.claimType === CLAIM_TYPES.WORKERS_COMP && claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.NAT_RE ? { readOnly: false, maxlength: 13  } : {readOnly: true }}
                                value={currentWCTabularUpdate.beginningExpenseReserves}
                                allowDecimal={true}
                            />
                        </ContentCell>
                        <ContentCell width="25%"></ContentCell>
                        <ContentCell width="25%">
                            <CurrencyInput
                                disabled={isViewer}
                                label="Expense Reserves"
                                id="cededExpenseReserves"
                                name="cededExpenseReserves"
                                tooltip={findHelpTextByTag("cededExpenseReserves", metadata.helpTags)}
                                {...register("cededExpenseReserves",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged

                                    }
                                )
                                }
                                value={currentWCTabularUpdate.cededExpenseReserves}
                                error={errors.cededExpenseReserves}
                                inputProps={{ maxlength: 15 }}
                                helperText={errors.aer ? errors.cededExpenseReserves.message : ""}
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="25%"></ContentCell>
                        <ContentCell width="25%">
                            <CurrencyInput
                                label="ACR"
                                id="beginningACR"
                                name="beginningACR"
                                disabled={isViewer}
                                tooltip={findHelpTextByTag("beginningACR", metadata.helpTags)}
                                {...register("beginningACR",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged

                                    }
                                )
                                }
                                error={errors.beginningACR}
                                helperText={errors.beginningACR ? errors.beginningACR.message : ""}
                                onBlur={convertFloatStringToFloat}
                                InputProps={claim.claimType === CLAIM_TYPES.WORKERS_COMP && claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.NAT_RE ? { readOnly: false, maxlength: 13  } : { readOnly: true }}
                                value={currentWCTabularUpdate.beginningACR}
                                allowDecimal={true}                                
                            />
                        </ContentCell>
                        <ContentCell width="25%"></ContentCell>                        
                        <ContentCell width="25%">
                            <CurrencyInput
                                disabled={isViewer}
                                label="ACR"
                                id="cededACR"
                                name="cededACR"
                                tooltip={findHelpTextByTag("cededACR", metadata.helpTags)}
                                {...register("cededACR",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged

                                    }
                                )
                                }
                                value={currentWCTabularUpdate.cededACR}
                                error={errors.cededACR}
                                inputProps={{ maxlength: 15 }}
                                helperText={errors.cededACR ? errors.cededACR.message : ""}
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                            />
                        </ContentCell>                        
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="25%"></ContentCell>
                        <ContentCell width="25%">
                            <CurrencyInput
                                label="AER"
                                id="beginningAER"
                                name="beginningAER"
                                disabled={isViewer}
                                tooltip={findHelpTextByTag("beginningAER", metadata.helpTags)}
                                {...register("beginningAER",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged

                                    }
                                )
                                }
                                error={errors.beginningAER}
                                helperText={errors.beginningAER ? errors.beginningAER.message : ""}
                                onBlur={convertFloatStringToFloat}
                                InputProps={claim.claimType === CLAIM_TYPES.WORKERS_COMP && claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.NAT_RE ? { readOnly: false, maxlength: 13  } : { readOnly: true }}
                                value={currentWCTabularUpdate.beginningAER}
                                allowDecimal={true}
                            />
                        </ContentCell>
                        <ContentCell width="25%"></ContentCell>
                        <ContentCell width="25%">
                        <CurrencyInput
                            disabled={isViewer}
                            label="AER"
                            id="cededAER"
                            name="cededAER"
                            tooltip={findHelpTextByTag("cededAER", metadata.helpTags)}
                            {...register("cededAER",
                                {
                                    required: "This is required.",
                                    onChange: onCurrencyChanged

                                }
                            )
                            }
                            value={currentWCTabularUpdate.cededAER}
                            error={errors.cededAER}
                            inputProps={{ maxlength: 15 }}
                            helperText={errors.cededAER ? errors.cededAER.message : ""}
                            allowDecimal={true}
                            onBlur={convertFloatStringToFloat}
                        />
                    </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="75%"></ContentCell>
                        <ContentCell width="25%">
                            <CurrencyInput
                                disabled={isViewer}
                                label="Total Incured Change Amount"
                                id="totalIncuredChangeAmount"
                                name="totalIncuredChangeAmount"
                                allowNegative= {true}
                                tooltip={findHelpTextByTag("totalIncuredChangeAmount", metadata.helpTags)}
                                {...register("totalIncuredChangeAmount",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged

                                    }
                                )
                                }
                                value={currentWCTabularUpdate.totalIncuredChangeAmount}
                                error={errors.totalIncuredChangeAmount}
                                inputProps={{ maxlength: 15 }}
                                helperText={errors.aer ? errors.totalIncuredChangeAmount.message : ""}
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                            />
                        </ContentCell>
                    </ContentRow>
                </>
                }
            </PanelContent>
        </Panel>
    );
};
