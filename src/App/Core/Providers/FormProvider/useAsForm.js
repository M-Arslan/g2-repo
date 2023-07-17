import React, { Component } from 'react';
import {
    makeEvent
} from '../../Utility/makeEvent';
import {
    ensureNonEmptyArray,
    ensureNonEmptyString,
    ensureNonNullObject
} from '../../Utility/rules';
import { FormRule } from './rules/FormRule';
import { Model } from './model/Model';
import { Schema } from './model/Schema';




const FormWrapper = ({ onValidityChanged, onRequestChanged, onFieldBlur, initialRequest, Component, rules, formatters, id = '', ...rest }) => {


    const getRequest = (model) => Object.keys(model).reduce((req, key) => ({ ...req, [key]: model[key].value }), {});

    const isModelValid = (model) => {
        return Object.keys(model).every(key => {
            const f = model[key];
            if (f.valid !== true) {
                console.warn(`[FormWrapper] invalid field "${key}" in form "${id}": ${f.error}`);
            }
            return (f.valid === true);
        });
    };

    /**
     * Reports model validity to any listeners
     * @param {Model} model
     */
    const reportValidity = (model) => {
        if (typeof onValidityChanged === 'function') {
            const m = processRules(model, true);
            const name = (ensureNonEmptyString(id) ? id : 'unnamed-form');
            const evt = makeEvent(name, (isModelValid(m) === true));
            onValidityChanged(evt);
        }
    };

    /**
     * Handles value changed events on form fields
     * @param {Event} evt
     */
    const onValueChanged = (evt) => {
        const { name, value } = evt.target;

        const upd = processRules({
            ...model,
            [name]: {
                value,
                error: null,
                valid: true,
                touched: true,
            }
        });

        if (typeof onValidityChanged === 'function') {
            onValidityChanged(makeEvent(id, isModelValid(upd)));
        }

        if (typeof onRequestChanged === 'function') {
            onRequestChanged(getRequest(upd));
        }

        updateModel(upd);
    };

    /**
     * Handles the event that finalizes a field value
     * @param {Event} evt
     */
    const onFinalize = (evt) => {
        const { name, value } = evt.target;

        const format = (typeof formatters[name] === 'function' ? formatters[name](value) : (v) => v);

        const upd = processRules({
            ...model,
            [name]: {
                key: name,
                value: format(value),
                error: null,
                valid: false,
                touched: true,
            }
        });

        if (typeof onValidityChanged === 'function') {
            console.log(`[useAsForm::onFinalize] blur in ${name} (${value})`, model[name]);
            onValidityChanged(makeEvent(id, isModelValid(upd)));
        }

        if (typeof onFieldBlur === 'function') {
            onFieldBlur(getRequest(upd));
        }

        updateModel(upd);
    }

    /**
     * Processes the full model
     * @param {Model} model - current form model
     * @param {boolean} untouched - validate untouched fields
     */
    const processRules = (model, untouched = false) => {
        return Object.keys(model).reduce((m, key) => {
            const fld = model[key];
            const mfld = (untouched === true || fld.touched === true ? validateField(fld) : fld);
            return { ...m, [key]: mfld };
        }, {});
    };

    /**
     * Processes the rules on a given field
     * @param {ModelField} field - the field to validate
     * @returns {ModelField}
     */
    const validateField = (field) => {

        /** @type {Array<FormRule>} */
        const ruleLS = rules[field.key];

        if (ensureNonEmptyArray(ruleLS)) {
            const state = ruleLS.reduce((s, rule) => {
                if (s.valid !== true) {
                    return s;
                }

                return rule.verify(field.value);

            }, { valid: true, error: null });

            if (state.valid !== true) {
                console.warn(`[FormWrapper::validateField] error in ${field.key}: ${state.error}`);
            }

            return { ...field, ...state };
        }
        else {
            return { ...field, valid: true, error: null };
        }
    };

    const [model, updateModel] = React.useState(Object.keys(initialRequest).reduce((m, key) => {
        return {
            ...m,
            [key]: {
                key,
                value: initialRequest[key],
                error: null,
                valid: true,
                touched: false,
            }
        };
    }, {}));

    React.useEffect(() => {
        const m = (ensureNonNullObject(model) ? model : {});
        reportValidity(m);
    }, [initialRequest]);

    return <Component model={model} onValueChanged={onValueChanged} onFieldBlur={onFinalize} onValidityChanged={onValidityChanged} {...rest} />;
}

