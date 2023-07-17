import {
    GQL_SCHEMAS,
    GraphOperation,
    GQL_MUTATION
} from '../../../../Providers/GraphQL';

/**
 * Query used to create a new contact association
 * @class
 */
export class SaveContact extends GraphOperation {

    /**
     * Creates a new instance of the SaveContact class
     * @constructor
     */
    constructor() {
        super(GQL_SCHEMAS.CONTACT, 'save', GQL_MUTATION.IS_MUTATION);
        this.defineVariable('data', 'ContactInputType', true)
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
