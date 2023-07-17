/**
 * @typedef {object} ClaimPolicy
 * @property {string} policyID
 * @property {string} effectiveDate
 * @property {string} expirationDate
 * @property {string} insuredName
 * @property {string} insuredAddress
 * @property {string} insuredCityStateZip
 */

import { ensureNonEmptyString, ensureNonNullObject } from "./rules";
import { safeArray, safeObj, safeStr } from "./safeObject";

/**
 * Gets consolidated policy data in well known schema
 * @param {import("../State/slices/claim/types.d").ClaimMaster} claim
 * @returns {ClaimPolicy}
 */
export function getRealPolicy(claim, assocPolicies = []) {

    const { policy, claimPolicy } = claim;
    const mp = safeObj(claimPolicy);
    const ap = safeObj(safeArray(assocPolicies).find(p => p.isPrimary === true));

    const insAdr = (ensureNonNullObject(policy) ? `${safeStr(policy.insuredStreetName)}` : '');
    const insCsz = (ensureNonNullObject(policy) ? `${safeStr(policy.insuredCity)}, ${safeStr(policy.insuredState)} ${safeStr(policy.insuredZip)}` : '');

    return {
        policyID: safeStr(ensureNonNullObject(policy) ? claim.claimPolicyID : (mp.policyID || ap.policyID)),
        insuredName: (ensureNonNullObject(policy) ? `${safeStr(policy.insuredName)} ${safeStr(policy.insuredNameContinuation)}` : (ensureNonEmptyString(ap.insuredName) ? safeStr(ap.insuredName) : safeStr(mp.insuredName))).trim(),
        insuredAddress: insAdr,
        insuredCityStateZip: insCsz,
        effectiveDate: safeStr(ensureNonNullObject(policy) ? policy.effectiveDate : (ap.effectiveDate || mp.polEffDate)),
        expirationDate: safeStr(ensureNonNullObject(policy) ? policy.expirationDate : (ap.expirationDate || mp.polExpDate)),
    };
}