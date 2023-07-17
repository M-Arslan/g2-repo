import { immutable } from '../../Utility/safeObject';

/* ======================== START COMMON TYPES ================================ */

/* ------------------------ ONCOMPLETED EVENT --------------------------------- */

/**
 * Arguments passed to the OnCompletedEventHandler
 * @typedef {object} CompletedEventArgs
 * @property {boolean} confirmed indicates whether or not the Wizard completed successfully
 * @property {any} [state] the final state of the Wizard processing
 */

/**
 * Event handler called when a Wizard fires its Completed event
 * @callback OnCompletedEventHandler
 * @param {import('../../Utility/makeEvent').AppEvent.<CompletedEventArgs>} evt the event argument
 */

/* ------------------------ PAGEACTIVATED EVENT ------------------------------- */

/**
 * Arguments passed to the OnPageActivatedEventHandler
 * @typedef {object} PageActivatedEventArgs
 * @property {boolean} activationCanceled indicates that the page has canceled activation
 * @property {string} [cancelReason] human readable message describing why the activation was canceled
 * @property {WizardPageContext} [context] a Promise that resolves to the WizardPageContext for this page
 */

/**
 * Event handler called when a WizardPage fires its PageActivated event
 * @callback OnPageActivatedEventHandler
 * @param {import('../../Utility/makeEvent').AppEvent.<PageActivatedEventArgs>} evt event argument
 */

/* ------------------------ ONREQUESTSTATEUPDATE EVENT ------------------------------- */

/**
 * Event handler called when the WizardPage fires its RequestStateUpdate event
 * @callback OnRequestStateUpdateEventHandler
 * @param {import('../../Utility/makeEvent').AppEvent.<object>} evt event argument
 */

/* ------------------------ ONALLOWBACKCHANGED EVENT ------------------------------- */

/**
 * Event handler called when the WizardPage fires its AllowBackChanged event
 * @callback OnAllowBackChangedEventHandler
 * @param {import('../../Utility/makeEvent').AppEvent.<boolean>} evt event argument
 */

/* ------------------------ ONALLOWNEXTCHANGED EVENT ------------------------------- */

/**
 * Event handler called when the WizardPage fires its AllowNextChanged event
 * @callback OnAllowNextChangedEventHandler
 * @param {import('../../Utility/makeEvent').AppEvent.<boolean>} evt event argument
 */

/* ------------------------ INITIALIZEPAGE ------------------------------- */

/**
 * Function used to initialize the page context
 * @callback InitializeWizardPage
 * @param {any} state the current state of the Wizard
 * @returns {Promise<any>} resolves to the internal Page state
 */

/* ======================== END COMMON TYPES ================================ */


/* ======================== START WizardPage TYPES ================================ */

/**
 * Options for the WizardPage
 * @typedef {object} WizardPageOptions
 * @property {string} title the title for the page
 * @property {string} [nextButtonLabel=Next] the text for the next button
 * @property {string} [backButtonLabel=Back] the text for the back button
 * @property {boolean} [nextEnabled=false] indicates whether the next button is enabled at activation time
 * @property {boolean} [backEnabled=true] indicates whether the back button is enabled at activate time
 * @property {InitializeWizardPage} initialize function used to initialize the Page state
 * @property {Array<WizardButton>} extraButtons registers an array of extra buttons to show when the page is active
 */

/**
 * Passable context (immutable) to define overrides for a WizardPage component.
 * @typedef {object} WizardPageContext
 * @property {string} [title] the page's title
 * @property {string} [backButtonLabel] overrides the text on the Back button
 * @property {string} [nextButtonLabel] overrides the text on the Next button
 * @property {boolean} [allowBack] sets initial setting for the enabled state of the Back button
 * @property {boolean} [allowNext] sets initial setting for the enabled state of the Next button
 * @property {any} [state] overrides the current state
 */

/**
 * Component props for the WizardPage component
 * @typedef {object} WizardPageProps
 * @property {string} id the page's id
 * @property {object} state passes immutable state data to the WizardPage
 * @property {OnPageActivatedEventHandler} onPageActivated handles the WizardPage's PageActivated event
 * @property {OnRequestStateUpdateEventHandler} onRequestStateUpdate handles the WizardPage's RequestStateUpdate event
 * @property {OnAllowBackChangedEventHandler} onAllowBackChanged handles the WizardPage's AllowBackChanged event
 * @property {OnAllowNextChangedEventHandler} onAllowNextChanged handles the WizardPage's AllowNextChanged event
 */

/**
 * The WizardPage HOC
 * @typedef {import('react').Component<WizardPageProps>} WizardPageComponent
 */

/** @type {WizardPageOptions} */
export const DEFAULT_PAGE_OPTIONS = immutable({
    title: '',
    backEnabled: true,
    nextEnabled: false,
    initialize: state => Promise.resolve(state),
    extraButtons: [],

});

/* ======================== END WizardPage TYPES ================================ */

/* ======================== START Wizard TYPES ================================ */

/**
 * @typedef {object} WizardOptions
 * @property {string} [title='Wizard'] the title for the Wizard
 * @property {string} [defaultNextButtonLabel='Next'] the default text for the Next button
 * @property {string} [defaultBackButtonLabel='Back'] the default text for the Back button
 */

/**
 * @typedef {object} WizardButton
 * @property {string} id the unique id for this button
 * @property {string} label the label text for this button
 * @property {function} mutator a function that accepts the current state and returns a modified state object
 */

/**
 * @typedef {object} WizardContext
 * @property {number} currentPage the current page number
 * @property {string} currentTitle the subtitle provided by the current page
 * @property {string} currentBackButtonLabel the Back button text provided by the current page
 * @property {boolean} backEnabled indicates if the Back button should be enabled
 * @property {string} currentNextButtonLabel the Next button text provided by the current page
 * @property {boolean} nextEnabled indicates if the Next button should be enabled
 * @property {function} getState returns the current state object for the Wizard
 * @property {Map<string, WizardButton>} extraButtons a list of buttons registered by a WizardPage
 */

/**
 * @typedef {object} WizardProps
 * @property {string} id the unique DOM id for this component
 * @property {OnCompletedEventHandler} onCompleted the handler for the completed event
 * @property {any} [initialState] the initial state object loaded into the Wizard
 */

/**
 * The Wizard HOC
 * @typedef {import('react').Component<WizardProps>} WizardComponent 
 */

/** @type {WizardOptions} */
export const DEFAULT_WIZARD_OPTIONS = immutable({
    title: 'Wizard',
    defaultBackButtonLabel: 'Back',
    defaultNextButtonLabel: 'Next',
});

