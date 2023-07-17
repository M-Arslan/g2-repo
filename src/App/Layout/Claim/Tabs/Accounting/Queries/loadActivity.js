import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const loadOpenActivity = async (activityID) => {
    let query = {
        "query": `
            query {
               activity(activityID:"${activityID}"){ 
                    activityID
                    claimMasterID
                    accountingTransTypeID
                    urgent
                    sendNoticeToReinsurance
                    createdBy
                    modifiedBy
                    createdDate
                    modifiedDate
                    qAConferChecked
                    qAFRSIChecked
                    qAGenServeChecked
                    taskOwner
                    claimStatusTypeID
                    claimStatusTypeType
                    {
                        claimStatusTypeID
                        statusText
                    }
                    accountingTransType{
                        accountingTransTypeID
                        accountingTransTypeText
                    }
                    workflowTask  {
                        workflowTaskID
                        notificationUserID
                        subID
                        comment
                        claimStatusTypeID
                        active
                        createdBy
                        createdDate
                        modifiedBy
                        modifiedDate
                    }    
                    openRegistrations
                    {
                        activityID
                        openRegistrationID
                        causeOfLossCode
                        typeOfLoss
                        cATCode
                        descriptionOfOccurence
                        examinerDiaryDate
                        injuriesOrDamages
                        lossReserveTotal
                        supervisorDiaryDate
                        expenseReserveTotal
                        companyPaidLoss
                        companyLossReserves
                        companyPaidExpense
                        companyExpenseReserve
                        cededPaidLoss
                        cededLossReserves
                        cededPaidExpense
                        cededExpenseReserve
                        acr
                        aer
                        authorityCheckAmount
                        comments
                        medPayReserveTotal
                        supervisorUserID
                        supervisorDiaryDate
                        createdDate
                        createdBy
                        modifiedBy
                        modifiedDate
                        openRegistrationClaimants
                        {
                            openRegistrationClaimantID
                            openRegistrationID
                            lossReserve
                            medPayReserve
                            expenseReserve
                            claimantID
                            createdDate
                            createdBy
                            modifiedBy
                            modifiedDate
                        }
                        openRegistrationCoverages
                        {
                            openRegistrationCoverageID
                            openRegistrationID
                            policyID
                            coverageCode
                            classCode
                            createdDate
                            createdBy
                            modifiedBy
                            modifiedDate
                        }
                    }
                } 
            }
            `
    }

    return await customGQLQuery(`accounting`, query);
};

export const loadWCTabularUpdateActivity = async (activityID) => {
    let query = {
        "query": `
            query {
               activity(activityID:"${activityID}"){ 
                    activityID
                    claimMasterID
                    accountingTransTypeID
                    urgent
                    sendNoticeToReinsurance
                    createdBy
                    modifiedBy
                    createdDate
                    modifiedDate
                    qAConferChecked
                    qAFRSIChecked
                    qAGenServeChecked
                    taskOwner
                    claimStatusTypeID
                    claimStatusTypeType
                    {
                        claimStatusTypeID
                        statusText
                    }
                    accountingTransType{
                        accountingTransTypeID
                        accountingTransTypeText
                    }
                    workflowTask  {
                        workflowTaskID
                        notificationUserID
                        subID
                        comment
                        claimStatusTypeID
                        active
                        createdBy
                        createdDate
                        modifiedBy
                        modifiedDate
                    }    
                    wCTabularUpdate
                    {
                        activityID
                        wcTabularUpdateID
                        companyFinancialDate
                        companyIndemnityPaid
                        companyIndemnityReserves
                        companyMedicalPaid
                        companyMedicalReserves
                        companyExpensePaid
                        companyExpenseReserves
                        companySubroSIF
                        comments
                        caraDocs
                        beginningIndemnityPaid
                        beginningIndemnityReserves
                        beginningExpensePaid
                        beginningExpenseReserves
                        beginningACR
                        beginningAER
                        cededIndemnityPaid
                        cededIndemnityReserves
                        cededExpensePaid
                        cededExpenseReserves
                        cededACR
                        cededAER
                        totalIncuredChangeAmount
                        createdDate
                        createdBy
                        modifiedBy
                        modifiedDate
                    }
                } 
            }
            `
    }

    return await customGQLQuery(`accounting`, query);
};

