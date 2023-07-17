import { MenuItem } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { APP_TYPES } from '../../../../../Core/Enumerations/app/app-types';
import { Panel, PanelContent, PanelHeader, SelectList, TextInput } from '../../../../../Core/Forms/Common';
import { getRiskStates } from '../../../../../Core/Services/EntityGateway';
import { userSelectors } from '../../../../../Core/State/slices/user';
import { findHelpTextByTag, loadHelpTags } from '../../../../Help/Queries';
import { FAL_CLAIM_STATUS_TYPES } from '../../../../../Core/Enumerations/app/fal_claim-status-types';

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

export const AttorneyInfoSection = ({claim, request, dispatch, formValidator, onSave }) => {
    const $auth = useSelector(userSelectors.selectAuthContext());
    const isViewer = claim.fALClaimStatusTypeID === FAL_CLAIM_STATUS_TYPES.CLOSED || claim.fALClaimStatusTypeID === FAL_CLAIM_STATUS_TYPES.ERROR||  $auth.isReadOnly(APP_TYPES.Claimant);
    let currentMedicare = request.currentClaimant.medicare || {};

    const { register, formState: { errors }, setValue } = formValidator;
    setValue("attorneyPhone", currentMedicare.attorneyPhone);
    console.log(currentMedicare.attorneyPhone);
    const [metadata, setMetadata] = React.useState({
        loading: true,
        riskStates: [],
        helpTags: []

    });

    const onValueChanged = (evt) => {   
        let currentMedicare = request.currentClaimant.medicare || {};

        setValue('attorneyPhone', evt.target.value ? evt.target.value : null);

        currentMedicare[evt.target.name] = evt.target.value.trimStart();

        request.currentClaimant.medicare = currentMedicare;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
    };
    const onDropDownChanged = (evt) => {
        setValue(evt.target.name, evt.target.value);
        let currentMedicare = request.currentClaimant.medicare || {};
        currentMedicare[evt.target.name] = evt.target.value;
        request.currentClaimant.medicare = currentMedicare;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
        onSave();
    };

    const phoneNumberFormatter = (payload) => {
        if (payload?.length === 10) {
            var match = payload?.match(/^(\d{3})(\d{3})(\d{4})$/);
            if (match) {
                return `(${match[1]}) ${match[2]}-${match[3]}`;
            }

        } else {
            if (payload?.includes('-')) {
                let matches = payload.replace(/[^\d]/g, '');
                setValue("attorneyPhone", matches)
                return matches;
            }
            return payload;
        }
    }
    const phoneNumberVal = React.useMemo(() => phoneNumberFormatter(currentMedicare.attorneyPhone), [currentMedicare.attorneyPhone]);
    
    React.useEffect(() => {
        Promise.all([
            getRiskStates(),
            loadHelpTags(request.helpContainerName)

        ])
            .then(([rs, helpTags]) => {
                setMetadata({
                    loading: false,
                    riskStates: (rs || []),
                    helpTags: (helpTags.data.list || []),
                });
            });
    }, []);


    return (
        <Panel>
            <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Medicare Attorney</span></PanelHeader>
            <PanelContent>
                <ContentRow>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="attorneyName"
                            name="attorneyName"
                            label="Attorney Name"
                            fullWidth={true}
                            variant="outlined"
                            value={currentMedicare.attorneyName}
                            inputProps={{ maxlength: 250 }}
                            tooltip={findHelpTextByTag("attorneyName", metadata.helpTags)}
                            onChange={onValueChanged}
                            onBlur={onSave}
                            error={errors.attorneyName}
                            helperText={errors.attorneyName ? errors.attorneyName.message : ""}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="attorneyFirmName"
                            name="attorneyFirmName"
                            label="Attorney Firm Name"
                            fullWidth={true}
                            variant="outlined"
                            value={currentMedicare.attorneyFirmName}
                            inputProps={{ maxlength: 250 }}
                            onBlur={onSave}
                            tooltip={findHelpTextByTag("attorneyFirmName", metadata.helpTags)}
                            onChange={onValueChanged}
                            error={errors.attorneyFirmName}
                            helperText={errors.attorneyFirmName ? errors.attorneyFirmName.message : ""}
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="66%">
                        <TextInput
                            disabled={isViewer}
                            id="attorneyAddressStree1"
                            name="attorneyAddressStree1"
                            label="Attorney Address Street 1"
                            fullWidth={true}
                            variant="outlined"
                            value={currentMedicare.attorneyAddressStree1}
                            inputProps={{ maxlength: 250 }}
                            tooltip={findHelpTextByTag("attorneyAddressStree1", metadata.helpTags)}
                            onChange={onValueChanged}
                            onBlur={onSave}
                            error={errors.attorneyAddressStree1}
                            helperText={errors.attorneyAddressStree1 ? errors.attorneyAddressStree1.message : ""}
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="66%">
                        <TextInput
                            disabled={isViewer}
                            id="attorneyAddressStree2"
                            name="attorneyAddressStree2"
                            label="Attorney Address Street 2"
                            fullWidth={true}
                            onChange={onValueChanged}
                            variant="outlined"
                            value={currentMedicare.attorneyAddressStree2}
                            inputProps={{ maxlength: 250 }}
                            onBlur={onSave}
                            tooltip={findHelpTextByTag("firstName", metadata.helpTags)}                            
                            error={errors.attorneyAddressStree2}
                            helperText={errors.attorneyAddressStree2 ? errors.attorneyAddressStree2.message : ""}
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="attorneyAddressCity"
                            name="attorneyAddressCity"
                            label="Attorney Address City"
                            fullWidth={true}
                            variant="outlined"
                            value={currentMedicare.attorneyAddressCity}
                            inputProps={{ maxlength: 50 }}
                            tooltip={findHelpTextByTag("firstName", metadata.helpTags)}
                            onChange={onValueChanged}
                            onBlur={onSave}
                            error={errors.attorneyAddressCity}
                            helperText={errors.attorneyAddressCity ? errors.attorneyAddressCity.message : ""}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        {
                            metadata.loading ? <>Loading...</> :
                                <SelectList
                                    disabled={isViewer}
                                    id="attorneyAddressState"
                                    name="attorneyAddressState"
                                    label="Attorney Address State"
                                    fullWidth={true}
                                    onChange={onDropDownChanged}
                                    variant="outlined"
                                    value={currentMedicare.attorneyAddressState || ""}
                                    tooltip={findHelpTextByTag("firstName", metadata.helpTags)}
                                    error={errors.attorneyAddressState}
                                    helperText={errors.attorneyAddressState ? errors.attorneyAddressState.message : ""}
                                >
                                    {
                                        metadata.riskStates.map(rs => <MenuItem value={rs.stateCode}>{rs.stateName}</MenuItem>)
                                    }
                                </SelectList>
                        }
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="attorneyTIN"
                            name="attorneyTIN"
                            label="Attorney TIN"
                            fullWidth={true}
                            variant="outlined"
                            value={currentMedicare.attorneyTIN}
                            inputProps={{ maxlength: 15 }}
                            tooltip={findHelpTextByTag("firstName", metadata.helpTags)}
                            onChange={onValueChanged}
                            onBlur={onSave}
                            error={errors.attorneyTIN}
                            helperText={errors.attorneyTIN ? errors.attorneyTIN.message : ""}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="attorneyPhone"
                            name="attorneyPhone"
                            label="Attorney Phone"
                            fullWidth={true}
                            variant="outlined"
                            value={phoneNumberVal}
                            inputProps={{ maxlength: 10 }}
                            tooltip={findHelpTextByTag("firstName", metadata.helpTags)}
                            {...register("attorneyPhone",
                                {
                                    required: "This is required.",
                                    pattern: {
                                        value: /[-()0-9 ]{10}/i,
                                        message: "Must be 10 numeric digits."
                                    },
                                    onChange: onValueChanged
                                }
                            )
                            }
                            onBlur={onSave}
                            error={errors.attorneyPhone}
                            helperText={errors.attorneyPhone ? errors.attorneyPhone.message : ""}
                       />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="attorneyZipCode"
                            name="attorneyZipCode"
                            label="Zip Code"
                            fullWidth={true}
                            variant="outlined"
                            value={currentMedicare.attorneyZipCode}
                            inputProps={{ maxlength: 15 }}
                            onChange={onValueChanged}
                            onBlur={onSave}
                            tooltip={findHelpTextByTag("attorneyZipCode", metadata.helpTags)}
                        />
                    </ContentCell>
                </ContentRow>
            </PanelContent>
        </Panel>
    );
};
