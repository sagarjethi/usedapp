import detectEthereumProvider from '@metamask/detect-provider';
import { providers } from 'ethers';
import { isWebSocketProvider } from './isWebSocketProvider';
const GET_METAMASK_LINK = 'https://metamask.io/download.html';
export async function getInjectedProvider(getPollingInterval) {
    var _a;
    if (!window.ethereum) {
        window.open(GET_METAMASK_LINK);
        return undefined;
    }
    const injectedProviders = (window === null || window === void 0 ? void 0 : window.ethereum.providers) || [];
    const injectedProvider = (_a = injectedProviders.find((provider) => {
        var _a;
        return (_a = provider.isMetaMask) !== null && _a !== void 0 ? _a : false;
    })) !== null && _a !== void 0 ? _a : (await detectEthereumProvider());
    if (!injectedProvider) {
        window.open(GET_METAMASK_LINK);
        return undefined;
    }
    const provider = new providers.Web3Provider(injectedProvider, 'any');
    const chainId = await provider.send('eth_chainId', []);
    if (!isWebSocketProvider(provider)) {
        provider.pollingInterval = getPollingInterval(chainId);
    }
    return provider;
}
//# sourceMappingURL=injectedProvider.js.map