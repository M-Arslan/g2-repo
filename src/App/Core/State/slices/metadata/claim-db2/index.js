import {
    SliceBuilder
} from '../../SliceBuilder';
import {
    GetClaimDB2
} from './queries/GetClaimDB2';

import {
    GetConferClaimDB2
} from './queries/GetConferClaimDB2';

import {
    GetFSRIClaimDB2
} from './queries/GetFSRIClaimDB2';

/** @type {import('./types.d').ClaimDB2} */
const slice = new SliceBuilder('claimDB2')
    .addThunkFromOperation('get', GetClaimDB2)
    .create();


const conferSlice = new SliceBuilder('conferClaimDB2')
    .addThunkFromOperation('get', GetConferClaimDB2)
    .create();


const fsriSlice = new SliceBuilder('fsriClaimDB2')
    .addThunkFromOperation('get', GetFSRIClaimDB2)
    .create();


export const claimDB2Actions = slice.actions;
export const claimDB2Selectors = slice.selectors;
export const claimDB2Reducer = slice.rootReducer;


export const conferClaimDB2Actions = conferSlice.actions;
export const conferClaimDB2Selectors = conferSlice.selectors;
export const conferClaimDB2Reducer = conferSlice.rootReducer;



export const fsriClaimDB2Actions = fsriSlice.actions;
export const fsriClaimDB2Selectors = fsriSlice.selectors;
export const fsriClaimDB2Reducer = fsriSlice.rootReducer;