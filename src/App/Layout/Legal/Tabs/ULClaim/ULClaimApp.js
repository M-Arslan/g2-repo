import {
    IconButton,
    ButtonGroup,
    CircularProgress,
    Fade,
    Menu,
    MenuItem
} from '@mui/material';
import {
    Cancel,
    Menu as MenuIcon
} from '@mui/icons-material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Spinner } from '../../../../Core/Forms/Common';
import {
    useSnackbar
} from 'notistack';
import { useForm } from "react-hook-form";

import {
    ULClaimActions,
    ULClaimSelectors,
    ULClaimsActions,
    ULClaimsSelectors,
    ULClaimDeleteActions,
    ULClaimDeleteSelectors,
    FormOfCoverageActions,
    FormOfCoverageSelectors
} from "../../../../Core/State/slices/ULClaims";
import {
    claimExaminerActions,
    claimExaminerSelectors
} from '../../../../Core/State/slices/metadata/claim-examiners';
import {
    usersActions,
    usersSelectors
} from '../../../../Core/State/slices/users';
import {
    riskStatesActions,
    riskStatesSelectors
} from '../../../../Core/State/slices/metadata/risk-states';
import {
    companiesActions,
    companiesSelectors,
    
} from '../../../../Core/State/slices/metadata/companies';
import {
    claimStatusTypeActions,
    claimStatusTypeSelectors
} from '../../../../Core/State/slices/metadata/claim-status-types';


import { AppContainer, TabContainer } from '../../../Claim/Tabs/TabContainer';
import {
    ULClaimInfoSection
} from './Components/ULClaimInfoSection';
import {
    ULClaimListSection
} from './Components/ULClaimListSection';
import {
    ASYNC_STATES
} from '../../../../Core/Enumerations/redux/async-states';
import {
    useAppHost
} from '../../../../Layout/Claim/Tabs/AppHost';
import {
    COMPANY_NAME
} from '../../../../Core/Enumerations/app/company-name';

const ContentRow = styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
`;
//const ScrollPanel = styled.div`
//    height: calc(100% - 85px - 45px);
//    width: 100%;
//    padding: 0;
//    margin: 0;
//    border: 0;
//    overflow-x: hidden;
//    overflow-y: auto;
//`;

//const InputPanel = styled.div`
//    display: flex;
//    flex-flow: column nowrap;
//    justify-content: space-around;
//    align-content: flex-start`;

const ContentCell = styled.div`
    width: ${props => props.width || '50%'};
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
    padding: .5em;
`;
//const FieldContainer = styled.div`
//    width: 100%;
//    height: 50px;
//    padding: .50em 1em;
//    margin-bottom: 1em;
//`;

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


