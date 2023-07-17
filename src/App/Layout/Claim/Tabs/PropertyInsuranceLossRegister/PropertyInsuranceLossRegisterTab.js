import {
    Button,
    Divider,
    Drawer,
    Backdrop,
    IconButton,
    ButtonGroup,
    CircularProgress,
    Dialog,
    DialogContent,
    Menu,
    MenuItem,
    Slide,
    TextField
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ArrowBack, ChevronLeft, Menu as MenuIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useForm } from "react-hook-form";
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { APP_TYPES } from '../../../../Core/Enumerations/app/app-types';
import { ROLES } from '../../../../Core/Enumerations/security/roles';
import { SelectList, Spinner } from '../../../../Core/Forms/Common';
import { loadUsers } from '../../../../Core/Services/EntityGateway';
import { userSelectors } from '../../../../Core/State/slices/user';
import { CaraUrls } from '../../../../Settings';
import { createActionLogForFinacialActivityType } from '../../../ActionLog/Queries';
import { HelpDrawer } from '../../../Help/HelpDrawer';
import { createNotification } from '../../../Notifications/Query/saveNotifications';
import { loadCloseActivity, loadIssueTypeList, saveActivity } from '../Accounting/Queries';
import { loadPriorClaimActivityForPILR } from '../Accounting/Queries/loadPriorClaimActivity';
import { saveIssueLogs } from '../Accounting/Queries/saveIssueLogs';
import { loadPropertyPolicyDetail } from '../PropertyPolicy/Queries/loadPropertyPolicyDetail';
import { AppContainer, TabContainer } from '../TabContainer';
import { ShowActionMenu, ShowFlagAsIssueMenu, ShowCreateMenu, ShowProcessingCompleteMenu, ShowProcessingInProgressMenu, ShowRejectedMenu, ShowSubmitMenu, ShowVoidMenu } from './Components/ActionMenuRules';
import { InfoSectionSelector } from './Components/InfoSectionSelector';
import { PropertyInsuranceLossRegisterListSection } from './Components/PropertyInsuranceLossRegisterListSection';
import { PropertyInsuranceLossRegisterMenu } from './Components/PropertyInsuranceLossRegisterMenu';
import { loadPropertyInsuranceLossRegisterDetail } from './Queries/loadPropertyInsuranceLossRegisterDetail';
import { savePropertyInsuranceLossRegisterDetail } from './Queries/savePropertyInsuranceLossRegisterDetail';
import { validatePropertyInsuranceLossRegister } from './Validations/validatePropertyInsuranceLossRegister';
import { ACCOUNTING_TRANS_TYPES } from '../../../../Core/Enumerations/app/accounting-trans-type';
import { CLAIM_STATUS_TYPE } from '../../../../Core/Enumerations/app/claim-status-type';
import { ACTION_TYPES } from '../../../../Core/Enumerations/app/action-type';
import { FAL_CLAIM_STATUS_TYPES } from '../../../../Core/Enumerations/app/fal_claim-status-types';


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

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    backdrop: {
        zIndex: 5,
        color: '#fff',
    },
}));

