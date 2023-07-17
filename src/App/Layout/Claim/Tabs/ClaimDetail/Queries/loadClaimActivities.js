import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Core/Providers/GraphQL';

export class LoadClaimActivities extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.ACCOUNTING, 'accountingList');

        this.defineVariable('claimMasterID', 'String', true)
            .defineFields(
                'activityID',
                'claimMasterID',
                'claimStatusTypeID',
            );
    }

    async execute(id) {
        return await super.execute({ claimMasterID: id });
    }
}
