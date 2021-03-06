// Configs irrelated to network
const CHAIN_MAPPING = {
  1: 'Mainnet',
  3: 'Ropsten',
  42: 'Kovan',
  4: 'Rinkeby',
  128: 'Heco',
  256: 'Heco Test',
}

export const ChainsInfo = {
  1: {
    chainId: 1,
    chainName: 'Ethereum',
    shortName: 'Ethereum',
    rpcUrls: ['https://main-rpc.linkpool.io'],
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrl: 'https://etherscan.io/'
  }
}

const ALLOWS_CHAINS = [1, 10548]

console.log(process.env.NETWORK_ENV, '???')

const NET_STATUS = {
  checkUser: 3,
  checkNetWork: 2,
  checkWeb3: 1,
  err: 0
}

const coingeckoURL = 'https://api.coingecko.com/api/v3'


// new Date('2021-09-11 00:01:33').valueOf()
const stakingStartTime = 1631289693000
const zeroAddress = '0x0000000000000000000000000000000000000000'
const defaultAddress = '0x1111111111111111111111111111111111111111'

// Configs related to netwwork

let envConf = {}

switch (process.env.NETWORK_ENV) {
  case 'mainnet':
    envConf = require('./mainnet').default
    break
  case 'mainnet-fork':
    envConf = require('./mainnet-fork').default
    break
  default:
    envConf = require('./mainnet').default
}

export default {
  coingeckoURL,
  NET_STATUS,
  CHAIN_MAPPING,
  ALLOWS_CHAINS,
  zeroAddress,
  defaultAddress,
  ...envConf,
  stakingStartTime,
}
