import {
    flipObject
} from '../../Utility/flipObject';

export const ROLES = Object.freeze({
    Division_Manager: 1,
    Unit_Manager: 2,
    Claims_Counsel: 3,
    Claims_Examiner: 4,
    Sr_Claims_Examiner: 5,
    Claims_Executive: 6,
    Sr_Claims_Executive: 7,
    Sr_Claims_Attorney: 8,
    Claims_Attorney: 9,
    Claims_Assistant: 10,
    Contractor: 11,
    Team_Leader: 12,
    Senior_Management: 13,
    Sr_Unit_Manager: 14,
    Medicare_Administrator: 15,
    Claims_Accountant: 16,
    Expense_Admin: 17,
    Security_Admin: 18,
    Lookup_Admin: 19,
});

export const ROLES_LOOKUP = Object.freeze(flipObject(ROLES));