const CHAIN_ID = 1

const NETWORK_NAME = 'mainnet'
const devRpcurl = [1, 'https://eth-mainnet.alchemyapi.io/v2/NYoZTYs7oGkwlUItqoSHJeqpjqtlRT6m']

// used by wallet connect
const INFURAIDS = ['86e777894dec49388d35b56d914732a2', 'fa6c7e2367c542d19cd473fa341ca314']
const INFURA_ID = (() => {
  const index = Math.round(Math.random()) + INFURAIDS.length - 2
  return INFURAIDS[index < 0 ? 0 : index]
})()
const INFURA_URL = `wss://mainnet.infura.io/ws/v3/${INFURA_ID}`

const explorerUri = 'http://www.etherscan.io'

const enableCachedLpPrice = false

const contracts = {
  nativeToken: '0xb26C4B3Ca601136Daf98593feAeff9E0CA702a8D',

  convexVault: '0xc8fF37F7d057dF1BB9Ad681b53Fa4726f268E0e8',
  convexVaultAcrv: '0x2b95A1Dcc3D405535f9ed33c219ab38E8d7e0884',

  curveCvxcrvPoolSwap: '0x9D0464996170c6B9e75eED71c68B99dDEDf279e8',
  curveCvxfxsPoolSwap: '0xd658A338613198204DCa1143Ac3F01A722b5d94A',
  curveStethPoolSwap: '0xDC24316b9AE028F1497c275EB9192a3Ea0f67022',
  curveFraxPoolSwap: '0xd632f22692FaC7611d2AA1C0D552930D43CAEd3B',
  curveTricrypto2PoolSwap: '0xD51a44d3FaE010294C616388b506AcdA1bfAAE46',
  curveCrvethPoolSwap: '0x8301AE4fc9c624d1D396cbDAa1ed877821D7C511',
  curveCvxethPoolSwap: '0xB576491F1E6e5E62f1d8F26062Ee822B40B0E0d4',

  curve3PoolSwap: '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7',
  curveRocketPoolEthSwap: "0x447Ddd4960d9fdBF6af9a790560d0AF76795CB08",
  curveUstWormholeSwap: "0xCEAF7747579696A2F0bb206a14210e3c9e6fB269",
  curveRenSwap: "0x93054188d876f558f4a66B2EF1d97d16eDf0895B",
  curvePusdPoolSwap: '0x8EE017541375F6Bcd802ba119bdDC94dad6911A1',

  multiCall: '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
}

const tokens = {
  eth: '0x0000000000000000000000000000000000000000',
  usdc: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  usdt: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  dai: '0x6b175474e89094c44da98b954eedeac495271d0f',
  weth: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  wbtc: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
  seth: '0x5e74c9036fb86bd7ecdcb084a0673efc32ea31cb',
  steth: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
  renBTC: '0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D',
  aldVote: '0x6e2b4801040d5fab7D0d7700bE5903322BCf61Ce',
  comp: '0xc00e94cb662c3520282e6f5717214004a7f26888',
  sushi: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',

  crv: '0xD533a949740bb3306d119CC777fa900bA034cd52',
  cvxcrv: '0x62b9c7356a2dc64a1969e19c23e4f579f9810aa7',

  frax: '0x853d955aCEf822Db058eb8505911ED77F175b99e',
  cvx: '0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B',
  cvxfxs: '0xFEEf77d3f69374f66429C91d732A244f074bdf74',
  fxs: '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0',
  crv3pool: '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490',

  reth: '0xae78736cd615f374d3085123a210448e74fc6393',
  wstETH: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
  "UST(Wormhole)": '0xa693B19d2931d498c5B318dF961919BB4aee87a5',
  "UST(Terra)": "0xa47c8bf37f92aBed4A126BDA807A7b7498661acD",
  CTR: '0xf68EadE8f0d8bBAecd6E7ebcb3Ac6B782732DC55',
  "PUSd": "0x466a756E9A7401B5e2444a3fCB3c2C12FBEa0a54"
}

const zapTokens = [
  // {
  //   symbol: 'ETH',
  //   address: '0x0000000000000000000000000000000000000000',
  //   needZap: true
  // },
  // {
  //   symbol: 'USDT',
  //   address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  //   needZap: true
  // },
  {
    symbol: 'DAI',
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    needZap: true
  },
]

const convexVaultPool = {
  cvxcrv: '0x9D0464996170c6B9e75eED71c68B99dDEDf279e8',
  cvxfxs: '0xF3A43307DcAFa93275993862Aae628fCB50dC768',
  steth: '0x06325440D014e39736583c165C2963BA99fAf14E', //
  frax: '0xd632f22692FaC7611d2AA1C0D552930D43CAEd3B',
  tricrypto2: '0xc4AD29ba4B3c580e6D59105FFf484999997675Ff', //
  crveth: '0xEd4064f376cB8d68F770FB1Ff088a3d0F3FF5c4d', //
  cvxeth: '0x3A283D9c08E8b55966afb64C515f5143cf907611', //

  crv3pool: '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490',
  rocketpooleth: "0x447Ddd4960d9fdBF6af9a790560d0AF76795CB08",
  "ust-wormhole": "0xCEAF7747579696A2F0bb206a14210e3c9e6fB269",
  ren: '0x49849C98ae39Fff122806C06791Fa73784FB3675',
  pusd: '0x8EE017541375F6Bcd802ba119bdDC94dad6911A1'
}

const chainUnit = 'ETH'
const chainDecimal = 18

export default {
  INFURA_ID,
  INFURA_URL,
  CHAIN_ID,
  devRpcurl,
  NETWORK_NAME,
  explorerUri,
  tokens,
  zapTokens,
  contracts,
  chainUnit,
  chainDecimal,
  enableCachedLpPrice,
  convexVaultPool,
}
