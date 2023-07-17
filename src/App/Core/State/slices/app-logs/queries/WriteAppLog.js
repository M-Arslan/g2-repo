import {
    GQL_SCHEMAS,
    GraphOperation,
    GQL_MUTATION
} from '../../../../Providers/GraphQL';

/**
 * Query used to create a new app log line
 * @class
 */
export class WriteAppLog extends GraphOperation {

    /**
     * Creates a new instance of the WriteAppLog class
     * @constructor
     */
    constructor() {
        super(GQL_SCHEMAS.APP_LOGS, 'create', GQL_MUTATION.IS_MUTATION);
        this.defineVariable('log', 'AppLogInputType', true)
            .defineFields(
                'message',
                'context',
                'timestamp',
                'level',
            );

    }
}
