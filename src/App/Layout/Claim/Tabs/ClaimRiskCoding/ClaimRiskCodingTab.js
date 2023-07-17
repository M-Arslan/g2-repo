import React from 'react';
import {
    Divider,
    MenuItem,
    IconButton,
    ButtonGroup,
    CircularProgress,
} from '@mui/material';
import { HelpOutline } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { APP_TYPES } from '../../../../Core/Enumerations/app/app-types';
import { CurrencyInput, NumericInput, Panel, PanelContent, PanelHeader, PercentageInput, SelectList, Spinner } from '../../../../Core/Forms/Common';
import { userSelectors } from '../../../../Core/State/slices/user';
import {
    professionalClaimCategoryActions, professionalClaimCategorySelectors
} from '../../../../Core/State/slices/metadata/professionalClaimCategories';
import {
    causeOfLossCodeByG2LESelectors, causeOfLossCodeByG2LEActions
} from '../../../../Core/State/slices/metadata/causeOfLossCodes';
//import {
//    riskCodingSpecialFlagTypesActions, riskCodingSpecialFlagTypesSelectors
//} from '../../../../Core/State/slices/metadata/riskCodingSpecialFlagTypes';
import {
    lineOfBusinessCodingTypeActions, lineOfBusinessCodingTypeSelectors
} from '../../../../Core/State/slices/metadata/lineOfBusinessTypes';
import {
    claimSelectors
} from '../../../../Core/State/slices/claim';
import { HelpDrawer } from '../../../Help/HelpDrawer';
import { loadHelpTags } from '../../../Help/Queries';
import { AppContainer, TabContainer } from '../TabContainer';
import { loadClaimRiskCodingDetail } from './Queries/loadClaimRiskCodingDetail';
import { saveClaimRiskCodingDetail } from './Queries/saveClaimRiskCodingDetail';
import {
    ASYNC_STATES
} from '../../../../Core/Enumerations/redux/async-states';
import { CLAIM_TYPES } from '../../../../Core/Enumerations/app/claim-type';
import { LEGAL_ENTITY } from '../../../../Core/Enumerations/app/legal-entity';
import { FAL_CLAIM_STATUS_TYPES } from '../../../../Core/Enumerations/app/fal_claim-status-types';

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
//const TableContentRow = styled.div`
//    display: flex;
//    flex-flow: row nowrap;
//    justify-content: flex-start;
//    align-items: center;
//    align-content: center;
//    background-color: #fff;
//`;
const TableContentCellLeft = styled.div`
    width: ${props => props.width || '50%'};
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    padding: 1em;
    border-left: solid 0px;
`;
const TableContentCellCenter = styled.div`
    width: ${props => props.width || '50%'};
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    padding: 1em;
    border-left: solid 1px #0082ce;
    border-right: solid 1px #0082ce;
`;
const TableContentCellRight = styled.div`
    width: ${props => props.width || '50%'};
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    padding: 1em;
`;


const TableContentHeaderCellLeft = styled.div`
    width: ${props => props.width || '50%'};
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    padding: 1em;
    border-top: solid 1px #0082ce;
    border-bottom: solid 1px #0082ce;
    background-color: ${props => props.theme.backgroundDark};
`;
const TableContentHeaderCellCenter = styled.div`
    width: ${props => props.width || '50%'};
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    padding: 1em;
    border-left: solid 1px #0082ce;
    border-right: solid 1px #0082ce;
    border-top: solid 1px #0082ce;
    border-bottom: solid 1px #0082ce;
    background-color: ${props => props.theme.backgroundDark};
`;
const TableContentHeaderCellRight = styled.div`
    width: ${props => props.width || '50%'};
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    padding: 1em;
    border-top: solid 1px #0082ce;
    border-bottom: solid 1px #0082ce;
    background-color: ${props => props.theme.backgroundDark};
`;
const TableContentFooterCellLeft = styled.div`
    width: ${props => props.width || '50%'};
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    padding: 1em;
`;
const TableContentFooterCellCenter = styled.div`
    width: ${props => props.width || '50%'};
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    padding: 1em;
    border-left: solid 1px #0082ce;
    border-right: solid 1px #0082ce;
`;

const TableContentFooterCellRight = styled.div`
    width: ${props => props.width || '50%'};
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    padding: 1em;
`;

