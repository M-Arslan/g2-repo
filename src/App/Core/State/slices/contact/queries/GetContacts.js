import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../Providers/GraphQL';

export class GetContacts extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.CONTACT, 'forClaim');

        this.defineVariable('claimMasterId', 'String', true)
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
