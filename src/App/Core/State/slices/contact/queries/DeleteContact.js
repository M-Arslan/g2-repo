import {
    GQL_SCHEMAS,
    GraphOperation,
    GQL_MUTATION
} from '../../../../Providers/GraphQL';

export class DeleteContact extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.CONTACT, 'del', GQL_MUTATION.IS_MUTATION);
        this.defineVariable('id', 'String', true)
            .defineFields(
                'claimContactID',
                'claimMasterID',
                'resourceID',
                'contactType',
                'name',
                'attn',
                'address1',
                'address2',
                'city',
                'state',
                'zip',
                'phone',
                'emailAddress',
                'comment',
                'createdBy',
                'createdDate'
            );
    }
}
