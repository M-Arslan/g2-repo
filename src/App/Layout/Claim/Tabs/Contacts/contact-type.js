import { ensureNonNullObject } from '../../../../Core/Utility/rules';
import { safeStr } from '../../../../Core/Utility/safeObject';

export const CONTACT_TYPE = Object.freeze({
    CLAIMANT: 'C',
    INSURED: 'I',
    MISC: 'M',
    LOOKUP: 'L',
    INVOLVED: 'V',
});

export const ContactTypeFormatter = (params) => {

    if (ensureNonNullObject(params) !== true || ensureNonNullObject(params.data) !== true) {
        return '--';
    }
    
    switch (safeStr(params.data.contactType).toUpperCase()) {
        case CONTACT_TYPE.CLAIMANT:
            return 'Claimant';
        case CONTACT_TYPE.INSURED:
            return 'Insured';
        case CONTACT_TYPE.MISC:
            return 'Misc';
        case CONTACT_TYPE.LOOKUP:
            return 'Lookup';
        case CONTACT_TYPE.INVOLVED:
            return 'Involved';
        default:
            return params.data.contactType ? params.data.contactType : '--';
    }
}