export const ULClaimApp = ({ claim }) => {
    let { id } = useParams();
    let $dispatch = useDispatch();
    const $host = useAppHost();
    const isViewer = $host.isViewer || $host.appIsReadonly;

    const { enqueueSnackbar } = useSnackbar();
    const formValidator = useForm();
    const { trigger } = formValidator;


    const claimDetailState = useSelector(ULClaimSelectors.selectLoading());
    const claimListState = useSelector(ULClaimSelectors.selectLoading());
    const claimExaminerState = useSelector(claimExaminerSelectors.selectLoading());
    const riskStatesState = useSelector(riskStatesSelectors.selectLoading());
    const companiesState = useSelector(companiesSelectors.selectLoading());
    const claimStatusTypeState = useSelector(claimStatusTypeSelectors.selectLoading());
    const claimDeleteState = useSelector(ULClaimDeleteSelectors.selectLoading());
    const usersState = useSelector(usersSelectors.selectLoading());
    const formOfCoverageState = useSelector(FormOfCoverageSelectors.selectLoading());
    const ulClaims = useSelector(ULClaimsSelectors.selectData()) || [];

    const isProcessing = claimDetailState === ASYNC_STATES.WORKING
        || claimListState === ASYNC_STATES.WORKING
        || claimExaminerState === ASYNC_STATES.WORKING
        || riskStatesState === ASYNC_STATES.WORKING
        || companiesState === ASYNC_STATES.WORKING
        || claimStatusTypeState === ASYNC_STATES.WORKING
        || claimDeleteState === ASYNC_STATES.WORKING;


    const [anchorEl, setAnchorEl] = React.useState(null);
    const reducer = (state, action) => {
        switch (action.type) {
            case 'UPDATE_UNIVERSAL_REQUEST':
                return Object.assign({}, state, action.request);
            default:
                return state;
        }
    };

    const initialState = {
        currentULClaim: null,
        isProcessing: isProcessing,
        isSaving: false,
        editMode: false,
        errorMessages: [],
        showErrorMessages: false,
    };

    const [request, dispatch] = React.useReducer(reducer, initialState);

    React.useEffect(() => {
        if (claimListState === ASYNC_STATES.IDLE)
            $dispatch(ULClaimsActions.getList({ claimMasterID: id, onlyLoadPrimary:false }));
        if (claimExaminerState === ASYNC_STATES.IDLE)
            $dispatch(claimExaminerActions.get());
        if (riskStatesState === ASYNC_STATES.IDLE)
            $dispatch(riskStatesActions.get());
        if (companiesState === ASYNC_STATES.IDLE)
            $dispatch(companiesActions.get());
        if (claimStatusTypeState === ASYNC_STATES.IDLE)
            $dispatch(claimStatusTypeActions.get());
        if (usersState === ASYNC_STATES.IDLE)
            $dispatch(usersActions.getAllUsers());
        if (formOfCoverageState === ASYNC_STATES.IDLE)
            $dispatch(FormOfCoverageActions.getList());
        
        if (request.currentULClaim && claimDetailState === ASYNC_STATES.SUCCESS) {
            enqueueSnackbar("UL Claim infomation has been saved successfully.", { variant: 'success',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            $dispatch(ULClaimActions.clearStatus());
            $dispatch(ULClaimsActions.getList({ claimMasterID: id, onlyLoadPrimary: false }));
            dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentULClaim: null, editMode: false } });
        }
        else if (claimDetailState === ASYNC_STATES.ERROR) {
            enqueueSnackbar("An error occured", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            $dispatch(ULClaimActions.clearStatus());
            $dispatch(ULClaimsActions.getList({ claimMasterID: id, onlyLoadPrimary: false }));
            dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentULClaim: null, editMode: false } });
        }

        if (claimDeleteState === ASYNC_STATES.SUCCESS) {
            enqueueSnackbar("UL Claim has been deleted successfully.", { variant: 'success',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            $dispatch(ULClaimDeleteActions.clearStatus());
            $dispatch(ULClaimsActions.getList({ claimMasterID: id, onlyLoadPrimary: false  }));
            dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentULClaim: null, editMode: false } });

        }
        else if (claimDeleteState === ASYNC_STATES.ERROR)
        {
            enqueueSnackbar("An error occured", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            $dispatch(ULClaimActions.clearStatus());
            $dispatch(ULClaimsActions.getList({ claimMasterID: id, onlyLoadPrimary: false }));
            dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentULClaim: null, editMode: false } });
        }

    }, [isProcessing])


    const onMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const onMenuClose = () => {
        setAnchorEl(null);
    };
    const onCreate = () => {
        setAnchorEl(null);
        if (ulClaims.length === 0) {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentULClaim: { claimMasterID: claim.claimMasterID, isPrimary:true }, editMode: true, isSaving: false, isProcessing: false } });
        }
        else
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentULClaim: { claimMasterID: claim.claimMasterID }, editMode: true, isSaving: false, isProcessing: false } });

    };
    const onSave = async () => {

        if (request.currentULClaim.retroDate) {
            request.currentULClaim.retroDate = new Date(request.currentULClaim.retroDate).toISOString();
        }
        if (request.currentULClaim.dOL) {
            request.currentULClaim.dOL = new Date(request.currentULClaim.dOL).toISOString();
        }
        request.currentULClaim.deductible = parseFloat(request.currentULClaim.deductible);
        setAnchorEl(null);

        if (!request.currentULClaim.lossLocation && !request.currentULClaim.lossLocationOutsideUSA) {
            enqueueSnackbar("Please select State/Location of Loss or Location Outside USA", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            return;
        }
        if (request.currentULClaim.g2CompanyNameID === COMPANY_NAME.OTHER && request.currentULClaim.isPrimary) {
            enqueueSnackbar("Company Other claim cannot be a primary claim.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            return;
        }
        if (!request.currentULClaim.ulClaimID && ulClaims.length === 0) 
            request.currentULClaim.isPrimary = true;

        if (await validateULClaim(trigger)) {
            $dispatch(ULClaimActions.save({ ulClaim: request.currentULClaim }));
        }

    };
    const onCancel = () => {
        setAnchorEl(null);
        $dispatch(ULClaimActions.clearStatus())
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentULClaim:null, editMode: false, isSaving: false, isProcessing: false } });
    };
    return (
        isProcessing ? <Spinner /> :
            <> 
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
                                {!request.editMode && 
                                    <MenuItem onClick={onCreate}>Create U/L Claim</MenuItem>
                                }
                                {request.editMode && 
                                    <MenuItem onClick={onSave}>Submit</MenuItem>
                                }
                            </Menu>
                            {request.editMode && 
                                <IconButton name="Cancel" title="Cancel" onClick={onCancel} ><Cancel /></IconButton>
                            }
                        </ButtonGroup>
                        {request.isSaving &&
                            <CircularProgress color="primary" size={20} style={{ marginRight: 10 }} />
                        }
                    </Toolbar>
                    <TabContainer>
                        {request.editMode &&
                            <ContentRow>
                                <ContentCell width="100%" >
                                <ULClaimInfoSection claim={claim} request={request} dispatch={dispatch} formValidator={formValidator}/>
                                </ContentCell>
                            </ContentRow>
                        }
                        {!request.editMode &&
                            <ContentRow>
                                <ContentCell width="100%" >
                                <ULClaimListSection claim={claim} request={request} dispatch={dispatch}/>
                                </ContentCell>
                            </ContentRow>
                        }
                    </TabContainer>
                </AppContainer>
            </>
        );


}


export const validateULClaim = async (triggerValidation) => {
    let isULClaimValid = true, result = true;

    result = await triggerValidation("claimID");
    if (!result)
        isULClaimValid = result

    result = await triggerValidation("dOL");
    if (!result)
        isULClaimValid = result

    return isULClaimValid;

}
