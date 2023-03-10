var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { useEffect, useMemo, useReducer } from 'react';
import { useDebouncePair, useBlockNumbers } from '../../../hooks';
import { MultiChainStatesContext } from './context';
import { useConfig } from '../../..';
import { useConnector, useReadonlyNetworks } from '../../network';
import { fromEntries } from '../../../helpers/fromEntries';
import { performMulticall } from '../common/performMulticall';
import { callsReducer, chainStateReducer, multicall1Factory, multicall2Factory } from '../common';
import { getCallsForUpdate, getUniqueActiveCalls } from '../../../helpers';
import { useDevtoolsReporting } from '../common/useDevtoolsReporting';
import { useChainId } from '../../../hooks/useChainId';
import { useWindow } from '../../window/context';
import { useUpdateNetworksState } from '../../network/readonlyNetworks/context';
function composeChainState(networks, state, multicallAddresses) {
    return fromEntries(Object.keys(networks).map((chainId) => [
        Number(chainId),
        {
            value: state[Number(chainId)],
            multicallAddress: multicallAddresses[Number(chainId)],
        },
    ]));
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const stripCall = (_a) => {
    var { isStatic, lastUpdatedBlockNumber } = _a, strippedCall = __rest(_a, ["isStatic", "lastUpdatedBlockNumber"]);
    return strippedCall;
};
/**
 * @internal Intended for internal use - use it on your own risk
 */
export function MultiChainStateProvider({ children, multicallAddresses }) {
    const { multicallVersion, fastMulticallEncoding } = useConfig();
    const networks = useReadonlyNetworks();
    const blockNumbers = useBlockNumbers();
    const dispatchNetworksState = useUpdateNetworksState();
    const isActive = useWindow();
    const [calls, dispatchCalls] = useReducer(callsReducer, []);
    const [state, dispatchState] = useReducer(chainStateReducer, {});
    const { reportError } = useConnector();
    const multicall = (multicallVersion === 1 ? multicall1Factory : multicall2Factory)(fastMulticallEncoding !== null && fastMulticallEncoding !== void 0 ? fastMulticallEncoding : false);
    const [debouncedCalls, debouncedNetworks] = useDebouncePair(calls, networks, 50);
    const uniqueCalls = useMemo(() => getUniqueActiveCalls(debouncedCalls), [debouncedCalls]);
    // used for deep equality in hook dependencies
    const uniqueCallsJSON = JSON.stringify(debouncedCalls.map(stripCall));
    const chainId = useChainId();
    useDevtoolsReporting(uniqueCallsJSON, uniqueCalls, chainId !== undefined ? blockNumbers[chainId] : undefined, multicallAddresses);
    function multicallForChain(chainId, provider) {
        if (!isActive) {
            return;
        }
        const blockNumber = blockNumbers[chainId];
        const multicallAddress = multicallAddresses[chainId];
        if (!provider || !blockNumber) {
            return;
        }
        if (debouncedNetworks !== networks) {
            // Wait for debounce to catch up.
            return;
        }
        const updatedCalls = getCallsForUpdate(debouncedCalls, { chainId, blockNumber });
        const callsOnThisChain = getUniqueActiveCalls(updatedCalls);
        if (callsOnThisChain.length > 0 && !multicallAddress) {
            reportError(new Error(`Missing multicall address for chain id ${chainId}`));
            return;
        }
        performMulticall(provider, multicall, multicallAddress, blockNumber, callsOnThisChain, dispatchState, chainId, (error) => {
            dispatchNetworksState({
                type: 'ADD_ERROR',
                chainId,
                error,
            });
        });
        dispatchCalls({ type: 'UPDATE_CALLS', calls, updatedCalls, blockNumber, chainId });
    }
    useEffect(() => {
        var _a, _b;
        for (const [_chainId, provider] of Object.entries(networks)) {
            const chainId = Number(_chainId);
            // chainId is in provider is not the same as the chainId in the state wait for chainId to catch up
            if (chainId === ((_a = provider.network) === null || _a === void 0 ? void 0 : _a.chainId) || chainId === ((_b = provider._network) === null || _b === void 0 ? void 0 : _b.chainId)) {
                multicallForChain(chainId, provider);
            }
        }
    }, [networks, multicallAddresses, uniqueCallsJSON, blockNumbers]);
    const chains = useMemo(() => composeChainState(networks, state, multicallAddresses), [
        state,
        multicallAddresses,
        networks,
    ]);
    const provided = { chains, dispatchCalls };
    return <MultiChainStatesContext.Provider value={provided} children={children}/>;
}
//# sourceMappingURL=provider.js.map