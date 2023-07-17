import {
    registerType,
    resolveType,
    isRegistered,
    clear
} from './ServiceContainer';

/** @class */
class Dummy { }

/** @class */
class SubDummy {
    static get inject() {
        return { testDummy: 'DUMMY' };
    }
}

describe('[ServiceContainer] should function as an IOC Container', () => {

    beforeEach(() => {
        clear();
    });

    it('Should register a type', () => {
        const tn = 'TEST_TYPE';
        registerType(tn, Dummy);
        expect(isRegistered(tn)).toBe(true);
    });

    it('Should resolve a previously registered type', () => {
        const tn = 'A_TEST_CLASS';
        registerType(tn, Dummy);
        const DT = resolveType(tn);
        expect(DT.constructor.name).toBe('Dummy');
        expect((DT instanceof Dummy)).toBe(true);
    });

    it('Should return null when a type is not registered', () => {
        const rs = resolveType('NOT_REGISTERED_TYPE');
        expect(rs).toBe(null);
    });

    it('Should resolve injected types', () => {
        const tn = 'DUMMY';
        const sn = 'SUB_DUMMY';
        registerType(tn, Dummy);
        registerType(sn, SubDummy);

        const SD = resolveType(sn);
        expect(SD instanceof SubDummy).toBe(true);
        expect(SD.testDummy instanceof Dummy).toBe(true);
    });
});