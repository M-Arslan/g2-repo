import {
    useNotifications
} from '../NotificationProvider/NotificationProvider';
import {
    resolve
} from '../../Services/Container/ServiceContainer';
import { GraphOperation } from './GraphOperation';
import { ensureNonEmptyString } from '../../Utility/rules';

/**
 * useGraphQL is a React Hook to simplify GraphOperation usage.
 * @param {object} config - key/value object of "operationName": GraphOperationImplementationClass
 * @returns {object} - object with functions named for each config key to execute the supplied GraphOperation for that key
 */
export function useGraphQL(config) {
    const $notification = useNotifications();

    return Object.keys(config).reduce((rtn, k) => {
        return {
            ...rtn,
            [k]: async (...vars) => {

                const $api = resolve(config[k]);
                
                try {
                    const payload = await $api.execute(...vars);

                    if ($api.notify === true) {
                        $notification.notifySuccess($api.notifyMessage || 'Operation successful');
                    }

                    return payload;
                }
                catch (e) {
                    if ($api.isSilent !== true) {
                        const err = (ensureNonEmptyString($api.errorMessage) ? new Error($api.errorMessage) : e);
                        $notification.notifyError(err);
                    }
                    else {
                        return null;
                    }
                }
            }
        };
    }, {});
}

export function initApiClient(config) {
    return Object.keys(config).reduce((rtn, k) => {
        return {
            ...rtn,
            [k]: async (...vars) => {
                try {
                    /** @type {GraphOperation] */
                    const $api = resolve(config[k]);

                    try {
                        const payload = await $api.execute(...vars);
                        return payload;
                    }
                    catch (ex) {
                        if ($api.isSilent !== true) {
                            throw ex;
                        }
                        else {
                            return null;
                        }
                    }
                }
                catch (e) {
                    throw e;
                }
            }
        };
    }, {});
}