/**
 * useAsForm wraps a Form in a HOC within a form tag
 * @param {React.Component} component - Component to wrap in the HOC
 * @param {object} [rules] - digest of rules for request field validation
 * @param {object} [formatters] - diget of formatters for request fields
 * @returns {React.Component}
 */
export const useAsForm = (component, rules, formatters) => {

    rules = (ensureNonNullObject(rules) ? rules : {});
    formatters = (ensureNonNullObject(formatters) ? formatters : {});

    return (props) => <form autoComplete="off"><FormWrapper Component={component} rules={rules} formatters={formatters} {...props} /></form>;
}


/**
 * useAsForm wraps a Form in a HOC
 * @param {React.Component} component - Component to wrap in the HOC
 * @param {object} [rules] - digest of rules for request field validation
 * @param {object} [formatters] - diget of formatters for request fields
 * @returns {React.Component}
 */
export const useAsFormSegment = (component, rules, formatters) => {
    rules = (ensureNonNullObject(rules) ? rules : {});
    formatters = (ensureNonNullObject(formatters) ? formatters : {});

    return (props) => <FormWrapper Component={component} rules={rules} formatters={formatters} {...props} />;

}

/**
 * @typedef {object} EventTarget
 * @template TT
 * @property {string} name
 * @property {TT} value
 */

/**
 * @typedef {object} Event
 * @template T
 * @property {EventTarget<T>} target - the event target/originator
 */

/**
 * @typedef {object} OnFinalizeEventArgs
 * @property {boolean} modified - indicates if a property value has changed since initializing the Model
 * @property {boolean} valid - inidicates whether or not the Model passes all validation checks
 * @property {object} request - underlying data object for the finalized Model
 */

/**
 * @callback OnFinalizeHandler
 * @param {Event<OnFinalizedEventArgs>} evt
 * @returns {boolean}
 */

/**
 * @typedef {object} FormProps
 * @property {string} id - unique id for the form component
 * @property {object} [initialRequest=null] - the initialization data for the form model
 * @property {OnFinalizeHandler} [onFinalize] - callback when the model is finalized
 */

/**
 * Wraps a supplied component in a Model aware HOC to provide built in state management.
 * @param {Component} Component - component to wrap in the HOC
 * @param {Schema} schema - schema of the form's model
 * @returns {Component<FormProps>}
 */
export const asForm = (Component, schema) => {

    /**
     * HOC
     * @param {FormProps} props - component properties
     * @returns {Component<FormProps>}
     */
    return ({ id, initialRequest, onFinalize, onInitialize, ...rest }) => {

        // -- track the model in state to ensure rerenders on value changes
        const [stateModel, setStateModel] = React.useState(null);

        // -- Initialize the form model and wrap in proxy for easier property access
        React.useEffect(() => {
            const traps = {
                get: (target, name) => {
                    return (name in target ? target[name] : (target.hasProperty(name) ? target.property(name) : undefined));
                },
                has: (target, name) => {
                    return (name in target || target.hasProperty(name));
                },
                ownKeys: (target) => {
                    return Object.keys(target).concat(target.properties.map(p => p.name));
                }
            };

            const model = new Model(schema,
                (/** @type {Model} */ m) => {
                    setStateModel(new Proxy(m, traps));
                },
                (/** @type {Model} */ m) => {
                    if (typeof onFinalize === 'function') {
                        if (m.isValid !== true) {
                            console.warn('[asForm] errors in finalized model:', m.allErrors);
                        }
                        const accepted = onFinalize(makeEvent((id || 'unknown-entity'), { request: m.toRawObject(), valid: m.isValid, modified: m.hasChanges }));
                        if (accepted === true) {
                            m.acceptAllChanges();
                        }
                    }
                }
            );


            /** @type {Model} */
            const modelProxy = new Proxy(model, traps);

            if (ensureNonNullObject(initialRequest)) {
                modelProxy.initialize(initialRequest);

                if (typeof onInitialize === 'function') {
                    onInitialize(makeEvent(id, { valid: modelProxy.isValid }));
                }
            }

            setStateModel(modelProxy);

        }, [initialRequest]);

        // -- avoid trying to bind form to null model
        if (ensureNonNullObject(stateModel) !== true) {
            return <span></span>;
        }


        return <Component id={id} model={stateModel} {...rest} />;
    }
}