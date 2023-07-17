import React from 'react';
import {
    ExcessDepartmentCodingSection
} from './ClaimPolicyGrids/ExcessDepartmentCodingSection';
import {
    FacilitiesPGMPolicyCodingSection
} from './ClaimPolicyGrids/FacilitiesPGMPolicyCodingSection';
import {
    FacilitiesPolicyCodingSection
} from './ClaimPolicyGrids/FacilitiesPolicyCodingSection';
import {
    MedicalProfPolicyCodingSection
} from './ClaimPolicyGrids/MedicalProfPolicyCodingSection';
import {
    PrimaryPolicyPolicyCodingSection
} from './ClaimPolicyGrids/PrimaryPolicyPolicyCodingSection';
import {
    PropertyPolicyCodingSection
} from './ClaimPolicyGrids/PropertyPolicyCodingSection';


export const OpenClaimActivityCoverages = ({ dept, policyID, request, dispatch, formValidator, isViewer  }) => {
    if (!policyID)
        return null;
    if (!dept)
        return null;
    let currentClaimActivity = request.currentClaimActivity || {};
    let currentOpenRegistrations = currentClaimActivity.openRegistrations || {};
    let currentOpenRegistrationCoverages = currentOpenRegistrations.openRegistrationCoverages || [];


    dept = parseInt(dept);
    // For Testing
    //return <div>
    //    <ExcessDepartmentCodingSection policyID={policyID} />
    //    <PropertyPolicyCodingSection policyID={policyID} />
    //    <PrimaryPolicyPolicyCodingSection policyID={policyID} />
    //    <FacilitiesPolicyCodingSection policyID={policyID} />
    //    <MedicalProfPolicyCodingSection policyID={policyID} />
    //    <FacilitiesPGMPolicyCodingSection policyID={policyID} />
    //</div>;
    function onRowSelected(e) {
        if (isViewer) {
            return;
        }
        if (e.node.selected) {
            function findCoverage(X) {
                return X.policyID === e.data.policyID && X.coverageCode === e.data.coverageCode && X.classCode === e.data.classCode;
            }
            let index = currentOpenRegistrationCoverages.findIndex(findCoverage);
            if (index === -1) {
                currentOpenRegistrationCoverages.push({ policyID: e.data.policyID, coverageCode: e.data.coverageCode, classCode: e.data.classCode });
            }
        } else {
            currentOpenRegistrationCoverages = currentOpenRegistrationCoverages.filter(x => (!(x.policyID === e.data.policyID && x.coverageCode === e.data.coverageCode && x.classCode === e.data.classCode) && !(x.policyID === e.data.policyID && !x.coverageCode && !x.classCode)));
        }
        currentOpenRegistrations.openRegistrationCoverages = currentOpenRegistrationCoverages;
        currentClaimActivity.openRegistrations = currentOpenRegistrations;
        request.currentClaimActivity = currentClaimActivity;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentClaimActivity: currentClaimActivity } });
    }

    switch (dept) {
        case 1: //Excess
            return <ExcessDepartmentCodingSection request={request} policyID={policyID} onRowSelected={onRowSelected} isViewer={isViewer}/>
            break;
        case 2: //Property
            return <PropertyPolicyCodingSection request={request} policyID={policyID} onRowSelected={onRowSelected} isViewer={isViewer}/>
            break;
        case 3: //Primary
            return <PrimaryPolicyPolicyCodingSection request={request} policyID={policyID} onRowSelected={onRowSelected} isViewer={isViewer}/>
            break;
        case 4: //Facilities
            return <FacilitiesPolicyCodingSection request={request} policyID={policyID} onRowSelected={onRowSelected} isViewer={isViewer}/>
            break;
        case 6: //Medical Prof.
            return <MedicalProfPolicyCodingSection request={request} policyID={policyID} onRowSelected={onRowSelected} isViewer={isViewer}/>
            break;
        case 7: //Facilities Prog.
            return <FacilitiesPGMPolicyCodingSection request={request} policyID={policyID} onRowSelected={onRowSelected} isViewer={isViewer}/>
            break;
        default:
            return null;
    }
};