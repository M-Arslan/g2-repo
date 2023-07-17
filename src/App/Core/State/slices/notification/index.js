import {
    SliceBuilder
} from '../SliceBuilder';
/* GET , POST QUERIES HERE */
import { getSupportTypes } from './queries/getSupportTypes';


const supportTypeSlice = new SliceBuilder('supportType')
    .addThunkFromOperation('get', getSupportTypes)
    .create();



export const supportTypeReducer = supportTypeSlice.rootReducer;
export const supportTypeSelectors = supportTypeSlice.selectors;
export const supportTypeActions = supportTypeSlice.actions;

