import { MenuItem } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { APP_TYPES } from '../../../../../Core/Enumerations/app/app-types';
import { CurrencyInput, DatePicker, Panel, PanelContent, PanelHeader, SelectList, SwitchInput, TextInput } from '../../../../../Core/Forms/Common';
import { userSelectors } from '../../../../../Core/State/slices/user';
import { findHelpTextByTag, loadHelpTags } from '../../../../Help/Queries';
import { TPOCPaymentInfoSection } from './TPOCPaymentInfoSection';
import { TPOCPaymentListSection } from './TPOCPaymentListSection';
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

export const MedicarePaymentInfoSection = ({ claim, request, dispatch, formValidator, onSave }) => {
    const $auth = useSelector(userSelectors.selectAuthContext());
    const isViewer = claim.fALClaimStatusTypeID === FAL_CLAIM_STATUS_TYPES.CLOSED || claim.fALClaimStatusTypeID === FAL_CLAIM_STATUS_TYPES.ERROR|| $auth.isReadOnly(APP_TYPES.Claimant);

    const [metadata, setMetadata] = React.useState({
        loading: true,
        helpTags: []
    });

    let currentMedicare = request.currentClaimant.medicare || {};
    let key = (currentMedicare.payments || []).length;

    const { formState: { errors } } = formValidator;

    React.useEffect(() => {
        Promise.all([
            loadHelpTags(request.helpContainerName)
        ])
            .then(([ helpTags]) => {
                setMetadata({
                    loading: false,
                    helpTags: (helpTags.data.list || []),
                });
            });
    }, []);

    const onValueChanged = (evt) => {
        let currentMedicare = request.currentClaimant.medicare || {};
        currentMedicare[evt.target.name] = evt.target.value;
        request.currentClaimant.medicare = currentMedicare;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
    };
    const onCheckBoxChanged = (evt) => {
        let currentMedicare = request.currentClaimant.medicare || {};
        currentMedicare[evt.target.name] = evt.target.checked;
        request.currentClaimant.medicare = currentMedicare;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
        onSave();
    };
    const onDateChanged = async (evt) => {
        let currentMedicare = request.currentClaimant.medicare || {};
        currentMedicare[evt.target.name] = evt.target.value ? new Date(evt.target.value).toISOString() : null;
        request.currentClaimant.medicare = currentMedicare;
        await dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
        onSave();
    };
    const onDropDownChanged = (evt) => {
        let currentMedicare = request.currentClaimant.medicare || {};

        currentMedicare[evt.target.name] = evt.target.value === "" ? null : JSON.parse(evt.target.value);
        request.currentClaimant.medicare = currentMedicare;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
        onSave();
    };
    const onCurrencyChanged = (evt) => {
        let currentMedicare = request.currentClaimant.medicare || {};
        currentMedicare[evt.target.name] = evt.target.value;
        request.currentClaimant.medicare = currentMedicare;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
    };


    return (
        <Panel>
            <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Medicare Payment</span></PanelHeader>
            <PanelContent>
                <ContentRow>
                    <ContentCell width="33%">
                        <SelectList
                            disabled={isViewer}
                            id="oRM"
                            name="oRM"
                            label="On-going Responsilbilty for Medicals (ORM)"
                            fullWidth={true}
                            onChange={onDropDownChanged}
                            variant="outlined"
                            value={currentMedicare.oRM}
                            allowempty={false}
                            tooltip={findHelpTextByTag("oRM", metadata.helpTags)}
                        >
                            <MenuItem value="true">Yes</MenuItem>
                            <MenuItem value="false">No</MenuItem>
                        </SelectList>
                    </ContentCell>
                    <ContentCell width="33%">
                        <DatePicker
                            disabled={isViewer}
                            id="oRMEstablishDate"
                            name="oRMEstablishDate"
                            label="ORM Established Date"
                            fullWidth={true}
                            required
                            onChange={onDateChanged}
                            variant="outlined"
                            error={errors?.oRMEstablishDate}
                            helperText={errors?.oRMEstablishDate ? errors?.oRMEstablishDate.message : ""}
                            value={currentMedicare.oRMEstablishDate || null}
                            tooltip={findHelpTextByTag("oRMEstablishDate", metadata.helpTags)}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <DatePicker
                            disabled={isViewer}
                            id="oRMTerminationDate"
                            name="oRMTerminationDate"
                            label="ORM Termination Date"
                            fullWidth={true}
                            onChange={onDateChanged}
                            variant="outlined"
                            error={errors?.oRMTerminationDate}
                            helperText={errors?.oRMTerminationDate ? errors?.oRMTerminationDate.message : ""}
                            value={currentMedicare.oRMTerminationDate || null}
                            tooltip={findHelpTextByTag("oRMTerminationDate", metadata.helpTags)}
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        <CurrencyInput
                            disabled={isViewer}
                            inputProps={{ maxLength: 13 }}
                            id="noFaultLimit"
                            name="noFaultLimit"
                            label="No Fault Insurance Limit"
                            value={currentMedicare.noFaultLimit}
                            onChange={onCurrencyChanged}
                            onBlur={onSave}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <DatePicker
                            disabled={isViewer}
                            id="exhaustDateForNoFault"
                            name="exhaustDateForNoFault"
                            label="Exhaust Date for No Fault Limit"
                            fullWidth={true}
                            required
                            onChange={onDateChanged}
                            variant="outlined"
                            error={errors?.exhaustDateForNoFault}
                            helperText={errors?.exhaustDateForNoFault ? errors?.exhaustDateForNoFault.message : ""}
                            value={currentMedicare.exhaustDateForNoFault || null}
                            tooltip={findHelpTextByTag("exhaustDateForNoFault", metadata.helpTags)}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <SwitchInput
                            disabled={isViewer}
                            id="tPOCFollowUp"
                            name="tPOCFollowUp"
                            label="TPOC Follow up required"
                            onChange={onCheckBoxChanged}
                            checked={currentMedicare.tPOCFollowUp}
                            tooltip={findHelpTextByTag("tPOCFollowUp", metadata.helpTags)}
                       />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="99%">
                        <TextInput
                            disabled={isViewer}
                            id="tPOCComment"
                            name="tPOCComment"
                            label="TPOC Comment"
                            fullWidth={true}
                            onChange={onValueChanged}
                            variant="outlined"
                            value={currentMedicare.tPOCComment}
                            inputProps={{ maxLength: 250 }}
                            onBlur={onSave}
                            tooltip={findHelpTextByTag("tPOCComment", metadata.helpTags)}
                       />
                    </ContentCell>
                </ContentRow>
                <TPOCPaymentInfoSection request={request} dispatch={dispatch} key={(request.currentPayment.tPOCPaymentID ? request.currentPayment.tPOCPaymentID : key)} formValidator={formValidator} onSave={onSave} helpTags={metadata.helpTags} />
                <TPOCPaymentListSection request={request} dispatch={dispatch} key={key + 1} />
            </PanelContent>
        </Panel>
    );
};