export const ClaimRiskCodingTab = () => {
    const claim = useSelector(claimSelectors.selectData());
    const $auth = useSelector(userSelectors.selectAuthContext());
    const isViewer = claim.fALClaimStatusTypeID === FAL_CLAIM_STATUS_TYPES.CLOSED || claim.fALClaimStatusTypeID === FAL_CLAIM_STATUS_TYPES.ERROR || $auth.isReadOnly(APP_TYPES.Loss_Coding);
    const formValidator = useForm();
    const { formState: { errors } } = formValidator;
    let $dispatch = useDispatch();

    const professionalClaimCategoryListState = useSelector(professionalClaimCategorySelectors.selectLoading());
    const professionalClaimCategories = useSelector(professionalClaimCategorySelectors.selectData()) || [];

    const lineOfBusinessCodingTypesState = useSelector(lineOfBusinessCodingTypeSelectors.selectLoading());
    const lineOfBusinessCodingTypes = useSelector(lineOfBusinessCodingTypeSelectors.selectData()) || [];

    const causeOfLossCodeByG2LEState = useSelector(causeOfLossCodeByG2LESelectors.selectLoading());
    const causeOfLossCodeByG2LE = useSelector(causeOfLossCodeByG2LESelectors.selectData()) || [];

    //const riskCodingSpecialFlagTypesState = useSelector(riskCodingSpecialFlagTypesSelectors.selectLoading());
    //const riskCodingSpecialFlagTypes = useSelector(riskCodingSpecialFlagTypesSelectors.selectData()) || [];

    const { enqueueSnackbar } = useSnackbar();
    const [metadata, setMetadata] = React.useState({
        loading: true,
        riskCodingSpecialFlagTypes: [],
        lineOfBusinessTypes: [],
        helpTags: [],
        claimDetail: {}
    });
    const helpContainerName = "Loss Coding";
    const [currentRiskCoding, setCurrentRiskCoding] = React.useState({ claimMasterID: claim.claimMasterID });
    const [originalRiskCoding, setOriginalRiskCoding] = React.useState({ claimMasterID: claim.claimMasterID });

    const [isSaving, setIsSaving] = React.useState(false);
    const [isProcessing, setIsProcessing] = React.useState(true);
    const [open, setOpen] = React.useState(false);

    const onDrawerOpen = () => {
        setOpen(!open);
    };

    const onDrawerClose = () => {
        setOpen(false);
    };

    const onNumberChanged = (name, value) => {
        value = value > 0 ? value : null;
        if (name.split('.').length > 1) {
            let child = currentRiskCoding[name.split('.')[0]];
            child = { ...child, [name.split('.')[1]]: value };
            setCurrentRiskCoding({ ...currentRiskCoding, [name.split('.')[0]]: child });
        }
        else
            setCurrentRiskCoding({ ...currentRiskCoding, [name]: value });
    };

    const onCurrencyChanged = (evt) => {
        evt.target.value = evt.target.value > 0 ? evt.target.value : null;
        if (evt.target.name.split('.').length > 1) {
            let child = currentRiskCoding[evt.target.name.split('.')[0]];
            child = { ...child, [evt.target.name.split('.')[1]]: evt.target.value };
            setCurrentRiskCoding({ ...currentRiskCoding, [evt.target.name.split('.')[0]]: child });
        }
        else
            setCurrentRiskCoding({ ...currentRiskCoding, [evt.target.name]: evt.target.value });
    };

    const onPercentAgeChanged = (name, value) => {

        if (name.split('.').length > 1) {
            let child = currentRiskCoding[name.split('.')[0]];
            child = { ...child, [name.split('.')[1]]: value };
            setCurrentRiskCoding({ ...currentRiskCoding, [name.split('.')[0]]: child });
        }
        else
            setCurrentRiskCoding({ ...currentRiskCoding, [name]: parseFloat(value) });
    };

    //const convertFloatStringToFloat = (evt) => {
    //        setActivity({ ...activity, [evt.target.name]: parseFloat(evt.target.value.replace("$", "")) });
    //    evt.target.value = evt.target.value > 0 ? evt.target.value : null;
    //    if (evt.target.name.split('.').length > 1) {
    //        let child = currentRiskCoding[evt.target.name.split('.')[0]];
    //        child = { ...child, [evt.target.name.split('.')[1]]: evt.target.value };
    //        setCurrentRiskCoding({ ...currentRiskCoding, [evt.target.name.split('.')[0]]: child });
    //    }
    //    else
    //        setCurrentRiskCoding({ ...currentRiskCoding, [evt.target.name]: evt.target.value });
    //};

    const onDropDownChanged = (evt) => {
        let val = parseInt(evt.target.value);
        if (evt.target.value === "true" || evt.target.value === "false") {
            val = evt.target.value;
        } else if (isNaN(val)) {
            val = null;
        } else {
            val = evt.target.value;
        }

        if (evt.target.name.split('.').length > 1) {
            let child = currentRiskCoding[evt.target.name.split('.')[0]];
            child = { ...child, [evt.target.name.split('.')[1]]: val };

            setCurrentRiskCoding({ ...currentRiskCoding, [evt.target.name.split('.')[0]]: child });
            onSave({ ...currentRiskCoding, [evt.target.name.split('.')[0]]: child });
        }
        else {
            setCurrentRiskCoding({ ...currentRiskCoding, [evt.target.name]: val });
            onSave({ ...currentRiskCoding, [evt.target.name]: val });
        }
    };
    //const onRadioChanged = (evt) => {
    //    let val = evt.target.value;
    //    if (evt.target.name.split('.').length > 1) {
    //        let child = currentRiskCoding[evt.target.name.split('.')[0]];
    //        child = { ...child, [evt.target.name.split('.')[1]]: val === "" ? null : val };

    //        setCurrentRiskCoding({ ...currentRiskCoding, [evt.target.name.split('.')[0]]: child });
    //        onSave({ ...currentRiskCoding, [evt.target.name.split('.')[0]]: child });
    //    }
    //    else {
    //        setCurrentRiskCoding({ ...currentRiskCoding, [evt.target.name]: val === "" ? null : val });
    //        onSave({ ...currentRiskCoding, [evt.target.name]: val === "" ? null : val });
    //    }
    //};

    React.useEffect(() => {
        if (professionalClaimCategoryListState === ASYNC_STATES.IDLE)
            $dispatch(professionalClaimCategoryActions.list());

        if (lineOfBusinessCodingTypesState === ASYNC_STATES.IDLE)
            $dispatch(lineOfBusinessCodingTypeActions.list({g2LegalEntityID: claim.g2LegalEntityID}));

        if (causeOfLossCodeByG2LEState === ASYNC_STATES.IDLE)
            $dispatch(causeOfLossCodeByG2LEActions.getByG2LE({ g2LegalEntityID: claim.g2LegalEntityID }));

        //if (riskCodingSpecialFlagTypesState === ASYNC_STATES.IDLE)
        //    $dispatch(riskCodingSpecialFlagTypesActions.list());

        async function LoadMetaData() {

            let result = await loadHelpTags(helpContainerName);
            ParseGQErrors(result.errors, result.error);
            let helpTagList = result.data.list;

            setMetadata({
                loading: false,
                helpTags: (helpTagList || []),
                claimDetail: claim
            });
        }
        LoadMetaData();
        loadRiskCodingDetail();
    }, []);

    function ParseGQErrors(errors, error) {
        if (error || errors) {
            console.log("An error occured: ", errors);
            console.log("An error occured: ", error);
            enqueueSnackbar("An error occured.", { variant: 'error',anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }

    const loadRiskCodingDetail = async () => {
        try {
            const result = await loadClaimRiskCodingDetail(claim.claimMasterID);
            ParseGQErrors(result.errors, result.error);

            if (result.data.detail) {
                setCurrentRiskCoding(result.data.detail);
                setOriginalRiskCoding(JSON.parse(JSON.stringify(result.data.detail)));
            }
        } catch (e) {
            enqueueSnackbar(e, { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
        setIsProcessing(false);
    };

    const onSave = async (data = null) => {

        let modifiedRiskCoding = data ? data : currentRiskCoding;

        if (JSON.stringify(originalRiskCoding) === JSON.stringify(modifiedRiskCoding))
            return;

        if (modifiedRiskCoding && !modifiedRiskCoding.claimRiskCodingID)
            setIsProcessing(true);
        if (modifiedRiskCoding.claimCAT && !modifiedRiskCoding.claimCAT.claimCATID)
            setIsProcessing(true);
        if (modifiedRiskCoding.claimCoinsurance && !modifiedRiskCoding.claimCoinsurance.claimCoinsuranceID)
            setIsProcessing(true);

        setIsSaving(true);

        if (modifiedRiskCoding.hasOwnProperty('claimCAT') && modifiedRiskCoding.claimCAT !== null) {

            if (modifiedRiskCoding.claimCAT?.hasOwnProperty('cATTotalLossIndicator')) {
                if (modifiedRiskCoding.claimCAT.cATTotalLossIndicator === 'true') {
                    modifiedRiskCoding.claimCAT.cATTotalLossIndicator = true;
                } else if (modifiedRiskCoding.claimCAT.cATTotalLossIndicator === "false") {
                    modifiedRiskCoding.claimCAT.cATTotalLossIndicator = false;
                }
            }

                modifiedRiskCoding.claimCAT.cATNumber = parseInt(modifiedRiskCoding.claimCAT.cATNumber);
                modifiedRiskCoding.claimCAT.cATDeductible = parseInt(modifiedRiskCoding.claimCAT.cATDeductible);
                modifiedRiskCoding.claimCAT.cATLimit = parseInt(modifiedRiskCoding.claimCAT.cATLimit);
            }

        if (modifiedRiskCoding.hasOwnProperty('claimCoinsurance') && modifiedRiskCoding.claimCoinsurance !== null) {
            modifiedRiskCoding.claimCoinsurance.bPPValue = parseInt(modifiedRiskCoding.claimCoinsurance.bPPValue);
            modifiedRiskCoding.claimCoinsurance.bPPReqdLimit = parseInt(modifiedRiskCoding.claimCoinsurance.bPPReqdLimit);
            modifiedRiskCoding.claimCoinsurance.bPPLimit = parseFloat(modifiedRiskCoding.claimCoinsurance.bPPLimit);
            modifiedRiskCoding.claimCoinsurance.bPPPenalty = parseFloat(modifiedRiskCoding.claimCoinsurance.bPPPenalty);
            modifiedRiskCoding.claimCoinsurance.bPPPenaltyAmt = parseFloat(modifiedRiskCoding.claimCoinsurance.bPPPenaltyAmt);

            modifiedRiskCoding.claimCoinsurance.bIValue = parseFloat(modifiedRiskCoding.claimCoinsurance.bIValue);
            modifiedRiskCoding.claimCoinsurance.bIReqdLimit = parseFloat(modifiedRiskCoding.claimCoinsurance.bIReqdLimit);
            modifiedRiskCoding.claimCoinsurance.bILimit = parseFloat(modifiedRiskCoding.claimCoinsurance.bILimit);
            modifiedRiskCoding.claimCoinsurance.bIPenalty = parseFloat(modifiedRiskCoding.claimCoinsurance.bIPenalty);
            modifiedRiskCoding.claimCoinsurance.bIPenaltyAmt = parseFloat(modifiedRiskCoding.claimCoinsurance.bIPenaltyAmt);

            modifiedRiskCoding.claimCoinsurance.bLDGValue = parseFloat(modifiedRiskCoding.claimCoinsurance.bLDGValue);
            modifiedRiskCoding.claimCoinsurance.bLDGReqdLimit = parseFloat(modifiedRiskCoding.claimCoinsurance.bLDGReqdLimit);
            modifiedRiskCoding.claimCoinsurance.bLDGLimit = parseFloat(modifiedRiskCoding.claimCoinsurance.bLDGLimit);
            modifiedRiskCoding.claimCoinsurance.bLDGPenalty = parseFloat(modifiedRiskCoding.claimCoinsurance.bLDGPenalty);
            modifiedRiskCoding.claimCoinsurance.bLDGPenaltyAmt = parseFloat(modifiedRiskCoding.claimCoinsurance.bLDGPenaltyAmt);
        }





        let result = await saveClaimRiskCodingDetail(modifiedRiskCoding);
        if (result.errors || result.error) {
            ParseGQErrors(result.errors, result.error);
        }
        else if (result.data.save) {
            loadRiskCodingDetail();
        }
        setIsSaving(false);
        setIsProcessing(false);

    }

    return (
        isProcessing ? <Spinner /> : <>
            <AppContainer>
                <Toolbar>
                    <ButtonGroup variant="text">
                        <IconButton name="Help" title="Help" onClick={onDrawerOpen}><HelpOutline /></IconButton>
                    </ButtonGroup>
                    {isSaving && <CircularProgress color="primary" size={20} style={{ marginRight: 10 }} />}
                </Toolbar>
                <TabContainer>

                    <Panel>
                        <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Loss Coding Details</span></PanelHeader>
                        <PanelContent>
                            <ContentRow>
                                <ContentCell width="33%">
                                    {
                                        metadata.loading ? <>Loading...</> :
                                            <SelectList
                                                disabled={isViewer}
                                                id="causeOfLossCode"
                                                name="causeOfLossCode"
                                                label="Claim Categories"
                                                fullWidth={true}
                                                allowempty={true}
                                                onChange={onDropDownChanged}
                                                variant="outlined"
                                                value={currentRiskCoding.causeOfLossCode}
                                                error={errors.causeOfLossCode}
                                                helperText={errors.causeOfLossCode ? errors.causeOfLossCode.message : ""}

                                            >
                                                {
                                                    causeOfLossCodeByG2LE.map(rs => <MenuItem value={rs.code}>{rs.description}</MenuItem>)
                                                }

                                            </SelectList>
                                    }
                                </ContentCell>
                                <ContentCell width="33%">
                                    {
                                        metadata.loading ? <>Loading...</> :
                                            <SelectList
                                                disabled={isViewer}
                                                id="lineOfBusinessCodingTypeID"
                                                name="lineOfBusinessCodingTypeID"
                                                label="Line Of Business"
                                                fullWidth={true}
                                                onChange={onDropDownChanged}
                                                variant="outlined"
                                                value={currentRiskCoding.lineOfBusinessCodingTypeID}
                                                error={errors.lineOfBusinessCodingTypeID}
                                                helperText={errors.lineOfBusinessCodingTypeID ? errors.lineOfBusinessCodingTypeID.message : ""}
                                            //tooltip={findHelpTextByTag("lineOfBusinessCodingTypeID", metadata.helpTags)}
                                            >
                                                {
                                                    lineOfBusinessCodingTypes.map(rs => <MenuItem value={rs.lineOfBusinessCodingTypeID}>{rs.lineOfBusinessCodingText}</MenuItem>)
                                                }

                                            </SelectList>
                                    }
                                </ContentCell>
                                {claim.g2LegalEntityID === LEGAL_ENTITY.GENERAL_STAR && metadata.claimDetail.claimType === CLAIM_TYPES.CASUALTY &&
                                    <ContentCell width="33%">
                                        {
                                            metadata.loading ? <>Loading...</> :
                                                <SelectList
                                                    disabled={isViewer}
                                                    id="professionalClaimCategoryID"
                                                    name="professionalClaimCategoryID"
                                                    label="Professional Claim Category"
                                                    fullWidth={true}
                                                    allowempty={true}
                                                    onChange={onDropDownChanged}
                                                    variant="outlined"
                                                    value={currentRiskCoding.professionalClaimCategoryID}
                                                    error={errors.professionalClaimCategoryID}
                                                    helperText={errors.professionalClaimCategoryID ? errors.professionalClaimCategoryID.message : ""}
                                                //tooltip={findHelpTextByTag("professionalClaimCategoryID", metadata.helpTags)}

                                                >
                                                    {
                                                        professionalClaimCategories.map(rs => <MenuItem value={rs.professionalClaimCategoryID}>{rs.description}</MenuItem>)
                                                    }

                                                </SelectList>
                                        }
                                    </ContentCell>
                                }
                            </ContentRow>
                            {metadata.claimDetail.claimType === CLAIM_TYPES.PROPERTY &&
                                <>
                                    <Divider />
                                    <ContentRow>
                                        <ContentCell width="33%">
                                            <NumericInput
                                                disabled={isViewer}
                                                id="claimCAT.cATNumber"
                                                name="claimCAT.cATNumber"
                                                label="CAT Number"
                                                onChange={onNumberChanged}
                                                value={(currentRiskCoding.claimCAT || {}).cATNumber}
                                                onBlur={() => onSave(null)}
                                            //tooltip={findHelpTextByTag("cATNumber", metadata.helpTags)}

                                            />
                                        </ContentCell>
                                        <ContentCell width="33%">
                                            <CurrencyInput
                                                disabled={isViewer}
                                                inputProps={{ maxlength: 15 }}
                                                id="claimCAT.cATDeductible"
                                                name="claimCAT.cATDeductible"
                                                label="CAT Deductible"
                                                onChange={onCurrencyChanged}
                                                value={(currentRiskCoding.claimCAT || {}).cATDeductible}
                                                onBlur={() => onSave(null)}
                                            //tooltip={findHelpTextByTag("cATDeductible", metadata.helpTags)}

                                            />
                                        </ContentCell>
                                    </ContentRow>
                                    <ContentRow>
                                        <ContentCell width="33%">
                                            <CurrencyInput
                                                disabled={isViewer}
                                                id="claimCAT.cATLimit"
                                                name="claimCAT.cATLimit"
                                                label="CAT Limit"
                                                inputProps={{ maxlength: 15 }}
                                                onChange={onCurrencyChanged}
                                                variant="outlined"
                                                value={(currentRiskCoding.claimCAT || {}).cATLimit}
                                                onBlur={() => onSave(null)}
                                            //tooltip={findHelpTextByTag("cATLimit", metadata.helpTags)}
                                            />
                                        </ContentCell>
                                        <ContentCell width="33%">
                                            <SelectList
                                                disabled={isViewer}
                                                id="claimCAT.cATTotalLossIndicator"
                                                name="claimCAT.cATTotalLossIndicator"
                                                label="Total Loss"
                                                fullWidth={true}
                                                onChange={onDropDownChanged}
                                                variant="outlined"
                                                value={(currentRiskCoding.claimCAT || {}).cATTotalLossIndicator}
                                                error={errors.lineOfBusinessCodingTypeID}
                                                helperText={errors.cATTotalLossIndicator ? errors.cATTotalLossIndicator.message : ""}
                                            //tooltip={findHelpTextByTag("cATTotalLossIndicator", metadata.helpTags)}

                                            >
                                                <MenuItem value="true">Yes</MenuItem>
                                                <MenuItem value="false">No</MenuItem>
                                            </SelectList>
                                        </ContentCell>

                                    </ContentRow>
                                    <Divider />

                                    <ContentRow>
                                        <TableContentHeaderCellLeft width="33%">
                                            BLDG
                                        </TableContentHeaderCellLeft>
                                        <TableContentHeaderCellCenter width="33%">
                                            BPP
                                        </TableContentHeaderCellCenter>
                                        <TableContentHeaderCellRight width="34%">
                                            BI
                                        </TableContentHeaderCellRight>
                                    </ContentRow>
                                    <ContentRow>
                                        <TableContentCellLeft width="33%">
                                            <CurrencyInput
                                                disabled={isViewer}
                                                id="claimCoinsurance.bLDGValue"
                                                name="claimCoinsurance.bLDGValue"
                                                label="BLDG Value"
                                                inputProps={{ maxlength: 15 }}
                                                onChange={onCurrencyChanged}
                                                value={(currentRiskCoding.claimCoinsurance || {}).bLDGValue}
                                                onBlur={() => onSave(null)}
                                            //tooltip={findHelpTextByTag("bLDGValue", metadata.helpTags)}
                                            />
                                        </TableContentCellLeft>
                                        <TableContentCellCenter width="33%">
                                            <CurrencyInput
                                                disabled={isViewer}
                                                id="claimCoinsurance.bPPValue"
                                                inputProps={{ maxlength: 15 }}
                                                name="claimCoinsurance.bPPValue"
                                                label="BPP Value"
                                                onChange={onCurrencyChanged}
                                                value={(currentRiskCoding.claimCoinsurance || {}).bPPValue}
                                                onBlur={() => onSave(null)}
                                            //tooltip={findHelpTextByTag("bPPValue", metadata.helpTags)}
                                            />
                                        </TableContentCellCenter>
                                        <TableContentCellRight width="34%">
                                            <CurrencyInput
                                                disabled={isViewer}
                                                id="claimCoinsurance.bIValue"
                                                name="claimCoinsurance.bIValue"
                                                label="BI Value"
                                                inputProps={{ maxlength: 15 }}
                                                onChange={onCurrencyChanged}
                                                value={(currentRiskCoding.claimCoinsurance || {}).bIValue}
                                                onBlur={() => onSave(null)}
                                            //tooltip={findHelpTextByTag("bIValue", metadata.helpTags)}
                                            />
                                        </TableContentCellRight>
                                    </ContentRow>
                                    <ContentRow>
                                        <TableContentCellLeft width="33%">
                                            <CurrencyInput
                                                disabled={isViewer}
                                                id="claimCoinsurance.bLDGReqdLimit"
                                                name="claimCoinsurance.bLDGReqdLimit"
                                                label="BLDG Reqd Limit"
                                                inputProps={{ maxlength: 15 }}
                                                onChange={onCurrencyChanged}
                                                value={(currentRiskCoding.claimCoinsurance || {}).bLDGReqdLimit}
                                                onBlur={() => onSave(null)}
                                            //tooltip={findHelpTextByTag("bLDGReqdLimit", metadata.helpTags)}
                                            />
                                        </TableContentCellLeft>
                                        <TableContentCellCenter width="33%">
                                            <CurrencyInput
                                                disabled={isViewer}
                                                inputProps={{ maxlength: 15 }}
                                                id="claimCoinsurance.bPPReqdLimit"
                                                name="claimCoinsurance.bPPReqdLimit"
                                                label="BPP Reqd Limit"
                                                onChange={onCurrencyChanged}
                                                value={(currentRiskCoding.claimCoinsurance || {}).bPPReqdLimit}
                                                onBlur={() => onSave(null)}
                                            //tooltip={findHelpTextByTag("bPPReqdLimit", metadata.helpTags)}
                                            />
                                        </TableContentCellCenter>
                                        <TableContentCellRight width="34%">
                                            <CurrencyInput
                                                disabled={isViewer}
                                                inputProps={{ maxlength: 15 }}
                                                id="claimCoinsurance.bIReqdLimit"
                                                name="claimCoinsurance.bIReqdLimit"
                                                label="BI Reqd Limit"
                                                onChange={onCurrencyChanged}
                                                value={(currentRiskCoding.claimCoinsurance || {}).bIReqdLimit}
                                                onBlur={() => onSave(null)}
                                            //tooltip={findHelpTextByTag("bIReqdLimit", metadata.helpTags)}
                                            />
                                        </TableContentCellRight>
                                    </ContentRow>
                                    <ContentRow>
                                        <TableContentCellLeft width="33%">
                                            <CurrencyInput
                                                disabled={isViewer}
                                                inputProps={{ maxlength: 15 }}
                                                id="claimCoinsurance.bLDGLimit"
                                                name="claimCoinsurance.bLDGLimit"
                                                label="BLDG Limit"
                                                onChange={onCurrencyChanged}
                                                value={(currentRiskCoding.claimCoinsurance || {}).bLDGLimit}
                                                onBlur={() => onSave(null)}
                                            //tooltip={findHelpTextByTag("bLDGLimit", metadata.helpTags)}
                                            />
                                        </TableContentCellLeft>
                                        <TableContentCellCenter width="33%">
                                            <CurrencyInput
                                                disabled={isViewer}
                                                inputProps={{ maxlength: 15 }}
                                                id="claimCoinsurance.bPPLimit"
                                                name="claimCoinsurance.bPPLimit"
                                                label="BPP Limit"
                                                onChange={onCurrencyChanged}
                                                value={(currentRiskCoding.claimCoinsurance || {}).bPPLimit}
                                                onBlur={() => onSave(null)}
                                            //tooltip={findHelpTextByTag("bPPLimit", metadata.helpTags)}
                                            />
                                        </TableContentCellCenter>
                                        <TableContentCellRight width="34%">
                                            <CurrencyInput
                                                disabled={isViewer}
                                                id="claimCoinsurance.bILimit"
                                                name="claimCoinsurance.bILimit"
                                                label="BI Limit"
                                                inputProps={{ maxlength: 15 }}
                                                onChange={onCurrencyChanged}
                                                value={(currentRiskCoding.claimCoinsurance || {}).bILimit}
                                                onBlur={() => onSave(null)}
                                            //tooltip={findHelpTextByTag("bILimit", metadata.helpTags)}
                                            />
                                        </TableContentCellRight>
                                    </ContentRow>
                                    <ContentRow>
                                        <TableContentCellLeft width="33%">
                                            <PercentageInput
                                                disabled={isViewer}
                                                id="claimCoinsurance.bLDGPenalty"
                                                name="claimCoinsurance.bLDGPenalty"
                                                label="BLDG Penalty"
                                                onChange={onPercentAgeChanged}
                                                value={(currentRiskCoding.claimCoinsurance || {}).bLDGPenalty}
                                                onBlur={() => onSave(null)}
                                            //tooltip={findHelpTextByTag("bLDGPenalty", metadata.helpTags)}
                                            />
                                        </TableContentCellLeft>
                                        <TableContentCellCenter width="33%">
                                            <PercentageInput
                                                disabled={isViewer}
                                                id="claimCoinsurance.bPPPenalty"
                                                name="claimCoinsurance.bPPPenalty"
                                                label="BPP Penalty"
                                                fullWidth={true}
                                                onChange={onPercentAgeChanged}
                                                value={(currentRiskCoding.claimCoinsurance || {}).bPPPenalty}
                                                onBlur={() => onSave(null)}
                                            //tooltip={findHelpTextByTag("bPPPenalty", metadata.helpTags)}
                                            />
                                        </TableContentCellCenter>
                                        <TableContentCellRight width="34%">
                                            <PercentageInput
                                                disabled={isViewer}
                                                id="claimCoinsurance.bIPenalty"
                                                name="claimCoinsurance.bIPenalty"
                                                label="BI Penalty"
                                                onChange={onPercentAgeChanged}
                                                value={(currentRiskCoding.claimCoinsurance || {}).bIPenalty}
                                                onBlur={() => onSave(null)}
                                            //tooltip={findHelpTextByTag("bIPenalty", metadata.helpTags)}
                                            />
                                        </TableContentCellRight>
                                    </ContentRow>
                                    <ContentRow>
                                        <TableContentFooterCellLeft width="33%">
                                            <CurrencyInput
                                                disabled={isViewer}
                                                id="claimCoinsurance.bLDGPenaltyAmt"
                                                name="claimCoinsurance.bLDGPenaltyAmt"
                                                label="BLDG Penalty Amount"
                                                inputProps={{ maxlength: 15 }}
                                                onChange={onCurrencyChanged}
                                                value={(currentRiskCoding.claimCoinsurance || {}).bLDGPenaltyAmt}
                                                onBlur={() => onSave(null)}
                                            //tooltip={findHelpTextByTag("bLDGPenaltyAmt", metadata.helpTags)}
                                            />
                                        </TableContentFooterCellLeft>
                                        <TableContentFooterCellCenter width="33%">
                                            <CurrencyInput
                                                disabled={isViewer}
                                                id="claimCoinsurance.bPPPenaltyAmt"
                                                name="claimCoinsurance.bPPPenaltyAmt"
                                                label="BPP Penalty Amount"
                                                inputProps={{ maxlength: 15 }}
                                                onChange={onCurrencyChanged}
                                                value={(currentRiskCoding.claimCoinsurance || {}).bPPPenaltyAmt}
                                                onBlur={() => onSave(null)}
                                            //tooltip={findHelpTextByTag("bPPPenaltyAmt", metadata.helpTags)}
                                            />
                                        </TableContentFooterCellCenter>
                                        <TableContentFooterCellRight width="34%">
                                            <CurrencyInput
                                                disabled={isViewer}
                                                id="claimCoinsurance.bIPenaltyAmt"
                                                name="claimCoinsurance.bIPenaltyAmt"
                                                label="BI Penalty Amount"
                                                inputProps={{ maxlength: 15 }}
                                                onChange={onCurrencyChanged}
                                                value={(currentRiskCoding.claimCoinsurance || {}).bIPenaltyAmt}
                                                onBlur={() => onSave(null)}
                                            //tooltip={findHelpTextByTag("bIPenaltyAmt", metadata.helpTags)}
                                            />
                                        </TableContentFooterCellRight>
                                    </ContentRow>
                                </>}
                        </PanelContent>
                    </Panel>
                </TabContainer>
            </AppContainer>
            <HelpDrawer open={open} onClose={onDrawerClose} containerName={helpContainerName} key={helpContainerName} />
        </>
    );
};

export default ClaimRiskCodingTab;
