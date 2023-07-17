import { Divider } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import React from 'react';
import styled from 'styled-components';
import { Panel, PanelContent, PanelHeader, Spinner } from '../../../../Core/Forms/Common';
import { conferFinancialDB2Selectors, fsriFinancialDB2Selectors } from '../../../../Core/State/slices/metadata/financial-db2';
import { LEGAL_ENTITY } from '../../../../Core/Enumerations/app/legal-entity';
import { STATUTORY_SYSTEM } from '../../../../Core/Enumerations/app/statutory-system';
import { GENSERVE_CLAIM_STATUS_TYPE } from '../../../../Core/Enumerations/app/claim-status-type';

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

export const ClaimFinancial = ({ claim, request, dispatch, formValidator, onSave, db2Claim, financialDB2, lossExpenseReserve }) => {
    const fsriFinancialDB2 = useSelector(fsriFinancialDB2Selectors.selectData());
    const conferFinancialDB2 = useSelector(conferFinancialDB2Selectors.selectData());

    const { enqueueSnackbar } = useSnackbar();
    const [metadata, setMetadata] = React.useState({
        loading: true,
        financialDB2: {},
    });
    //const [db2ClaimStatus, setDB2ClaimStatus] = React.useState('');
    const loadMetaData = async () => {
        if (!(claim.statutoryClaimID && claim.statutorySystem) && claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE) {
            enqueueSnackbar("Statutory System and Statutory Claim ID must be provided before you may proceed.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, selectedMenu: 'FINANCIAL' } });
            return;
        }
        if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE) {
            if (claim.statutorySystem === STATUTORY_SYSTEM.FSRI && !fsriFinancialDB2) {
                enqueueSnackbar("This claim does not exist in FSRI. Please request an Open Claim activity.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, selectedMenu: 'FINANCIAL' } });
                return;
            }
            if (claim.statutorySystem === STATUTORY_SYSTEM.CONFER && !conferFinancialDB2) {
                enqueueSnackbar("This claim does not exist in CONFER. Please request an Open Claim activity.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, selectedMenu: 'FINANCIAL' } });
                return;
            }
        }
        else
        {
            if (!db2Claim) {
                enqueueSnackbar("This claim does not exist in GenServe. Please request an Open Claim activity.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, selectedMenu: 'FINANCIAL' } });
                return;
            }
        }

        if ([GENSERVE_CLAIM_STATUS_TYPE.OPEN, 'OPEN', 'C', 'CLOSE', 'CLOSED', 'R', 'COM'].includes(db2Claim?.statusCode?.toUpperCase())) {

            if (financialDB2 == null) {
                enqueueSnackbar("Unable to find Financial Data in GenServe", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                let _financialDB2 = {};
                _financialDB2.lossReserves = null;
                _financialDB2.expenseReserves = null;
                _financialDB2.paidLoss = null;
                _financialDB2.paidExpense = null;

                _financialDB2.additionalLossRes = null;
                _financialDB2.additionalExpenseRes = null;
                _financialDB2.salvage = null;
                _financialDB2.subrogation = null;

                _financialDB2.reinsuranceReserves = null;
                _financialDB2.reinsuranceRecoverable = null;
                _financialDB2.reinsuranceRecovered = null;
                _financialDB2.deductableRecoverable = null;
                _financialDB2.deductableRecovered = null;
                _financialDB2.directIncurred = null;
                _financialDB2.netIncurred = null;
                setMetadata({
                    loading: false,
                    financialDB2: _financialDB2,
                });
            }
            else {

                if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.FSRI) {
                    let _financialDB2 = {};
                    _financialDB2.lossReserves = isNaN(parseFloat(fsriFinancialDB2.lossReserve)) ? fsriFinancialDB2.lossReserve : parseFloat(fsriFinancialDB2.lossReserve);
                    _financialDB2.expenseReserves = isNaN(parseFloat(fsriFinancialDB2.expenseReserve)) ? fsriFinancialDB2.expenseReserve : parseFloat(fsriFinancialDB2.expenseReserve);
                    _financialDB2.paidLoss = isNaN(parseFloat(fsriFinancialDB2.paidLoss)) ? fsriFinancialDB2.paidLoss : parseFloat(fsriFinancialDB2.paidLoss);
                    _financialDB2.paidExpense = isNaN(parseFloat(fsriFinancialDB2.paidExpense)) ? fsriFinancialDB2.paidExpense : parseFloat(fsriFinancialDB2.paidExpense);

                    _financialDB2.additionalLossRes = isNaN(parseFloat(fsriFinancialDB2.additionalLossRes)) ? fsriFinancialDB2.additionalLossRes : parseFloat(fsriFinancialDB2.additionalLossRes);
                    _financialDB2.additionalExpenseRes = isNaN(parseFloat(fsriFinancialDB2.additionalExpenseRes)) ? fsriFinancialDB2.additionalExpenseRes : parseFloat(fsriFinancialDB2.additionalExpenseRes);
                    _financialDB2.salvage = isNaN(parseFloat(fsriFinancialDB2.salvage)) ? fsriFinancialDB2.salvage : parseFloat(fsriFinancialDB2.salvage);
                    _financialDB2.subrogation = isNaN(parseFloat(fsriFinancialDB2.subrogation)) ? fsriFinancialDB2.paidExpense : parseFloat(fsriFinancialDB2.subrogation);

                    _financialDB2.directIncurred = isNaN(parseFloat(fsriFinancialDB2.totalGrossIncurred)) ? fsriFinancialDB2.totalGrossIncurred : parseFloat(fsriFinancialDB2.totalGrossIncurred);
                    setMetadata({
                        loading: false,
                        financialDB2: (_financialDB2 || {}),
                    });

                }
                else if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.CONFER) {
                    let _financialDB2 = {};
                    _financialDB2.lossReserves = isNaN(parseFloat(conferFinancialDB2.totalLossReserve)) ? conferFinancialDB2.totalLossReserve : parseFloat(conferFinancialDB2.totalLossReserve);
                    _financialDB2.expenseReserves = isNaN(parseFloat(conferFinancialDB2.totalExpenseReserve)) ? conferFinancialDB2.totalExpenseReserve : parseFloat(conferFinancialDB2.totalExpenseReserve);
                    _financialDB2.paidLoss = isNaN(parseFloat(conferFinancialDB2.totalPaidLoss)) ? conferFinancialDB2.totalPaidLoss : parseFloat(conferFinancialDB2.totalPaidLoss);
                    _financialDB2.paidExpense = isNaN(parseFloat(conferFinancialDB2.totalPaidExpense)) ? conferFinancialDB2.totalPaidExpense : parseFloat(conferFinancialDB2.totalPaidExpense);

                    _financialDB2.additionalLossRes = isNaN(parseFloat(conferFinancialDB2.totalACR)) ? conferFinancialDB2.totalACR : parseFloat(conferFinancialDB2.totalACR);
                    _financialDB2.additionalExpenseRes = isNaN(parseFloat(conferFinancialDB2.totalAER)) ? conferFinancialDB2.totalAER : parseFloat(conferFinancialDB2.totalAER);
                    _financialDB2.salvage = isNaN(parseFloat(conferFinancialDB2.totalSalvage)) ? conferFinancialDB2.totalSalvage : parseFloat(conferFinancialDB2.totalSalvage);
                    _financialDB2.subrogation = isNaN(parseFloat(conferFinancialDB2.totalSubrogation)) ? conferFinancialDB2.totalSubrogation : parseFloat(conferFinancialDB2.totalSubrogation);

                    _financialDB2.directIncurred = conferFinancialDB2.totalIncurred

                    setMetadata({
                        loading: false,
                        financialDB2: (_financialDB2 || {}),
                    });

                }
                else {
                    let _financialDB2 = {};

                    _financialDB2.lossReserves = isNaN(parseFloat(financialDB2.lossReserves)) ? financialDB2.lossReserves : parseFloat(financialDB2.lossReserves);
                    _financialDB2.expenseReserves = isNaN(parseFloat(financialDB2.expenseReserves)) ? financialDB2.expenseReserves : parseFloat(financialDB2.expenseReserves);
                    _financialDB2.paidLoss = isNaN(parseFloat(financialDB2.paidLoss)) ? financialDB2.paidLoss : parseFloat(financialDB2.paidLoss);
                    _financialDB2.paidExpense = isNaN(parseFloat(financialDB2.paidExpense)) ? financialDB2.paidExpense : parseFloat(financialDB2.paidExpense);

                    _financialDB2.additionalLossRes = financialDB2.additionalLossRes ? financialDB2.additionalLossRes : financialDB2.totalLossReserve;
                    _financialDB2.additionalExpenseRes = financialDB2.additionalExpenseRes ? financialDB2.additionalExpenseRes : financialDB2.totalExpenseReserve;
                    _financialDB2.salvage = financialDB2.subrogation ? financialDB2.subrogation : financialDB2.totalSubrogation;
                    _financialDB2.subrogation = financialDB2.salvage ? financialDB2.salvage : financialDB2.totalSalvage;


                    _financialDB2.reinsuranceReserves = isNaN(parseFloat(financialDB2.reinsuranceReserves)) ? 0 : parseFloat(financialDB2.reinsuranceReserves);
                    _financialDB2.reinsuranceRecoverable = isNaN(parseFloat(financialDB2.reinsuranceRecoverable)) ? 0 : parseFloat(financialDB2.reinsuranceRecoverable);
                    _financialDB2.reinsuranceRecovered = isNaN(parseFloat(financialDB2.reinsuranceRecovered)) ? 0 : parseFloat(financialDB2.reinsuranceRecovered);
                    _financialDB2.deductableRecoverable = isNaN(parseFloat(financialDB2.deductableRecoverable)) ? 0 : parseFloat(financialDB2.deductableRecoverable);
                    _financialDB2.deductableRecovered = isNaN(parseFloat(financialDB2.deductableRecovered)) ? 0 : parseFloat(financialDB2.deductableRecovered);
                    _financialDB2.directIncurred = parseFloat(_financialDB2.lossReserves) + parseFloat(_financialDB2.expenseReserves) + parseFloat(_financialDB2.paidLoss) + parseFloat(_financialDB2.paidExpense);
                    _financialDB2.netIncurred = _financialDB2.directIncurred - _financialDB2.reinsuranceReserves + _financialDB2.reinsuranceRecoverable + _financialDB2.reinsuranceRecovered + _financialDB2.deductableRecoverable + _financialDB2.deductableRecovered;
                    setMetadata({
                        loading: false,
                        financialDB2: (_financialDB2 || {}),
                    });
                }
            }

        }
        else {
        let _financialDB2 = {};
        _financialDB2.lossReserves = null;
        _financialDB2.expenseReserves = null;
        _financialDB2.paidLoss = null;
        _financialDB2.paidExpense = null;

        _financialDB2.additionalLossRes = null;
        _financialDB2.additionalExpenseRes = null;
        _financialDB2.salvage = null;
        _financialDB2.subrogation = null;

        _financialDB2.reinsuranceReserves = null;
        _financialDB2.reinsuranceRecoverable = null;
        _financialDB2.reinsuranceRecovered = null;
        _financialDB2.deductableRecoverable = null;
        _financialDB2.deductableRecovered = null;
        _financialDB2.directIncurred = null;
        _financialDB2.netIncurred = null;
        setMetadata({
            loading: false,
            financialDB2: _financialDB2,
        });
        //setDB2ClaimStatus(db2Claim.statusText);
    }
    }

    //function ParseGQErrors(errors, error) {
    //    if (error)
    //        enqueueSnackbar(error.replace("GraphQL.ExecutionError:", ""), { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });

    //    if (errors) {
    //        errors.map((err, index) => {
    //            enqueueSnackbar(err.message.replace("GraphQL.ExecutionError:", ""), { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
    //        }
    //        );
    //    }
    //}
    React.useEffect(() => {
        loadMetaData();
    }, []);
    return (
        metadata.loading ? <Spinner /> :
            <>
                <Panel>
                    <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>View Claim Financial</span></PanelHeader>
                    <PanelContent>
                        <ContentRow>
                            <ContentCell width="25%"><span style={{ fontWeight: 'bold' }}>{claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE ? "Statutory System Claim Status" : "GenServe Claim Status"}</span></ContentCell>
                            <ContentCell width="25%">{db2Claim?.statusText || db2Claim?.statusCode}</ContentCell>
                        </ContentRow>
                        <ContentRow>
                            <ContentCell><span style={{ fontWeight: 'bold' }}>Registered Claim Financials</span></ContentCell>
                        </ContentRow>
                        <Divider />
                        <ContentRow>
                            <ContentCell width="25%">Loss Reserves</ContentCell>
                            <ContentCell width="25%">$ {metadata.financialDB2?.lossReserves?.toLocaleString()}</ContentCell>
                        </ContentRow>
                        <ContentRow>
                            <ContentCell width="25%">Expense Reserves</ContentCell>
                            <ContentCell width="25%">$ {metadata.financialDB2?.expenseReserves?.toLocaleString()}</ContentCell>
                        </ContentRow>
                        <ContentRow>
                            <ContentCell width="25%">Paid Loss</ContentCell>
                            <ContentCell width="25%">$ {metadata.financialDB2?.paidLoss?.toLocaleString()}</ContentCell>
                        </ContentRow>
                        <ContentRow>
                            <ContentCell width="25%">Paid Expense</ContentCell>
                            <ContentCell width="25%">$ {metadata.financialDB2?.paidExpense?.toLocaleString()}</ContentCell>
                        </ContentRow>
                        {claim.g2LegalEntityID !== LEGAL_ENTITY.GENESIS_REINSURANCE && <>
                            <Divider />
                            <ContentRow>
                                <ContentCell width="25%">Reinsurance Reserves</ContentCell>
                                <ContentCell width="25%">$ {metadata.financialDB2?.reinsuranceReserves?.toLocaleString()}</ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell width="25%">Reinsurance Recoverable</ContentCell>
                                <ContentCell width="25%">$ {metadata.financialDB2?.reinsuranceRecoverable?.toLocaleString()}</ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell width="25%">Reinsurance Recovered</ContentCell>
                                <ContentCell width="25%">$ {metadata.financialDB2?.reinsuranceRecovered?.toLocaleString()}</ContentCell>
                            </ContentRow>
                            <Divider />
                            <ContentRow>
                                <ContentCell width="25%">Deductible Recoverable</ContentCell>
                                <ContentCell width="25%">$ {metadata.financialDB2?.deductableRecoverable?.toLocaleString()}</ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell width="25%">Deductible Recovered</ContentCell>
                                <ContentCell width="25%">$ {metadata.financialDB2?.deductableRecovered?.toLocaleString()}</ContentCell>
                            </ContentRow>
                            <Divider />
                            <ContentRow>
                                <ContentCell><span style={{ fontWeight: 'bold' }}>Totals</span></ContentCell>
                            </ContentRow>
                            <Divider />
                            <ContentRow>
                                <ContentCell width="25%">Direct Incurred</ContentCell>
                                <ContentCell width="25%">$ {metadata.financialDB2?.directIncurred?.toLocaleString()}</ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell width="25%">Net Incurred</ContentCell>
                                <ContentCell width="25%">$ {metadata.financialDB2?.netIncurred?.toLocaleString()}</ContentCell>
                            </ContentRow>

                        </>}
                        {claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && <>
                            <Divider />
                            <ContentRow>
                                <ContentCell width="25%">Additional Loss Reserves</ContentCell>
                                <ContentCell width="25%">$ {metadata.financialDB2?.additionalLossRes?.toLocaleString()}</ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell width="25%">Additional Expense Reserves</ContentCell>
                                <ContentCell width="25%">$ {metadata.financialDB2?.additionalExpenseRes?.toLocaleString()}</ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell width="25%">Salvage</ContentCell>
                                <ContentCell width="25%">$ {metadata.financialDB2?.salvage?.toLocaleString()}</ContentCell>
                            </ContentRow>
                            <Divider />
                            <ContentRow>
                                <ContentCell width="25%">Subrogation</ContentCell>
                                <ContentCell width="25%">$ {metadata.financialDB2?.subrogation?.toLocaleString()}</ContentCell>
                            </ContentRow>
                            <Divider />
                            <ContentRow>
                                <ContentCell><span style={{ fontWeight: 'bold' }}>Totals</span></ContentCell>
                            </ContentRow>
                            <Divider />
                            <ContentRow>
                                <ContentCell width="25%">Total Incurred</ContentCell>
                                <ContentCell width="25%">$ {metadata.financialDB2?.directIncurred?.toLocaleString()}</ContentCell>
                            </ContentRow>
                        </>}


                    </PanelContent>
                </Panel>
            </>

    );
};
