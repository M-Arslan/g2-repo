import {
    IconButton,
    ButtonGroup,
    Fade,
    Menu,
    MenuItem,
    Drawer,
    Button,
} from '@mui/material';
import {
    ChevronLeft,
    Menu as MenuIcon
} from '@mui/icons-material';
import React from 'react';
import styled from 'styled-components';
import { AppContainer, TabContainer } from '../../../Claim/Tabs/TabContainer';
import {
    AssociatePoliciesSection
} from '../AssociatePolicies/AssociatePoliciesSection';
import { AssociativePoliciesDrawerForm } from '../AssociatePolicies/AssociativePoliciesDrawer/AssociativePoliciesDrawerForm';
import { SearchPolicyDrawer } from './AssociativePoliciesDrawer/SearchPolicyDrawer';
import {
    ASYNC_STATES
} from '../../../../Core/Enumerations/redux/async-states';
import { useDispatch, useSelector } from 'react-redux';
import {
    associatedPolicyContractSelectors,
    associatedPolicyContractActions,
    associatedPolicyDeleteActions,
    associatedPolicyActions,
    associatedPolicySelectors,
    associatedPolicyDeleteSelectors
} from "../../../../Core/State/slices/associated-policy-contracts";
import { useParams } from 'react-router-dom';

import { useForm } from "react-hook-form";
import {
    claimActions,
} from '../../../../Core/State/slices/claim';

import {
    useSnackbar
} from 'notistack';
import {
    makeStyles
} from '@mui/styles';
import {
    useAppHost
} from '../../../../Layout/Claim/Tabs/AppHost';
import { companiesActions, companiesSelectors } from '../../../../Core/State/slices/metadata/companies';
import { COMPANY_NAME } from '../../../../Core/Enumerations/app/company-name';

const drawerWidth = 600;

const useStyles = makeStyles((theme) => ({
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
}));

const DrawerMain = styled.main`
    width: 100%;
    height: calc(100% - ${(props => props.hasFooter ? '90' : '45')}px);

    padding: 0;
    margin: 0;
    border: 0;

    overflow-x: hidden;
    overflow-y: hidden;

    display: flex;
    flex-flow: column nowrap;
`;

