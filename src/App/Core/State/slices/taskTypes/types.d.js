/**
 * @typedef object TaskType
 * @property {string} taskTypeID
 * @property {string} sequenceNumber
 * @property {string} active
 * @property {string} createdBy
 * @property {string} createdDate
 * @property {string} modifiedBy
 * @property {string} modifiedDate
/**
* Actions for the Task Type slice
*
* @typedef {object} TaskTypeActions
* @property {Function} get
*/

/**
 *  Task Type selectors
 *
 * @typedef {import('../../types.d').BaseListSelectors<TaskType>}  TaskTypeSelectors
 */

/** @typedef {import('../../types.d').StateSlice< TaskTypeActions,  TaskTypeSelectors>}  TaskTypeSlice */

export const KEY = 'TASK_TYPE_TYPES';