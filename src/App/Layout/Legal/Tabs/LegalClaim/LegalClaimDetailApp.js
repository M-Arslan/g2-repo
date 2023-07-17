import {
    Divider,
    FormControlLabel,
    MenuItem,
    ButtonGroup,
    Checkbox,
    FormGroup,
    AccordionDetails as ExpansionPanelDetails,
    IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
    CloudDownload
} from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import {
    associatedPolicyContractSelectors,
    associatedPolicyContractActions,
} from "../../../../Core/State/slices/associated-policy-contracts";
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { ASYNC_STATES } from '../../../../Core/Enumerations/redux/async-states';
import { DatePicker, formatDate, Panel, PanelContent, PanelHeader, SelectList, Spinner, TextInput } from '../../../../Core/Forms/Common';
import {
    LossDescDrawer
} from "./Drawer/LossDescDrawer";
import {
    ensureNonEmptyString
} from '../../../../Core/Utility/rules';
import {
    claimActions
} from '../../../../Core/State/slices/claim';
import {
    LegalClaimActions,
    LegalClaimSelectors
} from '../../../../Core/State/slices/legal-claim';
import {
    claimDetailFlagTypesSelectors
} from '../../../../Core/State/slices/metadata/claimDetailFlagTypes';
import {
    usersSelectors
} from '../../../../Core/State/slices/users';
import {
    AppHost,
    useAppHost
} from '../../../../Layout/Claim/Tabs/AppHost';
import { AppContainer, TabContainer } from '../../../Claim/Tabs/TabContainer';
import {
    companiesSelectors
} from '../../../../Core/State/slices/metadata/companies';
import { APP_TYPES } from '../../../../Core/Enumerations/app/app-types';
import { useSnackbar } from 'notistack';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { DownloadExtractModal } from '../../../Claim/Tabs/ClaimDetail/Components/Download/DownloadExtractModal';
import { COMPANY_NAME } from '../../../../Core/Enumerations/app/company-name';
import { checkStatClaimID } from '../../../Claim/Tabs/ClaimDetail/Queries/checkStatClaimID';
const useStyles = makeStyles((theme) => ({
    panelDetails: {
        flexDirection: "column",
    },
    cellDesign: {
        alignItems: "baseline"
    },
    drawer: {
        width: 700,
        flexShrink: 0,
        listStyle: 'none',
        listStyleType: 'none',
    },
    drawerPaper: {
        width: 700,
        top: '60px',
    }
}));

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
const DateContentCell = styled.div`
    padding: 1em;
`;

