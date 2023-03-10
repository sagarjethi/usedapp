import type { TransactionRequest, TransactionResponse } from '@ethersproject/abstract-provider';
import { TransactionStatus, TransactionOptions } from '../model';
import { BigNumber, Contract, Signer } from 'ethers';
import { SafeTransaction } from '../helpers/gnosisSafeUtils';
interface PromiseTransactionOpts {
    safeTransaction?: Partial<SafeTransaction>;
}
/**
 * @internal
 */
export declare function estimateTransactionGasLimit(transactionRequest: TransactionRequest | undefined, signer: Signer | undefined, gasLimitBufferPercentage: number): Promise<BigNumber | import("@ethersproject/bignumber").BigNumber>;
/**
 * @internal
 */
export declare function estimateContractFunctionGasLimit(contractWithSigner: Contract, functionName: string, args: any[], gasLimitBufferPercentage: number): Promise<BigNumber | undefined>;
export declare function usePromiseTransaction(chainId: number | undefined, options?: TransactionOptions): {
    promiseTransaction: (transactionPromise: Promise<TransactionResponse>, { safeTransaction }?: PromiseTransactionOpts, transactionRequest?: TransactionRequest) => Promise<import("@ethersproject/abstract-provider").TransactionReceipt>;
    state: TransactionStatus;
    resetState: () => void;
};
export {};
//# sourceMappingURL=usePromiseTransaction.d.ts.map