import {
    ASYNC_STATES
} from '../../../Enumerations/redux/async-states';
import {
    watch
} from '../app-status';
import {
    SliceBuilder
} from '../SliceBuilder';
import {
    GetLitigation
} from './queries/GetLitigation';
import {
    SaveLitigation
} from './queries/SaveLitigation';


/** @type {import('./types.d').LitigationSlice} */
const slice = new SliceBuilder('litigation')
    .addThunkFromOperation('get', GetLitigation)
    .addThunkFromOperation('save', SaveLitigation)
    .create();

export const litigationReducer = slice.rootReducer;
export const litigationSelectors = slice.selectors;
export const litigationActions = slice.actions;

watch(ASYNC_STATES.ERROR, 'There was a problem loading litigation for the selected claim', slice.thunks.get);
watch(ASYNC_STATES.SUCCESS, 'The litigation data was saved successfully', slice.thunks.save);
watch(ASYNC_STATES.ERROR, 'There was an error saving the litigation data', slice.thunks.save);
