import {
    Fade,
    Menu,
    MenuItem,
    IconButton,
    ButtonGroup,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    FormGroup,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import {
    ASYNC_STATES
} from '../../../../Core/Enumerations/redux/async-states';
import { CurrencyInput, DatePicker, Panel, PanelContent, PanelHeader, SelectList, Spinner, TextInput } from '../../../../Core/Forms/Common';
import {
    CourtSuitsSliceGetActions,
    CourtSuitsSliceGetSelectors,
    CourtSuitsSliceSaveActions,
    CourtSuitsSliceSaveSelectors
} from '../../../../Core/State/slices/courtSuits';
import {
    riskStatesActions,
    riskStatesSelectors
} from '../../../../Core/State/slices/metadata/risk-states';
import {
    useAppHost
} from '../../../../Layout/Claim/Tabs/AppHost';
import { AppContainer, TabContainer } from '../../../Claim/Tabs/TabContainer';




const Toolbar = styled.nav`
    width: 100%;
    height: auto;
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

export const CourtSuitsTab = ({ claim }) => {

    const $host = useAppHost();
    const isViewer = $host.isViewer || $host.appIsReadonly;


    let { id } = useParams();
    let $dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();



    const courtSuitsGetState = useSelector(CourtSuitsSliceGetSelectors.selectLoading());
    const courtSuitsSaveState = useSelector(CourtSuitsSliceSaveSelectors.selectLoading());
    const riskStatesState = useSelector(riskStatesSelectors.selectLoading());

    const courtSuits = useSelector(CourtSuitsSliceGetSelectors.selectData()) || {};
    const riskStates = useSelector(riskStatesSelectors.selectData()) || [];


    const [currentCourtSuits, setCurrentCourtSuits] = React.useState(courtSuits || {});
    const [isLoading, setIsLoading] = React.useState(false);
    const [isSaving, setIsSaving] = React.useState(false);
    const isProcessing =
        courtSuitsGetState === ASYNC_STATES.WORKING
        || courtSuitsSaveState === ASYNC_STATES.WORKING
        || riskStatesState === ASYNC_STATES.WORKING;



    const onValueChanged = (evt) => {
        setCurrentCourtSuits({ ...currentCourtSuits, [evt.target.name]: evt.target.value });
    };

    const onCurrencyChanged = (evt) => {
        setCurrentCourtSuits({ ...currentCourtSuits, [evt.target.name]: evt.target.value });

    };

    const onDropDownChanged = (evt) => {
        if (evt.target.name === 'caseSettled') {
            evt.target.value = JSON.parse(evt.target.value);
        }
        setCurrentCourtSuits({ ...currentCourtSuits, [evt.target.name]: evt.target.value });
        //onSave({ ...currentCourtSuits, [evt.target.name]: evt.target.value });
    };
    const onDateChanged = (evt) => {
        setCurrentCourtSuits({ ...currentCourtSuits, [evt.target.name]: evt.target.value ? new Date(evt.target.value).toISOString() : null });
        //onSave({ ...currentCourtSuits, [evt.target.name]: evt.target.value });
    };
    const onCheckboxChecked = (evt) => {
        setCurrentCourtSuits({ ...currentCourtSuits, [evt.target.name]: evt.target.checked });
        //onSave({ ...currentCourtSuits, [evt.target.name]: evt.target.checked });
    }

    React.useEffect(() => {

        if (courtSuitsGetState === ASYNC_STATES.IDLE && !currentCourtSuits.courtSuitInfoID) {
            setIsLoading(true);
            $dispatch(CourtSuitsSliceGetActions.get({ claimMasterID: id }));
        }
        if (riskStatesState === ASYNC_STATES.IDLE) {
            setIsLoading(true);
            $dispatch(riskStatesActions.get());
        }


        if (courtSuitsGetState === ASYNC_STATES.SUCCESS) {
            setCurrentCourtSuits(JSON.parse(JSON.stringify(courtSuits)));
            setIsLoading(false);
            $dispatch(CourtSuitsSliceGetActions.clearStatus());


        }
        else if (courtSuitsGetState === ASYNC_STATES.ERROR) {
            enqueueSnackbar("An error occured", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            setIsLoading(false);
            $dispatch(CourtSuitsSliceGetActions.clearStatus());
        }


        if (courtSuitsSaveState === ASYNC_STATES.SUCCESS) {
            enqueueSnackbar("Court Suits infomation has been saved successfully.", { variant: 'success',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            $dispatch(CourtSuitsSliceSaveActions.clearStatus());
            $dispatch(CourtSuitsSliceGetActions.get({ claimMasterID: id }));
            setIsSaving(false);
        }
        else if (courtSuitsSaveState === ASYNC_STATES.ERROR) {
            enqueueSnackbar("An error occured", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            setIsSaving(false);
            $dispatch(CourtSuitsSliceSaveActions.clearStatus());
        }

    }, [isProcessing])


    const onSave = () => {
        $dispatch(CourtSuitsSliceSaveActions.save({ courtSuits: { ...currentCourtSuits, claimMasterID: id } }));
        setIsSaving(true);
        setIsLoading(currentCourtSuits.courtSuitInfoID ? false : true);
        setAnchorEl(null);
    }
    const [anchorEl, setAnchorEl] = React.useState(null);

    const onMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const onMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        isLoading ? <Spinner /> : <>
            <AppContainer>
                <Toolbar>
                    <ButtonGroup variant="text">
                        {!isViewer &&
                            <IconButton name="Actions" title="More Actions" onClick={onMenuOpen} ><MenuIcon />
                            </IconButton>
                        }
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={onMenuClose}
                            TransitionComponent={Fade}
                        >
                        <MenuItem onClick={onSave}>Submit</MenuItem>
                        </Menu>
                    </ButtonGroup>
                    {isSaving && <CircularProgress color="primary" size={20} style={{ marginRight: 10 }} />}
                </Toolbar>
                <TabContainer>
                    <Panel>
                        <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Court Information</span></PanelHeader>
                        <PanelContent>
                            <ContentRow>
                                <ContentCell width="99%">
                                    <TextInput
                                        id="legalCaseCaption"
                                        name="legalCaseCaption"
                                        label="Legal Case Caption"
                                        fullWidth={true}
                                        onChange={onValueChanged}
                                        value={currentCourtSuits.legalCaseCaption}
                                        variant="outlined"
                                        //onBlur={() => onSave(null)}
                                        disabled={isViewer}
                                        inputProps={{ maxlength: 256 }}
                                    />
                                </ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell width="33%">
                                    <TextInput
                                        id="legalCaseDocketNumber"
                                        name="legalCaseDocketNumber"
                                        label="Legal Case Docket Number"
                                        fullWidth={true}
                                        onChange={onValueChanged}
                                        value={currentCourtSuits.legalCaseDocketNumber}
                                        variant="outlined"
                                        //onBlur={() => onSave(null)}
                                        disabled={isViewer}
                                    />
                                </ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell width="33%">
                                    <SelectList
                                        id="state"
                                        name="state"
                                        label="State"
                                        fullWidth={true}
                                        value={currentCourtSuits.state}
                                        key={currentCourtSuits.state}
                                        onChange={onDropDownChanged}
                                        variant="outlined"
                                        disabled={isViewer}
                                    >
                                        {
                                            riskStates.map((rs, idx) => <MenuItem value={`${rs.riskStateID}`} key={`state-option-${idx}`}>{rs.stateName}</MenuItem>)
                                        }
                                    </SelectList>
                                </ContentCell>
                                <ContentCell width="33%">
                                    <SelectList
                                        id="venue"
                                        name="venue"
                                        label="Venue"
                                        fullWidth={true}
                                        value={currentCourtSuits.venue}
                                        key={currentCourtSuits.venue}
                                        onChange={onDropDownChanged}
                                        variant="outlined"
                                        disabled={isViewer}
                                    >
                                        <MenuItem value={"S"} >{"State Court"}</MenuItem>
                                        <MenuItem value={"F"} >{"Federal Court"}</MenuItem>

                                    </SelectList>
                                </ContentCell>
                                <ContentCell width="33%">
                                    <TextInput
                                        id="courtName"
                                        name="courtName"
                                        label="Court Name"
                                        fullWidth={true}
                                        onChange={onValueChanged}
                                        value={currentCourtSuits.courtName}
                                        variant="outlined"
                                        //onBlur={() => onSave(null)}
                                        disabled={isViewer}
                                    />
                                </ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell width="99%">
                                    <TextInput
                                        id="ulCaseCaption"
                                        name="ulCaseCaption"
                                        label="U/L Case Caption"
                                        fullWidth={true}
                                        onChange={onValueChanged}
                                        value={currentCourtSuits.ulCaseCaption}
                                        variant="outlined"
                                        //onBlur={() => onSave(null)}
                                        disabled={isViewer}
                                        multiline
                                        rows={3}
                                    />
                                </ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell width="33%">
                                    <TextInput
                                        id="ulCaseDocketNumber"
                                        name="ulCaseDocketNumber"
                                        label="U/L Case Docket Number"
                                        fullWidth={true}
                                        onChange={onValueChanged}
                                        value={currentCourtSuits.ulCaseDocketNumber}
                                        variant="outlined"
                                        //onBlur={() => onSave(null)}
                                        disabled={isViewer}
                                    />
                                </ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell width="33%">
                                    <SelectList
                                        id="ulClaimState"
                                        name="ulClaimState"
                                        label="U/L Claim State"
                                        fullWidth={true}
                                        value={currentCourtSuits.ulClaimState}
                                        key={currentCourtSuits.ulClaimState}
                                        onChange={onDropDownChanged}
                                        variant="outlined"
                                        disabled={isViewer}
                                    >
                                        {
                                            riskStates.map((rs, idx) => <MenuItem value={`${rs.riskStateID}`} key={`state-option-${idx}`}>{rs.stateName}</MenuItem>)
                                        }
                                    </SelectList>
                                </ContentCell>
                                <ContentCell width="33%">
                                    <SelectList
                                        id="ulVenue"
                                        name="ulVenue"
                                        label="U/L Venue"
                                        fullWidth={true}
                                        value={currentCourtSuits.ulVenue}
                                        key={currentCourtSuits.ulVenue}
                                        onChange={onDropDownChanged}
                                        variant="outlined"
                                        disabled={isViewer}
                                    >
                                        <MenuItem value={"S"} >{"State Court"}</MenuItem>
                                        <MenuItem value={"F"} >{"Federal Court"}</MenuItem>

                                    </SelectList>
                                </ContentCell>
                                <ContentCell width="33%">
                                    <TextInput
                                        id="ulCourtName"
                                        name="ulCourtName"
                                        label="U/L Court Name"
                                        fullWidth={true}
                                        onChange={onValueChanged}
                                        value={currentCourtSuits.ulCourtName}
                                        variant="outlined"
                                        //onBlur={() => onSave(null)}
                                        disabled={isViewer}
                                    />
                                </ContentCell>
                            </ContentRow>
                            <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Case Information</span></PanelHeader>
                            <ContentRow>
                                <ContentCell width="33%">
                                    <h3>Suit Info</h3>
                                </ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell width="33%">
                                    <DatePicker
                                        id="trialDate"
                                        name="trialDate"
                                        label="Trial Date"
                                        variant="outlined"
                                        disableFuture={false}
                                        value={currentCourtSuits.trialDate || null}
                                        key={currentCourtSuits.trialDate || null}
                                        onChange={onDateChanged}
                                        helperText=''
                                        error=''
                                        disabled={isViewer}
                                    />
                                </ContentCell>
                                <ContentCell width="33%">
                                    <DatePicker
                                        id="ulTrialDate"
                                        name="ulTrialDate"
                                        label="U/L Trial Date"
                                        variant="outlined"
                                        disableFuture={false}
                                        value={currentCourtSuits.ulTrialDate || null}
                                        key={currentCourtSuits.ulTrialDate || null}
                                        onChange={onDateChanged}
                                        helperText=''
                                        error=''
                                        disabled={isViewer}
                                    />
                                </ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell width="99%">
                                    <TextInput
                                        id="caseComment"
                                        name="caseComment"
                                        label="Case Comment"
                                        fullWidth={true}
                                        onChange={onValueChanged}
                                        value={currentCourtSuits.caseComment}
                                        variant="outlined"
                                        //onBlur={() => onSave(null)}
                                        disabled={isViewer}
                                    />
                                </ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell width="33%">
                                    <h3>Mediation Details</h3>
                                </ContentCell>
                            </ContentRow>

                            <ContentRow>
                                <ContentCell width="33%">
                                    <DatePicker
                                        id="mediationDate"
                                        name="mediationDate"
                                        label="Mediation Date"
                                        variant="outlined"
                                        disableFuture={false}
                                        value={currentCourtSuits.mediationDate || null}
                                        key={currentCourtSuits.mediationDate || null}
                                        onChange={onDateChanged}
                                        helperText=''
                                        error=''
                                        disabled={isViewer}
                                    />
                                </ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell width="99%">
                                    <TextInput
                                        id="mediationComment"
                                        name="mediationComment"
                                        label="Mediation Comment"
                                        fullWidth={true}
                                        onChange={onValueChanged}
                                        value={currentCourtSuits.mediationComment}
                                        variant="outlined"
                                        //onBlur={() => onSave(null)}
                                        disabled={isViewer}
                                        inputProps={{ maxlength: 1024 }}
                                        multiline
                                        rows={5}
                                    />
                                </ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell width="33%">
                                    <DatePicker
                                        id="ulMediationDate"
                                        name="ulMediationDate"
                                        label="U/L Mediation Date"
                                        variant="outlined"
                                        disableFuture={false}
                                        value={currentCourtSuits.ulMediationDate || null}
                                        key={currentCourtSuits.ulMediationDate || null}
                                        onChange={onDateChanged}
                                        helperText=''
                                        error=''
                                        disabled={isViewer}
                                    />
                                </ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell width="99%">
                                    <TextInput
                                        id="ulMediationComment"
                                        name="ulMediationComment"
                                        label="U/L Mediation Comment"
                                        fullWidth={true}
                                        onChange={onValueChanged}
                                        value={currentCourtSuits.ulMediationComment}
                                        variant="outlined"
                                        //onBlur={() => onSave(null)}
                                        inputProps={{ maxlength: 1024 }}
                                        disabled={isViewer}
                                        multiline
                                        rows={5}
                                    />
                                </ContentCell>
                            </ContentRow>
                            <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Closing</span></PanelHeader>

                            <ContentRow>
                                <ContentCell width="33%">
                                    <SelectList
                                        disabled={isViewer}
                                        id="caseSettled"
                                        name="caseSettled"
                                        label="Was Case Settled"
                                        fullWidth={true}
                                        onChange={onDropDownChanged}
                                        variant="outlined"
                                        value={currentCourtSuits.caseSettled}
                                        key={currentCourtSuits.caseSettled}
                                    >
                                        <MenuItem value="true">Yes</MenuItem>
                                        <MenuItem value="false">No</MenuItem>
                                    </SelectList>
                                </ContentCell>
                                <ContentCell width="33%">
                                    <CurrencyInput
                                        disabled={isViewer}
                                        inputProps={{ maxlength: 15 }}
                                        id="amountGlobalSettlement"
                                        name="amountGlobalSettlement"
                                        label="Amount of Global Settlement"
                                        onChange={onCurrencyChanged}
                                        value={currentCourtSuits.amountGlobalSettlement}
                                        //onBlur={() => onSave(null)}
                                    />
                                </ContentCell>
                                <ContentCell width="33%">
                                    <CurrencyInput
                                        disabled={isViewer}
                                        inputProps={{ maxlength: 15 }}
                                        id="amountWePaidInSettlement"
                                        name="amountWePaidInSettlement"
                                        label="Amount we paid in Settlement"
                                        onChange={onCurrencyChanged}
                                        value={currentCourtSuits.amountWePaidInSettlement}
                                        //onBlur={() => onSave(null)}
                                    />
                                </ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell width="99%">
                                    <TextInput
                                        id="closingComment"
                                        name="closingComment"
                                        label="Closing Comment"
                                        fullWidth={true}
                                        onChange={onValueChanged}
                                        value={currentCourtSuits.closingComment}
                                        variant="outlined"
                                        //onBlur={() => onSave(null)}
                                        disabled={isViewer}
                                        multiline
                                        inputProps={{ maxlength: 1024 }}
                                        rows={5}
                                    />
                                </ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell width="99%">
                                    <FormGroup row>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    id="judgementBeforeTrial"
                                                    name="judgementBeforeTrial"
                                                    color="primary"
                                                    checked={currentCourtSuits.judgementBeforeTrial}
                                                    onChange={onCheckboxChecked}
                                                    disabled={isViewer}
                                                />
                                            }
                                            label="Judgement Before Trial"
                                        />
                                    </FormGroup>
                                    <FormGroup row>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    id="judgementAfterTrial"
                                                    name="judgementAfterTrial"
                                                    color="primary"
                                                    checked={currentCourtSuits.judgementAfterTrial}
                                                    onChange={onCheckboxChecked}
                                                    disabled={isViewer}
                                                />
                                            }
                                            label="Judgement After Trial"
                                        />
                                    </FormGroup>
                                    <FormGroup row>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    id="judgementNone"
                                                    name="judgementNone"
                                                    color="primary"
                                                    checked={currentCourtSuits.judgementNone}
                                                    onChange={onCheckboxChecked}
                                                    disabled={isViewer}
                                                />
                                            }
                                            label="Judgement None"
                                        />
                                    </FormGroup>
                                </ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell width="33%">
                                    <CurrencyInput
                                        disabled={isViewer}
                                        inputProps={{ maxlength: 15 }}
                                        id="totalPaidLegalClaimFile"
                                        name="totalPaidLegalClaimFile"
                                        label="Total Paid Legal Claim File"
                                        onChange={onCurrencyChanged}
                                        value={currentCourtSuits.totalPaidLegalClaimFile}
                                        //onBlur={() => onSave(null)}
                                    />
                                </ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell width="33%">
                                    <CurrencyInput
                                        disabled={isViewer}
                                        id="totalPaidULClaimFile"
                                        name="totalPaidULClaimFile"
                                        label="Total Paid U/L Claim File"
                                        onChange={onCurrencyChanged}
                                        inputProps={{ maxlength: 15 }}
                                        value={currentCourtSuits.totalPaidULClaimFile}
                                        //onBlur={() => onSave(null)}
                                    />
                                </ContentCell>
                            </ContentRow>
                        </PanelContent>
                    </Panel>
                </TabContainer>
            </AppContainer>
        </>
    );
};


