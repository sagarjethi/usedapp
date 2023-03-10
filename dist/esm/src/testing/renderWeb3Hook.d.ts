import { MockProvider } from 'ethereum-waffle';
import React from 'react';
export interface renderWeb3HookOptions<Tprops> {
    mockProvider?: MockProvider;
    readonlyMockProviders?: Record<number, MockProvider>;
    mockProviderOptions?: {
        pollingInterval?: number;
    };
    multicallVersion?: 1 | 2;
    renderHook?: {
        initialProps?: Tprops;
        wrapper?: React.ComponentClass<Tprops, any> | React.FunctionComponent<Tprops>;
    };
}
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
export declare const renderWeb3Hook: <Tprops, TResult>(hook: (props: Tprops) => TResult, options?: renderWeb3HookOptions<Tprops>) => Promise<{
    waitForCurrent: (predicate: (value: TResult) => boolean, step?: number, timeout?: number) => Promise<void>;
    waitForCurrentEqual: (value: TResult, step?: number, timeout?: number) => Promise<void>;
    result: import("@testing-library/react-hooks").RenderResult<TResult>;
    defaultProvider: MockProvider;
    mineBlock: () => Promise<void>;
    rerender: (props?: Tprops) => void;
    unmount: () => void;
    waitForNextUpdate: import("@testing-library/react-hooks").WaitForNextUpdate;
}>;
//# sourceMappingURL=renderWeb3Hook.d.ts.map