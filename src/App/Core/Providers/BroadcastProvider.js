import React from 'react';

/**
 * @typedef {object} Broadcaster
 * @property {function} publish - publishes a broadcast event
 * @property {function} subscribe - subscribes to a broadcast event
 */

/**
 * 
 */
export const BroadcastEvents = Object.freeze({
    ClaimPolicyChanged: 'claim-policy-changed',
    ClaimExaminerChanged: 'claim-examiner-changed',
    FalStatusChanged: 'claim-falstatus-changed',
    ClaimDataChanged: 'claim-data-changed',
    RequestContactsDrawerOpen: 'request-contacts-drawer-open',
    RequestAssocClaimDrawerOpen: 'request-assoc-claims-drawer-open',
    RequestNewCorrespondence: 'request-new-correspondence',
    RequestNewNarrative: 'request-new-narrative',
    RequestExportActivityLog: 'request-export-activity-log',
    RequestClaimExtract: 'request-claim-extract',
});

const BroadcastContext = React.createContext(new Map());

const events = new Map(Object.keys(BroadcastEvents).map(e => [BroadcastEvents[e], []]));

/**
 * useBroadcaster returns an interface to work with the BroadcastProvider
 * @type {Broadcaster}
 * */
export function useBroadcaster() {

    return {
        publish: (evt, args) => {
            if (events.has(evt) === true && Array.isArray(events.get(evt))) {
                events.get(evt).forEach(fn => fn(args));
            }
        },
        subscribe: (evt, handler) => {
            if (events.has(evt) !== true) {
                console.warn(`[Broadcaster] attempted to subscribe to an unknown event: ${evt}`);
            }
            else {
                const idx = events.get(evt).push(handler);
                return () => {
                    events.get(evt).splice(idx - 1, 1);
                };
            }
        },
    };
}

export const BroadcastProvider = ({ children }) => {
    const events = new Map(Object.keys(BroadcastEvents).map(e => [e, []]));
    const [state, dispatch] = React.useReducer((state, action) => {
        switch (action.type) {
            case 'SUBSCRIBE':
                const r = new Map(state);
                const { evt, handler } = action;
                if (Object.keys(BroadcastEvents).includes(evt) !== true) {
                    console.warn(`[BroadcastProvider] attmepting to subscribe to an unknown event: ${evt}`);
                    return state;
                }
                else {
                    r.get(evt).push(handler);
                    return r;
                }
            default:
                return state;
        }
    }, events);

    return <BroadcastContext.Provider value={{ state, dispatch }}>{children}</BroadcastContext.Provider>;
};