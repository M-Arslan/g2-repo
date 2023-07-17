import {
    flipObject
} from '../../Utility/flipObject';

export const PERMISSIONS = Object.freeze({
    VIEWER: 1,
    CONTRIBUTOR: 2,
    ADMINISTRATOR: 3,
});

export const PERMISSIONS_LOOKUP = Object.freeze(flipObject(PERMISSIONS));