export const loadMLASuppressionsActivity = async (activityID) => {
    let query = {
        "query": `
            query {
               activity(activityID:"${activityID}"){ 
                    activityID
                    claimMasterID
                    accountingTransTypeID
                    urgent
                    sendNoticeToReinsurance
                    createdBy
                    modifiedBy
                    createdDate
                    modifiedDate
                    qAConferChecked
                    qAFRSIChecked
                    qAGenServeChecked
                    taskOwner
                    claimStatusTypeID
                    claimStatusTypeType
                    {
                        claimStatusTypeID
                        statusText
                    }
                    accountingTransType{
                        accountingTransTypeID
                        accountingTransTypeText
                    }
                    workflowTask  {
                        workflowTaskID
                        notificationUserID
                        subID
                        comment
                        claimStatusTypeID
                        active
                        createdBy
                        createdDate
                        modifiedBy
                        modifiedDate
                    }    
                    mLASuppression{
                          activityID
                          additionalDetail
                          createdBy
                          createdDate
                          mLASuppressionID
                          mLASuppressionReasonTypeID
                          modifiedBy
                          modifiedDate     
                    }
                }
                    
            }
            `
    }

    return await customGQLQuery(`accounting`, query);
};

export const loadSpecialInstructionsActivity = async (activityID) => {
    let query = {
        "query": `
            query {
               activity(activityID:"${activityID}"){ 
                    activityID
                    claimMasterID
                    accountingTransTypeID
                    urgent
                    sendNoticeToReinsurance
                    createdBy
                    modifiedBy
                    createdDate
                    modifiedDate
                    qAConferChecked
                    qAFRSIChecked
                    qAGenServeChecked
                    taskOwner
                    claimStatusTypeID
                    claimStatusTypeType
                    {
                        claimStatusTypeID
                        statusText
                    }
                    accountingTransType{
                        accountingTransTypeID
                        accountingTransTypeText
                    }
                    specialInstructions{
                        specialInstructionID
                        draftNumber
                        reason
                        recoveryType
                        recoveryAmount
                        comment
                        activityID
                        createdBy
                        createdDate
                        modifiedBy
                        modifiedDate     
                    }
                }
                    
            }
            `
    }

    return await customGQLQuery(`accounting`, query);
};

export const loadReserveChangeActivity = async (activityID) => {
    let query = {
        "query": `
            query {
               activity(activityID:"${activityID}"){ 
                    activityID
                    claimMasterID
                    accountingTransTypeID
                    urgent
                    sendNoticeToReinsurance
                    createdBy
                    modifiedBy
                    createdDate
                    modifiedDate
                    qAConferChecked
                    qAFRSIChecked
                    qAGenServeChecked
                    taskOwner
                    claimStatusTypeID
                    claimStatusTypeType
                    {
                        claimStatusTypeID
                        statusText
                    }
                    accountingTransType{
                        accountingTransTypeID
                        accountingTransTypeText
                    }
                    workflowTask  {
                        workflowTaskID
                        notificationUserID
                        subID
                        comment
                        claimStatusTypeID
                        active
                        createdBy
                        createdDate
                        modifiedBy
                        modifiedDate
                    }    
                    reserveChanges{
                        reserveChangeID
                        endingLossReserve
                        endingExpenseReserve
                        currentLossReserve
                        currentExpenseReserve
                        endingMedPayReserve
                        activityID
                        companyPaidLoss
                        companyLossReserves
                        companyPaidExpense
                        companyExpenseReserve
                        cededPaidLoss
                        cededLossReserves
                        cededPaidExpense
                        cededExpenseReserve
                        acr
                        aer
                        beginningCededLossReserve
                        beginningCededExpenseReserve
                        beginningACR
                        beginningAER
                        mlaAuthorityCheckAmount
                        medPayReserveTotal
                        comments
                        createdBy
                        createdDate
                        modifiedBy
                        modifiedDate
                    }
                }
                    
            }
            `
    }

    return await customGQLQuery(`accounting`, query);
};

export const loadReopenActivity = async (activityID) => {
    let query = {
        "query": `
            query {
               activity(activityID:"${activityID}"){ 
                    activityID
                    claimMasterID
                    accountingTransTypeID
                    urgent
                    sendNoticeToReinsurance
                    createdBy
                    modifiedBy
                    createdDate
                    modifiedDate
                    qAConferChecked
                    qAFRSIChecked
                    qAGenServeChecked
                    taskOwner
                    claimStatusTypeID
                    claimStatusTypeType
                    {
                        claimStatusTypeID
                        statusText
                    }
                    accountingTransType{
                        accountingTransTypeID
                        accountingTransTypeText
                    }
                    reopens{
                        reopenID
                        endingLossReserve
                        endingExpenseReserve
                        endingMedPayReserve
                        activityID
                        createdBy
                        createdDate
                        modifiedBy
                        modifiedDate
                    }
                    workflowTask  {
                        workflowTaskID
                        notificationUserID
                        subID
                        comment
                        claimStatusTypeID
                        active
                        createdBy
                        createdDate
                        modifiedBy
                        modifiedDate
                    }  
                }
                    
            }
            `
    }

    return await customGQLQuery(`accounting`, query);
};