const DrawerFooter = styled.footer`
    width: 100%;
    height: 45px;
    position: relative;
    background-color: #bdc3c7;
    padding: 0 1em;

    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    align-content: center;
    align-items: center;
    border-top: #c0c0c0;

    & > * {
        margin-left: 1em;
    }
`;
const DrawerContent = styled.article`
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
    border: 0;

    display: flex;
    flex-flow: column nowrap;
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


export const AssociatePoliciesTab = ({ claim }) => {
    let { id } = useParams();
    const $host = useAppHost();
    const isViewer = $host.isViewer || $host.appIsReadonly;

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    let $dispatch = useDispatch();
    const reducer = (state, action) => {
        switch (action.type) {
            case 'UPDATE_UNIVERSAL_REQUEST':
                return Object.assign({}, state, action.request);
            default:
                return state;
        }
    };
    const classes = useStyles();

    // Async States Here 
    const PolicyContractsListState = useSelector(associatedPolicyContractSelectors.selectLoading());
    const CompanyNameState = useSelector(companiesSelectors.selectLoading());
    const associatedPolicyState = useSelector(associatedPolicySelectors.selectLoading());
    const associatedPolicyContractState = useSelector(associatedPolicyContractSelectors.selectLoading());
    const associatedPolicyDeleteState = useSelector(associatedPolicyDeleteSelectors.selectLoading());
    const policyContracts = useSelector(associatedPolicyContractSelectors.selectData()) || [];
    const formValidator = useForm();
    const { trigger, clearErrors } = formValidator;
 
    const isProcessing = associatedPolicyState === ASYNC_STATES.WORKING
        || PolicyContractsListState === ASYNC_STATES.WORKING
        || associatedPolicyDeleteState === ASYNC_STATES.WORKING
        || associatedPolicyContractState === ASYNC_STATES.WORKING
        || CompanyNameState === ASYNC_STATES.WORKING;

    const titles = ['GENERALSTAR', 'GENESIS'];

    const { enqueueSnackbar } = useSnackbar();

    const initialState = {
        currentAssociatedPolicy: null,
        othersDrawerOpen : false,
        isProcessing: isProcessing,
        isSaving: false,
        editMode: false,
        errorMessages: [],
        showErrorMessages: false,
        selectedMenu: "",
        searchMode:false
    };

    const [request, dispatch] = React.useReducer(reducer, initialState);

    const onMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const onMenuClose = () => {
        setAnchorEl(null);
    }; 
    const handleShowAssociativeRightDrawer = (payload) => {
        setOpen(true);
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, selectedMenu: payload } });
        setAnchorEl(null)
    };

    const onAddNew = (res) => {
        const duplicate = policyContracts?.length ? res?.result?.filter((i) => {
            return policyContracts.find((j) => {
                return i.policyID === j.policyID;
            })
        }) : null;
        if (duplicate?.length > 0) {
            enqueueSnackbar(`The Associated Policies/Contracts can't be duplicated`, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } })
            return
        }
        if (res.result) {
            let currentContract = res.result[0];
            currentContract.isPrimary= policyContracts.length === 0
            currentContract.cancelledDate = currentContract.cancelDate;
            delete currentContract.cancelDate;
            dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentAssociatedPolicy: currentContract, othersDrawerOpen: true, editMode: false, searchMode:true } });
        }
        setOpen(false);
    };
    /***************************************************************************/
    /********************** DRAWER FUNCTIONS ***********************************/
    /***************************************************************************/

    const onSave = async () => {
        
        if (await validate(trigger, request.currentAssociatedPolicy) === false) {
            return;
        }

        if (!request.currentAssociatedPolicy.hasOwnProperty('isPrimary')) {
            request.currentAssociatedPolicy.isPrimary = false;
        }

        if (typeof (request.currentAssociatedPolicy.g2CompanyNameID) === 'string') {
            let CID = parseInt(request.currentAssociatedPolicy.g2CompanyNameID);
            request.currentAssociatedPolicy.g2CompanyNameID = CID;
        }

        request.currentAssociatedPolicy.claimMasterID = claim.claimMasterID;    

        $dispatch(associatedPolicyActions.save({ associatedPolicy: request.currentAssociatedPolicy }));
    }
    const titleChecker = (payload) => {
        //return payload == "GENESIS" ? "Genesis" : "General Star";
        if (payload === "GENERALSTAR")
            return "General Star";
        else if (payload === "GENESIS")
            return "Genesis";
        return "Other";
    }

    /***************************************************************************/
    /***************************************************************************/

    React.useEffect(() => {

        if (request.currentAssociatedPolicy && associatedPolicyState === ASYNC_STATES.SUCCESS) {
            enqueueSnackbar("Associated Policy has been saved successfully.", { variant: 'success',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            if (request.currentAssociatedPolicy.isPrimary) {
                $dispatch(claimActions.save({ claim: { ...claim, insuredName: request.currentAssociatedPolicy.insuredName } }));
            }

            $dispatch(associatedPolicyActions.clearStatus());
            $dispatch(associatedPolicyContractActions.getList({ claimMasterID: claim.claimMasterID || id, onlyLoadPrimary: false  }));
            dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentAssociatedPolicy: null, editMode: false, othersDrawerOpen: false, } });
        }

        else if (associatedPolicyState === ASYNC_STATES.ERROR) {
            enqueueSnackbar("An error occured", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }

        if (associatedPolicyDeleteState === ASYNC_STATES.SUCCESS) {
            enqueueSnackbar("Associated Policy has been deleted successfully.", { variant: 'success',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            $dispatch(associatedPolicyDeleteActions.clearStatus());
            $dispatch(associatedPolicyContractActions.getList({ claimMasterID: claim.claimMasterID || id, onlyLoadPrimary: false   }));
            dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentAssociatedPolicy: null, editMode: false, othersDrawerOpen: false } });
        }

        else if (associatedPolicyDeleteState === ASYNC_STATES.ERROR) {
            enqueueSnackbar("An error occured", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }

        if (PolicyContractsListState === ASYNC_STATES.IDLE) {
            $dispatch(associatedPolicyContractActions.getList({ claimMasterID: claim.claimMasterID || id, onlyLoadPrimary: false }));
        }
        if (CompanyNameState === ASYNC_STATES.IDLE) {
            $dispatch(companiesActions.get()); 
        }

    }, [isProcessing]);

    const onDrawerClose = () => {
        clearErrors(['coverage']);
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentAssociatedPolicy: null, othersDrawerOpen: false, selectedMenu: "", searchMode: false } })
    }

    return (
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
                            <MenuItem onClick={() => handleShowAssociativeRightDrawer(titles[0])}>Search Associated Policy General Star </MenuItem>
                            <MenuItem onClick={() => handleShowAssociativeRightDrawer(titles[1])}>Search Assoicated Policy/ Contract Genesis</MenuItem>
                            <MenuItem onClick={() => { setAnchorEl(null); dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentAssociatedPolicy: { isPrimary: policyContracts.length === 0 }, othersDrawerOpen: true, editMode: false, searchMode: false, selectedMenu: "OTHER" } }) }}>Add Associated Policy Other</MenuItem>
                        </Menu>
                    </ButtonGroup>
                </Toolbar>
                <TabContainer>
                    <ContentRow>
                        <ContentCell width="100%" >
                            <AssociatePoliciesSection claim={claim} request={request} dispatch={dispatch} />
                        </ContentCell>
                    </ContentRow>
                </TabContainer>
                {/*       <AssociativePoliciesDrawer claim={claim} request={request} dispatch={dispatch} isProcessing={isProcessing} associatedPolicyState={associatedPolicyState} />*/}
                
                {/**************************************************************************************************************************/}

                <Drawer
                    className={classes.drawer}
                    anchor="left"
                    open={request.othersDrawerOpen}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <DrawerContent>
                        <div className={classes.drawerHeader}>
                            <IconButton className={classes.buttonClass} name="arrowchevron_right" onClick={onDrawerClose}>
                                <ChevronLeft />
                            </IconButton>
                            {"Associated Policy Detail - " + titleChecker(request.selectedMenu)}
                        </div>
                        <DrawerMain>
                            <AssociativePoliciesDrawerForm request={request} dispatch={dispatch} formValidator={formValidator } />
                        </DrawerMain>
                        <DrawerFooter>
                            <Button onClick={onDrawerClose} >
                                Cancel
                    </Button>
                            <Button onClick={onSave}>
                                Submit
                    </Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>

                {/**************************************************************************************************************************/}
                <SearchPolicyDrawer open={open} request={request} dispatch={dispatch} onPolicySelected={onAddNew} claim={claim}  />
            </AppContainer>
      
        </>
    );
}

export const validate = async (triggerValidation, currentAssociatedPolicy) => {
    let isValid = true, result = true;
    if (!currentAssociatedPolicy.g2CompanyNameID) {
        result = await triggerValidation("g2CompanyNameID");
        if (!result)
            isValid = result;
    }
    if (currentAssociatedPolicy.isPrimary) {
        result = await triggerValidation("coverage");
        if (!result)
            isValid = result;
    }
    if (currentAssociatedPolicy.g2CompanyNameID == COMPANY_NAME.OTHER) {
        result = await triggerValidation("insuredName");
        if (!result)
            isValid = result;
    }
    return isValid;
}
