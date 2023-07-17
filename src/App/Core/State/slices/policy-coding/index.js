import {
    createAsyncThunk
} from '@reduxjs/toolkit';
import {
    initApiClient
} from '../../../Providers/GraphQL/useGraphQL';
import {
    SliceBuilder
} from '../SliceBuilder';
import {
    GetExcess
} from './queries/GetExcess';
import {
    GetFacilities
} from './queries/GetFacilities';
import {
    GetFacilitiesPgm
} from './queries/GetFacilitiesPgm';
import {
    GetMedicalProf
} from './queries/GetMedicalProf';
import {
    GetPrimary
} from './queries/GetPrimary';
import {
    GetProperty
} from './queries/GetProperty';

// -- custom Thunk to handle query switching based on department
const thunk = createAsyncThunk('policy-codings/get', async (/** @type {import('./types.d').GetPolicyCodingArgs} */ args) => {

    const { policyID, dept } = args;

    const $api = initApiClient({
        excess: GetExcess,
        facilitiesPgm: GetFacilitiesPgm,
        facilities: GetFacilities,
        medicalProf: GetMedicalProf,
        primary: GetPrimary,
        property: GetProperty,
    });

    switch (dept) {
        case 1:
            return await $api.excess({ policyID });
        case 2:
            return await $api.property({ policyID });
        case 3:
            return await $api.primary({ policyID });
        case 4:
            return await $api.facilities({ policyID });
        case 6:
            return await $api.medicalProf({ policyID });
        case 7:
            return await $api.facilitiesPgm({ policyID });
        default:
            return [];
    }
});

/** @type {import('./types.d').PolicyCodingSlice} */
const slice = new SliceBuilder('policy-codings')
    .addReducerForThunk('get', thunk)
    .create();

export const policyCodingReducer = slice.rootReducer;
export const policyCodingSelectors = slice.selectors;
export const policyCodingActions = slice.actions;