export const loadFileCIBActivity = async (activityID) => {
    let query = {
        "query": `
            query {
               activity(activityID:"${activityID}"){ 
                    activityID
                    claimMasterID
                    accountingTransTypeID
                    urgent
                    sendNoticeToReinsurance
                    createdBy
                    modifiedBy
                    createdDate
                    modifiedDate
                    claimStatusTypeType
                    {
                        claimStatusTypeID
                        statusText
                    }
                    accountingTransType
                    {
                        accountingTransTypeID
                        accountingTransTypeText
                    }
               }
        }`
    }
    return await customGQLQuery(`accounting`, query);
};

export const loadCloseActivity = async (activityID) => {
    let query = {
        "query": `
            query {
               activity(activityID:"${activityID}"){ 
                    activityID
                    claimMasterID
                    accountingTransTypeID
                    urgent
                    sendNoticeToReinsurance
                    createdBy
                    modifiedBy
                    createdDate
                    modifiedDate
                    qAConferChecked
                    taskOwner
                    qAFRSIChecked
                    qAGenServeChecked
                    claimStatusTypeID
                    claimStatusTypeType
                    {
                        claimStatusTypeID
                        statusText
                    }
                    accountingTransType
                    {
                        accountingTransTypeID
                        accountingTransTypeText
                    }
                    workflowTask  {
                        workflowTaskID
                        notificationUserID
                        subID
                        comment
                        claimStatusTypeID
                        active
                        createdBy
                        createdDate
                        modifiedBy
                        modifiedDate
                    }
                    close   {
                        activityID
                        closeID
                        cededPaidLoss
                        cededLossReserves
                        cededPaidExpense
                        cededExpenseReserve
                        acr
                        aer
                        totalIncuredChangeAmount
                        createdDate
                        createdBy
                        modifiedBy
                        modifiedDate
                    }
               }
        }`
    }
    return await customGQLQuery(`accounting`, query);
};

export const loadPaymentActivity = async (activityID) => {
    let query = {
        "query": `
            query {
               activity(activityID:"${activityID}"){ 
                    activityID
                    claimMasterID
                    accountingTransTypeID
                    urgent
                    sendNoticeToReinsurance
                    createdBy
                    modifiedBy
                    createdDate
                    modifiedDate
                    qAConferChecked
                    qAFRSIChecked
                    qAGenServeChecked
                    taskOwner
                    claimStatusTypeID
                    claimStatusTypeType
                    {
                        claimStatusTypeID
                        statusText
                    }
                    accountingTransType{
                        accountingTransTypeID
                        accountingTransTypeText
                    }
                    workflowTask  {
                        workflowTaskID
                        notificationUserID
                        subID
                        comment
                        claimStatusTypeID
                        active
                        createdBy
                        createdDate
                        modifiedBy
                        modifiedDate
                    }    
                    payments{
                      activityID
                      createdBy
                      createdDate
                      modifiedBy
                      modifiedDate
                      paymentID

                    lossReserveTotal
                    lossDescCode
                    expenseReserveTotal
                    expenseDescCode
                    companyPaidLoss
                    companyLossReserves
                    companyPaidExpense
                    companyExpenseReserve
                    cededPaidLoss
                    cededLossReserves
                    cededPaidExpense
                    cededExpenseReserve
                    acr
                    aer
                    beginningCededPaidLoss
                    beginningCededPaidExpense
                    beginningCededLossReserve
                    beginningCededExpenseReserve
                    beginningACR
                    beginningAER
                    mlaAuthorityCheckAmount
                    paymentAuthorityCheckAmount
                    reserveAuthorityCheckAmount
                    comment

                    companyFinancialDate
                    companyMedicalPaid
                    companyMedicalReserves
                    companySubroSIF
                    payee
                    vendorNumber
                    paymentComment
                    caraDocs

                      paymentTypeCode
                      paymentVendors{
                        accountingInstructions
                        checkComment
                        createdBy
                        createdDate
                        draftNumber
                        invoiceNumber
                        mailToAddressCity
                        mailToAddressState
                        mailToAddressStreet1
                        mailToAddressStreet2
                        mailToAddressZIP
                        mailToAttention
                        mailToName
                        modifiedBy
                        modifiedDate
                        payeeAddressCity
                        payeeAddressState
                        mailToAddressStreet1
                        mailToAddressStreet2
                        mailToAddressZIP
                        payeeName
                        payeeName2
                        payeeAddressStreet1
                        payeeAddressStreet2
                        payeeAddressCity
                        payeeAddressState
                        payeeAddressZIP
                        paymentAmount
                        paymentID
                        paymentType
                        paymentTypeCode
                        paymentVendorID
                        vendorCode
                        taxID
                        transCode
                        transCodeDescription
                        accountingTransCode
                        {
                            transCode
                            transCodeDesc
                            category
                            reserveChange
                        }
                      }
                      paymentWires{
                        bankABANumber
                        bankAccountNumber
                        bankAddressCity
                        bankAddressState
                        bankAddressStreet1
                        bankAddressStreet2
                        bankAddressZIP
                        bankCreditAccountOf
                        bankMessage
                        bankName
                        createdBy
                        createdDate
                        modifiedBy
                        modifiedDate
                        paymentID
                        paymentVendorID
                        paymentWireID
                        wireAmount
                        wireCurrencyISO
                      }
                    }
                }
                    
            }
            `
    }

    return await customGQLQuery(`accounting`, query);
};

