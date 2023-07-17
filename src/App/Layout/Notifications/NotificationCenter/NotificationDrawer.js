import React from 'react';
import styled from 'styled-components';
import {
    Drawer,
    IconButton,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { PreTrailMemoSelectors, PreTrailMemoActions } from '../../../Core/State/slices/PreTrailMemo';

import {
    makeStyles
} from '@mui/styles';
import {
    ChevronLeft
} from '@mui/icons-material';
import { ContentCell, ContentRow, TextInput, DatePicker, formatDate, Spinner } from '../../../Core/Forms/Common';
import { claimSelectors } from '../../../Core/State/slices/claim';
import { ASYNC_STATES } from '../../../Core/Enumerations/redux/async-states';
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
const DrawerContent = styled.article`
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
    border: 0;

    display: flex;
    flex-flow: column nowrap;
`;
const ScrollPanel = styled.div`
    height: calc(100% - 85px - 20px);
    width: 100%;
    padding: 0;
    margin: 0;
    border: 0;
    overflow-x: hidden;
    overflow-y: auto;
`;
const Container = styled.div`
   padding : 20px;
`;

export const NotificationDrawer = ({ isOpen, close, claim }) => {
    const classes = useStyles();
    const preTrialMemo = useSelector(PreTrailMemoSelectors.selectData());
    const preTrialMemoLoaded = useSelector(PreTrailMemoSelectors.selectLoading());
    const [loader, setLoader] = React.useState(true);
    const $dispatch = useDispatch();
    const claimLoaded = useSelector(claimSelectors.selectLoading());
    React.useEffect(() => {
        if (claimLoaded === ASYNC_STATES.SUCCESS && preTrialMemoLoaded === ASYNC_STATES.SUCCESS) {
            setLoader(false);
            $dispatch(PreTrailMemoActions.clearStatus());
        }
    }, [preTrialMemoLoaded,claim])

    
    const onClose = () => {
        if (typeof close === 'function') {
            close();
        } 
        setLoader(true);
    }

   
    return (
       
        <Drawer
            className={classes.drawer}
            anchor="left"
            open={isOpen}
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <DrawerContent>
                <div className={classes.drawerHeader}>
                    <IconButton className={classes.buttonClass} name="arrowchevron_right" onClick={() => onClose()}>
                        <ChevronLeft />
                    </IconButton>
                    Pre-Trial Memo
                </div>
                <DrawerMain>
                    <ScrollPanel>
                        <Container>
                            <form>
                                {loader ? <Spinner /> :
                                    (<>
                                        <ContentRow>
                                            <ContentCell style={{ width: "100%" }}>
                                                <TextInput
                                                    id="policyNumber"
                                                    label="Policy Number"
                                                    value={claim?.claimPolicy ? claim?.claimPolicy?.policyID : claim?.claimPolicyID }
                                                    disabled
                                                /> 
                                            </ContentCell>
                                        </ContentRow>
                                        <ContentRow>
                                            <ContentCell style={{ width: "100%" }}>
                                                <TextInput
                                                    id="insuredName"
                                                    label="Insured Name"
                                                    value={claim && (claim.insuredName || claim.insuredNameContinuation) ? `${claim.insuredName || ''} ${claim.insuredNameContinuation || ''}`.trim() : claim.policy ? `${claim.policy.insuredName || ''} ${claim.policy.insuredNameContinuation || ''}` : ''}
                                                    disabled
                                                />
                                            </ContentCell>
                                        </ContentRow>
                                        <ContentRow>
                                            <ContentCell>
                                                <DatePicker
                                                    id="dOL"
                                                    name="dOL"
                                                    label="Date of Loss"
                                                    value={claim?.dOL || ''}
                                                    error=""
                                                    helperText=""
                                                    disabled
                                                />
                                            </ContentCell>
                                            <ContentCell>
                                                <DatePicker
                                                    id="dateReceived"
                                                    name="dateReceived"
                                                    label="Claim Reported date"
                                                    value={claim?.dateReceived || ''}
                                                    error=""
                                                    helperText=""
                                                    disabled
                                                />
                                            </ContentCell>
                                        </ContentRow>
                                <ContentRow>
                                    <ContentCell style={{ width: "100%" }}>
                                        <TextInput
                                            id="claimant"
                                            label="Claimant"
                                            name="claimant"
                                             value={preTrialMemo?.claimant || ''}
                                            //error={claimantRequired === true}
                                            //helperText={(claimantRequired === true ? 'Claimant field is required' : '')}
                                            required
                                            disabled
                                        />
                                    </ContentCell>
                                </ContentRow>
                                <ContentRow>
                                        <ContentCell>
                                            <DatePicker
                                                id="trialDate"
                                                name="trialDate"
                                                label="Trial Date"
                                                value={preTrialMemo?.trialDate ? formatDate(preTrialMemo?.trialDate) : ''}
                                                error=""
                                                helperText=""
                                                disabled
                                            />
                                    </ContentCell>
                                    <ContentCell>
                                        <TextInput
                                            id="venue"
                                            label="Venue"
                                            name="venue"
                                            value={preTrialMemo?.venue || ''}
                                            disabled
                                        />
                                    </ContentCell>
                                </ContentRow>
                                <ContentRow>
                                    <ContentCell>
                                        <TextInput
                                            id="primaryExcessCarrier"
                                            label="Primary / Excess Carrier"
                                            name="primaryExcessCarrier"
                                            value={preTrialMemo?.primaryExcessCarrier || ''}
                                            disabled
                                        />
                                    </ContentCell>
                                    <ContentCell>
                                        <TextInput
                                            id="defenseCounsel"
                                            label="Defense Counsel"
                                            name="defenseCounsel"
                                            value={preTrialMemo?.defenseCounsel || ''}
                                            disabled
                                        />
                                    </ContentCell>
                                </ContentRow>
                                <ContentRow>
                                    <ContentCell>
                                        <TextInput
                                            id="limits"
                                            label="Limits"
                                            name="limits"
                                            value={preTrialMemo?.limits || ''}
                                            disabled
                                            required
                                          //  error={limitsRequired === true}
                                          ////  helperText={(limitsRequired === true ? 'Limits field is required' : '')}
                                        />
                                    </ContentCell>
                                    <ContentCell>
                                        <TextInput
                                            id="reserve"
                                            name="reserve"
                                            label="Reserve"
                                            value={preTrialMemo?.reserve || ''}
                                            disabled
                                            required
                                         //   error={reserveRequired === true}
                                         //   helperText={(reserveRequired === true ? 'Reserve field is required' : '')}
                                        />
                                    </ContentCell>
                                </ContentRow>
                                <ContentRow>
                                    <ContentCell style={{ width: "100%" }}>
                                        <TextInput
                                            label="Description of Loss"
                                            id="lossDesc"
                                            name="lossDesc"
                                            fullWidth={true}
                                            value={preTrialMemo?.descriptionOfLoss || ''}
                                            disabled
                                         //   error={dolRequired === true}
                                          //  helperText={(dolRequired === true ? 'Description of Loss field is required' : '')}
                                            required
                                            multiline
                                            rows={3}
                                        />
                                    </ContentCell>
                                </ContentRow>
                                <ContentRow>
                                    <ContentCell style={{ width: "100%" }}>
                                        <TextInput
                                            label="Liability"
                                            id="liability"
                                            name="liability"
                                            fullWidth={true}
                                            inputProps={{
                                                maxLength: 250,
                                            }}
                                            value={preTrialMemo?.liability || ''}
                                            error=""
                                            helperText=""
                                            disabled
                                            multiline
                                            rows={3}
                                        />
                                    </ContentCell>
                                </ContentRow>
                                <ContentRow>
                                    <ContentCell style={{ width: "100%" }}>
                                        <TextInput
                                            label="Damages"
                                            id="damages"
                                            name="damages"
                                            fullWidth={true}
                                            inputProps={{
                                                maxLength: 250,
                                            }}
                                            value={preTrialMemo?.damages || ''}
                                            disabled
                                            multiline
                                            rows={3}
                                        />
                                    </ContentCell>
                                </ContentRow>
                                <ContentRow>
                                    <ContentCell style={{ width: "100%" }}>
                                        <TextInput
                                            label="Status of Negotiations"
                                            id="statusOfNegotiations"
                                            name="statusOfNegotiations"
                                            fullWidth={true}
                                            inputProps={{
                                                maxLength: 250,
                                            }}
                                            value={preTrialMemo?.statusOfNegotiations || ''}
                                            disabled
                                            multiline
                                            rows={3}
                                        />
                                    </ContentCell>
                                </ContentRow>
                                </>)}
                            </form>
                        </Container>
                    </ScrollPanel>
                </DrawerMain>
            </DrawerContent>
        </Drawer>

    );

} 