
import { Divider, MenuItem } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { APP_TYPES } from '../../../../../Core/Enumerations/app/app-types';
import { CurrencyInput, DatePicker, Panel, PanelContent, PanelHeader, SelectList, TextInput } from '../../../../../Core/Forms/Common';
import { OpenLineBobCoverageSelectors } from '../../../../../Core/State/slices/metadata/openLineBobCoverage';
import { causeOfLossCodeSelectors } from '../../../../../Core/State/slices/metadata/causeOfLossCodes';
import { userSelectors } from '../../../../../Core/State/slices/user';
import { usersSelectors } from '../../../../../Core/State/slices/users';
import { findHelpTextByTag, loadHelpTags } from '../../../../Help/Queries';
import { ApproverSection } from '../ApproverSection';
import { ClaimActivityStatusInfoSection } from '../ClaimActivityStatusInfoSection';
import {
    OpenClaimActivityClaimants
} from './OpenClaimActivityClaimants';
import {
    OpenClaimActivityCoverages
} from './OpenClaimActivityCoverages';
import {
    ULClaimsSelectors
} from "../../../../../Core/State/slices/ULClaims";
import { CLAIM_TYPES } from '../../../../../Core/Enumerations/app/claim-type';
import { LEGAL_ENTITY } from '../../../../../Core/Enumerations/app/legal-entity';
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

