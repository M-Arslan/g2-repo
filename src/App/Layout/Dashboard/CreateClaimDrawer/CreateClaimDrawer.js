import {
    ChevronLeft
} from '@mui/icons-material';
import {
    Divider, Drawer,
    IconButton
} from '@mui/material';
import {
    makeStyles
} from '@mui/styles';
import {
    useSnackbar
} from 'notistack';
import React from 'react';
import styled from 'styled-components';
import {
    customGQLQuery
} from '../../../Core/Services/EntityGateway';
import {
    uuid
} from '../../../Core/Utility/uuid';
import {
    DrawerForm
} from './DrawerForm';
import {
    DrawerSearch
} from './DrawerSearch';
import {
    ButtonContainer
} from './FieldContainer';

const drawerWidth = 350;

const useStyles = makeStyles((theme) => {
    return ({
        button: {
            margin: '1em',
        },
        formControl: {
            minWidth: 300,
        },
        selectControl: {
            margin: '1em',
            width: '300px',
        },
        root: {
            display: 'flex',
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
            justifyContent: 'flex-start',
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
        heading: {
            fontSize: '15px',
            flexBasis: '33.33%',
            flexShrink: 0,
        },
        secondaryHeading: {
            fontSize: '15px',
        },
        expandedPanel: {
            margin: '0px !important'
        },
        panelDetails: {
            flexDirection: "column"
        }
    })
});

const ScrollPanel = styled.div`
    height: calc(100% - 38px);
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
    align-content: flex-start;
`;

const AlertBox = styled.div`
    width: 100%;
    padding: 1em;
    background-color: rgba(00, 99, 00, .5);
    color: #003300;
`;

const AlertLink = styled.a`
    padding: 1em;
    background-color: #003300;
    color: #fefefe;
    border-radius: 4px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-content: center;
`;

export const CreateClaimDrawer = ({ isOpen, onCloseDrawer, screenName, createdClaim }) => {

    const { enqueueSnackbar } = useSnackbar();

    const [claim, setClaim] = React.useState({
        claimMasterId: null,
        claimId: null
    });
    const [hasSearched, setHasSearched] = React.useState(false);

    const classes = useStyles();

    const closeDrawer = () => {
        if (typeof onCloseDrawer === 'function') {
            onCloseDrawer();
        }

        setClaim({
            claimMasterId: null,
            claimId: null
        });
        setHasSearched(false);
    };

    const createClaim = async (request) => {
        if ('claimPolicy' in request) {
             request.claimPolicy.active = JSON.parse(request.claimPolicy.active);
        }
        const claim = { ...request, claimMasterID: uuid() };
        const query = {
            "query": "mutation($claim:CreateClaimInputType!) {create(claim:$claim)}",
            "variables": { "claim": claim }
        };

        const result = await customGQLQuery(`claim-master`, query);
        const { error = null, errors = null, data = null } = result;

        if (error) {
            enqueueSnackbar(error.replace("GraphQL.ExecutionError:", ""), { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
        if (Array.isArray(errors) && errors.length > 0) {
            errors.forEach((err) => {
                enqueueSnackbar(err.message.replace("GraphQL.ExecutionError:", ""), { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            });
        }
        if (data && data.create) {
            if (typeof createdClaim ==='function') {
                createdClaim(true);
            }
            enqueueSnackbar("Claim has been created successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            closeDrawer();
        }
    };

    const onSearchComplete = ({ claimId = null, claimMasterId = null } = {}) => {
        setClaim({ claimMasterId, claimId });
        setHasSearched(true);
    };

    const onFormSubmit = (request) => createClaim({ ...request, claimID: claim.claimId });

    return (
        <Drawer
            className={classes.drawer}
            anchor="left"
            open={isOpen}
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <div className={classes.drawerHeader}>
                <IconButton name="arrowchevron_right" onClick={closeDrawer}>
                    <ChevronLeft />
                </IconButton>
                Create a New Claim
            </div>
            <ScrollPanel>   
                <InputPanel>
                    <DrawerSearch isClosed={isOpen} onSearchComplete={onSearchComplete} />
                    <Divider />
                    {
                        hasSearched && typeof claim.claimMasterId === 'string' && claim.claimMasterId !== '' ?
                            <AlertBox>
                                <p>The Claim already exists in the Claim Management system.</p>
                                <ButtonContainer>
                                    <AlertLink href={`/claim/${claim.claimMasterId}`}>View Claim Detail</AlertLink>
                                </ButtonContainer>
                            </AlertBox> : (hasSearched ? <DrawerForm onSubmit={onFormSubmit} screenName={screenName} /> : <div style={{ padding: '1em' }}>Enter a Claim ID and search to ensure it does not already exist.</div>)
                    }
                </InputPanel>
            </ScrollPanel>
            <Divider />
        </Drawer>
    );
}