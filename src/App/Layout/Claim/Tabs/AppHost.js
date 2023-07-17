import React from 'react';
import {
    AppContainer,
    TabContainer
} from './TabContainer';
import {
    AppToolbar
} from './AppToolbar';
import { loadClaimDetail } from './ClaimDetail/Queries/loadClaimDetail';
import { useSelector } from 'react-redux';
import { userSelectors } from '../../../Core/State/slices/user';
import { claimSelectors } from '../../../Core/State/slices/claim';
import { FAL_CLAIM_STATUS_TYPES } from '../../../Core/Enumerations/app/fal_claim-status-types';

const AppHostContext = React.createContext({});

/**
 * @typedef {object} UserInfo
 * @property {string} userID
 * @property {string} fullName
 * @property {string} emailAddress
 */

/**
 * @typedef {object} AppHost
 * @property {boolean} appIsReadonly - determines if the user only has read only priviledges in the current app context
 * @property {object} claim
 * @property {function} getClaim - gets the current claim data
 * @property {string} claimMasterId
 * @property {UserInfo} currentUser
 * @property {boolean} isViewer
 * @property {function} readOnly - determines if user is viewer for supplied app key
 * @property {function} addToolbarButton
 * @property {function} addToolButtons
 * @property {function} addMenuButtons
 * @property {function} addNavButtons
 * @property {function} addCmdButtons
 */

/**
 * useAppHost is a hook to the app context
 * @returns {AppHost}
 */
export function useAppHost() {
    return React.useContext(AppHostContext);
}

/**
 * @typedef {object} AppHostProps
 * @property {string} app - id of this app
 * @property {object} claim - the claim object being loaded into the Claim Detail context
 * @property {Array<React.Component>} children - react children
 */

/**
 * AppHost is a context wrapper for an individual App Tab content component. 
 * Enables the use of the useAppHost hook in child components.
 * @param {AppHostProps} props - component properties
 * @returns {React.Component}
 */
export const AppHost = ({ app, children }) => {

    const $auth = useSelector(userSelectors.selectAuthContext());
    const isViewer = $auth.isReadOnly(app);
    const currentUser = $auth.currentUser;
    const claim = useSelector(claimSelectors.selectData());

    const [claimData, setClaimData] = React.useState(claim || {});

    const [state, dispatch] = React.useReducer((state, action) => {
        switch (action.type) {
            case 'ADD_TOOL_BUTTONS':
                return { ...state, toolButtons: state.toolButtons.concat(action.buttons) };
            case 'ADD_MENU_BUTTONS':
                return { ...state, menuButtons: state.menuButtons.concat(action.buttons) };
            case 'ADD_NAV_BUTTONS':
                return { ...state, navButtons: state.navButtons.concat(action.buttons) };
            case 'ADD_CMD_BUTTONS':
                return { ...state, cmdButtons: state.cmdButtons.concat(action.buttons) };
            case 'REMOVE_MENU_BUTTONS':
                return { ...state, menuButtons: []};
            default:
                return state;
        }
    }, { toolButtons: [], navButtons: [], menuButtons: [] });

    const CTX = {
        appIsReadonly: ($auth.isReadOnly(app) === true || claim.fALClaimStatusTypeID === FAL_CLAIM_STATUS_TYPES.CLOSED || claim.fALClaimStatusTypeID === FAL_CLAIM_STATUS_TYPES.ERROR),
        claim: claimData,
        getClaim: () => claimData,
        getClaimAsync: async () => {
            return await loadClaimDetail(claimData.claimMasterID);
        },
        claimMasterId: claim.claimMasterID,
        isViewer,
        readOnly: (app) => ($auth.isReadOnly(app) === true),
        currentUser,
        addToolbarButton: (...buttons) => dispatch({ type: 'ADD_TOOL_BUTTONS', buttons }),
        addToolButtons: (buttons) => dispatch({ type: 'ADD_TOOL_BUTTONS', buttons }),
        addMenuButtons: (buttons) => dispatch({ type: 'ADD_MENU_BUTTONS', buttons }),
        addNavButtons: (buttons) => dispatch({ type: 'ADD_NAV_BUTTONS', buttons }),
        addCmdButtons: (...buttons) => dispatch({ type: 'ADD_CMD_BUTTONS', buttons }),
        removeMenuButtons: (buttons) => dispatch({ type: 'REMOVE_MENU_BUTTONS' }),

    };

    return (
        <AppHostContext.Provider value={CTX}>
            <AppContainer>
                <AppToolbar
                    toolButtons={state.toolButtons.filter(b => (typeof b.disabled !== 'function' || b.disabled(CTX) !== true))}
                    navButtons={state.navButtons.filter(b => (typeof b.disabled !== 'function' || b.disabled(CTX) !== true))}
                    menuButtons={state.menuButtons.filter(b => (typeof b.disabled !== 'function' || b.disabled(CTX) !== true))} />
                <TabContainer>
                    {children}
                </TabContainer>
            </AppContainer>
        </AppHostContext.Provider>
    );
};