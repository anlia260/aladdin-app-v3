import abi from './abi'
// import cryptoIcons from 'assets/crypto-icons-stack.svg'
import rocketPoolETHIcons from 'assets/tokens/RocketPoolETH.png'
// import ustIcons from 'assets/tokens/ust.png'
// import ust_whIcons from 'assets/tokens/UST_wh.png'
// import ust_utIcons from 'assets/tokens/ust.png'
import pusdIcons from 'assets/tokens/PUSD.jpeg'
// import susdIcons from 'assets/tokens/sUSD.png'
import sethIcons from 'assets/tokens/sETH.png'
import sbtcIcons from 'assets/tokens/sBTC.png'
// import mimIcons from 'assets/tokens/mim.png'
// import alusdIcons from 'assets/tokens/mim.png'
import busdIcons from 'assets/tokens/busd.svg'
import alETHIcons from 'assets/tokens/aleth.png'
import AGEURIcons from 'assets/tokens/3eur-pool.png'
import EURTIcons from 'assets/tokens/eurt.png'
import EURSIcons from 'assets/tokens/eurs.png'
import FPIIcon from 'assets/tokens/fpifrax.png'
import fraxBPIcons from 'assets/tokens/fraxusdc.png'
import siloIcons from 'assets/tokens/silo.png'
import tusdIcons from 'assets/tokens/tusd.png'


const contracts = {
  nativeToken: '0xb26C4B3Ca601136Daf98593feAeff9E0CA702a8D',

  convexVault: '0xc8fF37F7d057dF1BB9Ad681b53Fa4726f268E0e8',
  convexVaultAcrv: '0x2b95A1Dcc3D405535f9ed33c219ab38E8d7e0884',

  concentratorIFOVault: '0x3Cf54F3A1969be9916DAD548f3C084331C4450b5',
  aladdinCTR: '0xb3Ad645dB386D7F6D753B2b9C3F4B853DA6890B8',
  aladdinBalancerLPGauge: '0x33e411ebE366D72d058F3eF22F1D0Cf8077fDaB0', //BalancerLPGauge
  aladdinConcentratorGateway: "0xD069866AceD882582b88E327E9E79Da4c88292B1",
  aladdinBalancerLPGaugeGateway: "0xb44f8Ba6CD9FfeE97F8482D064E62Ba55edD4D72",
  aladdinGaugeRewardDistributor: "0xF57b53df7326e2c6bCFA81b4A128A92E69Cb87B0",

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

  curveSUSDPoolSwap: '0xA5407eAE9Ba41422680e2e00537571bcC53efBfD',
  curveSethPoolSwap: '0xc5424b857f758e906013f3555dad202e4bdb4567',
  curveSbtcPoolSwap: '0x7fC77b5c7614E1533320Ea6DDc2Eb61fa00A9714',
  curveFraxusdcPoolSwap: '0xDcEF968d416a41Cdac0ED8702fAC8128A64241A2',


  curveMimSwap: '0x5a6A4D54456819380173272A5E8E9B9904BdF41B',
  curveIronbankSwap: '0x2dded6Da1BF5DBdF597C45fcFaa3194e53EcfeAF',
  curveFpifraxSwap: '0xf861483fa7E511fbc37487D91B6FAa803aF5d37c',
  curveAlUSDSwap: '0x43b4FdFD4Ff969587185cDB6f0BD875c5Fc83f8c',
  curveCompoundSwap: '0xA2B47E3D5c44877cca798226B7B8118F9BFb7A56',
  curveDolaSwap: '0xAA5A67c256e27A5d80712c51971408db3370927D',
  curveBusdv2Swap: '0x4807862AA8b2bF68830e4C8dc86D0e9A998e085a',
  curveEursusdSwap: '0x98a7F18d4E56Cfe84E3D081B40001B3d5bD3eB8B',
  curveAlETHSwap: '0xC4C319E2D4d66CcA4464C0c2B32c9Bd23ebe784e',
  curve3eurPoolSwap: '0xb9446c4Ef5EBE66268dA6700D26f96273DE3d571',
  curveLusdSwap: '0xEd279fDD11cA84bEef15AF5D39BB4d4bEE23F0cA',
  curveD3poolSwap: '0xBaaa1F5DbA42C3389bDbc2c9D2dE134F5cD0Dc89',
  curveMusdSwap: '0x8474DdbE98F5aA3179B3B3F5942D724aFcdec9f6',

  susdfraxbpSwap: '0xe3c190c57b5959Ae62EfE3B6797058B76bA2f5eF',
  tusdSwap: '0xecd5e75afb02efa118af914515d6521aabd189f1',
  busdfraxbpSwap: '0x8fdb0bB9365a46B145Db80D0B1C5C5e979C84190',
  alusdfraxbpSwap: '0xB30dA2376F63De30b42dC055C93fa474F31330A5',
  silofraxSwap: '0x9a22CDB1CA1cdd2371cD5BB5199564C4E89465eb',
  tusdfraxbpSwap: '0x33baeDa08b8afACc4d3d07cf31d49FC1F1f3E893',



  multiCall: '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',

  BalancerContract: '0xba12222222228d8ba445958a75a0704d566bf2c8'
}

