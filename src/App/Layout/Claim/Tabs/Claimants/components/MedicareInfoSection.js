import { MenuItem } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import { DatePicker, Panel, PanelContent, SelectList, TextInput, PanelHeader, SwitchInput } from '../../../../../Core/Forms/Common';
import { getRiskStates } from '../../../../../Core/Services/EntityGateway';
import { loadHelpTags, findHelpTextByTag } from '../../../../Help/Queries';
import { useSelector } from 'react-redux';
import { APP_TYPES } from '../../../../../Core/Enumerations/app/app-types';
import { userSelectors } from '../../../../../Core/State/slices/user';
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

export const MedicareInfoSection = ({ claim, request, dispatch, formValidator, onSave }) => {

    const $auth = useSelector(userSelectors.selectAuthContext());
    const isViewer = claim.fALClaimStatusTypeID === FAL_CLAIM_STATUS_TYPES.CLOSED || claim.fALClaimStatusTypeID === FAL_CLAIM_STATUS_TYPES.ERROR|| $auth.isReadOnly(APP_TYPES.Claimant);
    const [incidentDateError, setIncidentDateError] = React.useState(false);
    let currentMedicare = request.currentClaimant.medicare || {};

    const [metadata, setMetadata] = React.useState({
        loading: true,
        riskStates: [],
        helpTags: []
    });

    const onValueChanged = (evt) => {
        let currentMedicare = request.currentClaimant.medicare || {};
        currentMedicare[evt.target.name] = evt.target.value.trimStart();
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
    const onDateChanged = (evt) => {
        let currentMedicare = request.currentClaimant.medicare || {};
        currentMedicare[evt.target.name] = evt.target.value;
        request.currentClaimant.medicare = currentMedicare;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
        onSave();
    };
    const onDropDownChanged = (evt) => {
        let currentMedicare = request.currentClaimant.medicare || {};
        currentMedicare[evt.target.name] = evt.target.value;
        request.currentClaimant.medicare = currentMedicare;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
        onSave();
    };



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
            <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Medicare Details</span></PanelHeader>
            <PanelContent>
                <ContentRow>
                    <ContentCell width="33%">
                        <SwitchInput
                            disabled={isViewer}
                            id="deceased"
                            name="deceased"
                            label="Deceased Claimant"
                            checked={currentMedicare.deceased}
                            onChange={onCheckBoxChanged}
                            tooltip={findHelpTextByTag("deceased", metadata.helpTags)}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="hICNumber"
                            name="hICNumber"
                            label="Health Insurance Claim #"
                            fullWidth={true}
                            onChange={onValueChanged}
                            variant="outlined"
                            value={currentMedicare.hICNumber}
                            inputProps={{ maxlength: 50 }}
                            onBlur={onSave}
                            tooltip={findHelpTextByTag("hICNumber", metadata.helpTags)}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <DatePicker
                            disabled={isViewer}
                            id="cMSIncidentDate"
                            name="cMSIncidentDate"
                            label="CMS Incident Date"
                            required
                            fullWidth={true}
                            onChange={onDateChanged}
                            variant="outlined"
                            value={currentMedicare.cMSIncidentDate || null}
                            disableFuture={true}
                            error={incidentDateError}
                            helperText={incidentDateError? 'Incident date format is invalid':''}
                            tooltip={findHelpTextByTag("cMSIncidentDate", metadata.helpTags)}
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        <SelectList
                            disabled={isViewer}
                            id="selfInsuredTypeCode"
                            name="selfInsuredTypeCode"
                            label="Self Insured Type*"
                            fullWidth={true}
                            onChange={onDropDownChanged}
                            variant="outlined"
                            allowempty={false}
                            value={currentMedicare.selfInsuredTypeCode || ""}
                            tooltip={findHelpTextByTag("selfInsuredTypeCode", metadata.helpTags)}
                        >
                            <MenuItem value="N">N - Not Self insured</MenuItem>
                            <MenuItem value="I">I - Individual</MenuItem>
                            <MenuItem value="O">O - Other than Individual</MenuItem>
                        </SelectList>
                    </ContentCell>
                    <ContentCell width="33%">
                        <SwitchInput
                            disabled={isViewer}
                            id="foreignClaim"
                            name="foreignClaim"
                            label="Foreign Claim(outside US)"
                            checked={currentMedicare.foreignClaim}
                            onChange={onCheckBoxChanged}
                            tooltip={findHelpTextByTag("foreignClaim", metadata.helpTags)}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <SwitchInput
                            disabled={isViewer}
                            id="uSFedTort"
                            name="uSFedTort"
                            label="Federal Claim Tort Act"
                            onChange={onCheckBoxChanged}
                            checked={currentMedicare.uSFedTort}
                            tooltip={findHelpTextByTag("uSFedTort", metadata.helpTags)}
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        {
                            metadata.loading ? <>Loading...</> :
                                <SelectList
                                    disabled={isViewer}
                                    id="stateOfVenue"
                                    name="stateOfVenue"
                                    label="State Of Venue"
                                    fullWidth={true}
                                    onChange={onDropDownChanged}
                                    variant="outlined"
                                    value={currentMedicare.stateOfVenue || ""}
                                    tooltip={findHelpTextByTag("stateOfVenue", metadata.helpTags)}
                                >
                                    {
                                        metadata.riskStates.map(rs => <MenuItem value={rs.stateCode}>{rs.stateName}</MenuItem>)
                                    }
                                </SelectList>
                        }
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="policyHolderFirstName"
                            name="policyHolderFirstName"
                            label="Policyholder First Name"
                            fullWidth={true}
                            onChange={onValueChanged}
                            variant="outlined"
                            value={currentMedicare.policyHolderFirstName}
                            inputProps={{ maxlength: 50 }}
                            onBlur={onSave}
                            tooltip={findHelpTextByTag("policyHolderFirstName", metadata.helpTags)}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="policyHolderLastName"
                            name="policyHolderLastName"
                            label="Policyholder Last Name"
                            fullWidth={true}
                            onChange={onValueChanged}
                            variant="outlined"
                            value={currentMedicare.policyHolderLastName}
                            inputProps={{ maxlength: 50 }}
                            onBlur={onSave}
                            tooltip={findHelpTextByTag("policyHolderLastName", metadata.helpTags)}
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="dBAName"
                            name="dBAName"
                            label="DBA Name"
                            fullWidth={true}
                            onChange={onValueChanged}
                            variant="outlined"
                            value={currentMedicare.dBAName}
                            inputProps={{ maxlength: 100 }}
                            onBlur={onSave}
                            tooltip={findHelpTextByTag("dBAName", metadata.helpTags)}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="legalName"
                            name="legalName"
                            label="Legal Name"
                            fullWidth={true}
                            onChange={onValueChanged}
                            variant="outlined"
                            value={currentMedicare.legalName}
                            inputProps={{ maxlength: 100 }}
                            onBlur={onSave}
                            tooltip={findHelpTextByTag("legalName", metadata.helpTags)}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <SelectList
                            disabled={isViewer}
                            id="iNSPlanTypeCode"
                            name="iNSPlanTypeCode"
                            label="Plan Type"
                            fullWidth={true}
                            onChange={onDropDownChanged}
                            variant="outlined"
                            allowempty={false}
                            value={currentMedicare.iNSPlanTypeCode || ""}
                            tooltip={findHelpTextByTag("iNSPlanTypeCode", metadata.helpTags)}
                        >
                            <MenuItem value="D">D - MedPay -No Fault</MenuItem>
                            <MenuItem value="L">L - Liability</MenuItem>
                        </SelectList>
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        <SelectList
                            disabled={isViewer}
                            id="productLiablilityCode"
                            name="productLiablilityCode"
                            label="Product Liablility"
                            fullWidth={true}
                            required
                            onChange={onDropDownChanged}
                            variant="outlined"
                            allowempty={false}
                            value={currentMedicare.productLiablilityCode || ""}
                            tooltip={findHelpTextByTag("productLiablilityCode", metadata.helpTags)}
                        >
                            <MenuItem value="1">1 - No</MenuItem>
                            <MenuItem value="2">2 - Yes but no mass mart</MenuItem>
                            <MenuItem value="3">3 - Yes and mass mart</MenuItem>
                        </SelectList>
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="productBrandName"
                            name="productBrandName"
                            label="Product Name"
                            fullWidth={true}
                            onChange={onValueChanged}
                            variant="outlined"
                            value={currentMedicare.productBrandName}
                            inputProps={{ maxlength: 250 }}
                            onBlur={onSave}
                            tooltip={findHelpTextByTag("productBrandName", metadata.helpTags)}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="productGenericName"
                            name="productGenericName"
                            label="Product Generic Name"
                            fullWidth={true}
                            onChange={onValueChanged}
                            variant="outlined"
                            value={currentMedicare.productGenericName}
                            inputProps={{ maxlength: 250 }}
                            onBlur={onSave}
                            tooltip={findHelpTextByTag("productGenericName", metadata.helpTags)}
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="productManufacturer"
                            name="productManufacturer"
                            label="Product Manufacturer"
                            fullWidth={true}
                            onChange={onValueChanged}
                            variant="outlined"
                            value={currentMedicare.productManufacturer}
                            inputProps={{ maxlength: 250 }}
                            onBlur={onSave}
                            tooltip={findHelpTextByTag("productManufacturer", metadata.helpTags)}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="productAllegedHarm"
                            name="productAllegedHarm"
                            label="Product Alleged Harm"
                            fullWidth={true}
                            onChange={onValueChanged}
                            variant="outlined"
                            value={currentMedicare.productAllegedHarm}
                            inputProps={{ maxlength: 250 }}
                            onBlur={onSave}
                            tooltip={findHelpTextByTag("productAllegedHarm", metadata.helpTags)}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <SelectList
                            disabled={isViewer}
                            id="injuryPartyRepCode"
                            name="injuryPartyRepCode"
                            label="Injured Party Representative"
                            fullWidth={true}
                            required
                            onChange={onDropDownChanged}
                            variant="outlined"
                            value={currentMedicare.injuryPartyRepCode || ""}
                            tooltip={findHelpTextByTag("injuryPartyRepCode", metadata.helpTags)}
                        >
                            <MenuItem value="A">A - Attorney</MenuItem>
                            <MenuItem value="G">G - Guardian/Conservator</MenuItem>
                            <MenuItem value="P">P - Power of Attorney</MenuItem>
                            <MenuItem value="O">O - Other</MenuItem>
                            <MenuItem value="N">N - None</MenuItem>
                        </SelectList>
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="99%">
                        <TextInput
                            disabled={isViewer}
                            id="descriptionOfInjury"
                            name="descriptionOfInjury"
                            label="Description of Injury"
                            fullWidth={true}
                            required
                            onChange={onValueChanged}
                            variant="outlined"
                            value={currentMedicare.descriptionOfInjury}
                            inputProps={{ maxlength: 50 }}
                            onBlur={onSave}
                            tooltip={findHelpTextByTag("descriptionOfInjury", metadata.helpTags)}
                        />
                    </ContentCell>
                </ContentRow>
            </PanelContent>
        </Panel>
    );
};
