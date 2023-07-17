import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Core/Providers';

export class GetWCPolicy extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.POLICY, 'wCPolicy');

        this.defineVariable('id', 'String', true)
            .defineFields(
                'effectiveDate',
                'expirationDate',
                'insuredName',
            )
            .makeSilent();
    }
}