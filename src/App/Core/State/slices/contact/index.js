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
    DeleteContact
} from './queries/DeleteContact';
import {
    GetContacts
} from './queries/GetContacts';
import {
    SaveContact
} from './queries/SaveContact';


/** @type {import('./types.d').ContactSlice} */
const slice = new SliceBuilder('contacts')
    .addThunkFromOperation('get', GetContacts)
    .addThunkFromOperation('save', SaveContact)
    .addThunkFromOperation('delete', DeleteContact)
    .create();

export const contactsReducer = slice.rootReducer;
export const contactsSelectors = slice.selectors;
export const contactsActions = slice.actions;

watch(ASYNC_STATES.ERROR, 'There was a problem loading contacts for the selected claim', slice.thunks.get);
watch(ASYNC_STATES.SUCCESS, 'The Contact was saved successfully', slice.thunks.save);
watch(ASYNC_STATES.ERROR, 'There was an error saving the contact', slice.thunks.save);
watch(ASYNC_STATES.SUCCESS, 'The Contact was successfully deleted', slice.thunks.delete);
watch(ASYNC_STATES.ERROR, 'There was an error deleting the contact', slice.thunks.delete);