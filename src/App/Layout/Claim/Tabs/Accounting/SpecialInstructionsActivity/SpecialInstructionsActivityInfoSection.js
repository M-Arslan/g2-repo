import { Divider, MenuItem } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { APP_TYPES } from '../../../../../Core/Enumerations/app/app-types';
import { CurrencyInput, Panel, PanelContent, PanelHeader, SelectList, TextInput } from '../../../../../Core/Forms/Common';
import { userSelectors } from '../../../../../Core/State/slices/user';
import { findHelpTextByTag, loadHelpTags } from '../../../../Help/Queries';
import { ClaimActivityStatusInfoSection } from '../ClaimActivityStatusInfoSection';
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
    padding: 1em;tr
`;

export const SpecialInstructionsActivityInfoSection = ({ claim, request, dispatch, formValidator, onSave }) => {
    const $auth = useSelector(userSelectors.selectAuthContext());
    const isViewer = ($auth.isReadOnly(APP_TYPES.Financials)) || (request.currentClaimActivity.activityID && request.currentClaimActivity.claimStatusTypeID !== CLAIM_STATUS_TYPE.OUTSTANDING_ISSUE);
    const { formState: { errors }, setValue } = formValidator;
    const currentClaimActivity = request.currentClaimActivity || {};
    const currentSpecialInstructions = currentClaimActivity.specialInstructions || {};
    setValue("recoveryType", currentSpecialInstructions.recoveryType);

    const [metadata, setMetadata] = React.useState({
        loading: true,
        helpTags: []
    });
    const onCurrencyChanged = (evt) => {
        currentSpecialInstructions[evt.target.name] = evt.target.value;
        currentClaimActivity.specialInstructions = currentSpecialInstructions;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentClaimActivity: currentClaimActivity } });
    };
    const onValueChanged = (evt) => {
        currentSpecialInstructions[evt.target.name] = evt.target.value.trimStart();
        currentClaimActivity.specialInstructions = currentSpecialInstructions;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentClaimActivity: currentClaimActivity } });
    };
    const onDropDownChanged = (evt) => {
        setValue(evt.target.name, evt.target.value);
        currentSpecialInstructions[evt.target.name] = evt.target.value;
        currentClaimActivity.specialInstructions = currentSpecialInstructions;
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
                <ContentRow>
                    <ContentCell width="33%">
                        <TextInput
                            label="Draft Number"
                            disabled={isViewer}
                            id="draftNumber"
                            name="draftNumber"
                            fullWidth={true}
                            variant="outlined"
                            onChange={onValueChanged}
                            value={currentSpecialInstructions.draftNumber}
                            tooltip={findHelpTextByTag("draftNumber", metadata.helpTags)}
                            inputProps={{ maxlength: 20 }}
                            error={errors.draftNumber}
                            helperText={errors.draftNumber ? errors.draftNumber.message : ""}
                        />
                    </ContentCell>
                    <ContentCell width="67%">
                        <TextInput
                            label="Reason"
                            disabled={isViewer}
                            id="reason"
                            name="reason"
                            fullWidth={true}
                            variant="outlined"
                            onChange={onValueChanged}
                            value={currentSpecialInstructions.reason}
                            tooltip={findHelpTextByTag("reason", metadata.helpTags)}
                            inputProps={{ maxlength: 255 }}
                            error={errors.reason}
                            helperText={errors.reason ? errors.reason.message : ""}

                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        {
                            metadata.loading ? <div>Loading...</div> :
                                <SelectList
                                    disabled={isViewer}
                                    id="recoveryType"
                                    name="recoveryType"
                                    label="Recovery Type"
                                    fullWidth={true}
                                    onChange={onDropDownChanged}
                                    value={currentSpecialInstructions.recoveryType || ""}
                                    variant="outlined"
                                    tooltip={findHelpTextByTag("recoveryType", metadata.helpTags)}
                                    error={errors.recoveryType}
                                    helperText={errors.recoveryType ? errors.recoveryType.message : ""}
                                >
                                    <MenuItem value="I">Indemnity</MenuItem>
                                    <MenuItem value="E">Expense</MenuItem>
                                    <MenuItem value="IE">Indemnity and Expense</MenuItem>
                                </SelectList>
                        }
                    </ContentCell>
                    <ContentCell width="33%">
                        <CurrencyInput
                            disabled={isViewer}
                            inputProps={{ maxlength: 15 }}
                            allowDecimal={true}
                            id="recoveryAmount"
                            name="recoveryAmount"
                            label="Recovery Amount"
                            value={currentSpecialInstructions.recoveryAmount}
                            onChange={onCurrencyChanged}
                            tooltip={findHelpTextByTag("recoveryAmount", metadata.helpTags)}
                            error={errors.recoveryAmount}
                            helperText={errors.recoveryAmount ? errors.recoveryAmount.message : ""}

                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="67%">
                        <TextInput
                            label="Comments"
                            disabled={isViewer}
                            id="comment"
                            name="comment"
                            fullWidth={true}
                            variant="outlined"
                            onChange={onValueChanged}
                            value={currentSpecialInstructions.comment}
                            inputProps={{ maxlength: 500 }}
                            tooltip={findHelpTextByTag("comment", metadata.helpTags)}
                            multiline
                            rows={3}
                        />
                    </ContentCell>
                </ContentRow>
            </PanelContent>
        </Panel>
    );
};
