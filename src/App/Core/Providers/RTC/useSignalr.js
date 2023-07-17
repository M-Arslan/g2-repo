import {
    HubConnectionBuilder
} from '@microsoft/signalr';
import {
    uuid
} from '../../Utility/uuid';

const Events = {
    NOTIFICATIONS_UPDATED: 'new-notifications',
};

export const RTC_EVENTS = Object.freeze(Events);

const $connection = new HubConnectionBuilder().withUrl('/notification-hub').withAutomaticReconnect().build();
const $router = new Map();
const $keyTable = new Map();

let isConnectionOpen = false;

//Object.keys(Events).forEach(evt => {
//    $router.set(evt, []);

//    $connection.on(evt, (data) => {
//        $router.get(evt).forEach(handler => {
//            try {
//                handler(data);
//            }
//            catch (e) {
//                console.error(`Error in RTC handler for event "${evt}":`, e);
//            }
//        });
//    });
//});

$connection.start()
    .then(() => {
        isConnectionOpen = true;
        console.warn('SignalR hub connection established successfully.');

    })
    .catch((ex) => {
        isConnectionOpen = false;
        console.warn('[useSignalR] unable to connect to hub:', ex);
    });
export function useSignalR() {
    return {
        isConnected: () => isConnectionOpen === true,
        subscribe: (evt, callback) => {
            $connection.on(evt, message => {
                console.log("SignalR Client recieved message on event "+Events.NOTIFICATIONS_UPDATED, message);
                callback(message);
            });
        }
    }
}
//export function useSignalR_Old() {
//    return {
//        isConnected: () => isConnectionOpen === true,
//        subscribe: (evt, callback) => {
//            if ($router.has(evt) === false) {
//                console.warn(`Attempted to subscribe to an unknown event: ${evt}`);
//                return null;
//            }

//            const key = uuid();
//            $router.get(evt).push({ key, callback });
//            $keyTable.set(key, evt);
//            return key;
//        },
//        unsubscribe: (key) => {
//            if (isConnectionOpen !== true) {
//                return;
//            }

//            if ($keyTable.has(key) !== true) {
//                console.warn('Attempting to unsubscribe an unknown handler key');
//                return;
//            }

//            const evt = $keyTable.get(key);
//            const pos = $router.get(evt).findIndex(handler => handler.key === key);
//            if (pos > -1) {
//                $router.get(evt).splice(pos, 1);
//            }
//        }
//    }
//}