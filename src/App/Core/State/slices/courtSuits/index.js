import {
    SliceBuilder
} from '../SliceBuilder';
import {
    GetCourtSuits,
} from './queries/GetCourtSuits';
import {
    SaveCourtSuits,
} from './queries/SaveCourtSuits';


const courtSuitsSliceGet = new SliceBuilder('courtSuitsGet')
    .addThunkFromOperation('get', GetCourtSuits)
    .create();

const courtSuitsSliceSave = new SliceBuilder('courtSuitsSave')
    .addThunkFromOperation('save', SaveCourtSuits)
    .create();



export const CourtSuitsSliceGetReducer = courtSuitsSliceGet.rootReducer;
export const CourtSuitsSliceGetSelectors = courtSuitsSliceGet.selectors;
export const CourtSuitsSliceGetActions = courtSuitsSliceGet.actions;

export const CourtSuitsSliceSaveReducer = courtSuitsSliceSave.rootReducer;
export const CourtSuitsSliceSaveSelectors = courtSuitsSliceSave.selectors;
export const CourtSuitsSliceSaveActions = courtSuitsSliceSave.actions;

