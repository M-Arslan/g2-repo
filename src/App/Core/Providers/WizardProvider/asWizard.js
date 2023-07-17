import React from 'react';
import {
    ButtonContainer,
    WizardButtons,
    WizardContainer,
    WizardContent,
    WizardTitle
} from './Common';
import {
    makeEvent
} from '../../Utility/makeEvent';
import {
    ensureNonEmptyArray,
    ensureNonEmptyString,
    ensureNonNullObject,
    hasValue
} from '../../Utility/rules';
import {
    Button
} from '@mui/material';
import {
    immutable,
    safeArray,
    safeObj
} from '../../Utility/safeObject';
import {
    DEFAULT_WIZARD_OPTIONS
} from './types';
import { useNotifications } from '../NotificationProvider/NotificationProvider';

// -- Material UI buttons aren't real buttons so they don't manage events correctly
const ExtraButton = ({ id, onClick, children, ...rest }) => {

    const proxyOnClick = () => {
        if (typeof onClick === 'function') {
            onClick(makeEvent(id, ''));
        }
    }

    return <Button onClick={proxyOnClick} id={id} name={id} {...rest}>{children}</Button>;
}

/**
 * Creates a Wizard HOC from a group of pages
 * @param {import('./types').WizardOptions} options
 * @param {...import('react').Component} pages
 * @returns {import('./types').WizardComponent}
 */
