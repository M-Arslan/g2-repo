import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Core/Providers/GraphQL';

export class GenerateDocument extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.CORRESPONDENCE, 'doc');

        this.defineVariable('data', 'DocumentRequestInputType', true)
            .defineFields(
                'succeeded',
                'resultFile',
                'shortMessage'
            );
    }
}
