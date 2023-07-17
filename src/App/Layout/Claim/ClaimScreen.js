import React from 'react';
import styled from 'styled-components';
import {
    Spinner,
} from '../../Core/Forms/Common';
import {
    ClaimDetailContainer
} from './ClaimDetailContainer';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import {
    claimActions,
    claimSelectors,
} from '../../Core/State/slices/claim';
import {
    ASYNC_STATES
} from '../../Core/Enumerations/redux/async-states';
import {
    ensureNonNullObject
} from '../../Core/Utility/rules';
import {
    LegalClaimActions
} from '../../Core/State/slices/legal-claim';

import { useParams } from 'react-router-dom';
import { CLAIM_TYPES } from '../../Core/Enumerations/app/claim-type';


const ClaimContainer = styled.div`
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    background-color: transparent;
`;

const ClaimErrorContainer = styled.div`
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 1.5em;
    background: #ffffff;
`;

export const ClaimScreen = ({ match }) => {
    const $dispatch = useDispatch();
    const loading = useSelector(claimSelectors.selectLoading());
    const claim = useSelector(claimSelectors.selectData());

    const { id } = useParams();

    React.useEffect(() => {
        $dispatch(claimActions.get({ id }));
        $dispatch(LegalClaimActions.get({ claimMasterID: id }));

    }, ['match']);

    if (loading === ASYNC_STATES.WORKING && ensureNonNullObject(claim) !== true) {
        return <ClaimContainer><Spinner onPrimary={true} /></ClaimContainer>;
    }
    else if (loading === ASYNC_STATES.ERROR || (loading === ASYNC_STATES.SUCCESS && claim === null)) {
        return (
            <ClaimErrorContainer>
                <h3>Error Loading Claim</h3>
                <p>The system encountered an error when trying to load the selected claim.</p>
                <p>This could be due to the fact that the claim you are trying to access either does not exist or you do not have the required rights to view it or as the result of a server error.
                Please refresh your browser to attempt to reload the claim.  Contact support if the problem persists.
                    </p>
            </ClaimErrorContainer>
        );
    }
    else {
        if ((claim || {}).claimType === CLAIM_TYPES.LEGAL)
            return <ClaimErrorContainer><h3>Not Found</h3><p>The claim you are trying to access either does not exist or you do not have the required rights to view it.</p></ClaimErrorContainer>;
        else
            return <ClaimDetailContainer />;
    }
    
};


