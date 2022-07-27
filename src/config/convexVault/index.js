import config from 'config/index'

import cryptoIcons from 'assets/crypto-icons-stack.svg'
import rocketPoolETHIcons from 'assets/tokens/RocketPoolETH.png'
import ustIcons from 'assets/tokens/ust.png'
import ust_whIcons from 'assets/tokens/UST_wh.png'
import ust_utIcons from 'assets/tokens/ust.png'
import pusdIcons from 'assets/tokens/PUSD.jpeg'
import susdIcons from 'assets/tokens/sUSD.png'
import sethIcons from 'assets/tokens/sETH.png'
import sbtcIcons from 'assets/tokens/sBTC.png'
import ctrLpIcons from 'assets/tokens/CTR_LP.svg'
import ironbankIcons from 'assets/tokens/iron-bank.png'
import compoundIcons from 'assets/tokens/compound.png'
import busdIcons from 'assets/tokens/busd.svg'
import alETHIcon from 'assets/tokens/aleth.png'
import fpifraxIcon from 'assets/tokens/fpifrax.png'
import pool3eurIcon from 'assets/tokens/3eur-pool.png'

import fraxBPIcons from 'assets/tokens/fraxusdc.png'
import siloIcons from 'assets/tokens/silo.png'
import tusdIcons from 'assets/tokens/tusd.png'

export const PRICE_API = [
  { tokens: ['steth'], api: 'https://stats.curve.fi/raw-stats/apys.json' },
  { tokens: ['triCrypto2', 'crveth', 'cvxeth'], api: 'https://stats.curve.fi/raw-stats-crypto/apys.json' },
  {
    tokens: ['frax', 'alusd', 'mim', 'cvxcrv', 'AlETH', 'mim-ust', 'ust-wormhole'],
    api: 'https://api.curve.fi/api/getFactoryAPYs?version=2',
    addrs: config.convexVaultPool,
  },
]

