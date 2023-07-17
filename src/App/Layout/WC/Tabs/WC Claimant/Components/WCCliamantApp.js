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
import {
    ASYNC_STATES
} from '../../../../../Core/Enumerations/redux/async-states';
import { makeStyles } from '@mui/styles';
import { useSnackbar } from 'notistack';
import React from 'react';
import { userSelectors } from '../../../../../Core/State/slices/user';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { AppContainer, TabContainer } from '../../../../../Layout/Claim/Tabs/TabContainer';
import { WCClaimantActions, WCClaimantSelectors, WCClaimantSaveSelectors, WCClaimantSaveActions, WCClaimantListSelectors, WCClaimantListActions } from '../../../../../Core/State/slices/wc-claimant'
import { InfoSectionSelector } from './InfoSectionSelector';
import { WCClaimantListSection } from './WCClaimantListSection';
import { WCClaimantInfoSection } from './WCClaimantInfoSection';
import { WCClaimantMenu } from './WCClaimantMenu';
import { claimSelectors } from '../../../../../Core/State/slices/claim';
import { ConfirmationDialog, SelectList, Spinner, UserInputDialog } from '../../../../../Core/Forms/Common';
import { FAL_CLAIM_STATUS_TYPES } from '../../../../../Core/Enumerations/app/fal_claim-status-types';
import { APP_TYPES } from '../../../../../Core/Enumerations/app/app-types';
import { ROLES } from '../../../../../Core/Enumerations/security/roles';
import { validateWCClaimant } from '../Validations/validateWCClaimant';


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
export const WCClaimantApp = () => {
    const claim = useSelector(claimSelectors.selectData());
    const $auth = useSelector(userSelectors.selectAuthContext());
    let $dispatch = useDispatch();

    const wcClaimantState = useSelector(WCClaimantSelectors.selectLoading());
    const wcClaimant = useSelector(WCClaimantSelectors.selectData());

    const wcClaimantSaveState = useSelector(WCClaimantSaveSelectors.selectLoading());
    const wcClaimantSave = useSelector(WCClaimantSaveSelectors.selectData());

    const wcClaimantListState = useSelector(WCClaimantListSelectors.selectLoading());
    const wcClaimantList = useSelector(WCClaimantListSelectors.selectData());

    const isViewer = claim.fALClaimStatusTypeID === FAL_CLAIM_STATUS_TYPES.CLOSED || claim.fALClaimStatusTypeID === FAL_CLAIM_STATUS_TYPES.ERROR || $auth.isReadOnly(APP_TYPES.Cliamant);
    const formValidator = useForm();
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();

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
        claimants: [],
        isProcessing: true,
        isSaving: false,
        editMode: false,
        addressStates: [],
        errorMessages: [],
        showErrorMessages: false,
        helpContainerName: 'WCClaimants',
        selectedMenu: ""
    };

    const [request, dispatch] = React.useReducer(reducer, initialState);
    const [anchorEl, setAnchorEl] = React.useState(null);

    React.useEffect(() => {
        if (wcClaimantListState === ASYNC_STATES.IDLE) {
            $dispatch(WCClaimantListActions.list({ claimMasterID: claim.claimMasterID }));
        }
        return () => {
            $dispatch(WCClaimantSaveActions.clearStatus());
        }

    }, []);

    React.useEffect(() => {
        if (wcClaimantState === ASYNC_STATES.SUCCESS) {
            $dispatch(WCClaimantActions.clearStatus());
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, originalClaimant: JSON.parse(JSON.stringify(wcClaimant)), currentClaimant: JSON.parse(JSON.stringify(wcClaimant)), editMode: true, isProcessing: false, isSaving: false } });
        } else if (wcClaimantState === ASYNC_STATES.ERROR) {
            $dispatch(WCClaimantActions.clearStatus());
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });
        }

    }, [wcClaimantState]);
    React.useEffect(() => {
        if (wcClaimantSaveState === ASYNC_STATES.SUCCESS) {
            if (request.isProcessing) {
                enqueueSnackbar("Claimant information has been saved successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                $dispatch(WCClaimantActions.get({ wCClaimantID: wcClaimantSave.wCClaimantID }));
            } else {
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, originalClaimant: JSON.parse(JSON.stringify(request.currentClaimant)), isSaving: false, isProcessing: false } });
            }
        } else if (wcClaimantSaveState === ASYNC_STATES.ERROR) {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
            enqueueSnackbar("Unable to save claimant information.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }, [wcClaimantSaveState]);
    React.useEffect(() => {
        if (wcClaimantListState === ASYNC_STATES.SUCCESS && window.location.href.toLowerCase().indexOf("activity") === -1) {
            let list = JSON.parse(JSON.stringify(wcClaimantList));

            list.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false, editMode: false, claimants: list, originalClaimant: {}, currentClaimant: {}, helpContainerName: 'WCClaimants' } });

        } else if (wcClaimantListState === ASYNC_STATES.ERROR) {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });
        }

    }, [wcClaimantListState]);
    const onNewClicked = () => {
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, originalClaimant: {}, currentClaimant: {}, editMode: true, selectedMenu: "WCCLAIMANT", helpContainerName: 'Claimant Details' } });
    }

    const onSaveClicked = async () => {
        setAnchorEl(null);
        let isValid = true;
        const { currentClaimant } = request;
        if (JSON.stringify(request.currentClaimant) == '{}') {
            enqueueSnackbar("Unable to Save Empty Claimant Information", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
        if (JSON.stringify(request.originalClaimant) === JSON.stringify(request.currentClaimant))
            return;
        let isReloadRequired = false;

        if (request.selectedMenu === "WCCLAIMANT" && !request.currentClaimant.wCClaimantID)
            isReloadRequired = true;

        if (isValid)
            isValid = await validate();

        if (currentClaimant && currentClaimant.tabularEndDate && currentClaimant.tabularStartDate) {
            if (currentClaimant && (new Date(currentClaimant.tabularEndDate).getTime() < new Date(currentClaimant.tabularStartDate).getTime())) {
                enqueueSnackbar("Tabular end date can not be previous than tabular start date", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }
        }
        
        if (isValid) {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: isReloadRequired } });
            try {
                request.currentClaimant.claimMasterID = claim.claimMasterID;
                const result = await $dispatch(WCClaimantSaveActions.save({ wcClaimant: request.currentClaimant }));
                if (!result?.error) {
                    // enqueueSnackbar("Claimant information has been saved successfully 2.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                }
            } catch (e) {
                // enqueueSnackbar("Unable to save claimant information.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
            }

        }
    }

    const onCancelClicked = () => {
        setAnchorEl(null);
        window.history.pushState("", "", '/claim/' + claim.claimMasterID + '/wCClaimants');
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: true } });
        $dispatch(WCClaimantListActions.list({ claimMasterID: claim.claimMasterID }));
    }
    const onMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const onMenuClose = () => {
        setAnchorEl(null);
    };
    const validate = async () => {
        let isValid = true;
        if (request.selectedMenu === "WCCLAIMANT") {
            isValid = await validateWCClaimant(formValidator.trigger);
        }
        return isValid;
    }
    return (
        request.isProcessing ? <Spinner /> :
        <>
            <ErrorListDialog request={request} dispatch={dispatch} />
            <Backdrop className={classes.backdrop} open={false}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <AppContainer>{wcClaimantListState !== ASYNC_STATES.WORKING ?
                <Toolbar>
                    <ButtonGroup variant="text">
                        {request.editMode === false && 
                                <IconButton name="New" title="New Claimant" onClick={onNewClicked} ><PostAdd /></IconButton>}
                            {request.editMode && <IconButton name="Cancel" title="Go Back" onClick={onCancelClicked}><ArrowBack /></IconButton>}
                        {request.editMode &&  <IconButton name="Actions" title="More Actions" onClick={onMenuOpen}><MenuIcon /></IconButton>}
                        <Menu
                            id="simple-menu"
                            keepMounted
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={onMenuClose}
                        >
                            <MenuItem onClick={onSaveClicked}>Save</MenuItem>
                            <MenuItem onClick={onCancelClicked}>Cancel</MenuItem>

                        </Menu>
                    </ButtonGroup>
                    {request.isSaving && <CircularProgress color="primary" size={20} style={{ marginRight: 10 }} />}
                </Toolbar>
                : null}
                <TabContainer>
                    {request.editMode && wcClaimantListState !== ASYNC_STATES.WORKING ?
                        <ContentRow>
                            <ContentCell width="80%" >
                                <InfoSectionSelector claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} onSave={onSaveClicked}  />
                            </ContentCell>
                            <ContentCell width="20%" style={{ justifyContent: "flex-start", alignItems: "flex-start" }}>
                                <WCClaimantMenu request={request} dispatch={dispatch} formValidator={formValidator} claim={claim} />
                            </ContentCell>
                        </ContentRow>
                        :
                        <ContentRow>
                            <ContentCell width="100%">
                                    <WCClaimantListSection request={request} dispatch={ dispatch} />
                            </ContentCell>
                        </ContentRow>
                    }
                </TabContainer>
            </AppContainer>
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