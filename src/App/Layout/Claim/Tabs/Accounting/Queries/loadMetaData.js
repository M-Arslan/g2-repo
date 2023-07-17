import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';
import { ROLES } from '../../../../../Core/Enumerations/security/roles';

export const loadAccountingTransType = async () => {
    let query = {
        "query": `
            query {
               accountingTranstypeList{ 
                    accountingTransTypeID
                    accountingTransTypeText
                    newActivityVisible
                    groupName
                    active
                    createdDate
                    createdBy
                } 
            }
            `
    }

    return await customGQLQuery(`accounting`, query);
};
export const loadMLAThresholdList = async () => {
    let query = {
        "query": `
            query {
               mlaThresholdList{ 
                    mlaThresholdID
                    g2LegalEntityID
                    claimType
                    thresholdAmount
                    modifiedDate
                    modifiedBy
                    createdDate
                    createdBy
                } 
            }
            `
    }

    return await customGQLQuery(`accounting`, query);
};
export const loadAccountingTransCode = async () => {
    let query = {
        "query": `
            query {
               accountingTransCodeList{ 
                    transCode
                    transCodeDesc
                    reserveChange
                    category
                    active
                } 
            }
            `
    }

    return await customGQLQuery(`accounting`, query);
};

export const loadMLASuppressionReasonTypes = async () => {
    let query = {
        "query": `
            query {
               mlaSuppressionReasonTypeList{ 
                    mLASuppressionReasonTypeID
                    mLASuppressionReasonTypeText
                } 
            }
            `
    }

    return await customGQLQuery(`accounting`, query);
};
export const loadCauseOfLossCodes = async () => {
    let query = {
        "query": `
            query {
               causeOfLossCodesList{ 
                    code
                    description
                    active
                    createdDate
                    createdBy
                } 
            }
            `
    }

    return await customGQLQuery(`accounting`, query);
};


export const findAcitivityTypeUIByAcitivityType = (accountingTransTypeID) => {
    let id = parseInt(accountingTransTypeID);

    switch (id) {
        case 1:
        case 14:
        case 15:
            return "OPENCLAIMACTIVTY"
            break;
        case 2:
            return "CLOSECLAIMACTIVITY"
            break;
        case 16:
            return "MLASUPPRESSIONCLAIMACTIVTY"
            break;
        case 3:
        case 5:
        case 10:
        case 26:
        case 27:
        case 29:
            return "EXPENSEPAYMENTCLAIMACTIVITY"
            break;
        case 9:
        case 11:
        case 12:
        case 13:
        case 17:
        case 18:
        case 19:
        case 20:
            return "SPECIALINSTRUCTIONSACTIVTY"
            break;
        case 7:
            return "REOPENACTIVTY"
            break;
        case 8:
            return "RESERVECHANGEACTIVTY"
            break;
        case 21:
            return "INITIALRINOTICE"
            break;
        case 22:
            return "DEDUCTIBLECOLLECTION"
            break;
        case 23:
            return "FILECIB"
            break;
        case 25:
            return "GENESISMLA"
            break;
        case 28:
        case 30:
            return "WCTABULARUPDATECLAIMACTIVITY"
            break;
        case 31:
            return "REQUESTREIMBURSEMENTPAYMENT"
            break;
        default:
            return "FINANCIAL";
    }

}
export const findMenusToDisplay = (accountingTransTypeID) => {
    let menu = findAcitivityTypeUIByAcitivityType(accountingTransTypeID);

    switch (menu) {
        case "OPENCLAIMACTIVTY":
            return ["OPENCLAIMACTIVTY","ISSUELOG"]
            break;
        case "MLASUPPRESSIONCLAIMACTIVTY":
            return ["MLASUPPRESSIONCLAIMACTIVTY", "ISSUELOG"]
            break;
        case "EXPENSEPAYMENTCLAIMACTIVITY":
            return ["EXPENSEPAYMENTCLAIMACTIVITY", "VENDORDETAILS", "WIREPAYMENTDETAILS","ISSUELOG"]
            break;
        case "SPECIALINSTRUCTIONSACTIVTY":
            return ["SPECIALINSTRUCTIONSACTIVTY", "ISSUELOG"]
            break;
        case "REOPENACTIVTY":
            return ["REOPENACTIVTY", "ISSUELOG"]
            break;
        case "RESERVECHANGEACTIVTY":
            return ["RESERVECHANGEACTIVTY", "ISSUELOG"]
            break;
        case "INITIALRINOTICE":
            return ["FINANCIAL", "ISSUELOG"]
            break;
        case "DEDUCTIBLECOLLECTION":
            return ["FINANCIAL", "ISSUELOG"]
            break;
        case "FINANCIAL":
            return ["FINANCIAL", "PRIORCLAIMACTIVITY","CLAIMFINANCIAL"]
            break;
        case "CLOSECLAIMACTIVITY":
            return ["CLOSECLAIMACTIVITY", "ISSUELOG"]
            break;
        case "GENESISMLA":
            return ["GENESISMLA"];
        case "WCTABULARUPDATECLAIMACTIVITY":
            return ["WCTABULARUPDATECLAIMACTIVITY"];
        case "REQUESTREIMBURSEMENTPAYMENT":
            return ["REQUESTREIMBURSEMENTPAYMENT"]
            break;
        default:
            return "";
    }

}
export const loadAccountants = async () => {
    let query = {
        "query": `
            query {
               users{ 
                    userID
                    firstName
                    lastName
                    fullName
                    managerID
                    emailAddress
                    branchID
                    userRoles{
                        roleID
                    }
                } 
            }
            `
    }

    let accountantRoleIDs = [ROLES.Claims_Accountant];
    let userResult = await customGQLQuery(`user`, query);
    userResult = ((userResult.data || {}).users || []);
    userResult = userResult.filter(userR => userR.userRoles.some((ur) => accountantRoleIDs.includes(ur.roleID)));
    return userResult;
};

