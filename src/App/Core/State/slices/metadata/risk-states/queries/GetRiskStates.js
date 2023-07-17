import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Providers/GraphQL';

export class GetRiskStates extends GraphOperation {
    
    constructor() {
        super(GQL_SCHEMAS.REFERENCE, 'riskStates');

        this.defineFields('riskStateID', 'stateCode', 'stateName');
        this.shouldCache(`${GQL_SCHEMAS.REFERENCE}|riskStates`);
    }
}