const tokens = {
  aCRV: '0x2b95A1Dcc3D405535f9ed33c219ab38E8d7e0884',
  eth: '0x0000000000000000000000000000000000000000',
  usdc: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  cusdc: '0x39AA39c021dfbaE8faC545936693aC917d5E7563',
  cyUSDC: '0x76Eb2FE28b36B3ee97F3Adae0C69606eeDB2A37c',
  usdt: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  cyUSDT: '0x48759F220ED983dB51fA7A8C0D2AAb8f3ce4166a',
  dai: '0x6b175474e89094c44da98b954eedeac495271d0f',
  cdai: '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643',
  cyDAI: '0x8e595470Ed749b85C6F7669de83EAe304C2ec68F',
  ustTerra: '0xa47c8bf37f92aBed4A126BDA807A7b7498661acD',
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
  CTR: '0xBAb0eE407c0eA76d4087c6A69deddf3050d5C8DD',
  "PUSd": "0x466a756E9A7401B5e2444a3fCB3c2C12FBEa0a54",
  "SUSD": "0x57Ab1ec28D129707052df4dF418D58a2D46d5f51",
  sETH: '0x5e74C9036fb86BD7eCdcb084a0673EFc32eA31cb',
  sBTC: '0xfE18be6b3Bd88A2D2A7f928d00292E7a9963CfC6',


  mim: '0x99d8a9c45b2eca8864373a26d1459e3dff1e17f3',
  fpi: '0x5ca135cb8527d76e932f34b5145575f9d8cbe08e',
  alUSD: '0xbc6da0fe9ad5f3b0d58160288917aa56653660e9',
  DOLA: '0x865377367054516e17014ccded1e7d814edc9ce4',
  busd: '0x4fabb145d64652a948d72533023f6e7a623c7c53',
  EURS: '0xdb25f211ab05b1c97d595516f45794528a807ad8',
  alETH: '0x0100546f2cd4c9d97f798ffc9755e47865ff7ee6',
  agEUR: '0x1a7e4e63778B4f12a199C062f3eFdD288afCBce8',
  eurt: '0xC581b735A1688071A1746c968e0798D642EDE491',
  lusd: '0x5f98805A4E8be255a32880FDeC7F6728C6568bA0',
  fei: '0x956f47f50a910163d8bf957cf5846d573e7f87ca',
  mUSD: '0xe2f2a5C287993345a840Db3B0845fbC70f5935a5',

  CTRACRV: '0x80A8eA2f9EBFC2Db9a093BD46E01471267914E49',

  crvFRAX: '0x3175Df0976dFA876431C2E9eE6Bc45b65d3473CC',
  TUSD: '0x0000000000085d4780B73119b644AE5ecd22b376',
  SILO: '0x6f80310CA7F2C654691D1383149Fa1A57d8AB1f8'

}

const BalancerPools = {
  CTRACRVPOOLS: '0x80a8ea2f9ebfc2db9a093bd46e01471267914e490002000000000000000002a2'
}

