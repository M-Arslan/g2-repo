import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Providers/GraphQL';

export class GetTemplateTexts extends GraphOperation {
    
    constructor() {
        super(GQL_SCHEMAS.TEMPLATE_TEXT, 'list');

        this.defineFields('templateTextID', 'text');
        this.shouldCache(`${GQL_SCHEMAS.CLAIMS_COMMON}|templateTexts`);
    }
}