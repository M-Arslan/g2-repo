import React from 'react';
import styled from 'styled-components';
import {
    Spinner,
} from '../../Core/Forms/Common';
import {
    LegalDetailContainer
} from './LegalDetailContainer';
import {
    LegalClaimSelectors, LegalClaimActions
} from '../../Core/State/slices/legal-claim';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import {
    claimActions,
    claimSelectors
} from '../../Core/State/slices/claim';
import {
    ASYNC_STATES
} from '../../Core/Enumerations/redux/async-states';
import {
claimDetailFlagTypesActions,
} from '../../Core/State/slices/metadata/claimDetailFlagTypes';
import { Unauthorized } from '../Unauthorized';
import { APP_TYPES } from '../../Core/Enumerations/app/app-types';
import { userSelectors } from '../../Core/State/slices/user';
import { useParams } from 'react-router-dom';
import { CLAIM_TYPES } from '../../Core/Enumerations/app/claim-type';

const LegalContainer = styled.div`
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    background-color: transparent;
`;

const LegalErrorContainer = styled.div`
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 1.5em;
    background: #ffffff;
`;

export const LegalScreen = ({ match }) => {
    const $dispatch = useDispatch();
    const claimState = useSelector(claimSelectors.selectLoading());
    const legalClaimSelectorsState = useSelector(LegalClaimSelectors.selectLoading());
    const $auth = useSelector(userSelectors.selectAuthContext());
    const [isAuthorize, setIsAuthorize] = React.useState(true);
    const { id } = useParams();

    const claim = useSelector(claimSelectors.selectData());

    React.useEffect(() => {
        $dispatch(claimActions.get({ id }));
        $dispatch(LegalClaimActions.get({ claimMasterID: id }));
        $dispatch(claimDetailFlagTypesActions.get());
        if ($auth.hasPermission(APP_TYPES.Legal_Dashboard)) {
            setIsAuthorize(true);
        }
        else {
            setIsAuthorize(false);
        }
    }, ['match']);

    if (!isAuthorize) {
        return <Unauthorized />
    }
    else {
        if (claim !== null) {
            if ((claim || {}).claimType !== CLAIM_TYPES.LEGAL)
                return <LegalErrorContainer><h3>Not Found</h3><p>The claim you are trying to access either does not exist or you do not have the required rights to view it.</p></LegalErrorContainer>;
            else
                return <LegalDetailContainer />;
        }
        else if (claimState === ASYNC_STATES.WORKING) {
            return <LegalContainer><Spinner onPrimary={true} /></LegalContainer>;
        }
        else if (claimState === ASYNC_STATES.ERROR || legalClaimSelectorsState === ASYNC_STATES.ERROR) {
            return <LegalErrorContainer><h3>Not Found</h3><p>The claim you are trying to access either does not exist or you do not have the required rights to view it.</p></LegalErrorContainer>;
        } else
        {
            return <LegalContainer><Spinner onPrimary={true} /></LegalContainer>;
        }
    }
};