export const loadSupervisors = async () => {
    let query = {
        "query": `
            query {
               users{ 
                    userID
                    firstName
                    lastName
                    fullName
                    managerID
                    emailAddress
                    branchID
                    userRoles{
                        roleID
                    }
                } 
            }
            `
    }
    let supervisorsRoleIDs = [ROLES.Senior_Management, ROLES.Unit_Manager, ROLES.Sr_Unit_Manager];
    let supervisors = await customGQLQuery(`user`, query);
    supervisors = ((supervisors.data || {}).users || []);
    supervisors = supervisors.filter(supp => supp.userRoles.some((ur) => supervisorsRoleIDs.includes(ur.roleID)));
    return supervisors;
};
export const getLossExpenseReserve = async (claimID) => {
    let query = {
        "query": `
            query {
               getLossExpenseReserve(claimID:"${claimID}"){ 
                    expenseReserves
                    lossReserves
                    medPayExpenseReserves
                    medPayLossReserves
                }
            }
            `
    }

    return await customGQLQuery(`claims-common`, query);
};
export const searchDB2Claims = async (searchType, searchTerm) => {
    let query = {
        "query": `
            query {
               search(filterType:"${searchType}",filterValue:"${searchTerm}"){ 
                claimID
                statusCode
                statusText
                insuredName
                insuredNameContinuation
                policyID
                }
            }
            `
    }

    return await customGQLQuery(`db2claims`, query);
};
export const searchDB2Vendors = async (vendorName) => {
    let query = {
        "query": `
            query {
               db2VendorSearch(vendorName:"${vendorName}"){ 
                vendorName1
                vendorName2
                address
                city
                state
                postalCode
                vendorCode
                taxIDIndicator
                }
            }
            `
    }

    return await customGQLQuery(`accounting`, query);
};
export const getAuthorityAmountList = async () => {
    let query = {
        "query": `
            query {
               getAuthorityAmountList{ 
                    authorityAmountID
                    userID
                    genServeID
                    g2LegalEntityID
                    legalEntityManagerID
                    reserveAmount
                    paymentAmount  
                }
            }
            `
    }

    return await customGQLQuery(`claims-common`, query);
};
export const loadCurrencyTypeList = async () => {
    let query = {
        "query": `
            query {
               currencyTypeList{ 
                    iSO
                    name
                    active
                } 
            }
            `
    }

    return await customGQLQuery(`accounting`, query);
};
export const loadPriorPayments = async (claimID, payeeNum, legalEntityID) => {
    let query = {
        "query": `
            query {
               priorPayments(claimID:"${claimID}",payeeNum:"${payeeNum}",g2LegalEntityID:"${legalEntityID}"){ 
                    invoiceNumber
                    amount
                    draftID
                    issuedDate
                    voidDate
                    payeeNumber
                } 
            }
            `
    }

    return await customGQLQuery(`claims-common`, query);
};
export const loadClaimDetail = async (id) => {
    let query = {
        query: `query { 
                    detail(id:"${id}") { 
                        claimMasterID
                        claimID
                        claimPolicyID
                        claimType
                        lossDesc
                        fullDescriptionOfLoss
                        ichronicleID
                        batchID
                        genReCompanyName
                        dateReceived
                        lossLocation
                        dOL
                        claimExaminerID
                        claimBranchID
                        g2LegalEntityID
                        deptCD
                        uwDept
                        senderEmail
                        fALClaimStatusTypeID
                        extendedReportingPeriod
                        createdDate
                        createdBy
                        policy {
                            cancelDate
                            claimsMadeDate
                            clientBusinessName
                            departmentCode
                            effectiveDate
                            expirationDate
                            insuredCity
                            insuredName
                            insuredZip,
                            insuredStreetName,
                            insuredNameContinuation
                            insuredState
                            policyBranch
                            underwriterID
                            mailingCity
                            departmentName
                        }
                        claimPolicy {
                            claimPolicyID
                            policyID
                            insuredName
                            polEffDate
                            polExpDate
                            createdDate
                            createdBy
                        }
                    } 
                }
            `
    };

    return await customGQLQuery('claim-master', query);
};
export const loadIssueTypeList = async () => {
    let query = {
        "query": `
            query {
               issueTypeList{ 
                    issueTypeID
                    issueTypeText
                    active
                    createdDate
                    createdBy
                } 
            }
            `
    }

    return await customGQLQuery(`accounting`, query);
};

export async function getQAPendingRandom() {

    const uri = `${window.location.protocol}//${window.location.host}/api/auth/GetQAPendingRandom`;

    let resposne = await fetch(uri, {
        method: 'Get',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    let result = await resposne.text();
    return result;


//    return fetch(uri, {
//        method: 'Get',
//        headers: {
//            'Content-Type': 'application/json',
//        },
//    })
//        .then(response => {
//            var result = response.text().then(text => {
//                LicenseManager.setLicenseKey(text);
//                console.log(text);
//            })
//        });
}
