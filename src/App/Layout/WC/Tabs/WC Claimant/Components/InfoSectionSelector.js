import React from 'react';
import { WCClaimantInfoSection } from './WCClaimantInfoSection';


export const InfoSectionSelector = ({ claim, request, dispatch, formValidator, onSave }) => {
    switch (request.selectedMenu) {
        case "WCCLAIMANT":
            return <WCClaimantInfoSection claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} onSave={onSave} />
            break;
        default:
            return null;
    }
}




