
import { Chain } from '../../constants'
import { getAddressLink, getTransactionLink } from '../../helpers/chainExplorerLink'

const mantleTestnetEtherscanUrl = 'https://explorer.testnet.mantle.xyz/'



export const MantleTestnet: Chain = {
  chainId: 5001,
  chainName: 'MantleTestnet',
  isTestChain: true,
  isLocalChain: false,
  multicallAddress: '0xCc449cdB77476927bb2Dd69196FA23E200a40d8F',
  nativeCurrency: {
    name: 'Mantle Testnet',
    symbol: 'BIT',
    decimals: 18,
  },
  blockExplorerUrl: mantleTestnetEtherscanUrl,
  getExplorerAddressLink: getAddressLink(mantleTestnetEtherscanUrl),
  getExplorerTransactionLink: getTransactionLink(mantleTestnetEtherscanUrl),
}

export default {
  MantleTestnet
}