const TOKENS_INFO = {
  eth: ['ethereum', tokens.eth, 18],
  usdc: ['usd-coin', tokens.usdc, 6],
  cusdc: ['compound-usd-coin', tokens.cusdc, 8],
  cyUSDC: ['cyUSDC', tokens.cyUSDC, 8],
  usdt: ['usd-coin', tokens.usdt, 6],
  cyUSDT: ['cyUSDT', tokens.cyUSDT, 8],
  dai: ['dai', tokens.dai, 18],
  cdai: ['cdai', tokens.cdai, 8],
  cyDAI: ['cyDAI', tokens.cyDAI, 8],
  weth: ['weth', tokens.weth, 18],
  wbtc: ['bitcoin', tokens.wbtc, 8],
  seth: ['seth', tokens.seth, 18],
  steth: ['staked-ether', tokens.steth, 18],
  renBTC: ['renbtc', tokens.renBTC, 8],
  sushi: ['sushi', tokens.sushi, 18],

  crv: ['curve-dao-token', tokens.crv, 18],
  cvxcrv: ['convex-crv', tokens.cvxcrv, 18],

  frax: ['frax', tokens.frax, 18],
  cvx: ['convex-finance', tokens.cvx, 18],
  fxs: ['frax-share', tokens.fxs, 18],
  crv3pool: ['lp-3pool-curve', tokens.crv3pool, 18],

  reth: ['rocket-pool-eth', tokens.reth, 18],
  wstETH: ['wrapped-steth', tokens.wstETH, 18],
  "UST(Wormhole)": ['terrausd-wormhole', tokens['UST(Wormhole)'], 6],
  "PUSd": ['pusd', tokens.PUSd, 18],

  SUSD: ['nusd', tokens.SUSD, 18],
  sBTC: ['sbtc', tokens.sBTC, 18],


  mim: ['magic-internet-money', tokens.mim, 18],
  fpi: ['frax-price-index', tokens.fpi, 18],
  alUSD: ['alchemix-usd', tokens.alUSD, 18],
  DOLA: ['dola-usd', tokens.DOLA, 18],
  busd: ['binance-usd', tokens.busd, 18],
  EURS: ['stasis-eurs', tokens.EURS, 2],
  alETH: ['alchemix-eth', tokens.alETH, 18],
  agEUR: ['ageur', tokens.agEUR, 18],
  eurt: ['tether-eurt', tokens.eurt, 6], //not find
  lusd: ['usd-coin', tokens.lusd, 18],//not find
  fei: ['fei-usd', tokens.fei, 18],
  mUSD: ['musd', tokens.mUSD, 18],

  cvxfxs: ['', tokens.cvxfxs, 18],
  crvFRAX: ['frax', tokens.crvFRAX, 18],
  FRAXBP: ['frax', tokens.crvFRAX, 18],
  TUSD: ['true-usd', tokens.TUSD, 18],
  SILO: ['silo-finance', tokens.SILO, 18]
}

