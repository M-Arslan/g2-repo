import {
    asForm,
    DateRules,
    isNumeric,
    Max,
    ModelRule,
    Schema
} from '../../../../../../Core/Providers/FormProvider';
import {
    FormComponent
} from './LitigationForm';

/**
 * Rule to ensure requested date is before received date.
 * @type {ModelRule}
 */
const datesRule = new ModelRule((data) => {
    return DateRules('budgetReceivedDate').mustBeAfter('budgetRequestedDate', data);
});

/** 
 *  Schema definition for this form model
 *  @type {Schema} 
 */
const schema = new Schema([datesRule]);
schema.bindProperty('litigationID')
    .bindProperty('claimMasterID')
    .bindProperty('litigationTypeCode')
    .bindProperty('litigationDate')
    .bindProperty('arbitrationDate')
    .bindProperty('mediationDate')
    .bindProperty('trialDate')
    .bindProperty('counselTypeCode')
    .bindProperty('coveragePosition')
    .bindProperty('claimResourceID')
    .bindProperty('claimResourceCompanyName')
    .bindProperty('budgetRequestedDate')
    .bindProperty('budgetReceivedDate')
    .bindProperty('budgetAmount', [Max(999999999), isNumeric], { allowInvalidValues: false })
    .bindProperty('createdBy')
    .bindProperty('createdDate') // bind created properties even though they aren't on the form so they persist in the request
    .bindProperty('comments')
    .bindProperty('caseCaption')
    .bindProperty('docketNumber')
    .bindProperty('courtVenue');

    
/**
 * LitigationForm is the exported component as an HOC wrapped with asForm.
 * @type {import('react').FC<import('../../../../../../Core/Providers/FormProvider/useAsForm').FormProps>}
 */
export const LitigationForm = asForm(FormComponent, schema, true);
