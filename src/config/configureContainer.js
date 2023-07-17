import {
    registerType
} from '../App/Core/Services/Container/ServiceContainer';
import {
    GraphCommunication
} from '../App/Core/Providers/GraphQL/GraphCommunication';
import {
    GraphOperation
} from '../App/Core/Providers/GraphQL/GraphOperation';
import {
    CLASS_KEYS
} from './ClassKeys';

export function configureContainer() {
    registerType(CLASS_KEYS.GraphCommunication, GraphCommunication);
    registerType(CLASS_KEYS.GraphOperation, GraphOperation);
}