import React from 'react';
import {
    ButtonGroup,
    MenuItem,
    CircularProgress,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useForm } from "react-hook-form";
import styled from 'styled-components';
import { CurrencyInput, Panel, DatePicker, PanelContent, PanelHeader, PercentageInput, SwitchInput, SelectList, Spinner, TextInput } from '../../../../Core/Forms/Common';
import { HelpDrawer } from '../../../Help/HelpDrawer';
import { findHelpTextByTag, loadHelpTags } from '../../../Help/Queries';
import { AppContainer, TabContainer } from '../TabContainer';
import { loadPropertyPolicyDetail } from './Queries/loadPropertyPolicyDetail';
import { savePropertyPolicyDetail } from './Queries/savePropertyPolicyDetail';
import { getRiskStates } from '../../../../Core/Services/EntityGateway';
import { useSelector } from 'react-redux';
import { APP_TYPES } from '../../../../Core/Enumerations/app/app-types';
import { userSelectors } from '../../../../Core/State/slices/user';
import { FAL_CLAIM_STATUS_TYPES } from '../../../../Core/Enumerations/app/fal_claim-status-types';
import { zipFormat } from '../../../../Core/Utility/common';

const validateClaimant = async (triggerValidation) => {
    let isValid = true, result = true;

    result = await triggerValidation("lossAddressZIP");
    if (!result)
        isValid = result;

    result = await triggerValidation("lossAddressCounty");
    if (!result)
        isValid = result;

    result = await triggerValidation("lossAddressCity");
    if (!result)
        isValid = result;

    if (!result)
        isValid = result;
    return isValid;
}


const Toolbar = styled.nav`
    width: 100%;
    height: 40px;
    padding: 0;
    margin: 0;
    border: 0;
    border-top: solid 1px rgb(170, 170, 170);
    border-bottom: solid 1px rgb(170, 170, 170);
    background-color: ${props => props.theme.backgroundDark};

    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-content: center;
    align-items: center;
`;

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

