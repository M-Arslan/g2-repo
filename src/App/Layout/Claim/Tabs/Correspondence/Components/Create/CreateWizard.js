﻿import {
    asWizard
} from '../../../../../../Core/Providers/WizardProvider/asWizard';
import {
    Step1
} from './Step1';
import {
    Step2
} from './Step2';
import {
    Step3
} from './Step3';
import {
    Step4
} from './Step4';


export const CreateWizard = asWizard({ title: 'Create Correspondence' }, Step1, Step2, Step3, Step4);
