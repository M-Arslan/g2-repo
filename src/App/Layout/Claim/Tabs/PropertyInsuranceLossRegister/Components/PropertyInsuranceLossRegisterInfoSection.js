import { MenuItem } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import { Panel, PanelContent, PanelHeader, SelectList, TextInput, CurrencyInput, formatDate } from '../../../../../Core/Forms/Common';
import { getRiskStates, getCompanies } from '../../../../../Core/Services/EntityGateway';
import { loadHelpTags, findHelpTextByTag } from '../../../../Help/Queries';
import { loadCauseOfLossCodes } from '../../Accounting/Queries/loadMetaData';


import { useSelector } from 'react-redux';
import { APP_TYPES } from '../../../../../Core/Enumerations/app/app-types';
import { CLAIM_STATUS_TYPE } from '../../../../../Core/Enumerations/app/claim-status-type';
import { userSelectors } from '../../../../../Core/State/slices/user';
import { zipFormat } from '../../../../../Core/Utility/common';
import { USZip } from '../../../../../Core/Providers/FormProvider';

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

export const PropertyInsuranceLossRegisterInfoSection = ({ request, dispatch, formValidator, onSave }) => {
    const $auth = useSelector(userSelectors.selectAuthContext());
    const isViewer = $auth.isReadOnly(APP_TYPES.Claimant) || ((request.currentClaimActivity || {}).claimStatusTypeID !== CLAIM_STATUS_TYPE.OUTSTANDING_ISSUE && request.currentPropertyInsuranceLossRegister.propertyInsuranceLossRegisterID);

    let currentPropertyInsuranceLossRegister = request.currentPropertyInsuranceLossRegister;

    const { formState: { errors }, setValue, register } = formValidator;

    setValue("companyCodeRef", currentPropertyInsuranceLossRegister.companyCodeRef);
    setValue("policyType", currentPropertyInsuranceLossRegister.policyType);
    setValue("lossAddressStreet1", currentPropertyInsuranceLossRegister.lossAddressStreet1);
    setValue("lossAddressCity", currentPropertyInsuranceLossRegister.lossAddressCity);
    setValue("lossAddressState", currentPropertyInsuranceLossRegister.lossAddressState);
    setValue("lossAddressZIP", currentPropertyInsuranceLossRegister.lossAddressZIP);
    setValue("lossDesc", currentPropertyInsuranceLossRegister.lossDesc);
    setValue("insuredRole", currentPropertyInsuranceLossRegister.insuredRole);
    setValue("insuredBusiness", currentPropertyInsuranceLossRegister.insuredBusiness);
    setValue("insuredAddressStreet1", currentPropertyInsuranceLossRegister.insuredAddressStreet1);
    setValue("insuredAddressCity", currentPropertyInsuranceLossRegister.insuredAddressCity);
    setValue("insuredAddressState", currentPropertyInsuranceLossRegister.insuredAddressState);
    setValue("insuredAddressZIP", currentPropertyInsuranceLossRegister.insuredAddressZIP);
    setValue("causeOfLossCode", currentPropertyInsuranceLossRegister.causeOfLossCode);
    setValue("propertyLost", currentPropertyInsuranceLossRegister.propertyLost);

    const [metadata, setMetadata] = React.useState({
        loading: true,
        riskStates: [],
        helpTags: []
    });

    const onValueChanged = (evt) => {
        const { name, value } = evt.target;
        setValue(name, value ? value : null);
        request.currentPropertyInsuranceLossRegister[evt.target.name] = evt.target.value.trimStart();
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
    };
    const onDropDownChanged = (evt) => {
        const { name, value } = evt.target;
        setValue(name, value ? value : null);
        setValue(evt.target.name, evt.target.value || null);
        request.currentPropertyInsuranceLossRegister[evt.target.name] = evt.target.value;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
    };
    const onCurrencyChanged = (evt) => {
        request.currentPropertyInsuranceLossRegister[evt.target.name] = evt.target.value;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
    };
    React.useEffect(() => {
        Promise.all([
            getRiskStates(),
            getCompanies(),
            loadCauseOfLossCodes(),
            loadHelpTags(request.helpContainerName)
        ])
            .then(([rs, companies, lossCodes, helpTags]) => {
                setMetadata({
                    loading: false,
                    riskStates: (rs || []),
                    companies: (companies || []),
                    lossCodes: (lossCodes.data.causeOfLossCodesList || []),
                    helpTags: (helpTags.data.list || []),
                });
            });


    }, []);

    return (
        <Panel>
            <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>PILR Details</span></PanelHeader>
            <PanelContent>
                <ContentRow>
                    <ContentCell width="33%">
                        {
                            metadata.loading ? <>Loading...</> :
                                <SelectList
                                    disabled={isViewer}
                                    id="companyCodeRef"
                                    name="companyCodeRef"
                                    label="Company"
                                    required
                                    fullWidth={true}
                                    variant="outlined"
                                    value={currentPropertyInsuranceLossRegister.companyCodeRef || ""}
                                    {...register("companyCodeRef", {
                                        required: "This field is required",
                                        onChange: (e) => onDropDownChanged(e),
                                    })}

                                    tooltip={findHelpTextByTag("companyCodeRef", metadata.helpTags)}
                                    error={errors.companyCodeRef}
                                    helperText={errors.companyCodeRef ? errors.companyCodeRef.message : ""}
                                >
                                    {
                                        metadata.companies.map(rs => <MenuItem value={rs.companyCode}>{rs.companyName}</MenuItem>)
                                    }
                                </SelectList>
                        }
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="policyType"
                            name="policyType"
                            label="Policy Type"
                            required
                            fullWidth={true}
                            variant="outlined"
                            value={currentPropertyInsuranceLossRegister.policyType}
                            inputProps={{ maxlength: 50 }}
                            {...register("policyType", {
                                required: "This field is required",
                                onChange: (e) => onValueChanged(e),
                            })}
                            error={errors.policyType}
                            helperText={errors.policyType ? errors.policyType.message : ""}
                            
                            tooltip={findHelpTextByTag("policyType", metadata.helpTags)}
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            label="Claim Number"
                            InputProps={{ readOnly: true }}
                            fullWidth={true}
                            variant="outlined"
                            value={request.claim.claimID}
                            tooltip={findHelpTextByTag("claimID", metadata.helpTags)}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            label="Date Of Loss"
                            InputProps={{ readOnly: true }}
                            fullWidth={true}
                            variant="outlined"
                            value={formatDate(request.claim.dOL)}
                            tooltip={findHelpTextByTag("dOL", metadata.helpTags)}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            label="Policy Number"
                            InputProps={{ readOnly: true }}
                            fullWidth={true}
                            variant="outlined"
                            value={(request.claim.claimPolicy || {}).policyID || request.claim.claimPolicyID}
                            tooltip={findHelpTextByTag("dOL", metadata.helpTags)}
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="lossAddressStreet1"
                            name="lossAddressStreet1"
                            label="Loss Address Street 1"
                            required
                            fullWidth={true}
                            variant="outlined"
                            value={currentPropertyInsuranceLossRegister.lossAddressStreet1 || ""}
                            inputProps={{ maxlength: 250 }}
                            {...register("lossAddressStreet1", {
                                required: "This field is required",
                                onChange: (e) => onValueChanged(e),
                            })}
                            error={errors.lossAddressStreet1}
                            helperText={errors.lossAddressStreet1 ? errors.lossAddressStreet1.message : ""}
                            
                            tooltip={findHelpTextByTag("lossAddressStreet1", metadata.helpTags)}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="lossAddressStreet2"
                            name="lossAddressStreet2"
                            label="Loss Address Street 2"
                            fullWidth={true}
                            onChange={onValueChanged}
                            variant="outlined"
                            value={currentPropertyInsuranceLossRegister.lossAddressStreet2 || ""}
                            inputProps={{ maxlength: 250 }}                            
                            error={errors.lossAddressStreet2}
                            helperText={errors.lossAddressStreet2 ? errors.lossAddressStreet2.message : ""}
                            
                            tooltip={findHelpTextByTag("lossAddressStreet2", metadata.helpTags)}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="lossAddressCity"
                            name="lossAddressCity"
                            label="Loss Address City"
                            required
                            fullWidth={true}
                            variant="outlined"
                            value={currentPropertyInsuranceLossRegister.lossAddressCity || ""}
                            inputProps={{ maxlength: 250 }}
                            {...register("lossAddressCity", {
                                required: "This field is required",
                                pattern: {
                                    value: /^[a-zA-Z `',.-]*$/i,
                                    message: "Must contain characters only"
                                },
                                onChange: (e) => onValueChanged(e),
                            })}

                            error={errors.lossAddressCity}
                            helperText={errors.lossAddressCity ? errors.lossAddressCity.message : ""}
                            
                            tooltip={findHelpTextByTag("lossAddressCity", metadata.helpTags)}
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        {
                            metadata.loading ? <>Loading...</> :
                                <SelectList
                                    disabled={isViewer}
                                    id="lossAddressState"
                                    name="lossAddressState"
                                    label="Loss Address State"
                                    required
                                    fullWidth={true}
                                    variant="outlined"
                                    value={currentPropertyInsuranceLossRegister.lossAddressState || ""}
                                    {...register("lossAddressState", {
                                        required: "This field is required",
                                        onChange: (e) => onDropDownChanged(e),
                                    })}
                                    tooltip={findHelpTextByTag("lossAddressState", metadata.helpTags)}
                                    error={errors.lossAddressState}
                                    helperText={errors.lossAddressState ? errors.lossAddressState.message : ""}
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
                            id="lossAddressZIP"
                            name="lossAddressZIP"
                            label="Loss Address ZIP"
                            required
                            fullWidth={true}
                            variant="outlined"
                            value={currentPropertyInsuranceLossRegister.lossAddressZIP || ""}
                            inputProps={{ maxlength: 10 }}
                            {...register("lossAddressZIP", {
                                required: "This field is required",
                                pattern: {
                                    value: USZip,
                                    message: "This field is invalid."
                                },
                                onChange: (e) => zipFormat(onValueChanged,e),
                            })}
                            error={errors.lossAddressZIP}
                            helperText={errors.lossAddressZIP ? errors.lossAddressZIP.message : ""}
                            
                            tooltip={findHelpTextByTag("lossAddressZIP", metadata.helpTags)}
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="lossDesc"
                            name="lossDesc"
                            label="Loss Description"
                            required
                            fullWidth={true}
                            variant="outlined"
                            value={currentPropertyInsuranceLossRegister.lossDesc}
                            inputProps={{ maxlength: 1024 }}
                            {...register("lossDesc", {
                                required: "This field is required",
                                onChange: (e) => onValueChanged(e),
                            })}
                            error={errors.lossDesc}
                            helperText={errors.lossDesc ? errors.lossDesc.message : ""}
                            
                            tooltip={findHelpTextByTag("lossDesc", metadata.helpTags)}
                        />
                    </ContentCell>
                </ContentRow>
                <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Insured Information</span></PanelHeader>
                <ContentRow>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            label="Insured Name"
                            InputProps={{ readOnly: true }}
                            fullWidth={true}
                            variant="outlined"
                            value={(request.claim.insuredName ? request.claim.insuredName : request.claim.claimPolicy ? request.claim.claimPolicy.insuredName:'' || "") + ' ' + (request.claim.insuredNameContinuation || "")}
                            tooltip={findHelpTextByTag("insuredName", metadata.helpTags)}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="insuredRole"
                            name="insuredRole"
                            label="Insured Role"
                            required
                            fullWidth={true}
                            variant="outlined"
                            value={currentPropertyInsuranceLossRegister.insuredRole}
                            inputProps={{ maxlength: 50 }}
                            {...register("insuredRole", {
                                required: "This field is required",
                                onChange: (e) => onValueChanged(e),
                            })}
                            error={errors.insuredRole}
                            helperText={errors.insuredRole ? errors.insuredRole.message : ""}
                            
                            tooltip={findHelpTextByTag("insuredRole", metadata.helpTags)}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="insuredBusiness"
                            name="insuredBusiness"
                            label="Insured Business"
                            required
                            fullWidth={true}
                            variant="outlined"
                            value={currentPropertyInsuranceLossRegister.insuredBusiness}
                            inputProps={{ maxlength: 100 }}
                            {...register("insuredBusiness", {
                                required: "This field is required",
                                onChange: (e) => onValueChanged(e),
                            })}
                            error={errors.insuredBusiness}
                            helperText={errors.insuredBusiness ? errors.insuredBusiness.message : ""}
                            
                            tooltip={findHelpTextByTag("insuredBusiness", metadata.helpTags)}
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="insuredAddressStreet1"
                            name="insuredAddressStreet1"
                            label="Insured Address Street 1"
                            required
                            fullWidth={true}
                            variant="outlined"
                            value={currentPropertyInsuranceLossRegister.insuredAddressStreet1 || ""}
                            inputProps={{ maxlength: 250 }}
                            {...register("insuredAddressStreet1", {
                                required: "This field is required",
                                onChange: (e) => onValueChanged(e),
                            })}
                            error={errors.insuredAddressStreet1}
                            helperText={errors.insuredAddressStreet1 ? errors.insuredAddressStreet1.message : ""}
                            
                            tooltip={findHelpTextByTag("insuredAddressStreet1", metadata.helpTags)}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="insuredAddressStreet2"
                            name="insuredAddressStreet2"
                            label="Insured Address Street 2"
                            fullWidth={true}
                            onChange={onValueChanged}
                            variant="outlined"
                            value={currentPropertyInsuranceLossRegister.insuredAddressStreet2 || "" }
                            inputProps={{ maxlength: 250 }}                            
                            error={errors.insuredAddressStreet2}
                            helperText={errors.insuredAddressStreet2 ? errors.insuredAddressStreet2.message : ""}
                            
                            tooltip={findHelpTextByTag("lossAddressStreet2", metadata.helpTags)}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="insuredAddressCity"
                            name="insuredAddressCity"
                            label="Insured Address City"
                            required
                            fullWidth={true}
                            variant="outlined"
                            value={currentPropertyInsuranceLossRegister.insuredAddressCity || ""}
                            inputProps={{ maxlength: 250 }}
                            {...register("insuredAddressCity", {
                                required: "This field is required",
                                pattern: {
                                    value: /^[a-zA-Z `',.-]*$/i,
                                    message: "Must contain characters only"
                                },
                                onChange: (e) => onValueChanged(e),
                            })}
                            error={errors.insuredAddressCity}
                            helperText={errors.insuredAddressCity ? errors.insuredAddressCity.message : ""}
                            
                            tooltip={findHelpTextByTag("insuredAddressCity", metadata.helpTags)}
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        {
                            metadata.loading ? <>Loading...</> :
                                <SelectList
                                    disabled={isViewer}
                                    id="insuredAddressState"
                                    name="insuredAddressState"
                                    label="Insured Address State"
                                    required
                                    fullWidth={true}
                                    variant="outlined"
                                    value={currentPropertyInsuranceLossRegister.insuredAddressState || ""}
                                    {...register("insuredAddressState", {
                                        required: "This field is required",
                                        onChange: (e) => onDropDownChanged(e),
                                    })}
                                    tooltip={findHelpTextByTag("insuredAddressState", metadata.helpTags)}
                                    error={errors.insuredAddressState}
                                    helperText={errors.insuredAddressState ? errors.insuredAddressState.message : ""}
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
                            id="insuredAddressZIP"
                            name="insuredAddressZIP"
                            label="Insured Address ZIP"
                            required
                            fullWidth={true}
                            variant="outlined"
                            value={currentPropertyInsuranceLossRegister.insuredAddressZIP || "" }
                            inputProps={{ maxlength: 10 }}
                            {...register("insuredAddressZIP", {
                                required: "This field is required",
                                pattern: {
                                    value: USZip,
                                    message: "This field is invalid."
                                },
                                onChange: (e) => zipFormat(onValueChanged,e),
                            })}
                            error={errors.insuredAddressZIP}
                            helperText={errors.insuredAddressZIP ? errors.insuredAddressZIP.message : ""}
                            
                            tooltip={findHelpTextByTag("insuredAddressZIP", metadata.helpTags)}
                        />
                    </ContentCell>
                </ContentRow>
                <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>AKA Information</span></PanelHeader>
                <ContentRow>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="akaBusiness"
                            name="akaBusiness"
                            label="Aka Business"
                            fullWidth={true}
                            variant="outlined"
                            value={currentPropertyInsuranceLossRegister.akaBusiness}
                            inputProps={{ maxlength: 100 }}
                            onChange={onValueChanged}
                            error={errors.akaBusiness}
                            helperText={errors.akaBusiness ? errors.akaBusiness.message : ""}
                            tooltip={findHelpTextByTag("lossDesc", metadata.helpTags)}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="akaName"
                            name="akaName"
                            label="Aka Name"
                            onChange={onValueChanged}
                            fullWidth={true}
                            variant="outlined"
                            value={currentPropertyInsuranceLossRegister.akaName}
                            inputProps={{ maxlength: 50 }}
                            error={errors.akaName}
                            helperText={errors.akaName ? errors.akaName.message : ""}
                            
                            tooltip={findHelpTextByTag("akaName", metadata.helpTags)}
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="akaAddressStreet1"
                            name="akaAddressStreet1"
                            label="Aka Address Street 1"
                            onChange={onValueChanged}
                            fullWidth={true}
                            variant="outlined"
                            value={currentPropertyInsuranceLossRegister.akaAddressStreet1}
                            inputProps={{ maxlength: 250 }}
                            error={errors.akaAddressStreet1}
                            helperText={errors.akaAddressStreet1 ? errors.akaAddressStreet1.message : ""}
                            
                            tooltip={findHelpTextByTag("akaAddressStreet1", metadata.helpTags)}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="akaAddressStreet2"
                            name="akaAddressStreet2"
                            label="Aka Address Street 2"
                            onChange={onValueChanged}
                            fullWidth={true}
                            variant="outlined"
                            value={currentPropertyInsuranceLossRegister.akaAddressStreet2}
                            inputProps={{ maxlength: 250 }}
                            error={errors.akaAddressStreet2}
                            helperText={errors.akaAddressStreet2 ? errors.akaAddressStreet2.message : ""}
                            
                            tooltip={findHelpTextByTag("lossAddressStreet2", metadata.helpTags)}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="akaAddressCity"
                            name="akaAddressCity"
                            label="Aka Address City"
                            fullWidth={true}
                            variant="outlined"
                            value={currentPropertyInsuranceLossRegister.akaAddressCity}
                            inputProps={{ maxlength: 250 }}
                            onChange={onValueChanged}
                            error={errors.akaAddressCity}
                            helperText={errors.akaAddressCity ? errors.akaAddressCity.message : ""}
                            
                            tooltip={findHelpTextByTag("akaAddressCity", metadata.helpTags)}
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        {
                            metadata.loading ? <>Loading...</> :
                                <SelectList
                                    disabled={isViewer}
                                    id="akaAddressState"
                                    name="akaAddressState"
                                    label="Aka Address State"
                                    fullWidth={true}
                                    onChange={onDropDownChanged}
                                    variant="outlined"
                                    value={currentPropertyInsuranceLossRegister.akaAddressState || ""}
                                    tooltip={findHelpTextByTag("akaAddressState", metadata.helpTags)}
                                    error={errors.akaAddressState}
                                    helperText={errors.akaAddressState ? errors.akaAddressState.message : ""}
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
                            id="akaAddressZIP"
                            name="akaAddressZIP"
                            label="Aka Address ZIP"
                            fullWidth={true}
                            variant="outlined"
                            value={currentPropertyInsuranceLossRegister.akaAddressZIP}
                            inputProps={{ maxlength: 6 }}
                            onChange={(e) => zipFormat(onValueChanged,e)}
                            error={errors.akaAddressZIP}
                            helperText={errors.akaAddressZIP ? errors.akaAddressZIP.message : ""}
                            
                            tooltip={findHelpTextByTag("akaAddressZIP", metadata.helpTags)}
                        />
                    </ContentCell>
                </ContentRow>
                <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Loss Information</span></PanelHeader>
                <ContentRow>
                    <ContentCell width="33%">
                        {
                            metadata.loading ? <div>Loading...</div> :
                                <SelectList
                                    disabled={isViewer}
                                    id="causeOfLossCode"
                                    name="causeOfLossCode"
                                    label="Cause of Loss"
                                    required
                                    fullWidth={true}
                                    variant="outlined"
                                    value={currentPropertyInsuranceLossRegister.causeOfLossCode || ""}
                                    tooltip={findHelpTextByTag("causeOfLossCode", metadata.helpTags)}
                                    {...register("causeOfLossCode", {
                                        required: "This field is required",
                                        onChange: (e) => onDropDownChanged(e),
                                    })}
                                    error={errors.causeOfLossCode}
                                    helperText={errors.causeOfLossCode ? errors.causeOfLossCode.message : ""}
                                >
                                    {
                                        metadata.lossCodes
                                            .map((item, idx) => <MenuItem value={item.code} key={item.code}>{item.description}</MenuItem>)
                                    }
                                </SelectList>
                        }
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="propertyLost"
                            name="propertyLost"
                            label="Property Lost"
                            fullWidth={true}
                            required
                            variant="outlined"
                            value={currentPropertyInsuranceLossRegister.propertyLost}
                            inputProps={{ maxlength: 500 }}
                            {...register("propertyLost", {
                                required: "This field is required",
                                pattern: {
                                    value: /^[a-zA-Z ]*$/i,
                                    message: "Must contain characters only"
                                },
                                onChange: (e) => onValueChanged(e),
                            })}
                            error={errors.propertyLost}
                            helperText={errors.propertyLost ? errors.propertyLost.message : ""}
                            tooltip={findHelpTextByTag("propertyLost", metadata.helpTags)}
                            

                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="vehicleID"
                            name="vehicleID"
                            label="Vehicle ID"
                            fullWidth={true}
                            variant="outlined"
                            required
                            value={currentPropertyInsuranceLossRegister.vehicleID}
                            inputProps={{ maxlength: 20 }}
                            onChange={onValueChanged}
                            error={errors.vehicleID}
                            helperText={errors.vehicleID ? errors.vehicleID.message : ""}
                            tooltip={findHelpTextByTag("vehicleID", metadata.helpTags)}


                        />
                    </ContentCell>
                </ContentRow>
                <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Amount of Policy</span></PanelHeader>
                <ContentRow>
                    <ContentCell width="33%">
                        <CurrencyInput
                            disabled={isViewer}
                            id="amountOfPolicyBuilding"
                            name="amountOfPolicyBuilding"
                            inputProps={{ maxlength: 15 }}
                            label="Building"
                            fullWidth={true}
                            variant="outlined"
                            required
                            value={currentPropertyInsuranceLossRegister.amountOfPolicyBuilding}
                            {...register("amountOfPolicyBuilding", {
                                required: "This field is required",
                                pattern: {
                                    value: /^[a-zA-Z ]*$/i,
                                    message: "Must contain characters only"
                                },
                                onChange: (e) => onCurrencyChanged(e),
                            })}
                            error={errors.amountOfPolicyBuilding}
                            helperText={errors.amountOfPolicyBuilding ? errors.amountOfPolicyBuilding.message : ""}
                            tooltip={findHelpTextByTag("amountOfPolicyBuilding", metadata.helpTags)}
                            

                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <CurrencyInput
                            disabled={isViewer}
                            id="amountOfPolicyContents"
                            inputProps={{ maxlength: 15 }}
                            name="amountOfPolicyContents"
                            label="Contents"
                            fullWidth={true}
                            variant="outlined"
                            required
                            value={currentPropertyInsuranceLossRegister.amountOfPolicyContents}
                            {...register("amountOfPolicyContents", {
                                required: "This field is required",
                                pattern: {
                                    value: /^[a-zA-Z ]*$/i,
                                    message: "Must contain characters only"
                                },
                                onChange: (e) => onCurrencyChanged(e),
                            })}
                            error={errors.amountOfPolicyContents}
                            helperText={errors.amountOfPolicyContents ? errors.amountOfPolicyContents.message : ""}
                            tooltip={findHelpTextByTag("amountOfPolicyContents", metadata.helpTags)}
                            

                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <CurrencyInput
                            disabled={isViewer}
                            id="amountOfPolicyStock"
                            name="amountOfPolicyStock"
                            inputProps={{ maxlength: 15 }}
                            label="Stock"
                            fullWidth={true}
                            variant="outlined"
                            required
                            value={currentPropertyInsuranceLossRegister.amountOfPolicyStock}
                            {...register("amountOfPolicyStock", {
                                required: "This field is required",
                                pattern: {
                                    value: /^[a-zA-Z ]*$/i,
                                    message: "Must contain characters only"
                                },
                                onChange: (e) => onCurrencyChanged(e),
                            })}
                           
                            error={errors.amountOfPolicyStock}
                            helperText={errors.amountOfPolicyStock ? errors.amountOfPolicyStock.message : ""}
                            tooltip={findHelpTextByTag("amountOfPolicyStock", metadata.helpTags)}
                            

                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <CurrencyInput
                            disabled={isViewer}
                            id="amountOfPolicyUseAndOccupancy"
                            name="amountOfPolicyUseAndOccupancy"
                            inputProps={{ maxlength: 15 }}
                            label="Use And Occupancy"
                            fullWidth={true}
                            variant="outlined"
                            required
                            value={currentPropertyInsuranceLossRegister.amountOfPolicyUseAndOccupancy}
                            {...register("amountOfPolicyUseAndOccupancy", {
                                required: "This field is required",
                                pattern: {
                                    value: /^[a-zA-Z ]*$/i,
                                    message: "Must contain characters only"
                                },
                                onChange: (e) => onCurrencyChanged(e),
                            })}
                            error={errors.amountOfPolicyUseAndOccupancy}
                            helperText={errors.amountOfPolicyUseAndOccupancy ? errors.amountOfPolicyUseAndOccupancy.message : ""}
                            tooltip={findHelpTextByTag("amountOfPolicyUseAndOccupancy", metadata.helpTags)}
                            

                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <CurrencyInput
                            disabled={isViewer}
                            inputProps={{ maxlength: 15 }}
                            id="amountOfPolicyOtherScehduled"
                            name="amountOfPolicyOtherScehduled"
                            label="Other Scheduled"
                            fullWidth={true}
                            variant="outlined"
                            required
                            value={currentPropertyInsuranceLossRegister.amountOfPolicyOtherScehduled}
                            {...register("amountOfPolicyOtherScehduled", {
                                required: "This field is required",
                                pattern: {
                                    value: /^[a-zA-Z ]*$/i,
                                    message: "Must contain characters only"
                                },
                                onChange: (e) => onCurrencyChanged(e),
                            })}

                            error={errors.amountOfPolicyOtherScehduled}
                            helperText={errors.amountOfPolicyOtherScehduled ? errors.amountOfPolicyOtherScehduled.message : ""}
                            tooltip={findHelpTextByTag("amountOfPolicyOtherScehduled", metadata.helpTags)}


                        />
                    </ContentCell>
                </ContentRow>
                <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Estimated Loss</span></PanelHeader>
               <ContentRow>
                    <ContentCell width="33%">
                        <CurrencyInput
                            disabled={isViewer}
                            id="estimatedLossBuilding"
                            inputProps={{ maxlength: 15 }}
                            name="estimatedLossBuilding"
                            label="Building"
                            fullWidth={true}
                            variant="outlined"
                            required
                            value={currentPropertyInsuranceLossRegister.estimatedLossBuilding}
                            {...register("estimatedLossBuilding", {
                                required: "This field is required",
                                pattern: {
                                    value: /^[a-zA-Z ]*$/i,
                                    message: "Must contain characters only"
                                },
                                onChange: (e) => onCurrencyChanged(e),
                            })}
                            error={errors.estimatedLossBuilding}
                            helperText={errors.estimatedLossBuilding ? errors.estimatedLossBuilding.message : ""}
                            tooltip={findHelpTextByTag("estimatedLossBuilding", metadata.helpTags)}


                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <CurrencyInput
                            disabled={isViewer}
                            id="estimatedLossContents"
                            inputProps={{ maxlength: 15 }}
                            name="estimatedLossContents"
                            label="Contents"
                            fullWidth={true}
                            variant="outlined"
                            required
                            value={currentPropertyInsuranceLossRegister.estimatedLossContents}
                            {...register("estimatedLossContents", {
                                required: "This field is required",
                                pattern: {
                                    value: /^[a-zA-Z ]*$/i,
                                    message: "Must contain characters only"
                                },
                                onChange: (e) => onCurrencyChanged(e),
                            })}
                            error={errors.estimatedLossContents}
                            helperText={errors.estimatedLossContents ? errors.estimatedLossContents.message : ""}
                            tooltip={findHelpTextByTag("estimatedLossContents", metadata.helpTags)}
                            

                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <CurrencyInput
                            disabled={isViewer}
                            id="estimatedLossStock"
                            inputProps={{ maxlength: 15 }}
                            name="estimatedLossStock"
                            label="Stock"
                            fullWidth={true}
                            variant="outlined"
                            required
                            value={currentPropertyInsuranceLossRegister.estimatedLossStock}
                            {...register("estimatedLossStock", {
                                required: "This field is required",
                                pattern: {
                                    value: /^[a-zA-Z ]*$/i,
                                    message: "Must contain characters only"
                                },
                                onChange: (e) => onCurrencyChanged(e),
                            })}
                            error={errors.estimatedLossStock}
                            helperText={errors.estimatedLossStock ? errors.estimatedLossStock.message : ""}
                            tooltip={findHelpTextByTag("estimatedLossStock", metadata.helpTags)}
                            

                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <CurrencyInput
                            disabled={isViewer}
                            id="estimatedLossUseAndOccupancy"
                            inputProps={{ maxlength: 15 }}
                            name="estimatedLossUseAndOccupancy"
                            label="Use And Occupancy"
                            fullWidth={true}
                            variant="outlined"
                            required
                            value={currentPropertyInsuranceLossRegister.estimatedLossUseAndOccupancy}
                            {...register("estimatedLossUseAndOccupancy", {
                                required: "This field is required",
                                pattern: {
                                    value: /^[a-zA-Z ]*$/i,
                                    message: "Must contain characters only"
                                },
                                onChange: (e) => onCurrencyChanged(e),
                            })}
                            error={errors.estimatedLossUseAndOccupancy}
                            helperText={errors.estimatedLossUseAndOccupancy ? errors.estimatedLossUseAndOccupancy.message : ""}
                            tooltip={findHelpTextByTag("estimatedLossUseAndOccupancy", metadata.helpTags)}
                            

                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <CurrencyInput
                            disabled={isViewer}
                            id="estimatedLossOtherScehduled"
                            name="estimatedLossOtherScehduled"
                            inputProps={{ maxlength: 15 }}
                            label="Other Scheduled"
                            required
                            fullWidth={true}
                            variant="outlined"
                            value={currentPropertyInsuranceLossRegister.estimatedLossOtherScehduled}
                            {...register("estimatedLossOtherScehduled", {
                                required: "This field is required",
                                pattern: {
                                    value: /^[a-zA-Z ]*$/i,
                                    message: "Must contain characters only"
                                },
                                onChange: (e) => onCurrencyChanged(e),
                            })}
                            error={errors.estimatedLossOtherScehduled}
                            helperText={errors.estimatedLossOtherScehduled ? errors.estimatedLossOtherScehduled.message : ""}
                            tooltip={findHelpTextByTag("estimatedLossOtherScehduled", metadata.helpTags)}
                        />
                    </ContentCell>
                </ContentRow>
            </PanelContent>
        </Panel>
    );
};
