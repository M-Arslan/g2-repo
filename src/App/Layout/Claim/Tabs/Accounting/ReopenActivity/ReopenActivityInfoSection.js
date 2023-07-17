import { Divider } from '@mui/material';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { APP_TYPES } from '../../../../../Core/Enumerations/app/app-types';
import { LEGAL_ENTITY } from '../../../../../Core/Enumerations/app/legal-entity';
import { CurrencyInput, Panel, PanelContent, PanelHeader } from '../../../../../Core/Forms/Common';
import { userSelectors } from '../../../../../Core/State/slices/user';
import { findHelpTextByTag, loadHelpTags } from '../../../../Help/Queries';
import { ApproverSection } from '../ApproverSection';
import { ClaimActivityStatusInfoSection } from '../ClaimActivityStatusInfoSection';
import { CLAIM_STATUS_TYPE, GENSERVE_CLAIM_STATUS_TYPE } from '../../../../../Core/Enumerations/app/claim-status-type';


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

export const ReopenActivityInfoSection = ({ claim, request, dispatch, formValidator, onSave, db2Claim,  lossExpenseReserve  }) => {

    const $auth = useSelector(userSelectors.selectAuthContext());
    const isViewer = ($auth.isReadOnly(APP_TYPES.Financials)) || (request.currentClaimActivity.activityID && request.currentClaimActivity.claimStatusTypeID !== CLAIM_STATUS_TYPE.OUTSTANDING_ISSUE);
    const currentClaimActivity = request.currentClaimActivity || {};
    const currentReopen = currentClaimActivity.reopens || {};

    const currentDB2Claim = db2Claim || {};
    const reserveFieldsRequired = !request.isLegalClaim && currentDB2Claim.statusCode !== GENSERVE_CLAIM_STATUS_TYPE.CLOSED_PENDING;

    const { register, formState: { errors }, setValue } = formValidator;
    setValue("endingLossReserve", currentReopen.endingLossReserve ? currentReopen.endingLossReserve : null);
    setValue("endingExpenseReserve", currentReopen.endingExpenseReserve ? currentReopen.endingExpenseReserve : null);
    setValue("endingMedPayReserve", currentReopen.endingMedPayReserve ? currentReopen.endingMedPayReserve : null);

    const [metadata, setMetadata] = React.useState({
        loading: true,
        helpTags: [],
    });
    const onCurrencyChanged = (evt) => {
        currentReopen[evt.target.name] = evt.target.value;
        currentClaimActivity.reopens = currentReopen;
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
                <Divider/>
                <ContentRow>
                    <ContentCell width="33%">
                        <CurrencyInput
                            disabled={isViewer}
                            id="endingLossReserve"
                            name="endingLossReserve"
                            label="Ending Loss Reserve"
                            required={reserveFieldsRequired}
                            value={currentReopen.endingLossReserve}
                            inputProps={{ maxlength: 15 }}
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
                            id="endingExpenseReserve"
                            name="endingExpenseReserve"
                            label="Ending Expense Reserve"
                            required={reserveFieldsRequired}
                            value={currentReopen.endingExpenseReserve}
                            inputProps={{ maxlength: 15 }}
                            onChange={onCurrencyChanged}
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
                {request.claim.g2LegalEntityID !== LEGAL_ENTITY.GENESIS_INSURANCE &&
                <ContentRow>
                    <ContentCell width="33%">
                        <CurrencyInput
                            disabled={isViewer}
                            id="endingMedPayReserve"
                            name="endingMedPayReserve"
                            label="Ending MedPay Reserve"
                            required={reserveFieldsRequired}
                            value={currentReopen.endingMedPayReserve}
                            onChange={onCurrencyChanged}
                            inputProps={{ maxlength: 15 }}
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
                <ApproverSection claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} />    
            </PanelContent>
        </Panel>
    );
};