export const PropertyPolicyApp = ({ claim }) => {
    const $auth = useSelector(userSelectors.selectAuthContext());
    const isViewer = $auth.isReadOnly(APP_TYPES.Property_Policy) || claim.fALClaimStatusTypeID === FAL_CLAIM_STATUS_TYPES.CLOSED || claim.fALClaimStatusTypeID === FAL_CLAIM_STATUS_TYPES.ERROR;
    const formValidator = useForm();
    const { trigger, formState: { errors }, setValue, register } = formValidator;

    const { enqueueSnackbar } = useSnackbar();
    const [metadata, setMetadata] = React.useState({
        loading: true,
        riskStates: [],
        helpTags: [],
    });
    const [openingDateError, setOpeningDateError] = React.useState(false);
    const [closingDateError, setClosingDateError] = React.useState(false);
    const helpContainerName = "Loss Coding";
    const [currentPropertyPolicy, setCurrentPropertyPolicy] = React.useState({ claimMasterID: claim.claimMasterID });
    const [originalPropertyPolicy, setOriginalPropertyPolicy] = React.useState({ claimMasterID: claim.claimMasterID });

    const [isSaving, setIsSaving] = React.useState(false);
    const [isProcessing, setIsProcessing] = React.useState(true);
    const [open, setOpen] = React.useState(false);

    const onDrawerClose = () => {
        setOpen(false);
    };
    const onValueChanged = (evt) => {
        const { name, value } = evt.target;
        setValue(name, value ? value : null);
        setCurrentPropertyPolicy({ ...currentPropertyPolicy, [name]: value });
    };
    const onRadioChanged = (evt) => {
        let val = evt.target.value;
        if (evt.target.name.split('.').length > 1) {
            let child = currentPropertyPolicy[evt.target.name.split('.')[0]];
            child = { ...child, [evt.target.name.split('.')[1]]: val === "" ? null : val };

            setCurrentPropertyPolicy({ ...currentPropertyPolicy, [evt.target.name.split('.')[0]]: child });
            onSave({ ...currentPropertyPolicy, [evt.target.name.split('.')[0]]: child });
        }
        else {
            setCurrentPropertyPolicy({ ...currentPropertyPolicy, [evt.target.name]: val === "" ? null : val });
            onSave({ ...currentPropertyPolicy, [evt.target.name]: val === "" ? null : val });
        }
    }
    const onCurrencyChanged = (evt) => {
        const { name, value } = evt.target;

        if (name === 'generalStarSharedPercent') {
            setCurrentPropertyPolicy({ ...currentPropertyPolicy, generalStarSharedPercent: parseFloat(value) });

        } else if (name === 'subroDemand') {
            setCurrentPropertyPolicy({ ...currentPropertyPolicy, subroDemand: parseInt(value) });

        } else if (name === 'subroRecovered') {
            setCurrentPropertyPolicy({ ...currentPropertyPolicy, subroRecovered: parseInt(value) });

        }
    };

    const onPercentAgeChanged = (name, value) => {

        if (name === 'generalStarSharedPercent') {
            setCurrentPropertyPolicy({ ...currentPropertyPolicy, generalStarSharedPercent: value });

        } else if (name === 'subroDemand') {
            setCurrentPropertyPolicy({ ...currentPropertyPolicy, subroDemand: parseInt(value) });

        } else if (name === 'subroRecovered') {
            setCurrentPropertyPolicy({ ...currentPropertyPolicy, subroRecovered: parseInt(value) });

        }
    };

    const onCheckBoxChanged = (evt) => {
        setCurrentPropertyPolicy({ ...currentPropertyPolicy, [evt.target.name]: evt.target.checked });
        onSave({ ...currentPropertyPolicy, [evt.target.name]: evt.target.checked });
    };

    const onDropDownChanged = (evt) => {
        setCurrentPropertyPolicy({ ...currentPropertyPolicy, [evt.target.name]: evt.target.value });
        onSave({ ...currentPropertyPolicy, [evt.target.name]: evt.target.value !== '' ? evt.target.value : null });
    };

    const onDateChanged = (evt) => {
        let { name, value } = evt.target;
        if (name === 'subrogationOpenDate') {
            if (new Date(value) > new Date(currentPropertyPolicy.subrogationClosingDate) && (currentPropertyPolicy.subrogationClosingDate !== undefined && currentPropertyPolicy.subrogationClosingDate !== null)) {
                setOpeningDateError(true);
                return;
            }
        }
        if (name === 'subrogationClosingDate') {
            if (new Date(value) < new Date(currentPropertyPolicy.subrogationOpenDate)) {
                setClosingDateError(true);
                return;
            }
        }
        setOpeningDateError(false);
        setClosingDateError(false);

        let datObj = {};
        let prevDate = new Date([evt.target.value]);
        datObj[evt.target.name] = prevDate.toISOString();

        setCurrentPropertyPolicy({ ...currentPropertyPolicy, ...datObj });
        onSave({ ...currentPropertyPolicy, ...datObj });

    };

    React.useEffect(() => {
        async function LoadMetaData() {
            let rs = await getRiskStates();
            let result = await loadHelpTags(helpContainerName);
            ParseGQErrors(result.errors, result.error);
            let helpTagList = result.data.list;
            setMetadata({
                loading: false,
                helpTags: (helpTagList || []),
                riskStates: (rs || []),
            });
        }
        LoadMetaData();
        loadDetail();
    }, []);

    function ParseGQErrors(errors, error) {
        if (error || errors) {
            console.log("An error occured: ", errors);
            console.log("An error occured: ", error);
            enqueueSnackbar("An error occured.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }

    const loadDetail = async () => {
        try {
            const result = await loadPropertyPolicyDetail(claim.claimMasterID);
            ParseGQErrors(result.errors, result.error);

            if (result.data.detail) {
                setCurrentPropertyPolicy(result.data.detail);
                setOriginalPropertyPolicy(JSON.parse(JSON.stringify(result.data.detail)));
            }
        } catch (e) {
            enqueueSnackbar(e.toString(), { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
        setIsProcessing(false);
    };

    const onSave = async (data = null) => {
        let modifiedPropertyPolicy = data ? data : currentPropertyPolicy;

        if (JSON.stringify(originalPropertyPolicy) === JSON.stringify(modifiedPropertyPolicy))
            return;

        let isValid = await validateClaimant(trigger);
        if (!isValid)
            return;

        if (modifiedPropertyPolicy && !modifiedPropertyPolicy.propertyPolicyID)
            setIsProcessing(true);

        setIsSaving(true);
        let result = await savePropertyPolicyDetail(modifiedPropertyPolicy);
        if (result.errors || result.error) {
            ParseGQErrors(result.errors, result.error);
        }
        else if (result.data.save) {
            if (!modifiedPropertyPolicy.propertyPolicyID) {
                setCurrentPropertyPolicy(JSON.parse(JSON.stringify(result.data.save)));
                setOriginalPropertyPolicy(JSON.parse(JSON.stringify(result.data.save)));
            } else {
                setOriginalPropertyPolicy(JSON.parse(JSON.stringify(modifiedPropertyPolicy)));
            }
        }
        setIsSaving(false);
        setIsProcessing(false);

    }

    return (
        isProcessing ? <Spinner /> : <>
            <AppContainer>
                <Toolbar>
                    <ButtonGroup variant="text">
                        {/*  <IconButton name="Help" title="Help" onClick={onDrawerOpen}><HelpOutline /></IconButton> */}
                    </ButtonGroup>
                    {isSaving && <CircularProgress color="primary" size={20} style={{ marginRight: 10 }} />}
                </Toolbar>
                <TabContainer>

                    <Panel>
                        <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Property Policy Details</span></PanelHeader>
                        <PanelContent>
                            <ContentRow>
                                <ContentCell width="33%">
                                    <TextInput
                                        disabled={isViewer}
                                        id="policyForms"
                                        name="policyForms"
                                        label="Policy Forms"
                                        required
                                        fullWidth={true}
                                        variant="outlined"
                                        value={currentPropertyPolicy.policyForms}
                                        inputProps={{ maxlength: 250 }}
                                        tooltip={findHelpTextByTag("policyForms", metadata.helpTags)}
                                        onChange={onValueChanged}
                                        onBlur={() => onSave(null)}
                                        error={errors.policyForms}
                                        helperText={errors?.policyForms ? errors.policyForms.message : ""}
                                    />
                                </ContentCell>
                                <ContentCell width="33%">
                                    <TextInput
                                        disabled={isViewer}
                                        id="limits"
                                        name="limits"
                                        label="Limits"
                                        required
                                        fullWidth={true}
                                        variant="outlined"
                                        value={currentPropertyPolicy.limits}
                                        inputProps={{ maxlength: 250 }}
                                        tooltip={findHelpTextByTag("limits", metadata.helpTags)}
                                        onChange={onValueChanged}
                                        onBlur={() => onSave(null)}
                                        error={errors.limits}
                                        helperText={errors.limits ? errors.limits.message : ""}
                                    />
                                </ContentCell>
                                <ContentCell width="33%">
                                    <TextInput
                                        disabled={isViewer}
                                        id="coinsurance"
                                        name="coinsurance"
                                        label="Coinsurance"
                                        required
                                        fullWidth={true}
                                        variant="outlined"
                                        value={currentPropertyPolicy.coinsurance}
                                        inputProps={{ maxlength: 50 }}
                                        tooltip={findHelpTextByTag("coinsurance", metadata.helpTags)}
                                        onChange={onValueChanged}
                                        onBlur={() => onSave(null)}
                                        error={errors.coinsurance}
                                        helperText={errors.coinsurance ? errors.coinsurance.message : ""}
                                    />
                                </ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell width="33%">
                                    <TextInput
                                        disabled={isViewer}
                                        id="deductible"
                                        name="deductible"
                                        label="Deductible"
                                        fullWidth={true}
                                        required
                                        variant="outlined"
                                        value={currentPropertyPolicy.deductible}
                                        inputProps={{ maxlength: 500 }}
                                        tooltip={findHelpTextByTag("deductible", metadata.helpTags)}
                                        onChange={onValueChanged}
                                        onBlur={() => onSave(null)}
                                        error={errors.deductible}
                                        helperText={errors.deductible ? errors.deductible.message : ""}
                                    />
                                </ContentCell>
                                <ContentCell width="33%">
                                    <PercentageInput
                                        disabled={isViewer}
                                        id="generalStarSharedPercent"
                                        name="generalStarSharedPercent"
                                        label="General Star Shared Percent"
                                        fullWidth={true}
                                        onChange={onPercentAgeChanged}
                                        variant="outlined"
                                        value={currentPropertyPolicy.generalStarSharedPercent}
                                        inputProps={{ maxlength: 250 }}
                                        onBlur={() => onSave(null)}
                                        tooltip={findHelpTextByTag("generalStarSharedPercent", metadata.helpTags)}
                                    />
                                </ContentCell>
                                <ContentCell width="33%">
                                    <SelectList
                                        disabled={isViewer}
                                        id="coinsurancePenaltyFlag"
                                        name="coinsurancePenaltyFlag"
                                        label="Coinsurance Penalty Calculation"
                                        fullWidth={true}
                                        onChange={onDropDownChanged}
                                        variant="outlined"
                                        value={currentPropertyPolicy.coinsurancePenaltyFlag}
                                        allowempty={ true}
                                        tooltip={findHelpTextByTag("coinsurancePenaltyFlag", metadata.helpTags)}
                                    >
                                        <MenuItem value={true}>Yes</MenuItem>
                                        <MenuItem value={false}>No</MenuItem>
                                    </SelectList>
                                </ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell width="20%">
                                    <FormLabel component="legend">Valuation</FormLabel>
                                </ContentCell>
                                <ContentCell width="80%">
                                    <FormControl component="fieldset">
                                        <RadioGroup
                                            row
                                            required
                                            value={currentPropertyPolicy.calcBasis}
                                            fullWidth={true}
                                            variant="outlined"
                                            onChange={onRadioChanged}
                                            error={errors.calcBasis}
                                            id="calcBasis"
                                            name="calcBasis"
                                            disabled={isViewer}
                                            tooltip={findHelpTextByTag("calcBasis", metadata.helpTags)}
                                        >
                                            <FormControlLabel value="RCV" control={<Radio disabled={isViewer} />} label="RCV" />
                                            <FormControlLabel value="ACV" control={<Radio disabled={isViewer} />} label="ACV" />
                                        </RadioGroup>
                                    </FormControl>
                                </ContentCell>
                            </ContentRow>
                        </PanelContent>
                        <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Location Details</span></PanelHeader>
                        <PanelContent>

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
                                        value={currentPropertyPolicy.lossAddressStreet1}
                                        inputProps={{ maxlength: 250 }}
                                        {...register("lossAddressStreet1", {
                                            required: "This field is required",
                                            pattern: {
                                                value: /^[a-zA-Z ]*$/i,
                                                message: "Must contain characters only"
                                            },
                                            onChange: (e) => onValueChanged(e),
                                            onBlur: () => onSave(null)
                                        })}
                                        tooltip={findHelpTextByTag("lossAddressStreet1", metadata.helpTags)}
                                        error={errors.lossAddressStreet1}
                                        helperText={errors.lossAddressStreet1 ? errors.lossAddressStreet1.message : ""}
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
                                        value={currentPropertyPolicy.lossAddressStreet2}
                                        inputProps={{ maxlength: 250 }}
                                        onBlur={() => onSave(null)}
                                        tooltip={findHelpTextByTag("lossAddressStreet2", metadata.helpTags)}
                                        error={errors.lossAddressStreet2}
                                        helperText={errors.lossAddressStreet2 ? errors.lossAddressStreet2.message : ""}
                                    />
                                </ContentCell>
                                <ContentCell width="33%">
                                    <TextInput
                                        disabled={isViewer}
                                        id="lossAddressCity"
                                        name="lossAddressCity"
                                        label="Loss Address City"
                                        fullWidth={true}
                                        variant="outlined"
                                        value={currentPropertyPolicy.lossAddressCity}
                                        inputProps={{ maxlength: 250 }}
                                        tooltip={findHelpTextByTag("lossAddressCity", metadata.helpTags)}
                                        {...register("lossAddressCity", {
                                            pattern: {
                                                value: /^[a-zA-Z `',.-]*$/i,
                                                message: "Must contain characters only"
                                            },
                                            onChange: (e) => onValueChanged(e),
                                            onBlur: () => onSave(null)
                                        })}
                                        error={errors.lossAddressCity}
                                        helperText={errors.lossAddressCity ? errors.lossAddressCity.message : ""}
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
                                                fullWidth={true}
                                                onChange={onDropDownChanged}
                                                variant="outlined"
                                                value={currentPropertyPolicy.lossAddressState || ""}
                                                tooltip={findHelpTextByTag("lossAddressState", metadata.helpTags)}
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
                                        fullWidth={true}
                                        variant="outlined"
                                        value={currentPropertyPolicy.lossAddressZIP}
                                        inputProps={{ maxlength: 15 }}
                                        {...register("lossAddressZIP", {
                                            pattern: {
                                                value: /(\d{5}([\-]\d{4})?)/i,
                                                message: "This field is invalid."
                                            },
                                            onChange: (e) => zipFormat(onValueChanged,e),
                                            onBlur: () => onSave(null)
                                        })}
                                        error={errors.lossAddressZIP}
                                        helperText={errors.lossAddressZIP ? errors.lossAddressZIP.message : ""}
                                        tooltip={findHelpTextByTag("addressZIP", metadata.helpTags)}
                                    />
                                </ContentCell>
                                <ContentCell width="33%">
                                    <TextInput
                                        disabled={isViewer}
                                        id="lossAddressCounty"
                                        name="lossAddressCounty"
                                        label="Loss Address County"
                                        fullWidth={true}
                                        variant="outlined"
                                        value={currentPropertyPolicy.lossAddressCounty}
                                        inputProps={{ maxlength: 50 }}
                                        {...register("lossAddressCounty", {
                                            pattern: {
                                                value: /^[a-zA-Z `',.-]*$/i,
                                                message: "Must contain characters only"
                                            },
                                            onChange: (e) => onValueChanged(e),
                                            onBlur: () => onSave(null)
                                        })}
                                        tooltip={findHelpTextByTag("lossAddressCounty", metadata.helpTags)}
                                        error={errors.lossAddressCounty}
                                        helperText={errors.lossAddressCounty ? errors.lossAddressCounty.message : ""}
                                    />
                                </ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell width="33%">
                                    <SwitchInput
                                        disabled={isViewer}
                                        id="salvage"
                                        name="salvage"
                                        label="Salvage"
                                        checked={currentPropertyPolicy.salvage}
                                        key={currentPropertyPolicy.salvage}
                                        onChange={onCheckBoxChanged}
                                        tooltip={findHelpTextByTag("salvage", metadata.helpTags)}
                                    />

                                </ContentCell>
                                <ContentCell width="33%">
                                    <SwitchInput
                                        disabled={isViewer}
                                        id="restitution"
                                        name="restitution"
                                        label="Restitution"
                                        checked={currentPropertyPolicy.restitution}
                                        key={currentPropertyPolicy.restitution}
                                        onChange={onCheckBoxChanged}
                                        tooltip={findHelpTextByTag("restitution", metadata.helpTags)}
                                    />

                                </ContentCell>
                                <ContentCell width="33%">
                                    <SwitchInput
                                        disabled={isViewer}
                                        id="subrogation"
                                        name="subrogation"
                                        label="Subrogation"
                                        checked={currentPropertyPolicy.subrogation}
                                        key={currentPropertyPolicy.subrogation}
                                        onChange={onCheckBoxChanged}
                                        tooltip={findHelpTextByTag("subrogation", metadata.helpTags)}
                                    />

                                </ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell width="33%">
                                    <CurrencyInput
                                        label="Subro Demand"
                                        disabled={isViewer}
                                        id="subroDemand"
                                        name="subroDemand"
                                        fullWidth={true}
                                        variant="outlined"
                                        onChange={onCurrencyChanged}
                                        value={currentPropertyPolicy.subroDemand}
                                        onBlur={() => onSave(null)}
                                        inputProps={{ maxlength: 15 }}
                                        tooltip={findHelpTextByTag("subroDemand", metadata.helpTags)}
                                    />
                                </ContentCell>
                                <ContentCell width="33%">
                                    <CurrencyInput
                                        label="Subro Recovered"
                                        disabled={isViewer}
                                        inputProps={{ maxlength: 15 }}
                                        id="subroRecovered"
                                        name="subroRecovered"
                                        fullWidth={true}
                                        variant="outlined"
                                        onChange={onCurrencyChanged}
                                        onBlur={() => onSave(null)}
                                        value={currentPropertyPolicy.subroRecovered}
                                        tooltip={findHelpTextByTag("Subro Recovered", metadata.helpTags)}
                                    />
                                </ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell width="33%">
                                    <DatePicker
                                        disabled={isViewer}
                                        id="subrogationOpenDate"
                                        name="subrogationOpenDate"
                                        label="Subrogation Open Date"
                                        required
                                        fullWidth={true}
                                        variant="outlined"
                                        value={currentPropertyPolicy.subrogationOpenDate || null}
                                        // disableFuture={true}
                                        error={openingDateError}
                                        helperText={openingDateError ? 'Subrogration Opening Date must be previous than Closing Date' : ""}
                                        onChange={onDateChanged}
                                        tooltip={findHelpTextByTag("subrogationOpenDate", metadata.helpTags)}
                                    />
                                </ContentCell>
                                <ContentCell width="33%">
                                    <DatePicker
                                        disabled={isViewer}
                                        id="subrogationClosingDate"
                                        name="subrogationClosingDate"
                                        label="Subrogation Closing Date"
                                        required
                                        fullWidth={true}
                                        variant="outlined"
                                        value={currentPropertyPolicy.subrogationClosingDate || null}
                                        //disablePast={true}
                                        error={closingDateError}
                                        onChange={onDateChanged}
                                        helperText={closingDateError ? 'Subrogation Closing Date cant be previous than Opening Date' : ""}
                                        tooltip={findHelpTextByTag("subrogationClosingDate", metadata.helpTags)}
                                    />
                                </ContentCell>
                                <ContentCell width="33%">
                                    <DatePicker
                                        disabled={isViewer}
                                        id="subrogationDiaryDate"
                                        name="subrogationDiaryDate"
                                        label="Subrogation Diary Date"
                                        required
                                        fullWidth={true}
                                        variant="outlined"
                                        value={currentPropertyPolicy.subrogationDiaryDate || null}
                                        disableFuture={true}
                                        error={errors.subrogationDiaryDate}
                                        helperText={errors.subrogationDiaryDate ? errors.subrogationDiaryDate.message : ""}
                                        onChange={onDateChanged}
                                        tooltip={findHelpTextByTag("subrogationDiaryDate", metadata.helpTags)}
                                    />
                                </ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell width="33%">
                                    <TextInput
                                        disabled={isViewer}
                                        id="mortgageHolder"
                                        name="mortgageHolder"
                                        label="Mortgage Holder"
                                        required
                                        fullWidth={true}
                                        variant="outlined"
                                        value={currentPropertyPolicy.mortgageHolder}
                                        inputProps={{ maxlength: 255 }}
                                        tooltip={findHelpTextByTag("mortgageHolder", metadata.helpTags)}
                                        onChange={onValueChanged}
                                        onBlur={() => onSave(null)}
                                        error={errors.mortgageHolder}
                                        helperText={errors.mortgageHolder ? errors.mortgageHolder.message : ""}
                                    />
                                </ContentCell>
                                <ContentCell width="33%">
                                    <TextInput
                                        disabled={isViewer}
                                        id="lienHolder"
                                        name="lienHolder"
                                        label="Lien Holder"
                                        required
                                        fullWidth={true}
                                        variant="outlined"
                                        value={currentPropertyPolicy.lienHolder}
                                        inputProps={{ maxlength: 255 }}
                                        tooltip={findHelpTextByTag("lienHolder", metadata.helpTags)}
                                        onChange={onValueChanged}
                                        onBlur={() => onSave(null)}
                                        error={errors.lienHolder}
                                        helperText={errors.lienHolder ? errors.lienHolder.message : ""}
                                    />
                                </ContentCell>
                                <ContentCell width="33%">
                                    <TextInput
                                        disabled={isViewer}
                                        id="debtor"
                                        name="debtor"
                                        label="Debtor"
                                        required
                                        fullWidth={true}
                                        variant="outlined"
                                        value={currentPropertyPolicy.debtor}
                                        inputProps={{ maxlength: 255 }}
                                        tooltip={findHelpTextByTag("debtor", metadata.helpTags)}
                                        onChange={onValueChanged}
                                        onBlur={() => onSave(null)}
                                        error={errors.debtor}
                                        helperText={errors.debtor ? errors.debtor.message : ""}
                                    />
                                </ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell width="99%">
                                    <TextInput
                                        disabled={isViewer}
                                        id="comment"
                                        name="comment"
                                        label="Comment"
                                        required
                                        fullWidth={true}
                                        variant="outlined"
                                        value={currentPropertyPolicy.comment}
                                        inputProps={{ maxlength: 2048 }}
                                        onChange={onValueChanged}
                                        onBlur={() => onSave(null)}
                                        tooltip={findHelpTextByTag("comment", metadata.helpTags)}
                                        error={errors.comment}
                                        helperText={errors.comment ? errors.comment.message : ""}
                                        multiline
                                        rows={4}
                                    />
                                </ContentCell>
                            </ContentRow>
                        </PanelContent>
                    </Panel>
                </TabContainer>
            </AppContainer>
            <HelpDrawer open={open} onClose={onDrawerClose} containerName={helpContainerName} key={helpContainerName} />
        </>
    );
};


