import {
    SliceBuilder
} from '../../SliceBuilder';
import {
    GetAuthorityAmount
} from './queries/GetAuthorityAmount';

/** @type {import('./types.d').AuthorityAmount} */
const slice = new SliceBuilder('authorityAmount')
    .addThunkFromOperation('get', GetAuthorityAmount)
    .addCustomSelectorFactory('getCurrentUserAuthorityAmount', (userID, g2LegalEntityID) => (state) => {
        let authorityAmountList = state.authorityAmount.data;
        authorityAmountList = (authorityAmountList || []).filter(X => X.userID.toLowerCase() === (userID || "").toLowerCase() && X.g2LegalEntityID === g2LegalEntityID);
        return authorityAmountList.length > 0 ? authorityAmountList[0] : null;

    })
    .create();

export const authorityAmountActions = slice.actions;
export const authorityAmountSelectors = slice.selectors;
export const authorityAmountReducer = slice.rootReducer;