const zapTokens = {
  USDC: {
    symbol: 'USDC',
    icon: 'usdc',
    decimals: TOKENS_INFO.usdc[2],
    address: TOKENS_INFO.usdc[1],
    needZap: true,
  },
  ETH: {
    symbol: 'ETH',
    icon: 'eth',
    decimals: TOKENS_INFO.eth[2],
    address: TOKENS_INFO.eth[1],
    needZap: true,
  },
  WETH: {
    symbol: 'WETH',
    icon: 'weth',
    decimals: TOKENS_INFO.weth[2],
    address: TOKENS_INFO.weth[1],
    needZap: true,
  },
  USDT: {
    symbol: 'USDT',
    icon: 'usdt',
    decimals: TOKENS_INFO.usdt[2],
    address: TOKENS_INFO.usdt[1],
    needZap: true,
  },
  DAI: {
    symbol: 'DAI',
    icon: 'dai',
    decimals: TOKENS_INFO.dai[2],
    address: TOKENS_INFO.dai[1],
    needZap: true,
  },
  FRAX: {
    symbol: 'FRAX',
    icon: 'frax',
    decimals: TOKENS_INFO.frax[2],
    address: TOKENS_INFO.frax[1],
    needZap: true,
  },
  CRV3POOL: {
    symbol: 'crv3pool',
    icon: '3pool',
    decimals: TOKENS_INFO.crv3pool[2],
    address: TOKENS_INFO.crv3pool[1],
    needZap: true,
    isLp: true,
  },
  STETH: {
    symbol: 'stETH',
    icon: 'steth',
    decimals: TOKENS_INFO.steth[2],
    address: TOKENS_INFO.steth[1],
    needZap: true,
  },
  RETH: {
    symbol: 'rETH',
    icon: rocketPoolETHIcons,
    decimals: TOKENS_INFO.reth[2],
    address: TOKENS_INFO.reth[1],
    needZap: true,
  },
  WSTETH: {
    symbol: 'wstETH',
    icon: 'steth',
    decimals: TOKENS_INFO.wstETH[2],
    address: TOKENS_INFO.wstETH[1],
    needZap: true,
  },
  WBTC: {
    symbol: 'WBTC',
    icon: 'wbtc',
    decimals: TOKENS_INFO.wbtc[2],
    address: TOKENS_INFO.wbtc[1],
    needZap: true,
  },
  RENBTC: {
    symbol: 'renBTC',
    icon: 'renbtc',
    decimals: TOKENS_INFO.renBTC[2],
    address: TOKENS_INFO.renBTC[1],
    decimals: 8,
    needZap: true,
  },
  CRV: {
    symbol: 'CRV',
    icon: 'crv',
    decimals: TOKENS_INFO.crv[2],
    address: TOKENS_INFO.crv[1],
    needZap: true,
  },
  CVXCRV: {
    symbol: 'cvxCRV',
    icon: 'crv',
    decimals: TOKENS_INFO.cvxcrv[2],
    address: TOKENS_INFO.cvxcrv[1],
    needZap: true,
  },
  CVX: {
    symbol: 'CVX',
    icon: 'cvx',
    decimals: TOKENS_INFO.cvx[2],
    address: TOKENS_INFO.cvx[1],
    needZap: true,
  },
  CVXFXS: {
    symbol: 'cvxFXS',
    icon: 'fxs',
    decimals: TOKENS_INFO.cvxfxs[2],
    address: TOKENS_INFO.cvxfxs[1],
    needZap: true,
  },
  FXS: {
    symbol: 'FXS',
    icon: 'fxs',
    decimals: TOKENS_INFO.fxs[2],
    address: TOKENS_INFO.fxs[1],
    needZap: true,
  },
  PUSD: {
    symbol: 'PUSd',
    icon: pusdIcons,
    decimals: TOKENS_INFO.PUSd[2],
    address: TOKENS_INFO.PUSd[1],
    needZap: true,
  },
  SUSD: {
    symbol: 'sUSD',
    icon: 'susd',
    decimals: TOKENS_INFO.SUSD[2],
    address: TOKENS_INFO.SUSD[1],
    needZap: true,
  },
  SBTC: {
    symbol: 'sBTC',
    icon: sbtcIcons,
    decimals: TOKENS_INFO.sBTC[2],
    address: TOKENS_INFO.sBTC[1],
    needZap: true,
  },
  SETH: {
    symbol: 'sETH',
    icon: sethIcons,
    decimals: TOKENS_INFO.seth[2],
    address: TOKENS_INFO.seth[1],
    needZap: true,
  },
  MIM: {
    symbol: 'MIM',
    icon: 'mim',
    decimals: TOKENS_INFO.mim[2],
    address: TOKENS_INFO.mim[1],
    needZap: true,
  },
  ALUSD: {
    symbol: 'alUSD',
    icon: 'alusd',
    decimals: TOKENS_INFO.alUSD[2],
    address: TOKENS_INFO.alUSD[1],
    needZap: true,
  },
  FPI: {
    symbol: 'FPI',
    icon: FPIIcon,
    decimals: TOKENS_INFO.fpi[2],
    address: TOKENS_INFO.fpi[1],
    needZap: true,
  },
  DOLA: {
    symbol: 'DOLA',
    icon: 'dola',
    decimals: TOKENS_INFO.DOLA[2],
    address: TOKENS_INFO.DOLA[1],
    needZap: true,
  },
  BUSD: {
    symbol: 'BUSD',
    icon: busdIcons,
    decimals: TOKENS_INFO.busd[2],
    address: TOKENS_INFO.busd[1],
    needZap: true,
  },
  ALETH: {
    symbol: 'alETH',
    icon: alETHIcons,
    decimals: TOKENS_INFO.alETH[2],
    address: TOKENS_INFO.alETH[1],
    needZap: true,
  },
  AGEUR: {
    symbol: 'agEUR',
    icon: AGEURIcons,
    decimals: TOKENS_INFO.agEUR[2],
    address: TOKENS_INFO.agEUR[1],
    needZap: true,
  },
  EURT: {
    symbol: 'EURT',
    icon: EURTIcons,
    decimals: TOKENS_INFO.eurt[2],
    address: TOKENS_INFO.eurt[1],
    needZap: true,
  },
  EURS: {
    symbol: 'EURS',
    icon: EURSIcons,
    decimals: TOKENS_INFO.EURS[2],
    address: TOKENS_INFO.EURS[1],
    needZap: true,
  },
  LUSD: {
    symbol: 'LUSD',
    icon: 'lusd',
    decimals: TOKENS_INFO.lusd[2],
    address: TOKENS_INFO.lusd[1],
    needZap: true,
  },
  CYDAI: {
    symbol: 'cyDAI',
    icon: 'musd',
    decimals: TOKENS_INFO.cyDAI[2],
    address: TOKENS_INFO.cyDAI[1],
    needZap: true,
  },
  CYUSDC: {
    symbol: 'cyUSDC',
    icon: 'musd',
    decimals: TOKENS_INFO.cyUSDC[2],
    address: TOKENS_INFO.cyUSDC[1],
    needZap: true,
  },
  CYUSDT: {
    symbol: 'cyUSDT',
    icon: 'musd',
    decimals: TOKENS_INFO.cyUSDT[2],
    address: TOKENS_INFO.cyUSDT[1],
    needZap: true,
  },
  MUSD: {
    symbol: 'MUSD',
    icon: 'musd',
    decimals: TOKENS_INFO.mUSD[2],
    address: TOKENS_INFO.mUSD[1],
    needZap: true,
  },
  crvFRAX: {
    symbol: 'crvFRAX',
    icon: 'frax',
    decimals: TOKENS_INFO.crvFRAX[2],
    address: TOKENS_INFO.crvFRAX[1],
    needZap: true,
  },
  TUSD: {
    symbol: 'TUSD',
    icon: tusdIcons,
    decimals: TOKENS_INFO.TUSD[2],
    address: TOKENS_INFO.TUSD[1],
    needZap: true,
  },
  SILO: {
    symbol: 'SILO',
    icon: siloIcons,
    decimals: TOKENS_INFO.SILO[2],
    address: TOKENS_INFO.SILO[1],
    needZap: true,
  }
}
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
  pusd: '0x8EE017541375F6Bcd802ba119bdDC94dad6911A1',
  susd: '0xC25a3A3b969415c80451098fa907EC722572917F',
  seth: '0xA3D87FffcE63B53E0d54fAa1cc983B7eB0b74A9c',
  sbtc: '0x075b1bb99792c9E1041bA13afEf80C91a1e70fB3',
  fraxusdc: '0x3175Df0976dFA876431C2E9eE6Bc45b65d3473CC',


  mim: '0x5a6A4D54456819380173272A5E8E9B9904BdF41B',
  ironbank: '0x5282a4eF67D9C33135340fB3289cc1711c13638C',
  fpifrax: '0x4704aB1fb693ce163F7c9D3A31b3FF4eaF797714',
  alusd: '0x43b4FdFD4Ff969587185cDB6f0BD875c5Fc83f8c',
  Compound: '0x845838DF265Dcd2c412A1Dc9e959c7d08537f8a2',
  dola: '0xAA5A67c256e27A5d80712c51971408db3370927D',
  busdv2: '0x4807862AA8b2bF68830e4C8dc86D0e9A998e085a',
  eursusd: '0x3D229E1B4faab62F621eF2F6A610961f7BD7b23B',
  alETH: '0xC4C319E2D4d66CcA4464C0c2B32c9Bd23ebe784e',
  '3eur-pool': '0xb9446c4Ef5EBE66268dA6700D26f96273DE3d571',
  lusd: '0xEd279fDD11cA84bEef15AF5D39BB4d4bEE23F0cA',
  // usdn: '0x4f3E8F405CF5aFC05D68142F3783bDfE13811522',
  d3pool: '0xBaaa1F5DbA42C3389bDbc2c9D2dE134F5cD0Dc89',
  musd: '0x1AEf73d49Dedc4b1778d0706583995958Dc862e6',

  susdfraxbp: '0xe3c190c57b5959Ae62EfE3B6797058B76bA2f5eF',
  tusd: '0xecd5e75afb02efa118af914515d6521aabd189f1',
  busdfraxbp: '0x8fdb0bB9365a46B145Db80D0B1C5C5e979C84190',
  alusdfraxbp: '0xB30dA2376F63De30b42dC055C93fa474F31330A5',
  silofrax: '0x2302aaBe69e6E7A1b0Aa23aAC68fcCB8A4D2B460',
  tusdfraxbp: '0x33baeDa08b8afACc4d3d07cf31d49FC1F1f3E893'

}

