import { expect } from 'chai';
import { useConfig, useUpdateConfig } from './useConfig';
import { renderDAppHook, setupTestingConfig } from '../../src/testing';
import { Kovan } from '../model';
describe('useConfig', () => {
    it('default', async () => {
        const { result, waitForCurrent } = await renderDAppHook(useConfig, {
            config: {},
        });
        await waitForCurrent((val) => val != undefined);
        expect(result.current['pollingInterval']).to.eq(15000);
    });
    it('custom value', async () => {
        const { result, waitForCurrent } = await renderDAppHook(useConfig, {
            config: { readOnlyChainId: 1 },
        });
        await waitForCurrent((val) => val != undefined);
        expect(result.current['readOnlyChainId']).to.eq(1);
    });
    it('default testing config', async () => {
        var _a, _b, _c;
        const setup = await setupTestingConfig();
        const { result, waitForCurrent } = await renderDAppHook(() => useConfig(), { config: setup.config });
        await waitForCurrent((val) => val !== undefined);
        expect(result.error).to.be.undefined;
        expect((_a = result.current.networks) === null || _a === void 0 ? void 0 : _a.length).to.eq(53);
        expect((_b = result.current.notifications) === null || _b === void 0 ? void 0 : _b.checkInterval).to.eq(500);
        expect((_c = result.current.notifications) === null || _c === void 0 ? void 0 : _c.expirationPeriod).to.eq(5000);
    });
    it('merged defaults and custom values', async () => {
        var _a, _b, _c;
        const setup = await setupTestingConfig();
        const config = Object.assign(Object.assign({}, setup.config), { notifications: {
                checkInterval: 101,
                expirationPeriod: undefined, // Expecting to be filled by defaults.
            }, networks: [Kovan] });
        const { result, waitForCurrent } = await renderDAppHook(() => useConfig(), { config });
        await waitForCurrent((val) => val !== undefined);
        expect(result.error).to.be.undefined;
        expect((_a = result.current.networks) === null || _a === void 0 ? void 0 : _a.length).to.eq(1);
        expect((_b = result.current.notifications) === null || _b === void 0 ? void 0 : _b.checkInterval).to.eq(101);
        expect((_c = result.current.notifications) === null || _c === void 0 ? void 0 : _c.expirationPeriod).to.eq(5000);
    });
});
describe('useUpdateConfig', () => {
    it('updates config', async () => {
        const { result, waitForCurrent } = await renderDAppHook(() => {
            const config = useConfig();
            const updateConfig = useUpdateConfig();
            return { config, updateConfig };
        }, {
            config: { readOnlyChainId: 1 },
        });
        await waitForCurrent((val) => val != undefined);
        expect(result.current.config['pollingInterval']).to.eq(15000);
        result.current.updateConfig({ pollingInterval: 10 });
        await waitForCurrent((val) => val.config.pollingInterval != 15000);
        expect(result.current.config['pollingInterval']).to.eq(10);
    });
    it('deep updates', async () => {
        const multicallAddresses = { 1: '0x1', 2: '0x2' };
        const { result, waitForCurrent } = await renderDAppHook(() => {
            const config = useConfig();
            const updateConfig = useUpdateConfig();
            return { config, updateConfig };
        }, {
            config: { readOnlyChainId: 1, multicallAddresses },
        });
        await waitForCurrent((val) => val != undefined);
        expect(result.current.config['multicallAddresses']).to.deep.eq(multicallAddresses);
        result.current.updateConfig({ pollingInterval: 10, multicallAddresses: { 3: '0x3' } });
        await waitForCurrent((val) => val.config.pollingInterval != 15000);
        expect(result.current.config['multicallAddresses']).to.deep.eq(Object.assign(Object.assign({}, multicallAddresses), { 3: '0x3' }));
    });
});
//# sourceMappingURL=useConfig.test.js.map