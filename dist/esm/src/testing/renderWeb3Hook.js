import { MockProvider } from 'ethereum-waffle';
import { renderHook } from '@testing-library/react-hooks';
import { MultiChainStateProvider, ConfigProvider } from '../providers';
import React from 'react';
import { deployMulticall, deployMulticall2, getWaitUtils, IdentityWrapper, mineBlock } from './utils';
import { BlockNumbersProvider } from '../providers/blockNumber/blockNumbers';
import { ConnectorContextProvider, ReadonlyNetworksProvider } from '../providers/network';
/**
 * A utility function for testing React hooks in useDApp ecosystem.
 *
 * It wraps a `renderHook` from `@testing-library/react-hooks`,
 * adding functionality related to:
 * - initializing web3 providers,
 * - auto-deploying multicall,
 * - adding helpers such as `mineBlock`,
 * - adding necessary useDApp context providers.
 *
 * @public
 * @param hook Hook under test
 * @param options Optional options, same as in `renderHook`
 * @returns Same as in `renderHook`, with additions of helper functions.
 */
export const renderWeb3Hook = async (hook, options) => {
    var _a, _b, _c, _d;
    const providers = {};
    const multicallAddresses = {};
    const addSingleProvider = async (currentProvider) => {
        const { chainId } = await currentProvider.getNetwork();
        providers[chainId] = currentProvider;
        const multicallDeployer = (options === null || options === void 0 ? void 0 : options.multicallVersion) === 2 ? deployMulticall2 : deployMulticall;
        const mockMulticallAddresses = await multicallDeployer(currentProvider, chainId);
        multicallAddresses[chainId] = mockMulticallAddresses[chainId];
        // In some occasions the block number lags behind.
        // It leads to a situation where we try to read state of a block before the multicall contract is deployed,
        // and it results in a failed call. So we force the provider to catch up on the block number here.
        await currentProvider.getBlockNumber();
    };
    const defaultProvider = (options === null || options === void 0 ? void 0 : options.mockProvider) || new MockProvider();
    await addSingleProvider(defaultProvider);
    const readOnlyProviders = (_a = options === null || options === void 0 ? void 0 : options.readonlyMockProviders) !== null && _a !== void 0 ? _a : {};
    for (const chainIdString in readOnlyProviders) {
        const chainId = Number(chainIdString);
        await addSingleProvider(readOnlyProviders[chainId]);
    }
    if (Object.keys(readOnlyProviders).length === 0) {
        const defaultReadOnlyProvider = new MockProvider();
        await addSingleProvider(defaultReadOnlyProvider);
        const { chainId } = await defaultReadOnlyProvider.getNetwork();
        readOnlyProviders[chainId] = defaultReadOnlyProvider;
    }
    const UserWrapper = (_c = (_b = options === null || options === void 0 ? void 0 : options.renderHook) === null || _b === void 0 ? void 0 : _b.wrapper) !== null && _c !== void 0 ? _c : IdentityWrapper;
    const { result, waitForNextUpdate, rerender, unmount } = renderHook(hook, {
        wrapper: (wrapperProps) => {
            var _a, _b;
            return (<ConfigProvider config={{
                    readOnlyUrls: readOnlyProviders,
                    pollingInterval: (_b = (_a = options === null || options === void 0 ? void 0 : options.mockProviderOptions) === null || _a === void 0 ? void 0 : _a.pollingInterval) !== null && _b !== void 0 ? _b : 200,
                    multicallVersion: options === null || options === void 0 ? void 0 : options.multicallVersion,
                }}>
        <ConnectorContextProvider>
          <ReadonlyNetworksProvider providerOverrides={readOnlyProviders}>
            <BlockNumbersProvider>
              <MultiChainStateProvider multicallAddresses={multicallAddresses}>
                <UserWrapper {...wrapperProps}/>
              </MultiChainStateProvider>
            </BlockNumbersProvider>
          </ReadonlyNetworksProvider>
        </ConnectorContextProvider>
      </ConfigProvider>);
        },
        initialProps: (_d = options === null || options === void 0 ? void 0 : options.renderHook) === null || _d === void 0 ? void 0 : _d.initialProps,
    });
    return Object.assign({ result,
        defaultProvider, mineBlock: async () => {
            await Promise.all([defaultProvider, ...Object.values(readOnlyProviders)].map((provider) => mineBlock(provider)));
        }, rerender,
        unmount,
        // do not return the waitFor* functions from `renderHook` - they are not usable after using waitForNextUpdate().
        waitForNextUpdate }, getWaitUtils(result));
};
//# sourceMappingURL=renderWeb3Hook.js.map