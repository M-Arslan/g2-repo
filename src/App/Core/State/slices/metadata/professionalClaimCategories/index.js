import {
    SliceBuilder
} from '../../SliceBuilder';
import {
    GetProfessionalClaimCategories
} from './queries/GetProfessionalClaimCategories';

/** @type {import('./types.d').ProfessionalClaimCategory} */
const slice = new SliceBuilder('professionalClaimCategories')
    .addThunkFromOperation('list', GetProfessionalClaimCategories)
    .create();

export const professionalClaimCategoryActions = slice.actions;
export const professionalClaimCategorySelectors = slice.selectors;
export const professionalClaimCategoryReducer = slice.rootReducer;