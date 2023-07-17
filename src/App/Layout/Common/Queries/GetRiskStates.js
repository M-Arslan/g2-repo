import { GQL_SCHEMAS, GraphOperation } from '../../../Core/Providers';

export class GetRiskStates extends GraphOperation {

    constructor() {
        super(GQL_SCHEMAS.REFERENCE, 'riskStates', false, 'GetRiskStates');

        this.defineFields('riskStateID', 'stateCode', 'stateName');
        this.shouldCache(`${GQL_SCHEMAS.REFERENCE}|riskStates`, () => Date.now);
    }
}