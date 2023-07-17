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
    GetCorrespondence
} from './queries/GetCorrespondence';
import {
    RemoveCorrespondence
} from './queries/RemoveCorrespondence';
import {
    SaveCorrespondence
} from './queries/SaveCorrespondence';


/** @type {import('./types.d').CorrespondenceSlice} */
const slice = new SliceBuilder('correspondence')
    .addThunkFromOperation('get', GetCorrespondence)
    .addThunkFromOperation('save', SaveCorrespondence)
    .addThunkFromOperation('delete', RemoveCorrespondence)
    .create();

export const correspondenceReducer = slice.rootReducer;
export const correspondenceSelectors = slice.selectors;
export const correspondenceActions = slice.actions;

watch(ASYNC_STATES.ERROR, 'There was a problem loading correspondence for the selected claim', slice.thunks.get);
watch(ASYNC_STATES.SUCCESS, 'The correspondence was saved successfully', slice.thunks.save);
watch(ASYNC_STATES.ERROR, 'There was an error saving the correspondence', slice.thunks.save);
watch(ASYNC_STATES.SUCCESS, 'The correspondence was successfully deleted', slice.thunks.delete);
watch(ASYNC_STATES.ERROR, 'There was an error deleting the correspondence', slice.thunks.delete);