export const OpenClaimActivityInfoSection = ({ claim, request, dispatch, formValidator, onSave }) => {
    const $auth = useSelector(userSelectors.selectAuthContext());
    //const $dispatch = useDispatch();

    const currentUser = $auth.currentUser;
    const supervisors = useSelector(usersSelectors.getSupervisors());
    const causeOfLossCodes = useSelector(causeOfLossCodeSelectors.selectData());

    const isLegalClaim = claim.claimType === CLAIM_TYPES.LEGAL;
    const ulClaims = useSelector(ULClaimsSelectors.selectData());
    const primaryULClaim = (ulClaims || []).length > 0 ? ulClaims[0] : {};

    let isViewer = $auth.isReadOnly(APP_TYPES.Financials);
    if (!isViewer && request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.SUBMITTED_TO_ACCOUNTANT_AUTHORITY_CHECK && request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.OPEN && claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.claimType !== CLAIM_TYPES.LEGAL) {
        isViewer = false;
    }
    else if (!isViewer && request.currentClaimActivity.activityID && request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.OUTSTANDING_ISSUE) {
        isViewer = false;
    } else if (!isViewer && !request.currentClaimActivity.activityID) {
        isViewer = false;
    } else {
        isViewer = true;
    }

    const currentClaimActivity = request.currentClaimActivity || {};

    const currentOpenRegistrations = currentClaimActivity.openRegistrations || (currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.OPEN_CLOSE_PENDING ? { examinerDiaryDate: (new Date()).toDateString() } : {});
    const openLineBobCoverages = useSelector(OpenLineBobCoverageSelectors.selectData()) || [];
    const { register, formState: { errors }, setValue } = formValidator;

    setValue("causeOfLossCode", currentOpenRegistrations.causeOfLossCode);
    setValue("typeOfLoss", currentOpenRegistrations.typeOfLoss);
    setValue("lossReserveTotal", currentOpenRegistrations.lossReserveTotal);
    setValue("expenseReserveTotal", currentOpenRegistrations.expenseReserveTotal);
    setValue("medPayReserveTotal", currentOpenRegistrations.medPayReserveTotal);

    setValue("injuriesOrDamages", currentOpenRegistrations.injuriesOrDamages);
    setValue("descriptionOfOccurence", currentOpenRegistrations.descriptionOfOccurence);
    setValue("supervisorUserID", currentOpenRegistrations.supervisorUserID);
    setValue("examinerDiaryDate", currentOpenRegistrations.examinerDiaryDate);

    setValue("cededPaidLoss", currentOpenRegistrations.cededPaidLoss);
    setValue("cededLossReserves", currentOpenRegistrations.cededLossReserves);
    setValue("cededPaidExpense", currentOpenRegistrations.cededPaidExpense);
    setValue("cededExpenseReserve", currentOpenRegistrations.cededExpenseReserve);

    setValue("companyPaidLoss", currentOpenRegistrations.companyPaidLoss);
    setValue("companyLossReserves", currentOpenRegistrations.companyLossReserves);
    setValue("companyPaidExpense", currentOpenRegistrations.companyPaidExpense);
    setValue("companyExpenseReserve", currentOpenRegistrations.companyExpenseReserve);

    setValue("acr", currentOpenRegistrations.acr);
    setValue("aer", currentOpenRegistrations.aer);
    setValue("boBCoverageID", request.claim.kindOfBusinessID);    
    setValue("comments", currentOpenRegistrations.comments);


    const [metadata, setMetadata] = React.useState({
        loading: true,
        helpTags: [],
    });

    const onValueChanged = (evt) => {
        currentOpenRegistrations[evt.target.name] = evt.target.value.trimStart();
        currentClaimActivity.openRegistrations = currentOpenRegistrations;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentClaimActivity: currentClaimActivity } });
    };
    const onDateChanged = (evt) => {
        currentOpenRegistrations[evt.target.name] = evt.target.value;
        currentClaimActivity.openRegistrations = currentOpenRegistrations;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentClaimActivity: currentClaimActivity } });
    };
    const onDropDownChanged = (evt) => {
        if (evt.target.name === "boBCoverageID") {
            let nClaim = JSON.parse(JSON.stringify(claim));
            nClaim.kindOfBusinessID = evt.target.value;
            request.claim = nClaim;

        }
        else {
            currentOpenRegistrations[evt.target.name] = evt.target.value;
            currentClaimActivity.openRegistrations = currentOpenRegistrations;
        }

        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentClaimActivity: currentClaimActivity } });
    };
    const onCurrencyChanged = (evt) => {
        currentOpenRegistrations[evt.target.name] = evt.target.value;
        currentClaimActivity.openRegistrations = currentOpenRegistrations;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentClaimActivity: currentClaimActivity } });
    };
    const convertFloatStringToFloat = (evt) => {
        let val = evt.target.value;
        val = val.replace("$", "");
        val = val.replaceAll(",", "");
        currentOpenRegistrations[evt.target.name] = !isNaN(parseFloat(val)) ? parseFloat(val) : val;
        currentClaimActivity.openRegistrations = currentOpenRegistrations;
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


                {(request.claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.claimType !== CLAIM_TYPES.LEGAL) && <>
                    <ContentRow>
                        <ContentCell width="33%">
                            <CurrencyInput
                                disabled={isViewer}
                                label="Company Paid Loss"
                                id="companyPaidLoss"
                                name="companyPaidLoss"
                                required
                                value={currentOpenRegistrations.companyPaidLoss}
                                tooltip={findHelpTextByTag("companyPaidLoss", metadata.helpTags)}
                                {...register("companyPaidLoss",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged
                                    }
                                )
                                }
                                error={errors.companyPaidLoss}
                                inputProps={{ maxlength: 15 }}
                                helperText={errors.companyPaidLoss ? errors.companyPaidLoss.message : ""}
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <CurrencyInput
                                disabled={isViewer}
                                label="Company Loss Reserves"
                                id="companyLossReserves"
                                name="companyLossReserves"
                                required
                                value={currentOpenRegistrations.companyLossReserves}
                                tooltip={findHelpTextByTag("companyLossReserves", metadata.helpTags)}
                                {...register("companyLossReserves",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged
                                    }
                                )
                                }
                                error={errors.companyLossReserves}
                                inputProps={{ maxlength: 15 }}
                                helperText={errors.companyLossReserves ? errors.companyLossReserves.message : ""}
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="33%">
                            <CurrencyInput
                                disabled={isViewer}
                                label="Company Paid Expense"
                                id="companyPaidExpense"
                                name="companyPaidExpense"
                                required
                                value={currentOpenRegistrations.companyPaidExpense}
                                tooltip={findHelpTextByTag("companyPaidExpense", metadata.helpTags)}
                                {...register("companyPaidExpense",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged
                                    }
                                )
                                }
                                error={errors.companyPaidExpense}
                                inputProps={{ maxlength: 15 }}
                                helperText={errors.companyPaidExpense ? errors.companyPaidExpense.message : ""}
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <CurrencyInput
                                disabled={isViewer}
                                label="Company Expense Reserves"
                                id="companyExpenseReserve"
                                name="companyExpenseReserve"
                                required
                                value={currentOpenRegistrations.companyExpenseReserve}
                                tooltip={findHelpTextByTag("companyExpenseReserve", metadata.helpTags)}
                                {...register("companyExpenseReserve",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged
                                    }
                                )
                                }
                                error={errors.companyExpenseReserve}
                                inputProps={{ maxlength: 15 }}
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
                                label="Ceded Paid Loss"
                                id="cededPaidLoss"
                                name="cededPaidLoss"
                                tooltip={findHelpTextByTag("cededPaidLoss", metadata.helpTags)}
                                {...register("cededPaidLoss",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged

                                    }
                                )
                                }
                                value={currentOpenRegistrations.cededPaidLoss}
                                error={errors.cededPaidLoss}
                                inputProps={{ maxlength: 15 }}
                                helperText={errors.cededPaidLoss ? errors.cededPaidLoss.message : ""}
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <CurrencyInput
                                disabled={isViewer}
                                label="Ceded Loss Reserves"
                                id="cededLossReserves"
                                name="cededLossReserves"
                                tooltip={findHelpTextByTag("cededLossReserves", metadata.helpTags)}
                                {...register("cededLossReserves",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged

                                    }
                                )
                                }
                                value={currentOpenRegistrations.cededLossReserves}
                                error={errors.cededLossReserves}
                                inputProps={{ maxlength: 15 }}
                                helperText={errors.cededLossReserves ? errors.cededLossReserves.message : ""}
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="33%">
                            <CurrencyInput
                                disabled={isViewer}
                                label="Ceded Paid Expense"
                                id="cededPaidExpense"
                                name="cededPaidExpense"
                                tooltip={findHelpTextByTag("cededPaidExpense", metadata.helpTags)}
                                {...register("cededPaidExpense",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged

                                    }
                                )
                                }
                                value={currentOpenRegistrations.cededPaidExpense}
                                error={errors.cededPaidExpense}
                                inputProps={{ maxlength: 15 }}
                                helperText={errors.cededPaidExpense ? errors.cededPaidExpense.message : ""}
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <CurrencyInput
                                disabled={isViewer}
                                label="Ceded Expense Reserves"
                                id="cededExpenseReserve"
                                name="cededExpenseReserve"
                                tooltip={findHelpTextByTag("cededExpenseReserve", metadata.helpTags)}
                                {...register("cededExpenseReserve",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged

                                    }
                                )
                                }
                                value={currentOpenRegistrations.cededExpenseReserve}
                                error={errors.cededExpenseReserve}
                                inputProps={{ maxlength: 15 }}
                                helperText={errors.cededExpenseReserve ? errors.cededExpenseReserve.message : ""}
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="33%">
                            <CurrencyInput
                                disabled={isViewer}
                                label="ACR"
                                id="acr"
                                name="acr"
                                tooltip={findHelpTextByTag("acr", metadata.helpTags)}
                                {...register("acr",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged

                                    }
                                )
                                }
                                value={currentOpenRegistrations.acr}
                                error={errors.acr}
                                inputProps={{ maxlength: 15 }}
                                helperText={errors.acr ? errors.acr.message : ""}
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <CurrencyInput
                                disabled={isViewer}
                                label="AER"
                                id="aer"
                                name="aer"
                                tooltip={findHelpTextByTag("aer", metadata.helpTags)}
                                {...register("aer",
                                    {
                                        required: "This is required.",
                                        onChange: onCurrencyChanged

                                    }
                                )
                                }
                                value={currentOpenRegistrations.aer}
                                error={errors.aer}
                                inputProps={{ maxlength: 15 }}
                                helperText={errors.aer ? errors.aer.message : ""}
                                allowDecimal={true}
                                onBlur={convertFloatStringToFloat}
                            />
                        </ContentCell>
                    </ContentRow>
                </>
                }
                {(request.claim.g2LegalEntityID !== LEGAL_ENTITY.GENESIS_REINSURANCE || claim.claimType === CLAIM_TYPES.LEGAL) && <>
                    <ContentRow>
                        <ContentCell width="33%">
                            <SelectList
                                disabled={isViewer}
                                id="causeOfLossCode"
                                name="causeOfLossCode"
                                label="Cause of Loss Code"
                                required
                                fullWidth={true}
                                variant="outlined"
                                value={currentOpenRegistrations.causeOfLossCode || ""}
                                tooltip={findHelpTextByTag("causeOfLossCode", metadata.helpTags)}
                                {...register("causeOfLossCode",
                                    {
                                        required: "This is required.",
                                        onChange: onDropDownChanged
                                    }
                                )
                                }
                                error={errors.causeOfLossCode}
                                helperText={errors.causeOfLossCode ? errors.causeOfLossCode.message : ""}
                            >
                                {
                                    [...causeOfLossCodes].sort((a,b) => a.description > b.description ? 1 : -1)
                                        .map((item, idx) => <MenuItem value={item.code} key={item.code}>{item.description}</MenuItem>)
                                }
                            </SelectList>
                        </ContentCell>
                        <ContentCell width="33%">
                            <SelectList
                                disabled={isViewer}
                                id="typeOfLoss"
                                name="typeOfLoss"
                                label="Type of Loss Code"
                                required
                                fullWidth={true}
                                variant="outlined"
                                value={currentOpenRegistrations.typeOfLoss || ""}
                                tooltip={findHelpTextByTag("typeOfLoss", metadata.helpTags)}
                                {...register("typeOfLoss",
                                    {
                                        required: "This is required.",
                                        onChange: onDropDownChanged
                                    }
                                )
                                }
                                error={errors.typeOfLoss}
                                helperText={errors.typeOfLoss ? errors.typeOfLoss.message : ""}
                            >
                                <MenuItem value="BI">BI</MenuItem>
                                <MenuItem value="PD">PD</MenuItem>
                                <MenuItem value="Med Pay">Med Pay</MenuItem>
                            </SelectList>
                        </ContentCell>
                        <ContentCell width="33%">
                            {isLegalClaim && request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.OPEN &&
                                <TextInput
                                    label="U/L Claim ID"
                                    disabled={isViewer}
                                    id="claimID"
                                    name="claimID"
                                    fullWidth={true}
                                    variant="outlined"
                                    value={primaryULClaim.claimID}
                                    inputProps={{ readOnly: true }}
                                    tooltip={findHelpTextByTag("claimID", metadata.helpTags)}
                                />
                            }
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="33%">
                            <TextInput
                                label="Cat Code"
                                disabled={isViewer}
                                id="cATCode"
                                name="cATCode"
                                fullWidth={true}
                                variant="outlined"
                                onChange={onValueChanged}
                                value={currentOpenRegistrations.cATCode}
                                tooltip={findHelpTextByTag("cATCode", metadata.helpTags)}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <TextInput
                                label="Injuries or Damages"
                                disabled={isViewer}
                                id="injuriesOrDamages"
                                name="injuriesOrDamages"
                                required
                                fullWidth={true}
                                variant="outlined"
                                value={currentOpenRegistrations.injuriesOrDamages}
                                tooltip={findHelpTextByTag("injuriesOrDamages", metadata.helpTags)}
                                {...register("injuriesOrDamages",
                                    {
                                        required: "This is required.",
                                        pattern: {
                                            value: /^[a-zA-Z ,]*$/i,
                                            message: "Must contain characters only"
                                        },
                                        onChange: onValueChanged
                                    }
                                )
                                }
                                error={errors.injuriesOrDamages}
                                helperText={errors.injuriesOrDamages ? errors.injuriesOrDamages.message : ""}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <TextInput
                                label="Description Or Occurence"
                                disabled={isViewer}
                                id="descriptionOfOccurence"
                                name="descriptionOfOccurence"
                                required
                                fullWidth={true}
                                variant="outlined"
                                value={currentOpenRegistrations.descriptionOfOccurence}
                                tooltip={findHelpTextByTag("descriptionOfOccurence", metadata.helpTags)}
                                {...register("descriptionOfOccurence",
                                    {
                                        required: "This is required.",
                                        pattern: {
                                            value: /^[a-zA-Z ,]*$/i,
                                            message: "Must contain characters only"
                                        },
                                        onChange: onValueChanged
                                    }
                                )
                                }

                                error={errors.descriptionOfOccurence}
                                helperText={errors.descriptionOfOccurence ? errors.descriptionOfOccurence.message : ""}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        {request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.OPEN &&
                            <ContentCell width="33%">
                                <CurrencyInput
                                    disabled={isViewer}
                                    id="lossReserveTotal"
                                    name="lossReserveTotal"
                                    required
                                    label="Loss Reserve"
                                    value={currentOpenRegistrations.lossReserveTotal}
                                    tooltip={findHelpTextByTag("lossReserveTotal", metadata.helpTags)}
                                    {...register("lossReserveTotal",
                                        {
                                            required: "This is required.",
                                            onChange: onCurrencyChanged

                                        }
                                    )
                                    }
                                    error={errors.lossReserveTotal}
                                    inputProps={{ maxlength: 15 }}
                                    helperText={errors.lossReserveTotal ? errors.lossReserveTotal.message : ""}
                                    allowDecimal={true}
                                    onBlur={convertFloatStringToFloat}

                                />
                            </ContentCell>
                        }
                        {request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.OPEN &&
                            <ContentCell width="33%">
                                <CurrencyInput
                                    disabled={isViewer}
                                    label="Expense Reserve"
                                    id="expenseReserveTotal"
                                    name="expenseReserveTotal"
                                    required
                                    value={currentOpenRegistrations.expenseReserveTotal}
                                    tooltip={findHelpTextByTag("expenseReserveTotal", metadata.helpTags)}
                                    {...register("expenseReserveTotal",
                                        {
                                            required: "This is required.",
                                            onChange: onCurrencyChanged
                                        }
                                    )
                                    }
                                    error={errors.expenseReserveTotal}
                                    inputProps={{ maxlength: 15 }}
                                    helperText={errors.expenseReserveTotal ? errors.expenseReserveTotal.message : ""}
                                    allowDecimal={true}
                                    onBlur={convertFloatStringToFloat}
                                />
                            </ContentCell>
                        }
                        {request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.OPEN && request.claim.claimType !== CLAIM_TYPES.PROPERTY && claim.g2LegalEntityID !== LEGAL_ENTITY.GENESIS_INSURANCE &&
                            <ContentCell width="33%">
                                <CurrencyInput
                                    label="Med Pay Reserve"
                                    disabled={isViewer}
                                    id="medPayReserveTotal"
                                    name="medPayReserveTotal"
                                    required
                                    value={currentOpenRegistrations.medPayReserveTotal}
                                    tooltip={findHelpTextByTag("medPayReserveTotal", metadata.helpTags)}
                                    {...register("medPayReserveTotal",
                                        {
                                            required: "This is required.",
                                            onChange: onCurrencyChanged
                                        }
                                    )
                                    }
                                    error={errors.medPayReserveTotal}
                                    inputProps={{ maxlength: 15 }}
                                    helperText={errors.medPayReserveTotal ? errors.medPayReserveTotal.message : ""}
                                    allowDecimal={true}
                                    onBlur={convertFloatStringToFloat}
                                />
                            </ContentCell>
                        }
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="33%">
                            <DatePicker
                                disabled={isViewer}
                                id="examinerDiaryDate"
                                name="examinerDiaryDate"
                                label="Examiner Diary Date"
                                fullWidth={true}
                                variant="outlined"
                                required
                                value={currentOpenRegistrations.examinerDiaryDate || null}
                                key={currentOpenRegistrations.examinerDiaryDate || null}
                                tooltip={findHelpTextByTag("examinerDiaryDate", metadata.helpTags)}
                                {...register("examinerDiaryDate",
                                    {
                                        required: "This is required.",
                                        onChange: onDateChanged
                                    }
                                )
                                }
                                error={errors.examinerDiaryDate}
                                helperText={errors.examinerDiaryDate ? errors.examinerDiaryDate.message : ""}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <SelectList
                                disabled={isViewer}
                                id="supervisorUserID"
                                name="supervisorUserID"
                                label="Supervisor"
                                fullWidth={true}
                                variant="outlined"
                                required
                                value={currentOpenRegistrations.supervisorUserID || ""}
                                tooltip={findHelpTextByTag("supervisorUserID", metadata.helpTags)}
                                {...register("supervisorUserID",
                                    {
                                        required: "This is required.",
                                        onChange: onDropDownChanged
                                    }
                                )
                                }
                                error={errors.supervisorUserID}
                                helperText={errors.supervisorUserID ? errors.supervisorUserID.message : ""}
                            >
                                {
                                    supervisors.filter(supp => supp.userID.toLowerCase() !== currentUser.id.toLowerCase())
                                        .map((item, idx) => <MenuItem value={item.userID} key={item.userID}>{item.fullName}</MenuItem>)
                                }
                            </SelectList>
                        </ContentCell>
                        <ContentCell width="33%">
                            <DatePicker
                                disabled={isViewer}
                                id="supervisorDiaryDate"
                                name="supervisorDiaryDate"
                                label="Supervisor Diary Date"
                                fullWidth={true}
                                onChange={onDateChanged}
                                variant="outlined"
                                value={currentOpenRegistrations.supervisorDiaryDate || null}
                                tooltip={findHelpTextByTag("supervisorDiaryDate", metadata.helpTags)}
                                error={errors.supervisorDiaryDate}
                                helperText={errors.supervisorDiaryDate ? errors.supervisorDiaryDate.message : ""}
                            />
                        </ContentCell>
                    </ContentRow>
                    <Divider />
                    {!request.isLegalClaim && request.claim.claimType !== CLAIM_TYPES.PROPERTY &&
                        <>
                            <ContentRow>
                                <ContentCell width="100%">
                                    <OpenClaimActivityClaimants claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} isViewer={isViewer} />
                                </ContentCell>
                            </ContentRow>
                            <Divider />
                        </>
                    }
                    {!request.isLegalClaim && request.claim.g2LegalEntityID === LEGAL_ENTITY.GENERAL_STAR &&
                        <ContentRow>
                            <ContentCell width="100%">
                                Select Coverage
                            </ContentCell>
                        </ContentRow>
                    }
                    {!request.isLegalClaim && request.claim.g2LegalEntityID === LEGAL_ENTITY.GENERAL_STAR &&
                        <ContentRow>
                            <ContentCell width="100%">
                                <OpenClaimActivityCoverages dept={request.claim.policy ? request.claim.policy.departmentCode : ""} policyID={request.claim.claimPolicyID} request={request} dispatch={dispatch} formValidator={formValidator} isViewer={isViewer} />
                            </ContentCell>
                        </ContentRow>
                    }
                </>
                }
                {claim.claimType === CLAIM_TYPES.WORKERS_COMP &&
                    <ContentRow>
                        <ContentCell width="100%">
                            <TextInput
                                label="Comments for Accounting"
                                multiline
                                rows={3}
                                disabled={isViewer}
                                id="comments"
                                name="comments"
                                fullWidth={true}
                                variant="outlined"
                                value={currentOpenRegistrations.comments}
                                tooltip={findHelpTextByTag("comments", metadata.helpTags)}
                                {...register("comments",
                                    {
                                        onBlur: onValueChanged
                                    }
                                )
                                }
                                error={errors.comments}
                                helperText={errors.comments ? errors.comments.message : ""}

                                />
                        </ContentCell>
                    </ContentRow>
                }
                {!(request.claim.g2LegalEntityID === LEGAL_ENTITY.GENERAL_STAR || request.claim.statutorySystem === STATUTORY_SYSTEM.NAT_RE) &&
                    <ContentRow>
                        <ContentCell width="66%">
                        <SelectList
                                disabled={isViewer}
                                id="boBCoverageID"
                                name="boBCoverageID"
                                label="Line"
                                required
                                fullWidth={true}
                                variant="outlined"
                                value={request.claim.kindOfBusinessID}
                                tooltip={findHelpTextByTag("boBCoverageID", metadata.helpTags)}
                                {...register("boBCoverageID",
                                    {
                                        required: "This is required.",
                                        onChange: onDropDownChanged
                                    }
                                )
                                }
                                error={errors.boBCoverageID}
                                helperText={errors.boBCoverageID ? errors.boBCoverageID.message : ""}
                            >
                                {
                                    openLineBobCoverages
                                        .map((item, idx) => request?.claim?.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE ? < MenuItem value={item.boBCoverageID} >
                                            {item.coverage ?
                                                item.coverage :
                                                ""} {!item.triggerDesc ?
                                                    "" :
                                                    `- ${item.triggerDesc}`} {!item.expense  ?
                                                        "" :
                                                        `- ${item.expense}`}
                                            {!item.attachment || isNaN(item.attachment) ?
                                                "" :
                                                `- Attachment $${item.attachment}`} {!item.limit || isNaN(item.limit) ?
                                                    "" :
                                                `- Limit $${item.limit}`}
                                            {!item.grcParticipation || isNaN(item.grcParticipation) ?
                                                        "" :
                                                        `- Participation ${item.grcParticipation}`}</MenuItem> :
                                            <MenuItem value={item.boBCoverageID}>
                                                {item.coverage ? item.coverage : ""}{" "}
                                                {!item.triggerDesc ? "" : `- ${item.triggerDesc}`}{" "}
                                                {!item.expense ? "" : `- ${item.expense}`}{" "}
                                                {!item.classCodeDesc || isNaN(item.classCodeDesc)
                                                    ? ""
                                                    : `- ${item.classCodeDesc}`}
                                                {!item.attachment || isNaN(item.attachment)
                                                    ? ""
                                                    : `- Attachment $${item.attachment}`}{" "}
                                                {!item.limit || isNaN(item.limit) ? "" : `- Limit $${item.limit}`}{" "}
                                                {!item.grcParticipation || isNaN(item.grcParticipation)
                                                    ? ""
                                                    : `- Participation ${item.grcParticipation}`}
                                            </MenuItem>
)
                                }
                            </SelectList>
                        </ContentCell>
                    </ContentRow>
                }
                <ApproverSection claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} />

            </PanelContent>
        </Panel>
    );
};
