import { ArrowBack, Menu as MenuIcon, PostAdd } from '@mui/icons-material';
import {
    Backdrop,
    ButtonGroup,
    CircularProgress,
    Dialog,
    DialogContent,
    Fade,
    IconButton,
    Menu,
    MenuItem,
    Slide
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { ACCOUNTING_TRANS_TYPES } from '../../../../../Core/Enumerations/app/accounting-trans-type';
import { ACTION_TYPES } from '../../../../../Core/Enumerations/app/action-type';
import { CLAIM_STATUS_TYPE } from '../../../../../Core/Enumerations/app/claim-status-type';
import { CLAIM_TYPES } from '../../../../../Core/Enumerations/app/claim-type';
import {
    ASYNC_STATES
} from '../../../../../Core/Enumerations/redux/async-states';
import { ConfirmationDialog, Spinner } from '../../../../../Core/Forms/Common';
import { claimSelectors } from '../../../../../Core/State/slices/claim';
import { accountingTransTypeActions, accountingTransTypeSelectors } from '../../../../../Core/State/slices/metadata/accountingTransType';
import { authorityAmountActions, authorityAmountSelectors } from '../../../../../Core/State/slices/metadata/authorityAmount';
import {
    WCReimbursementPriorTPAPaidActions,
    WCReimbursementPriorTPAPaidSaveActions,
    WCReimbursementPriorTPAPaidSaveSelectors,
    WCReimbursementPriorTPAPaidSingleActions,
    WCReimbursementPriorTPAPaidSingleSelectors,
    WCReimbursementtPriorTPAPaidSelectors
} from '../../../../../Core/State/slices/prior-tpa-paids';
import {
    ReimbursementCompanyDollarListActions,
    ReimbursementCompanyDollarSaveActions,
    WCReimbursementActions,
    WCReimbursementListActions,
    WCReimbursementListSelectors,
    WCReimbursementSaveActions,
    WCReimbursementSaveSelectors,
    WCReimbursementtSelectors
} from '../../../../../Core/State/slices/reimbursement';
import {
    WCReimbursementAdjustmentsListActions,
    WCReimbursementAdjustmentsSaveActions
} from '../../../../../Core/State/slices/reimbursement-adjustments';
import {
    WCReimbursementCalculationSaveActions,
    WCReimbursementtCalculationSelectors
} from '../../../../../Core/State/slices/reimbursement-calculation';
import { userSelectors } from '../../../../../Core/State/slices/user';
import { usersActions, usersSelectors } from '../../../../../Core/State/slices/users';
import { AppContainer, TabContainer } from '../../../../../Layout/Claim/Tabs/TabContainer';
import { saveActionLogDetail } from '../../../../ActionLog/Queries/saveActionLogDetail';
import { loadActionLogDetail } from '../../../../ActionLog/Queries/loadActionLogDetail';
import { loadHelpTags } from '../../../../Help/Queries/loadHelpTags';
import { ApproverSelectionDrawer } from '../../../../Claim/Tabs/Accounting/ApproverSelectionDrawer';
import { saveWorkFlowTask } from '../../../../Claim/Tabs/Accounting/Queries';
import { findActivityAcrossReimbursement, findReimbursementAcrossActivity, loadReimbursementPaymentActivity } from '../../../../Claim/Tabs/Accounting/Queries/loadActivity';
import { findAcitivityTypeUIByAcitivityType } from '../../../../Claim/Tabs/Accounting/Queries/loadMetaData';
import { saveActivity, saveReimbursementPaymentActivity } from '../../../../Claim/Tabs/Accounting/Queries/saveActivity';
import { createNotification } from '../../../../Notifications/Query/saveNotifications';
import { validateWCReimbursement } from '../Validations/validateWCReimbursement';
import { InfoSectionSelector } from './InfoSectionSelector';
import { ReimbursementListSection } from './ReimbursementListSection';
import { ReimbursementMenu } from './ReimbursementMenu';


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    backdrop: {
        zIndex: 5,
        color: '#fff',
    },
}));
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
export const ReimbursementApp = () => {
    let $dispatch = useDispatch();
    const $auth = useSelector(userSelectors.selectAuthContext());
    const users = useSelector(usersSelectors.selectData());

    const claim = useSelector(claimSelectors.selectData());
    const currentUser = $auth.currentUser;



    const wcReimbursementState = useSelector(WCReimbursementtSelectors.selectLoading());
    const wcReimbursement = useSelector(WCReimbursementtSelectors.selectData());

    const reimbursementCalculation = useSelector(WCReimbursementtCalculationSelectors.selectData());
    const currentReimbursementCalculation = reimbursementCalculation ? reimbursementCalculation[0] : {};

    const wcReimbursementSaveState = useSelector(WCReimbursementSaveSelectors.selectLoading());
    const wcReimbursementSave = useSelector(WCReimbursementSaveSelectors.selectData());
    
    const wcReimbursementListState = useSelector(WCReimbursementListSelectors.selectLoading());
    const wcReimbursementList = useSelector(WCReimbursementListSelectors.selectData());

    const priorTPAPaidSaveState = useSelector(WCReimbursementPriorTPAPaidSaveSelectors.selectLoading());
    const priorTPAPaidSave = useSelector(WCReimbursementPriorTPAPaidSaveSelectors.selectData());



    const formValidator = useForm();
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();
    function ParseGQErrors(errors, error, enqueueSnackbar) {
        if (error || errors) {
            console.log("An error occured: ", errors);
            console.log("An error occured: ", error);
            enqueueSnackbar("An error occured.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }

    const [showConfirmationDialog, setShowConfirmationDialog] = React.useState(false);
    const [showConfirmationDialogForVoid, setShowConfirmationDialogForVoid] = React.useState(false);
    
    const reducer = (state, action) => {
        switch (action.type) {
            case 'UPDATE_UNIVERSAL_REQUEST':
                return Object.assign({}, state, action.request);
            default:
                return state;
        }
    };
    const initialState = {
        //Related to Activity
        currentClaimActivity: {},
        //Related to Reimbursement Detail
        originalReimbursement: {},
        currentReimbursement: {},
        Reimbursements: [],
        editMode: false,

        //Related to Company Dollar
        originalReimbursementCompanyDollar: {},
        currentReimbursementCompanyDollar: {},
        CompanyDollarsList: [],
        editMOdeCompanyDollar: false,

        //Related to Prior TPA Paid
        currentPriorTPAPaid: {},
        originalPriorTPAPaid: {},
        editModePriorTPAPaid: false,

        //Related to Adjustments
        currentReimbursementAdjustment: {},
        originalReimbursementAdjustment: {},
        Adjustments: [],
        totalAdjustment: [{}],
        editModeAdjustments: false,

        //Related to Calculation
        reimbursementCalculation: {},

        //Generic
        isProcessing: true,
        isSaving: false,
        addressStates: [],
        errorMessages: [],
        showErrorMessages: false,
        helpContainerName: 'WCReimbursements',
        selectedMenu: "",
        openApproverSelectionDrawer: false
    };

    const [request, dispatch] = React.useReducer(reducer, initialState);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const authorityAmount = useSelector(authorityAmountSelectors.getCurrentUserAuthorityAmount(currentUser.id, claim.g2LegalEntityID));
    let accountingTransTypes = useSelector(accountingTransTypeSelectors.selectData());
    if (accountingTransTypes) {
        var accountingTransType = accountingTransTypes.filter(X => [
            ACCOUNTING_TRANS_TYPES.WC_REIMBURSEMENT_PAYMENT,
        ].includes(parseInt(X.accountingTransTypeID)))[0];
    }
    const managerAuthorityAmount = useSelector(authorityAmountSelectors.getCurrentUserAuthorityAmount(((request.currentClaimActivity || {}).taskOwner || ""), claim.g2LegalEntityID));
    // const claimExaminerAuthorityAmount = useSelector(authorityAmountSelectors.getCurrentUserAuthorityAmount(((claim || {}).claimExaminerID || ""), claim.g2LegalEntityID));

    const findActivityID = async () => {

        if (wcReimbursementState === ASYNC_STATES.SUCCESS) {
            $dispatch(WCReimbursementActions.clearStatus());
            if ((wcReimbursement || {}).wCReimbursementID) {
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
                const result = await findActivityAcrossReimbursement((wcReimbursement || {}).wCReimbursementID);
                ParseGQErrors(result.errors, result.error, enqueueSnackbar);
                if ((result.data || {}).reimbursmentPaymentActivity) {
                    let activityID = null;
                    activityID = ((result.data || {}).reimbursmentPaymentActivity || {}).activityID;
                    let currentActivity = await loadActivityView(activityID);
                    dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, originalReimbursement: JSON.parse(JSON.stringify(wcReimbursement)), currentReimbursement: JSON.parse(JSON.stringify(wcReimbursement)), currentClaimActivity: { ...currentActivity }, editMode: true, isProcessing: false, isSaving: false } });
                } else
                {
                    dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, originalReimbursement: JSON.parse(JSON.stringify(wcReimbursement)), currentReimbursement: JSON.parse(JSON.stringify(wcReimbursement)), currentClaimActivity: {}, editMode: true, isProcessing: false, isSaving: false } });
                }
            }
            else {
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, originalReimbursement: JSON.parse(JSON.stringify(wcReimbursement)), currentReimbursement: JSON.parse(JSON.stringify(wcReimbursement)), currentClaimActivity: {}, editMode: true, isProcessing: false, isSaving: false } });
            }

        } else if (wcReimbursementState === ASYNC_STATES.ERROR) {
            $dispatch(WCReimbursementActions.clearStatus());
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });
        }



    }

    React.useEffect(() => {
        $dispatch(usersActions.getAllUsers());
        $dispatch(accountingTransTypeActions.get());
        $dispatch(authorityAmountActions.get());
        loadReimbursementData();
    }, []);

    React.useEffect(() => {        
        if (reimbursementCalculation) {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, reimbursementCalculation: reimbursementCalculation[0]} });
        }
    }, [reimbursementCalculation]);

    //start of Reimbursement useEffects
    React.useEffect(() => {
        if (wcReimbursementListState === ASYNC_STATES.IDLE) {
            $dispatch(WCReimbursementListActions.list({ claimMasterID: claim.claimMasterID }));
        }
        return () => {
            $dispatch(WCReimbursementSaveActions.clearStatus());
        }

    }, []);
    React.useEffect(() => {
        findActivityID();
    }, [wcReimbursementState]);
    React.useEffect(() => {
        if (wcReimbursementSaveState === ASYNC_STATES.SUCCESS) {
            if (request.isProcessing) {
                $dispatch(WCReimbursementActions.get({ wCReimbursementID: wcReimbursementSave.wCReimbursementID }));
            } else {
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, originalReimbursement: JSON.parse(JSON.stringify(request.currentReimbursement)), isSaving: false, isProcessing: false } });
            }
        } else if (wcReimbursementSaveState === ASYNC_STATES.ERROR) {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
            enqueueSnackbar("Unable to save reimbursement information.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }, [wcReimbursementSaveState]);
    React.useEffect(() => {
        if (wcReimbursementListState === ASYNC_STATES.SUCCESS && window.location.href.toLowerCase().indexOf("activity") === -1) {
            let list = JSON.parse(JSON.stringify(wcReimbursementList));

            list.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false, editMode: false, Reimbursements: list, originalReimbursement: {}, currentReimbursement: {}, helpContainerName: 'WCReimbursements' } });

        } else if (wcReimbursementListState === ASYNC_STATES.ERROR) {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });
        }

    }, [wcReimbursementListState]);

    //start of Prior TPA Paid useEffects
    // React.useEffect(() => {
    //     if (priorTPAPaidState === ASYNC_STATES.SUCCESS) {
    //         $dispatch(WCReimbursementPriorTPAPaidActions.clearStatus());
    //         dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, originalPriorTPAPaid: JSON.parse(JSON.stringify(priorTPAPaid)), currentPriorTPAPaid: JSON.parse(JSON.stringify(priorTPAPaid)), editModePriorTPAPaid: true, isProcessing: false, isSaving: false } });
    //     } else if (priorTPAPaidState === ASYNC_STATES.ERROR) {
    //         $dispatch(WCReimbursementPriorTPAPaidActions.clearStatus());
    //         dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });
    //     }

    // }, [priorTPAPaidState]);
    React.useEffect(() => {
        if (priorTPAPaidSaveState === ASYNC_STATES.SUCCESS) {
            if (request.isProcessing) {
                enqueueSnackbar("Prior TPA information has been saved successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                $dispatch(WCReimbursementPriorTPAPaidActions.get({ reimbursementPriorTPAID: priorTPAPaidSave.reimbursementPriorTPAID }));
            }
            else {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, originalPriorTPAPaid: JSON.parse(JSON.stringify(request.currentPriorTPAPaid)), isSaving: false, isProcessing: false } });
            }
        } else if (priorTPAPaidSaveState === ASYNC_STATES.ERROR) {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
            enqueueSnackbar("Unable to save Prior TPA information.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }, [priorTPAPaidSaveState]);
    // React.useEffect(() => {
    //         if (priorTPAPaidSingleState === ASYNC_STATES.SUCCESS) {
    //             let singlePriorTPA = JSON.parse(JSON.stringify(priorTPAPaidSingle));
    //                 console.log(singlePriorTPA,'singlePriorTPA')
    //         dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false, editModePriorTPAPaid: false, currentPriorTPAPaid: singlePriorTPA[singlePriorTPA.length - 1], helpContainerName: 'Prior TPA Paid Detail' } });
    
    //         } else if (priorTPAPaidSingleState === ASYNC_STATES.ERROR) {
    //             dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });
    //         }

    // }, [priorTPAPaidSingleState]);


    const loadReimbursementData = async () => {
        try {
            if (window.location.href.toLowerCase().indexOf("activity") > -1) {
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
                let arr = window.location.href.split('/');
                let currentActivity = await loadActivityView(arr[arr.length - 1]);
                let result = await findReimbursementAcrossActivity(arr[arr.length - 1]);
                ParseGQErrors(result.errors, result.error, enqueueSnackbar);
                if ((result.data || {}).reimbursmentIDByActivityID) {
                    let reimbursementID = null;
                    reimbursementID = ((result.data || {}).reimbursmentIDByActivityID || {}).wcReimbursementID;
                    $dispatch(WCReimbursementActions.get({ wCReimbursementID: reimbursementID }));
                    $dispatch(WCReimbursementPriorTPAPaidSingleActions.list({ wCReimbursementID: reimbursementID }));
                    dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: currentActivity || {}, selectedMenu : "REQUESTREIMBURSEMENTPAYMENT", isSaving: false, isProcessing: false } });
                } else {
                    dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
                }
            } else {
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false} });
            }
        } catch (e) {
            enqueueSnackbar(toString(e), { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    };


    const onNewClicked = () => {
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, originalReimbursement: {}, currentReimbursement: {}, editMode: true, selectedMenu: "REIMBURSEMENT", helpContainerName: 'Reimbursement Details' } });
    }

    const onSaveClicked = async () => {
        setAnchorEl(null);
        let isValid = true;
        if (request.selectedMenu === "REIMBURSEMENT") {
            if (!claim.kindOfBusinessID) {
                enqueueSnackbar("KindOfBusinessID is required", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }
            if (JSON.stringify(request.currentReimbursement) == '{}') {
                enqueueSnackbar("Unable to Save Empty reimbursement Information", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }
            if (JSON.stringify(request.originalReimbursement) === JSON.stringify(request.currentReimbursement)) {
                enqueueSnackbar("Reimbursement information has been saved successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }
            let isReloadRequired = false;

            if (request.selectedMenu === "REIMBURSEMENT" && !request.currentReimbursement.wCReimbursementID)
                isReloadRequired = true;

            if (isValid)
                isValid = await validate();

            if (isValid) {
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: isReloadRequired } });
                try {
                    request.currentReimbursement.claimMasterID = claim.claimMasterID;
                    const result = await $dispatch(WCReimbursementSaveActions.save({ wcReimbursement: request.currentReimbursement }));
                    if(isReloadRequired){
                        $dispatch(WCReimbursementPriorTPAPaidSingleActions.list({ wCReimbursementID: result.payload.wCReimbursementID }));
                    }
                    if (!result?.error) {
                        enqueueSnackbar("Reimbursement information has been saved successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    }
                } catch (e) {
                    enqueueSnackbar("Unable to save reimbursement information.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
                }
            }
        }
        else if (request.selectedMenu === "COMPANYDOLLAR") {
            if (JSON.stringify(request.currentReimbursementCompanyDollar) == {}) {
                enqueueSnackbar("Unable to Save Empty reimbursement Information", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }
            if (JSON.stringify(request.originalReimbursementCompanyDollar) === JSON.stringify(request.currentReimbursementCompanyDollar)) {
                return;
            }
            let isReloadRequired = false;

            if (!request.currentReimbursementCompanyDollar.wCClaimantID) {
                enqueueSnackbar("You must have a claimant selected to save this form. If no claimants are available then a claimant must be added on the claim tab.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }

            if (request.selectedMenu === "COMPANYDOLLAR" && !request.currentReimbursementCompanyDollar.reimbursementCompanyDollarID)
                isReloadRequired = true;

            if (isValid)
                isValid = await validate();

            if (isValid) {
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: isReloadRequired } });
                try {
                    request.currentReimbursementCompanyDollar =  Object.entries(request.currentReimbursementCompanyDollar).reduce((a,[k,v]) => (v ? (a[k]=v, a) : a), {})
                    request.currentReimbursementCompanyDollar.wCReimbursementID = request.currentReimbursement.wCReimbursementID;
                    const result = await $dispatch(ReimbursementCompanyDollarSaveActions.save({ reimbursementCompanyDollars: request.currentReimbursementCompanyDollar }));
                    if (!result?.error) {
                        enqueueSnackbar("Company Dollar information has been saved successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, originalReimbursementCompanyDollar: {}, currentReimbursementCompanyDollar: {}, editMOdeCompanyDollar: true, selectedMenu: "COMPANYDOLLAR", helpContainerName: 'Company Dollar Details' } });
                        $dispatch(ReimbursementCompanyDollarListActions.list({ wCReimbursementID: request?.currentReimbursement?.wCReimbursementID }));
                    }
                    else {
                        enqueueSnackbar("Unable to save Company Dollar information.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request,editMOdeCompanyDollar: true, selectedMenu: "COMPANYDOLLAR", helpContainerName: 'Company Dollar Details',isSaving: false, isProcessing: false } });

                    }
                } catch (e) {
                    enqueueSnackbar("Unable to save Company Dollar information.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
                }
            }
        }
        else if (request.selectedMenu === "PRIORTPA") {

            let isReloadRequired = false;

            if (request.selectedMenu === "PRIORTPA" && !request.currentPriorTPAPaid.wCReimbursementID)
                isReloadRequired = true;

            if (isValid)
                isValid = await validate();

            if (isValid) {
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: isReloadRequired } });
                try {
                    request.currentPriorTPAPaid.wCReimbursementID = request.currentReimbursement.wCReimbursementID;
                    const result = await $dispatch(WCReimbursementPriorTPAPaidSaveActions.save({ reimbursementPriorTPAID: request.currentPriorTPAPaid }));
                    if (!result?.error) {
                        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, editModePriorTPAPaid: true, selectedMenu: "PRIORTPA", helpContainerName: 'Prior TPA Paid Details', isProcessing: false } });
                    }
                } catch (e) {
                    enqueueSnackbar("Unable to save Prior TPA information.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
                }
            }
        }
        else if (request.selectedMenu === "ADJUSTMENTS") {
            if (JSON.stringify(request.currentReimbursementAdjustment) == {}) {
                enqueueSnackbar("Unable to Save Empty Prior TPA Information", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            }
            if (JSON.stringify(request.originalReimbursementAdjustment) === JSON.stringify(request.currentReimbursementAdjustment)) {
                return;
            }
            let isReloadRequired = false;

            if (request.selectedMenu === "ADJUSTMENTS" && !request.currentReimbursementAdjustment.reimbursementAdjustmentID)
                isReloadRequired = true;

            if (isValid)
                isValid = await validate();

            if (isValid) {
                
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: false } });
                try {
                    request.currentReimbursementAdjustment.wCReimbursementID = request.currentReimbursement.wCReimbursementID;
                    request.currentReimbursementAdjustment.adjustmentTypeID = parseInt(request.currentReimbursementAdjustment.adjustmentTypeID);
                    request.currentReimbursementAdjustment.claimStatusTypeID = 33;
                    const result = await $dispatch(WCReimbursementAdjustmentsSaveActions.save({ reimbursementAdjustmentID: request.currentReimbursementAdjustment }));
                    if (!result?.error) {
                        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, editModePriorTPAPaid: true, selectedMenu: "ADJUSTMENTS", helpContainerName: 'Adjustment Details' } });

                    }
                } catch (e) {
                    enqueueSnackbar("Unable to save Prior TPA information.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
                }
            }
        }
        else if (request.selectedMenu === "CALCULATION") {
            if (JSON.stringify(request.reimbursementCalculation) == {}) {
                enqueueSnackbar("Unable to Save Empty Prior TPA Information", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            }

            let isReloadRequired = false;

                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: false } });
                try {
                    request.reimbursementCalculation.wCReimbursementID = request.reimbursementCalculation.wCReimbursementID;
                    const result = await $dispatch(WCReimbursementCalculationSaveActions.save({ reimbursementCalculationID: request.reimbursementCalculation }));
                    if (!result?.error) {
                        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, editModePriorTPAPaid: true, selectedMenu: "ADJUSTMENTS", helpContainerName: 'Calculation Details' } });
                    }
                } catch (e) {
                    enqueueSnackbar("Unable to save Calculation Details.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
                }
            }
        }

    const onCancelClicked = () => {
        setAnchorEl(null);
        setShowConfirmationDialog(false);
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { currentPriorTPAPaid : {},CompanyDollarsList:[], isProcessing: true } });
        window.history.pushState("", "", '/claim/' + claim.claimMasterID + '/reimbursement');
        $dispatch(WCReimbursementListActions.list({ claimMasterID: claim.claimMasterID }));
    }

    async function loadActivityView(activityID) {
        try {
            //dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });

            let activityResult = await loadReimbursementPaymentActivity(activityID);
            let currentActvity = activityResult.data.activity;
            let result = {};
            if (findAcitivityTypeUIByAcitivityType(currentActvity.accountingTransTypeID) === "REQUESTREIMBURSEMENTPAYMENT") {
                result = await loadReimbursementPaymentActivity(activityID);
            }

            ParseGQErrors(result.errors, result.error);
            if (result.data.activity) {
                result.data.activity.accountingTransTypeText = (result.data.activity.accountingTransType || {}).accountingTransTypeText;
                return result.data.activity;
                //dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: result.data.activity, isSaving: false, isProcessing: false, selectedMenu: findAcitivityTypeUIByAcitivityType(result.data.activity.accountingTransTypeID) } });
            }
            else {
                return null;
                //dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
            }
        }
        catch (e) {
            enqueueSnackbar(toString(e), { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            return null;

        }

    }

    const onRequestReimbursementPaymentYes = async () => {
        setAnchorEl(null);
        setShowConfirmationDialog(false);
        let currentClaimActivity = {};
        let authorityPaymentAmount = (authorityAmount || {}).paymentAmount || 0;
        if (parseFloat(currentReimbursementCalculation?.totalOutstandingExpenseReserves || 0) > authorityPaymentAmount) {
            request.currentClaimActivity.taskOwner = null;
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
            enqueueSnackbar("This reserve change exceeds your authority.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            return;
        }
        currentClaimActivity.claimMasterID = claim.claimMasterID;
        currentClaimActivity.accountingTransTypeID = ACCOUNTING_TRANS_TYPES.WC_REIMBURSEMENT_PAYMENT;
        currentClaimActivity.accountingTransTypeText = accountingTransType.accountingTransTypeText;
        currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.SUBMITTED;
        currentClaimActivity.urgent = false;
        currentClaimActivity.sendNoticeToReinsurance = false;
        delete currentClaimActivity.workflowTask;
        let activity = JSON.parse(JSON.stringify(currentClaimActivity));
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
        const result = await saveActivity(activity);
        ParseGQErrors(result.errors, result.error, enqueueSnackbar);
        if ((result.data || {}).saveActivity) {
            let wcReimbursementPaymentActivity = {};
            wcReimbursementPaymentActivity.activityID = (result.data || {}).saveActivity.activityID;
            wcReimbursementPaymentActivity.wcReimbursementID = (wcReimbursement || {}).wCReimbursementID;
            const result1 = await saveReimbursementPaymentActivity(JSON.parse(JSON.stringify(wcReimbursementPaymentActivity)))
            ParseGQErrors(result1.errors, result1.error, enqueueSnackbar);
            if ((result1.data || {}).saveReimbursementPaymentActivity) {
                enqueueSnackbar("Activity has been saved successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                try {
                    request.currentReimbursement.claimMasterID = claim.claimMasterID;
                    request.currentReimbursement.claimStatusTypeID = CLAIM_STATUS_TYPE.COMPLETED_PAYMENT_REQUEST
                    const result = await $dispatch(WCReimbursementSaveActions.save({ wcReimbursement: request.currentReimbursement }));
                    if (!result?.error) {
                        enqueueSnackbar("Reimbursement information has been saved successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    }
                } catch (e) {
                    enqueueSnackbar("Unable to save reimbursement information.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
                }
            }
            let currentActivity = await loadActivityView((result.data || {}).saveActivity.activityID);
            await saveActionLogDetail({ claimMasterID: claim.claimMasterID, actionTypeID: ACTION_TYPES.Submitted, subID: (result.data || {}).saveActivity?.activityID });
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: currentActivity, selectedMenu: "REQUESTREIMBURSEMENTPAYMENT", isSaving: false, isProcessing: false } });
            enqueueSnackbar("Activity has been set to Submitted successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }
    const voidNo = async () => {
        setAnchorEl(null);
        setShowConfirmationDialogForVoid(false);
    }

    const onRequestReimbursementPaymentNo = async () => {
        setAnchorEl(null);
        setShowConfirmationDialog(false);
        window.history.pushState("", "", '/claim/' + claim.claimMasterID + '/reimbursement');
        $dispatch(WCReimbursementListActions.list({ claimMasterID: claim.claimMasterID }));
    }

    const onCompleted = async () => {
        setAnchorEl(null);
        let currentClaimActivity = request.currentClaimActivity || {};
        currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.COMPLETED_PI_4;
        delete currentClaimActivity.workflowTask;
        let activity = JSON.parse(JSON.stringify(currentClaimActivity));
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
        const result = await saveActivity(activity);
        ParseGQErrors(result.errors, result.error, enqueueSnackbar);
        if ((result.data || {}).saveActivity) {
            let currentActivity = await loadActivityView((result.data || {}).saveActivity.activityID);
            await saveActionLogDetail({ claimMasterID: claim.claimMasterID, actionTypeID: ACTION_TYPES.Completed, subID: (result.data || {}).saveActivity?.activityID });
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: currentActivity, selectedMenu: "REQUESTREIMBURSEMENTPAYMENT", isSaving: false, isProcessing: false } });
            enqueueSnackbar("Activity has been set to completed successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });           
        }
    }

    const onProcessingInProgress = async () => {
        setAnchorEl(null);
        let currentClaimActivity = request.currentClaimActivity || {};
        currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.IN_PROGRESS_PI_4;
        delete currentClaimActivity.workflowTask;
        let activity = JSON.parse(JSON.stringify(currentClaimActivity));
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
        const result = await saveActivity(activity);
        ParseGQErrors(result.errors, result.error, enqueueSnackbar);
        if ((result.data || {}).saveActivity) {
            let currentActivity = await loadActivityView((result.data || {}).saveActivity.activityID);
            await saveActionLogDetail({ claimMasterID: claim.claimMasterID, actionTypeID: ACTION_TYPES.Processing_InProgress, subID: (result.data || {}).saveActivity?.activityID });
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: currentActivity, selectedMenu: "REQUESTREIMBURSEMENTPAYMENT", isSaving: false, isProcessing: false } });
            enqueueSnackbar("Activity has been set to Processing In-Progress successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }

    const onReinsuranceProcessingRequired = async () => {
        setAnchorEl(null);
        let currentClaimActivity = request.currentClaimActivity || {};
        currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.REINSURANCE_PROCESSING_REQUIRED;
        delete currentClaimActivity.workflowTask;
        let activity = JSON.parse(JSON.stringify(currentClaimActivity));
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
        const result = await saveActivity(activity);
        ParseGQErrors(result.errors, result.error, enqueueSnackbar);
        if ((result.data || {}).saveActivity) {
            let currentActivity = await loadActivityView((result.data || {}).saveActivity.activityID);
            await saveActionLogDetail({ claimMasterID: claim.claimMasterID, actionTypeID: ACTION_TYPES.Reinsurance_Processing_Required, subID: (result.data || {}).saveActivity?.activityID });
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: currentActivity, selectedMenu: "REQUESTREIMBURSEMENTPAYMENT", isSaving: false, isProcessing: false } });
            enqueueSnackbar("Activity has been set to Reinsurance Processing Required successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }

    const onFlagIssue = async () => {
        setAnchorEl(null);
        let currentClaimActivity = request.currentClaimActivity || {};
        currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.OUTSTANDING_ISSUE;
        delete currentClaimActivity.workflowTask;
        let activity = JSON.parse(JSON.stringify(currentClaimActivity));
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
        const result = await saveActivity(activity);
        ParseGQErrors(result.errors, result.error, enqueueSnackbar);
        if ((result.data || {}).saveActivity) {
            let currentActivity = await loadActivityView((result.data || {}).saveActivity.activityID);
            await saveActionLogDetail({ claimMasterID: claim.claimMasterID, actionTypeID: ACTION_TYPES.Flag_as_Issue, subID: (result.data || {}).saveActivity?.activityID });
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: currentActivity, selectedMenu: "REQUESTREIMBURSEMENTPAYMENT", isSaving: false, isProcessing: false } });
            enqueueSnackbar("Activity has been set to Flag as Issue successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }

    const onFlagQAPending = async () => {
        setAnchorEl(null);
        let currentClaimActivity = request.currentClaimActivity || {};
        currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.QA_PENDING;
        delete currentClaimActivity.workflowTask;
        let activity = JSON.parse(JSON.stringify(currentClaimActivity));
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
        const result = await saveActivity(activity);
        ParseGQErrors(result.errors, result.error, enqueueSnackbar);
        if ((result.data || {}).saveActivity) {
            let currentActivity = await loadActivityView((result.data || {}).saveActivity.activityID);
            await saveActionLogDetail({ claimMasterID: claim.claimMasterID, actionTypeID: ACTION_TYPES.QA_Pending, subID: (result.data || {}).saveActivity?.activityID });
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: currentActivity, selectedMenu: "REQUESTREIMBURSEMENTPAYMENT", isSaving: false, isProcessing: false } });
            enqueueSnackbar("Activity has been set to QA Pending successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }

    const onRejected = async () => {
        setAnchorEl(null);
        let currentClaimActivity = request.currentClaimActivity || {};
        currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.REJECTED;
        delete currentClaimActivity.workflowTask;
        let activity = JSON.parse(JSON.stringify(currentClaimActivity));
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
        const result = await saveActivity(activity);
        ParseGQErrors(result.errors, result.error, enqueueSnackbar);
        if ((result.data || {}).saveActivity) {
            let currentActivity = await loadActivityView((result.data || {}).saveActivity.activityID);
            await saveActionLogDetail({ claimMasterID: claim.claimMasterID, actionTypeID: ACTION_TYPES.Rejected, subID: (result.data || {}).saveActivity?.activityID });
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: currentActivity, selectedMenu: "REQUESTREIMBURSEMENTPAYMENT", isSaving: false, isProcessing: false } });
            enqueueSnackbar("Activity has been set to Rejected successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }

    const voidYes = async () => {
        setAnchorEl(null);
        setShowConfirmationDialogForVoid(false);
        let currentClaimActivity = request.currentClaimActivity || {};
        currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.VOID_PI_4;        
        delete currentClaimActivity.workflowTask;
        let activity = JSON.parse(JSON.stringify(currentClaimActivity));
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
        const result = await saveActivity(activity);
        ParseGQErrors(result.errors, result.error, enqueueSnackbar);
        if ((result.data || {}).saveActivity) {
            let currentActivity = await loadActivityView((result.data || {}).saveActivity.activityID);
            await saveActionLogDetail({ claimMasterID: claim.claimMasterID, actionTypeID: ACTION_TYPES.Void, subID: (result.data || {}).saveActivity?.activityID });
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: currentActivity, selectedMenu: "REQUESTREIMBURSEMENTPAYMENT", isSaving: false, isProcessing: false } });
            enqueueSnackbar("Activity has been set to void successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }

    const onMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const onMenuClose = () => {
        setAnchorEl(null);
    };

    const validate = async () => {
        let isValid = true;
        if (request.selectedMenu === "REIMBURSEMENT") {
            isValid = await validateWCReimbursement(formValidator.trigger);
        }
        return isValid;
    }

    const onApproverSelectionDrawerClose = async () => {
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: false } });
    }

    const onApproverSelectionDrawerNext = async () => {
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
        let currentClaimActivity = request.currentClaimActivity || {};        
        let authorityPaymentAmount = (managerAuthorityAmount || {}).paymentAmount || 0;
        if (parseFloat(currentReimbursementCalculation?.totalOutstandingExpenseReserves || 0) > authorityPaymentAmount) {
            request.currentClaimActivity.taskOwner = null;            
            enqueueSnackbar("The approver you selected does not have enough authority to approve the transaction.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
            return;
        }
        currentClaimActivity.claimMasterID = claim.claimMasterID;
        currentClaimActivity.accountingTransTypeID = ACCOUNTING_TRANS_TYPES.WC_REIMBURSEMENT_PAYMENT;
        currentClaimActivity.accountingTransTypeText = accountingTransType.accountingTransTypeText;
        currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.PENDING_APPROVAL;
        currentClaimActivity.urgent = false;
        currentClaimActivity.sendNoticeToReinsurance = false;
        delete currentClaimActivity.workflowTask;
        let activity = JSON.parse(JSON.stringify(currentClaimActivity));
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
        const result = await saveActivity(activity);
        ParseGQErrors(result.errors, result.error);
        if ((result.data || {}).saveActivity) {
            let wcReimbursementPaymentActivity = {};
            wcReimbursementPaymentActivity.activityID = (result.data || {}).saveActivity.activityID;
            wcReimbursementPaymentActivity.wcReimbursementID = (wcReimbursement || {}).wCReimbursementID;
            const result1 = await saveReimbursementPaymentActivity(JSON.parse(JSON.stringify(wcReimbursementPaymentActivity)))
            ParseGQErrors(result1.errors, result1.error, enqueueSnackbar);
            if ((result1.data || {}).saveReimbursementPaymentActivity) {
                enqueueSnackbar("Activity has been saved successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            }
            let currentActivity = await loadActivityView((result.data || {}).saveActivity.activityID);
            const actionLogResult = await saveActionLogDetail({ claimMasterID: claim.claimMasterID, actionTypeID: ACTION_TYPES.Submitted_for_Approval, subID: (result.data || {}).saveActivity?.activityID });
            ParseGQErrors(actionLogResult.errors, actionLogResult.error);
            //dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: currentActivity, selectedMenu: "REQUESTREIMBURSEMENTPAYMENT"} });
            let notifyUser = (users.filter(x => x.userID.toLowerCase() === ((currentClaimActivity || {}).taskOwner || "").toLowerCase())[0] || {});
            const notificationUsers = {
                firstName: notifyUser.firstName,
                lastName: notifyUser.lastName,
                emailAddress: notifyUser.emailAddress,
                networkID: currentClaimActivity.taskOwner,
                statusCode: 'N',
                isCopyOnly: false,
                reminderDate: null
            }
            var claimOrLegal = '/Claim/';
            if (claim.claimType === CLAIM_TYPES.LEGAL) {
                claimOrLegal = '/Legal/'
            }
            const notificationRequest = {
                claimMasterID: claim.claimMasterID,
                typeCode: 'T',
                title: currentClaimActivity.accountingTransTypeText + " has been submitted for approval",
                body: currentClaimActivity.accountingTransTypeText + " has been submitted for approval",
                isHighPriority: false,
                roleID: null,
                notificationUsers: [notificationUsers],
                relatedURL: claimOrLegal + claim.claimMasterID + '/reimbursement#Activity/' + (result.data || {}).saveActivity.activityID
            }

            const notificationResult = await createNotification(notificationRequest);
            ParseGQErrors(notificationResult.errors, notificationResult.error);
            const notificationUserID = notificationResult.data.create.notificationUsers[0].notificationUserID;

            const workFlowTaskRequest = {
                notificationUserID: notificationUserID,
                subID: (result.data || {}).saveActivity.activityID
            }

            const workFlowTaskResult = await saveWorkFlowTask(workFlowTaskRequest);
            ParseGQErrors(workFlowTaskResult.errors, workFlowTaskResult.error);

            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: currentActivity, selectedMenu: "REQUESTREIMBURSEMENTPAYMENT", isSaving: false, isProcessing: false, openApproverSelectionDrawer: false } });
            enqueueSnackbar(request.currentClaimActivity.accountingTransTypeText + " activity has been created successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        } else {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
        }
    }

    const onApprove = async () => {
        setAnchorEl(null);
        let currentClaimActivity = request.currentClaimActivity || {};
        let authorityPaymentAmount = (authorityAmount|| {}).paymentAmount || 0;
        if (parseFloat(currentReimbursementCalculation?.totalOutstandingExpenseReserves || 0) > authorityPaymentAmount) {
            enqueueSnackbar("This payment exceeds your authority", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
            return;
        }
        currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.SUBMITTED;
        delete currentClaimActivity.workflowTask;
        let activity = JSON.parse(JSON.stringify(currentClaimActivity));
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
        const result = await saveActivity(activity);
        ParseGQErrors(result.errors, result.error, enqueueSnackbar);
        if ((result.data || {}).saveActivity) {
            let currentActivity = await loadActivityView((result.data || {}).saveActivity.activityID);
            await saveActionLogDetail({ claimMasterID: claim.claimMasterID, actionTypeID: ACTION_TYPES.Approve, subID: (result.data || {}).saveActivity?.activityID });
            await saveActionLogDetail({ claimMasterID: claim.claimMasterID, actionTypeID: ACTION_TYPES.Submitted, subID: (result.data || {}).saveActivity?.activityID });
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: currentActivity, selectedMenu: "REQUESTREIMBURSEMENTPAYMENT", isSaving: false, isProcessing: false } });
            enqueueSnackbar("Activity has been set to submitted successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            try {
                request.currentReimbursement.claimMasterID = claim.claimMasterID;
                request.currentReimbursement.claimStatusTypeID = CLAIM_STATUS_TYPE.COMPLETED_PAYMENT_REQUEST
                const result = await $dispatch(WCReimbursementSaveActions.save({ wcReimbursement: request.currentReimbursement }));
                if (!result?.error) {
                    enqueueSnackbar("Reimbursement information has been saved successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                }
            } catch (e) {
                enqueueSnackbar("Unable to save reimbursement information.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
            }
        }
    }
    const onCompletedNoPaymentRequest = async () => {
        setAnchorEl(null);
        try {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
            request.currentReimbursement.claimMasterID = claim.claimMasterID;
            request.currentReimbursement.claimStatusTypeID = CLAIM_STATUS_TYPE.COMPLETED_NO_PAYMENT_REQUEST;
            const result = await $dispatch(WCReimbursementSaveActions.save({ wcReimbursement: request.currentReimbursement }));
            if (!result?.error) {
                enqueueSnackbar("Reimbursement information has been saved successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                window.history.pushState("", "", '/claim/' + claim.claimMasterID + '/reimbursement');
                $dispatch(WCReimbursementListActions.list({ claimMasterID: claim.claimMasterID }));
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
            }
        } catch (e) {
            enqueueSnackbar("Unable to save reimbursement information.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
        }
    }
    const showMenu = () => {
        if (request.selectedMenu === "REQUESTREIMBURSEMENTPAYMENT" && [CLAIM_STATUS_TYPE.IN_PROGRESS_PI_4, CLAIM_STATUS_TYPE.SUBMITTED].includes(request.currentClaimActivity.claimStatusTypeID)) {
            return true;
        }
        if (request.selectedMenu === "REQUESTREIMBURSEMENTPAYMENT" && [CLAIM_STATUS_TYPE.PENDING_APPROVAL].includes(request.currentClaimActivity.claimStatusTypeID)) {
            return (request.currentClaimActivity.taskOwner || "").toLowerCase() === currentUser.id.toLowerCase();
        }
        if (request.selectedMenu === "REQUESTREIMBURSEMENTPAYMENT" && [CLAIM_STATUS_TYPE.COMPLETED_PI_4, CLAIM_STATUS_TYPE.VOID_PI_4].includes(request.currentClaimActivity.claimStatusTypeID)) {
            return false;
        }
        if (request.selectedMenu === "CALCULATION" && request.currentClaimActivity.activityID) {
            return true;
        }
        return true;
    }
return (
        request.isProcessing ? <Spinner /> :
        <>
                <ErrorListDialog request={request} dispatch={dispatch} />
            <Backdrop className={classes.backdrop} open={false}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <AppContainer>{wcReimbursementListState !== ASYNC_STATES.WORKING ?
                <Toolbar>
                    <ButtonGroup variant="text">
                            {request.editMode === false &&
                            <IconButton name="New Reimbursement Activity" title="New Reimbursement Activity" onClick={onNewClicked}><PostAdd /></IconButton>}
                            {request.editMode  && <IconButton name="Cancel" title="Go Back" onClick={onCancelClicked}><ArrowBack /></IconButton>}
                        {request.editMode && request.selectedMenu !== "PRIORTPA" && showMenu() && <IconButton name="Actions" title="More Actions" onClick={onMenuOpen}><MenuIcon /></IconButton>}
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={onMenuClose}
                            TransitionComponent={Fade}
                        >                            
                            {
                                request.selectedMenu === "CALCULATION" && !request.currentClaimActivity.activityID ?
                                    <MenuItem onClick={() => {
                                        setAnchorEl(null);
                                        setShowConfirmationDialog(true);
                                    }}>W/C Reimbursement Payment</MenuItem>
                                    :

                                    (request.selectedMenu !== "REQUESTREIMBURSEMENTPAYMENT" && request.selectedMenu !== "CALCULATION") && <MenuItem onClick={onSaveClicked}>Save</MenuItem>
                            }
                            {request.selectedMenu === "CALCULATION" && 
                                <MenuItem onClick={onCompletedNoPaymentRequest}>Mark as Completed - No Payment requested</MenuItem>                            
                            }
                            {(!(request.selectedMenu === "REQUESTREIMBURSEMENTPAYMENT")) && <MenuItem onClick={onCancelClicked}>Cancel</MenuItem>}
                            {[CLAIM_STATUS_TYPE.IN_PROGRESS_PI_4, CLAIM_STATUS_TYPE.SUBMITTED].includes(request.currentClaimActivity.claimStatusTypeID) && request.selectedMenu === "REQUESTREIMBURSEMENTPAYMENT" && [
                                <MenuItem onClick={onProcessingInProgress}>Processing In-Progress</MenuItem>,
                                <MenuItem onClick={onCompleted}>Processing Completed</MenuItem>,
                                <MenuItem onClick={onReinsuranceProcessingRequired}>Reinsurance Processing Required</MenuItem>,
                                <MenuItem onClick={onFlagIssue}>Flag as Issue</MenuItem>,
                                <MenuItem onClick={onFlagQAPending}>Flag as QA Pending</MenuItem>,
                                <MenuItem onClick={onRejected}>Rejected</MenuItem>,
                                <MenuItem onClick={() => {
                                    setAnchorEl(null);
                                    setShowConfirmationDialogForVoid(true)
                                }}>Void</MenuItem>]
                            }
                            {[CLAIM_STATUS_TYPE.PENDING_APPROVAL].includes(request.currentClaimActivity.claimStatusTypeID) && (request.currentClaimActivity.taskOwner || "").toLowerCase() === currentUser.id.toLowerCase() && request.selectedMenu === "REQUESTREIMBURSEMENTPAYMENT" && <MenuItem onClick={onApprove}>Approve</MenuItem>
                            }

                        </Menu>
                        
                    </ButtonGroup>
                        {request.isSaving && <CircularProgress color="primary" size={20} style={{ marginRight: 10 }} />}
                </Toolbar> : null}
                    <TabContainer>
                        {request.editMode && wcReimbursementListState !== ASYNC_STATES.WORKING ?
                    <ContentRow>
                        <ContentCell width="80%" >
                                    <InfoSectionSelector claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} onSave={onSaveClicked}/>
                        </ContentCell>
                        <ContentCell width="20%" style={{ justifyContent: "flex-start", alignItems: "flex-start" }}>
                                    <ReimbursementMenu request={request} dispatch={dispatch} formValidator={formValidator} claim={claim}/>
                        </ContentCell>
                    </ContentRow>
                            : 
                                <ContentRow>
                            <ContentCell width="100%">
                                <ReimbursementListSection request={request} dispatch={dispatch} />
                            </ContentCell>
                                </ContentRow>
                    
                }
                </TabContainer>
                {request.reimbursementCalculation?.totalAdjustedPaidExpense && 
                    <ConfirmationDialog
                    id="reimbursementActivityInformation"
                    keepMounted
                    open={showConfirmationDialog}
                    onCancel={onRequestReimbursementPaymentNo}
                    onOk={onRequestReimbursementPaymentYes}
                    okText="Yes"
                    cancelText="No"
                    title="Confirmation"
                    description={`You are about to submit a payment request to Accounting for \$${currentReimbursementCalculation?.totalOutstandingExpenseReserves}. Do you wish to proceed?`}
                    />
                }
                <ConfirmationDialog
                    id="reimbursementActivityVoid"
                    keepMounted
                    open={showConfirmationDialogForVoid}
                    onCancel={voidNo}
                    onOk={voidYes}
                    okText="Yes"
                    cancelText="No"
                    title="Confirmation"
                    description={`Are you sure you want to void this request?`}
                />
            </AppContainer>
            <ApproverSelectionDrawer open={request.openApproverSelectionDrawer} onClose={onApproverSelectionDrawerClose} onNext={onApproverSelectionDrawerNext} request={request} dispatch={dispatch} formValidator={formValidator} />

        </>
    );
}
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