function stripTags(html) {
    let doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent ?? "";
}
export const LegalClaimDetailApp = ({ claim, legalClaim }) => {
    const [isReadMore, setIsReadMore] = React.useState(false);
    const { enqueueSnackbar } = useSnackbar(); 
    const [isProcessing, setIsProcessing] = React.useState(true);
    //const [isSaving, setIsSaving] = React.useState(false);
    const [lossDesc, setLossDesc] = React.useState(claim.fullDescriptionOfLoss || "");
    const [statutoryClaimID, setStatutoryClaimID] = React.useState(claim.statutoryClaimID);
    const [statutorySystem, setStatutorySystem] = React.useState(claim.statutorySystem);
    const classes = useStyles();
    let { id } = useParams();
    const $dispatch = useDispatch();
    const policyContracts = useSelector(associatedPolicyContractSelectors.selectData()) || [];
    const claimCounsils = useSelector(usersSelectors.getClaimCounsel());
    const claimDetailFlagTypes = useSelector(claimDetailFlagTypesSelectors.selectData());
    const legalClaimLoaded = useSelector(LegalClaimSelectors.selectLoading());

    const $host = useAppHost();
    const isViewer = $host.isViewer || $host.appIsReadonly;
    let companies = useSelector(companiesSelectors.selectData()) || [];
    companies = companies?.filter((e) => {
        return e.g2CompanyNameID !== COMPANY_NAME.OTHER;
    });

    const [downloadOpen, setDownloadOpen] = React.useState(false);

    const downloadExtract = () => {
        setDownloadOpen(true);
    }

    const downloadComplete = () => {
        setDownloadOpen(false);
    }


    React.useEffect(() => {
        $dispatch(associatedPolicyContractActions.getList({ claimMasterID: claim.claimMasterID || id, onlyLoadPrimary: false }));
        if (legalClaimLoaded === ASYNC_STATES.SUCCESS) { setIsProcessing(false) }
    }, [legalClaimLoaded]);

    const onValueChanged = (e) => {
        const { name, value } = e.target;

        if (name === "g2CompanyNameID") {
            let g2LegalEntityID = companies.filter(X => X.g2CompanyNameID === value)[0].g2LegalEntityID;
            if (value === 4) {
                doAutoSave({ ...legalClaim, [name]: value }, { ...claim, [name]: value, "g2LegalEntityID": g2LegalEntityID });
            } else {
                doAutoSave({ ...legalClaim, [name]: value }, { ...claim, [name]: value, "g2LegalEntityID": g2LegalEntityID, ["statutorySystem"]: null, ["statutoryClaimID"]: null });
                setStatutorySystem(null);
                setStatutoryClaimID(null);
            }
         }
        else {
            doAutoSave({ ...legalClaim, [name]: value }, { ...claim });
        }
    }
    const onLossDescChanged = (e) => {
        const { name, value } = e.target;
        if (name === "lossDesc") {
            setLossDesc(value);
        }
        if (name === "statutorySystem") {
            setStatutorySystem(value);
            doAutoSave({ ...legalClaim }, { ...claim, ["statutorySystem"]: value});

        }
        if (name === "statutoryClaimID") {
            setStatutoryClaimID(value);
        }
    }
    const onLossDescBlur = async (e) => {
        if (statutoryClaimID !== "") {
            const result = await checkStatClaimID(claim.claimMasterID, statutoryClaimID);
            console.log("checking the result", result)
            if (result?.errors?.length > 0) {
                setStatutoryClaimID(null);
                enqueueSnackbar(`${result.errors[0].message}`, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                doAutoSave({ ...legalClaim }, { ...claim, ["statutoryClaimID"]: null });
                return;
            }
        }
        doAutoSave({ ...legalClaim }, { ...claim, ["fullDescriptionOfLoss"]: lossDesc, ["statutorySystem"]: statutorySystem, ["statutoryClaimID"]: statutoryClaimID });
    }

    const onCheckboxChecked = (evt, item) => {
        let claimDetailFlags = JSON.parse(JSON.stringify(legalClaim?.claimDetailFlags || []));

        if (evt.target.checked)
            claimDetailFlags.push({ claimDetailID: legalClaim.claimDetailID, claimDetailFlagTypeID: item.claimDetailFlagTypeID });
        else
            claimDetailFlags = claimDetailFlags.filter(X => X.claimDetailFlagTypeID !== item.claimDetailFlagTypeID);

        doAutoSave({ ...legalClaim, claimDetailFlags: claimDetailFlags }, { ...claim });
    }
    const onDateChanged = (e) => {
        const { name, value } = e.target;
        enqueueSnackbar("The claim was saved successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        doAutoSave({ ...legalClaim, [name]: value }, claim);
    };
    const doAutoSave = async (legal_claim, claim) => {
        legal_claim.claimMasterID = claim.claimMasterID;
        $dispatch(LegalClaimActions.save({ legal_claim }))
        if (policyContracts && policyContracts.length) {
            policyContracts.map((i) => (
                i.isPrimary &&
                (claim.claimPolicyID = i.policyID)

            ))
        }
        claim.claimExaminerID = legal_claim.claimCounselUserID
        $dispatch(claimActions.save({ claim }))
        setLossDesc(claim.fullDescriptionOfLoss)
        setIsReadMore(false);
    }
    const onAddNew = async (res) => {
        //onClose({ confirmed: true, content: htmlContent, raw, isSupervisor: (isSupervisor === true) });

        if (res.confirmed === true && ensureNonEmptyString(res.content)) {

            doAutoSave({ ...legalClaim }, { ...claim, ["fullDescriptionOfLoss"]: res.content });
            setIsReadMore(false);
        }
        else {
            setIsReadMore(false);
        }
    };



    return (
        isProcessing ? <Spinner /> : <>
            <DownloadExtractModal open={downloadOpen} onClose={downloadComplete} />

            <LossDescDrawer open={isReadMore} onClose={onAddNew} content={lossDesc} doAutoSave={doAutoSave} legalclaim={legalClaim} claims={claim} isViewer={isViewer} />
            <AppContainer>
                <Toolbar>
                    <ButtonGroup variant="text">
                        <IconButton name="Download" title="Download Legal Claim Extract" onClick={downloadExtract}>
                            <CloudDownload />
                        </IconButton>
                        {/*  <IconButton name="Help" title="Help" onClick={onDrawerOpen}><HelpOutline /></IconButton> */}
                    </ButtonGroup>
                    {/*{isSaving && <CircularProgress color="primary" size={20} style={{ marginRight: 10 }} />}*/}
                </Toolbar>
                <TabContainer>
                    <Panel>
                        <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Legal Claim Detail</span></PanelHeader>
                        <PanelContent>
                            <ContentRow>
                                <ContentCell width="33%">
                                    <SelectList
                                        id="search"
                                        label="Claim Counsel Search"
                                        value={legalClaim?.claimCounselUserID}
                                        variant="outlined"
                                        name="claimCounselUserID"
                                        onChange={onValueChanged}
                                        disabled={isViewer}
                                        allowempty={false}
                                        required
                                    >
                                        {claimCounsils.length ?
                                            claimCounsils.map((x) => <MenuItem value={x.userID}>{x.fullName}</MenuItem>)
                                            : null}
                                    </SelectList>
                                </ContentCell>
                                <ContentCell width="33%">
                                    <TextInput
                                        disableFuture={true}
                                        id="manager"
                                        name="manager"
                                        label="Manager"
                                        required
                                        fullWidth={true}
                                        onChange={onValueChanged}
                                        variant="outlined"
                                        value={claimCounsils?.filter((x) => (x.userID?.toLowerCase() === legalClaim?.claimCounselUserID?.toLowerCase()))[0]?.managerID || ''}
                                        disabled={isViewer}
                                    />
                                </ContentCell>
                                <ContentCell width="33%">
                                    <DatePicker
                                        id="assignedToCounsel"
                                        name="assignedToCounsel"
                                        label="Assigned To Counsel"
                                        onChange={onDateChanged}
                                        variant="outlined"
                                        value={legalClaim?.assignedToCounsel || null}
                                        disableFuture={true}
                                        required
                                        helperText=''
                                        error=''
                                        disabled={isViewer}
                                    />
                                </ContentCell>
                            </ContentRow>
                            <Divider />
                            <ContentRow className={classes.cellDesign}>
                                <ContentCell width="33%">
                                    <SelectList
                                        id="g2CompanyNameID"
                                        label="Company Entity"
                                        name="g2CompanyNameID"
                                        value={claim?.g2CompanyNameID}
                                        variant="outlined"
                                        onChange={onValueChanged}
                                        allowempty={false}
                                        required
                                        disabled={isViewer}
                                    >
                                        {
                                            companies?.map((gc, idx) => <MenuItem value={gc.g2CompanyNameID} key={`ce__${idx}`}>{`${gc.companyName}`}</MenuItem>)
                                        }
                                    </SelectList>
                                </ContentCell>
                                {claim.g2CompanyNameID === COMPANY_NAME.GRC_GENERAL_REINSURANCE_CORPORATION && <>
                                    <ContentCell width="33%">
                                        <TextInput
                                            label="Statutory Claim ID"
                                            id="statutoryClaimID"
                                            name="statutoryClaimID"
                                            fullWidth={true}
                                            onChange={onLossDescChanged}
                                            onBlur={onLossDescBlur}
                                            inputProps={{
                                                maxLength: 50,
                                            }}
                                            value={statutoryClaimID || ""}
                                            disabled={isViewer}
                                        />
                                    </ContentCell>
                                    <ContentCell width="33%">
                                        <SelectList
                                            id="statutorySystem"
                                            label="Statutory System"
                                            name="statutorySystem"
                                            value={claim?.statutorySystem}
                                            variant="outlined"
                                            onChange={onLossDescChanged}
                                            onBlur={onLossDescBlur}
                                            allowempty={false}
                                            disabled={isViewer}
                                        >
                                            <MenuItem value={""} key={""}>{""}</MenuItem>
                                            <MenuItem value={"C"} key={"C"}>{"CONFER"}</MenuItem>
                                            <MenuItem value={"F"} key={"F"}>{"FSRI"}</MenuItem>
                                        </SelectList>
                                    </ContentCell>
                                </>
                                }
                            </ContentRow>
                            <ContentRow>
                                <ContentCell width="66%">
                                    <TextInput
                                        label="Description of Loss"
                                        id="lossDesc"
                                        name="lossDesc"
                                        fullWidth={true}
                                        onChange={onLossDescChanged}
                                        onBlur={onLossDescBlur}
                                        inputProps={{
                                            maxLength: 5000,
                                        }}
                                        value={stripTags(lossDesc)}
                                        multiline
                                        rows={5}
                                        disabled={true}
                                    />
                                </ContentCell>
                                <ContentCell>
                                    {isViewer ? < VisibilityIcon onClick={() => setIsReadMore(true)} /> : <EditIcon onClick={() => setIsReadMore(true)} />}
                                </ContentCell>
                            </ContentRow>

                            <ContentRow>
                                <ContentCell width="10%">
                                    <span style={{ fontWeight: 'bold' }}>Flags</span>
                                </ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell width="66%">
                                    <ExpansionPanelDetails className={classes.panelDetails} style={{ width: "50%" }}>
                                        {
                                            claimDetailFlagTypes?.map((item, idx) =>
                                                    <FormGroup row>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    id="claimDetailFlagTypes"
                                                                    name="claimDetailFlagTypes"
                                                                    color="primary"
                                                                    checked={(legalClaim?.claimDetailFlags || []).filter(X => X.claimDetailFlagTypeID === item.claimDetailFlagTypeID).length > 0}
                                                                    onChange={(evt)=>onCheckboxChecked(evt,item)}
                                                                    disabled={isViewer}
                                                                />
                                                            }
                                                            label={item.claimDetailFlagTypeName }
                                                        />
                                                    </FormGroup>
                                                )
                                        }
                                    </ExpansionPanelDetails>
                                    <ExpansionPanelDetails style={{ alignSelf: "flex-start", width:"50%" }}>

                                        <DateContentCell>
                                            <DatePicker
                                                id="uWDate"
                                                name="uWDate"
                                                label="UW file sent to Attorney"
                                                onChange={onDateChanged}
                                                variant="outlined"
                                                value={legalClaim?.uWDate || null}
                                                required
                                                helperText=''
                                                error=''
                                                disabled={isViewer}
                                            />
                                        </DateContentCell>
                                        <DateContentCell>
                                            <DatePicker
                                                id="mGADate"
                                                name="mGADate"
                                                label="MGA file sent to Attorney"
                                                onChange={onDateChanged}
                                                variant="outlined"
                                                value={legalClaim?.mGADate || null}
                                                required
                                                helperText=''
                                                error=''
                                                disabled={isViewer}
                                            />
                                        </DateContentCell>
                                        <DateContentCell>
                                            <DatePicker
                                                id="iADate"
                                                name="iADate"
                                                label="IA file sent to Attorney"
                                                onChange={onDateChanged}
                                                variant="outlined"
                                                value={legalClaim?.iADate || null}
                                                required
                                                helperText=''
                                                error=''
                                                disabled={isViewer}
                                            />

                                        </DateContentCell>
                                        <DateContentCell>
                                            <DatePicker
                                                id="uFDate"
                                                name="uFDate"
                                                label="Underlying file sent to Attorney"
                                                onChange={onDateChanged}
                                                variant="outlined"
                                                value={legalClaim?.uFDate || null}
                                                required
                                                helperText=''
                                                error=''
                                                disabled={isViewer}
                                            />

                                        </DateContentCell>

                                    </ExpansionPanelDetails>
                                </ContentCell>
                               
                                
                            </ContentRow>


                        </PanelContent>
                    </Panel>
                </TabContainer>
            </AppContainer>
        </>
    )
}

export default ({ claim, legalClaim }) => (
    <AppHost app={APP_TYPES.Legal_Claim_Detail}>
        <LegalClaimDetailApp claim={claim} legalClaim={legalClaim} />
    </AppHost>
);