import {
    SliceBuilder
} from '../../SliceBuilder';
import {
    GetTemplateTexts
} from './queries/GetTemplateTexts';

/** @type {import('./types.d').TemplateTextSlice} */
const slice = new SliceBuilder('templateTexts')
    .addThunkFromOperation('get', GetTemplateTexts)
    .create();

export const templateTextActions = slice.actions;
export const templateTextSelectors = slice.selectors;
export const templateTextReducer = slice.rootReducer;