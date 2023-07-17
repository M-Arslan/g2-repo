import {
    asWizardPage
} from '../../../../../../../Core/Providers/WizardProvider/asWizardPage';
import {
    resolve
} from '../../../../../../../Core/Services/Container/ServiceContainer';
import {
    stripEmptyFields
} from '../../../../../../../Core/Utility/stripEmptyFields';
import {
    SaveCorrespondence
} from '../../../Queries/SaveCorrespondence';
import {
    Completed
} from './Completed';

export const Step4 = asWizardPage(Completed, {
    initialize: (state) => {
        const $api = resolve(SaveCorrespondence);
        const data = stripEmptyFields({ ...state, status: (state.status === 0 ? 0 : 1) });
        return $api.execute({ data }).then(
            result => {
                if (result === true) {
                    return state;
                }
                else {
                    throw new Error('Could not create the correspondence record');
                }
            },
            err => {
                throw err;
            }
        );
    },
    title: 'Complete',
    backEnabled: false,
    nextEnabled: true,
    nextButtonLabel: 'Finish'
})