/**
 * @callback ToRawObject
 * @template X
 * @returns {X}
 */

/**
 * @callback HasProperty
 * @param {string} name - the property name
 * @returns {boolean}
 */

/**
 * @callback VoidFunc
 */

/**
 * @interface BindingModelProperty
 * @template DataType
 * @property {string} name - the property name
 * @property {DataType} value - gets the underlying data value
 * @property {boolean} showError - indicates if the field should show an error state
 * @property {string} error - the error message if any
 * @property {boolean} valid - indicates if the underlying data value is valid
 */

/**
 * @interface BindingModel
 * @template DataObj
 * @property {function} handleUserInput - bound for handling onChange events
 * @property {function} handleFinalizeInput - bound for handling onBlur events
 * @property {boolean} isValid - is the whole model valid
 * @property {boolean} hasChanges - are there changes on any property
 * @property {VoidFunc} acceptAllChanges - accepts all pending changes and clears hasChanges flags
 * @property {HasProperty} hasProperty - indicates if the Model has a bound property with the given name
 * @property 
 * @property {ToRawObject<DataObj>} toRawObject - returns underlying data for the model
 */