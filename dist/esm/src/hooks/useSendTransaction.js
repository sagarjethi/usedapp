import { useConfig } from './useConfig';
import { useEthers } from './useEthers';
import { estimateTransactionGasLimit, usePromiseTransaction } from './usePromiseTransaction';
import { useReadonlyNetworks } from '../providers/network/readonlyNetworks/context';
import { getSignerFromOptions } from '../helpers/getSignerFromOptions';
import { sanitizeTransactionRequest } from '../helpers/gnosisSafeUtils';
/**
 * Hook returns an object with three variables: `state`, `resetState`, and `sendTransaction`.
 *
 * ``state` represents the status of transaction. See {@link TransactionStatus}.
 *
 * `resetState` can be used to reset the state to `None` after a transaction attempt has either succeeded or failed.
 *
 * To send a transaction use `sendTransaction` function returned by `useSendTransaction`.
 *
 * Function accepts a [Transaction Request](https://docs.ethers.io/v5/api/providers/types/#providers-TransactionRequest) object as a parameter.
 * @public
 * @param options additional options of type {@link TransactionOptions}
 * @returns {} object with two variables: `sendTransaction` and `state`: `{ sendTransaction: (...args: any[]) => void, state: TransactionStatus }`.
 *
 * @example
 * const { sendTransaction, state } = useSendTransaction({ transactionName: 'Send Ethereum' })
 *
 * const handleClick = () => {
 *   ...
 *   sendTransaction({ to: address, value: utils.parseEther(amount) })
 * }
 */
export function useSendTransaction(options) {
    var _a, _b, _c;
    const { library, chainId } = useEthers();
    const transactionChainId = (options && 'chainId' in options && (options === null || options === void 0 ? void 0 : options.chainId)) || chainId;
    const { promiseTransaction, state, resetState } = usePromiseTransaction(transactionChainId, options);
    const config = useConfig();
    const gasLimitBufferPercentage = (_c = (_b = (_a = options === null || options === void 0 ? void 0 : options.gasLimitBufferPercentage) !== null && _a !== void 0 ? _a : options === null || options === void 0 ? void 0 : options.bufferGasLimitPercentage) !== null && _b !== void 0 ? _b : config === null || config === void 0 ? void 0 : config.gasLimitBufferPercentage) !== null && _c !== void 0 ? _c : 0;
    const providers = useReadonlyNetworks();
    const provider = (transactionChainId && providers[transactionChainId]);
    const sendTransaction = async (transactionRequest) => {
        var _a, _b, _c;
        const signer = getSignerFromOptions(provider, options, library);
        if (signer) {
            const gasLimit = await estimateTransactionGasLimit(transactionRequest, signer, gasLimitBufferPercentage);
            const sanitizedTransaction = sanitizeTransactionRequest(Object.assign(Object.assign({}, transactionRequest), { gasLimit }));
            return promiseTransaction(signer.sendTransaction(sanitizedTransaction), {
                safeTransaction: {
                    to: sanitizedTransaction.to,
                    value: (_a = sanitizedTransaction.value) === null || _a === void 0 ? void 0 : _a.toString(),
                    data: (_b = sanitizedTransaction.data) === null || _b === void 0 ? void 0 : _b.toString(),
                    safeTxGas: (_c = sanitizedTransaction.gasLimit) === null || _c === void 0 ? void 0 : _c.toString(),
                },
            }, transactionRequest);
        }
    };
    return { sendTransaction, state, resetState };
}
//# sourceMappingURL=useSendTransaction.js.map