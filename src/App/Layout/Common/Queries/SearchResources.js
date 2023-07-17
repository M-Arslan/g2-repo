import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../Core/Providers/GraphQL';

export class SearchResources extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.RESOURCE, 'list');

        this.defineVariable('searchTerm', 'String')
            .defineVariable('type', 'Int')
            .defineVariable('searchBy', 'String')
            .defineFields(
                'resourceID',
                'resourceContactTypeID',
                'companyName',
                'address1',
                'address2',
                'city',
                'state',
                'zip',
                'attentionContact',
                'emailAddress'
            )
            .makeSilent();
    }
}
