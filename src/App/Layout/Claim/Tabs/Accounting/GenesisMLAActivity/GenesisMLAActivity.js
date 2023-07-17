import { Divider, MenuItem } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { APP_TYPES } from '../../../../../Core/Enumerations/app/app-types';
import { CurrencyInput, Panel, PanelContent, PanelHeader, SelectList, TextInput, formatDate } from '../../../../../Core/Forms/Common';
import { userSelectors } from '../../../../../Core/State/slices/user';
import { safeObj, safeStr } from '../../../../../Core/Utility/safeObject';
import { findHelpTextByTag, loadHelpTags } from '../../../../Help/Queries';
import { conferFinancialDB2Selectors, fsriFinancialDB2Selectors } from '../../../../../Core/State/slices/metadata/financial-db2';
import {
    genesisMLALossCodingSelectors
} from '../../../../../Core/State/slices/metadata/genesisMLALossCoding';
import {
    ensureNonNullObject
} from '../../../../../Core/Utility/rules';
import { getRiskStates } from '../../../../../Core/Services/EntityGateway';
import { claimDB2Selectors } from '../../../../../Core/State/slices/metadata/claim-db2';
import { LEGAL_ENTITY } from '../../../../../Core/Enumerations/app/legal-entity';
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

export const GenesisMLAActivityInfoSection = ({ claim, request, dispatch, formValidator, lossExpenseReserve, currentUser }) => {
    const fsriFinancialDB2 = useSelector(fsriFinancialDB2Selectors.selectData());
    const conferFinancialDB2 = useSelector(conferFinancialDB2Selectors.selectData());
    const genesisMLALossCoding = useSelector(genesisMLALossCodingSelectors.selectData());
    let db2Claim = useSelector(claimDB2Selectors.selectData());
    db2Claim = (db2Claim || []).length > 0 ? db2Claim[0] : null;

    const $auth = useSelector(userSelectors.selectAuthContext());
    const isViewer = $auth.isReadOnly(APP_TYPES.Financials) ||
        (request.currentClaimActivity.activityID &&
            ([
                CLAIM_STATUS_TYPE.NEW_PI_2,
                CLAIM_STATUS_TYPE.DRAFT
            ].includes(request.currentClaimActivity.claimStatusTypeID) ||
                (request?.currentClaimActivity?.taskOwner === currentUser?.id && [CLAIM_STATUS_TYPE.PENDING_APPROVAL].includes(request.currentClaimActivity.claimStatusTypeID))) !== true);

    const currentClaimActivity = request.currentClaimActivity || {};
    const currentMLA = currentClaimActivity.genesisMLA || {};

    let newLossExpenseReserve = {};
    if (lossExpenseReserve) {
        newLossExpenseReserve.expenseReserves = !isNaN(parseFloat(lossExpenseReserve.expenseReserves)) ? parseFloat(lossExpenseReserve.expenseReserves) : null;
        newLossExpenseReserve.lossReserves = !isNaN(parseFloat(lossExpenseReserve.lossReserves)) ? parseFloat(lossExpenseReserve.lossReserves) : null;
        currentClaimActivity.genesisMLA.expenseReserves = newLossExpenseReserve;
    }

    currentClaimActivity.genesisMLA.lossCoding = genesisMLALossCoding;
    currentClaimActivity.genesisMLA.claimStatusTypeText = currentClaimActivity.claimStatusTypeType?.statusText;

    if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.FSRI) {
        lossExpenseReserve = fsriFinancialDB2 ? {
            paidLoss: fsriFinancialDB2.paidLoss,
            paidExpense: fsriFinancialDB2.paidExpense,
            lossReserves: fsriFinancialDB2.lossReserve,
            expenseReserves: fsriFinancialDB2.expenseReserve,
            additionalLossRes: fsriFinancialDB2.additionalLossRes,
            additionalExpenseRes: fsriFinancialDB2.additionalExpenseRes
        } : null;
        currentClaimActivity.genesisMLA.claimStatusTypeText = fsriFinancialDB2?.lossStatus;
        currentClaimActivity.genesisMLA.expenseReserves = lossExpenseReserve;
    }
    else if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.CONFER) {
        lossExpenseReserve = conferFinancialDB2 ? {
            paidLoss: conferFinancialDB2.totalPaidLoss,
            paidExpense: conferFinancialDB2.totalPaidExpense,
            lossReserves: conferFinancialDB2.totalLossReserve,
            expenseReserves: conferFinancialDB2.totalExpenseReserve,
            additionalLossRes: conferFinancialDB2.totalACR,
            additionalExpenseRes: conferFinancialDB2.totalAER
        } : null;
        currentClaimActivity.genesisMLA.claimStatusTypeText = conferFinancialDB2?.genReStatutoryDB2FinancialsCollection[0]?.statusCode;
        currentClaimActivity.genesisMLA.expenseReserves = lossExpenseReserve;
    }
    else {
        currentClaimActivity.genesisMLA.claimStatusTypeText = db2Claim?.statusText;
    }
    const { register, formState: { errors }, setValue } = formValidator;
    setValue("uWDivison", currentMLA.uWDivison);
    setValue("injury", currentMLA.injury);
    setValue("reason", currentMLA.reason);

    const [metadata, setMetadata] = React.useState({
        loading: true,
        helpTags: [],
        riskStates: []
    });

    const onValueChanged = (evt) => {
        currentMLA[evt.target.name] = evt.target.value.trimStart();
        currentClaimActivity.genesisMLA = currentMLA;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentClaimActivity: currentClaimActivity } });
    };

    const onDropDownChanged = (evt) => {
        currentMLA[evt.target.name] = evt.target.value;
        currentClaimActivity.genesisMLA = currentMLA;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentClaimActivity: currentClaimActivity } });
    };

    React.useEffect(() => {
        loadMetaData();

    }, []);

    async function loadMetaData() {
        let helpTags = await loadHelpTags(request.helpContainerName);
        let riskStates = await getRiskStates();

        setMetadata({
            loading: false,
            helpTags: (helpTags.data.list || []),
            riskStates: riskStates
        });

    }

    return (
        <Panel>
            <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Genesis MLA</span></PanelHeader>
            <PanelContent>
                <ContentRow>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            InputProps={{ readOnly: true }}
                            label="Claim ID"
                            fullWidth={true}
                            variant="outlined"
                            value={claim.claimID}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            InputProps={{ readOnly: true }}
                            label="Claim Status"
                            fullWidth={true}
                            variant="outlined"
                            //value={currentClaimActivity.claimStatusTypeType?.statusText || "Open"}
                            value={currentClaimActivity?.genesisMLA?.claimStatusTypeText || "Open"}

                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            InputProps={{ readOnly: true }}
                            label="Claim Examiner"
                            fullWidth={true}
                            variant="outlined"
                            value={`${safeStr(safeObj(claim.examiner).firstName)} ${safeStr(safeObj(claim.examiner).lastName)}`}
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="99%">
                        <TextInput
                            disabled={isViewer}
                            InputProps={{ readOnly: true }}
                            label="Insured Name"
                            fullWidth={true}
                            variant="outlined"
                            value={(ensureNonNullObject(claim) ? (ensureNonNullObject(claim.policy) ? `${claim.policy.insuredName || ''} ${claim.policy.insuredNameContinuation || ''}`.trim() : (ensureNonNullObject(claim.claimPolicy) ? claim.claimPolicy.insuredName || '' : '--')) : '--')}

                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            InputProps={{ readOnly: true }}
                            label="Contract"
                            fullWidth={true}
                            variant="outlined"
                            value={claim.claimPolicyID}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            InputProps={{ readOnly: true }}
                            label="Date of Loss"
                            fullWidth={true}
                            variant="outlined"
                            value={formatDate(claim?.dOL) || ""}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            InputProps={{ readOnly: true }}
                            label="Accident State"
                            fullWidth={true}
                            variant="outlined"
                            value={(claim.lossLocation ? metadata.riskStates.find(s => s.riskStateID === parseInt(claim.lossLocation))?.stateName : claim.lossLocationOutsideUsa) || " "}
                        />
                    </ContentCell>
                </ContentRow>
                <Divider />
                <ContentRow>
                    <ContentCell width="80%">
                        <SelectList
                            disabled={isViewer}
                            id="uWDivison"
                            name="uWDivison"
                            label="UW Division"
                            fullWidth={true}
                            variant="outlined"
                            value={currentMLA.uWDivison}
                            tooltip={findHelpTextByTag("uWDivison", metadata.helpTags)}
                            {...register("uWDivison",
                                {
                                    required: "This is required.",
                                    onChange: onDropDownChanged
                                }
                            )
                            }
                            required
                            error={errors.uWDivison}
                            helperText={errors.uWDivison ? errors.uWDivison.message : ""}
                        >
                            <MenuItem value="PublicEntity">Public Entity</MenuItem>
                            <MenuItem value="CommercialInsurance">Commercial Insurance</MenuItem>
                            <MenuItem value="WorkersCompensation">Workers Compensation</MenuItem>
                            <MenuItem value="Captive">Captive</MenuItem>
                        </SelectList>
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="80%">
                        <TextInput
                            label="Loss Description"
                            multiline
                            rows={3}
                            disabled={isViewer}
                            id="lossDescription"
                            name="lossDescription"
                            readOnly
                            fullWidth={true}
                            variant="outlined"
                            value={claim.lossDesc}
                            InputProps={{ readOnly: true }}
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="80%">
                        <TextInput
                            label="Injury"
                            multiline
                            rows={3}
                            disabled={isViewer}
                            id="injury"
                            name="injury"
                            fullWidth={true}
                            variant="outlined"
                            value={currentMLA.injury}
                            tooltip={findHelpTextByTag("injury", metadata.helpTags)}
                            {...register("injury",
                                {
                                    required: "This is required.",
                                    onChange: onValueChanged
                                }
                            )
                            }
                            required
                            error={errors.injury}
                            inputProps={{ maxlength: 1024 }}
                            helperText={errors.injury ? errors.injury.message : ""}
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="80%">
                        <TextInput
                            label="Reason"
                            disabled={isViewer}
                            multiline
                            rows={3}
                            id="reason"
                            name="reason"
                            fullWidth={true}
                            variant="outlined"
                            value={currentMLA.reason}
                            tooltip={findHelpTextByTag("reason", metadata.helpTags)}
                            {...register("reason",
                                {
                                    required: "This is required.",
                                    onChange: onValueChanged
                                }
                            )
                            }
                            required
                            error={errors.reason}
                            inputProps={{ maxlength: 1024 }}
                            helperText={errors.reason ? errors.reason.message : ""}
                        />
                    </ContentCell>
                </ContentRow>
                <Divider />
                <ContentRow>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            InputProps={{ readOnly: true }}
                            label="MLA Activity Type"
                            fullWidth={true}
                            variant="outlined"
                            value={currentMLA.associatedActivityName}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <CurrencyInput
                            disabled={isViewer}
                            InputProps={{ readOnly: true }}
                            label="MLA Activity Amount"
                            fullWidth={true}
                            variant="outlined"
                            allowNegative={true}
                            value={currentMLA.associatedActivityAmount}
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        <CurrencyInput
                            disabled={isViewer}
                            InputProps={{ readOnly: true }}
                            label={claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE ? "Ceded Paid Loss" : "Paid Loss"}
                            fullWidth={true}
                            variant="outlined"
                            value={lossExpenseReserve?.paidLoss || 0}
                            allowNegative={true}

                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <CurrencyInput
                            disabled={isViewer}
                            InputProps={{ readOnly: true }}
                            label={claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE ? "Ceded Loss Reserve" : "Loss Reserve"}
                            fullWidth={true}
                            variant="outlined"
                            value={lossExpenseReserve?.lossReserves || 0}
                            allowNegative={true}

                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        <CurrencyInput
                            disabled={isViewer}
                            InputProps={{ readOnly: true }}
                            label={claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE ? "Ceded Paid Expense" : "Paid Expense"}
                            fullWidth={true}
                            variant="outlined"
                            value={lossExpenseReserve?.paidExpense || 0}
                            allowNegative={true}

                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <CurrencyInput
                            disabled={isViewer}
                            InputProps={{ readOnly: true }}
                            label={claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE ? "Ceded Expense Reserve" : "Expense Reserve"}
                            fullWidth={true}
                            variant="outlined"
                            value={lossExpenseReserve?.expenseReserves || 0}
                            allowNegative={true}

                        />
                    </ContentCell>
                </ContentRow>
                {claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE &&
                    <ContentRow>
                        <ContentCell width="33%">
                            <CurrencyInput
                                disabled={isViewer}
                                InputProps={{ readOnly: true }}
                                label="ACR"
                                fullWidth={true}
                                variant="outlined"
                                value={lossExpenseReserve?.additionalLossRes || 0}
                                allowNegative={true}

                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <CurrencyInput
                                disabled={isViewer}
                                InputProps={{ readOnly: true }}
                                label="AER"
                                fullWidth={true}
                                variant="outlined"
                                value={lossExpenseReserve?.additionalExpenseRes || 0}
                                allowNegative={true}

                            />
                        </ContentCell>
                    </ContentRow>
                }
                <Divider />
                <ContentRow>
                    <ContentCell width="100%">
                        <span style={{ fontWeight: 'bold' }}>Loss Coding</span>
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            InputProps={{ readOnly: true }}
                            label="Coverage"
                            fullWidth={true}
                            variant="outlined"
                            value={genesisMLALossCoding?.coverage || ''}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            InputProps={{ readOnly: true }}
                            label="Trigger"
                            fullWidth={true}
                            variant="outlined"
                            value={genesisMLALossCoding?.trigger || ''}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            InputProps={{ readOnly: true }}
                            label="Attachment Point"
                            fullWidth={true}
                            variant="outlined"
                            value={genesisMLALossCoding?.attachmentPoint || ''}
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            InputProps={{ readOnly: true }}
                            label="Limit"
                            fullWidth={true}
                            variant="outlined"
                            value={genesisMLALossCoding?.limit || ''}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            InputProps={{ readOnly: true }}
                            label="Expenses"
                            fullWidth={true}
                            variant="outlined"
                            value={genesisMLALossCoding?.expense || ''}
                        />
                    </ContentCell>
                </ContentRow>
            </PanelContent>
        </Panel>
    );
};
