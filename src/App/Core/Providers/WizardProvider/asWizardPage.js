/// <reference path="./types.js" />

import React from 'react';
import { Spinner } from '../../Forms/Common';
import {
    makeEvent
} from '../../Utility/makeEvent';
import { safeObj } from '../../Utility/safeObject';
import {
    DEFAULT_PAGE_OPTIONS
} from './types';

/**
 * Wraps a control in a WizardPage HOC
 * @param {import('react').Component} Component
 * @param {import('./types').WizardPageOptions} options
 * @returns {import('./types').WizardPageComponent}
 */
export const asWizardPage = (Component, options = {}) => {

    /** @type {import('./types').WizardPageOptions} */
    const opts = {
        ...DEFAULT_PAGE_OPTIONS,
        ...safeObj(options)
    };

    /**
     * WizardPage HOC
     * @param {import('./types').WizardPageProps} props component props
     * @returns {import('./types').WizardPageComponent}
     */
    const WrapperComponent = ({ id, state, onPageActivated, onAllowNextChanged, onAllowBackChanged, onRequestStateUpdate }) => {

        /** @type {[boolean, function(boolean):void]} */
        const [isProcessing, setIsProcessing] = React.useState(false);

        /** */
        const init = () => {

            const pageContext = {
                state,
                allowBack: opts.backEnabled,
                backButtonLabel: opts.backButtonLabel,
                allowNext: opts.nextEnabled,
                nextButtonLabel: opts.nextButtonLabel,
                extraButtons: opts.extraButtons,
                title: opts.title,
            };

            if (typeof opts.initialize === 'function') {
                setIsProcessing(true);

                try {
                    opts.initialize(state)
                        .then(
                            pageState => {
                                onPageActivated(makeEvent(id, {
                                    activationCanceled: false,
                                    context: { ...pageContext, state: pageState }
                                }));
                            },
                            err => {
                                onPageActivated(makeEvent(id, { activationCanceled: true, cancelReason: err }));
                            }
                        )
                        .finally(() => setIsProcessing(false));
                }
                catch (ex) {
                    console.error('[asWizardPage::init] error:', ex, opts);
                    setIsProcessing(false);
                    onPageActivated(makeEvent(id, { activationCanceled: false, context: pageContext }))
                }
            }
            else {
                onPageActivated(makeEvent(id, { activationCanceled: false, context: pageContext }))
            }
        };

        React.useEffect(() => {
            init();
        }, []);

        return (isProcessing === true ? <Spinner /> : <Component
            id={id}
            onAllowNextChanged={onAllowNextChanged}
            onAllowBackChanged={onAllowBackChanged}
            onRequestStateUpdate={onRequestStateUpdate}
            state={state} />);
    };

    return WrapperComponent;
}; 