export const PropertyInsuranceLossRegisterTab = ({ claim }) => {
    const $auth = useSelector(userSelectors.selectAuthContext());
    const isViewer = $auth.isReadOnly(APP_TYPES.Property_Insurance_Loss_Register);
    const currentUser = $auth.currentUser;
    const isClaimAccountant = $auth.isInRole(ROLES.Claims_Accountant);
    const [claimStatusActionText, setClaimStatusActionText] = React.useState('');
    const [tempClaimStatusTypeID, setTempClaimStatusTypeID] = React.useState('');
    const [openNotificationDrawer, setOpenNotificationDrawer] = React.useState(false);
    const [requestorNotificationcomment, SetRequestorNotificationcomment] = React.useState('');
    const [requestorNotificationcommentError, setRequestorNotificationcommentError] = React.useState(false);
    const [issueCommentsError, setIssueCommentsError] = React.useState(false);
    const [issueTypeError, setIssueTypeError] = React.useState(false);
    const [tempActionTypeID, setTempActionTypeID] = React.useState('');
    const formValidator = useForm();
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    //const $api = useGraphQL({
    //    load: GetContacts,
    //    //add: AddContact,
    //    del: DeleteContact,
    //    //loadInsContact: GetInsuredContact,
    //    //saveInsContact: SaveInsuredContact,
    //    //addInsContact: SaveInsuredContact,
    //});
    const [state, setState] = React.useState({
        loaded: false,
        data: [],
        users: [],
        issueTypeTypes: [],
        issueTypeID: "",
        issueTypeText: "",
        comment: "",

    });

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
        currentPropertyInsuranceLossRegister: {},
        propertyPolicCoding: {},
        isProcessing: false,
        isSaving: false,
        editMode: false,
        addressStates: [],
        selectedPaymentIndex: -1,
        selectedICDCodeIndex: -1,
        errorMessages: [],
        showErrorMessages: false,
        currentCMSRejectedLog: {},
        cMSRejectedLogKey: 787,
        helpContainerName: 'PropertyInsuranceLossRegisters',
        claim: claim,
        insuredContact: {},
        users: [],
        isClaimAccountant: isClaimAccountant
    };

    const [request, dispatch] = React.useReducer(reducer, initialState);
    const [anchorEl, setAnchorEl] = React.useState(null);


    const loadPILRActivity = async (activityID) => {
        try {
            let result = {};
            let activitiesResult = await loadPriorClaimActivityForPILR(claim.claimMasterID);

            result = await loadPropertyInsuranceLossRegisterDetail(activityID);
            if (result.data.detail) {
                let currentActivity = (activitiesResult.data.accountingListForPILR || {}).filter(activity => activity.activityID === (result.data.detail || {}).activityID);
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: currentActivity[0], isSaving: false, isProcessing: false, selectedMenu: "PILR", originalPropertyInsuranceLossRegister: result.data.detail, currentPropertyInsuranceLossRegister: result.data.detail, editMode: true, helpContainerName: 'Property InsuranceLoss Register Details' } });
            }
            else {
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
            }
        }
        catch (e) {
            enqueueSnackbar(toString(e), { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    };

    React.useEffect(() => {
        if (window.location.href.toLowerCase().indexOf("activity") > -1) {
            let arr = window.location.href.split('/');
            //loadActualMetaData();
            loadPILRActivity(arr[arr.length - 1]).then(() => loadActualMetaData());
        } else {
            loadMetaData();
        }
    }, []);

    const loadActualMetaData = () => {
        Promise.all([
            loadIssueTypeList(),
            CaraUrls(),
        ]).then(([it, ce]) => {
            setState({
                loaded: true,
                issueTypeTypes: it.data.issueTypeList.filter(x => x.issueTypeID !== '46'),
                issueTypeID: "",
                issueTypeText: "",
                comment: "",
            });
        })
    }

    const loadMetaData = async () => {
        const result = await loadPropertyPolicyDetail(claim.claimMasterID);
        ParseGQErrors(result.errors, result.error);
        const insuredContact = null; //await $api.loadInsContact({ claimMasterId: claim.claimMasterID });
        let users = await loadUsers();
        ParseGQErrors(users.errors, users.error);
        users = (users.data || {}).users || [];

        Promise.all([
            loadIssueTypeList(),
            CaraUrls(),
        ]).then(([it, ce]) => {
            setState({
                loaded: true,
                issueTypeTypes: it.data.issueTypeList.filter(x => x.issueTypeID !== '46'),
                issueTypeID: "",
                issueTypeText: "",
                comment: "",
            });
        })


        dispatch({
            type: "UPDATE_UNIVERSAL_REQUEST",
            request: {
                ...request, propertyPolicCoding: result.data.detail || {}, insuredContact: insuredContact, users: users}
        });
    }

    function ParseGQErrors(errors, error) {
        if (error || errors) {
            console.log("An error occured: ", errors);
            console.log("An error occured: ", error);
            enqueueSnackbar("An error occured.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }

    const onNewClicked = () => {
        setAnchorEl(null);
        if (claim.fALClaimStatusTypeID === FAL_CLAIM_STATUS_TYPES.CLOSED || claim.fALClaimStatusTypeID === FAL_CLAIM_STATUS_TYPES.ERROR)
        {
            enqueueSnackbar("You can not create PILR activity becuase current claim is closed.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            return;
        }
        dispatch({
            type: "UPDATE_UNIVERSAL_REQUEST",
            request: {
                ...request,
                currentPropertyInsuranceLossRegister: {
                    policyType: "Commercial Property Other",
                    lossAddressStreet1: request.propertyPolicCoding.lossAddressStreet1, lossAddressStreet2: request.propertyPolicCoding.lossAddressStreet2, lossAddressCity: request.propertyPolicCoding.lossAddressCity, lossAddressState: request.propertyPolicCoding.lossAddressState, lossAddressZIP: request.propertyPolicCoding.lossAddressZIP,
                    insuredAddressStreet1: request?.insuredContact?.addressStreet1, insuredAddressStreet2: request?.insuredContact?.addressStreet2, insuredAddressCity: request?.insuredContact?.addressCity, insuredAddressState: request?.insuredContact?.addressState, insuredAddressZIP: request?.insuredContact?.addressZIP,
                    akaAddressStreet1: request?.insuredContact?.addressStreet1, akaAddressStreet2: request?.insuredContact?.addressStreet2, akaAddressCity: request?.insuredContact?.addressCity, akaAddressState: request?.insuredContact?.addressState, akaAddressZIP: request?.insuredContact?.addressZIP,
                    lossDesc: request.claim.lossDesc,
                    insuredRole: 'Insured'
                },
                editMode: true,
                selectedMenu: "PILR",
                helpContainerName: 'Property InsuranceLoss Register Details'
            }
        });
    }
    const onSaveClicked = async () => {
        setAnchorEl(null);
        let isValid = true;

        let isReloadRequired = false;

        if (!request.currentPropertyInsuranceLossRegister.propertyInsuranceLossRegisterID || request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.OUTSTANDING_ISSUE)
            isReloadRequired = true;

        if (isValid)
            isValid = await validate();
        if (isValid) {

            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: isReloadRequired } });
            try {
                let currentClaimActivity = {};

                if (!request.currentClaimActivity||!request.currentClaimActivity.activityID) {
                    currentClaimActivity.claimMasterID = claim.claimMasterID;
                    currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.SUBMITTED;
                    currentClaimActivity.accountingTransTypeID = ACCOUNTING_TRANS_TYPES.PILR;
                    currentClaimActivity.urgent = false;
                    currentClaimActivity.sendNoticeToReinsurance = false;
                } else {
                    let activity = await loadCloseActivity(request.currentClaimActivity.activityID);
                    activity = JSON.parse(JSON.stringify(activity.data.activity));
                    activity.claimStatusTypeID = CLAIM_STATUS_TYPE.SUBMITTED;
                    delete activity.workflowTask;
                    currentClaimActivity = activity;
                }

                let result = await saveActivity(currentClaimActivity);

                ParseGQErrors(result.errors, result.error);

                if ((result.data || {}).saveActivity) {
                    const actionLogResult = await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Submitted, (result.data || {}).saveActivity.activityID);
                    ParseGQErrors(actionLogResult.errors, actionLogResult.error);

                    request.currentPropertyInsuranceLossRegister.activityID = (result.data || {}).saveActivity.activityID
                    request.currentPropertyInsuranceLossRegister.claimMasterID = claim.claimMasterID;
                    result = await savePropertyInsuranceLossRegisterDetail(request.currentPropertyInsuranceLossRegister);
                    if (result.errors || result.error) {
                        ParseGQErrors(result.errors, result.error);
                    }
                    if (result.data.save) {
                        if (result.data.save.propertyInsuranceLossRegisterID) {
                            if (isReloadRequired) {
                                enqueueSnackbar("PILR information has been saved successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentPropertyInsuranceLossRegister: null, editMode: false, isSaving: false, isProcessing: false } });
                            } else {
                                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request,  isSaving: false, isProcessing: false } });
                            }
                        }
                        else {
                            enqueueSnackbar("Unable to save claimant information.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                        }
                    } else {
                        enqueueSnackbar("Unable to save claimant information.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    }
                }
            } catch (e) {
                enqueueSnackbar(e.toString(), { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
            }
        }
    }
    const onClaimAcivityStatusVoid = async () => {
        setAnchorEl(null);
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
        request.currentClaimActivity.claimMasterID = claim.claimMasterID;
        request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.VOID_PI_2;

        let activity = JSON.parse(JSON.stringify(request.currentClaimActivity));

        activity = await loadCloseActivity(activity.activityID);
        activity = JSON.parse(JSON.stringify(activity.data.activity));
        activity.claimMasterID = claim.claimMasterID;
        activity.claimStatusTypeID = CLAIM_STATUS_TYPE.VOID_PI_2;

        delete activity.workflowTask;

        const result = await saveActivity(activity);
        ParseGQErrors(result.errors, result.error);
        if ((result.data || {}).saveActivity) {
            await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Void, (result.data || {}).saveActivity.activityID);
            //let currentActivity = await loadActivityView((result.data || {}).saveActivity.activityID);
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: request.currentClaimActivity, isSaving: false, isProcessing: false } });
            enqueueSnackbar("PILR Activity has been updated successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        } else {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
        }

    }
    const onClaimProcessingInProgress = async () => {
        setAnchorEl(null);
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
        request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.PROCESSING_IN_PROGRESS;
        request.currentClaimActivity.taskOwner = currentUser.id;
        let activity = await loadCloseActivity(request.currentClaimActivity.activityID);
        activity = JSON.parse(JSON.stringify(activity.data.activity));
        activity.claimStatusTypeID = CLAIM_STATUS_TYPE.PROCESSING_IN_PROGRESS;
        activity.taskOwner = currentUser.id;
        delete activity.workflowTask;

        const result = await saveActivity(activity);

        if ((result.data || {}).saveActivity) {
            await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Processing_InProgress, (result.data || {}).saveActivity.activityID);
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: request.currentClaimActivity, isSaving: false, isProcessing: false } });
            enqueueSnackbar("Activity has been set to Processing in progress successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        } else {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
        }
    }
    const onClaimProcessingCompleted = async () => {

        setAnchorEl(null);
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
        request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.COMPLETED_PI_2;

        let activity = await loadCloseActivity(request.currentClaimActivity.activityID);
        activity = JSON.parse(JSON.stringify(activity.data.activity));
        activity.claimStatusTypeID = CLAIM_STATUS_TYPE.COMPLETED_PI_2;
        delete activity.workflowTask;

        const result = await saveActivity(activity);
        if ((result.data || {}).saveActivity) {
            await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Processing_Complete, (result.data || {}).saveActivity.activityID)
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: request.currentClaimActivity, isSaving: false, isProcessing: false } });
            enqueueSnackbar("Activity has been set to Processing Completed successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        } else {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
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
    const handleNotificationDrawerOpen = () => {
        setOpenNotificationDrawer(true);
    }
    const handleNotificationDrawerClose = () => {
        SetRequestorNotificationcomment('');
        setRequestorNotificationcommentError(false);
        setOpenNotificationDrawer(false);
    }
    const onValueChanged = (evt) => {
        const newRequest = { ...state, [evt.target.name]: evt.target.value };
        if (evt.target.name === "issueTypeID") {
            newRequest["issueTypeText"] = state.issueTypeTypes.filter(e => (e.issueTypeID === evt.target.value))[0].issueTypeText;
        }
        setState(newRequest);
    };
    const onValueChange = (e) => {
        SetRequestorNotificationcomment(e.target.value);
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

    const sendNotificationToRequestor = async () => {
        let title = '';
        let error = false;
        if (requestorNotificationcomment === null || requestorNotificationcomment.trim().length <= 0) {
            setRequestorNotificationcommentError(true);
            error = true;
        }
        if (parseInt(tempClaimStatusTypeID) === CLAIM_STATUS_TYPE.OUTSTANDING_ISSUE) {
            title = "PILR - Flag As Issue";
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
            let notifyUser = request.users.filter( x =>  (x.userID.toLowerCase() === ((request.currentClaimActivity || {}).createdBy || "").toLowerCase() || (x.userID.toLowerCase() === claim.claimExaminerID.toLowerCase())));
            const notificationUsers = {
                firstName: notifyUser.firstName,
                lastName: notifyUser.lastName,
                emailAddress: notifyUser.emailAddress,
                networkID: request.currentClaimActivity.activityCreatedBy,
                statusCode: 'N',
                isCopyOnly: false,
                reminderDate: null
            }

            if (parseInt(tempClaimStatusTypeID) === CLAIM_STATUS_TYPE.REJECTED) {
                title = "PILR - Rejected";
            }
            if (parseInt(tempClaimStatusTypeID) === CLAIM_STATUS_TYPE.ERROR_PI_2) {
                title = "PILR - Error";
            }

            const notificationRequest = {
                claimMasterID: claim.claimMasterID,
                typeCode: 'T',
                title: title,
                body: requestorNotificationcomment,
                isHighPriority: false,
                roleID: null,
                notificationUsers: [notificationUsers],
                relatedURL: "/Claim/" + claim.claimMasterID + '/pilr#Activity/' + request.currentClaimActivity.activityID
            }

            // Saving Activity
            request.currentClaimActivity.claimStatusTypeID = parseInt(tempClaimStatusTypeID);
            let activity = await loadCloseActivity(request.currentClaimActivity.activityID);
            activity = JSON.parse(JSON.stringify(activity.data.activity));
            activity.claimStatusTypeID = parseInt(tempClaimStatusTypeID);
            delete activity.workflowTask;

            const result = await saveActivity(activity);
            if ((result.data || {}).saveActivity) {
                createActionLogForFinacialActivityType(claim.claimMasterID, parseInt(tempActionTypeID), (result.data || {}).saveActivity.activityID);
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: request.currentClaimActivity, isSaving: false, isProcessing: false } });
                enqueueSnackbar("Activity updated successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                setTempClaimStatusTypeID('');
            }
            //Creating Notification for Requestor 

            const notificationResult = await createNotification(notificationRequest);
            ParseGQErrors(notificationResult.errors, notificationResult.error);

            enqueueSnackbar("Notification sent successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            SetRequestorNotificationcomment('');
            handleNotificationDrawerClose();
            setTempClaimStatusTypeID('');
        }
    }

    const onCancelClicked = () => {
        setAnchorEl(null);
        window.history.pushState("", "", '/Claim/' + claim.claimMasterID + '/pilr');
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity:null, isProcessing: false, editMode: false, currentPropertyInsuranceLossRegister: null, selectedMenu: "PILR", helpContainerName: 'Property Insurance Loss Registers' } });
    }
    const onMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const onMenuClose = () => {
        setAnchorEl(null);
    };
    const validate = async () => {
        let isValid = true;
        if (request.selectedMenu === "PILR") {
            isValid = await validatePropertyInsuranceLossRegister(formValidator.trigger);
            if
                (
                isNaN(parseInt(request.currentPropertyInsuranceLossRegister.amountOfPolicyBuilding))
                && isNaN(parseInt(request.currentPropertyInsuranceLossRegister.amountOfPolicyContents))
                && isNaN(parseInt(request.currentPropertyInsuranceLossRegister.amountOfPolicyStock))
                && isNaN(parseInt(request.currentPropertyInsuranceLossRegister.amountOfPolicyUseAndOccupancy))
                && isNaN(parseInt(request.currentPropertyInsuranceLossRegister.amountOfPolicyOtherScehduled))
                && isNaN(parseInt(request.currentPropertyInsuranceLossRegister.estimatedLossBuilding))
                && isNaN(parseInt(request.currentPropertyInsuranceLossRegister.estimatedLossContents))
                && isNaN(parseInt(request.currentPropertyInsuranceLossRegister.estimatedLossStock))
                && isNaN(parseInt(request.currentPropertyInsuranceLossRegister.estimatedLossUseAndOccupancy))
                && isNaN(parseInt(request.currentPropertyInsuranceLossRegister.estimatedLossOtherScehduled))
            ) {
                enqueueSnackbar("Please provide aleast one value in Amount of Policy or Estimated Loss section", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                isValid = false;
            }
        }
        return isValid;
    }

    return (
        (request.isProcessing || !state.loaded) ? <Spinner /> :
            <>
                <ErrorListDialog request={request} dispatch={dispatch} />
                <Backdrop className={classes.backdrop} open={false}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <AppContainer>
                    <Toolbar>
                        <ButtonGroup variant="text">
                            {request.editMode && <IconButton name="Cancel" title="Go Back" onClick={onCancelClicked}><ArrowBack /></IconButton>}
                            {ShowActionMenu(request) && <IconButton name="Actions" title="More Actions" onClick={onMenuOpen}><MenuIcon /></IconButton>}
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={onMenuClose}
                            >
                                {ShowCreateMenu(request) && <MenuItem disabled={isViewer} onClick={onNewClicked}>Create</MenuItem>}
                                {ShowSubmitMenu(request) && <MenuItem disabled={isViewer} onClick={onSaveClicked}>Submit</MenuItem>}
                                {ShowVoidMenu(request) && <MenuItem disabled={isViewer} onClick={onClaimAcivityStatusVoid}>Void</MenuItem>}
                                {ShowProcessingInProgressMenu(request) && <MenuItem disabled={isViewer} onClick={onClaimProcessingInProgress} >Processing In-Progress</MenuItem>}
                                {ShowProcessingCompleteMenu(request) && <MenuItem disabled={isViewer} onClick={onClaimProcessingCompleted}>Processing Complete</MenuItem>}
                                {ShowFlagAsIssueMenu(request) && <MenuItem disabled={isViewer} onClick={onClaimFlagAsIssue} >Flag As Issue</MenuItem>}
                                {ShowRejectedMenu(request) && <MenuItem disabled={isViewer} onClick={onClaimRejected} >Rejected</MenuItem>}
                            </Menu>
                            {/* <IconButton name="Help" title="Help" onClick={onDrawerOpen}><HelpOutline /></IconButton> */}
                        </ButtonGroup>
                        {request.isSaving && <CircularProgress color="primary" size={20} style={{ marginRight: 10 }} />}
                    </Toolbar>
                    <TabContainer>
                        {request.editMode ?
                            <ContentRow>
                                <ContentCell width="80%" >
                                    <InfoSectionSelector claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} onSave={onSaveClicked} />
                                </ContentCell>
                                <ContentCell width="20%" style={{ justifyContent: "flex-start", alignItems: "flex-start" }}>
                                    <PropertyInsuranceLossRegisterMenu request={request} dispatch={dispatch} formValidator={formValidator} />
                                </ContentCell>
                            </ContentRow >
                            :
                            <ContentRow>
                                <ContentCell width="100%" >
                                    <PropertyInsuranceLossRegisterListSection request={request} dispatch={dispatch} />
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
                                                //disabled={isClaimAccountant ? false : true}
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
                                                // disabled={isClaimAccountant ? false : true}
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
                                        //disabled={isClaimAccountant ? false : true}
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


