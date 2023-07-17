import React from 'react';
import { Panel, PanelContent, PanelHeader, CurrencyInput } from '../../../../../Core/Forms/Common';
import { findHelpTextByTag,loadHelpTags } from '../../../../Help/Queries';
import { ApproverSection } from '../ApproverSection';
import { ClaimActivityStatusInfoSection } from '../ClaimActivityStatusInfoSection';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { conferFinancialDB2Selectors, fsriFinancialDB2Selectors } from '../../../../../Core/State/slices/metadata/financial-db2';
import { LEGAL_ENTITY } from '../../../../../Core/Enumerations/app/legal-entity';
import { CLAIM_TYPES } from '../../../../../Core/Enumerations/app/claim-type';
import { STATUTORY_SYSTEM } from '../../../../../Core/Enumerations/app/statutory-system';
import { CLAIM_STATUS_TYPE } from '../../../../../Core/Enumerations/app/claim-status-type';

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

export const CloseClaimActivity = ({ claim, request, dispatch, formValidator, onSave, db2Claim, lossExpenseReserve }) => {
    const currentClaimActivity = (request.currentClaimActivity || {});
    const currentCloseActivity = (currentClaimActivity.close || {});
    const fsriFinancialDB2 = useSelector(fsriFinancialDB2Selectors.selectData());
    const conferFinancialDB2 = useSelector(conferFinancialDB2Selectors.selectData());
    const { register, formState: { errors }, setValue } = formValidator;
    let isViewer = (request.currentClaimActivity.activityID && !(claim.claimType === CLAIM_TYPES.WORKERS_COMP && claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.NAT_RE && request.currentClaimActivity?.claimStatusTypeID === CLAIM_STATUS_TYPE.SUBMITTED_TO_ACCOUNTANT_AUTHORITY_CHECK ));

    if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.NAT_RE) {
        lossExpenseReserve = {
            paidLoss: currentCloseActivity.cededPaidLoss != null ? currentCloseActivity.cededPaidLoss : null,
            paidExpense: currentCloseActivity.cededPaidExpense != null ? currentCloseActivity.cededPaidExpense : null,
            lossReserves: currentCloseActivity.cededLossReserves != null ? currentCloseActivity.cededLossReserves : null,
            expenseReserves: currentCloseActivity.cededExpenseReserve != null ? currentCloseActivity.cededExpenseReserve : null,
            additionalLossRes: currentCloseActivity.acr != null ? currentCloseActivity.acr : null,
            additionalExpenseRes: currentCloseActivity.aer != null ? currentCloseActivity.aer : null
        };
    }
    if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.FSRI) {
        lossExpenseReserve = fsriFinancialDB2 ? {
            paidLoss: currentCloseActivity.cededPaidLoss != null ? currentCloseActivity.cededPaidLoss : fsriFinancialDB2.paidLoss,
            paidExpense: currentCloseActivity.cededPaidExpense != null ? currentCloseActivity.cededPaidExpense : fsriFinancialDB2.paidExpense,
            lossReserves: currentCloseActivity.cededLossReserves != null ? currentCloseActivity.cededLossReserves : fsriFinancialDB2.lossReserve,
            expenseReserves: currentCloseActivity.cededExpenseReserve != null ? currentCloseActivity.cededExpenseReserve : fsriFinancialDB2.expenseReserve,
            additionalLossRes: currentCloseActivity.acr != null ? currentCloseActivity.acr : fsriFinancialDB2.additionalLossRes,
            additionalExpenseRes: currentCloseActivity.aer != null ? currentCloseActivity.aer : fsriFinancialDB2.additionalExpenseRes
        } : null;
    }
    else if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.CONFER) {
        lossExpenseReserve = conferFinancialDB2 ? {
            paidLoss: currentCloseActivity.cededPaidLoss != null ? currentCloseActivity.cededPaidLoss : conferFinancialDB2.totalPaidLoss,
            paidExpense: currentCloseActivity.cededPaidExpense != null ? currentCloseActivity.cededPaidExpense : conferFinancialDB2.totalPaidExpense,
            lossReserves: currentCloseActivity.cededLossReserves != null ? currentCloseActivity.cededLossReserves : conferFinancialDB2.totalLossReserve,
            expenseReserves: currentCloseActivity.cededExpenseReserve != null ? currentCloseActivity.cededExpenseReserve : conferFinancialDB2.totalExpenseReserve,
            additionalLossRes: currentCloseActivity.acr != null ? currentCloseActivity.acr : conferFinancialDB2.totalACR,
            additionalExpenseRes: currentCloseActivity.aer != null ? currentCloseActivity.aer : conferFinancialDB2.totalAER
        } : null;
    }

    const [metadata, setMetadata] = React.useState({
        loading: true,
        helpTags: [],
    });
    React.useEffect(() => {
        loadMetaData();
    }, []);

    async function loadMetaData() {
        let helpTags = await loadHelpTags(request.helpContainerName);
        setMetadata({
            loading: false,
            helpTags: (helpTags.data.list || []),
        })
    }
    const onCurrencyChanged = (evt) => {
        currentCloseActivity[evt.target.name] = evt.target.value;
        currentClaimActivity.close = currentCloseActivity;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentClaimActivity: currentClaimActivity } });
    };
    const convertFloatStringToFloat = (evt) => {
        let val = evt.target.value;
        val = val.replace("$", "");
        val = val.replaceAll(",", "");
        currentCloseActivity[evt.target.name] = !isNaN(parseFloat(val)) ? parseFloat(val) : val;
        currentClaimActivity.close = currentCloseActivity;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentClaimActivity: currentClaimActivity } });
    };
    return (
        <Panel>
            <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>{currentClaimActivity.accountingTransTypeText}</span></PanelHeader>
            <PanelContent>
                <ClaimActivityStatusInfoSection claim={claim} request={request} dispatch={dispatch} />
            </PanelContent>
            {(claim.g2LegalEntityID !== LEGAL_ENTITY.GENESIS_REINSURANCE || claim.claimType === CLAIM_TYPES.LEGAL) &&
                <ContentRow>
                    <ContentCell width="33%">
                        <CurrencyInput
                            disabled={request.currentClaimActivity.activityID}
                            //inputProps={{ maxlength: 15 }}
                            id="lossReserves"
                            name="lossReserves"
                            label="Current Loss Reserve"
                            value={currentCloseActivity.cededLossReserves || (lossExpenseReserve || {}).lossReserves}
                            allowNegative={true}
                            InputProps={{ readOnly: true }}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <CurrencyInput
                            disabled={request.currentClaimActivity.activityID}
                            //inputProps={{ maxlength: 15 }}
                            id="expenseReserves"
                            name="expenseReserves"
                            label="Current Expense Reserve"
                            value={currentCloseActivity.cededExpenseReserve || (lossExpenseReserve || {}).expenseReserves}
                            InputProps={{ readOnly: true }}
                            allowNegative={true}
                        />
                    </ContentCell>
                </ContentRow>
            }
            {((claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.claimType !== CLAIM_TYPES.LEGAL && claim.statutorySystem !== STATUTORY_SYSTEM.NAT_RE) || (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.claimType === CLAIM_TYPES.WORKERS_COMP && claim.statutorySystem === STATUTORY_SYSTEM.NAT_RE && request.currentClaimActivity.activityID)) &&

                <>
                    <ContentRow>
                        <ContentCell width="33%">
                            <CurrencyInput
                            disabled={isViewer}
                            id="cededPaidLoss"
                            name="cededPaidLoss"
                            label="Ceded Paid Loss"
                            value={(lossExpenseReserve || {}).paidLoss}
                            tooltip={findHelpTextByTag("cededPaidLoss", metadata.helpTags)}
                            {...register("cededPaidLoss",
                                {
                                    required: "This is required.",
                                    onChange: onCurrencyChanged

                                }
                            )
                            }
                            error={errors.cededPaidLoss}
                            helperText={errors.cededPaidLoss ? errors.cededPaidLoss.message : ""}
                            onBlur={convertFloatStringToFloat}
                            InputProps={claim.claimType === CLAIM_TYPES.WORKERS_COMP && claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.NAT_RE ? { readOnly: false, maxlength: 13 } : { readOnly: true }}
                            allowNegative={true}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <CurrencyInput
                            disabled={isViewer}
                            id="cededLossReserves"
                            name="cededLossReserves"
                                label="Ceded Loss Reserve"
                            value={(lossExpenseReserve || {}).lossReserves}
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
                            onBlur={convertFloatStringToFloat}
                            InputProps={claim.claimType === CLAIM_TYPES.WORKERS_COMP && claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.NAT_RE ? { readOnly: false, maxlength: 13 } : { readOnly: true }}
                            allowNegative={true}
                            />
                        </ContentCell>
                    </ContentRow>

                    <ContentRow>
                        <ContentCell width="33%">
                            <CurrencyInput
                            disabled={isViewer}
                            id="cededPaidExpense"
                            name="cededPaidExpense"
                            label="Ceded Paid Expense"
                            value={(lossExpenseReserve || {}).paidExpense}
                            tooltip={findHelpTextByTag("cededPaidExpense", metadata.helpTags)}
                            {...register("cededPaidExpense",
                                {
                                    required: "This is required.",
                                    onChange: onCurrencyChanged

                                }
                            )
                            }
                            error={errors.cededPaidExpense}
                            helperText={errors.cededPaidExpense ? errors.cededPaidExpense.message : ""}
                            onBlur={convertFloatStringToFloat}
                            InputProps={claim.claimType === CLAIM_TYPES.WORKERS_COMP && claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.NAT_RE ? { readOnly: false, maxlength: 13 } : { readOnly: true }}
                            allowNegative={true}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <CurrencyInput
                            disabled={isViewer}
                            id="cededExpenseReserve"
                            name="cededExpenseReserve"
                            label="Ceded Expense Reserves"
                            value={(lossExpenseReserve || {}).expenseReserves}
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
                            onBlur={convertFloatStringToFloat}
                            InputProps={claim.claimType === CLAIM_TYPES.WORKERS_COMP && claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.NAT_RE ? { readOnly: false, maxlength: 13 } : { readOnly: true }}
                            allowNegative={true}
                            />
                        </ContentCell>
                    </ContentRow>

                    <ContentRow>
                        <ContentCell width="33%">
                            <CurrencyInput
                            disabled={isViewer}
                            id="acr"
                            name="acr"
                            label="ACR"
                            value={(lossExpenseReserve || {}).additionalLossRes}
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
                            onBlur={convertFloatStringToFloat}
                            InputProps={claim.claimType === CLAIM_TYPES.WORKERS_COMP && claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.NAT_RE ? { readOnly: false, maxlength: 13 } : { readOnly: true }}
                            allowNegative={true}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <CurrencyInput
                            disabled={isViewer}
                            id="aer"
                            name="aer"
                            label="AER"
                            value={(lossExpenseReserve || {}).additionalExpenseRes}
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
                            onBlur={convertFloatStringToFloat}
                            InputProps={claim.claimType === CLAIM_TYPES.WORKERS_COMP && claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.NAT_RE ? { readOnly: false, maxlength: 13 } : { readOnly: true }}
                            allowNegative={true}
                            />
                        </ContentCell>
                    </ContentRow>
                </>
            }
            <ApproverSection claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} />
        </Panel>
    );
};
