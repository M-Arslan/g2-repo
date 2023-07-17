import {
    Button,
    Drawer,
    Link,
    IconButton,
    ButtonGroup,
    CircularProgress,
    Dialog,
    DialogContent,
    Fade,
    Menu,
    MenuItem,
    Slide,
    TextField
} from '@mui/material';
import {
    makeStyles
} from '@mui/styles';
import {
    Cancel,
    ChevronLeft,
    Menu as MenuIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { APP_TYPES } from '../../../../Core/Enumerations/app/app-types';
import { ROLES } from '../../../../Core/Enumerations/security/roles';
import { SelectList, Spinner, AlertDialogSlide } from '../../../../Core/Forms/Common';
import {
    associatedPolicyContractActions, associatedPolicyContractSelectors
} from "../../../../Core/State/slices/associated-policy-contracts";
import {
    claimSelectors, claimActions
 } from '../../../../Core/State/slices/claim';
import {
    LegalClaimSelectors
} from '../../../../Core/State/slices/legal-claim';
import { OpenLineBobCoverageActions} from '../../../../Core/State/slices/metadata/openLineBobCoverage';
import { accountingTransCodeActions } from '../../../../Core/State/slices/metadata/accountingTransCode';
import { accountingTransTypeActions } from '../../../../Core/State/slices/metadata/accountingTransType';
import { authorityAmountActions, authorityAmountSelectors } from '../../../../Core/State/slices/metadata/authorityAmount';
import { causeOfLossCodeActions } from '../../../../Core/State/slices/metadata/causeOfLossCodes';
import { claimDB2Actions, claimDB2Selectors } from '../../../../Core/State/slices/metadata/claim-db2';
import { currencyActions } from '../../../../Core/State/slices/metadata/currency';
import { financialDB2Actions, financialDB2Selectors, conferFinancialDB2Actions, conferFinancialDB2Selectors, fsriFinancialDB2Actions, fsriFinancialDB2Selectors } from '../../../../Core/State/slices/metadata/financial-db2';
import { lossExpenseReserveDB2Actions, lossExpenseReserveDB2Selectors } from '../../../../Core/State/slices/metadata/lossExpenseReserve-db2';
import { riskStatesActions} from '../../../../Core/State/slices/metadata/risk-states';
import {
    ULClaimsActions,
    ULClaimsSelectors
} from "../../../../Core/State/slices/ULClaims";
import { userSelectors } from '../../../../Core/State/slices/user';
import { usersActions, usersSelectors } from '../../../../Core/State/slices/users';
import { CaraUrls } from '../../../../Settings';
import { createActionLogForFacRIChecked, createActionLogForFinacialActivityType, loadActionLogForDeductibleRequested, loadActionLogForFacRIChecked, loadActionLogForInitialRiRequest, loadActionLogList } from '../../../ActionLog/Queries';
import { HelpDrawer } from '../../../Help/HelpDrawer';
import { loadNotifications } from '../../../Notifications/Query/loadNotifications';
import { createNotification } from '../../../Notifications/Query/saveNotifications';
import { AppContainer, TabContainer } from '../TabContainer';
import { AccountingMenu } from './AccountingMenu';
import { AccountingSelectionDrawer } from './AccountingSelectionDrawer';
import { onApprove, onCloseClaimActivitySave, onCollectDeductibleSubmit1, onCompleted, onInProgress, onMLASuppressionClaimAcivitySave, onOpenClaimAcivitySave, onPaymentClaimActivitySave, onProcessingCompleted, onRecoveryClaimActivitySave, onReinsuranceProcessingRequired, onReject, onReopenClaimActivitySave, onRequestIntialRINoticeSubmit1, onReserveChangeClaimActivitySave, onStatusAlreadyPaid, onSubmitToCE, onVendorSetupComplete, onVoid, onAuthorityCheck, onWCTabularUpdateClaimActivitySave } from './ActionMenuEvents';
import { ShowActionMenu, ShowApproveMenu, ShowCheckFacDatabaseforRIMenu, ShowCheckforpriorpaymentMenu, ShowCompletedMenu, ShowCreateClaimActivityMenu, ShowErrorMenu, ShowFlagAsIssueMenu, ShowManuallyAddVendorMenu, ShowProcessingCompleteMenu, ShowAuthorityCheckMenu, ShowProcessingInProgressMenu, ShowReinsuranceProcessingRequiredMenu, ShowRejectedMenu, ShowRejectMenu, ShowRequestDeductibleCollectionMenu, ShowRequestInitialRINoticebesentMenu, ShowRequestVendorsetupMenu, ShowSearchVendorMenu, ShowSetStatustoAlreadyPaidMenu, ShowSetStatustoInprogressMenu, ShowSetStatustoVendorsetupcompletedMenu, ShowSubmitMenu, ShowSubmittoCEforApprovalMenu, ShowVoidMenu, ShowSubmitForApproval, ShowSaveAsDraft, ShowApproveMLA, ShowSupressMLA, ShowSave } from './ActionMenuRules';
import { ApproverSelectionDrawer } from './ApproverSelectionDrawer';
import { ClaimActivityDrawer } from './ClaimActivityDrawer';
import { CollectDeductibleDrawer } from './CollectDeductibleDrawer';
import { InfoSectionSelector } from './InfoSectionSelector';
import { VendorSearchDrawer } from './PaymentClaimActivity/VendorSearchDrawer';
import { PriorPaymentInfoSection } from './PriorPaymentInfoSection';
import { findAcitivityTypeUIByAcitivityType, findMenusToDisplay, loadClaimDetailForOpenActivity, loadCloseActivity, loadFinancialDetail, loadIssueTypeList, loadMLASuppressionsActivity, loadOpenActivity, loadPaymentActivity, loadPriorPayments, loadReopenActivity, loadReserveChangeActivity, loadGenesisMLAActivity,loadSpecialInstructionsActivity, saveActivity, saveFinancialDetail, saveWorkFlowTask } from './Queries';
import { saveIssueLogs } from './Queries/saveIssueLogs';
import { RequestInitialRINoticeDrawer } from './RequestInitialRINoticeDrawer';
import { validateActivity, validateFinancial, validateOpenActivityForCE_LegalEntity3, validateGenesisPayementActivity, validateGenesisMLAActivity, validateWCReservePayementActivity, validateWCExpenseOnlyPayementActivity} from './Validations/validateFinancial';
import { loadClaimRiskCodingDetail } from '../ClaimRiskCoding/Queries/loadClaimRiskCodingDetail';

import { loadPriorClaimActivity } from './Queries/loadPriorClaimActivity';
import {
    genesisMLALossCodingActions,
} from '../../../../Core/State/slices/metadata/genesisMLALossCoding';
import { LEGAL_ENTITY } from '../../../../Core/Enumerations/app/legal-entity';
import { ACCOUNTING_TRANS_TYPES } from '../../../../Core/Enumerations/app/accounting-trans-type';
import { CLAIM_STATUS_TYPE, GENSERVE_CLAIM_STATUS_TYPE } from '../../../../Core/Enumerations/app/claim-status-type';
import { CLAIM_TYPES } from '../../../../Core/Enumerations/app/claim-type';
import { ACTION_TYPES } from '../../../../Core/Enumerations/app/action-type';
import { STATUTORY_SYSTEM } from '../../../../Core/Enumerations/app/statutory-system';
import { PAYMENT_TYPE_CODE } from '../../../../Core/Enumerations/app/payment-type-code';
import { FAL_CLAIM_STATUS_TYPES } from '../../../../Core/Enumerations/app/fal_claim-status-types';
import { loadWCTabularUpdateActivity } from './Queries/loadActivity';
import { mlaThresholdActions, mlaThresholdSelectors } from '../../../../Core/State/slices/metadata/mlaThreshold';


const ContentRow = styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
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

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backdrop: {
        zIndex: 5,
        color: '#fff',
    },
    paper: {
        
        border: '2px solid #000',
        padding: '2em',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        listStyle: 'none',
        listStyleType: 'none',
    },
    drawerPaper: {
        width: drawerWidth,
        top: '60px',
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 1em',
        // necessary for content to be below app bar
        justifyContent: 'flex-start',
        fontWeight: 'bold',
        backgroundColor: '#bdc3c7',

    },
    content: {
        flexGrow: 1,
        padding: '3em',
        marginRight: -drawerWidth,
    },
    contentShift: {
        marginRight: 0,
    },
    dividerFullWidth: {
        margin: `5px 0 0 2em`,
    },
    dividerInset: {
        margin: `5px 0 0 9px`,
    },
}));
const drawerWidth = 600;
export const AccountingTab = ({ claim }) => {
    const $dispatch = useDispatch();
    const $auth = useSelector(userSelectors.selectAuthContext());
    claim = useSelector(claimSelectors.selectData());
    const isLegalClaim = claim.claimType === CLAIM_TYPES.LEGAL;
    const isViewer = $auth.isReadOnly(APP_TYPES.Financials);
    const currentUser = $auth.currentUser;
    const isClaimAccountant = $auth.isInRole(ROLES.Claims_Accountant);
    const isClaimExaminer = $auth.isInRole(ROLES.Claims_Examiner);
    const isExpenseAdmin = $auth.isInRole(ROLES.Expense_Admin);
    const users = useSelector(usersSelectors.selectData());
    const accountants = useSelector(usersSelectors.getAccountants());

    const legalClaim = useSelector(LegalClaimSelectors.selectData()) || {};

    const ulClaims = useSelector(ULClaimsSelectors.selectData());
    const primaryULClaim = (ulClaims || []).length > 0 ? ulClaims[0] : {};

    const associatedPolices = useSelector(associatedPolicyContractSelectors.selectData());
    const primaryPolicy = (associatedPolices || []).length > 0 ? associatedPolices[0] : {};

    let db2Claim = useSelector(claimDB2Selectors.selectData());
    db2Claim = (db2Claim || []).length > 0 ? db2Claim[0] : null;
    let financialDB2 = useSelector(financialDB2Selectors.selectData());
    let lossExpenseReserve = useSelector(lossExpenseReserveDB2Selectors.selectData());
    const fsriFinancialDB2 = useSelector(fsriFinancialDB2Selectors.selectData());
    const conferFinancialDB2 = useSelector(conferFinancialDB2Selectors.selectData());
    
    if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.FSRI) {

        db2Claim = fsriFinancialDB2 ? {
            claimID: fsriFinancialDB2.statutoryClaimID,
            statusCode: fsriFinancialDB2.lossStatus,
            statusText: fsriFinancialDB2.lossStatus
        } : null;
        lossExpenseReserve = fsriFinancialDB2 ? {
            lossReserves: fsriFinancialDB2.lossReserve + fsriFinancialDB2.additionalLossRes,
            expenseReserves: fsriFinancialDB2.expenseReserve + fsriFinancialDB2.additionalExpenseRes
        } : null;
        financialDB2 = fsriFinancialDB2 ? {
            claimID: fsriFinancialDB2.statutoryClaimID,
            statusCode: fsriFinancialDB2.lossStatus,
            statusText: fsriFinancialDB2.lossStatus,
            paidExpense: fsriFinancialDB2.paidExpense,
            paidLoss: fsriFinancialDB2.paidLoss,
            lossReserves: fsriFinancialDB2.lossReserve + fsriFinancialDB2.additionalLossRes,
            expenseReserves: fsriFinancialDB2.expenseReserve + fsriFinancialDB2.additionalExpenseRes,
        } : null;
    }
    else if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.CONFER) {

        db2Claim = conferFinancialDB2? {
            claimID: conferFinancialDB2?.genReStatutoryDB2FinancialsCollection[0]?.statutoryClaimID,
            statusCode: conferFinancialDB2?.genReStatutoryDB2FinancialsCollection[0]?.statusCode,
            statusText: conferFinancialDB2?.genReStatutoryDB2FinancialsCollection[0]?.statusCode
        } : null;

        lossExpenseReserve = conferFinancialDB2 ? {
            lossReserves: conferFinancialDB2.totalLossReserve + conferFinancialDB2.totalACR,
            expenseReserves: conferFinancialDB2.totalExpenseReserve + conferFinancialDB2.totalAER
        } : null;

        financialDB2 = conferFinancialDB2 ? {
            claimID: conferFinancialDB2?.genReStatutoryDB2FinancialsCollection[0]?.statutoryClaimID,
            statusCode: conferFinancialDB2?.genReStatutoryDB2FinancialsCollection[0]?.statusCode,
            statusText: conferFinancialDB2?.genReStatutoryDB2FinancialsCollection[0]?.statusCode,
            paidExpense: conferFinancialDB2.totalPaidExpense,
            paidLoss: conferFinancialDB2.totalPaidLoss,
            lossReserves: conferFinancialDB2.totalLossReserve + conferFinancialDB2.totalACR,
            expenseReserves: conferFinancialDB2.totalExpenseReserve + conferFinancialDB2.totalAER
        } : null;
    }
    const authorityAmount = useSelector(authorityAmountSelectors.getCurrentUserAuthorityAmount(currentUser.id, claim.g2LegalEntityID));
    

    const formValidator = useForm();
    const {  formState: { errors }, setValue, clearErrors } = formValidator;

    const [facReinsuranceURL, setFacReinsuranceURL] = React.useState('');
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();
    const [claimStatusActionText, setClaimStatusActionText] = React.useState('');
    const [tempClaimStatusTypeID, setTempClaimStatusTypeID] = React.useState('');
    const [tempActionTypeID, setTempActionTypeID] = React.useState('');
    const [openHelpDrawer, setOpenHelpDrawer] = React.useState(false);
    const [openAlertDialogSlide, setOpenAlertDialogSlide] = React.useState(false);
    const [openClaimAcivityDrawer, setOpenClaimAcivityDrawer] = React.useState(false);
    const [requestorNotificationcomment, SetRequestorNotificationcomment] = React.useState('');
    const [issueCommentsError, setIssueCommentsError] = React.useState(false);
    const [issueTypeError, setIssueTypeError] = React.useState(false);
    const [priorPaymentData, setpriorPaymentData] = React.useState({
        loaded: false,
        priorPayments: [],
    });
    const [openCollectDeductibleDrawer, setOpenCollectDeductibleDrawer] = React.useState(false);
    const [openRequestInitialRi, setOpenRequestInitialRi] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openNotificationDrawer, setOpenNotificationDrawer] = React.useState(false);
    const initialState = {
        claim: claim,
        originalFinancial: {},
        currentFinancial: {},
        isProcessing: true,
        isSaving: false,
        addressStates: [],
        errorMessages: [],
        showErrorMessages: false,
        helpContainerName: 'Financials',
        selectedMenu: 'FINANCIAL',
        lastFacRICheckedActionLog: null,
        lastInitialRINoticeActionLog: null,
        treatyRIApplies: null,
        lastDeductibleCollectionActionLog: null,
        currentClaimActivity: null,
        openVendorSearchDrawer: false,
        onResourceSelected: null,
        enableVendorUI: true,
        openApproverSelectionDrawer: false,
        menusToDisplay: [],
        isClaimExaminer: isClaimExaminer,
        isClaimAccountant: isClaimAccountant,
        isExpenseAdmin: isExpenseAdmin,
        currentVendor: {},
        vendorKey: 0,
        updateVendorMode: false,
        vendorReadOnlyMode: false,
        actionLogList: [],
        isLegalClaim: isLegalClaim,
        mlaThresholdAmount: null
    };
    const reducer = (state, action) => {
        switch (action.type) {
            case 'UPDATE_UNIVERSAL_REQUEST':
                return Object.assign({}, state, action.request);
            default:
                return state;
        }
    };
    const [request, dispatch] = React.useReducer(reducer, initialState);
    let mlaThresholdList = useSelector(mlaThresholdSelectors.selectData());
    React.useEffect(() => {
        if (mlaThresholdList) {
            mlaThresholdList = mlaThresholdList?.filter(x => x.g2LegalEntityID === claim.g2LegalEntityID && claim.claimType === x.claimType)
            if (mlaThresholdList[0]?.thresholdAmount) {
                request.mlaThresholdAmount = mlaThresholdList[0]?.thresholdAmount || 0;
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request } });
            } else {
                //enqueueSnackbar("MLA Threshold Amount could not found for this claim type and legal entity.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            }
        }
    }, [mlaThresholdList]);
    const managerAuthorityAmount = useSelector(authorityAmountSelectors.getCurrentUserAuthorityAmount(((request.currentClaimActivity || {}).taskOwner || ""), claim.g2LegalEntityID));
    const activityCreatorAuthorityAmount = useSelector(authorityAmountSelectors.getCurrentUserAuthorityAmount(((request.currentClaimActivity || {}).createdBy || ""), claim.g2LegalEntityID));

    const [state, setState] = React.useState({
        loaded: false,
        data: [],
        issueTypeTypes: [],
        issueTypeID: "",
        issueTypeText: "",
        comment: "",

    });
    const [requestorNotificationcommentError, setRequestorNotificationcommentError] = React.useState(false);

    React.useEffect(() => {
        $dispatch(usersActions.getAllUsers());
        
        if (claim.g2LegalEntityID === LEGAL_ENTITY.GENERAL_STAR || claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_INSURANCE)
        {
            $dispatch(financialDB2Actions.get({ claimID: claim.claimID, g2LegalEntityID: claim.g2LegalEntityID }));
            $dispatch(claimDB2Actions.get({ filterType: "C", filterValue: claim.claimID, g2LegalEntityID: claim.g2LegalEntityID, includeLegal: claim.claimType === CLAIM_TYPES.LEGAL }));
            $dispatch(lossExpenseReserveDB2Actions.get({ claimID: claim.claimID, g2LegalEntityID: claim.g2LegalEntityID }));
        }
        if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.FSRI) {
            $dispatch(fsriFinancialDB2Actions.get({ statutoryClaimID: claim.statutoryClaimID, statutorySystem: STATUTORY_SYSTEM.FSRI, g2LegalEntityID: claim.g2LegalEntityID }));
        }
        if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.CONFER) {
            $dispatch(conferFinancialDB2Actions.get({ statutoryClaimID: claim.statutoryClaimID, statutorySystem: STATUTORY_SYSTEM.CONFER, g2LegalEntityID: claim.g2LegalEntityID }));
        }
        $dispatch(authorityAmountActions.get());
        $dispatch(riskStatesActions.get());
        $dispatch(accountingTransCodeActions.get());
        $dispatch(currencyActions.get());
        $dispatch(causeOfLossCodeActions.get());
        $dispatch(accountingTransTypeActions.get());
        $dispatch(mlaThresholdActions.get());

        //$dispatch(LegalClaimActions.get({ claimMasterID: claim.claimMasterID }));
        $dispatch(ULClaimsActions.getList({ claimMasterID: claim.claimMasterID, onlyLoadPrimary: true }));
        $dispatch(associatedPolicyContractActions.getList({ claimMasterID: claim.claimMasterID, onlyLoadPrimary: true }));
        $dispatch(genesisMLALossCodingActions.get({ boBCoverageID: (claim.kindOfBusinessID ? claim.kindOfBusinessID + "" : ""), g2LegalEntityID: claim.g2LegalEntityID }));        
        loadfinancialData();
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
            setFacReinsuranceURL(ce[3]);
        })
    }, []);
    React.useEffect(() => {
        if (claim.g2LegalEntityID !== LEGAL_ENTITY.GENERAL_STAR) {
            $dispatch(OpenLineBobCoverageActions.get({ policyID: isLegalClaim ? primaryPolicy.policyID : claim.claimPolicyID, g2LegalEntityID: claim.g2LegalEntityID }));
        }
    }, [(isLegalClaim ? primaryPolicy.policyID : claim.claimPolicyID)]);
    

    const onMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const onMenuClose = () => {
        setAnchorEl(null);
    };

    const onAddVendor = () => {
        setAnchorEl(null);
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentVendor: {}, vendorKey: request.vendorKey + 1, openVendorSearchDrawer: false, enableVendorUI: true } });
    }
    const onSearchVendor = () => {
        setAnchorEl(null);
        const currentClaimActivity = request.currentClaimActivity || {};
        let currentVendor = JSON.parse(JSON.stringify(request.currentVendor));
        let key = request.vendorKey;
        const onResourceSelected1 = (vendor) => {
            if (vendor.vendorName1) {
                currentVendor.payeeName = vendor.vendorName1;
                currentVendor.payeeName2 = vendor.vendorName2;
                currentVendor.payeeAddressStreet1 = vendor.address;
                currentVendor.payeeAddressCity = vendor.city;
                currentVendor.payeeAddressState = vendor.state;
                currentVendor.payeeAddressZIP = vendor.postalCode;
                currentVendor.vendorCode = vendor.vendorCode;
                currentVendor.taxID = vendor.taxIDIndicator;
                currentVendor.invoiceNumber = null;
                setValue("payeeAddressState", currentVendor.payeeAddressState ? currentVendor.payeeAddressState : null);
                dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentVendor: currentVendor, vendorKey: key + 1, openVendorSearchDrawer: false, enableVendorUI: false } });
            } else {
                dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentVendor: {}, vendorKey: key + 1, openVendorSearchDrawer: false, enableVendorUI: true } });
            }
        }
        request.onResourceSelected = onResourceSelected1
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openVendorSearchDrawer: true } });
    }
    const onResourceSelected = async (vendor) => {
        let vendorCode = parseInt(vendor.vendorCode);
        if (!isNaN(vendorCode)) {
            const ProirPayments = await loadPriorPayments(claim.claimID, vendorCode, claim.g2LegalEntityID);
            if ((ProirPayments.data || {}).priorPayments) {
                setpriorPaymentData({
                    priorPayments: ProirPayments.data.priorPayments,
                });
                dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, openVendorSearchDrawer: false, openPriorPaymentDrawer: true } });
            } else {
                enqueueSnackbar("No Prior Payment Found.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });

                dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, openVendorSearchDrawer: false } });
            }
        } else {
            dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, openVendorSearchDrawer: false } });
        }
    }

    //const onHelpDrawerOpen = () => {
    //    setOpenHelpDrawer(!openHelpDrawer);
    //};
    const onHelpDrawerClose = () => {
        setOpenHelpDrawer(false);
    };

    const onAlertDialogSlideOpen = async () => {
        setOpenAlertDialogSlide(!openAlertDialogSlide);
    };
    const onAlertDialogSlideClose = () => {
        setOpenAlertDialogSlide(false);
    };

    const onCheckFacDataForRI = async () => {
        const actionLog = await createActionLogForFacRIChecked(claim.claimMasterID);
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, lastFacRICheckedActionLog: actionLog.data.create, isSaving: false, isProcessing: false } });
        setAnchorEl(null);
    }
    const onCollectDeductible = () => {
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: null } });
        onCollectDeductibleDrawerOpen();
    };
    const onCollectDeductibleDrawerOpen = async () => {
        setAnchorEl(null);
        setOpenCollectDeductibleDrawer(true);
    };
    const onCollectDeductibleDrawerClose = async () => {
        setAnchorEl(null);
        setOpenCollectDeductibleDrawer(false);
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: null, selectedMenu: findAcitivityTypeUIByAcitivityType(-1), menusToDisplay: findMenusToDisplay(-1), isSaving: false, isProcessing: false } });

    };
    const onCollectDeductibleSubmit = async (confirmation, rq) => {
        setAnchorEl(null);
        onCollectDeductibleSubmit1(confirmation, rq, setOpenCollectDeductibleDrawer, onFinancialSave, request, claim, currentUser, formValidator, enqueueSnackbar, dispatch);
    };
    const onRequestInitialRINotice = () => {
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: null } });
        onRequestInitialRINoticeDrawerOpen();
    };
    const onRequestInitialRINoticeDrawerOpen = async () => {
        setAnchorEl(null);
        setOpenRequestInitialRi(true);
    };
    const onRequestInitialRINoticeDrawerClose = async () => {
        setAnchorEl(null);
        setOpenRequestInitialRi(false);
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: null, selectedMenu: findAcitivityTypeUIByAcitivityType(-1), menusToDisplay: findMenusToDisplay(-1), isSaving: false, isProcessing: false } });
    };
    const onRequestIntialRINoticeSubmit = async (confirmation, rq) => {
        setAnchorEl(null);
        onRequestIntialRINoticeSubmit1(confirmation, rq, setOpenRequestInitialRi, onFinancialSave, request, claim, currentUser, formValidator, enqueueSnackbar, dispatch);
    };

    const onCreateClaimAcivity = () => {
        onClaimAcivityDrawerOpen();
    };
    const onClaimAcivityDrawerOpen = async () => {
        setAnchorEl(null);                 
        let isValid = true;
        if (!request.lastFacRICheckedActionLog && request.claim.g2LegalEntityID === LEGAL_ENTITY.GENERAL_STAR && request.claim.claimType !== CLAIM_TYPES.WORKERS_COMP ) {
            enqueueSnackbar('You must check if Fac R/I applies before you can proceed. Please select “Check Fac database for R/I “ from the action menu.', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            isValid = false;
        }

        if (isValid) {
            setOpenClaimAcivityDrawer(true);
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, enableVendorUI: true, currentClaimActivity: { sendNoticeToReinsurance: false, urgent: false } } });
        }
    };
    const onClaimAcivityDrawerClose = () => {
        clearErrors();

        setOpenClaimAcivityDrawer(false);
        setAnchorEl(null);
        window.location.hash = "financials";
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentVendor: {}, updateVendorMode: false, currentClaimActivity: null, selectedMenu: findAcitivityTypeUIByAcitivityType(-1), menusToDisplay: findMenusToDisplay(-1), } });
    };
    const onClaimAcivityDrawerNext = async () => {

        let currentDB2Claim = db2Claim;
        let accountingTransTypeID = parseInt(request.currentClaimActivity.accountingTransTypeID);

        if (request.claim.claimType !== CLAIM_TYPES.WORKERS_COMP) {
            let isValid = await validateActivity(formValidator.trigger);
            if (!isValid) {
                return;
            }
            // Validation to create open claim activity
            if (accountingTransTypeID === ACCOUNTING_TRANS_TYPES.OPEN) {
                const priorRes = await loadPriorClaimActivity(request.claim.claimMasterID);
                const getAllPriorClaimActivity = priorRes.data.accountingList;
                const allOpenPrior = getAllPriorClaimActivity.filter(x => x.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.OPEN && !["Error", "Void", "Rejected"].includes(x.statusText));
                if (allOpenPrior.length > 0) {
                    enqueueSnackbar("Open claim activity already exist for this claim. You can not create another one.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    return;
                }
            }
            // Validate Claim Data
            if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && !(claim.statutoryClaimID && claim.statutorySystem) && [
                ACCOUNTING_TRANS_TYPES.CLOSE,
                ACCOUNTING_TRANS_TYPES.RESERVE,
                ACCOUNTING_TRANS_TYPES.GENESIS_PAYMENT
            ].includes(accountingTransTypeID)) {
                enqueueSnackbar("Statutory System and Statutory Claim ID must be provided before you may proceed.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }

            // Validate Claim Data
            if ([
                ACCOUNTING_TRANS_TYPES.OPEN,
                ACCOUNTING_TRANS_TYPES.CLOSE,
                ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT,
                ACCOUNTING_TRANS_TYPES.INDEMNITY_PAYMENT,
                ACCOUNTING_TRANS_TYPES.REOPEN,
                ACCOUNTING_TRANS_TYPES.RESERVE,
                ACCOUNTING_TRANS_TYPES.RECOVERY,
                ACCOUNTING_TRANS_TYPES.MEDPAY_PAYMENT,
                ACCOUNTING_TRANS_TYPES.CHECK_COPY,
                ACCOUNTING_TRANS_TYPES.STOP_PAYMENT,
                ACCOUNTING_TRANS_TYPES.VOID_PAYMENT,
                ACCOUNTING_TRANS_TYPES.OPEN_PENDING,
                ACCOUNTING_TRANS_TYPES.OPEN_CLOSE_PENDING,
                ACCOUNTING_TRANS_TYPES.MLA_SUPPRESSION,
                ACCOUNTING_TRANS_TYPES.DATE_OF_LOSS_CORRECTION,
                ACCOUNTING_TRANS_TYPES.REQUEST_COPY_OF_CHECK,
                ACCOUNTING_TRANS_TYPES.UL_CARRIER_TENDERED,
                ACCOUNTING_TRANS_TYPES.OTHER,
                ACCOUNTING_TRANS_TYPES.GENESIS_PAYMENT
            ].includes(accountingTransTypeID)) {
                isValid = await validateClaimDetailForActivity();
                if (!isValid)
                    return;
            }
            // Check DB2 Claim
            if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE) {
                if (claim.statutorySystem === STATUTORY_SYSTEM.FSRI && !fsriFinancialDB2 && [
                    ACCOUNTING_TRANS_TYPES.CLOSE,
                    ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT,
                    ACCOUNTING_TRANS_TYPES.INDEMNITY_PAYMENT,
                    ACCOUNTING_TRANS_TYPES.MLA_RESERVE,
                    ACCOUNTING_TRANS_TYPES.REOPEN,
                    ACCOUNTING_TRANS_TYPES.RESERVE,
                    ACCOUNTING_TRANS_TYPES.RECOVERY,
                    ACCOUNTING_TRANS_TYPES.MEDPAY_PAYMENT,
                    ACCOUNTING_TRANS_TYPES.CHECK_COPY,
                    ACCOUNTING_TRANS_TYPES.MLA_SUPPRESSION,
                    ACCOUNTING_TRANS_TYPES.DATE_OF_LOSS_CORRECTION,
                    ACCOUNTING_TRANS_TYPES.REQUEST_COPY_OF_CHECK,
                    ACCOUNTING_TRANS_TYPES.UL_CARRIER_TENDERED,
                    ACCOUNTING_TRANS_TYPES.OTHER
                ].includes(accountingTransTypeID)) {
                    enqueueSnackbar("This claim does not exist in FSRI. Please request an Open Claim activity.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    return;
                }
                if (claim.statutorySystem === STATUTORY_SYSTEM.CONFER && !conferFinancialDB2 && [
                    ACCOUNTING_TRANS_TYPES.CLOSE,
                    ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT,
                    ACCOUNTING_TRANS_TYPES.INDEMNITY_PAYMENT,
                    ACCOUNTING_TRANS_TYPES.MLA_RESERVE,
                    ACCOUNTING_TRANS_TYPES.REOPEN,
                    ACCOUNTING_TRANS_TYPES.RESERVE,
                    ACCOUNTING_TRANS_TYPES.RECOVERY,
                    ACCOUNTING_TRANS_TYPES.MEDPAY_PAYMENT,
                    ACCOUNTING_TRANS_TYPES.CHECK_COPY,
                    ACCOUNTING_TRANS_TYPES.MLA_SUPPRESSION,
                    ACCOUNTING_TRANS_TYPES.DATE_OF_LOSS_CORRECTION,
                    ACCOUNTING_TRANS_TYPES.REQUEST_COPY_OF_CHECK,
                    ACCOUNTING_TRANS_TYPES.UL_CARRIER_TENDERED,
                    ACCOUNTING_TRANS_TYPES.OTHER
                ].includes(accountingTransTypeID)) {
                    enqueueSnackbar("This claim does not exist in CONFER. Please request an Open Claim activity.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    return;
                }
            }
            else {
                if (!currentDB2Claim && [
                    ACCOUNTING_TRANS_TYPES.CLOSE,
                    ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT,
                    ACCOUNTING_TRANS_TYPES.INDEMNITY_PAYMENT,
                    ACCOUNTING_TRANS_TYPES.MLA_RESERVE,
                    ACCOUNTING_TRANS_TYPES.REOPEN,
                    ACCOUNTING_TRANS_TYPES.RESERVE,
                    ACCOUNTING_TRANS_TYPES.RECOVERY,
                    ACCOUNTING_TRANS_TYPES.MEDPAY_PAYMENT,
                    ACCOUNTING_TRANS_TYPES.CHECK_COPY,
                    ACCOUNTING_TRANS_TYPES.MLA_SUPPRESSION,
                    ACCOUNTING_TRANS_TYPES.DATE_OF_LOSS_CORRECTION,
                    ACCOUNTING_TRANS_TYPES.REQUEST_COPY_OF_CHECK,
                    ACCOUNTING_TRANS_TYPES.UL_CARRIER_TENDERED,
                    ACCOUNTING_TRANS_TYPES.OTHER
                ].includes(accountingTransTypeID)) {
                    enqueueSnackbar("This claim does not exist in GenServe. Please request an Open Claim activity.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    return;
                }
            }

            // Check DB2 Claim Status = Open
            if ((currentDB2Claim || {}).statusCode === GENSERVE_CLAIM_STATUS_TYPE.OPEN && [
                ACCOUNTING_TRANS_TYPES.OPEN,
                ACCOUNTING_TRANS_TYPES.MLA_RESERVE,
                ACCOUNTING_TRANS_TYPES.REOPEN,
                ACCOUNTING_TRANS_TYPES.OPEN_PENDING,
                ACCOUNTING_TRANS_TYPES.OPEN_CLOSE_PENDING
            ].includes(accountingTransTypeID)) {
                enqueueSnackbar("Claim is a open in GenServe. You are not allowed to create this activity.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }

            // Check DB2 Claim Status = P - Pending
            if ((currentDB2Claim || {}).statusCode === GENSERVE_CLAIM_STATUS_TYPE.PENDING && [
                ACCOUNTING_TRANS_TYPES.OPEN,
                ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT,
                ACCOUNTING_TRANS_TYPES.INDEMNITY_PAYMENT,
                ACCOUNTING_TRANS_TYPES.MLA_RESERVE,
                ACCOUNTING_TRANS_TYPES.REOPEN,
                ACCOUNTING_TRANS_TYPES.RECOVERY,
                ACCOUNTING_TRANS_TYPES.MEDPAY_PAYMENT,
                ACCOUNTING_TRANS_TYPES.CHECK_COPY,
                ACCOUNTING_TRANS_TYPES.OPEN_PENDING,
                ACCOUNTING_TRANS_TYPES.OPEN_CLOSE_PENDING,
                ACCOUNTING_TRANS_TYPES.MLA_SUPPRESSION,
                ACCOUNTING_TRANS_TYPES.DATE_OF_LOSS_CORRECTION,
                ACCOUNTING_TRANS_TYPES.REQUEST_COPY_OF_CHECK,
                ACCOUNTING_TRANS_TYPES.UL_CARRIER_TENDERED,
                ACCOUNTING_TRANS_TYPES.OTHER
            ].includes(accountingTransTypeID)) {
                enqueueSnackbar("Claim is a pending file in GenServe. Please request an Open claim activity.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }

            // Check DB2 Claim Status = X - Closed Pending
            if ((currentDB2Claim || {}).statusCode === GENSERVE_CLAIM_STATUS_TYPE.CLOSED_PENDING && [
                ACCOUNTING_TRANS_TYPES.OPEN,
                ACCOUNTING_TRANS_TYPES.CLOSE,
                ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT,
                ACCOUNTING_TRANS_TYPES.INDEMNITY_PAYMENT,
                ACCOUNTING_TRANS_TYPES.MLA_RESERVE,
                ACCOUNTING_TRANS_TYPES.RESERVE,
                ACCOUNTING_TRANS_TYPES.RECOVERY,
                ACCOUNTING_TRANS_TYPES.MEDPAY_PAYMENT,
                ACCOUNTING_TRANS_TYPES.CHECK_COPY,
                ACCOUNTING_TRANS_TYPES.OPEN_PENDING,
                ACCOUNTING_TRANS_TYPES.OPEN_CLOSE_PENDING,
                ACCOUNTING_TRANS_TYPES.MLA_SUPPRESSION,
                ACCOUNTING_TRANS_TYPES.DATE_OF_LOSS_CORRECTION,
                ACCOUNTING_TRANS_TYPES.REQUEST_COPY_OF_CHECK,
                ACCOUNTING_TRANS_TYPES.UL_CARRIER_TENDERED,
                ACCOUNTING_TRANS_TYPES.OTHER
            ].includes(accountingTransTypeID)) {
                enqueueSnackbar("Claim is a closed pending file in GenServe. Please request an Open claim activity.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }

            // Check DB2 Claim Status = C - Closed
            //
            if ((currentDB2Claim || {}).statusCode === GENSERVE_CLAIM_STATUS_TYPE.CLOSED && [
                ACCOUNTING_TRANS_TYPES.OPEN,
                ACCOUNTING_TRANS_TYPES.CLOSE,
                ACCOUNTING_TRANS_TYPES.MLA_RESERVE,
                ACCOUNTING_TRANS_TYPES.RESERVE,
                ACCOUNTING_TRANS_TYPES.OPEN_PENDING,
                ACCOUNTING_TRANS_TYPES.OPEN_CLOSE_PENDING,
                ACCOUNTING_TRANS_TYPES.DATE_OF_LOSS_CORRECTION,
                ACCOUNTING_TRANS_TYPES.REQUEST_COPY_OF_CHECK
            ].includes(accountingTransTypeID)) {
                enqueueSnackbar("This claim is closed in GenServe, please request claim be reopened.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }

            // Check Authority Amount
            if (!authorityAmount && [
                ACCOUNTING_TRANS_TYPES.OPEN,
                ACCOUNTING_TRANS_TYPES.CLOSE,
                ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT,
                ACCOUNTING_TRANS_TYPES.INDEMNITY_PAYMENT,
                ACCOUNTING_TRANS_TYPES.REOPEN,
                ACCOUNTING_TRANS_TYPES.RESERVE,
                ACCOUNTING_TRANS_TYPES.MEDPAY_PAYMENT,
                ACCOUNTING_TRANS_TYPES.GENESIS_PAYMENT
            ].includes(accountingTransTypeID)) {
                enqueueSnackbar("Authority amount does not exist for current user.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }

            // Check Loss Expense and Reserve 
            if (!lossExpenseReserve && [
                ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT,
                ACCOUNTING_TRANS_TYPES.INDEMNITY_PAYMENT,
                ACCOUNTING_TRANS_TYPES.MEDPAY_PAYMENT
            ].includes(accountingTransTypeID)) {
                enqueueSnackbar("Loss expense and reserve does not exist in GenServe.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }

            // If activity is Closed or Reserve 
            if ([
                ACCOUNTING_TRANS_TYPES.CLOSE,
                ACCOUNTING_TRANS_TYPES.RESERVE
            ].includes(accountingTransTypeID)
            ) {
                if (!lossExpenseReserve && currentDB2Claim.statusCode !== GENSERVE_CLAIM_STATUS_TYPE.PENDING) {
                    enqueueSnackbar("Loss expense and reserve does not exist in GenServe.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    return;
                }
            }
        }
        else {
            if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && !(claim.statutoryClaimID && claim.statutorySystem) && [
                ACCOUNTING_TRANS_TYPES.CLOSE,
                ACCOUNTING_TRANS_TYPES.WC_TABULAR_UPDATE,
                ACCOUNTING_TRANS_TYPES.WC_PAYMENT_RESERVE,
                ACCOUNTING_TRANS_TYPES.WC_EXPENSE_PAYMENT,
                ACCOUNTING_TRANS_TYPES.WC_RESERVE,
                ACCOUNTING_TRANS_TYPES.STOP_PAYMENT,
                ACCOUNTING_TRANS_TYPES.VOID_PAYMENT,
                ACCOUNTING_TRANS_TYPES.OTHER
            ].includes(accountingTransTypeID)) {
                enqueueSnackbar("Statutory System and Statutory Claim ID must be provided before you may proceed.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }
            if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.CONFER && !conferFinancialDB2 && [
                ACCOUNTING_TRANS_TYPES.CLOSE,
                ACCOUNTING_TRANS_TYPES.WC_TABULAR_UPDATE,
                ACCOUNTING_TRANS_TYPES.WC_PAYMENT_RESERVE,
                ACCOUNTING_TRANS_TYPES.WC_EXPENSE_PAYMENT,
                ACCOUNTING_TRANS_TYPES.WC_RESERVE,
                ACCOUNTING_TRANS_TYPES.STOP_PAYMENT,
                ACCOUNTING_TRANS_TYPES.VOID_PAYMENT,
                ACCOUNTING_TRANS_TYPES.OTHER
            ].includes(accountingTransTypeID)) {
                enqueueSnackbar("This claim does not exist in CONFER. Please request an Open Claim activity.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }
            if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.FSRI && !fsriFinancialDB2 && [
                ACCOUNTING_TRANS_TYPES.CLOSE,
                ACCOUNTING_TRANS_TYPES.WC_TABULAR_UPDATE,
                ACCOUNTING_TRANS_TYPES.WC_PAYMENT_RESERVE,
                ACCOUNTING_TRANS_TYPES.WC_EXPENSE_PAYMENT,
                ACCOUNTING_TRANS_TYPES.WC_RESERVE,
                ACCOUNTING_TRANS_TYPES.STOP_PAYMENT,
                ACCOUNTING_TRANS_TYPES.VOID_PAYMENT,
                ACCOUNTING_TRANS_TYPES.OTHER
            ].includes(accountingTransTypeID)) {
                enqueueSnackbar("This claim does not exist in FSRI. Please request an Open Claim activity.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }
        }
        setOpenClaimAcivityDrawer(false);
        setAnchorEl(null);
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, selectedMenu: findAcitivityTypeUIByAcitivityType(request.currentClaimActivity.accountingTransTypeID), menusToDisplay: findMenusToDisplay(request.currentClaimActivity.accountingTransTypeID) } });

    };
    const onApproverSelectionDrawerClose = async () => {
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: false } });
    }
    const onApproverSelectionDrawerNext = async () => {
        if (!managerAuthorityAmount) {
            enqueueSnackbar("The approver you selected does not have authority.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            return;
        }
        const currentClaimActivity = request.currentClaimActivity || {};
        if (currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT || currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.INDEMNITY_PAYMENT || currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.MEDPAY_PAYMENT) {
            let currentPayment = currentClaimActivity.payments || {};

            let sumOfPaymentAmount = 0;
            currentPayment.paymentVendors.map(X => {
                sumOfPaymentAmount = sumOfPaymentAmount + X.paymentAmount;
            });

            if (sumOfPaymentAmount > managerAuthorityAmount.paymentAmount) {
                enqueueSnackbar("The approver you selected does not have enough authority to approve the transaction.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }
            request.currentClaimActivity.payments.mlaAuthorityCheckAmount = sumOfPaymentAmount;
        }
        else if (currentClaimActivity.accountingTransTypeID == ACCOUNTING_TRANS_TYPES.RESERVE) {
            if (claim.g2LegalEntityID !== LEGAL_ENTITY.GENESIS_REINSURANCE || claim.claimType === CLAIM_TYPES.LEGAL) {
                let endingLossReserve = (request.currentClaimActivity.reserveChanges || {}).endingLossReserve || 0;
                let endingExpenseReserve = (request.currentClaimActivity.reserveChanges || {}).endingExpenseReserve || 0;
                let endingMedPayReserve = (request.currentClaimActivity.reserveChanges || {}).endingMedPayReserve || 0;

                let currentLossReserve = (lossExpenseReserve || {}).lossReserves || 0;
                let currentExpenseReserve = (lossExpenseReserve || {}).expenseReserves || 0;
                let currentMedpayReserve = (lossExpenseReserve || {}).medPayLossReserves || 0;

                if (claim.claimType === CLAIM_TYPES.CASUALTY) {
                    let totalAmount = Math.abs((currentLossReserve - endingLossReserve)) + Math.abs((currentExpenseReserve - endingExpenseReserve)) + Math.abs((currentMedpayReserve - endingMedPayReserve));
                    if (totalAmount > managerAuthorityAmount.reserveAmount) {
                        enqueueSnackbar("The approver you selected does not have enough authority to approve the transaction.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                        return;
                    }
                }
                if (claim.claimType === CLAIM_TYPES.PROPERTY || claim.claimType === CLAIM_TYPES.LEGAL) {
                    let totalAmount = Math.abs((currentLossReserve - endingLossReserve)) + Math.abs((currentExpenseReserve - endingExpenseReserve));
                    if (totalAmount > managerAuthorityAmount.reserveAmount) {
                        enqueueSnackbar("The approver you selected does not have enough authority to approve the transaction.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                        return;
                    }
                }
            }
            else {

                let currentReserveChange = request.currentClaimActivity.reserveChanges || {};

                let cededLossReserves = currentReserveChange.cededLossReserves || 0;
                let cededExpenseReserve = currentReserveChange.cededExpenseReserve || 0;
                let acr = currentReserveChange.acr || 0;
                let aer = currentReserveChange.aer || 0;
                let currentCededLossReserves = null;
                let currentCededExpenseReserve = null;
                let currentAcr = null;
                let currentAer = null;
                if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.FSRI) {

                    currentCededLossReserves = currentReserveChange.beginningCededLossReserve != null ? currentReserveChange.beginningCededLossReserve : fsriFinancialDB2.lossReserve;
                    currentCededExpenseReserve = currentReserveChange.beginningCededExpenseReserve != null ? currentReserveChange.beginningCededExpenseReserve : fsriFinancialDB2.expenseReserve;
                    currentAcr = currentReserveChange.beginningACR != null ? currentReserveChange.beginningACR : fsriFinancialDB2.additionalLossRes;
                    currentAer = currentReserveChange.beginningAER != null ? currentReserveChange.beginningAER : fsriFinancialDB2.additionalExpenseRes;

                }
                if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.CONFER) {


                    currentCededLossReserves = currentReserveChange.beginningCededLossReserve != null ? currentReserveChange.beginningCededLossReserve : conferFinancialDB2.totalLossReserve;
                    currentCededExpenseReserve = currentReserveChange.beginningCededExpenseReserve != null ? currentReserveChange.beginningCededExpenseReserve : conferFinancialDB2.totalExpenseReserve;
                    currentAcr = currentReserveChange.beginningACR != null ? currentReserveChange.beginningACR : conferFinancialDB2.totalACR;
                    currentAer = currentReserveChange.beginningAER != null ? currentReserveChange.beginningAER : conferFinancialDB2.totalAER;

                }


                //let amountSum = Math.abs(parseFloat(acr)) + Math.abs(parseFloat(cededLossReserves)) + Math.abs(parseFloat(aer)) + Math.abs(parseFloat(cededExpenseReserve));
                //let db2Sum = Math.abs(parseFloat(currentAcr)) + Math.abs(parseFloat(currentCededLossReserves)) + Math.abs(parseFloat(currentAer)) + Math.abs(parseFloat(currentCededExpenseReserve));
                let amountSum = parseFloat(acr) + parseFloat(cededLossReserves) + parseFloat(aer) + parseFloat(cededExpenseReserve);
                let db2Sum = parseFloat(currentAcr) + parseFloat(currentCededLossReserves) + parseFloat(currentAer) + parseFloat(currentCededExpenseReserve);
                let calcAmount = Math.abs(amountSum - db2Sum);
                if (calcAmount > managerAuthorityAmount.reserveAmount) {
                    dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
                    enqueueSnackbar("The approver you selected does not have enough authority to approve the transaction.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    return;
                }

                request.currentClaimActivity.reserveChanges.companyPaidLoss = !isNaN(parseFloat(currentClaimActivity.reserveChanges.companyPaidLoss)) ? parseFloat(currentClaimActivity.reserveChanges.companyPaidLoss) : null;
                request.currentClaimActivity.reserveChanges.companyLossReserves = !isNaN(parseFloat(currentClaimActivity.reserveChanges.companyLossReserves)) ? parseFloat(currentClaimActivity.reserveChanges.companyLossReserves) : null;
                request.currentClaimActivity.reserveChanges.companyPaidExpense = !isNaN(parseFloat(currentClaimActivity.reserveChanges.companyPaidExpense)) ? parseFloat(currentClaimActivity.reserveChanges.companyPaidExpense) : null;
                request.currentClaimActivity.reserveChanges.companyExpenseReserve = !isNaN(parseFloat(currentClaimActivity.reserveChanges.companyExpenseReserve)) ? parseFloat(currentClaimActivity.reserveChanges.companyExpenseReserve) : null;
                request.currentClaimActivity.reserveChanges.cededLossReserves = !isNaN(parseFloat(currentClaimActivity.reserveChanges.cededLossReserves)) ? parseFloat(currentClaimActivity.reserveChanges.cededLossReserves) : null;
                request.currentClaimActivity.reserveChanges.cededExpenseReserve = !isNaN(parseFloat(currentClaimActivity.reserveChanges.cededExpenseReserve)) ? parseFloat(currentClaimActivity.reserveChanges.cededExpenseReserve) : null;
                request.currentClaimActivity.reserveChanges.acr = !isNaN(parseFloat(currentClaimActivity.reserveChanges.acr)) ? parseFloat(currentClaimActivity.reserveChanges.acr) : null;
                request.currentClaimActivity.reserveChanges.aer = !isNaN(parseFloat(currentClaimActivity.reserveChanges.aer)) ? parseFloat(currentClaimActivity.reserveChanges.aer) : null;
                request.currentClaimActivity.reserveChanges.mlaAuthorityCheckAmount = amountSum - db2Sum;
            }
        }
        else if (currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.CLOSE) {

            if (claim.g2LegalEntityID !== LEGAL_ENTITY.GENESIS_REINSURANCE || claim.claimType === CLAIM_TYPES.LEGAL) {
                var expenseReserve = 0;
                var lossReserve = 0;

                if ((db2Claim || {}).statusCode === GENSERVE_CLAIM_STATUS_TYPE.OPEN) {
                    if (financialDB2 === null) {
                        enqueueSnackbar("Unable to find Financial Data in GenServe", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                        return;
                    } else {
                        lossReserve = isNaN(parseFloat(financialDB2.lossReserves)) ? financialDB2.lossReserves : parseFloat(financialDB2.lossReserves);
                        expenseReserve = isNaN(parseFloat(financialDB2.expenseReserves)) ? financialDB2.expenseReserves : parseFloat(financialDB2.expenseReserves);
                    }
                    let totalAmount = lossReserve + expenseReserve;
                    if (totalAmount > managerAuthorityAmount.reserveAmount) {
                        enqueueSnackbar("The approver you selected does not have enough authority to approve the transaction.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                        return;
                    }
                }
            }
            else if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE) {
                let lossExpenseReserve = null;
                if (!(fsriFinancialDB2 || conferFinancialDB2) && claim.statutorySystem !== STATUTORY_SYSTEM.NAT_RE ) {
                    enqueueSnackbar("Unable to find Financial Data in GenServe", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    return;
                }
                let currentClaimActivity = (request.currentClaimActivity || {});
                let currentCloseActivity = (currentClaimActivity.close || {});
                if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.NAT_RE) {
                    lossExpenseReserve = {
                        paidLoss: currentCloseActivity.cededPaidLoss != null ? currentCloseActivity.cededPaidLoss : null,
                        paidExpense: currentCloseActivity.cededPaidExpense != null ? currentCloseActivity.cededPaidExpense : null,
                        lossReserves: currentCloseActivity.cededLossReserves != null ? currentCloseActivity.cededLossReserves : null,
                        expenseReserves: currentCloseActivity.cededExpenseReserve != null ? currentCloseActivity.cededExpenseReserve : null,
                        additionalLossRes: currentCloseActivity.acr != null ? currentCloseActivity.acr : null,
                        additionalExpenseRes: currentCloseActivity.aer != null ? currentCloseActivity.aer : null
                    };
                }
                if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.FSRI) {
                    lossExpenseReserve = fsriFinancialDB2 ? {
                        paidLoss: fsriFinancialDB2.paidLoss,
                        paidExpense: fsriFinancialDB2.paidExpense,
                        lossReserves: fsriFinancialDB2.lossReserve,
                        expenseReserves: fsriFinancialDB2.expenseReserve,
                        additionalLossRes: fsriFinancialDB2.additionalLossRes,
                        additionalExpenseRes: fsriFinancialDB2.additionalExpenseRes
                    } : null;
                }
                else if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem === STATUTORY_SYSTEM.CONFER) {
                    lossExpenseReserve = conferFinancialDB2 ? {
                        paidLoss: conferFinancialDB2.totalPaidLoss,
                        paidExpense: conferFinancialDB2.totalPaidExpense,
                        lossReserves: conferFinancialDB2.totalLossReserve,
                        expenseReserves: conferFinancialDB2.totalExpenseReserve,
                        additionalLossRes: conferFinancialDB2.totalACR,
                        additionalExpenseRes: conferFinancialDB2.totalAER
                    } : null;
                }

                let totalAmount = parseInt(lossExpenseReserve.expenseReserves || 0) + parseInt(lossExpenseReserve.lossReserves || 0) + parseInt(lossExpenseReserve.additionalLossRes || 0) + parseInt(lossExpenseReserve.additionalExpenseRes || 0)
                if (totalAmount > managerAuthorityAmount.reserveAmount) {
                    request.currentClaimActivity.claimMasterID = claim.claimMasterID;
                    request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.PENDING_APPROVAL;
                    dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
                    enqueueSnackbar("The approver you selected does not have enough authority to approve the transaction.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    return;
                }
                currentCloseActivity.cededPaidLoss = !isNaN(parseFloat(lossExpenseReserve.paidLoss)) ? parseFloat(lossExpenseReserve.paidLoss) : null;
                currentCloseActivity.cededLossReserves = !isNaN(parseFloat(lossExpenseReserve.lossReserves)) ? parseFloat(lossExpenseReserve.lossReserves) : null;
                currentCloseActivity.cededPaidExpense = !isNaN(parseFloat(lossExpenseReserve.paidExpense)) ? parseFloat(lossExpenseReserve.paidExpense) : null;
                currentCloseActivity.cededExpenseReserve = !isNaN(parseFloat(lossExpenseReserve.expenseReserves)) ? parseFloat(lossExpenseReserve.expenseReserves) : null;
                currentCloseActivity.acr = !isNaN(parseFloat(lossExpenseReserve.additionalLossRes)) ? parseFloat(lossExpenseReserve.additionalLossRes) : null;
                currentCloseActivity.aer = !isNaN(parseFloat(lossExpenseReserve.additionalExpenseRes)) ? parseFloat(lossExpenseReserve.additionalExpenseRes) : null;
                currentCloseActivity.totalIncuredChangeAmount = !isNaN(parseFloat(totalAmount)) ? parseFloat(totalAmount) : null;
                request.currentClaimActivity.close = currentCloseActivity;
            }
        }
        else if (currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.REOPEN) {

            if (!(request.currentClaimActivity.reopens || {}).endingLossReserve && !(request.currentClaimActivity.reopens || {}).endingExpenseReserve) {
                enqueueSnackbar('Loss, Expense and MedPay are required"', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }
            let expenseReserveTotal = (request.currentClaimActivity.reopens || {}).endingExpenseReserve || 0;
            let lossReserveTotal = (request.currentClaimActivity.reopens || {}).endingLossReserve || 0;
            let medPayReserveTotal = (request.currentClaimActivity.reopens || {}).endingMedPayReserve || 0;
            let amountSum = parseInt(expenseReserveTotal) + parseInt(lossReserveTotal) + parseInt(medPayReserveTotal);
            if (amountSum > managerAuthorityAmount.reserveAmount) {
                enqueueSnackbar("The approver you selected does not have enough authority to approve the transaction.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }
        }
        else if (currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.OPEN) {
            if (claim.g2LegalEntityID !== LEGAL_ENTITY.GENESIS_REINSURANCE || claim.claimType === CLAIM_TYPES.LEGAL) {
                request.currentClaimActivity.openRegistrations.lossReserveTotal = !isNaN(parseFloat(request.currentClaimActivity.openRegistrations.lossReserveTotal)) ? parseFloat(request.currentClaimActivity.openRegistrations.lossReserveTotal) : null;
                request.currentClaimActivity.openRegistrations.expenseReserveTotal = !isNaN(parseFloat(request.currentClaimActivity.openRegistrations.expenseReserveTotal)) ? parseFloat(request.currentClaimActivity.openRegistrations.expenseReserveTotal) : null;
                request.currentClaimActivity.openRegistrations.medPayReserveTotal = !isNaN(parseFloat(request.currentClaimActivity.openRegistrations.medPayReserveTotal)) ? parseFloat(request.currentClaimActivity.openRegistrations.medPayReserveTotal) : null;
                let expenseReserveTotal = ((request.currentClaimActivity.openRegistrations || {}).expenseReserveTotal || 0);
                let lossReserveTotal = ((request.currentClaimActivity.openRegistrations || {}).lossReserveTotal || 0);
                let medPayReserveTotal = ((request.currentClaimActivity.openRegistrations || {}).medPayReserveTotal || 0);
                let amountSum = expenseReserveTotal + lossReserveTotal + medPayReserveTotal;
                if (Math.abs(amountSum) > managerAuthorityAmount.reserveAmount) {
                    request.currentClaimActivity.claimMasterID = claim.claimMasterID;
                    request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.PENDING_APPROVAL;
                    dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
                    enqueueSnackbar("The approver you selected does not have enough authority to approve the transaction.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    return;
                }
                request.currentClaimActivity.openRegistrations.authorityCheckAmount = !isNaN(parseFloat(amountSum)) ? parseFloat(amountSum) : null;
            }
            else {
                let cededPaidLoss = ((request.currentClaimActivity.openRegistrations || {}).cededPaidLoss || 0);
                let cededLossReserves = ((request.currentClaimActivity.openRegistrations || {}).cededLossReserves || 0);
                let cededPaidExpense = ((request.currentClaimActivity.openRegistrations || {}).cededPaidExpense || 0);
                let cededExpenseReserve = ((request.currentClaimActivity.openRegistrations || {}).cededExpenseReserve || 0);
                let acr = ((request.currentClaimActivity.openRegistrations || {}).acr || 0);
                let aer = ((request.currentClaimActivity.openRegistrations || {}).aer || 0);
                let amountSum = parseFloat(cededPaidLoss) + parseFloat(cededLossReserves) + parseFloat(cededPaidExpense) + parseFloat(cededExpenseReserve) + parseFloat(acr) + parseFloat(aer);
                if (Math.abs(amountSum) > managerAuthorityAmount.reserveAmount) {
                    dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
                    enqueueSnackbar("The approver you selected does not have enough authority to approve the transaction.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    return;
                }
                request.currentClaimActivity.openRegistrations.authorityCheckAmount = !isNaN(parseFloat(amountSum)) ? parseFloat(amountSum) : null;
            }
        }
        else if (currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.GENESIS_PAYMENT) {
            const currentClaimActivity = request.currentClaimActivity || {};
            const currentPayment = currentClaimActivity.payments || {};
            request.currentClaimActivity.payments.lossReserveTotal = !isNaN(parseFloat(currentPayment.lossReserveTotal)) ? parseFloat(currentPayment.lossReserveTotal) : null;
            request.currentClaimActivity.payments.expenseReserveTotal = !isNaN(parseFloat(currentPayment.expenseReserveTotal)) ? parseFloat(currentPayment.expenseReserveTotal) : null;
            request.currentClaimActivity.payments.companyPaidLoss = !isNaN(parseFloat(currentClaimActivity.payments.companyPaidLoss)) ? parseFloat(currentPayment.companyPaidLoss) : null;
            request.currentClaimActivity.payments.companyLossReserves = !isNaN(parseFloat(currentPayment.companyLossReserves)) ? parseFloat(currentPayment.companyLossReserves) : null;
            request.currentClaimActivity.payments.companyPaidExpense = !isNaN(parseFloat(currentPayment.companyPaidExpense)) ? parseFloat(currentPayment.companyPaidExpense) : null;
            request.currentClaimActivity.payments.companyExpenseReserve = !isNaN(parseFloat(currentPayment.companyExpenseReserve)) ? parseFloat(currentPayment.companyExpenseReserve) : null;
            request.currentClaimActivity.payments.cededPaidLoss = !isNaN(parseFloat(currentPayment.cededPaidLoss)) ? parseFloat(currentPayment.cededPaidLoss) : null;
            request.currentClaimActivity.payments.cededLossReserves = !isNaN(parseFloat(currentPayment.cededLossReserves)) ? parseFloat(currentPayment.cededLossReserves) : null;
            request.currentClaimActivity.payments.cededPaidExpense = !isNaN(parseFloat(currentPayment.cededPaidExpense)) ? parseFloat(currentPayment.cededPaidExpense) : null;
            request.currentClaimActivity.payments.cededExpenseReserve = !isNaN(parseFloat(currentPayment.cededExpenseReserve)) ? parseFloat(currentPayment.cededExpenseReserve) : null;
            request.currentClaimActivity.payments.acr = !isNaN(parseFloat(currentPayment.acr)) ? parseFloat(currentPayment.acr) : null;
            request.currentClaimActivity.payments.aer = !isNaN(parseFloat(currentPayment.aer)) ? parseFloat(currentPayment.aer) : null;

            request.currentClaimActivity.payments.beginningCededPaidLoss = !isNaN(parseFloat(currentPayment.beginningCededPaidLoss)) ? parseFloat(currentPayment.beginningCededPaidLoss) : null;
            request.currentClaimActivity.payments.beginningCededPaidExpense = !isNaN(parseFloat(currentPayment.beginningCededPaidExpense)) ? parseFloat(currentPayment.beginningCededPaidExpense) : null;
            request.currentClaimActivity.payments.beginningCededLossReserve = !isNaN(parseFloat(currentPayment.beginningCededLossReserve)) ? parseFloat(currentPayment.beginningCededLossReserve) : null;
            request.currentClaimActivity.payments.beginningCededExpenseReserve = !isNaN(parseFloat(currentPayment.beginningCededExpenseReserve)) ? parseFloat(currentPayment.beginningCededExpenseReserve) : null;
            request.currentClaimActivity.payments.beginningACR = !isNaN(parseFloat(currentPayment.beginningACR)) ? parseFloat(currentPayment.beginningACR) : null;
            request.currentClaimActivity.payments.beginningAER = !isNaN(parseFloat(currentPayment.beginningAER)) ? parseFloat(currentPayment.beginningAER) : null;

            let totalPaymentAmount = parseFloat(currentPayment.lossReserveTotal) + parseFloat(currentPayment.expenseReserveTotal)            

            if (totalPaymentAmount > parseFloat(managerAuthorityAmount.paymentAmount)) {
                enqueueSnackbar("The approver you selected does not have enough authority to approve the transaction.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
                return;
            };
            //let currentCededReserves = Math.abs(parseFloat(currentCededLossReserves)) + Math.abs(parseFloat(currentCededExpenseReserve)) + Math.abs(parseFloat(currentAcr)) + Math.abs(parseFloat(currentAer));
            //let cededReserves = Math.abs(parseFloat(currentPayment.cededLossReserves)) + Math.abs(parseFloat(currentPayment.cededExpenseReserve)) + Math.abs(parseFloat(currentPayment.acr)) + Math.abs(parseFloat(currentPayment.aer));
            let currentCededReserves = parseFloat(currentPayment.beginningCededLossReserve || 0) + parseFloat(currentPayment.beginningCededExpenseReserve || 0) + parseFloat(currentPayment.beginningACR || 0) + parseFloat(currentPayment.beginningAER || 0);
            let cededReserves = parseFloat(currentPayment.cededLossReserves) + parseFloat(currentPayment.cededExpenseReserve) + parseFloat(currentPayment.acr) + parseFloat(currentPayment.aer);
            let totalCededReserves = Math.abs(cededReserves - currentCededReserves);
            if (totalCededReserves > parseFloat(managerAuthorityAmount.reserveAmount)) {
                enqueueSnackbar("The approver you selected does not have enough authority to approve the transaction.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
                return;
            }
            request.currentClaimActivity.payments.mlaAuthorityCheckAmount = cededReserves - currentCededReserves + totalPaymentAmount;
            currentClaimActivity.payments.paymentAuthorityCheckAmount = totalPaymentAmount;
            currentClaimActivity.payments.reserveAuthorityCheckAmount = cededReserves - currentCededReserves;
        }
        else if (currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.WC_PAYMENT_RESERVE) {
            const currentClaimActivity = request.currentClaimActivity || {};
            const currentPayment = currentClaimActivity.payments || {};
         
            currentClaimActivity.payments.lossReserveTotal = !isNaN(parseFloat(currentPayment.lossReserveTotal)) ? parseFloat(currentPayment.lossReserveTotal) : null;
            currentClaimActivity.payments.expenseReserveTotal = !isNaN(parseFloat(currentPayment.expenseReserveTotal)) ? parseFloat(currentPayment.expenseReserveTotal) : null;
            currentClaimActivity.payments.cededPaidLoss = !isNaN(parseFloat(currentPayment.cededPaidLoss)) ? parseFloat(currentPayment.cededPaidLoss) : null;
            currentClaimActivity.payments.cededLossReserves = !isNaN(parseFloat(currentPayment.cededLossReserves)) ? parseFloat(currentPayment.cededLossReserves) : null;
            currentClaimActivity.payments.cededPaidExpense = !isNaN(parseFloat(currentPayment.cededPaidExpense)) ? parseFloat(currentPayment.cededPaidExpense) : null;
            currentClaimActivity.payments.cededExpenseReserve = !isNaN(parseFloat(currentPayment.cededExpenseReserve)) ? parseFloat(currentPayment.cededExpenseReserve) : null;
            currentClaimActivity.payments.acr = !isNaN(parseFloat(currentPayment.acr)) ? parseFloat(currentPayment.acr) : null;
            currentClaimActivity.payments.aer = !isNaN(parseFloat(currentPayment.aer)) ? parseFloat(currentPayment.aer) : null;

            currentClaimActivity.payments.beginningCededPaidLoss = !isNaN(parseFloat(currentPayment.beginningCededPaidLoss)) ? parseFloat(currentPayment.beginningCededPaidLoss) : null;
            currentClaimActivity.payments.beginningCededPaidExpense = !isNaN(parseFloat(currentPayment.beginningCededPaidExpense)) ? parseFloat(currentPayment.beginningCededPaidExpense) : null;
            currentClaimActivity.payments.beginningCededLossReserve = !isNaN(parseFloat(currentPayment.beginningCededLossReserve)) ? parseFloat(currentPayment.beginningCededLossReserve) : null;
            currentClaimActivity.payments.beginningCededExpenseReserve = !isNaN(parseFloat(currentPayment.beginningCededExpenseReserve)) ? parseFloat(currentPayment.beginningCededExpenseReserve) : null;
            currentClaimActivity.payments.beginningACR = !isNaN(parseFloat(currentPayment.beginningACR)) ? parseFloat(currentPayment.beginningACR) : null;
            currentClaimActivity.payments.beginningAER = !isNaN(parseFloat(currentPayment.beginningAER)) ? parseFloat(currentPayment.beginningAER) : null;

            let totalPaymentAmount = parseFloat(currentPayment.lossReserveTotal) + parseFloat(currentPayment.expenseReserveTotal)

            if (totalPaymentAmount > parseFloat(managerAuthorityAmount.paymentAmount)) {
                enqueueSnackbar("The approver you selected does not have enough authority to approve the transaction.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
                return;
            };
            let totalIncuredAmount = parseFloat(currentPayment.reserveAuthorityCheckAmount || 0)
            if (Math.abs(totalIncuredAmount) > parseFloat(managerAuthorityAmount.reserveAmount)) {
                enqueueSnackbar("The approver you selected does not have enough authority to approve the transaction.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
                return;
            }
            currentClaimActivity.payments.mlaAuthorityCheckAmount = totalIncuredAmount + totalPaymentAmount;
            currentClaimActivity.payments.paymentAuthorityCheckAmount = totalPaymentAmount;
            currentClaimActivity.payments.reserveAuthorityCheckAmount = totalIncuredAmount;
        }
        else if (currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.WC_EXPENSE_PAYMENT) {
            const currentClaimActivity = request.currentClaimActivity || {};
            const currentPayment = currentClaimActivity.payments || {};

            currentClaimActivity.payments.expenseReserveTotal = !isNaN(parseFloat(currentPayment.expenseReserveTotal)) ? parseFloat(currentPayment.expenseReserveTotal) : null;
            currentClaimActivity.payments.cededPaidExpense = !isNaN(parseFloat(currentPayment.cededPaidExpense)) ? parseFloat(currentPayment.cededPaidExpense) : null;
            currentClaimActivity.payments.cededExpenseReserve = !isNaN(parseFloat(currentPayment.cededExpenseReserve)) ? parseFloat(currentPayment.cededExpenseReserve) : null;
            currentClaimActivity.payments.beginningCededPaidExpense = !isNaN(parseFloat(currentPayment.beginningCededPaidExpense)) ? parseFloat(currentPayment.beginningCededPaidExpense) : null;
            currentClaimActivity.payments.beginningCededExpenseReserve = !isNaN(parseFloat(currentPayment.beginningCededExpenseReserve)) ? parseFloat(currentPayment.beginningCededExpenseReserve) : null;

            let totalPaymentAmount = parseFloat(currentPayment.expenseReserveTotal)

            if (totalPaymentAmount > parseFloat(managerAuthorityAmount.paymentAmount)) {
                enqueueSnackbar("The approver you selected does not have enough authority to approve the transaction.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
                return;
            };
            let transactionReserveChangeAmount = parseFloat(currentPayment.reserveAuthorityCheckAmount || 0)
            if (Math.abs(transactionReserveChangeAmount) > parseFloat(managerAuthorityAmount.reserveAmount)) {
                enqueueSnackbar("The approver you selected does not have enough authority to approve the transaction.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
                return;
            }
            currentClaimActivity.payments.mlaAuthorityCheckAmount = transactionReserveChangeAmount;
            currentClaimActivity.payments.paymentAuthorityCheckAmount = totalPaymentAmount;
            currentClaimActivity.payments.reserveAuthorityCheckAmount = transactionReserveChangeAmount;
        }
        else if (currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.WC_TABULAR_UPDATE || currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.WC_RESERVE) {
            const currentClaimActivity = request.currentClaimActivity || {};
            const currentWCTabularUpdate = currentClaimActivity.wCTabularUpdate || {};
            let cededIndemnityPaid = (currentWCTabularUpdate.cededIndemnityPaid || 0);
            let cededIndemnityReserves = (currentWCTabularUpdate.cededIndemnityReserves || 0);
            let cededExpensePaid = (currentWCTabularUpdate.cededExpensePaid || 0);
            let cededExpenseReserves = (currentWCTabularUpdate.cededExpenseReserves || 0);
            let cededACR = (currentWCTabularUpdate.cededACR || 0);
            let cededAER = (currentWCTabularUpdate.cededAER || 0);
            let totalIncuredChangeAmount = (currentWCTabularUpdate.totalIncuredChangeAmount || 0);


            request.currentClaimActivity.wCTabularUpdate.beginningIndemnityPaid = !isNaN(parseFloat(currentWCTabularUpdate.beginningIndemnityPaid)) ? parseFloat(currentWCTabularUpdate.beginningIndemnityPaid) : null;
            request.currentClaimActivity.wCTabularUpdate.beginningIndemnityReserves = !isNaN(parseFloat(currentWCTabularUpdate.beginningIndemnityReserves)) ? parseFloat(currentWCTabularUpdate.beginningIndemnityReserves) : null;
            request.currentClaimActivity.wCTabularUpdate.beginningExpensePaid = !isNaN(parseFloat(currentWCTabularUpdate.beginningExpensePaid)) ? parseFloat(currentWCTabularUpdate.beginningExpensePaid) : null;
            request.currentClaimActivity.wCTabularUpdate.beginningExpenseReserves = !isNaN(parseFloat(currentWCTabularUpdate.beginningExpenseReserves)) ? parseFloat(currentWCTabularUpdate.beginningExpenseReserves) : null;
            request.currentClaimActivity.wCTabularUpdate.beginningACR = !isNaN(parseFloat(currentWCTabularUpdate.beginningACR)) ? parseFloat(currentWCTabularUpdate.beginningACR) : null;
            request.currentClaimActivity.wCTabularUpdate.beginningAER = !isNaN(parseFloat(currentWCTabularUpdate.beginningAER)) ? parseFloat(currentWCTabularUpdate.beginningAER) : null;

            request.currentClaimActivity.wCTabularUpdate.cededIndemnityReserves = !isNaN(parseFloat(currentWCTabularUpdate.cededIndemnityReserves)) ? parseFloat(currentWCTabularUpdate.cededIndemnityReserves) : null;
            request.currentClaimActivity.wCTabularUpdate.cededExpenseReserves = !isNaN(parseFloat(currentWCTabularUpdate.cededExpenseReserves)) ? parseFloat(currentWCTabularUpdate.cededExpenseReserves) : null;
            request.currentClaimActivity.wCTabularUpdate.cededACR = !isNaN(parseFloat(currentWCTabularUpdate.cededACR)) ? parseFloat(currentWCTabularUpdate.cededACR) : null;
            request.currentClaimActivity.wCTabularUpdate.cededAER = !isNaN(parseFloat(currentWCTabularUpdate.cededAER)) ? parseFloat(currentWCTabularUpdate.cededAER) : null;
            request.currentClaimActivity.wCTabularUpdate.totalIncuredChangeAmount = !isNaN(parseFloat(currentWCTabularUpdate.totalIncuredChangeAmount)) ? parseFloat(currentWCTabularUpdate.totalIncuredChangeAmount) : null;

            if (Math.abs(parseFloat(totalIncuredChangeAmount)) > parseFloat(managerAuthorityAmount.reserveAmount)) {
                enqueueSnackbar("The approver you selected does not have enough authority to approve the transaction.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openApproverSelectionDrawer: true, isSaving: false, isProcessing: false } });
                return;
            };
        }
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
        request.currentClaimActivity.claimMasterID = claim.claimMasterID;
        request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.PENDING_APPROVAL;
        let activity = JSON.parse(JSON.stringify(request.currentClaimActivity));
        let currentActivityPayment = activity.payments || {};
        delete activity.workflowTask;
        if (currentActivityPayment.paymentTypeCode !== PAYMENT_TYPE_CODE.WIRED && activity.payments)
            delete activity.payments.paymentWires;
        const result = await saveActivity(activity);

        ParseGQErrors(result.errors, result.error);

        if ((result.data || {}).saveActivity) {
            const actionLogResult = await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Submitted_for_Approval, (result.data || {}).saveActivity.activityID);
            ParseGQErrors(actionLogResult.errors, actionLogResult.error);

            let notifyUser = (users.filter(x => x.userID.toLowerCase() === ((request.currentClaimActivity || {}).taskOwner || "").toLowerCase())[0] || {});
            const notificationUsers = {
                firstName: notifyUser.firstName,
                lastName: notifyUser.lastName,
                emailAddress: notifyUser.emailAddress,
                networkID: request.currentClaimActivity.taskOwner,
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
                title: request.currentClaimActivity.accountingTransTypeText + " has been submitted for approval",
                body: request.currentClaimActivity.accountingTransTypeText + " has been submitted for approval",
                isHighPriority: false,
                roleID: null,
                notificationUsers: [notificationUsers],
                relatedURL: claimOrLegal + claim.claimMasterID + '/financials#Activity/' + (result.data || {}).saveActivity.activityID
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

            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: null, selectedMenu: findAcitivityTypeUIByAcitivityType(-1), menusToDisplay: findMenusToDisplay(-1), isSaving: false, isProcessing: false, openApproverSelectionDrawer: false } });
            enqueueSnackbar(request.currentClaimActivity.accountingTransTypeText + " activity has been created successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        } else {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
        }
    }

    const onFinancialSave = async () => {        
        if (JSON.stringify(request.originalFinancial) === JSON.stringify(request.currentFinancial))
            return;

        let isReloadRequired = false;

        if (request.selectedMenu === "FINANCIAL" && !request.currentFinancial.financialID)
            isReloadRequired = true;

        let isValid = await validate();
        if (isValid) {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: isReloadRequired } });
            try {
                request.currentFinancial.claimMasterID = claim.claimMasterID;
                let result = await saveFinancialDetail(request.currentFinancial);
                if (result.errors || result.error) {
                    ParseGQErrors(result.errors, result.error);
                }
                if ((result.data || {}).saveFinancial) {
                    if (result.data.saveFinancial.financialID) {
                        if (isReloadRequired) {
                            enqueueSnackbar("Financials information has been saved successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                            result = await loadFinancialDetail(result.data.saveFinancial.claimMasterID);
                            ParseGQErrors(result.errors, result.error);
                            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, originalFinancial: JSON.parse(JSON.stringify(result.data.financialDetail)), currentFinancial: { ...result.data.financialDetail }, editMode: true, isSaving: false, isProcessing: false } });
                        } else {
                            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, originalFinancial: JSON.parse(JSON.stringify(request.currentFinancial)), isSaving: false, isProcessing: false } });
                        }
                    }
                    else {
                        enqueueSnackbar("Unable to save financial information.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    }
                } else {
                    enqueueSnackbar("Unable to save financial information.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                }

            } catch (e) {
                enqueueSnackbar(e.toString(), { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
            }
        }
    }

    const onAcivitySubmit = async () => {
        setAnchorEl(null);        
        let currentActvity = request.currentClaimActivity;
        if (findAcitivityTypeUIByAcitivityType(currentActvity.accountingTransTypeID) === "OPENCLAIMACTIVTY") {
            $dispatch(claimActions.save({ claim: request.claim }));
            onOpenClaimAcivitySave(request, claim, authorityAmount, currentUser, formValidator, enqueueSnackbar, dispatch, validateOpenActivityForCE_LegalEntity3, loadNotifications, loadClaimRiskCodingDetail, primaryPolicy);
        }
        else if (findAcitivityTypeUIByAcitivityType(currentActvity.accountingTransTypeID) === "CLOSECLAIMACTIVITY") {
            onCloseClaimActivitySave(request, claim, db2Claim, financialDB2, authorityAmount, enqueueSnackbar, dispatch, fsriFinancialDB2, conferFinancialDB2);
        }
        else if (findAcitivityTypeUIByAcitivityType(currentActvity.accountingTransTypeID) === "MLASUPPRESSIONCLAIMACTIVTY") {
            onMLASuppressionClaimAcivitySave(request, formValidator, dispatch);
        }
        else if (findAcitivityTypeUIByAcitivityType(currentActvity.accountingTransTypeID) === "REOPENACTIVTY") {
            onReopenClaimActivitySave(request, claim, authorityAmount, currentUser, enqueueSnackbar, dispatch);
        }
        else if (findAcitivityTypeUIByAcitivityType(currentActvity.accountingTransTypeID) === "RESERVECHANGEACTIVTY") {
            onReserveChangeClaimActivitySave(request, claim, lossExpenseReserve, authorityAmount, currentUser, formValidator, enqueueSnackbar, dispatch, fsriFinancialDB2, conferFinancialDB2);
        }
        else if (findAcitivityTypeUIByAcitivityType(currentActvity.accountingTransTypeID) === "SPECIALINSTRUCTIONSACTIVTY") {
            onRecoveryClaimActivitySave(request, claim, currentUser, formValidator, enqueueSnackbar, dispatch);
        }
        else if (findAcitivityTypeUIByAcitivityType(currentActvity.accountingTransTypeID) === "EXPENSEPAYMENTCLAIMACTIVITY") {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
            await onPaymentClaimActivitySave(validateClaimDetailForActivity, validateGenesisPayementActivity, validateWCReservePayementActivity, validateWCExpenseOnlyPayementActivity, request, claim, db2Claim, lossExpenseReserve, authorityAmount, currentUser, formValidator, enqueueSnackbar, dispatch, fsriFinancialDB2, conferFinancialDB2);
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
        }
        else if (findAcitivityTypeUIByAcitivityType(currentActvity.accountingTransTypeID) === "INITIALRINOTICE") {
            onRequestInitialRINoticeDrawerOpen();
        }
        else if (findAcitivityTypeUIByAcitivityType(currentActvity.accountingTransTypeID) === "DEDUCTIBLECOLLECTION") {
            onCollectDeductibleDrawerOpen();
        }
        else if (findAcitivityTypeUIByAcitivityType(currentActvity.accountingTransTypeID) === "WCTABULARUPDATECLAIMACTIVITY") {
            onWCTabularUpdateClaimActivitySave(request, claim, formValidator, db2Claim, financialDB2, authorityAmount, enqueueSnackbar, dispatch, fsriFinancialDB2, conferFinancialDB2);
        }

    }
    const onActivitySubmitToCE = async () => {
        setAnchorEl(null);
        onSubmitToCE(request, claim, users, formValidator, enqueueSnackbar, dispatch, loadActivityView, legalClaim);
    }
    const onActivitySubmitForApproval = async () => {
        setAnchorEl(null);
        let flag = await validateGenesisMLAActivity(formValidator.trigger);
        if (flag) {
            request.openApproverSelectionDrawer = true;
            request.currentClaimActivity["taskOwner"] = authorityAmount.legalEntityManagerID;
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request } });
        }
    }
    const onActivitySaveAsDraft = async () => {
        setAnchorEl(null);
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
        request.currentClaimActivity.claimMasterID = claim.claimMasterID;
        request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.DRAFT;
        let activity = JSON.parse(JSON.stringify(request.currentClaimActivity));
        delete activity.workflowTask;

        const result = await saveActivity(activity);
        ParseGQErrors(result.errors, result.error);
        if ((result.data || {}).saveActivity) {
            await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Save_as_draft, (result.data || {}).saveActivity.activityID)
            let currentActivity = await loadActivityView((result.data || {}).saveActivity.activityID);
            enqueueSnackbar("Genesis MLA activity has been saved as Draft successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });

            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: currentActivity, isSaving: false, isProcessing: false } });
        } else {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
        }
    }
    const onActivitySave = async () => {
        setAnchorEl(null);
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
        request.currentClaimActivity.claimMasterID = claim.claimMasterID;
        request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.PENDING_APPROVAL;
        let activity = JSON.parse(JSON.stringify(request.currentClaimActivity));
        delete activity.workflowTask;

        const result = await saveActivity(activity);
        ParseGQErrors(result.errors, result.error);
        if ((result.data || {}).saveActivity) {
            await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Save, (result.data || {}).saveActivity.activityID)
            let currentActivity = await loadActivityView((result.data || {}).saveActivity.activityID);
            enqueueSnackbar("Genesis MLA activity has been saved successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });

            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: currentActivity, isSaving: false, isProcessing: false } });
        } else {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
        }
    }
    const onclickActivitySuppressMLA = async () => {
        setAnchorEl(null);
        let flag = await validateGenesisMLAActivity(formValidator.trigger);
        if (flag) {

            onAlertDialogSlideOpen();
        }
    }
    const onActivitySuppressMLA = async () => {
        setOpenAlertDialogSlide(false);
        setAnchorEl(null);
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
        request.currentClaimActivity.claimMasterID = claim.claimMasterID;
        request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.SUPPRESS_MLA;
        let activity = JSON.parse(JSON.stringify(request.currentClaimActivity));
        delete activity.workflowTask;

        const result = await saveActivity(activity);
        ParseGQErrors(result.errors, result.error);
        if ((result.data || {}).saveActivity) {
            await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Suppress_MLA, (result.data || {}).saveActivity.activityID)
            let currentActivity = await loadActivityView((result.data || {}).saveActivity.activityID);
            enqueueSnackbar("Genesis MLA activity has been saved successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });

            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: currentActivity, isSaving: false, isProcessing: false } });
        } else {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
        }

    }
    const onActivityApproveMLA = async () => {
        setAnchorEl(null);

        let flag = await validateGenesisMLAActivity(formValidator.trigger);
        if (flag) {

            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
            request.currentClaimActivity.claimMasterID = claim.claimMasterID;
            request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.COMPLETED_PI_2;
            let activity = JSON.parse(JSON.stringify(request.currentClaimActivity));
            delete activity.workflowTask;

            const result = await saveActivity(activity);
            ParseGQErrors(result.errors, result.error);
            if ((result.data || {}).saveActivity) {
                await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Completed, (result.data || {}).saveActivity.activityID)
                let currentActivity = await loadActivityView((result.data || {}).saveActivity.activityID);
                enqueueSnackbar("Genesis MLA activity has been completed successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });

                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: currentActivity, isSaving: false, isProcessing: false } });
            } else {
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
            }
        }

    }
    const onActivityRequestVendorSetup = () => {
        onAccountingSelectionDrawerNext();
    }
    const onActivityVendorSetupComplete = async () => {
        setAnchorEl(null);
        onVendorSetupComplete(request, claim, users, formValidator, enqueueSnackbar, dispatch, loadActivityView);
    }
    const onAcivityStatusVoid = async () => {
        setAnchorEl(null);
        onVoid(request, claim, enqueueSnackbar, dispatch, loadActivityView, formValidator);
    }
    const onActivityStatusAlreadyPaid = async () => {
        setAnchorEl(null);
        onStatusAlreadyPaid(request, claim, enqueueSnackbar, dispatch, loadActivityView);
    }
    const onActivityCompleted = async () => {
        setAnchorEl(null);
        onCompleted(request, claim, enqueueSnackbar, dispatch, loadActivityView, currentUser, financialDB2, fsriFinancialDB2, conferFinancialDB2, lossExpenseReserve, users);
    }
    const onActivityReinsuranceProcessingRequired = async () => {
        setAnchorEl(null);
        onReinsuranceProcessingRequired(request, claim, enqueueSnackbar, dispatch, loadActivityView);
    }
    const onActivityAuthorityCheck = () => {
        setAnchorEl(null);
        $dispatch(claimActions.save({ claim: request.claim }));
        onAuthorityCheck(request, claim, activityCreatorAuthorityAmount, currentUser, formValidator, enqueueSnackbar, dispatch, saveActivity, createActionLogForFinacialActivityType, loadActivityView, fsriFinancialDB2, conferFinancialDB2, financialDB2, lossExpenseReserve, users);
    }
    const onActivityInProgress = async () => {
        setAnchorEl(null);
        onInProgress(request, claim, currentUser, users, formValidator, enqueueSnackbar, dispatch, loadActivityView);
    }
    const onActivityProcessingCompleted = async () => {
        setAnchorEl(null);
        onProcessingCompleted(request, claim, lossExpenseReserve, currentUser, users, enqueueSnackbar, dispatch, loadActivityView, financialDB2, fsriFinancialDB2, conferFinancialDB2);
    }
    const onActivityFlagAsIssue = async () => {
        setAnchorEl(null);
        setClaimStatusActionText('Flag As Issue');
        setTempActionTypeID(ACTION_TYPES.Flag_as_Issue);
        setTempClaimStatusTypeID(CLAIM_STATUS_TYPE.OUTSTANDING_ISSUE);
        handleNotificationDrawerOpen();
    }
    const onActivityRejected = async () => {
        setAnchorEl(null);
        setClaimStatusActionText('Reject');
        setTempActionTypeID(ACTION_TYPES.Rejected);
        setTempClaimStatusTypeID(CLAIM_STATUS_TYPE.REJECTED);
        handleNotificationDrawerOpen();
    }
    const onActivityError = async () => {
        setAnchorEl(null);
        setClaimStatusActionText('Error');
        setTempActionTypeID(ACTION_TYPES.Error);
        setTempClaimStatusTypeID(CLAIM_STATUS_TYPE.ERROR_PI_2);
        handleNotificationDrawerOpen();
    }
    const onActivityApprove = async () => {
        window.location.hash = "financials";
        setAnchorEl(null);
        onApprove(validateClaimDetailForActivity, request, claim, db2Claim, financialDB2, lossExpenseReserve, authorityAmount, currentUser, users, formValidator, enqueueSnackbar, dispatch, loadActivityView, fsriFinancialDB2, conferFinancialDB2)
    }
    const onActivityReject = async () => {
        window.location.hash = "financials";
        setAnchorEl(null);
        onReject(request, claim, users, formValidator, enqueueSnackbar, dispatch, loadActivityView)
    }
    const onActivityQAPending = async () => {
        setAnchorEl(null);
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
        request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.QA_PENDING;
        let activity = JSON.parse(JSON.stringify(request.currentClaimActivity));
        delete activity.workflowTask;
        const result = await saveActivity(activity);
        if ((result.data || {}).saveActivity) {
            createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.QA_Pending, (result.data || {}).saveActivity.activityID)
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: null, selectedMenu: findAcitivityTypeUIByAcitivityType(-1), menusToDisplay: findMenusToDisplay(-1), isSaving: false, isProcessing: false } });
            enqueueSnackbar("Activity updated successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        } else {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
        }
    }
    const onCheckPriorClaimPayment = () => {
        setAnchorEl(null);
        request.openVendorSearchDrawer = true;
        request.onResourceSelected = onResourceSelected
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request } });
    }
    const onPaymentClaimActivityDraft = async () => {
        setAnchorEl(null);
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
        request.currentClaimActivity.claimMasterID = claim.claimMasterID;
        if (!request.currentClaimActivity.claimStatusTypeID)
            request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.DRAFT;

        let activity = JSON.parse(JSON.stringify(request.currentClaimActivity));
        delete activity.workflowTask;
        //delete activity.payments.paymentWires;
        const result = await saveActivity(activity);
        ParseGQErrors(result.errors, result.error);
        if ((result.data || {}).saveActivity) {
            await createActionLogForFinacialActivityType(claim.claimMasterID, request.currentVendor?.createdBy ? ACTION_TYPES.Update_Vendor : ACTION_TYPES.Add_Vendor, (result.data || {}).saveActivity.activityID)
            let currentActivity = await loadActivityView((result.data || {}).saveActivity.activityID);
            if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.INDEMNITY_PAYMENT || request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.MEDPAY_PAYMENT) {
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentVendor: {}, updateVendorMode: false, currentClaimActivity: currentActivity, enableVendorUI: true, isSaving: false, isProcessing: false } });
            } else {
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentVendor: {}, updateVendorMode: false, currentClaimActivity: currentActivity, enableVendorUI: false, isSaving: false, isProcessing: false } });
            }
            //enqueueSnackbar("Payment Activity has been submitted to CE successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        } else {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, updateVendorMode: false, isSaving: false, isProcessing: false } });
        }
    }

    const onAccountingSelectionDrawerClose = async () => {
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, openAccountingSelectionDrawer: false } });
    }
    const onAccountingSelectionDrawerNext = async () => {
        setAnchorEl(null);
        if (accountants.length === 0) {
            enqueueSnackbar("No Claim Accountant found.Please first assign Claim Accountant role to user.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            return;
        }

        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
        request.currentClaimActivity.claimMasterID = claim.claimMasterID;
        request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.REQUEST_VENDOR_SETUP;
        let activity = JSON.parse(JSON.stringify(request.currentClaimActivity));
        delete activity.workflowTask;
        const result = await saveActivity(activity);

        ParseGQErrors(result.errors, result.error);

        if ((result.data || {}).saveActivity) {
            const actionLogResult = await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Request_Vendor_setup, (result.data || {}).saveActivity.activityID);
            ParseGQErrors(actionLogResult.errors, actionLogResult.error);

            let _notificationUsers = [];
            accountants.filter(e => {
                _notificationUsers.push({ 'networkID': e.userID, "emailAddress": e.emailAddress, "firstName": e.firstName, "lastName": e.lastName, "reminderDate": null, "isCopyOnly": false, "statusCode": 'N' });
            });
            var claimOrLegal = '/Claim/';
            if (claim.claimType === CLAIM_TYPES.LEGAL) {
                claimOrLegal = '/Legal/'
            }
            const notificationRequest = {
                claimMasterID: claim.claimMasterID,
                typeCode: 'T',
                title: request.currentClaimActivity.accountingTransTypeText + " has been requested to setup vendor",
                body: request.currentClaimActivity.accountingTransTypeText + " has been requested to setup vendor",
                isHighPriority: false,
                roleID: null,
                notificationUsers: _notificationUsers,
                relatedURL: claimOrLegal + claim.claimMasterID + '/financials#Activity/' + (result.data || {}).saveActivity.activityID
            }
            const notificationResult = await createNotification(notificationRequest);
            ParseGQErrors(notificationResult.errors, notificationResult.error);
            let currentActivity = await loadActivityView((result.data || {}).saveActivity.activityID);
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: currentActivity, isSaving: false, isProcessing: false } });
            enqueueSnackbar(request.currentClaimActivity.accountingTransTypeText + " activity has been submitted successfully for vendor setup.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });

        } else {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
        }
    }

    function ParseGQErrors(errors, error) {
        if (error || errors) {
            enqueueSnackbar("An error occured.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }
    const validate = async () => {
        let isValid = true;
        if (request.selectedMenu === "FINANCIAL") {
            isValid = await validateFinancial(formValidator.trigger);
        }
        return isValid;
    }
    const loadfinancialData = async () => {
        try {
            let result = await loadFinancialDetail(claim.claimMasterID);
            ParseGQErrors(result.errors, result.error);

            let actionLogForFacRIChecked = await loadActionLogForFacRIChecked(claim.claimMasterID);
            ParseGQErrors(actionLogForFacRIChecked.errors, actionLogForFacRIChecked.error);

            let actionLogForDeductibleRequested = await loadActionLogForDeductibleRequested(claim.claimMasterID);
            ParseGQErrors(actionLogForDeductibleRequested.errors, actionLogForDeductibleRequested.error);

            let actionLogForInitialRiRequest = await loadActionLogForInitialRiRequest(claim.claimMasterID);
            ParseGQErrors(actionLogForInitialRiRequest.errors, actionLogForInitialRiRequest.error);

            if (window.location.href.toLowerCase().indexOf("activity") > -1) {
                let arr = window.location.href.split('/');
                let currentActivity = await loadActivityView(arr[arr.length - 1]);
                let actionLogList = await loadActionLogList(claim.claimMasterID, currentActivity.activityID);
                actionLogList = actionLogList.data.actionLogList;

                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, actionLogList: actionLogList || [], currentFinancial: result.data.financialDetail || {}, originalFinancial: JSON.parse(JSON.stringify(result.data.financialDetail || {})), lastFacRICheckedActionLog: actionLogForFacRIChecked.data.latestActionLog, lastDeductibleCollectionActionLog: actionLogForDeductibleRequested.data.latestActionLog, lastInitialRINoticeActionLog: actionLogForInitialRiRequest.data.latestActionLog, isSaving: false, isProcessing: false, currentClaimActivity: currentActivity, selectedMenu: findAcitivityTypeUIByAcitivityType(currentActivity.accountingTransTypeID), menusToDisplay: findMenusToDisplay(currentActivity.accountingTransTypeID) } });
            } else {
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentFinancial: result.data.financialDetail || {}, originalFinancial: JSON.parse(JSON.stringify(result.data.financialDetail || {})), lastFacRICheckedActionLog: actionLogForFacRIChecked.data.latestActionLog, lastDeductibleCollectionActionLog: actionLogForDeductibleRequested.data.latestActionLog, lastInitialRINoticeActionLog: actionLogForInitialRiRequest.data.latestActionLog, isSaving: false, isProcessing: false, selectedMenu: findAcitivityTypeUIByAcitivityType(-1), menusToDisplay: findMenusToDisplay(-1) } });
            }
        } catch (e) {
            enqueueSnackbar(toString(e), { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    };

    const validateClaimDetailForActivity = async () => {
        try {            
            if (isLegalClaim)
            return await validateLegalClaimDetailForActivity();

            const claimResult = await loadClaimDetailForOpenActivity(claim.claimMasterID);
            ParseGQErrors(claimResult.errors, claimResult.error);
            const claimData = claimResult.data.detail;

            let notifications = await loadNotifications("", "", claim.claimMasterID, true);
            const messages = [];

            //let errorMessage = 'Following information is missing.';
            let isValid = true;

            if (!claimData.claimPolicyID && !claimData.claimPolicy) {
                messages.push("The following field is required: Claim Detail -> Policy");
                isValid = false;
            }
            if (!claimData.dOL) {
                messages.push("The following field is required: Claim Detail -> Date of Loss");
                isValid = false;
            }
            if (claimData.fALClaimStatusTypeID !== FAL_CLAIM_STATUS_TYPES.ASSIGNED) {
                messages.push("Claim status must be assigned");
                isValid = false;
            }
            if (!claimData.lossDesc) {
                messages.push("The following field is required: Claim Detail -> Loss Description");
                isValid = false;
            }
            if (!claimData.lossLocation && !claimData.lossLocationOutsideUsa) {
                messages.push("The following field is required: Claim Detail -> Loss Location or Loss Location Outside USA");
                isValid = false;
            }
            if (!claimData.dateReceived) {
                messages.push("The following field is required: Claim Detail -> Claim Reported Date");
                isValid = false;
            }

            if (request.currentClaimActivity.accountingTransTypeID !== ACCOUNTING_TRANS_TYPES.CLOSE && request.currentClaimActivity.accountingTransTypeID !== ACCOUNTING_TRANS_TYPES.OPEN_CLOSE_PENDING && request.claim.claimType !== CLAIM_TYPES.WORKERS_COMP && notifications.filter(X => X.typeCode == "D").length == 0) {
                messages.push("The following field is required: Notification -> Claim Diary Date");
                isValid = false;
            }
            else if (notifications.filter(X => X.typeCode === "D").length > 0 && request.claim.claimType !== CLAIM_TYPES.WORKERS_COMP) {
                if (request.currentClaimActivity.accountingTransTypeID !== ACCOUNTING_TRANS_TYPES.CLOSE && request.currentClaimActivity.accountingTransTypeID !== ACCOUNTING_TRANS_TYPES.OPEN_CLOSE_PENDING) {
                    var len = notifications.filter(X => X.typeCode === "D").filter(X => X.notificationUsers.filter(Y => (new Date(Y.reminderDate)) > (new Date())).length > 0).length;
                    if (len === 0) {
                        messages.push("This claim is off diary.  Please create a new diary that has a date that is greater than today");
                        isValid = false;
                    }
                }
            }
            if (!isValid) {
                request.errorMessages = messages;
                request.isProcessing = false;
                request.showErrorMessages = !isValid;
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request } });
            }
            return isValid;

        } catch (e) {
            enqueueSnackbar(e.toString(), { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });
            return false;
        }
    }
    const validateLegalClaimDetailForActivity = async () => {
        try {
            const claimResult = await loadClaimDetailForOpenActivity(claim.claimMasterID);
            ParseGQErrors(claimResult.errors, claimResult.error);
            const claimData = claimResult.data.detail;
            
            let notifications = await loadNotifications("", "", claim.claimMasterID, true);

            const messages = [];

            //let errorMessage = 'Following information is missing.';
            let isValid = true;

            if (!primaryPolicy.policyID) {
                messages.push("Primary Associated Policy required.");
                isValid = false;
            }
            if (!primaryULClaim.dOL) {
                messages.push("The following field is required: Primary U/L Claim Detail -> Date of Loss");
                isValid = false;
            }
            if (claimData.fALClaimStatusTypeID !== FAL_CLAIM_STATUS_TYPES.ASSIGNED) {
                messages.push("Claim status must be assigned");
                isValid = false;
            }
            if (!claimData.fullDescriptionOfLoss) {
                messages.push("The following field is required: Claim Detail -> Loss Description");
                isValid = false;
            }
            if (!primaryULClaim.lossLocation && !primaryULClaim.lossLocationOutsideUSA) {
                messages.push("The following field is required: Primary U/L Claim Detail -> Loss Location or Loss Location Outside USA");
                isValid = false;
            }
            if (!legalClaim.assignedToCounsel) {
                messages.push("The following field is required: Legal Claim Detail -> Assigned To Counsel Date");
                isValid = false;
            }

            if (notifications.filter(X => X.typeCode === "D").length === 0) {
                messages.push("The following field is required: Notification -> Claim Diary Date");
                isValid = false;
            }
            if (!isValid) {
                request.errorMessages = messages;
                request.isProcessing = false;
                request.showErrorMessages = !isValid;
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request } });
            }
            return isValid;

        } catch (e) {
            enqueueSnackbar(e.toString(), { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });
            return false;
        }
    }
    async function loadActivityView(activityID) {
        try {
            //dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });

            let activityResult = await loadOpenActivity(activityID);
            let currentActvity = activityResult.data.activity;
            let result = {};
            if (findAcitivityTypeUIByAcitivityType(currentActvity.accountingTransTypeID) === "OPENCLAIMACTIVTY") {
                result = await loadOpenActivity(activityID);
            }
            else if (findAcitivityTypeUIByAcitivityType(currentActvity.accountingTransTypeID) === "CLOSECLAIMACTIVITY") {

                result = await loadCloseActivity(activityID);
            }
            else if (findAcitivityTypeUIByAcitivityType(currentActvity.accountingTransTypeID) === "MLASUPPRESSIONCLAIMACTIVTY") {
                result = await loadMLASuppressionsActivity(activityID);
            }
            else if (findAcitivityTypeUIByAcitivityType(currentActvity.accountingTransTypeID) === "REOPENACTIVTY") {
                result = await loadReopenActivity(activityID);
            }
            else if (findAcitivityTypeUIByAcitivityType(currentActvity.accountingTransTypeID) === "RESERVECHANGEACTIVTY") {
                result = await loadReserveChangeActivity(activityID);
            }
            else if (findAcitivityTypeUIByAcitivityType(currentActvity.accountingTransTypeID) === "SPECIALINSTRUCTIONSACTIVTY") {
                result = await loadSpecialInstructionsActivity(activityID);
            }
            else if (findAcitivityTypeUIByAcitivityType(currentActvity.accountingTransTypeID) === "EXPENSEPAYMENTCLAIMACTIVITY") {
                result = await loadPaymentActivity(activityID);
            }
            else if (findAcitivityTypeUIByAcitivityType(currentActvity.accountingTransTypeID) === "GENESISMLA") {
                result = await loadGenesisMLAActivity(activityID);
            }
            else if (findAcitivityTypeUIByAcitivityType(currentActvity.accountingTransTypeID) === "WCTABULARUPDATECLAIMACTIVITY") {
                result = await loadWCTabularUpdateActivity(activityID);
            }
            else if (findAcitivityTypeUIByAcitivityType(currentActvity.accountingTransTypeID) === "INITIALRINOTICE") {
                currentActvity.accountingTransTypeText = (currentActvity.accountingTransType || {}).accountingTransTypeText;
                return currentActvity;
            }
            else if (findAcitivityTypeUIByAcitivityType(currentActvity.accountingTransTypeID) === "DEDUCTIBLECOLLECTION") {
                currentActvity.accountingTransTypeText = (currentActvity.accountingTransType || {}).accountingTransTypeText;
                return currentActvity;
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
            enqueueSnackbar(toString(e), { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            return null;

        }

    }
    const handleNotificationDrawerOpen = () => {
        setOpenNotificationDrawer(true);
    }
    const handleNotificationDrawerClose = () => {
        SetRequestorNotificationcomment('');
        setRequestorNotificationcommentError(false);
        setOpenNotificationDrawer(false);
    }
    const onClaimProcessingInProgress = async () => {
        setAnchorEl(null);
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
        request.currentClaimActivity.claimStatusTypeID = CLAIM_STATUS_TYPE.PROCESSING_IN_PROGRESS;
        request.currentClaimActivity.taskOwner = currentUser.id;
        let activity = JSON.parse(JSON.stringify(request.currentClaimActivity));
        delete activity.workflowTask;
        const result = await saveActivity(activity);
        if ((result.data || {}).saveActivity) {
            await createActionLogForFinacialActivityType(claim.claimMasterID, ACTION_TYPES.Processing_InProgress, (result.data || {}).saveActivity.activityID);
            let currentActivity = await loadActivityView((result.data || {}).saveActivity.activityID);
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: currentActivity, isSaving: false, isProcessing: false } });
            enqueueSnackbar("Activity has been set to Processing in progress successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        } else {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
        }
    }

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
            title = request.currentClaimActivity.accountingTransTypeText + " - Flag As Issue";
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
            let notifyUser = users.filter(x => (x.userID.toLowerCase() === ((request.currentClaimActivity || {}).createdBy || "").toLowerCase() || (x.userID.toLowerCase() === (isLegalClaim ? legalClaim.claimCounselUserID.toLowerCase() : claim.claimExaminerID.toLowerCase()))));
            let _notificationUsers = [];
            notifyUser.filter(e => {
                _notificationUsers.push({ 'networkID': e.userID, "emailAddress": e.emailAddress, "firstName": e.firstName, "lastName": e.lastName, "reminderDate": null, "isCopyOnly": false, "statusCode": 'N' });
            });

            if (parseInt(tempClaimStatusTypeID) === CLAIM_STATUS_TYPE.REJECTED) {
                title = request.currentClaimActivity.accountingTransTypeText + " - Rejected";
            }
            if (parseInt(tempClaimStatusTypeID) === CLAIM_STATUS_TYPE.ERROR_PI_2) {
                title = request.currentClaimActivity.accountingTransTypeText + " - Error";
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
                relatedURL: claimOrLegal + claim.claimMasterID + '/financials#Activity/' + request.currentClaimActivity.activityID
            }
            // Saving Activity 
            request.currentClaimActivity.claimStatusTypeID = parseInt(tempClaimStatusTypeID);
            let activity = JSON.parse(JSON.stringify(request.currentClaimActivity));
            delete activity.workflowTask;
            const result = await saveActivity(activity);
            if ((result.data || {}).saveActivity) {
                createActionLogForFinacialActivityType(claim.claimMasterID, parseInt(tempActionTypeID), (result.data || {}).saveActivity.activityID);
                let currentActivity = await loadActivityView((result.data || {}).saveActivity.activityID);
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: currentActivity, isSaving: false, isProcessing: false } });
                // dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, selectedMenu: findAcitivityTypeUIByAcitivityType(-1), menusToDisplay: findMenusToDisplay(-1), isSaving: false, isProcessing: false } });
                enqueueSnackbar("Activity updated successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                setTempClaimStatusTypeID('');
            }
            //Creating Notification for Requestor 

            const notificationResult = await createNotification(notificationRequest);
            ParseGQErrors(notificationResult.errors, notificationResult.error);
            //const notificationUserID = notificationResult.data.create.notificationUsers[0].notificationUserID;
            // if(notification)
            enqueueSnackbar("Notification sent successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            SetRequestorNotificationcomment('');
            handleNotificationDrawerClose();
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

    return (
        request.isProcessing ? <Spinner /> :
            <>
                <VendorSearchDrawer open={request.openVendorSearchDrawer} onResourceSelected={request.onResourceSelected} />
                <PriorPaymentInfoSection openDrawer={request.openPriorPaymentDrawer} priorPayments={priorPaymentData} request={request} dispatch={dispatch} />
                <ErrorListDialog request={request} dispatch={dispatch} />
                <AppContainer>
                    <Toolbar>
                        <ButtonGroup variant="text">
                            {!openClaimAcivityDrawer && ShowActionMenu(request, currentUser) &&
                                <IconButton name="Actions" title="More Actions" onClick={onMenuOpen}><MenuIcon />
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
                                {ShowCreateClaimActivityMenu(request) && <MenuItem disabled={isViewer} onClick={onCreateClaimAcivity}>Create Claim Activity</MenuItem>}
                                {ShowRequestDeductibleCollectionMenu(request) && <MenuItem disabled={isViewer} onClick={onCollectDeductible}>Request Deductible Collection</MenuItem>}
                                {ShowRequestInitialRINoticebesentMenu(request) && <MenuItem disabled={isViewer} onClick={onRequestInitialRINotice}>Request Initial R/I Notice be sent</MenuItem>}
                                {ShowCheckFacDatabaseforRIMenu(request) && !isViewer && claim.fALClaimStatusTypeID !== FAL_CLAIM_STATUS_TYPES.ERROR && claim.fALClaimStatusTypeID !== FAL_CLAIM_STATUS_TYPES.CLOSED && <Link href={!isViewer ? facReinsuranceURL : '#'} target={!isViewer ? "_blank" : ''} ><MenuItem disabled={isViewer || claim.fALClaimStatusTypeID === 27 || claim.fALClaimStatusTypeID === 2 } onClick={onCheckFacDataForRI}>Check Fac Database for R/I</MenuItem></Link>}
                                {ShowManuallyAddVendorMenu(request) && <MenuItem disabled={isViewer} onClick={onAddVendor}>Manually Add Vendor</MenuItem>}
                                {ShowSearchVendorMenu(request) && <MenuItem disabled={isViewer} onClick={onSearchVendor}>Search Vendor</MenuItem>}
                                {ShowAuthorityCheckMenu(request) && <MenuItem disabled={isViewer} onClick={onActivityAuthorityCheck}>Check Authority</MenuItem>}
                                {ShowProcessingInProgressMenu(request) && <MenuItem disabled={isViewer} onClick={onClaimProcessingInProgress} >Processing In-Progress</MenuItem>}
                                {ShowProcessingCompleteMenu(request) && <MenuItem disabled={isViewer} onClick={onActivityProcessingCompleted}>Processing Complete</MenuItem>}
                                {ShowReinsuranceProcessingRequiredMenu(request) && <MenuItem disabled={isViewer} onClick={onActivityReinsuranceProcessingRequired} >Reinsurance Processing Required</MenuItem>}
                                {ShowFlagAsIssueMenu(request) && <MenuItem disabled={isViewer} onClick={onActivityFlagAsIssue} >Flag As Issue</MenuItem>}
                                {ShowFlagAsIssueMenu(request) && <MenuItem disabled={isViewer} onClick={onActivityQAPending} >Flag as QA Pending</MenuItem>}
                                {ShowRejectedMenu(request) && <MenuItem disabled={isViewer} onClick={onActivityRejected} >Rejected</MenuItem>}
                                {ShowErrorMenu(request) && <MenuItem disabled={isViewer} onClick={onActivityError}>Error</MenuItem>}
                                {ShowApproveMenu(request, currentUser) && <MenuItem disabled={isViewer} onClick={onActivityApprove}>Approve</MenuItem>}
                                {ShowRejectMenu(request, currentUser) && <MenuItem disabled={isViewer} onClick={onActivityReject}>Reject</MenuItem>}
                                {ShowCompletedMenu(request) && <MenuItem disabled={isViewer} onClick={onActivityCompleted}>Completed</MenuItem>}
                                {ShowSetStatustoInprogressMenu(request) && <MenuItem disabled={isViewer} onClick={onActivityInProgress}>Set Status to In-progress</MenuItem>}
                                {ShowCheckforpriorpaymentMenu(request) && <MenuItem disabled={isViewer} onClick={onCheckPriorClaimPayment}>Check for prior payment</MenuItem>}
                                {ShowSubmittoCEforApprovalMenu(request) && <MenuItem disabled={isViewer} onClick={onActivitySubmitToCE}>Submit to CE for Approval</MenuItem>}
                                {ShowRequestVendorsetupMenu(request) && <MenuItem disabled={isViewer} onClick={onActivityRequestVendorSetup}>Request Vendor set up</MenuItem>}
                                {ShowSetStatustoVendorsetupcompletedMenu(request) && <MenuItem disabled={isViewer} onClick={onActivityVendorSetupComplete}>Set Status to Vendor set up completed</MenuItem>}
                                {ShowSetStatustoAlreadyPaidMenu(request) && <MenuItem disabled={isViewer} onClick={onActivityStatusAlreadyPaid}>Set Status to Already Paid</MenuItem>}
                                {ShowSubmitMenu(request) && <MenuItem disabled={isViewer} onClick={onAcivitySubmit}>Submit</MenuItem>}
                                {ShowSave(request, currentUser) && <MenuItem disabled={isViewer} onClick={onActivitySave}>Save</MenuItem>}
                                {ShowApproveMLA(request, currentUser) && <MenuItem disabled={isViewer} onClick={onActivityApproveMLA}>Approve and Distribute</MenuItem>}
                                {ShowSupressMLA(request, currentUser) && <MenuItem disabled={isViewer} onClick={onclickActivitySuppressMLA}>Suppress MLA</MenuItem>}
                                {ShowSaveAsDraft(request) && <MenuItem disabled={isViewer} onClick={onActivitySaveAsDraft}>Save As Draft</MenuItem>}
                                {ShowSubmitForApproval(request) && <MenuItem disabled={isViewer} onClick={onActivitySubmitForApproval}>Submit For Approval</MenuItem>}
                                {ShowVoidMenu(request) && <MenuItem disabled={isViewer} onClick={onAcivityStatusVoid}>Void</MenuItem>}
                            </Menu>
                            {request.currentClaimActivity && <IconButton name="Cancel" title="Cancel" onClick={onClaimAcivityDrawerClose}><Cancel /></IconButton>}
                            {/** <IconButton name="Help" title="Help" onClick={onHelpDrawerOpen}><HelpOutline /></IconButton> */}
                        </ButtonGroup>
                        {request.isSaving && <CircularProgress color="primary" size={20} style={{ marginRight: 10 }} />}
                    </Toolbar>
                    <TabContainer>
                        <ContentRow>
                            <ContentCell width="78%" >
                                <InfoSectionSelector claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} onSave={onFinancialSave} onPaymentClaimActivityDraft={onPaymentClaimActivityDraft} onPaymentClaimActivityCompleted={onActivityCompleted} db2Claim={db2Claim} financialDB2={financialDB2} lossExpenseReserve={lossExpenseReserve} currentUser={currentUser} />
                            </ContentCell>
                            <ContentCell width="22%" style={{ justifyContent: "flex-start", alignItems: "flex-start" }}>
                                <AccountingMenu request={request} dispatch={dispatch} formValidator={formValidator} claim={claim} />
                            </ContentCell>
                        </ContentRow>
                        <AlertDialogSlide open={openAlertDialogSlide} onNo={onAlertDialogSlideClose} dialogTitle={"Confirm"} dialog={"Are you sure, You wish to suppress this MLA?"} onYes={onActivitySuppressMLA} />
                    </TabContainer>
                </AppContainer>
                <HelpDrawer open={openHelpDrawer} onClose={onHelpDrawerClose} containerName={request.helpContainerName} key={request.helpContainerName} />
                <ClaimActivityDrawer open={openClaimAcivityDrawer} claim={claim} onClose={onClaimAcivityDrawerClose} onNext={onClaimAcivityDrawerNext} request={request} dispatch={dispatch} formValidator={formValidator} db2Claim={db2Claim} financialDB2={financialDB2} lossExpenseReserve={lossExpenseReserve} />
                <ApproverSelectionDrawer open={request.openApproverSelectionDrawer} onClose={onApproverSelectionDrawerClose} onNext={onApproverSelectionDrawerNext} request={request} dispatch={dispatch} formValidator={formValidator} />
                <AccountingSelectionDrawer open={request.openAccountingSelectionDrawer} onClose={onAccountingSelectionDrawerClose} onNext={onAccountingSelectionDrawerNext} request={request} dispatch={dispatch} formValidator={formValidator} />
                <CollectDeductibleDrawer open={openCollectDeductibleDrawer} onSubmit={onCollectDeductibleSubmit} onClose={onCollectDeductibleDrawerClose} formValidator={formValidator} />
                <RequestInitialRINoticeDrawer open={openRequestInitialRi} onSubmit={onRequestIntialRINoticeSubmit} onClose={onRequestInitialRINoticeDrawerClose} formValidator={formValidator} />

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
