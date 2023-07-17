import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../Providers/GraphQL';

export class GetConfig extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.CONFIG, 'get');

        this.defineFields(
            'adminUrl',
            'agGridKey',
            'allowedAttachmentExtensions',
            'caraClaimFileUrl',
            'caraStatClaimFileUrl',
            'caraClaimUwFileUrl',
            'caraInvoiceClaimFileUrl',
            'caraUwFileUrl',
            'facReinsuranceUrl',
            'qaPendingRandom',
            'supportUrl',
            'caraClaimLegalFileURL',
            'reporting'
        );
    }
}
