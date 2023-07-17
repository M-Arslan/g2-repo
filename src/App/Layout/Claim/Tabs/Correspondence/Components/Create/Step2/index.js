import React from 'react';
import {
    asWizardPage
} from '../../../../../../../Core/Providers/WizardProvider/asWizardPage';
import {
    makeEvent
} from '../../../../../../../Core/Utility/makeEvent';
import {
    ensureNonNullObject
} from '../../../../../../../Core/Utility/rules';
import {
    CreateForm
} from './CreateForm';

const Step2Page = ({ id, state, onRequestStateUpdate, onAllowNextChanged  }) => {

    const onFinalize = (evt) => {

        const { value } = evt.target;

        if (ensureNonNullObject(value) && value.valid === true) {
            if (typeof onAllowNextChanged === 'function') {
                onAllowNextChanged(makeEvent(id, true));
            }

            if (typeof onRequestStateUpdate === 'function') {
                onRequestStateUpdate(makeEvent(id, value.request));
            }
        }
        else {
            if (typeof onAllowNextChanged === 'function') {
                onAllowNextChanged(makeEvent(id, false));
            }
        }
    }

    const onInitialize = (evt) => {
        const { value } = evt.target;

        if (ensureNonNullObject(value) && typeof onAllowNextChanged === 'function') {
            onAllowNextChanged(makeEvent(id, (value.valid === true)));
        }
    }

    return <CreateForm
        id="create-correspondence-form"
        onFinalize={onFinalize}
        onInitialize={onInitialize}
        initialRequest={state}
    />;
}

export const Step2 = asWizardPage(Step2Page, { title: 'Data Entry', backEnabled: true, nextEnabled: false });
