import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Providers/GraphQL';

export class GetAdjusterLicenseStates extends GraphOperation {
    
    constructor() {
        super(GQL_SCHEMAS.AdjusterLicenseStates, 'get');
        this.defineFields(
            'adjusterLicenseStateId',
            'state',
            'active');
    }
}