export const loadGenesisMLAActivity = async (activityID) => {
    let query = {
        "query": `
            query {
               activity(activityID:"${activityID}"){ 
                    activityID
                    claimMasterID
                    accountingTransTypeID
                    urgent
                    sendNoticeToReinsurance
                    createdBy
                    modifiedBy
                    createdDate
                    modifiedDate
                    qAConferChecked
                    qAFRSIChecked
                    qAGenServeChecked
                    taskOwner
                    claimStatusTypeID
                    claimStatusTypeType
                    {
                        claimStatusTypeID
                        statusText
                    }
                    accountingTransType{
                        accountingTransTypeID
                        accountingTransTypeText
                    }
                    workflowTask  {
                        workflowTaskID
                        notificationUserID
                        subID
                        comment
                        claimStatusTypeID
                        active
                        createdBy
                        createdDate
                        modifiedBy
                        modifiedDate
                    }    
                    genesisMLA{
                        genesisMLAID
                        claimMasterID
                        activityID
                        associatedActivityID
                        associatedActivityAmount
                        uWDivison
                        injury
                        reason
                        associatedActivityName
                        createdBy
                        createdDate
                        modifiedBy
                        modifiedDate
                    }
                }
                    
            }
            `
    }

    return await customGQLQuery(`accounting`, query);
};

export const loadReimbursementPaymentActivity = async (activityID) => {
    let query = {
        "query": `
            query {
               activity(activityID:"${activityID}"){ 
                    activityID
                    claimMasterID
                    accountingTransTypeID
                    urgent
                    sendNoticeToReinsurance
                    createdBy
                    modifiedBy
                    createdDate
                    modifiedDate
                    qAConferChecked
                    taskOwner
                    qAFRSIChecked
                    qAGenServeChecked
                    claimStatusTypeID
                    claimStatusTypeType
                    {
                        claimStatusTypeID
                        statusText
                    }
                    accountingTransType
                    {
                        accountingTransTypeID
                        accountingTransTypeText
                    }
                    workflowTask  {
                        workflowTaskID
                        notificationUserID
                        subID
                        comment
                        claimStatusTypeID
                        active
                        createdBy
                        createdDate
                        modifiedBy
                        modifiedDate
                    }                
               }
        }`
    }
    return await customGQLQuery(`accounting`, query);
};

export const findActivityAcrossReimbursement = async (wCReimbursementID) => {
    let query = {
        "query": `
            query {
               reimbursmentPaymentActivity(wCReimbursementID:"${wCReimbursementID}"){
                    reimbursementPaymentActivityID
                    activityID
                    wcReimbursementID
                    createdBy
                    modifiedBy
                    createdDate
                    modifiedDate
               }
        }`
    }
    return await customGQLQuery(`reimbursement-payment-activity`, query);
};

export const findReimbursementAcrossActivity = async (activityID) => {
    let query = {
        "query": `
            query {
               reimbursmentIDByActivityID(activityID:"${activityID}"){
                    reimbursementPaymentActivityID
                    activityID
                    wcReimbursementID
                    createdBy
                    modifiedBy
                    createdDate
                    modifiedDate
               }
        }`
    }
    return await customGQLQuery(`reimbursement-payment-activity`, query);
};
