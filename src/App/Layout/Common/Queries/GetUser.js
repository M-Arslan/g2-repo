import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../Core/Providers/GraphQL';

export class GetUser extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.USER, 'user');

        this.defineVariable('id', 'String', true)
            .defineFields(
                'userID',
                'fullName',
                'emailAddress',
            );
    }

    async execute(id) {
        return await super.execute({ id });
    }
}
