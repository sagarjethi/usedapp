import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { DAppProvider } from '../providers';
import { getWaitUtils, IdentityWrapper } from './utils';
/**
 * Next version of {@link renderWeb3Hook}.
 *
 * @internal
 * Internal until it's ready and stable.
 *
 * Differences from {@link renderWeb3Hook}:
 * The rendering happens at much higher level, closer to reality.
 * It takes a Config object and renders the hook under test in a `DAppProvider`,
 * which mimicks the real useDApp usage.
 *
 * @param hook Hook under test
 * @param options Optional options, same as in `renderHook`
 * @returns Same as in `renderHook`, with additions of helper functions.
 */
export const renderDAppHook = async (hook, options) => {
    var _a, _b, _c;
    const UserWrapper = (_b = (_a = options === null || options === void 0 ? void 0 : options.renderHook) === null || _a === void 0 ? void 0 : _a.wrapper) !== null && _b !== void 0 ? _b : IdentityWrapper;
    const { result, waitForNextUpdate, rerender, unmount } = renderHook(hook, {
        wrapper: (wrapperProps) => {
            var _a;
            return (<DAppProvider config={(_a = options === null || options === void 0 ? void 0 : options.config) !== null && _a !== void 0 ? _a : {}}>
        <UserWrapper {...wrapperProps}/>
      </DAppProvider>);
        },
        initialProps: (_c = options === null || options === void 0 ? void 0 : options.renderHook) === null || _c === void 0 ? void 0 : _c.initialProps,
    });
    return Object.assign({ result,
        rerender,
        unmount,
        // do not return the waitFor* functions from `renderHook` - they are not usable after using waitForNextUpdate().
        waitForNextUpdate }, getWaitUtils(result));
};
//# sourceMappingURL=renderDAppHook.js.map