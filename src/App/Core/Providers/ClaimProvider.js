import React from 'react';
import {
    Store
} from './Store';
import {
    getClaimDetailQuery
} from './Queries/getClaimDetailQuery';
import {
    executeGQL
} from '../Services';

export const ClaimContext = React.createContext(new Store());

const ClaimActionTypes = {
    FETCH: 'FETCH_CLAIM',
    FETCH_DONE: 'FETCH_CLAIM_DONE',
    FETCH_FAILED: 'FETCH_CLAIM_FAILED',
};

export const ClaimActions = {
    fetchClaim: () => ({ type: ClaimActionTypes.FETCH }),
    fetchClaimDone: (claim) => ({ type: ClaimActionTypes.FETCH_DONE, claim }),
    fetchClaimFailed: (error) => ({ type: ClaimActionTypes.FETCH_FAILED, error }),
};

function reducer(state, action) {
    switch (action.type) {
        case ClaimActionTypes.FETCH:
            return {
                loading: true,
                claim: null,
                error: null
            };
        case ClaimActionTypes.FETCH_DONE:
            return {
                loading: false,
                claim: action.claim,
                error: null
            };
        case ClaimActionTypes.FETCH_FAILED:
            return {
                loading: false,
                claim: null,
                error: action.error
            }
        default:
            return state;
    }
}

export const ClaimProvider = ({ claimId, children }) => {

    const [state, dispatch] = React.useReducer(reducer, { loading: true, claim: null, error: null });

    React.useEffect(() => {
        dispatch(ClaimActions.fetchClaim());

        async function fetchClaim() {
            try {
                const data = await executeGQL('claim-master', getClaimDetailQuery(claimId));
                dispatch(ClaimActions.fetchClaimDone(data.detail));
            }
            catch (ex) {
                dispatch(ClaimActions.fetchClaimFailed(ex));
            }
        }

        fetchClaim();
    }, ['claimId']);

    return <ClaimContext.Provider value={new Store(state, dispatch)}>{children}</ClaimContext.Provider>;
};