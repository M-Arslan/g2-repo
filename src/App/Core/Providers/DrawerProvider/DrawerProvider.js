import React from 'react';
import { DrawerContainer } from './DrawerContainer';

/**
 * DrawerResult represents the return values when a drawer is closed. 
 * @class
 */
export class DrawerResult {
    /**
     * Creates a new instance of the {DrawerResult} class.
     * @param {boolean} confirmed - indicates whether drawer action was successful
     * @param {any} payload - object data passed back from the drawer child
     */
    constructor(confirmed, payload) {
        /** @private */
        this._confirmed = (confirmed === true);

        /** @private */
        this._payload = payload;
    }

    /** @type {boolean} */
    get confirmed() { return this._confirmed === true; }

    /** @type {any} */
    get payload() { return this._payload; }
}

class DrawerManager {
    /**
     * Creates a new instance of the DrawerManager class
     * @param {Function} changeDrawer - handler that changes the current drawer (null when closed)
     */
    constructor(changeDrawer) {
        /** @type {Map<string, React.Component>} */
        this._drawers = new Map();

        /** @type {Function} */
        this._changeDrawer = changeDrawer;
    }

    /**
     * register a drawer component by key
     * @param {string} key - unique key for this drawer
     * @param {React.Component} component - hosted component
     * @param {Function} onClose - event handler when drawer is closed
     * @param {import('./DrawerContainer').DrawerContainerOptions} options - drawer options
     */
    registerDrawer(key, component, onClose, options = {}) {
        this._drawers.set(key, {
            Component: component,
            onClose,
            options,
        });
    }

    /**
     * openDrawer opens the drawer for the given key
     * @param {string} key - unique key for this drawer
     * @returns {boolean} - true if drawer opened, otherwise false
     */
    async openDrawer(key) {
        if (this._drawers.has(key)) {
            this._changeDrawer(this._drawers.get(key));
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * closeDrawer manually closes the drawer from outside the drawer manager
     * @returns {DrawerResult}
     */
    async closeDrawer() {
        this._changeDrawer(null); //closes drawer
    }
}

const DrawerContext = React.createContext(null);

/**
 * Hook to the Drawer Provider
 * @returns {DrawerManager}
 */
export function useDrawerManager() {
    return React.useContext(DrawerContext);
}

/**
 * Provides access to a Drawer registration and execution mechanism.
 * @param {any} props - component properties
 */
export const DrawerProvider = ({ children }) => {

    const [drawerOpen, changeDrawerOpen] = React.useState(false);
    const [currentDrawer, changeCurrentDrawer] = React.useState(null);

    const changeDrawer = (drawer) => {
        changeCurrentDrawer(drawer);
        changeDrawerOpen((typeof drawer === 'object' && drawer !== null));
    };

    const DM = new DrawerManager(changeDrawer);

    return (
        <DrawerContext.Provider value={DM}>
            {children}
            <DrawerContainer open={drawerOpen} Child={(currentDrawer || {}).Component} onClose={(currentDrawer || {}).onClose} options={(currentDrawer || {}).options} />
        </DrawerContext.Provider>
    );
};