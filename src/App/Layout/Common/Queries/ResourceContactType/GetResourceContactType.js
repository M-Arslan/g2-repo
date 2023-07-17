import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../Core/Providers/GraphQL';

export class GetResourceContactType extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.RESOURCE, 'get');

        this.defineVariable('id', 'String')
            .defineFields(
                'resourceContactTypeID',
                'resourceContactTypeText',
            );
    }

    async execute(id) {
        return await super.execute({ id });
    }
}
