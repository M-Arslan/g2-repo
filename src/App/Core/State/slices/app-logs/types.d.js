/**
 * @typedef {object} AppLog
 * @property {string} timestamp
 * @property {string} message
 * @property {number} level
 * @property {string} context
 * 
 */

/**
 * @typedef {object} GetAppLogsArgs
 * @property {number} level
 * @property {Date} start
 * @property {Date} end
 */

/**
 * @callback GetAppLogsCreator
 * @param {GetAppLogsArgs} args
 * @returns {import('redux').Action}
 */

/**
 * @typedef {object} WriteAppLogArgs
 * @property {AppLog} log
 */

/** 
 * @callback WriteAppLogCreator
 * @param {WriteAppLogArgs} args
 * @returns {import('redux').Action}
 */

/**
 * Actions for the AppLog slice
 *
 * @typedef {object} AppLogActions
 * @property {GetAppLogsCreator} get
 * @property {WriteAppLogCreator} save
 */

/**
 * @typedef {import('../types.d').BaseListSelectors<AppLog>} AppLogSelectors
 */

/**
 * @typedef {import('../types.d').StateSlice<AppLogActions, AppLogSelectors>} AppLogSlice
 */

export const KEY = 'APPLOG_TYPES';