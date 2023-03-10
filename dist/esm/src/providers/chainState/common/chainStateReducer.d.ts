import { ChainState } from './model';
export interface State {
    [chainId: number]: {
        blockNumber: number;
        state?: ChainState;
        error?: unknown;
    } | undefined;
}
/**
 * @internal Intended for internal use - use it on your own risk
 */
export type ChainStateAction = FetchSuccess | FetchError;
interface FetchSuccess {
    type: 'FETCH_SUCCESS';
    chainId: number;
    blockNumber: number;
    state: ChainState;
}
interface FetchError {
    type: 'FETCH_ERROR';
    chainId: number;
    blockNumber: number;
    error: unknown;
}
/**
 * @internal Intended for internal use - use it on your own risk
 */
export declare function chainStateReducer(state: State, action: ChainStateAction): State;
export {};
//# sourceMappingURL=chainStateReducer.d.ts.map