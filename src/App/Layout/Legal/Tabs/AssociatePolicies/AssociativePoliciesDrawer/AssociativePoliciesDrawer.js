import {
    ChevronLeft
} from '@mui/icons-material';
import {
    Button, Drawer,
    IconButton
} from '@mui/material';
import {
    makeStyles
} from '@mui/styles';
import {
    useSnackbar
} from 'notistack';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import {
    associatedPolicyActions, associatedPolicyContractSelectors,
    associatedPolicySelectors
} from "../../../../../Core/State/slices/associated-policy-contracts";
import { AssociativePoliciesDrawerForm } from './AssociativePoliciesDrawerForm';

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

export const AssociativePoliciesDrawer = ({ claim, request, dispatch }) => {
    const classes = useStyles();
    let $dispatch = useDispatch();
    const policyContracts = useSelector(associatedPolicyContractSelectors.selectData()) || [];


    const onSave = () => {
        request.currentAssociatedPolicy.claimMasterID = claim.claimMasterID;
        if (!request.currentAssociatedPolicy.associatedPolicyID && policyContracts.length == 0) {
            request.currentAssociatedPolicy.isPrimary = true;
        }

        $dispatch(associatedPolicyActions.save({ associatedPolicy: request.currentAssociatedPolicy }));
    };
    const title = (payload) => {
       return payload == "GENESIS" ? "Genesis" : "General Star";  
    }

   
    return (

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
                    <IconButton className={classes.buttonClass} name="arrowchevron_right" onClick={() => dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, othersDrawerOpen: false, selectedMenu: "", searchMode: false } })}>
                        <ChevronLeft />
                    </IconButton>
                    {request.searchMode && request.selectedMenu != "" ? `Associated Policies Detail - ${title(request.selectedMenu)}` : `Associated Policies Detail - Other`}
                </div>
            <DrawerMain>
                <AssociativePoliciesDrawerForm request={request} dispatch={dispatch} />
            </DrawerMain>
            <DrawerFooter>
                    <Button onClick={() => dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, othersDrawerOpen: false, selectedMenu: "", searchMode:false } })} >
                    Cancel
                    </Button>
                    <Button onClick={onSave}>
                    Submit
                    </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

    );

} 