export const VAULT_LIST = [
  {
    logo: `${cryptoIcons}#steth`,
    id: 0,
    name: 'steth',
    nameShow: 'Curve stETH pool',
    apy: 0,
    stakeTokenSymbol: 'stethCRV',
    tvlPriceTokenId: 'curveLP-steth',
    stakeTokenContractAddress: config.convexVaultPool.steth,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'aCRV',
    rewardTokenDecimals: 18,
    zapTokens: [
      {
        symbol: 'stethCRV',
        icon: 'steth',
        address: config.convexVaultPool.steth,
        needZap: false,
        isLp: true,
      },
      config.zapTokens.STETH,
      config.zapTokens.ETH,
      config.zapTokens.WETH,
      config.zapTokens.USDC,
    ],
  },
  {
    logo: `${cryptoIcons}#frax`,
    id: 1,
    name: 'frax',
    nameShow: 'Curve frax pool',
    apy: 0,
    stakeTokenSymbol: 'fraxCrv',
    tvlPriceTokenId: 'curveLP-frax',
    stakeTokenContractAddress: config.convexVaultPool.frax,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'acrv',
    rewardTokenDecimals: 18,
    zapTokens: [
      {
        symbol: 'fraxCrv',
        icon: 'frax',
        address: config.convexVaultPool.frax,
        needZap: false,
        isLp: true,
      },
      config.zapTokens.FRAX,
      config.zapTokens.CRV3POOL,
      config.zapTokens.USDT,
      config.zapTokens.USDC,
      config.zapTokens.ETH,
      config.zapTokens.DAI,
      config.zapTokens.WETH,
    ],
  },
  {
    logo: `${cryptoIcons}#tricrypto2`,
    id: 2,
    name: 'tricrypto2',
    nameShow: 'Curve tricrypto2 pool',
    apy: 0,
    stakeTokenSymbol: '3CrvCrypto2',
    tvlPriceTokenId: 'curveLP-tricrypto2',
    stakeTokenContractAddress: config.convexVaultPool.tricrypto2,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'acrv',
    rewardTokenDecimals: 18,
    zapTokens: [
      {
        symbol: '3CrvCrypto2',
        icon: 'tricrypto2',
        address: config.convexVaultPool.tricrypto2,
        needZap: false,
        isLp: true,
      },
      config.zapTokens.WBTC,
      config.zapTokens.ETH,
      config.zapTokens.WETH,
      config.zapTokens.USDT,
      config.zapTokens.USDC,
    ],
  },
  {
    logo: `${cryptoIcons}#crv`,
    id: 3,
    apy: 0,
    name: 'cvxcrv',
    nameShow: 'Curve cvxcrv pool',
    stakeTokenSymbol: 'cvxcrvCrv',
    tvlPriceTokenId: 'curveLP-cvxcrv',
    stakeTokenContractAddress: config.convexVaultPool.cvxcrv,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'acrv',
    rewardTokenDecimals: 18,
    zapTokens: [
      {
        symbol: 'cvxcrvCrv',
        icon: 'crv',
        address: config.convexVaultPool.cvxcrv,
        needZap: false,
        isLp: true,
      },
      config.zapTokens.CRV,
      config.zapTokens.CVXCRV,
      config.zapTokens.ETH,
      config.zapTokens.WETH,
      config.zapTokens.USDC
    ],
  },
  {
    logo: `${cryptoIcons}#crv`,
    id: 4,
    name: 'crveth',
    nameShow: 'Curve crveth pool',
    apy: 0,
    stakeTokenSymbol: 'crvethCrv',
    tvlPriceTokenId: 'curveLP-crveth',
    stakeTokenContractAddress: config.convexVaultPool.crveth,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'acrv',
    rewardTokenDecimals: 18,
    zapTokens: [
      {
        symbol: 'crvethCrv',
        icon: 'crv',
        address: config.convexVaultPool.crveth,
        isLp: true,
        needZap: false,
      },
      config.zapTokens.CRV,
      config.zapTokens.ETH,
      config.zapTokens.WETH,
      config.zapTokens.USDC,
    ],
  },
  {
    logo: `${cryptoIcons}#cvx`,
    id: 5,
    name: 'cvxeth',
    nameShow: 'Curve cvxeth pool',
    apy: 0,
    stakeTokenSymbol: 'cvxethCrv',
    tvlPriceTokenId: 'curveLP-cvxeth',
    stakeTokenContractAddress: config.convexVaultPool.cvxeth,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'acrv',
    rewardTokenDecimals: 18,
    zapTokens: [
      {
        symbol: 'cvxethCrv',
        icon: 'cvx',
        address: config.convexVaultPool.cvxeth,
        isLp: true,
        needZap: false,
      },
      config.zapTokens.CVX,
      config.zapTokens.ETH,
      config.zapTokens.WETH,
      config.zapTokens.USDC,
    ],
  },

  {
    logo: `${cryptoIcons}#fxs`,
    id: 6,
    apy: 0,
    name: 'cvxfxs',
    nameShow: 'Curve cvxfxs pool',
    stakeTokenSymbol: 'cvxfxsCrv',
    tvlPriceTokenId: 'curveLP-cvxfxs',
    stakeTokenContractAddress: config.convexVaultPool.cvxfxs,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'acrv',
    rewardTokenDecimals: 18,
    site: 'convex',
    zapTokens: [
      {
        symbol: 'cvxfxsCrv',
        icon: 'fxs',
        address: config.convexVaultPool.cvxfxs,
        isLp: true,
        needZap: false,
      },
      config.zapTokens.CVXFXS,
      config.zapTokens.FXS,
      config.zapTokens.ETH,
      config.zapTokens.WETH,
      config.zapTokens.USDC,
    ],
  },
  {
    logo: `${cryptoIcons}#3pool`,
    id: 7,
    apy: 0,
    name: '3pool',
    nameShow: 'Curve 3pool pool',
    stakeTokenSymbol: 'crv3pool',
    tvlPriceTokenId: 'curveLP-crv3pool',
    stakeTokenContractAddress: config.convexVaultPool.crv3pool,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'acrv',
    rewardTokenDecimals: 18,
    site: 'convex',
    zapTokens: [
      {
        symbol: 'crv3pool',
        icon: '3pool',
        address: config.convexVaultPool.crv3pool,
        isLp: true,
        needZap: false,
      },
      config.zapTokens.DAI,
      config.zapTokens.USDC,
      config.zapTokens.USDT,
      config.zapTokens.ETH,
      config.zapTokens.WETH,
    ],
  },

  {
    logo: ustIcons,
    id: 8,
    apy: 0,
    name: 'ust-wormhole',
    nameShow: 'Curve ust-wormhole pool',
    stakeTokenSymbol: 'ust-wormhole',
    tvlPriceTokenId: 'curveLP-ust-wormhole',
    stakeTokenContractAddress: config.convexVaultPool["ust-wormhole"],
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'acrv',
    rewardTokenDecimals: 18,
    site: 'convex',
    closeDeposit: true,
    isExpired: true,
    zapTokens: [
      {
        symbol: 'ust-wormhole',
        icon: ustIcons,
        address: config.convexVaultPool["ust-wormhole"],
        needZap: false,
        isLp: true,
      },
      // {
      //   symbol: 'UST (bridged by Wormhole)',
      //   icon: ust_whIcons,
      //   decimals: 6,
      //   address: config.tokens["UST(Wormhole)"],
      //   needZap: true,
      // },
      // {
      //   symbol: 'UST (bridged by Terra)',
      //   icon: ust_utIcons,
      //   address: config.tokens["UST(Terra)"],
      //   needZap: true,
      // },
      // {
      //   symbol: 'crv3pool',
      //   icon: '3pool',
      //   address: config.convexVaultPool.crv3pool,
      //   needZap: true,
      //   isLp: true,
      // },
      // {
      //   symbol: 'USDT',
      //   icon: 'usdt',
      //   decimals: 6,
      //   address: config.tokens.usdt,
      //   needZap: true,
      // },
      // {
      //   symbol: 'USDC',
      //   icon: 'usdc',
      //   decimals: 6,
      //   address: config.tokens.usdc,
      //   needZap: true,
      // },
      // {
      //   symbol: 'DAI',
      //   icon: 'dai',
      //   address: config.tokens.dai,
      //   needZap: true,
      // },
      // {
      //   symbol: 'ETH',
      //   icon: 'eth',
      //   address: config.tokens.eth,
      //   needZap: true,
      // },
      // {
      //   symbol: 'WETH',
      //   icon: 'weth',
      //   address: config.tokens.weth,
      //   needZap: true,
      // },
    ],
  },

  {
    logo: rocketPoolETHIcons,
    id: 9,
    apy: 0,
    name: 'RocketPoolETH',
    nameShow: 'Curve RocketPoolETH pool',
    stakeTokenSymbol: 'RocketPoolETH',
    tvlPriceTokenId: 'curveLP-rocketpooleth',
    stakeTokenContractAddress: config.convexVaultPool.rocketpooleth,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'acrv',
    rewardTokenDecimals: 18,
    isShowEthApy: true,
    site: 'convex',
    isMigrate: false,
    zapTokens: [
      {
        symbol: 'RocketPoolETH',
        icon: rocketPoolETHIcons,
        address: config.convexVaultPool.rocketpooleth,
        needZap: false,
        isLp: true,
      },
      config.zapTokens.ETH,
      config.zapTokens.WETH,
      config.zapTokens.STETH,
      config.zapTokens.RETH,
      config.zapTokens.WSTETH,
      config.zapTokens.USDC,
    ],
  },

  {
    logo: `${cryptoIcons}#renbtc`,
    id: 10,
    apy: 0,
    name: 'ren',
    nameShow: 'Curve ren pool',
    stakeTokenSymbol: 'renCrv',
    tvlPriceTokenId: 'curveLP-ren',
    stakeTokenContractAddress: config.convexVaultPool.ren,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'acrv',
    rewardTokenDecimals: 18,
    isShowEthApy: false,
    site: 'convex',
    zapTokens: [
      {
        symbol: 'renCrv',
        icon: 'renbtc',
        address: config.convexVaultPool.ren,
        needZap: false,
        isLp: true,
      },
      config.zapTokens.WBTC,
      config.zapTokens.ETH,
      config.zapTokens.WETH,
      config.zapTokens.RENBTC,
      config.zapTokens.USDC,
    ],
  },

  {
    logo: pusdIcons,
    id: 11,
    apy: 0,
    name: 'pusd',
    nameShow: 'Curve pusd pool',
    stakeTokenSymbol: 'pusdCrv',
    tvlPriceTokenId: 'curveLP-pusd',
    stakeTokenContractAddress: config.convexVaultPool.pusd,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'acrv',
    rewardTokenDecimals: 18,
    isShowEthApy: false,
    site: 'convex',
    zapTokens: [
      {
        symbol: 'pusdCrv',
        icon: pusdIcons,
        address: config.convexVaultPool.pusd,
        needZap: false,
        isLp: true,
      },
      config.zapTokens.ETH,
      config.zapTokens.WETH,
      config.zapTokens.USDC,
      config.zapTokens.DAI,
      config.zapTokens.USDT,
      config.zapTokens.CRV3POOL,
      config.zapTokens.PUSD,
    ],
  },

  {
    logo: susdIcons,
    id: 12,
    apy: 0,
    name: 'sUSD',
    nameShow: 'Curve susd pool',
    stakeTokenSymbol: 'susdCrv',
    tvlPriceTokenId: 'curveLP-susd',
    stakeTokenContractAddress: config.convexVaultPool.susd,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'acrv',
    rewardTokenDecimals: 18,
    isShowEthApy: false,
    site: 'convex',
    zapTokens: [
      {
        symbol: 'susdCrv',
        icon: susdIcons,
        address: config.convexVaultPool.susd,
        needZap: false,
        isLp: true,
      },
      // {
      //   symbol: 'ETH',
      //   icon: 'eth',
      //   address: config.tokens.eth,
      //   needZap: true,
      // },
      // {
      //   symbol: 'WETH',
      //   icon: 'weth',
      //   address: config.tokens.weth,
      //   needZap: true,
      // },
      // {
      //   symbol: 'USDC',
      //   icon: 'usdc',
      //   decimals: 6,
      //   address: config.tokens.usdc,
      //   needZap: true,
      // },
      // {
      //   symbol: 'DAI',
      //   icon: 'dai',
      //   address: config.tokens.dai,
      //   needZap: true,
      // },
      // {
      //   symbol: 'USDT',
      //   icon: 'usdt',
      //   decimals: 6,
      //   address: config.tokens.usdt,
      //   needZap: true,
      // },
      // {
      //   symbol: 'SUSD',
      //   icon: susdIcons,
      //   address: config.tokens.SUSD,
      //   needZap: true,
      // },
    ],
  },

  {
    logo: sbtcIcons,
    id: 13,
    apy: 0,
    name: 'sbtc',
    nameShow: 'Curve sbtc pool',
    stakeTokenSymbol: 'sbtcCrv',
    tvlPriceTokenId: 'curveLP-sbtc',
    stakeTokenContractAddress: config.convexVaultPool.sbtc,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'acrv',
    rewardTokenDecimals: 18,
    isShowEthApy: false,
    site: 'convex',
    zapTokens: [
      {
        symbol: 'sbtcCrv',
        icon: sbtcIcons,
        address: config.convexVaultPool.sbtc,
        needZap: false,
        isLp: true,
      },
      config.zapTokens.ETH,
      config.zapTokens.WETH,
      config.zapTokens.USDC,
      config.zapTokens.WBTC,
      config.zapTokens.SBTC,
      config.zapTokens.RENBTC,
    ],
  },

  {
    logo: sethIcons,
    id: 14,
    apy: 0,
    name: 'seth',
    nameShow: 'Curve seth pool',
    stakeTokenSymbol: 'sethCrv',
    tvlPriceTokenId: 'curveLP-seth',
    stakeTokenContractAddress: config.convexVaultPool.seth,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'acrv',
    rewardTokenDecimals: 18,
    isShowEthApy: false,
    site: 'convex',
    zapTokens: [
      {
        symbol: 'sethCrv',
        icon: sethIcons,
        address: config.convexVaultPool.seth,
        needZap: false,
        isLp: true,
      },
      config.zapTokens.ETH,
      config.zapTokens.WETH,
      config.zapTokens.USDC,
      config.zapTokens.SETH,
    ],
  },
  {
    logo: `${cryptoIcons}#frax`,
    id: 15,
    apy: 0,
    name: 'fraxusdc',
    nameShow: 'Curve fraxusdc pool',
    stakeTokenSymbol: 'fraxusdcCrv',
    tvlPriceTokenId: 'curveLP-fraxusdc',
    stakeTokenContractAddress: config.convexVaultPool.fraxusdc,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'acrv',
    rewardTokenDecimals: 18,
    isShowEthApy: false,
    site: 'convex',
    zapTokens: [
      {
        symbol: 'fraxusdcCrv',
        icon: `${cryptoIcons}#frax`,
        address: config.convexVaultPool.fraxusdc,
        needZap: false,
        isLp: true,
      },
      config.zapTokens.ETH,
      config.zapTokens.WETH,
      config.zapTokens.USDC,
      config.zapTokens.FRAX,
    ],
  },

]
// export const VAULT_LIST = []