export const asWizard = (options, ...pages) => {

    if (ensureNonEmptyArray(pages) !== true || pages.every(p => hasValue(p)) !== true) {
        throw new Error('[asWizard] expects list argument "pages" to contain at least one non-null element');
    }

    // -- fill in gaps in options
    /** @type {import('./types').WizardOptions} */
    const opts = immutable({
        ...DEFAULT_WIZARD_OPTIONS,
        ...safeObj(options)
    });


    /**
     * Wizard HOC
     * @param {import('./types').WizardProps} props component properties
     * @returns {import('./types').WizardComponent}
     */
    const WrapperComponent = ({ id, initialState, onCompleted }) => {

        const $notifications = useNotifications();

        /** @type {[any, function(any):void]} */
        const [state, setState] = React.useState(immutable({ ...safeObj(initialState) }));

        /** @type {[import('./types').WizardContext, function(import('./types').WizardContext):void]} */
        const [context, setContext] = React.useState(immutable({
            currentPage: 1,
            currentTitle: 'Step 1',
            currentBackButtonLabel: opts.defaultBackButtonLabel,
            currentNextButtonLabel: opts.defaultNextButtonLabel,
            getState: () => state,
            backEnabled: true,
            nextEnabled: false,
            extraButtons: [],
        }));

        /**
         * @private
         * @param {number} page
         */
        const _changePage = (page) => {
            if (page < 1 || page > pages.length) {
                console.warn('[Wizard] the wizard has tried to navigate outside the bounds of the pages list');
                return;
            }

            setContext(immutable({ ...context, currentPage: page }));
        }

        /**
         * @private
         * @param {boolean} confirmed
         */
        const _complete = (confirmed) => {
            const s = { ...state };

            setState({});

            setContext(immutable({
                currentPage: 1,
                currentTitle: 'Step 1',
                currentBackButtonLabel: opts.defaultBackButtonLabel,
                currentNextButtonLabel: opts.defaultNextButtonLabel,
                getState: () => state,
                backEnabled: true,
                nextEnabled: false
            }));

            if (typeof onCompleted === 'function') {
                onCompleted(makeEvent(id, { confirmed: (confirmed === true), state: (confirmed === true ? s : null) }));
            }
        }

        /**
         * handles the click event of the Next button 
         */
        const goNext = () => {
            if (context.nextEnabled !== true) {
                return;
            }

            const newPage = context.currentPage + 1;

            if (newPage > pages.length) {
                _complete(true);
            }
            else {
                _changePage(newPage);
            }
        };

        /**
         * handles the click event of the Back button 
         */
        const goBack = () => {
            if (context.backEnabled !== true) {
                return;
            }

            const newPage = context.currentPage - 1;

            if (newPage < 1) {
                _complete(false);
            }

            _changePage(newPage);
        };

        /**
         * handles the click event of the Cancel button 
         */
        const cancel = () => {
            _complete(false);
        };

        /**
         * handles the onPageActivated event of the WizardPage
         * @param {import('../../Utility/makeEvent').AppEvent<import('./types').PageActivatedEventArgs>} evt event args
         */
        const pageActivated = (evt) => {

            const { value: args } = evt.target;

            if (args.activationCanceled === true) {
                $notifications.notifyError(args.cancelReason);
                goBack();
            }
            else {

                const value = args.context;
                console.log('[asWizard] page initializing:', value);
                setState(immutable(value.state));

                setContext(immutable({
                    ...context,
                    currentBackButtonLabel: (ensureNonEmptyString(value.backButtonLabel) ? value.backButtonLabel : context.currentBackButtonLabel),
                    currentNextButtonLabel: (ensureNonEmptyString(value.nextButtonLabel) ? value.nextButtonLabel : context.currentNextButtonLabel),
                    currentTitle: (ensureNonEmptyString(value.title) ? value.title : `Step ${context.currentPage}`),
                    backEnabled: (value.allowBack !== false),
                    nextEnabled: (value.allowNext !== false),
                    extraButtons: (ensureNonEmptyArray(value.extraButtons) ? value.extraButtons : []),
                }));
            }
        };

        /**
         * handles the onReqestStateUpdate event from the WizardPage
         * @param {import('../../Utility/makeEvent').AppEvent.<object>} evt event args
         */
        const statusUpdateRequested = (evt) => {
            const { value } = evt.target;
            setState(immutable(value));
        }

        /**
         * handles the onAllowNextChanged event from the WizardPage
         * @param {import('../../Utility/makeEvent').AppEvent<boolean>} evt event args
         */
        const allowNextChanged = (evt) => {
            const { value } = evt.target;

            if (value !== context.nextEnabled) {
                setContext(immutable({ ...context, nextEnabled: (value !== false) }));
            }
        };

        /**
         * handles the onAllowBackChanged event from the WizardPage
         * @param {import('../../Utility/makeEvent').AppEvent<boolean>} evt
         */
        const allowBackChanged = (evt) => {
            const { value } = evt.target;

            if (value !== context.backEnabled) {
                setContext(immutable({ ...context, backEnabled: (value !== false) }));
            }
        };

        /**
         * handles the click of one of the page's registered extra buttons
         * @param {import('../../Utility/makeEvent').AppEvent<string>} evt
         */
        const extraButtonClicked = (evt) => {

            const { name } = evt.target;
            const eb = context.extraButtons.find(btn => btn.id === name);

            if (ensureNonNullObject(eb)) {
                const ns = immutable(eb.mutator(state));
                statusUpdateRequested(makeEvent(id, ns));
                goNext();
            }
            else {
                console.warn(`[WizardHoc::extraButtonClicked] cannot locate extra button with id "${name}"`);
            }
        };

        return (
            <WizardContainer>
                <WizardTitle>{`${(ensureNonEmptyString(opts.title) ? `${opts.title} - ` : '')}${context.currentTitle}`}</WizardTitle>
                <WizardContent>
                    {
                        pages.filter((p, idx) => idx === (context.currentPage - 1))
                            .map((/** @type {import('react').Component<import('./types').WizardPageProps>} */ Page, idx) => <Page
                                key={`wizard-page-${idx}`}
                                    id={`wizard-page-${idx}`}
                                    state={state}
                                    onPageActivated={pageActivated}
                                    onAllowNextChanged={allowNextChanged}
                                    onAllowBackChanged={allowBackChanged}
                                    onRequestStateUpdate={statusUpdateRequested}
                                />)
                    }
                </WizardContent>
                <WizardButtons>
                    <ButtonContainer>
                        <Button onClick={cancel}>Cancel</Button>
                    </ButtonContainer>
                    <ButtonContainer position="end">
                        <Button onClick={goBack} disabled={context.backEnabled === false}>{context.currentBackButtonLabel}</Button>
                        <Button onClick={goNext} disabled={context.nextEnabled === false}>{context.currentNextButtonLabel}</Button>
                        {
                            safeArray(context.extraButtons).map(eb => {
                                return <ExtraButton key={eb.id} id={eb.id} onClick={extraButtonClicked} disabled={context.nextEnabled === false}>{eb.label}</ExtraButton>;
                            })
                        }
                    </ButtonContainer>
                </WizardButtons>
            </WizardContainer>
        );
    }


    return WrapperComponent;
};