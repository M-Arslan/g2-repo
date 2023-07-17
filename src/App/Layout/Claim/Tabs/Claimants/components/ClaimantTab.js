import { ArrowBack, ChevronLeft, HelpOutline, Menu as MenuIcon, PostAdd, Save } from '@mui/icons-material';
import {
    Backdrop, Button,
    ButtonGroup,
    CircularProgress,
    Dialog,
    DialogContent, Divider,
    Drawer,
    IconButton,
    Menu,
    MenuItem,
    Slide,
    TextField
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { APP_TYPES } from '../../../../../Core/Enumerations/app/app-types';
import {
    ASYNC_STATES
} from '../../../../../Core/Enumerations/redux/async-states';
import { ROLES } from '../../../../../Core/Enumerations/security/roles';
import { ConfirmationDialog, SelectList, Spinner, UserInputDialog } from '../../../../../Core/Forms/Common';
import { loadUsers } from '../../../../../Core/Services/EntityGateway';
import { claimSelectors } from '../../../../../Core/State/slices/claim';
import {
    ClaimantActions,
    ClaimantCIBActivityActions,
    ClaimantCIBActivitySelectors,
    ClaimantFileCIBActions,
    ClaimantFileCIBSelectors,
    ClaimantFlagAsRejectedActions,
    ClaimantFlagAsRejectedSelectors,
    ClaimantFlagMedicareEligibleActions,
    ClaimantFlagMedicareEligibleSelectors, ClaimantListActions,
    ClaimantListSelectors,
    ClaimantReportedToCMSActions,
    ClaimantReportingToCMSNotRequiredActions,
    ClaimantReportingToCMSNotRequiredSelectors,
    ClaimantReportedToCMSSelectors,
    ClaimantReportToISOActions,
    ClaimantReportToISOSelectors, ClaimantSaveActions,
    ClaimantSaveSelectors, ClaimantSelectors
} from '../../../../../Core/State/slices/claimant';
import { userSelectors } from '../../../../../Core/State/slices/user';
import { createActionLogForFileCIB, createActionLogForFinacialActivityType, createActionLogForFlagAsMedicareEligibleAndInformCE, createActionLogForFlagAsRejectedByISOAndInformCE, createActionLogForReportedToCMS, createActionLogForReportToISO, createActionLogForReportingToCMSNotRequired} from '../../../../ActionLog/Queries';
import { HelpDrawer } from '../../../../Help/HelpDrawer';
import { createNotification } from '../../../../Notifications/Query/saveNotifications';
import { loadCIBDetails, loadClaimantCIBActivity, loadFileCIBActivity, loadIssueTypeList, saveActivity, saveIssueLogs } from '../../Accounting/Queries';
import { AppContainer, TabContainer } from '../../TabContainer';
import { ClaimantListSection } from './ClaimantListSection';
import { ClaimantMenu } from './ClaimantMenu';
import { InfoSectionSelector } from './InfoSectionSelector';
import { loadClaimantDetailForCIB } from '../queries';
import { validateAttorney } from '../validations/validateAttorney';
import { validateCIB } from '../validations/validateCIB';
import { validateClaimant } from '../validations/validateClaimant';
import { CLAIM_STATUS_TYPE } from '../../../../../Core/Enumerations/app/claim-status-type';
import { CLAIM_TYPES } from '../../../../../Core/Enumerations/app/claim-type';
import { ACCOUNTING_TRANS_TYPES } from '../../../../../Core/Enumerations/app/accounting-trans-type';
import { ACTION_TYPES } from '../../../../../Core/Enumerations/app/action-type';
import { FAL_CLAIM_STATUS_TYPES } from '../../../../../Core/Enumerations/app/fal_claim-status-types';


const ContentRow = styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
`;

const ContentCell = styled.div`
    width: ${props => props.width || '50%'};
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
    padding: .5em;
`;
const FieldContainer = styled.div`
    width: 100%;
    height: 50px;
    padding: .50em 1em;
    margin-bottom: 1em;
`;
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
const ScrollPanel = styled.div`
    height: calc(100% - 85px - 45px);
    width: 100%;
    padding: 0;
    margin: 0;
    border: 0;
    overflow-x: hidden;
    overflow-y: auto;
`;

const InputPanel = styled.div`
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-around;
    align-content: flex-start`;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    backdrop: {
        zIndex: 5,
        color: '#fff',
    },
}));

export const ClaimantTab = () => {
    const claim = useSelector(claimSelectors.selectData());
    const $auth = useSelector(userSelectors.selectAuthContext());
    let $dispatch = useDispatch();

    const claimantState = useSelector(ClaimantSelectors.selectLoading());
    const claimant = useSelector(ClaimantSelectors.selectData());

    const claimantSaveState = useSelector(ClaimantSaveSelectors.selectLoading());
    const claimantSave = useSelector(ClaimantSaveSelectors.selectData());


    const claimantListState = useSelector(ClaimantListSelectors.selectLoading());
    const claimantList = useSelector(ClaimantListSelectors.selectData());




    //ClaimantCIBActivityActions
    const cIBActivityState = useSelector(ClaimantCIBActivitySelectors.selectLoading());

    //ClaimantFileCIBActions,
    const fileCIBState = useSelector(ClaimantFileCIBSelectors.selectLoading());
    const fileCIB = useSelector(ClaimantFileCIBSelectors.selectData());

    //ClaimantFlagAsRejectedActions,
    const flagAsRejectedState = useSelector(ClaimantFlagAsRejectedSelectors.selectLoading());
    const flagAsRejectedData = useSelector(ClaimantFlagAsRejectedSelectors.selectData());

    //ClaimantFlagMedicareEligibleActions,
    const flagMedicareEligibleState = useSelector(ClaimantFlagMedicareEligibleSelectors.selectLoading());
    const flagMedicareEligible = useSelector(ClaimantFlagMedicareEligibleSelectors.selectData());

    //ClaimantReportedToCMSActions,
    const reportedToCMSState = useSelector(ClaimantReportedToCMSSelectors.selectLoading());
    const reportedToCMS = useSelector(ClaimantReportedToCMSSelectors.selectData());


    //ClaimantReportingToCMSNotRequiredActions,
    const reportingToCMSNotRequiredState = useSelector(ClaimantReportingToCMSNotRequiredSelectors.selectLoading());
    const reportingToCMSNotRequired = useSelector(ClaimantReportingToCMSNotRequiredSelectors.selectData());

    //ClaimantReportToISOActions,
    const reportToISOState = useSelector(ClaimantReportToISOSelectors.selectLoading());
    const reportToISO = useSelector(ClaimantReportToISOSelectors.selectData());


    const isViewer = claim.fALClaimStatusTypeID === FAL_CLAIM_STATUS_TYPES.CLOSED || claim.fALClaimStatusTypeID === FAL_CLAIM_STATUS_TYPES.ERROR || $auth.isReadOnly(APP_TYPES.Claimant);
    const currentUser = $auth.currentUser;
    const isMedicareAdministrator = $auth.isInRole(ROLES.Medicare_Administrator);
    const isClaimExaminer = $auth.isInRole(ROLES.Claims_Examiner);
    const isClaimAccountant = $auth.isInRole(ROLES.Claims_Accountant);
    const formValidator = useForm();
    
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [openNotificationDrawer, setOpenNotificationDrawer] = React.useState(false);
    const [issueCommentsError, setIssueCommentsError] = React.useState(false);
    const [issueTypeError, setIssueTypeError] = React.useState(false);
    const [requestorNotificationcomment, SetRequestorNotificationcomment] = React.useState('');
    const [requestorNotificationcommentError, setRequestorNotificationcommentError] = React.useState(false);
    const [claimStatusActionText, setClaimStatusActionText] = React.useState('');
    const [tempClaimStatusTypeID, setTempClaimStatusTypeID] = React.useState('');
    const [tempActionTypeID, setTempActionTypeID] = React.useState('');

    const [state, setState] = React.useState({
        loaded: false,
        data: [],
        users: [],
        issueTypeTypes: [],
        issueTypeID: "",
        issueTypeText: "",
        comment: "",

    });

    const onDrawerOpen = () => {
        setOpen(!open);
    };

    const onDrawerClose = () => {
        setOpen(false);
    };

    const reducer = (state, action) => {
        switch (action.type) {
            case 'UPDATE_UNIVERSAL_REQUEST':
                return Object.assign({}, state, action.request);
            default:
                return state;
        }
    };

    const initialState = {
        originalClaimant: {},
        currentClaimant: {},
        currentPayment: {},
        currentICDCode: {},
        claimants: [],
        isProcessing: true,
        isSaving: false,
        editMode: false,
        addressStates: [],
        selectedPaymentIndex: -1,
        selectedICDCodeIndex: -1,
        errorMessages: [],
        showErrorMessages: false,
        currentCMSRejectedLog: {},
        cMSRejectedLogKey: 787,
        helpContainerName: 'Claimants',
    };

    const [request, dispatch] = React.useReducer(reducer, initialState);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [showFileCIBConfimationDialog, setShowFileCIBConfimationDialog] = React.useState(false);
    const [showFlagMedicareConfimationDialog, setShowFlagMedicareConfimationDialog] = React.useState(false);
    const [showFlagAsRejectedDialog, setShowFlagAsRejectedDialog] = React.useState(false);

    const loadCurrentClaimActivity = async (activityID) => {
        let result = await loadFileCIBActivity(activityID);
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: { ...result.data.activity }, isProcessing: false } });
    }

    const loadClaimantCIBActivityData = async (activityID) => {
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true, selectedMenu: "FILECIBTASK", helpContainerName: 'CIB Task Details' } });
        const cIBActivity = await loadClaimantCIBActivity(activityID);
        if ((cIBActivity.data || {}).cIBActivityDetails) {
            const resultCIBDetails = await loadCIBDetails(cIBActivity.data.cIBActivityDetails[0].claimantCIBID);
            if ((resultCIBDetails.data || {}).cIBDetails) {
                $dispatch(ClaimantActions.get({ claimantID: (resultCIBDetails.data || {}).cIBDetails.claimantID}));
            }
        }
    }
    const saveActivityData = async (activity) => {
        const resultActivity = await saveActivity(activity);
        if ((resultActivity.data || {}).saveActivity) {
            await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Submitted, (resultActivity.data || {}).saveActivity.activityID);
            enqueueSnackbar("Claim Activity has been created successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            const claimantCIBActivityRequest = {
                activityID: (resultActivity.data || {}).saveActivity.activityID,
                claimantCIBID: fileCIB.cIB.claimantCIBID,
            }
            $dispatch(ClaimantCIBActivityActions.save({ claimantCIBActivity: claimantCIBActivityRequest }));
        } else {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
        }
    }

    React.useEffect(() => {
        if (window.location.href.toLowerCase().indexOf("activity") > -1) {
            let arr = window.location.href.split('/');
            loadClaimantCIBActivityData(arr[arr.length - 1]);
            loadCurrentClaimActivity(arr[arr.length - 1]);
            Promise.all([
                loadIssueTypeList(),
            ]).then(([it]) => {
                setState({
                    loaded: true,
                    issueTypeTypes: it.data.issueTypeList.filter(x => x.issueTypeID !== '46'),
                    issueTypeID: "",
                    issueTypeText: "",
                    comment: "",
                });
            })
        } else {
            if (claimantListState === ASYNC_STATES.IDLE) {
                $dispatch(ClaimantListActions.list({ claimMasterID: claim.claimMasterID }));
            }
        }
        return () => {
            $dispatch(ClaimantSaveActions.clearStatus());
        }

    }, []);
    React.useEffect(() => {
        if (claimantState === ASYNC_STATES.SUCCESS) {
            $dispatch(ClaimantActions.clearStatus());
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, originalClaimant: JSON.parse(JSON.stringify(claimant)), currentClaimant: JSON.parse(JSON.stringify(claimant)), editMode: true, isProcessing: false, isSaving: false } });
        } else if (claimantState === ASYNC_STATES.ERROR) {
            $dispatch(ClaimantActions.clearStatus());
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });
        }

    }, [claimantState]);
    React.useEffect(() => {
        if (claimantSaveState === ASYNC_STATES.SUCCESS) {
            if (request.isProcessing) {
                enqueueSnackbar("Claimant information has been saved successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                $dispatch(ClaimantActions.get({ claimantID: claimantSave.claimantID }));
            } else {
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, originalClaimant: JSON.parse(JSON.stringify(request.currentClaimant)), isSaving: false, isProcessing: false } });
            }
        } else if (claimantSaveState === ASYNC_STATES.ERROR) {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
            enqueueSnackbar("Unable to save claimant information.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }, [claimantSaveState]);
    React.useEffect(() => {
        if (claimantListState === ASYNC_STATES.SUCCESS && window.location.href.toLowerCase().indexOf("activity") === -1) {
            let list = JSON.parse(JSON.stringify(claimantList));

            list.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false, editMode: false, claimants: list, originalClaimant: {}, currentClaimant: {}, currentPayment: {}, currentICDCode: {}, helpContainerName: 'Claimants' } });

        } else if (claimantListState === ASYNC_STATES.ERROR) {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });
        }

    }, [claimantListState]);
    React.useEffect(() => {
        if (cIBActivityState === ASYNC_STATES.SUCCESS) {
            $dispatch(ClaimantCIBActivityActions.clearStatus());

            enqueueSnackbar("Claimant CIB Activity has been created successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });
        }
        else if (claimantSaveState === ASYNC_STATES.ERROR) {
            $dispatch(ClaimantCIBActivityActions.clearStatus());
            enqueueSnackbar("Unable to submit Claimant CIB Activity.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });

        }
    }, [cIBActivityState]);
    React.useEffect(() => {
        if (fileCIBState === ASYNC_STATES.SUCCESS) {
            if (fileCIB) {
                $dispatch(ClaimantFileCIBActions.clearStatus());

                createActionLogForFileCIB(claim.claimMasterID, request.currentClaimant.claimantID);
                request.currentClaimant.cIBRequested = fileCIB.cIBRequested;
                request.currentClaimant.cIBRequestedDate = fileCIB.cIBRequestedDate;
                request.originalClaimant = JSON.parse(JSON.stringify(request.currentClaimant));
                enqueueSnackbar("File CIB request has been submitted successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                const activityRequest = {
                    claimMasterID: claim.claimMasterID,
                    claimStatusTypeID: CLAIM_STATUS_TYPE.SUBMITTED,
                    accountingTransTypeID: ACCOUNTING_TRANS_TYPES.FILE_CIB,
                    urgent: false,
                    sendNoticeToReinsurance: false
                }
                let activity = JSON.parse(JSON.stringify(activityRequest));
                saveActivityData(activity);
            }
            else {
                enqueueSnackbar("Unable to submit File CIB request.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });
            }

        }
        else if (fileCIBState === ASYNC_STATES.ERROR) {
            $dispatch(ClaimantFileCIBActions.clearStatus());
            enqueueSnackbar("Unable to submit File CIB request.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });

        }
    }, [fileCIBState]);
    React.useEffect(() => {
        if (flagAsRejectedState === ASYNC_STATES.SUCCESS) {
            $dispatch(ClaimantFlagAsRejectedActions.clearStatus());

            createActionLogForFlagAsRejectedByISOAndInformCE(claim.claimMasterID, request.currentClaimant.claimantID);

            if (flagAsRejectedData) {
                request.currentClaimant.medicare.cMSRejected = true;
                request.currentClaimant.medicare.reportToCMS = false;
                request.currentClaimant.medicare.cMSRejectedLogs = flagAsRejectedData;
                request.isProcessing = false;
                request.cMSRejectedLogKey = request.cMSRejectedLogKey + 1;
                request.currentCMSRejectedLog = {};
                request.originalClaimant = JSON.parse(JSON.stringify(request.currentClaimant));
                enqueueSnackbar("Flag as rejected request has been submitted successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request } });
            }

        }
        else if (flagAsRejectedState === ASYNC_STATES.ERROR) {
            $dispatch(ClaimantFlagAsRejectedActions.clearStatus());
            enqueueSnackbar("Unable to submit flag as rejected request.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });
        }
    }, [flagAsRejectedState]);
    React.useEffect(() => {
        if (flagMedicareEligibleState === ASYNC_STATES.SUCCESS) {
            $dispatch(ClaimantFlagMedicareEligibleActions.clearStatus());
            createActionLogForFlagAsMedicareEligibleAndInformCE(claim.claimMasterID, request.currentClaimant.claimantID);
            if (flagMedicareEligible) {
                request.currentClaimant.medicareEligible = flagMedicareEligible.medicareEligible;
                request.originalClaimant = JSON.parse(JSON.stringify(request.currentClaimant));
                enqueueSnackbar("Flag Medicare request has been submitted successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });
            }
        }
        else if (flagMedicareEligibleState === ASYNC_STATES.ERROR) {
            $dispatch(ClaimantFlagMedicareEligibleActions.clearStatus());
            enqueueSnackbar("Unable to submit Flag Medicare request.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });
        }
    }, [flagMedicareEligibleState]);

    React.useEffect(() => {
        if (reportedToCMSState === ASYNC_STATES.SUCCESS) {
            $dispatch(ClaimantReportedToCMSActions.clearStatus());
            createActionLogForReportedToCMS(claim.claimMasterID, request.currentClaimant.claimantID);
            ((request.currentClaimant || {}).medicare || {}).reportedToCMS = true;
            request.isProcessing = false;
            request.originalClaimant = JSON.parse(JSON.stringify(request.currentClaimant));
            request.currentClaimant.medicareReportedDate = reportedToCMS.medicareReportedDate;

            enqueueSnackbar("Reported to CMS request has been submitted successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });

        }
        else if (reportedToCMSState === ASYNC_STATES.ERROR) {
            $dispatch(ClaimantReportedToCMSActions.clearStatus());
            enqueueSnackbar("Unable to Reported to CMS.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });
        }
    }, [reportedToCMSState]);

    React.useEffect(() => {
        if (reportingToCMSNotRequiredState === ASYNC_STATES.SUCCESS) {
            $dispatch(ClaimantReportingToCMSNotRequiredActions.clearStatus());
            createActionLogForReportingToCMSNotRequired(claim.claimMasterID, request.currentClaimant.claimantID);
            ((request.currentClaimant || {}).medicare || {}).reportingToCMSNotRequired = true;
            request.isProcessing = false;
            request.originalClaimant = JSON.parse(JSON.stringify(request.currentClaimant));
            request.currentClaimant.medicareReportedDate = reportingToCMSNotRequired.medicareReportedDate;

            enqueueSnackbar("Reporting To CMS not required request has been submitted successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });

        }
        else if (reportedToCMSState === ASYNC_STATES.ERROR) {
            $dispatch(ClaimantReportingToCMSNotRequiredActions.clearStatus());
            enqueueSnackbar("Unable to Reporting To CMS not required.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });
        }
    }, [reportingToCMSNotRequiredState]);

    React.useEffect(() => {
        if (reportToISOState === ASYNC_STATES.SUCCESS) {
            $dispatch(ClaimantReportToISOActions.clearStatus());

            if (reportToISO) {
                createActionLogForReportToISO(claim.claimMasterID, request.currentClaimant.claimantID);
                request.currentClaimant.medicare.cMSRejected = false;
                request.currentClaimant.medicare.reportToCMS = true;
                request.isProcessing = false;
                request.cMSRejectedLogKey = request.cMSRejectedLogKey + 1;
                request.currentCMSRejectedLog = {};
                request.originalClaimant = JSON.parse(JSON.stringify(request.currentClaimant));
                enqueueSnackbar("Report to CMS request has been submitted successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });
                reportCMSMedicareAdminNotification('REPORTCMS');
            }

        }
        else if (reportToISOState === ASYNC_STATES.ERROR) {
            $dispatch(ClaimantReportToISOActions.clearStatus());
            enqueueSnackbar("Unable to submit Report to CMS request.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });
        }
    }, [reportToISOState]);

    function ParseGQErrors(errors, error) {
        if (error || errors) {
            console.log("An error occured: ", errors);
            console.log("An error occured: ", error);
            enqueueSnackbar("An error occured.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }

    const onNewClicked = () => {
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, originalClaimant: {}, currentClaimant: {}, currentPayment: {}, currentICDCode: {}, editMode: true, selectedMenu: "CLAIMANT", helpContainerName: 'Claimant Details' } });
    }
    const onSaveClicked = async () => {
        let isValid = true;
        if (JSON.stringify(request.originalClaimant) === JSON.stringify(request.currentClaimant))
            return;
        let isReloadRequired = false;

        if (request.selectedMenu === "CLAIMANT" && !request.currentClaimant.claimantID)
            isReloadRequired = true;
        else if (request.selectedMenu === "MEDICARE" && !(request.currentClaimant.medicare || {}).claimantMedicareID)
            isReloadRequired = true;
        else if (request.selectedMenu === "TPOCPAYMENT" && !(request.currentClaimant.medicare || {}).claimantMedicareID)
            isReloadRequired = true;
        else if (request.selectedMenu === "TPOCPAYMENT" && (request.currentClaimant.medicare || {}).claimantMedicareID) {
            if (JSON.stringify(request.currentClaimant.medicare.payments || []) !== JSON.stringify(request.originalClaimant.medicare.payments || []))
                isReloadRequired = true;
        }
        else if (request.selectedMenu === "ICDCODE" && (request.currentClaimant.medicare || {}).iCDCodes) {
            isReloadRequired = true;
        }
        else if (request.selectedMenu === "ATTORNEY" && !(request.currentClaimant.medicare || {}).claimantMedicareID) {
            isReloadRequired = true;
        }
        else if (request.selectedMenu === "FILECIB" && !(request.currentClaimant.cIB || {}).claimantCIBID)
            isReloadRequired = true;

        if (isValid)
            isValid = await validate();

        if (isValid) {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: isReloadRequired } });
            try {
                request.currentClaimant.claimMasterID = claim.claimMasterID;
                if ((request.currentClaimant.medicare || {}).iCDCodes) {
                    request.currentClaimant.medicare.iCDCodes = request.currentClaimant.medicare?.iCDCodes?.filter((code) => {
                        delete code.icdCode
                        return code;
                    });
                }

                if (request.currentClaimant.hasOwnProperty("medicare")) {
                    if (request.currentClaimant?.medicare?.cMSIncidentDate) {
                        request.currentClaimant.medicare.cMSIncidentDate = new Date(request.currentClaimant.medicare.cMSIncidentDate).toISOString();
                    }
                }

                $dispatch(ClaimantSaveActions.save({ claimClaimant: request.currentClaimant }));


            } catch (e) {
                enqueueSnackbar(e.toString(), { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
            }
        }
    }
    const onCancelClicked = () => {
        window.history.pushState("", "", '/Claim/' + claim.claimMasterID + '/claimants');
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: true } }); 
        $dispatch(ClaimantListActions.list({ claimMasterID: claim.claimMasterID }));
    }
    const onMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const onMenuClose = () => {
        setAnchorEl(null);
    };

    const onFileCIBMenuClicked = async () => {
        setAnchorEl(null);
        setShowFileCIBConfimationDialog(true);

    };
    const onFlagMedicareMenuClicked = async () => {
        setAnchorEl(null);
        setShowFlagMedicareConfimationDialog(true);
    };
    const onFlagAsRejectedMenuClicked = () => {
        if (!(request.currentClaimant.medicare || {}).claimantMedicareID) {
            enqueueSnackbar("Medicare Detail Required", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            return;
        }
        setAnchorEl(null);
        if (request.currentClaimant.medicare.cMSRejected)
            enqueueSnackbar("Flag as rejected request has been already submitted.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        else {
            setShowFlagAsRejectedDialog(true);
        }
    };
    const reportCMSMedicareAdminNotification = async (type) => {
        let userResult = await loadUsers();
        userResult = ((userResult.data || {}).users || []);
        userResult = userResult.filter(userR => userR.userRoles.some((ur) => ur.roleID === ROLES.Medicare_Administrator));
        let notificationUsers = [];
        userResult.filter(e => {
            notificationUsers.push({ 'networkID': e.userID, "emailAddress": e.emailAddress, "firstName": e.firstName, "lastName": e.lastName, "reminderDate": null, "isCopyOnly": false, "statusCode": 'N' });
        });

        const notificationRequest = {
            claimMasterID: claim.claimMasterID,
            typeCode: 'T',
            title: "Claimant " + request.currentClaimant.firstName + " " + request.currentClaimant.lastName + " Medicare information has been reported to CMS " + claim.claimID + " ",
            body: "Claimant " + request.currentClaimant.firstName + " " + request.currentClaimant.lastName + " Medicare information has been reported to CMS " + claim.claimID + " ",
            isHighPriority: false,
            roleID: null,
            notificationUsers: notificationUsers
        }
        if (type === 'FILECIB') {
            notificationRequest.title = "File CIB has been submitted";
            notificationRequest.body = "File CIB has been submitted";
        }
        createNotificationMethod(notificationRequest);
    }

    const onReportedToCMSMenuClicked = async () => {
        setAnchorEl(null);
        if (!(request.currentClaimant.medicare || {}).claimantMedicareID) {
            enqueueSnackbar("Medicare Detail Required", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            return;
        }

        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: true } });
        try {
            if (((request.currentClaimant || {}).medicare || {}).iCDCodes) {
                request.currentClaimant.medicare.iCDCodes = ((request.currentClaimant || {}).medicare || {}).iCDCodes.filter((code) => {
                    delete code.icdCode
                    return code;
                });
            }

            $dispatch(ClaimantReportedToCMSActions.save({ claimant: request.currentClaimant }));

        } catch (e) {
            enqueueSnackbar(e.toString(), { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });
        }
    }
    const onReportingToCMSNotRequiredClicked = async () => {
        setAnchorEl(null);
        if (!(request.currentClaimant.medicare || {}).claimantMedicareID) {
            let currentMedicare = request.currentClaimant.medicare || {};
            currentMedicare.reportingToCMSNotRequired = true;
            request.currentClaimant.medicare = currentMedicare;
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: true } });

            $dispatch(ClaimantReportingToCMSNotRequiredActions.save({ claimant: request.currentClaimant }));
            onSaveClicked();
            return;

        }
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: true } });
        try {
            if (((request.currentClaimant || {}).medicare || {}).iCDCodes) {
                request.currentClaimant.medicare.iCDCodes = ((request.currentClaimant || {}).medicare || {}).iCDCodes.filter((code) => {
                    delete code.icdCode
                    return code;
                });
            }

            $dispatch(ClaimantReportingToCMSNotRequiredActions.save({ claimant: request.currentClaimant }));


        } catch (e) {
            enqueueSnackbar(e.toString(), { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });
        }

    }
    const onReportToISOMenuClicked = async () => {
        setAnchorEl(null);

        if (request.currentClaimant?.medicare?.injuryPartyRepCode === "A") {
            if (await validateReportToCMS() === false)
                return;
        }


        let isValid = await validateReportToISO();
        if (isValid) {
            try {
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: true } });
                $dispatch(ClaimantReportToISOActions.save({ claimantID: request.currentClaimant.medicare.claimantMedicareID }));

            } catch (e) {
                enqueueSnackbar(e.toString(), { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });
            }
        }

    };

    const flagAsRejected = (value) => {
        const notificationUsers = {
            firstName: claim.examiner.firstName,
            lastName: claim.examiner.lastName,
            emailAddress: "",
            networkID: claim.claimExaminerID,
            statusCode: 'N',
            isCopyOnly: false,
            reminderDate: null
        }
        const notificationRequest = {
            claimMasterID: claim.claimMasterID,
            typeCode: 'T',
            title: "Claimant " + request.currentClaimant.firstName + " " + request.currentClaimant.lastName + " Medicare information has been rejected by CMS Claim " + claim.claimID + " ",
            body: value,
            isHighPriority: false,
            roleID: null,
            notificationUsers: [notificationUsers]
        }
        createNotificationMethod(notificationRequest)
    }
    const createNotificationMethod = async (notificationRequest) => {
        Promise.all([
            createNotification(notificationRequest)
        ])
            .then((response) => {
                if (response[0].data.create.notificationID) {
                    enqueueSnackbar(' Success! Notification Created Successfully.', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });

                } else {
                    enqueueSnackbar('Error! There are some errors', { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                }
            });
    }
    const validate = async () => {
        let isValid = true;
        if (request.selectedMenu === "CLAIMANT") {
            isValid = await validateClaimant(formValidator.trigger);
        }
        if (request.selectedMenu === "FILECIB") {
            isValid = await validateCIB(formValidator.trigger);
        }
        if (request.selectedMenu === "ATTORNEY" && request?.currentClaimant?.medicare?.injuryPartyRepCode === 'A') {
            isValid = await validateAttorney(formValidator.trigger);
        }
        return isValid;
    }

    const validateCIBFile = async () => {
        try {
            const claimData = claim;
            const claimantResult = await loadClaimantDetailForCIB(request.currentClaimant.claimantID);
            ParseGQErrors(claimantResult.errors, claimantResult.error);
            const claimantData = claimantResult.data.detail;
            const cIBData = claimantData.cIB || {};

            const messages = [];

            /*let errorMessage = 'Following information is missing.';*/
            let isValid = true;

            if (!claimData.claimPolicyID && !claimData.claimPolicy) {
                messages.push("The following field is required: Claim Detail -> Policy");
                isValid = false;
            }
            if (!claimData.claimExaminerID) {
                messages.push("The following field is required: Claim Detail -> Examiner");
                isValid = false;
            }

            if (!claimData.dOL) {
                messages.push("The following field is required: Claim Detail -> Date of Loss");
                isValid = false;
            }
            if (!claimData.lossDesc) {
                messages.push("The following field is required: Claim Detail -> Loss Description");
                isValid = false;
            }
            if (!claimData.lossLocation && !claimData.lossLocationOutsideUsa) {
                messages.push("The following field is required: Claim Detail -> Loss Location or Loss location outside USA is required");
                isValid = false;
            }
            if (!claimantData.firstName && claimantData.bIClaimant) {
                messages.push("The following field is required: Claimant Detail -> First Name");
                isValid = false;
            }

            if (!claimantData.lastName) {
                messages.push("The following field is required: Claimant Detail -> Last Name");
                isValid = false;
            }
            if (!claimantData.dateOfBirth) {
                messages.push("The following field is required: Claimant Detail -> Date Of Birth");
                isValid = false;
            }
            if (!claimantData.addressStreet1) {
                messages.push("The following field is required: Claimant Detail -> Address Street 1");
                isValid = false;
            }
            if (!claimantData.addressCity) {
                messages.push("The following field is required: Claimant Detail -> Address City");
                isValid = false;
            }
            if (!claimantData.addressState) {
                messages.push("The following field is required: Claimant Detail -> Address State");
                isValid = false;
            }
            if (!claimantData.addressZIP) {
                messages.push("The following field is required: Claimant Detail -> Address ZIP");
                isValid = false;
            }
            if (!claimantData.gender) {
                messages.push("The following field is required: Claimant Detail -> Gender");
                isValid = false;
            }
            if (!claimantData.injuries) {
                messages.push("The following field is required: Claimant Detail -> Injuries");
                isValid = false;
            }
            if (!cIBData.claimCoverageTypeCode) {
                messages.push("The following field is required: CIB Detail -> Type of Claim/Coverage");
                isValid = false;
            }
            if (!cIBData.companyCodeRef) {
                messages.push("The following field is required: CIB Detail -> Company");
                isValid = false;
            }
            if (isNaN(parseInt(cIBData.cIBLossTypeID))) {
                messages.push("The following field is required: CIB Detail -> Type of Loss");
                isValid = false;
            }
            if (!cIBData.insuredStreet) {
                messages.push("The following field is required: CIB Detail -> Insured Street");
                isValid = false;
            }
            if (!cIBData.insuredState) {
                messages.push("The following field is required: CIB Detail -> Insured State");
                isValid = false;
            }
            if (!cIBData.insuredCity) {
                messages.push("The following field is required: CIB Detail -> Insured City");
                isValid = false;
            }
            if (!cIBData.insuredZip) {
                messages.push("The following field is required: CIB Detail -> Insured Zip");
                isValid = false;
            }

            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, errorMessages: messages, isProcessing: false, showErrorMessages: !isValid } });

            return isValid;

        } catch (e) {
            enqueueSnackbar(e.toString(), { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });
            return false;
        }
    }
    const validateReportToISO = async () => {
        try {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: true } });
            const claimData = claim;
            const claimantData = { ...claimant };
            //const cIBData = claimantData.cIB || {};
            const medicare = request.currentClaimant.medicare || {}

            const messages = [];

            //let errorMessage = 'Following information is missing.';
            let isValid = true;

            if (!claimData.claimPolicyID && !claimData.claimPolicy) {
                messages.push("The following field is required: Claim Detail -> Policy");
                isValid = false;
            }
            if (!claimData.claimExaminerID) {
                messages.push("The following field is required: Claim Detail -> Examiner");
                isValid = false;
            }
            if (!claimData.dOL) {
                messages.push("The following field is required: Claim Detail -> Date of Loss");
                isValid = false;
            }
            if (!claimantData.firstName) {
                messages.push("The following field is required: Claimant Detail -> First Name");
                isValid = false;
            }
            if (!claimantData.lastName) {
                messages.push("The following field is required: Claimant Detail -> Last Name");
                isValid = false;
            }
            if (!claimantData.dateOfBirth) {
                messages.push("The following field is required: Claimant Detail -> Date Of Birth");
                isValid = false;
            }
            if (!claimantData.gender) {
                messages.push("The following field is required: Claimant Detail -> Gender");
                isValid = false;
            }
            if (!medicare.cMSIncidentDate) {
                messages.push("The following field is required: Medicare Details -> CMS Incident Date");
                isValid = false;
            }

            if (!medicare.stateOfVenue && !medicare.uSFedTort && !medicare.foreignClaim) {
                messages.push("One of the following field is required: Medicare Detail -> State Of Venue,Federal Claim Tort Act or Foreign Claim(outside US)");
                isValid = false;
            }

            if (medicare.iNSPlanTypeCode === "D" && !medicare.noFaultLimit) {
                messages.push("The following field is required: Medicare Payment -> No Fault Insurance Limit");
                isValid = false;
            }
            if (medicare.iNSPlanTypeCode === "L" && !medicare.selfInsuredTypeCode) {
                messages.push("The following field is required: Medicare Payment -> Self Insured Type");
                isValid = false;
            }
            if (!medicare.descriptionOfInjury) {
                messages.push("The following field is required: Medicare Detail -> Description Of Injury");
                isValid = false;
            }

            if (medicare.oRM === true) {
                if (!medicare.oRMEstablishDate) {
                    messages.push("The following field is required: Medicare Payment -> ORM Established Date");
                    isValid = false;
                }
                if (!medicare.noFaultLimit) {
                    messages.push("The following field is required: Medicare Payment -> No Fault Insurance Limit");
                    isValid = false;
                }
            }
            else if (medicare.oRM === false) {

                if ((medicare.payments || []).length === 0) {
                    messages.push("The following field is required: Medicare Payment -> At least one TPOC Payment is reuired.");
                    isValid = false;
                }
            }
            else {
                messages.push("The following field is required: Medicare Payment -> On-going Responsilbilty for Medicals (ORM)");
                isValid = false;
            }

            if (medicare.productLiablilityCode === 3) {
                if (!medicare.productBrandName) {
                    messages.push("The following field is required: Medicare Detail -> Product Brand Name");
                    isValid = false;
                }
                if (!medicare.productGenericName) {
                    messages.push("The following field is required: Medicare Detail -> Product Generic Name");
                    isValid = false;
                }
                if (!medicare.productManufacturer) {
                    messages.push("The following field is required: Medicare Detail -> Product Manufacturer");
                    isValid = false;
                }
                if (!medicare.productAllegedHarm) {
                    messages.push("The following field is required: Medicare Detail -> Product Alleged Harm");
                    isValid = false;
                }
            }

            if (medicare.selfInsuredTypeCode === "I") {
                if (!medicare.policyHolderFirstName) {
                    if (!medicare.productBrandName) {
                        messages.push("The following field is required: Medicare Detail -> Policy Holder First Name");
                        isValid = false;
                    }
                }
                if (!medicare.policyHolderLastName) {
                    if (!medicare.productBrandName) {
                        messages.push("The following field is required: Medicare Detail -> Policy Holder Last Name");
                        isValid = false;
                    }
                }
            }

            if (medicare.selfInsuredTypeCode === "O") {
                if (!medicare.dBAName) {
                    messages.push("The following field is required: Medicare Detail -> DBA Name");
                    isValid = false;
                }
                if (!medicare.legalName) {
                    messages.push("The following field is required: Medicare Detail -> Legal Name");
                    isValid = false;
                }
            }

            if (((medicare || {}).iCDCodes || []).length === 0) {
                messages.push("Please add at least one ICD Code.");
                isValid = false;
            }
            if (medicare.injuryPartyRepCode === 'A') {
                if (!medicare.attorneyPhone) {
                    messages.push("The following field is required: Medicare Attorney -> Attorney's Phone Number");
                    isValid = false;
                }
            }

            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, errorMessages: messages, isProcessing: false, showErrorMessages: !isValid } });

            return isValid;

        } catch (e) {
            enqueueSnackbar(e.toString(), { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });
            return false;
        }
    }
    const validateReportToCMS = async () => {
        try {

            const medicare = request.currentClaimant.medicare;

            const messages = [];

            let isValid = true;

            if (!medicare.attorneyFirmName) {
                messages.push("The following field is required: Medicare Attorney-> Attorney Firm Name");
                isValid = false;
            }
            if (!medicare.attorneyAddressStree1) {
                messages.push("The following field is required: Medicare Attorney -> Attorney Address Street 1");
                isValid = false;
            }
            if (!medicare.attorneyAddressCity) {
                messages.push("The following field is required: Medicare Attorney -> Attorney Address City");
                isValid = false;
            }
            if (!medicare.attorneyAddressState) {
                messages.push("The following field is required: Medicare Attorney -> Attorney Address State");
                isValid = false;
            }
            if (!medicare.attorneyTIN) {
                messages.push("The following field is required: Medicare Attorney-> Attorney TIN");
                isValid = false;
            }
            if (!medicare.attorneyPhone) {
                messages.push("The following field is required: Medicare Attorney -> Attorney Phone");
                isValid = false;
            }
            if (!medicare.attorneyZipCode) {
                messages.push("The following field is required: Medicare Attorney -> Attorney Zip Code");
                isValid = false;
            }

            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, errorMessages: messages, isProcessing: false, showErrorMessages: !isValid } });

            return isValid;

        } catch (e) {
            enqueueSnackbar(e.toString(), { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });
            return false;
        }
    }

    const onFileCIBDialogOk = async () => {
        setShowFileCIBConfimationDialog(false);
        try {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: true } });
            let isValid = await validateCIBFile();
            if (isValid) {
                $dispatch(ClaimantFileCIBActions.save({ claimantID: request.currentClaimant.claimantID }));

            }
        } catch (e) {
            enqueueSnackbar(e.toString(), { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });

        }
    };
    const onFileCIBDialogCancel = () => {
        setShowFileCIBConfimationDialog(false);
    };
    const onFlagMedicareDialogOk = async () => {
        setShowFlagMedicareConfimationDialog(false);
        try {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: true } });
            $dispatch(ClaimantFlagMedicareEligibleActions.save({ claimantID: request.currentClaimant.claimantID }));

            

        } catch (e) {
            enqueueSnackbar(e.toString(), { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });
        }
        flagAsMedicalEligible();
    };
    const onValueChange = (e) => {
        SetRequestorNotificationcomment(e.target.value);
    }
    const handleNotificationDrawerOpen = () => {
        setOpenNotificationDrawer(true);
    }
    const handleNotificationDrawerClose = () => {
        SetRequestorNotificationcomment('');
        setRequestorNotificationcommentError(false);
        setOpenNotificationDrawer(false);
    }
    const createIssueLogsRequestor = async () => {

        setIssueCommentsError(false);
        setIssueTypeError(false);
        var issuelog = {
            "issueTypeID": state.issueTypeID,
            "comment": state.comment,
            "activityID": request.currentClaimActivity.activityID,
        }
        let issueLogResult = await saveIssueLogs(issuelog);
        if ((issueLogResult.data || {}).createIssueLog) {
            enqueueSnackbar("Issue Log Created Successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            setState({
                ...state,
                loaded: true,
                issueTypeID: "",
                issueTypeText: "",
                comment: "",
            })
        }

    }
    const onClaimFlagAsIssue = async () => {
        setAnchorEl(null);
        setClaimStatusActionText('Flag As Issue');
        setTempActionTypeID(ACTION_TYPES.Flag_as_Issue);
        setTempClaimStatusTypeID(CLAIM_STATUS_TYPE.OUTSTANDING_ISSUE);
        handleNotificationDrawerOpen();
    }
    const onClaimRejected = async () => {
        setAnchorEl(null);
        setClaimStatusActionText('Reject');
        setTempActionTypeID(ACTION_TYPES.Rejected);
        setTempClaimStatusTypeID(CLAIM_STATUS_TYPE.REJECTED);
        handleNotificationDrawerOpen();
    }

    const sendNotificationToRequestor = async () => {
        let title = '';
        let error = false;
        if (requestorNotificationcomment === null || requestorNotificationcomment.trim().length <= 0) {
            setRequestorNotificationcommentError(true);
            error = true;
        }
        if (parseInt(tempClaimStatusTypeID) === CLAIM_STATUS_TYPE.OUTSTANDING_ISSUE) {
            title = "File CIB - Flag As Issue";
            if (state.comment === '') {
                setIssueCommentsError(true);
                error = true;
            }
            if (state.issueTypeID === '' || !state.comment.trim().length) {
                setIssueTypeError(true);
                error = true;
            }
            if (!state.comment.replace(/\s/g, '').length) {
                setIssueCommentsError(true);
                error = true;
            }
            if (error) {
                enqueueSnackbar("Fields are Required", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }
            createIssueLogsRequestor();
        }
        if (error) {
            return;
        }
        if (!error) {
            setOpenNotificationDrawer(false);
            let users = await loadUsers();
            ParseGQErrors(users.errors, users.error);
            users = (users.data || {}).users || [];
            let notifyUser = users.filter(x => (x.userID.toLowerCase() === ((request.currentClaimActivity || {}).createdBy || "").toLowerCase() || (x.userID.toLowerCase() === claim.claimExaminerID.toLowerCase())));
            let _notificationUsers = [];
            notifyUser.filter(e => {
                _notificationUsers.push({ 'networkID': e.userID, "emailAddress": e.emailAddress, "firstName": e.firstName, "lastName": e.lastName, "reminderDate": null, "isCopyOnly": false, "statusCode": 'N' });
            });

            if (parseInt(tempClaimStatusTypeID) === CLAIM_STATUS_TYPE.REJECTED) {
                title = "File CIB - Rejected";
            }
            var claimOrLegal = '/Claim/';
            if (claim.claimType === CLAIM_TYPES.LEGAL) {
                claimOrLegal = '/Legal/'
            }
            const notificationRequest = {
                claimMasterID: claim.claimMasterID,
                typeCode: 'T',
                title: title,
                body: requestorNotificationcomment,
                isHighPriority: false,
                roleID: null,
                notificationUsers: _notificationUsers,
                relatedURL: claimOrLegal + claim.claimMasterID + '/claimants#Activity/' + request.currentClaimActivity.activityID
            }
            // Saving Activity 
            request.currentClaimActivity.claimStatusTypeID = parseInt(tempClaimStatusTypeID);
            request.currentClaimActivity.claimStatusTypeType.claimStatusTypeID = parseInt(tempClaimStatusTypeID);
            let activity = JSON.parse(JSON.stringify(request.currentClaimActivity));
            delete activity.workflowTask;
            const result = await saveActivity(activity);
            if ((result.data || {}).saveActivity) {
                createActionLogForFinacialActivityType(claim.claimMasterID, parseInt(tempActionTypeID), (result.data || {}).saveActivity.activityID);
                let resultActivity = await loadFileCIBActivity((result.data || {}).saveActivity.activityID);
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: { ...resultActivity.data.activity }, isProcessing: false } });
                enqueueSnackbar("Activity updated successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                setTempClaimStatusTypeID('');
            }
            //Creating Notification for Requestor 

            const notificationResult = await createNotification(notificationRequest);
            ParseGQErrors(notificationResult.errors, notificationResult.error);
            enqueueSnackbar("Notification sent successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            SetRequestorNotificationcomment('');
            setTempClaimStatusTypeID('');
        }
    }
    const onValueChanged = (evt) => {
        const newRequest = { ...state, [evt.target.name]: evt.target.value };
        if (evt.target.name === "issueTypeID") {
            newRequest["issueTypeText"] = state.issueTypeTypes.filter(e => (e.issueTypeID === evt.target.value))[0].issueTypeText;
        }
        setState(newRequest);

    };
    const onClaimProcessingComplete = async () => {
        setAnchorEl(null);
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
        request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.COMPLETED_PI_2;
        request.currentClaimActivity.claimStatusTypeType.claimStatusTypeID = CLAIM_STATUS_TYPE.COMPLETED_PI_2;
        let activity = JSON.parse(JSON.stringify(request.currentClaimActivity));
        delete activity.workflowTask;
        const result = await saveActivity(activity);
        if ((result.data || {}).saveActivity) {
            createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Processing_Complete, (result.data || {}).saveActivity.activityID)
            let resultActivity = await loadFileCIBActivity((result.data || {}).saveActivity.activityID);
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: { ...resultActivity.data.activity }, isProcessing: false } });
            enqueueSnackbar("Activity has been set to Processing Complete successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        } else {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
        }
    }
    const onSubmitCIBActivity = async () => {
        setAnchorEl(null);
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
        request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.SUBMITTED;
        request.currentClaimActivity.claimStatusTypeType.claimStatusTypeID = CLAIM_STATUS_TYPE.SUBMITTED;
        let activity = JSON.parse(JSON.stringify(request.currentClaimActivity));
        delete activity.workflowTask;
        const result = await saveActivity(activity);
        if ((result.data || {}).saveActivity) {
            await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Submitted, (result.data || {}).saveActivity.activityID);
            let resultActivity = await loadFileCIBActivity((result.data || {}).saveActivity.activityID);
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: { ...resultActivity.data.activity }, isProcessing: false } });
            enqueueSnackbar("Activity submitted successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        } else {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
        }
    }
    const onClaimProcessingInProgress = async () => {
        setAnchorEl(null);
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
        request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.PROCESSING_IN_PROGRESS;
        request.currentClaimActivity.claimStatusTypeType.claimStatusTypeID = CLAIM_STATUS_TYPE.PROCESSING_IN_PROGRESS;
        request.currentClaimActivity.taskOwner = currentUser.id;
        let activity = JSON.parse(JSON.stringify(request.currentClaimActivity));
        delete activity.workflowTask;
        const result = await saveActivity(activity);
        if ((result.data || {}).saveActivity) {
            await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Processing_InProgress, (result.data || {}).saveActivity.activityID);
            let resultActivity = await loadFileCIBActivity((result.data || {}).saveActivity.activityID);
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: { ...resultActivity.data.activity }, isProcessing: false } });
            enqueueSnackbar("Activity has been set to Processing in progress successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        } else {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
        }
    }
    const onClaimAcivityStatusVoid = async () => {
        setAnchorEl(null);
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
        request.currentClaimActivity.claimMasterID = claim.claimMasterID;
        request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.VOID_PI_2;
        request.currentClaimActivity.claimStatusTypeType.claimStatusTypeID = CLAIM_STATUS_TYPE.VOID_PI_2;
        let activity = JSON.parse(JSON.stringify(request.currentClaimActivity));
        delete activity.workflowTask;
        const result = await saveActivity(activity);
        ParseGQErrors(result.errors, result.error);
        if ((result.data || {}).saveActivity) {
            await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Void, (result.data || {}).saveActivity.activityID);
            let resultActivity = await loadFileCIBActivity((result.data || {}).saveActivity.activityID);
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: { ...resultActivity.data.activity }, isProcessing: false } });
            enqueueSnackbar("Claim Activity has been updated successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        } else {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
        }

    }
    const flagAsMedicalEligible = () => {
        const notificationUsers = {
            firstName: claim.examiner.firstName,
            lastName: claim.examiner.lastName,
            emailAddress: "",
            networkID: claim.claimExaminerID,
            statusCode: 'N',
            isCopyOnly: false,
            reminderDate: null
        }
        const notificationRequest = {
            claimMasterID: claim.claimMasterID,
            typeCode: 'T',
            title: "Claimant " + request.currentClaimant.firstName + " " + request.currentClaimant.lastName + " has been identified as Medicare eligible on Claim " + claim.claimID,
            body: 'Please complete the Medicare information required to report to CMS',
            isHighPriority: false,
            roleID: null,
            notificationUsers: [notificationUsers]
        }
        createNotificationMethod(notificationRequest)
    }
    const onFlagMedicareDialogCancel = () => {
        setShowFlagMedicareConfimationDialog(false);
    };
    const onFlagAsRejectedDialogOk = async (value) => {
        setShowFlagAsRejectedDialog(false);
        try {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: true } });
           await $dispatch(ClaimantFlagAsRejectedActions.save({ claimantMedicareID: request.currentClaimant.medicare.claimantMedicareID, rejectionReason: value }));


        } catch (e) {
            enqueueSnackbar(e.toString(), { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });

        }
        flagAsRejected(value, request.currentClaimant);
    };
    const onFlagAsRejectedDialogCancel = () => {
        setShowFlagAsRejectedDialog(false);
    };

    return (
        request.isProcessing ? <Spinner /> :
            <>
                <ConfirmationDialog
                    id="fileCIBConfirmation"
                    keepMounted
                    open={showFileCIBConfimationDialog}
                    onCancel={onFileCIBDialogCancel}
                    onOk={onFileCIBDialogOk}
                    title="Confirmation"
                    description="Are you sure you want to submit File CIB request?"
                />
                <ConfirmationDialog
                    id="flagMedicareConfirmation"
                    keepMounted
                    open={showFlagMedicareConfimationDialog}
                    onCancel={onFlagMedicareDialogCancel}
                    onOk={onFlagMedicareDialogOk}
                    title="Confirmation"
                    description="Are you sure you want to submit Flag Medicare Eligible request?"
                />
                <UserInputDialog
                    id="flagAsRejected"
                    keepMounted
                    open={showFlagAsRejectedDialog}
                    onCancel={onFlagAsRejectedDialogCancel}
                    onOk={onFlagAsRejectedDialogOk}
                    title="Rejection Reason"
                    description=""
                    label="Rejection Reason"
                />
                <ErrorListDialog request={request} dispatch={dispatch} />
                <Backdrop className={classes.backdrop} open={false}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <AppContainer>{claimantListState !== ASYNC_STATES.WORKING ?
                    <Toolbar>
                        <ButtonGroup variant="text">
                            {request.editMode === false && !isViewer && <IconButton name="New" title="New Claimant" onClick={onNewClicked} disabled={isViewer}><PostAdd /></IconButton>}
                            {request.editMode && <IconButton name="Cancel" title="Go Back" onClick={onCancelClicked}><ArrowBack /></IconButton>}
                            {request.editMode && false && <IconButton name="Save" title="Save" onClick={onSaveClicked} disabled={isViewer}><Save /></IconButton>}
                            {request.editMode && request.currentClaimant.claimantID && <IconButton name="Actions" title="More Actions" onClick={onMenuOpen}><MenuIcon /></IconButton>}
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={onMenuClose}
                            >

                                <MenuItem onClick={onFileCIBMenuClicked} disabled={isViewer}>File CIB</MenuItem>

                                {isMedicareAdministrator &&
                                    <MenuItem onClick={onFlagMedicareMenuClicked} disabled={isViewer}>Flag as Medicare Eligible and Inform CE</MenuItem>
                                }
                                {!((request.currentClaimant || {}).medicare || {}).reportToCMS && (isClaimExaminer || isMedicareAdministrator)  &&
                                    <MenuItem onClick={onReportToISOMenuClicked} disabled={isViewer}>Report to CMS</MenuItem>
                                }
                                {isMedicareAdministrator &&
                                    <MenuItem onClick={onFlagAsRejectedMenuClicked} disabled={isViewer}>Flag as Rejected by CMS and Inform CE</MenuItem>
                                }
                                {isMedicareAdministrator &&
                                    <MenuItem onClick={onReportedToCMSMenuClicked} disabled={isViewer}>Reported To CMS</MenuItem>
                                }
                                {isMedicareAdministrator &&
                                    <MenuItem onClick={onReportingToCMSNotRequiredClicked} disabled={isViewer}>Reporting To CMS Not required</MenuItem>
                                }
                                

                                {window.location.href.toLowerCase().indexOf("activity") > -1 && isClaimAccountant && request.selectedMenu === "FILECIBTASK" &&
                                    <>
                                        {(request.currentClaimActivity || {}).claimStatusTypeType?.claimStatusTypeID === CLAIM_STATUS_TYPE.SUBMITTED &&
                                            <>
                                                <MenuItem onClick={onClaimProcessingInProgress} disabled={isViewer}>Processing In Progress</MenuItem>
                                            </>
                                        }
                                        {((request.currentClaimActivity || {}).claimStatusTypeType?.claimStatusTypeID === CLAIM_STATUS_TYPE.SUBMITTED ||
                                            (request.currentClaimActivity || {}).claimStatusTypeType?.claimStatusTypeID === CLAIM_STATUS_TYPE.PROCESSING_IN_PROGRESS) &&
                                            <>
                                                <MenuItem onClick={onClaimProcessingComplete} disabled={isViewer}>Processing Complete</MenuItem>
                                                <MenuItem onClick={onClaimFlagAsIssue} disabled={isViewer}>Flag As Issue</MenuItem>
                                                <MenuItem onClick={onClaimRejected} disabled={isViewer}>Rejected</MenuItem>
                                            </>
                                        }
                                        {(request.currentClaimActivity || {}).claimStatusTypeType?.claimStatusTypeID === CLAIM_STATUS_TYPE.OUTSTANDING_ISSUE &&
                                            <>
                                                <MenuItem onClick={onSubmitCIBActivity} disabled={isViewer}>Submit</MenuItem>
                                            </>
                                        }
                                    </>
                                }
                                {window.location.href.toLowerCase().indexOf("activity") > -1 && request.selectedMenu === "FILECIBTASK" &&
                                    <MenuItem onClick={onClaimAcivityStatusVoid} disabled={isViewer}>Void</MenuItem>
                                }

                            </Menu>
                            {request.helpContainerName === 'Claimant Details' || request.helpContainerName === 'Medicare Details' || request.helpContainerName === 'Claimants' ?
                                <IconButton name="Help" title="Help" onClick={onDrawerOpen}><HelpOutline /></IconButton>
                                : ' '}
                        </ButtonGroup>
                        {request.isSaving && <CircularProgress color="primary" size={20} style={{ marginRight: 10 }} />}
                    </Toolbar> :null}
                    <TabContainer>
                        {request.editMode && claimantListState !== ASYNC_STATES.WORKING ?
                            <ContentRow>
                                <ContentCell width="80%" >
                                    <InfoSectionSelector claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} onSave={onSaveClicked} />
                                </ContentCell>
                                <ContentCell width="20%" style={{ justifyContent: "flex-start", alignItems: "flex-start" }}>
                                    <ClaimantMenu request={request} dispatch={dispatch} formValidator={formValidator} claim={claim} />
                                </ContentCell>
                            </ContentRow >
                            :
                            <ContentRow>
                                <ContentCell width="100%" >
                                    <ClaimantListSection request={request} dispatch={dispatch} />
                                </ContentCell>
                            </ContentRow >
                        }
                    </TabContainer>
                </AppContainer>
                <HelpDrawer open={open} onClose={onDrawerClose} containerName={request.helpContainerName} key={request.helpContainerName} />
                <Drawer
                    className={classes.drawer}
                    anchor="left"
                    open={openNotificationDrawer}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.drawerHeader}>
                        <IconButton name="arrowchevron_right" onClick={handleNotificationDrawerClose}>
                            <ChevronLeft />
                        </IconButton>
                        Send Notification to Requestor
                    </div>
                    <ScrollPanel>
                        <InputPanel>
                            <FieldContainer>
                                <ContentRow>
                                    <span style={{ fontSize: '1.2rem', fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', fontWeight: '400', padding: '10px' }}> Are you sure you want to mark this activity as &nbsp;
                                        {claimStatusActionText || ''}
                                        ?</span>
                                </ContentRow>
                                {parseInt(tempClaimStatusTypeID) === CLAIM_STATUS_TYPE.OUTSTANDING_ISSUE ? <>
                                    <ContentRow>
                                        <ContentCell width="100%">
                                            <SelectList
                                                disabled={isViewer}
                                                id="issueTypeID"
                                                name="issueTypeID"
                                                label="Issue Type"
                                                fullWidth={true}
                                                allowempty={false}
                                                onChange={onValueChanged}
                                                variant="outlined"
                                                value={state.issueTypeID || ""}
                                                helperText={(issueTypeError === true ? 'Issue Type is Required' : '')}
                                            >
                                                {
                                                    state.issueTypeTypes
                                                        .map((item, idx) => <MenuItem value={item.issueTypeID} key={item.issueTypeID}>{item.issueTypeText}</MenuItem>)
                                                }
                                            </SelectList>
                                        </ContentCell>
                                    </ContentRow>
                                    <ContentRow>
                                        <ContentCell width="100%">
                                            <TextField
                                                disabled={isViewer}
                                                id="comment"
                                                name="comment"
                                                label="Issue Comments"
                                                defaultValue=""
                                                value={state.comment}
                                                onChange={onValueChanged}
                                                error={issueCommentsError}
                                                inputProps={{
                                                    maxLength: 1024,
                                                }}
                                                helperText={(issueCommentsError === true ? 'Issue Comments are Required' : '')}
                                                style={{ width: '100%' }}
                                                variant="outlined"
                                                required
                                            />
                                        </ContentCell>
                                    </ContentRow>
                                </>
                                    : null
                                }
                                <ContentRow style={{ padding: "7px 5px" }}>
                                    <TextField
                                        disabled={isViewer}
                                        id="requestorNotificationcomment"
                                        name="requestorNotificationcomment"
                                        label="Notification Comments"
                                        defaultValue=""
                                        value={requestorNotificationcomment}
                                        onChange={onValueChange}
                                        inputProps={{
                                            maxLength: 1024,
                                        }}
                                        error={requestorNotificationcommentError}
                                        helperText={(requestorNotificationcommentError === true ? 'Notification Comments are Required' : '')}
                                        style={{ width: '100%' }}
                                        variant="outlined"
                                        required
                                    />
                                </ContentRow>
                                <Button variant="contained" color="primary" onClick={sendNotificationToRequestor}>Send</Button>
                                <Button onClick={handleNotificationDrawerClose} style={{ marginLeft: '1em' }}>Cancel</Button>
                            </FieldContainer>
                        </InputPanel>
                    </ScrollPanel>

                    <Divider />
                </Drawer>

            </>
    );
};



const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export default function ErrorListDialog({ request, dispatch }) {

    const handleClose = () => {
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, showErrorMessages: false } });
    };

    return (
        <div>
            <Dialog
                open={request.showErrorMessages}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
                style={{ backgroundColor: 'transparent' }}

            >
                <DialogContent style={{ backgroundColor: '#d32f2f' }}>
                    <div>
                        {
                            request.errorMessages.map(item =>
                                <>       <span style={{ color: '#fff', fontSize: '0.875rem', fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', fontWeight: '400', padding: '10px,10px,10px,10px' }}>
                                    {item}
                                </span>
                                    <br />
                                </>
                            )
                        }
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}


