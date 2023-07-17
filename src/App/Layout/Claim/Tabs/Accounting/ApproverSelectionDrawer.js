import {
    Button,
    Divider,
    MenuItem,
    SwipeableDrawer,
    IconButton
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ChevronLeft } from '@mui/icons-material';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { APP_TYPES } from '../../../../Core/Enumerations/app/app-types';
import { ConfirmationDialog, SelectList } from '../../../../Core/Forms/Common';
import { claimSelectors } from '../../../../Core/State/slices/claim';
import { authorityAmountSelectors } from '../../../../Core/State/slices/metadata/authorityAmount';
import { userSelectors } from '../../../../Core/State/slices/user';
import { usersSelectors } from '../../../../Core/State/slices/users';
import { findHelpTextByTag } from '../../../Help/Queries';
import { validateApprover } from './Validations/validateFinancial';

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
    justify-content: ${props => props.alignContent || 'flex-start'};
    align-items: ${props => props.alignContent || 'flex-start'};
    align-content: ${props => props.alignContent || 'flex-start'};
    padding: .5em;
`;


export const ApproverSelectionDrawer = ({ open, onClose, request, dispatch, formValidator, onNext }) => {
    const drawerWidth = 350;
    const useStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
            flex: 1,
            width: '100%',

        },
        backdrop: {
            zIndex: 5,
            color: '#fff',
        },

        hide: {
            display: 'none',
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
            //...theme.mixins.toolbar,
            justifyContent: 'flex-start',
            backgroundColor: '#bdc3c7',
            fontSize: '15px',

        },
        content: {
            flexGrow: 1,
            padding: '3em',
            marginRight: -drawerWidth,
        },
        contentShift: {
            marginRight: 0,
        },
        heading: {
            fontSize: '15px',
            fontWeight: '400',
        },

    }));
    const classes = useStyles();
    const [helpTags, setHelpTags] = useState([]);
    const currentClaimActivity = request.currentClaimActivity || {};
    const claim = useSelector(claimSelectors.selectData());
    

    const $auth = useSelector(userSelectors.selectAuthContext());
    const supervisors = useSelector(usersSelectors.getSupervisors());
    const currentUser = $auth.currentUser;
    const authorityAmount = useSelector(authorityAmountSelectors.getCurrentUserAuthorityAmount(currentUser.id, claim.g2LegalEntityID));

    const isViewer = $auth.isReadOnly(APP_TYPES.Financials);
    const [showConfimationDialog, setShowConfimationDialog] = useState(false);

    const { register, formState: { errors }, setValue } = formValidator;
    setValue("taskOwner", currentClaimActivity.taskOwner);

    React.useEffect(() => {
        loadMetaData();

    }, [open]);

    const onDropDownChanged = (evt) => {
        request.currentClaimActivity[evt.target.name] = evt.target.value;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
    };
    async function loadMetaData() {
        if ((authorityAmount || {}).legalEntityManagerID && request.currentClaimActivity && !request.currentClaimActivity["taskOwner"]) {
            setValue("taskOwner", authorityAmount.legalEntityManagerID);
            request.currentClaimActivity["taskOwner"] = authorityAmount.legalEntityManagerID;
            dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
        }
    }
  
    const onConfirmationOk = () => {
        setShowConfimationDialog(false);
        onClose();
    }
    const onConfirmationCancel = () => {
        setShowConfimationDialog(false);
        onNext();
    }

    const onNextClick = async () => {
        let isValid = await validateApprover(formValidator.trigger, currentClaimActivity);
        if (isValid) {
            onNext();
        }
    }

    return (
        <>
            <ConfirmationDialog
                id="confirmation"
                keepMounted
                open={showConfimationDialog}
                onCancel={onConfirmationCancel}
                onOk={onConfirmationOk}
                title="Confirmation"
                okText="Yes"
                cancelText="No"
                description="Do you wish to reopen this claim as a pending file?"
            />
            <SwipeableDrawer
                className={classes.drawer}
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton name="arrowchevron_right" onClick={onClose}>
                        <ChevronLeft />
                        Select Approver
                    </IconButton>
                </div>
                <ContentRow>
                    <ContentCell width="99%">
                        <SelectList
                            disabled={isViewer}
                            id="taskOwner"
                            name="taskOwner"
                            label="Approver"
                            required
                            fullWidth={true}
                            variant="outlined"
                            value={currentClaimActivity.taskOwner || ""}
                            tooltip={findHelpTextByTag("taskOwner", helpTags)}
                            {...register("taskOwner",
                                {
                                    required: "This is required.",
                                    onChange: onDropDownChanged
                                }
                            )
                            }
                            error={errors.taskOwner}
                            helperText={errors.taskOwner ? errors.taskOwner.message : ""}
                        >
                            {
                                supervisors
                                    .filter(supp => supp.userID.toLowerCase() !== currentUser.id.toLowerCase())
                                    .map((item, idx) => <MenuItem value={item.userID} key={item.userID}>{item.fullName}</MenuItem>)
                            }
                        </SelectList>
                    </ContentCell>
                </ContentRow>
                <Divider />
                <ContentRow>
                    <ContentCell width="100%" alignContent='flex-end'>
                        <Button variant="contained" color="primary" style={{ marginRight: '10px' }} onClick={onNextClick}>Next</Button>
                        <Button variant="contained" color="secondary" style={{ marginRight: '10px' }} onClick={onClose}>Cancel</Button>
                    </ContentCell>
                </ContentRow>

            </SwipeableDrawer>

        </>
    );



}