export const VAULT_LIST_IFO = [
  {
    logo: `${cryptoIcons}#steth`,
    id: 0,
    name: 'steth',
    nameShow: 'Curve stETH pool',
    apy: 0,
    stakeTokenSymbol: 'stethCRV',
    tvlPriceTokenId: 'curveLP-steth',
    stakeTokenContractAddress: config.convexVaultPool.steth,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'CTR',
    rewardTokenDecimals: 18,
    zapTokens: [
      {
        symbol: 'stethCRV',
        icon: 'steth',
        address: config.convexVaultPool.steth,
        needZap: false,
        isLp: true,
      },
      {
        ...config.zapTokens.STETH,
        "routes": ["0x5503dc24316b9ae028f1497c275eb9192a3ea0f67022"]
      },
      {
        ...config.zapTokens.ETH,
        "routes": ["0x4103dc24316b9ae028f1497c275eb9192a3ea0f67022"]
      },
      {
        ...config.zapTokens.WETH,
        "routes": ["0x4103dc24316b9ae028f1497c275eb9192a3ea0f67022"]
      },
      {
        ...config.zapTokens.USDC,
        "routes": ["0x110188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x4103dc24316b9ae028f1497c275eb9192a3ea0f67022"]
      },
    ],
  },
  {
    logo: `${cryptoIcons}#frax`,
    id: 1,
    name: 'frax',
    nameShow: 'Curve frax pool',
    apy: 0,
    stakeTokenSymbol: 'fraxCrv',
    tvlPriceTokenId: 'curveLP-frax',
    stakeTokenContractAddress: config.convexVaultPool.frax,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'acrv',
    rewardTokenDecimals: 18,
    isExpired: true,
    zapTokens: [
      {
        symbol: 'fraxCrv',
        icon: 'frax',
        address: config.convexVaultPool.frax,
        needZap: false,
        isLp: true,
      },
      {
        ...config.zapTokens.FRAX,
        "routes": ["0x410fd632f22692fac7611d2aa1c0d552930d43caed3b"]
      },
      {
        ...config.zapTokens.CRV3POOL,
        "routes": ["0x550fd632f22692fac7611d2aa1c0d552930d43caed3b"]
      },
      {
        ...config.zapTokens.USDT,
        "routes": ["0x7f10d632f22692fac7611d2aa1c0d552930d43caed3b"]
      },
      {
        ...config.zapTokens.USDC,
        "routes": ["0x6b10d632f22692fac7611d2aa1c0d552930d43caed3b"]
      },
      {
        ...config.zapTokens.ETH,
        "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x6b10d632f22692fac7611d2aa1c0d552930d43caed3b"]
      },
      {
        ...config.zapTokens.DAI,
        "routes": ["0x5710d632f22692fac7611d2aa1c0d552930d43caed3b"]
      },
      {
        ...config.zapTokens.WETH,
        "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x6b10d632f22692fac7611d2aa1c0d552930d43caed3b"]
      },
    ],
  },
  {
    logo: `${cryptoIcons}#tricrypto2`,
    id: 2,
    name: 'tricrypto2',
    nameShow: 'Curve tricrypto2 pool',
    apy: 0,
    stakeTokenSymbol: '3CrvCrypto2',
    tvlPriceTokenId: 'curveLP-tricrypto2',
    stakeTokenContractAddress: config.convexVaultPool.tricrypto2,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'CTR',
    rewardTokenDecimals: 18,
    zapTokens: [
      {
        symbol: '3CrvCrypto2',
        icon: 'tricrypto2',
        address: config.convexVaultPool.tricrypto2,
        needZap: false,
        isLp: true,
      },
      {
        ...config.zapTokens.WBTC,
        "routes": ["0x5606d51a44d3fae010294c616388b506acda1bfaae46"]
      },
      {
        ...config.zapTokens.ETH,
        "routes": ["0x6a06d51a44d3fae010294c616388b506acda1bfaae46"]
      },
      {
        ...config.zapTokens.WETH,
        "routes": ["0x6a06d51a44d3fae010294c616388b506acda1bfaae46"]
      },
      {
        ...config.zapTokens.USDT,
        "routes": ["0x4206d51a44d3fae010294c616388b506acda1bfaae46"]
      },
      {
        ...config.zapTokens.USDC,
        "routes": ["0x11013416cf6c708da44db2624d63ea0aaef7113527c6", "0x4206d51a44d3fae010294c616388b506acda1bfaae46"]
      },
    ],
  },
  {
    logo: `${cryptoIcons}#crv`,
    id: 3,
    apy: 0,
    name: 'cvxcrv',
    nameShow: 'Curve cvxcrv pool',
    stakeTokenSymbol: 'cvxcrvCrv',
    tvlPriceTokenId: 'curveLP-cvxcrv',
    stakeTokenContractAddress: config.convexVaultPool.cvxcrv,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'CTR',
    rewardTokenDecimals: 18,
    zapTokens: [
      {
        symbol: 'cvxcrvCrv',
        icon: 'crv',
        address: config.convexVaultPool.cvxcrv,
        needZap: false,
        isLp: true,
      },
      {
        ...config.zapTokens.CRV,
        "routes": ["0x410e9d0464996170c6b9e75eed71c68b99ddedf279e8"]
      },
      {
        ...config.zapTokens.CVXCRV,
        "routes": ["0x550e9d0464996170c6b9e75eed71c68b99ddedf279e8"]
      },
      {
        ...config.zapTokens.ETH,
        "routes": ["0x11048301ae4fc9c624d1d396cbdaa1ed877821d7c511", "0x410e9d0464996170c6b9e75eed71c68b99ddedf279e8"]
      },
      {
        ...config.zapTokens.WETH,
        "routes": ["0x11048301ae4fc9c624d1d396cbdaa1ed877821d7c511", "0x410e9d0464996170c6b9e75eed71c68b99ddedf279e8"]
      },
      {
        ...config.zapTokens.USDC,
        "routes": ["0x110188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x11048301ae4fc9c624d1d396cbdaa1ed877821d7c511", "0x410e9d0464996170c6b9e75eed71c68b99ddedf279e8"]
      },
    ],
  },
  {
    logo: `${cryptoIcons}#crv`,
    id: 4,
    name: 'crveth',
    nameShow: 'Curve crveth pool',
    apy: 0,
    stakeTokenSymbol: 'crvethCrv',
    tvlPriceTokenId: 'curveLP-crveth',
    stakeTokenContractAddress: config.convexVaultPool.crveth,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'CTR',
    rewardTokenDecimals: 18,
    zapTokens: [
      {
        symbol: 'crvethCrv',
        icon: 'crv',
        address: config.convexVaultPool.crveth,
        isLp: true,
        needZap: false,
      },
      {
        ...config.zapTokens.CRV,
        "routes": ["0x55048301ae4fc9c624d1d396cbdaa1ed877821d7c511"]
      },
      {
        ...config.zapTokens.ETH,
        "routes": ["0x41048301ae4fc9c624d1d396cbdaa1ed877821d7c511"]
      },
      {
        ...config.zapTokens.WETH,
        "routes": ["0x41048301ae4fc9c624d1d396cbdaa1ed877821d7c511"]
      },
      {
        ...config.zapTokens.USDC,
        "routes": ["0x110188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x41048301ae4fc9c624d1d396cbdaa1ed877821d7c511"]
      },
    ],
  },
  {
    logo: `${cryptoIcons}#cvx`,
    id: 5,
    name: 'cvxeth',
    nameShow: 'Curve cvxeth pool',
    apy: 0,
    stakeTokenSymbol: 'cvxethCrv',
    tvlPriceTokenId: 'curveLP-cvxeth',
    stakeTokenContractAddress: config.convexVaultPool.cvxeth,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'CTR',
    rewardTokenDecimals: 18,
    zapTokens: [
      {
        symbol: 'cvxethCrv',
        icon: 'cvx',
        address: config.convexVaultPool.cvxeth,
        isLp: true,
        needZap: false,
      },
      {
        ...config.zapTokens.CVX,
        "routes": ["0x5504b576491f1e6e5e62f1d8f26062ee822b40b0e0d4"]
      },
      {
        ...config.zapTokens.ETH,
        "routes": ["0x4104b576491f1e6e5e62f1d8f26062ee822b40b0e0d4"]
      },
      {
        ...config.zapTokens.WETH,
        "routes": ["0x4104b576491f1e6e5e62f1d8f26062ee822b40b0e0d4"]
      },
      {
        ...config.zapTokens.USDC,
        "routes": ["0x110188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x4104b576491f1e6e5e62f1d8f26062ee822b40b0e0d4"]
      },
    ],
  },

  {
    logo: `${cryptoIcons}#fxs`,
    id: 6,
    apy: 0,
    name: 'cvxfxs',
    nameShow: 'Curve cvxfxs pool',
    stakeTokenSymbol: 'cvxfxsCrv',
    tvlPriceTokenId: 'curveLP-cvxfxs',
    stakeTokenContractAddress: config.convexVaultPool.cvxfxs,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'CTR',
    rewardTokenDecimals: 18,
    site: 'convex',
    zapTokens: [
      {
        symbol: 'cvxfxsCrv',
        icon: 'fxs',
        address: config.convexVaultPool.cvxfxs,
        isLp: true,
        needZap: false,
      },
      {
        ...config.zapTokens.CVXFXS,
        "routes": ["0x5504d658a338613198204dca1143ac3f01a722b5d94a"]
      },
      {
        ...config.zapTokens.FXS,
        "routes": ["0x4104d658a338613198204dca1143ac3f01a722b5d94a"]
      },
      {
        ...config.zapTokens.ETH,
        "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x0501c63b0708e2f7e69cb8a1df0e1389a98c35a76d52", "0x0500e1573b9d29e2183b1af0e743dc2754979a40d237", "0x4104d658a338613198204dca1143ac3f01a722b5d94a"]
      },
      {
        ...config.zapTokens.WETH,
        "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x0501c63b0708e2f7e69cb8a1df0e1389a98c35a76d52", "0x0500e1573b9d29e2183b1af0e743dc2754979a40d237", "0x4104d658a338613198204dca1143ac3f01a722b5d94a"]
      },
      {
        ...config.zapTokens.USDC,
        "routes": ["0x0501c63b0708e2f7e69cb8a1df0e1389a98c35a76d52", "0x0500e1573b9d29e2183b1af0e743dc2754979a40d237", "0x4104d658a338613198204dca1143ac3f01a722b5d94a"]
      },
    ],
  },
  {
    logo: `${cryptoIcons}#3pool`,
    id: 7,
    apy: 0,
    name: '3pool',
    nameShow: 'Curve 3pool pool',
    stakeTokenSymbol: 'crv3pool',
    tvlPriceTokenId: 'curveLP-crv3pool',
    stakeTokenContractAddress: config.convexVaultPool.crv3pool,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'CTR',
    rewardTokenDecimals: 18,
    site: 'convex',
    isExpired: true,
    zapTokens: [
      {
        symbol: 'crv3pool',
        icon: '3pool',
        address: config.convexVaultPool.crv3pool,
        isLp: true,
        needZap: false,
      },
      {
        ...config.zapTokens.DAI,
        "routes": ["0x4207bebc44782c7db0a1a60cb6fe97d0b483032ff1c7"]
      },
      {
        ...config.zapTokens.USDC,
        "routes": ["0x5607bebc44782c7db0a1a60cb6fe97d0b483032ff1c7"]
      },
      {
        ...config.zapTokens.USDT,
        "routes": ["0x6a07bebc44782c7db0a1a60cb6fe97d0b483032ff1c7"]
      },
      {
        ...config.zapTokens.ETH,
        "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x5607bebc44782c7db0a1a60cb6fe97d0b483032ff1c7"]
      },
      {
        ...config.zapTokens.WETH,
        "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x5607bebc44782c7db0a1a60cb6fe97d0b483032ff1c7"]
      },
    ],
  },

  // {
  //   logo: ironbankIcons,
  //   id: 8,
  //   apy: 0,
  //   name: 'ironbank',
  //   nameShow: 'Curve ironbank pool',
  //   stakeTokenSymbol: 'ironbankCrv',
  //   tvlPriceTokenId: 'curveLP-ironbank',
  //   stakeTokenContractAddress: config.convexVaultPool.ironbank,
  //   stakeTokenDecimals: 18,
  //   rewardTokenSymbol: 'CTR',
  //   rewardTokenDecimals: 18,
  //   isShowEthApy: false,
  //   site: 'convex',
  //   zapTokens: [
  //     {
  //       symbol: 'ironbankCrv',
  //       icon: ironbankIcons,
  //       address: config.convexVaultPool.ironbank,
  //       needZap: false,
  //       isLp: true,
  //     },
  //     {
  //       ...config.zapTokens.ETH,
  //       "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x46092dded6da1bf5dbdf597c45fcfaa3194e53ecfeaf"]
  //     },
  //     {
  //       ...config.zapTokens.WETH,
  //       "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x46092dded6da1bf5dbdf597c45fcfaa3194e53ecfeaf"]
  //     },
  //     {
  //       ...config.zapTokens.USDC,
  //       "routes": ["0x56092dded6da1bf5dbdf597c45fcfaa3194e53ecfeaf"]
  //     },
  //     {
  //       ...config.zapTokens.DAI,
  //       "routes": ["0x42092dded6da1bf5dbdf597c45fcfaa3194e53ecfeaf"]
  //     },
  //     {
  //       ...config.zapTokens.USDT,
  //       "routes": ["0x6a092dded6da1bf5dbdf597c45fcfaa3194e53ecfeaf"]
  //     },
  //   ],
  // },

  {
    logo: `${cryptoIcons}#mim`,
    id: 9,
    apy: 0,
    name: 'mim',
    nameShow: 'Curve mim pool',
    stakeTokenSymbol: 'mimCrv',
    tvlPriceTokenId: 'curveLP-mim',
    stakeTokenContractAddress: config.convexVaultPool.mim,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'CTR',
    rewardTokenDecimals: 18,
    isShowEthApy: false,
    site: 'convex',
    zapTokens: [
      {
        symbol: 'mimCrv',
        icon: `${cryptoIcons}#mim`,
        address: config.convexVaultPool.mim,
        needZap: false,
        isLp: true,
      },
      {
        ...config.zapTokens.ETH,
        "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x6b105a6a4d54456819380173272a5e8e9b9904bdf41b"]
      },
      {
        ...config.zapTokens.WETH,
        "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x6b105a6a4d54456819380173272a5e8e9b9904bdf41b"]
      },
      {
        ...config.zapTokens.USDC,
        "routes": ["0x6b105a6a4d54456819380173272a5e8e9b9904bdf41b"]
      },
      {
        ...config.zapTokens.DAI,
        "routes": ["0x57105a6a4d54456819380173272a5e8e9b9904bdf41b"]
      },
      {
        ...config.zapTokens.USDT,
        "routes": ["0x7f105a6a4d54456819380173272a5e8e9b9904bdf41b"]
      },
      {
        ...config.zapTokens.CRV3POOL,
        "routes": ["0x550f5a6a4d54456819380173272a5e8e9b9904bdf41b"]
      },
      {
        ...config.zapTokens.MIM,
        "routes": ["0x410f5a6a4d54456819380173272a5e8e9b9904bdf41b"]
      },
    ],
  },

  {
    logo: `${cryptoIcons}#renbtc`,
    id: 10,
    apy: 0,
    name: 'ren',
    nameShow: 'Curve ren pool',
    stakeTokenSymbol: 'renCrv',
    tvlPriceTokenId: 'curveLP-ren',
    stakeTokenContractAddress: config.convexVaultPool.ren,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'CTR',
    rewardTokenDecimals: 18,
    isShowEthApy: false,
    site: 'convex',
    zapTokens: [
      {
        symbol: 'renCrv',
        icon: 'renbtc',
        address: config.convexVaultPool.ren,
        needZap: false,
        isLp: true,
      },
      {
        ...config.zapTokens.WBTC,
        "routes": ["0x550793054188d876f558f4a66b2ef1d97d16edf0895b"]
      },
      {
        ...config.zapTokens.ETH,
        "routes": ["0x05014585fe77225b41b697c938b018e2ac67ac5a20c0", "0x550793054188d876f558f4a66b2ef1d97d16edf0895b"]
      },
      {
        ...config.zapTokens.WETH,
        "routes": ["0x05014585fe77225b41b697c938b018e2ac67ac5a20c0", "0x550793054188d876f558f4a66b2ef1d97d16edf0895b"]
      },
      {
        ...config.zapTokens.RENBTC,
        "routes": ["0x410793054188d876f558f4a66b2ef1d97d16edf0895b"]
      },
      {
        ...config.zapTokens.USDC,
        "routes": ["0x2607bebc44782c7db0a1a60cb6fe97d0b483032ff1c7", "0x1206d51a44d3fae010294c616388b506acda1bfaae46", "0x550793054188d876f558f4a66b2ef1d97d16edf0895b"]
      },
    ],
  },

  {
    logo: pusdIcons,
    id: 11,
    apy: 0,
    name: 'pusd',
    nameShow: 'Curve pusd pool',
    stakeTokenSymbol: 'pusdCrv',
    tvlPriceTokenId: 'curveLP-pusd',
    stakeTokenContractAddress: config.convexVaultPool.pusd,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'CTR',
    rewardTokenDecimals: 18,
    isShowEthApy: false,
    site: 'convex',
    zapTokens: [
      {
        symbol: 'pusdCrv',
        icon: pusdIcons,
        address: config.convexVaultPool.pusd,
        needZap: false,
        isLp: true,
      },
      {
        ...config.zapTokens.ETH,
        "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x6b108ee017541375f6bcd802ba119bddc94dad6911a1"]
      },
      {
        ...config.zapTokens.WETH,
        "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x6b108ee017541375f6bcd802ba119bddc94dad6911a1"]
      },
      {
        ...config.zapTokens.USDC,
        "routes": ["0x6b108ee017541375f6bcd802ba119bddc94dad6911a1"]
      },
      {
        ...config.zapTokens.DAI,
        "routes": ["0x57108ee017541375f6bcd802ba119bddc94dad6911a1"]
      },
      {
        ...config.zapTokens.USDT,
        "routes": ["0x7f108ee017541375f6bcd802ba119bddc94dad6911a1"]
      },
      {
        ...config.zapTokens.CRV3POOL,
        "routes": ["0x550f8ee017541375f6bcd802ba119bddc94dad6911a1"]
      },
      {
        ...config.zapTokens.PUSD,
        "routes": ["0x410f8ee017541375f6bcd802ba119bddc94dad6911a1"]
      },
    ],
  },

  {
    // logo: susdIcons,
    logo: `${cryptoIcons}#susd`,
    id: 12,
    apy: 0,
    name: 'sUSD',
    nameShow: 'Curve susd pool',
    stakeTokenSymbol: 'susdCrv',
    tvlPriceTokenId: 'curveLP-susd',
    stakeTokenContractAddress: config.convexVaultPool.susd,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'CTR',
    rewardTokenDecimals: 18,
    isShowEthApy: false,
    site: 'convex',
    zapTokens: [
      {
        symbol: 'susdCrv',
        icon: susdIcons,
        address: config.convexVaultPool.susd,
        needZap: false,
        isLp: true,
      },
      {
        ...config.zapTokens.DAI,
        "routes": ["0x430bfcba3e75865d2d561be8d220616520c171f12851"]
      },
      {
        ...config.zapTokens.USDC,
        "routes": ["0x570bfcba3e75865d2d561be8d220616520c171f12851"]
      },
      {
        ...config.zapTokens.USDT,
        "routes": ["0x6b0bfcba3e75865d2d561be8d220616520c171f12851"]
      },
      {
        ...config.zapTokens.SUSD,
        "routes": ["0x7f0bfcba3e75865d2d561be8d220616520c171f12851"]
      },
      {
        ...config.zapTokens.WETH,
        "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x470bfcba3e75865d2d561be8d220616520c171f12851"]
      },
      {
        ...config.zapTokens.ETH,
        "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x470bfcba3e75865d2d561be8d220616520c171f12851"]
      },
    ],
  },

  {
    // logo: sbtcIcons,
    logo: `${cryptoIcons}#sbtc`,
    id: 13,
    apy: 0,
    name: 'sbtc',
    nameShow: 'Curve sbtc pool',
    stakeTokenSymbol: 'sbtcCrv',
    tvlPriceTokenId: 'curveLP-sbtc',
    stakeTokenContractAddress: config.convexVaultPool.sbtc,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'CTR',
    rewardTokenDecimals: 18,
    isShowEthApy: false,
    site: 'convex',
    zapTokens: [
      {
        symbol: 'sbtcCrv',
        icon: sbtcIcons,
        address: config.convexVaultPool.sbtc,
        needZap: false,
        isLp: true,
      },
      {
        ...config.zapTokens.ETH,
        "routes": ["0x1a06d51a44d3fae010294c616388b506acda1bfaae46", "0x56077fc77b5c7614e1533320ea6ddc2eb61fa00a9714"]
      },
      {
        ...config.zapTokens.WETH,
        "routes": ["0x1a06d51a44d3fae010294c616388b506acda1bfaae46", "0x56077fc77b5c7614e1533320ea6ddc2eb61fa00a9714"]
      },
      {
        ...config.zapTokens.USDC,
        "routes": ["0x110188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x1a06d51a44d3fae010294c616388b506acda1bfaae46", "0x56077fc77b5c7614e1533320ea6ddc2eb61fa00a9714"]
      },
      {
        ...config.zapTokens.WBTC,
        "routes": ["0x56077fc77b5c7614e1533320ea6ddc2eb61fa00a9714"]
      },
      {
        ...config.zapTokens.SBTC,
        "routes": ["0x6a077fc77b5c7614e1533320ea6ddc2eb61fa00a9714"]
      },
      {
        ...config.zapTokens.RENBTC,
        "routes": ["0x42077fc77b5c7614e1533320ea6ddc2eb61fa00a9714"]
      },
    ],
  },

  {
    // logo: sethIcons,
    logo: `${cryptoIcons}#seth`,
    id: 14,
    apy: 0,
    name: 'seth',
    nameShow: 'Curve seth pool',
    stakeTokenSymbol: 'sethCrv',
    tvlPriceTokenId: 'curveLP-seth',
    stakeTokenContractAddress: config.convexVaultPool.seth,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'CTR',
    rewardTokenDecimals: 18,
    isShowEthApy: false,
    site: 'convex',
    zapTokens: [
      {
        symbol: 'sethCrv',
        icon: sethIcons,
        address: config.convexVaultPool.seth,
        needZap: false,
        isLp: true,
      },
      {
        ...config.zapTokens.ETH,
        "routes": ["0x4103c5424b857f758e906013f3555dad202e4bdb4567"]
      },
      {
        ...config.zapTokens.WETH,
        "routes": ["0x4103c5424b857f758e906013f3555dad202e4bdb4567"]
      },
      {
        ...config.zapTokens.USDC,
        "routes": ["0x110188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x4103c5424b857f758e906013f3555dad202e4bdb4567"]
      },
      {
        ...config.zapTokens.SETH,
        "routes": ["0x5503c5424b857f758e906013f3555dad202e4bdb4567"]
      },
    ],
  },
  {
    logo: `${cryptoIcons}#frax`,
    id: 15,
    apy: 0,
    name: 'fraxusdc',
    nameShow: 'Curve fraxusdc pool',
    stakeTokenSymbol: 'fraxusdcCrv',
    tvlPriceTokenId: 'curveLP-fraxusdc',
    stakeTokenContractAddress: config.convexVaultPool.fraxusdc,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'CTR',
    rewardTokenDecimals: 18,
    isShowEthApy: false,
    site: 'convex',
    zapTokens: [
      {
        symbol: 'fraxusdcCrv',
        icon: `${cryptoIcons}#frax`,
        address: config.convexVaultPool.fraxusdc,
        needZap: false,
        isLp: true,
      },
      {
        ...config.zapTokens.ETH,
        "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x4507dcef968d416a41cdac0ed8702fac8128a64241a2"]
      },
      {
        ...config.zapTokens.WETH,
        "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x4507dcef968d416a41cdac0ed8702fac8128a64241a2"]
      },
      {
        ...config.zapTokens.USDC,
        "routes": ["0x5507dcef968d416a41cdac0ed8702fac8128a64241a2"]
      },
      {
        ...config.zapTokens.FRAX,
        "routes": ["0x4107dcef968d416a41cdac0ed8702fac8128a64241a2"]
      }
    ],
  },

  {
    logo: fpifraxIcon,
    id: 16,
    apy: 0,
    name: 'fpifrax',
    nameShow: 'Curve fpifrax pool',
    stakeTokenSymbol: 'fpifraxCrv',
    tvlPriceTokenId: 'curveLP-fpifrax',
    stakeTokenContractAddress: config.convexVaultPool.fpifrax,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'CTR',
    rewardTokenDecimals: 18,
    isShowEthApy: false,
    site: 'convex',
    zapTokens: [
      {
        symbol: 'fpifraxCrv',
        icon: fpifraxIcon,
        address: config.convexVaultPool.fpifrax,
        needZap: false,
        isLp: true,
      },
      {
        ...config.zapTokens.ETH,
        "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x0501c63b0708e2f7e69cb8a1df0e1389a98c35a76d52", "0x4104f861483fa7e511fbc37487d91b6faa803af5d37c"]
      },
      {
        ...config.zapTokens.WETH,
        "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x0501c63b0708e2f7e69cb8a1df0e1389a98c35a76d52", "0x4104f861483fa7e511fbc37487d91b6faa803af5d37c"]
      },
      {
        ...config.zapTokens.USDC,
        "routes": ["0x0501c63b0708e2f7e69cb8a1df0e1389a98c35a76d52", "0x4104f861483fa7e511fbc37487d91b6faa803af5d37c"]
      },
      {
        ...config.zapTokens.FPI,
        "routes": ["0x5504f861483fa7e511fbc37487d91b6faa803af5d37c"]
      },
      {
        ...config.zapTokens.FRAX,
        "routes": ["0x4104f861483fa7e511fbc37487d91b6faa803af5d37c"]
      }
    ],
  },
  {
    logo: `${cryptoIcons}#alusd`,
    id: 17,
    apy: 0,
    name: 'alusd',
    nameShow: 'Curve alusd pool',
    stakeTokenSymbol: 'alusdCrv',
    tvlPriceTokenId: 'curveLP-alusd',
    stakeTokenContractAddress: config.convexVaultPool.alusd,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'CTR',
    rewardTokenDecimals: 18,
    isShowEthApy: false,
    site: 'convex',
    zapTokens: [
      {
        symbol: 'alusdCrv',
        icon: `${cryptoIcons}#alusd`,
        address: config.convexVaultPool.alusd,
        needZap: false,
        isLp: true,
      },
      {
        ...config.zapTokens.ETH,
        "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x6b1043b4fdfd4ff969587185cdb6f0bd875c5fc83f8c"]
      },
      {
        ...config.zapTokens.WETH,
        "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x6b1043b4fdfd4ff969587185cdb6f0bd875c5fc83f8c"]
      },
      {
        ...config.zapTokens.USDC,
        "routes": ["0x6b1043b4fdfd4ff969587185cdb6f0bd875c5fc83f8c"]
      },
      {
        ...config.zapTokens.DAI,
        "routes": ["0x571043b4fdfd4ff969587185cdb6f0bd875c5fc83f8c"]
      },
      {
        ...config.zapTokens.USDT,
        "routes": ["0x7f1043b4fdfd4ff969587185cdb6f0bd875c5fc83f8c"]
      },
      {
        ...config.zapTokens.CRV3POOL,
        "routes": ["0x550f43b4fdfd4ff969587185cdb6f0bd875c5fc83f8c"]
      },
      {
        ...config.zapTokens.ALUSD,
        "routes": ["0x410f43b4fdfd4ff969587185cdb6f0bd875c5fc83f8c"]
      }
    ],
  },

  // {
  //   logo: compoundIcons,
  //   id: 18,
  //   apy: 0,
  //   name: 'Compound',
  //   nameShow: 'Curve Compound pool',
  //   stakeTokenSymbol: 'CompoundCrv',
  //   tvlPriceTokenId: 'curveLP-Compound',
  //   stakeTokenContractAddress: config.convexVaultPool.Compound,
  //   stakeTokenDecimals: 18,
  //   rewardTokenSymbol: 'CTR',
  //   rewardTokenDecimals: 18,
  //   isShowEthApy: false,
  //   site: 'convex',
  //   zapTokens: [
  //     {
  //       symbol: 'CompoundCrv',
  //       icon: compoundIcons,
  //       address: config.convexVaultPool.Compound,
  //       needZap: false,
  //       isLp: true,
  //     },
  //     {
  //       ...config.zapTokens.ETH,
  //       "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x550beb21209ae4c2c9ff2a86aca31e123764a3b6bc06"]
  //     },
  //     {
  //       ...config.zapTokens.WETH,
  //       "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x550beb21209ae4c2c9ff2a86aca31e123764a3b6bc06"]
  //     },
  //     {
  //       ...config.zapTokens.USDC,
  //       "routes": ["0x550beb21209ae4c2c9ff2a86aca31e123764a3b6bc06"]
  //     },
  //     {
  //       ...config.zapTokens.DAI,
  //       "routes": ["0x410beb21209ae4c2c9ff2a86aca31e123764a3b6bc06"]
  //     }
  //   ],
  // },

  {
    logo: `${cryptoIcons}#dola`,
    id: 19,
    apy: 0,
    name: 'dola',
    nameShow: 'Curve dola pool',
    stakeTokenSymbol: 'dolaCrv',
    tvlPriceTokenId: 'curveLP-dola',
    stakeTokenContractAddress: config.convexVaultPool.dola,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'CTR',
    rewardTokenDecimals: 18,
    isShowEthApy: false,
    site: 'convex',
    zapTokens: [
      {
        symbol: 'dolaCrv',
        icon: `${cryptoIcons}#dola`,
        address: config.convexVaultPool.dola,
        needZap: false,
        isLp: true,
      },
      {
        ...config.zapTokens.ETH,
        "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x6b10aa5a67c256e27a5d80712c51971408db3370927d"]
      },
      {
        ...config.zapTokens.WETH,
        "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x6b10aa5a67c256e27a5d80712c51971408db3370927d"]
      },
      {
        ...config.zapTokens.USDC,
        "routes": ["0x6b10aa5a67c256e27a5d80712c51971408db3370927d"]
      },
      {
        ...config.zapTokens.DAI,
        "routes": ["0x5710aa5a67c256e27a5d80712c51971408db3370927d"]
      },
      {
        ...config.zapTokens.USDT,
        "routes": ["0x7f10aa5a67c256e27a5d80712c51971408db3370927d"]
      },
      {
        ...config.zapTokens.CRV3POOL,
        "routes": ["0x550faa5a67c256e27a5d80712c51971408db3370927d"]
      },
      {
        ...config.zapTokens.DOLA,
        "routes": ["0x410faa5a67c256e27a5d80712c51971408db3370927d"]
      }
    ],
  },
  // {
  //   logo: busdIcons,
  //   id: 20,
  //   apy: 0,
  //   name: 'busdv2',
  //   nameShow: 'Curve busdv2 pool',
  //   stakeTokenSymbol: 'busdv2Crv',
  //   tvlPriceTokenId: 'curveLP-busdv2',
  //   stakeTokenContractAddress: config.convexVaultPool.busdv2,
  //   stakeTokenDecimals: 18,
  //   rewardTokenSymbol: 'CTR',
  //   rewardTokenDecimals: 18,
  //   isShowEthApy: false,
  //   site: 'convex',
  //   zapTokens: [
  //     {
  //       symbol: 'busdv2Crv',
  //       icon: busdIcons,
  //       address: config.convexVaultPool.busdv2,
  //       needZap: false,
  //       isLp: true,
  //     },
  //     {
  //       ...config.zapTokens.ETH,
  //       "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x6b104807862aa8b2bf68830e4c8dc86d0e9a998e085a"]
  //     },
  //     {
  //       ...config.zapTokens.WETH,
  //       "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x6b104807862aa8b2bf68830e4c8dc86d0e9a998e085a"]
  //     },
  //     {
  //       ...config.zapTokens.USDC,
  //       "routes": ["0x6b104807862aa8b2bf68830e4c8dc86d0e9a998e085a"]
  //     },
  //     {
  //       ...config.zapTokens.DAI,
  //       "routes": ["0x57104807862aa8b2bf68830e4c8dc86d0e9a998e085a"]
  //     },
  //     {
  //       ...config.zapTokens.USDT,
  //       "routes": ["0x7f104807862aa8b2bf68830e4c8dc86d0e9a998e085a"]
  //     },
  //     {
  //       ...config.zapTokens.CRV3POOL,
  //       "routes": ["0x550f4807862aa8b2bf68830e4c8dc86d0e9a998e085a"]
  //     },
  //     {
  //       ...config.zapTokens.BUSD,
  //       "routes": ["0x410f4807862aa8b2bf68830e4c8dc86d0e9a998e085a"]
  //     }
  //   ],
  // },
  {
    logo: alETHIcon,
    id: 21,
    apy: 0,
    name: 'alETH',
    nameShow: 'Curve alETH pool',
    stakeTokenSymbol: 'alETHCrv',
    tvlPriceTokenId: 'curveLP-alETH',
    stakeTokenContractAddress: config.convexVaultPool.alETH,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'CTR',
    rewardTokenDecimals: 18,
    isShowEthApy: false,
    site: 'convex',
    zapTokens: [
      {
        symbol: 'alETHCrv',
        icon: alETHIcon,
        address: config.convexVaultPool.alETH,
        needZap: false,
        isLp: true,
      },
      {
        ...config.zapTokens.ETH,
        "routes": ["0x4103c4c319e2d4d66cca4464c0c2b32c9bd23ebe784e"]
      },
      {
        ...config.zapTokens.WETH,
        "routes": ["0x4103c4c319e2d4d66cca4464c0c2b32c9bd23ebe784e"]
      },
      {
        ...config.zapTokens.ALETH,
        "routes": ["0x5503c4c319e2d4d66cca4464c0c2b32c9bd23ebe784e"]
      },
      {
        ...config.zapTokens.USDC,
        "routes": ["0x110188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x4103c4c319e2d4d66cca4464c0c2b32c9bd23ebe784e"]
      }
    ],
  },
  {
    logo: pool3eurIcon,
    id: 22,
    apy: 0,
    name: '3eur-pool',
    nameShow: 'Curve 3eur-pool pool',
    stakeTokenSymbol: '3eur-poolCrv',
    tvlPriceTokenId: 'curveLP-3eur-pool',
    stakeTokenContractAddress: config.convexVaultPool['3eur-pool'],
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'CTR',
    rewardTokenDecimals: 18,
    isShowEthApy: false,
    site: 'convex',
    zapTokens: [
      {
        symbol: '3eur-pool',
        icon: pool3eurIcon,
        address: config.convexVaultPool['3eur-pool'],
        needZap: false,
        isLp: true,
      },
      {
        ...config.zapTokens.AGEUR,
        "routes": ["0x420eb9446c4ef5ebe66268da6700d26f96273de3d571"]

      },
      {
        ...config.zapTokens.EURT,
        "routes": ["0x560eb9446c4ef5ebe66268da6700d26f96273de3d571"]
      },
      {
        ...config.zapTokens.EURS,
        "routes": ["0x6a0eb9446c4ef5ebe66268da6700d26f96273de3d571"]
      },
      {
        ...config.zapTokens.USDC,
        "routes": ["0x0501735a26a57a0a0069dfabd41595a970faf5e1ee8b", "0x420eb9446c4ef5ebe66268da6700d26f96273de3d571"]
      },
      {
        ...config.zapTokens.WETH,
        "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x0501735a26a57a0a0069dfabd41595a970faf5e1ee8b", "0x420eb9446c4ef5ebe66268da6700d26f96273de3d571"]
      },
      {
        ...config.zapTokens.ETH,
        "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x0501735a26a57a0a0069dfabd41595a970faf5e1ee8b", "0x420eb9446c4ef5ebe66268da6700d26f96273de3d571"]
      }
    ],
  },
  {
    logo: `${cryptoIcons}#lusd`,
    id: 23,
    apy: 0,
    name: 'lusd',
    nameShow: 'Curve lusd pool',
    stakeTokenSymbol: 'lusdCrv',
    tvlPriceTokenId: 'curveLP-lusd',
    stakeTokenContractAddress: config.convexVaultPool.lusd,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'CTR',
    rewardTokenDecimals: 18,
    isShowEthApy: false,
    site: 'convex',
    isExpired: true,
    zapTokens: [
      {
        symbol: 'lusd',
        icon: `${cryptoIcons}#lusd`,
        address: config.convexVaultPool.lusd,
        needZap: false,
        isLp: true,
      },
      {
        ...config.zapTokens.ETH,
        "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x6b10ed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
      },
      {
        ...config.zapTokens.WETH,
        "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x6b10ed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
      },
      {
        ...config.zapTokens.USDC,
        "routes": ["0x6b10ed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
      },
      {
        ...config.zapTokens.DAI,
        "routes": ["0x6b10ed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
      },
      {
        ...config.zapTokens.USDT,
        "routes": ["0x5710ed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
      },
      {
        ...config.zapTokens.CRV3POOL,
        "routes": ["0x550fed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
      },
      {
        ...config.zapTokens.LUSD,
        "routes": ["0x410fed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
      }
    ],
  },
  {
    logo: tusdIcons,
    id: 25,
    apy: 0,
    name: 'tusd',
    nameShow: 'Curve tusd pool',
    stakeTokenSymbol: 'tusdCrv',
    tvlPriceTokenId: 'curveLP-tusd',
    stakeTokenContractAddress: config.convexVaultPool.tusd,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'CTR',
    rewardTokenDecimals: 18,
    isShowEthApy: false,
    site: 'convex',
    zapTokens: [
      {
        symbol: 'tusdCrv',
        icon: tusdIcons,
        address: config.convexVaultPool.tusd,
        needZap: false,
        isLp: true,
      },
      {
        ...config.zapTokens.ETH,
        "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x6b10ecd5e75afb02efa118af914515d6521aabd189f1"]
      },
      {
        ...config.zapTokens.WETH,
        "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x6b10ecd5e75afb02efa118af914515d6521aabd189f1"]
      },
      {
        ...config.zapTokens.USDC,
        "routes": ["0x6b10ecd5e75afb02efa118af914515d6521aabd189f1"]
      },
      {
        ...config.zapTokens.DAI,
        "routes": ["0x5710ecd5e75afb02efa118af914515d6521aabd189f1"]
      },
      {
        ...config.zapTokens.USDT,
        "routes": ["0x7f10ecd5e75afb02efa118af914515d6521aabd189f1"]
      },
      {
        ...config.zapTokens.CRV3POOL,
        "routes": ["0x550fecd5e75afb02efa118af914515d6521aabd189f1"]
      },
      {
        ...config.zapTokens.TUSD,
        "routes": ["0x410fecd5e75afb02efa118af914515d6521aabd189f1"]
      }
    ],
  },
  /////////ignore////
  // {
  //   logo: `${cryptoIcons}#musd`,
  //   id: 26,
  //   apy: 0,
  //   name: 'musd',
  //   nameShow: 'Curve musd pool',
  //   stakeTokenSymbol: 'musdCrv',
  //   tvlPriceTokenId: 'curveLP-musdCrv',
  //   stakeTokenContractAddress: config.convexVaultPool.musd,
  //   stakeTokenDecimals: 18,
  //   rewardTokenSymbol: 'CTR',
  //   rewardTokenDecimals: 18,
  //   isShowEthApy: false,
  //   site: 'convex',
  //   zapTokens: [
  //     {
  //       symbol: 'musd',
  //       icon: `${cryptoIcons}#musd`,
  //       address: config.convexVaultPool.musd,
  //       needZap: false,
  //       isLp: true,
  //     },
  //     config.zapTokens.ETH,
  //     config.zapTokens.WETH,
  //     config.zapTokens.USDC,
  //     config.zapTokens.DAI,
  //     config.zapTokens.USDT,
  //     config.zapTokens.CRV3POOL,
  //     config.zapTokens.MUSD
  //   ],
  // },
  // {
  //   logo: siloIcons,
  //   id: 24,
  //   apy: 0,
  //   name: 'silofrax',
  //   nameShow: 'Curve silofrax pool',
  //   stakeTokenSymbol: 'silofraxCrv',
  //   tvlPriceTokenId: 'curveLP-silofrax',
  //   stakeTokenContractAddress: config.convexVaultPool.silofrax,
  //   stakeTokenDecimals: 18,
  //   rewardTokenSymbol: 'CTR',
  //   rewardTokenDecimals: 18,
  //   isShowEthApy: false,
  //   site: 'convex',
  //   zapTokens: [
  //     {
  //       symbol: 'silofrax',
  //       icon: siloIcons,
  //       address: config.convexVaultPool.silofrax,
  //       needZap: false,
  //       isLp: true,
  //     },
  //     {
  //       ...config.zapTokens.USDC,
  //       "routes": ["0x0501c63b0708e2f7e69cb8a1df0e1389a98c35a76d52", "0x55049a22cdb1ca1cdd2371cd5bb5199564c4e89465eb"]
  //     },
  //     {
  //       ...config.zapTokens.FRAX,
  //       "routes": ["0x55049a22cdb1ca1cdd2371cd5bb5199564c4e89465eb"]
  //     },
  //     {
  //       ...config.zapTokens.SILO,
  //       "routes": ["0x41049a22cdb1ca1cdd2371cd5bb5199564c4e89465eb"]
  //     }
  //   ],
  // },

  // {
  //   logo: fraxBPIcons,
  //   id: 24,
  //   apy: 0,
  //   name: 'susdfraxbp',
  //   nameShow: 'Curve susdfraxbp pool',
  //   stakeTokenSymbol: 'susdfraxbpCrv',
  //   tvlPriceTokenId: 'curveLP-susdfraxbp',
  //   stakeTokenContractAddress: config.convexVaultPool.susdfraxbp,
  //   stakeTokenDecimals: 18,
  //   rewardTokenSymbol: 'CTR',
  //   rewardTokenDecimals: 18,
  //   isShowEthApy: false,
  //   site: 'convex',
  //   zapTokens: [
  //     {
  //       symbol: 'susdfraxbp',
  //       icon: fraxBPIcons,
  //       address: config.convexVaultPool.susdfraxbp,
  //       needZap: false,
  //       isLp: true,
  //     },
  //     {
  //       ...config.zapTokens.ETH,
  //       "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x6b10ed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
  //     },
  //     {
  //       ...config.zapTokens.WETH,
  //       "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x6b10ed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
  //     },
  //     {
  //       ...config.zapTokens.USDC,
  //       "routes": ["0x6b10ed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
  //     },
  //     {
  //       ...config.zapTokens.FRAX,
  //       "routes": ["0x6b10ed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
  //     },
  //     {
  //       ...config.zapTokens.crvFRAX,
  //       "routes": ["0x6b10ed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
  //     },
  //     {
  //       ...config.zapTokens.SUSD,
  //       "routes": ["0x6b10ed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
  //     },

  //   ],
  // },

  // {
  //   logo: fraxBPIcons,
  //   id: 24,
  //   apy: 0,
  //   name: 'busdfraxbp',
  //   nameShow: 'Curve busdfraxbp pool',
  //   stakeTokenSymbol: 'busdfraxbpCrv',
  //   tvlPriceTokenId: 'curveLP-busdfraxbp',
  //   stakeTokenContractAddress: config.convexVaultPool.busdfraxbp,
  //   stakeTokenDecimals: 18,
  //   rewardTokenSymbol: 'CTR',
  //   rewardTokenDecimals: 18,
  //   isShowEthApy: false,
  //   site: 'convex',
  //   zapTokens: [
  //     {
  //       symbol: 'busdfraxbp',
  //       icon: fraxBPIcons,
  //       address: config.convexVaultPool.busdfraxbp,
  //       needZap: false,
  //       isLp: true,
  //     },
  // {
  //   ...config.zapTokens.ETH,
  //   "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x6b10ed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
  // },
  // {
  //   ...config.zapTokens.WETH,
  //   "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x6b10ed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
  // },
  // {
  //   ...config.zapTokens.USDC,
  //   "routes": ["0x6b10ed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
  // },
  // {
  //   ...config.zapTokens.FRAX,
  //   "routes": ["0x6b10ed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
  // },
  // {
  //   ...config.zapTokens.crvFRAX,
  //   "routes": ["0x5710ed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
  // },
  // {
  //   ...config.zapTokens.BUSD,
  //   "routes": ["0x410fed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
  // }
  // ],
  // },
  // {
  //   logo: fraxBPIcons,
  //   id: 24,
  //   apy: 0,
  //   name: 'alusdfraxbp',
  //   nameShow: 'Curve alusdfraxbp pool',
  //   stakeTokenSymbol: 'alusdfraxbpCrv',
  //   tvlPriceTokenId: 'curveLP-alusdfraxbp',
  //   stakeTokenContractAddress: config.convexVaultPool.alusdfraxbp,
  //   stakeTokenDecimals: 18,
  //   rewardTokenSymbol: 'CTR',
  //   rewardTokenDecimals: 18,
  //   isShowEthApy: false,
  //   site: 'convex',
  //   zapTokens: [
  //     {
  //       symbol: 'alusdfraxbp',
  //       icon: fraxBPIcons,
  //       address: config.convexVaultPool.alusdfraxbp,
  //       needZap: false,
  //       isLp: true,
  //     },
  //     {
  //       ...config.zapTokens.ETH,
  //       "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x6b10ed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
  //     },
  //     {
  //       ...config.zapTokens.WETH,
  //       "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x6b10ed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
  //     },
  //     {
  //       ...config.zapTokens.USDC,
  //       "routes": ["0x6b10ed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
  //     },
  //     {
  //       ...config.zapTokens.FRAX,
  //       "routes": ["0x6b10ed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
  //     },
  //     {
  //       ...config.zapTokens.crvFRAX,
  //       "routes": ["0x5710ed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
  //     },
  //     {
  //       ...config.zapTokens.ALUSD,
  //       "routes": ["0x550fed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
  //     },
  //   ],
  // },
  {
    logo: [tusdIcons, `${cryptoIcons}#frax`],
    id: 29,
    apy: 0,
    name: 'tusdfraxbp',
    nameShow: 'Curve tusdfraxbp pool',
    stakeTokenSymbol: 'tusdfraxbpCrv',
    tvlPriceTokenId: 'curveLP-tusdfraxbp',
    stakeTokenContractAddress: config.convexVaultPool.tusdfraxbp,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'CTR',
    rewardTokenDecimals: 18,
    isShowEthApy: false,
    site: 'convex',
    zapTokens: [
      {
        symbol: 'tusdfraxbpCrv',
        icon: tusdIcons,
        address: config.convexVaultPool.tusdfraxbp,
        needZap: false,
        isLp: true,
      },
      // {
      //   ...config.zapTokens.ETH,
      //   "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x6b10ed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
      // },
      // {
      //   ...config.zapTokens.WETH,
      //   "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x6b10ed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
      // },
      // {
      //   ...config.zapTokens.USDC,
      //   "routes": ["0x6b10ed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
      // },
      // {
      //   ...config.zapTokens.FRAX,
      //   "routes": ["0x6b10ed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
      // },
      // {
      //   ...config.zapTokens.crvFRAX,
      //   "routes": ["0x5710ed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
      // },
      // {
      //   ...config.zapTokens.TUSD,
      //   "routes": ["0x410fed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
      // }
    ],
  }
]


// export const VAULT_LIST_IFO = [
//   {
//     logo: ironbankIcons,
//     id: 8,
//     apy: 0,
//     name: 'ironbank',
//     nameShow: 'Curve ironbank pool',
//     stakeTokenSymbol: 'ironbankCrv',
//     tvlPriceTokenId: 'curveLP-ironbank',
//     stakeTokenContractAddress: config.convexVaultPool.ironbank,
//     stakeTokenDecimals: 18,
//     rewardTokenSymbol: 'CTR',
//     rewardTokenDecimals: 18,
//     isShowEthApy: false,
//     site: 'convex',
//     zapTokens: [
//       {
//         symbol: 'ironbankCrv',
//         icon: ironbankIcons,
//         address: config.convexVaultPool.ironbank,
//         needZap: false,
//         isLp: true,
//       },
//       {
//         ...config.zapTokens.ETH,
//         "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x46092dded6da1bf5dbdf597c45fcfaa3194e53ecfeaf"]
//       },
//       {
//         ...config.zapTokens.WETH,
//         "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x46092dded6da1bf5dbdf597c45fcfaa3194e53ecfeaf"]
//       },
//       {
//         ...config.zapTokens.USDC,
//         "routes": ["0x56092dded6da1bf5dbdf597c45fcfaa3194e53ecfeaf"]
//       },
//       {
//         ...config.zapTokens.DAI,
//         "routes": ["0x42092dded6da1bf5dbdf597c45fcfaa3194e53ecfeaf"]
//       },
//       {
//         ...config.zapTokens.USDT,
//         "routes": ["0x6a092dded6da1bf5dbdf597c45fcfaa3194e53ecfeaf"]
//       },
//     ],
//   },
//   {
//     logo: `${cryptoIcons}#lusd`,
//     id: 23,
//     apy: 0,
//     name: 'lusd',
//     nameShow: 'Curve lusd pool',
//     stakeTokenSymbol: 'lusdCrv',
//     tvlPriceTokenId: 'curveLP-lusd',
//     stakeTokenContractAddress: config.convexVaultPool.lusd,
//     stakeTokenDecimals: 18,
//     rewardTokenSymbol: 'CTR',
//     rewardTokenDecimals: 18,
//     isShowEthApy: false,
//     site: 'convex',
//     zapTokens: [
//       {
//         symbol: 'lusd',
//         icon: `${cryptoIcons}#lusd`,
//         address: config.convexVaultPool.lusd,
//         needZap: false,
//         isLp: true,
//       },
//       {
//         ...config.zapTokens.ETH,
//         "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x6b10ed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
//       },
//       {
//         ...config.zapTokens.WETH,
//         "routes": ["0x050188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x6b10ed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
//       },
//       {
//         ...config.zapTokens.USDC,
//         "routes": ["0x6b10ed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
//       },
//       {
//         ...config.zapTokens.DAI,
//         "routes": ["0x5710ed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
//       },
//       {
//         ...config.zapTokens.USDT,
//         "routes": ["0x7f10ed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
//       },
//       {
//         ...config.zapTokens.CRV3POOL,
//         "routes": ["0x550fed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
//       },
//       {
//         ...config.zapTokens.LUSD,
//         "routes": ["0x410fed279fdd11ca84beef15af5d39bb4d4bee23f0ca"]
//       }
//     ],
//   },
// ]

export const LIQUIDITY_LIST_IFO = [
  {
    logo: ctrLpIcons,
    id: 0,
    name: 'Balancer CTR/aCrv LP',
    nameShow: 'Balancer CTR/aCrv LP',
    tip: 'Liquidity Incentives for this pool only paid during IFO',
    apy: 0,
    tvl: 0,
    stakeTokenSymbol: 'CTR/aCRV',
    tvlPriceTokenId: 'curveLP-steth',
    stakeTokenContractAddress: config.tokens.CTRACRV,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'CTR',
    rewardTokenDecimals: 18,
    zapTokens: [
      {
        symbol: 'CTR/aCRV',
        icon: ctrLpIcons,
        address: config.tokens.CTRACRV,
        needZap: false,
        isLp: true,
        hideCrv: true,
      },
      {
        symbol: 'aCrv',
        icon: 'crv',
        address: config.contracts.convexVaultAcrv,
        needZap: false,
        isLp: true,
        routes: []
      },
      {
        symbol: 'CRV',
        icon: 'crv',
        address: config.tokens.crv,
        needZap: true,
        routes: []
      },
      {
        symbol: 'cvxCrv',
        icon: 'crv',
        address: config.tokens.cvxcrv,
        needZap: true,
        routes: []
      },
      {
        symbol: 'ETH',
        icon: 'eth',
        address: config.tokens.eth,
        needZap: true,
        routes: ["0x11048301ae4fc9c624d1d396cbdaa1ed877821d7c511"]
      },
      {
        symbol: 'WETH',
        icon: 'weth',
        address: config.tokens.weth,
        needZap: true,
        routes: ["0x11048301ae4fc9c624d1d396cbdaa1ed877821d7c511"]
      },
      {
        symbol: 'USDC',
        icon: 'usdc',
        decimals: 6,
        address: config.tokens.usdc,
        needZap: true,
        routes: ["0x110188e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "0x11048301ae4fc9c624d1d396cbdaa1ed877821d7c511"]
      },

    ],
  },
]

export const AllVaults = [...VAULT_LIST, ...VAULT_LIST_IFO.map(i => { i.isIfo = true; return i })]

export default VAULT_LIST
