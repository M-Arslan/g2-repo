import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../Providers/GraphQL';

export class GetAppLogs extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.APP_LOGS, 'list');

        this.defineVariable('level', 'Int', false)
            .defineVariable('start', 'DateTime', false)
            .defineVariable('end', 'DateTime', false)
            .defineFields(
                'timestamp',
                'level',
                'message',
                'context',
            );
    }
}
