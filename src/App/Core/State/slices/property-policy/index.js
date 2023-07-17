import {
    SliceBuilder
} from '../SliceBuilder';
import {
    GetPropertyPolicy
} from './queries/GetPropertyPolicy';


/** @type {import('./types.d').PropertyPolicySlice} */
const slice = new SliceBuilder('property-policy')
    .addReducer('stuff', (state, action) => {
        state.data = action.payload;
    })
    .addThunkFromOperation('get', GetPropertyPolicy)
    .create();

export const propertyPolicyReducer = slice.rootReducer;
export const propertyPolicySelectors = slice.selectors;
export const propertyPolicyActions = slice.actions;
