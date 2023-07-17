import {
    flipObject
} from '../../Utility/flipObject';

export const TEMPLATE_TEXT = Object.freeze({
    SUBRO_SELECTION_NATIONAL: 1,
    SUBRO_SELECTION_COZEN: 2,
    PDOC_STATE_CA: 3,
    PDOC_STATE_NH: 4,
    PDOC_STATE_NY: 5,
    PDOC_STATE_WV: 6,
    PDOC_STATE_CT: 7,
    PDOC_STATE_RI: 8,
    PDOC_STATE_WA: 9,
    PROR_CA_SPECIFIC: 10,
    PROR_STATE_CA: 11,
    PROR_STATE_NJ: 12,
    PROR_STATE_NY: 13,
    PROR_STATE_CT: 14,
    PROR_STATE_NH: 15,
    PROR_STATE_RI: 16,
    PROR_STATE_WV: 17,
    PROR_STATE_WA: 18,
});

export const TEMPLATE_TEXT_LOOKUP = Object.freeze(flipObject(TEMPLATE_TEXT));