const CONVEXVAULTPOOL_INFO = {
  [convexVaultPool.cvxcrv]: {
    lpName: 'cvxcrv',
    address: convexVaultPool.cvxcrv,
    swapPoolABI: abi.curveCvxcrvPoolSwapABI,
    swapPoolAddress: contracts.curveCvxcrvPoolSwap,
    underlyingAssets: [
      TOKENS_INFO.crv,
      TOKENS_INFO.cvxcrv
    ],
  },
  [convexVaultPool.cvxfxs]: {
    lpName: 'cvxfxs',
    address: convexVaultPool.cvxfxs,
    swapPoolABI: abi.curveCvxfxsPoolSwapABI,
    swapPoolAddress: contracts.curveCvxfxsPoolSwap,
    underlyingAssets: [
      TOKENS_INFO.fxs,
      TOKENS_INFO.fxs,
    ],
  },
  [convexVaultPool.steth]: {
    lpName: 'steth',
    address: convexVaultPool.steth,
    swapPoolABI: abi.curveStethPoolSwapABI,
    swapPoolAddress: contracts.curveStethPoolSwap,
    underlyingAssets: [
      TOKENS_INFO.eth,
      TOKENS_INFO.steth,
    ],
  },
  [convexVaultPool.frax]: {
    lpName: 'frax',
    address: convexVaultPool.frax,
    swapPoolABI: abi.curveFraxPoolSwapABI,
    swapPoolAddress: contracts.curveFraxPoolSwap,
    underlyingAssets: [
      TOKENS_INFO.frax,
      TOKENS_INFO.crv3pool,
    ],
  },
  [convexVaultPool.tricrypto2]: {
    lpName: 'tricrypto2',
    address: convexVaultPool.tricrypto2,
    swapPoolABI: abi.curveTricrypto2PoolSwapABI,
    swapPoolAddress: contracts.curveTricrypto2PoolSwap,
    underlyingAssets: [
      TOKENS_INFO.usdt,
      TOKENS_INFO.wbtc,
      TOKENS_INFO.eth,
    ],
  },
  [convexVaultPool.crveth]: {
    lpName: 'crveth',
    address: convexVaultPool.crveth,
    swapPoolABI: abi.curveCrvethPoolSwapABI,
    swapPoolAddress: contracts.curveCrvethPoolSwap,
    underlyingAssets: [
      TOKENS_INFO.eth,
      TOKENS_INFO.crv,
    ],
  },
  [convexVaultPool.cvxeth]: {
    lpName: 'cvxeth',
    address: convexVaultPool.cvxeth,
    swapPoolABI: abi.curveCvxethPoolSwapABI,
    swapPoolAddress: contracts.curveCvxethPoolSwap,
    underlyingAssets: [
      TOKENS_INFO.eth,
      TOKENS_INFO.cvx,
    ],
  },
  [convexVaultPool.crv3pool]: {
    lpName: 'crv3pool',
    address: convexVaultPool.crv3pool,
    swapPoolABI: abi.curve3PoolSwapABI,
    swapPoolAddress: contracts.curve3PoolSwap,
    underlyingAssets: [
      TOKENS_INFO.dai,
      TOKENS_INFO.usdc,
      TOKENS_INFO.usdt,
    ],
  },
  [convexVaultPool.rocketpooleth]: {
    lpName: 'rocketpooleth',
    address: convexVaultPool.rocketpooleth,
    swapPoolABI: abi.curveRocketPoolEthSwapABI,
    swapPoolAddress: contracts.curveRocketPoolEthSwap,
    underlyingAssets: [
      TOKENS_INFO.reth,
      TOKENS_INFO.wstETH
    ],
  },
  [convexVaultPool['ust-wormhole']]: {
    lpName: 'ust-wormhole',
    address: convexVaultPool['ust-wormhole'],
    swapPoolABI: abi.curveUstWormholeSwapABI,
    swapPoolAddress: contracts.curveUstWormholeSwap,
    underlyingAssets: [
      TOKENS_INFO['UST(Wormhole)'],
      TOKENS_INFO.crv3pool
    ],
  },
  [convexVaultPool.ren]: {
    lpName: 'ren',
    address: convexVaultPool.ren,
    swapPoolABI: abi.curveRenABI,
    swapPoolAddress: contracts.curveRenSwap,
    underlyingAssets: [
      TOKENS_INFO.renBTC,
      TOKENS_INFO.wbtc
    ],
  },
  [convexVaultPool.pusd]: {
    lpName: 'pusd',
    address: convexVaultPool.pusd,
    swapPoolABI: abi.curvePusdPoolSwapABI,
    swapPoolAddress: contracts.curvePusdPoolSwap,
    underlyingAssets: [
      TOKENS_INFO.PUSd,
      TOKENS_INFO.crv3pool
    ],
  },
  [convexVaultPool.susd]: {
    lpName: 'susd',
    address: convexVaultPool.susd,
    swapPoolABI: abi.curveSUSDPoolSwapABI,
    swapPoolAddress: contracts.curveSUSDPoolSwap,
    underlyingAssets: [
      TOKENS_INFO.dai,
      TOKENS_INFO.usdc,
      TOKENS_INFO.usdt,
      TOKENS_INFO.SUSD,
    ],
  },
  [convexVaultPool.seth]: {
    lpName: 'seth',
    address: convexVaultPool.seth,
    swapPoolABI: abi.curveSethPoolSwapABI,
    swapPoolAddress: contracts.curveSethPoolSwap,
    underlyingAssets: [
      TOKENS_INFO.eth,
      TOKENS_INFO.seth
    ],
  },
  [convexVaultPool.sbtc]: {
    lpName: 'sbtc',
    address: convexVaultPool.sbtc,
    swapPoolABI: abi.curveSbtcPoolSwapABI,
    swapPoolAddress: contracts.curveSbtcPoolSwap,
    underlyingAssets: [
      TOKENS_INFO.renBTC,
      TOKENS_INFO.wbtc,
      TOKENS_INFO.sBTC
    ],
  },
  [convexVaultPool.fraxusdc]: {
    lpName: 'fraxusdc',
    address: convexVaultPool.fraxusdc,
    swapPoolABI: abi.curveFraxUsdcSwapABI,
    swapPoolAddress: contracts.curveFraxusdcPoolSwap,
    underlyingAssets: [
      TOKENS_INFO.frax,
      TOKENS_INFO.usdc
    ],
  },



  [convexVaultPool.mim]: {
    lpName: 'mim',
    address: convexVaultPool.mim,
    swapPoolABI: abi.curveMimSwapABI,
    swapPoolAddress: contracts.curveMimSwap,
    underlyingAssets: [
      TOKENS_INFO.mim,
      TOKENS_INFO.crv3pool
    ],
  },

  [convexVaultPool.ironbank]: {
    lpName: 'ironbank',
    address: convexVaultPool.ironbank,
    swapPoolABI: abi.curveIronbankSwapABI,
    swapPoolAddress: contracts.curveIronbankSwap,
    underlyingAssets: [
      TOKENS_INFO.cyDAI,
      TOKENS_INFO.cyUSDC,
      TOKENS_INFO.cyUSDT
      // TOKENS_INFO.dai,
      // TOKENS_INFO.usdc,
      // TOKENS_INFO.usd
    ],
  },

  [convexVaultPool.fpifrax]: {
    lpName: 'fpifrax',
    address: convexVaultPool.fpifrax,
    swapPoolABI: abi.curveFpifraxSwapABI,
    swapPoolAddress: contracts.curveFpifraxSwap,
    underlyingAssets: [
      TOKENS_INFO.frax,
      TOKENS_INFO.fpi,
    ],
  },

  [convexVaultPool.alusd]: {
    lpName: 'alusd',
    address: convexVaultPool.alusd,
    swapPoolABI: abi.curveAlUSDSwapABI,
    swapPoolAddress: contracts.curveAlUSDSwap,
    underlyingAssets: [
      TOKENS_INFO.alUSD,
      TOKENS_INFO.crv3pool,
    ],
  },

  [convexVaultPool.Compound]: {
    lpName: 'Compound',
    address: convexVaultPool.Compound,
    swapPoolABI: abi.curveCompoundSwapABI,
    swapPoolAddress: contracts.curveCompoundSwap,
    underlyingAssets: [
      TOKENS_INFO.cdai,
      TOKENS_INFO.cusdc,
    ],
  },

  [convexVaultPool.dola]: {
    lpName: 'dola',
    address: convexVaultPool.dola,
    swapPoolABI: abi.curveDolaSwapABI,
    swapPoolAddress: contracts.curveDolaSwap,
    underlyingAssets: [
      TOKENS_INFO.DOLA,
      TOKENS_INFO.crv3pool,
    ],
  },

  [convexVaultPool.busdv2]: {
    lpName: 'busdv2',
    address: convexVaultPool.busdv2,
    swapPoolABI: abi.curveBusdv2SwapABI,
    swapPoolAddress: contracts.curveBusdv2Swap,
    underlyingAssets: [
      TOKENS_INFO.busd,
      TOKENS_INFO.crv3pool,
    ],
  },

  [convexVaultPool.eursusd]: {
    lpName: 'eursusd',
    address: convexVaultPool.eursusd,
    swapPoolABI: abi.curveEursusdSwapABI,
    swapPoolAddress: contracts.curveEursusdSwap,
    underlyingAssets: [
      TOKENS_INFO.eth,
      TOKENS_INFO.usdc,
    ],
  },

  [convexVaultPool.alETH]: {
    lpName: 'alETH',
    address: convexVaultPool.alETH,
    swapPoolABI: abi.curveAlETHSwapABI,
    swapPoolAddress: contracts.curveAlETHSwap,
    underlyingAssets: [
      TOKENS_INFO.eth,
      TOKENS_INFO.eth,
      // TOKENS_INFO.alETH,
    ],
  },

  [convexVaultPool['3eur-pool']]: {
    lpName: '3eur-pool',
    address: convexVaultPool['3eur-pool'],
    swapPoolABI: abi.curve3eurPoolSwapABI,
    swapPoolAddress: contracts.curve3eurPoolSwap,
    underlyingAssets: [
      TOKENS_INFO.agEUR,
      TOKENS_INFO.eurt,
      TOKENS_INFO.EURS,
    ],
  },

  [convexVaultPool.lusd]: {
    lpName: 'lusd',
    address: convexVaultPool.lusd,
    swapPoolABI: abi.curveLusdSwapABI,
    swapPoolAddress: contracts.curveLusdSwap,
    underlyingAssets: [
      TOKENS_INFO.lusd,
      TOKENS_INFO.crv3pool,
    ],
  },

  [convexVaultPool.d3pool]: {
    lpName: 'd3pool',
    address: convexVaultPool.d3pool,
    swapPoolABI: abi.curveD3poolSwapABI,
    swapPoolAddress: contracts.curveD3poolSwap,
    underlyingAssets: [
      TOKENS_INFO.frax,
      TOKENS_INFO.alUSD,
      TOKENS_INFO.fei
    ],
  },

  [convexVaultPool.musd]: {
    lpName: 'musd',
    address: convexVaultPool.musd,
    swapPoolABI: abi.curveMusdSwapABI,
    swapPoolAddress: contracts.curveMusdSwap,
    underlyingAssets: [
      TOKENS_INFO.mUSD,
      TOKENS_INFO.crv3pool
    ],
  },

  [convexVaultPool.susdfraxbp]: {
    lpName: 'susdfraxbp',
    address: convexVaultPool.susdfraxbp,
    swapPoolABI: abi.susdfraxbpSwapABI,
    swapPoolAddress: contracts.susdfraxbpSwap,
    underlyingAssets: [
      TOKENS_INFO.SUSD,
      TOKENS_INFO.FRAXBP
    ],
  },
  [convexVaultPool.tusd]: {
    lpName: 'tusd',
    address: convexVaultPool.tusd,
    swapPoolABI: abi.tusdSwapABI,
    swapPoolAddress: contracts.tusdSwap,
    underlyingAssets: [
      TOKENS_INFO.TUSD,
      TOKENS_INFO.crv3pool
    ],
  },
  [convexVaultPool.busdfraxbp]: {
    lpName: 'busdfraxbp',
    address: convexVaultPool.busdfraxbp,
    swapPoolABI: abi.busdfraxbpSwapABI,
    swapPoolAddress: contracts.busdfraxbpSwap,
    underlyingAssets: [
      TOKENS_INFO.busd,
      TOKENS_INFO.FRAXBP
    ],
  },
  [convexVaultPool.alusdfraxbp]: {
    lpName: 'alusdfraxbp',
    address: convexVaultPool.alusdfraxbp,
    swapPoolABI: abi.alusdfraxbpSwapABI,
    swapPoolAddress: contracts.alusdfraxbpSwap,
    underlyingAssets: [
      TOKENS_INFO.alUSD,
      TOKENS_INFO.FRAXBP
    ],
  },
  [convexVaultPool.silofrax]: {
    lpName: 'silofrax',
    address: convexVaultPool.silofrax,
    swapPoolABI: abi.silofraxSwapABI,
    swapPoolAddress: contracts.silofraxSwap,
    underlyingAssets: [
      TOKENS_INFO.SILO,
      TOKENS_INFO.frax
    ],
  },
  [convexVaultPool.tusdfraxbp]: {
    lpName: 'tusdfraxbp',
    address: convexVaultPool.tusdfraxbp,
    swapPoolABI: abi.tusdfraxbpSwapABI,
    swapPoolAddress: contracts.tusdfraxbpSwap,
    underlyingAssets: [
      TOKENS_INFO.TUSD,
      TOKENS_INFO.FRAXBP
    ],
  },


}

export default {
  tokens,
  zapTokens,
  contracts,
  convexVaultPool,
  BalancerPools,
  TOKENS_INFO,
  CONVEXVAULTPOOL_INFO
}
