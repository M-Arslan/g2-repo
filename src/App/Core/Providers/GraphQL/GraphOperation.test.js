import {
    GraphOperation
} from './GraphOperation';
import {
    registerType,
    resolveType,
    clear
} from '../../Services/Container/ServiceContainer';
import {
    CLASS_KEYS
} from '../../../../config/ClassKeys';
import GraphCommunication from '../../../../__mocks__/GraphCommunication.mock';

/** @class */
class TestQuery extends GraphOperation {
    constructor() {
        super('SCHEMA', 'operation');

        this.defineFields('name', 'address');
    }
}

/** @class */
class TestMutation extends GraphOperation {
    constructor() {
        super('SCHEMA', 'operation', true);

        this.defineVariable('VAR', 'String');
        this.defineFields('name', 'address');
    }
}

describe('[GraphOperation] tests', () => {
    beforeAll(() => {
        registerType('TestQuery', TestQuery);
        registerType('TestMutation', TestMutation);
        registerType(CLASS_KEYS.GraphCommunication, GraphCommunication);

        global.window = {
            location: {
                protocol: 'https',
                host: 'localhost',
            }
        };
    });

    afterAll(() => {
        clear();
    });

    it('Should build query correctly', () => {

    });

    it('Should build the mutation correctly', () => {

    });
});