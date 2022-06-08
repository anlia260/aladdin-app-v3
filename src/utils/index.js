/* eslint-disable no-unreachable */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */
import axios from 'axios'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import config from 'config'
import converWebsiteInfo from 'config/convex-website-info.json'
import { message } from 'antd'
import { initWeb3 } from '../utils/contract'
import cachedLpPrice from '../config/cachedLpPrice'
import vaults from '../config/convexVault'
import abi from '../config/abi'

export const cBN = val => new BigNumber(val)

export const AddressZero = '0x0000000000000000000000000000000000000000'

// 舍去 同时 返回 10 进制字符串
export function numberToString(number, floor = 4) {
  if (!number) return 0
  const u = 10 ** floor
  const num = new BigNumber(number).multipliedBy(u).toString(10)
  const l = new BigNumber(num.split('.')[0]).dividedBy(u).toString(10)
  return isNaN(l * 1) ? 0 : l
}

// outside call times = 3
export const getUniswapLPPrice = async (web3, lpAddress, underlyingAssets) => {
  if (!web3) {
    console.error('[getUniswapLPPrice] missing web3', web3)
    return 0
  }
  if (!lpAddress) {
    console.error('[getUniswapLPPrice] missing lpAddress', lpAddress)
    return 0
  }
  if (config.enableCachedLpPrice && cachedLpPrice[lpAddress]) {
    console.log('[getUniswapLPPrice]', lpAddress, ' use cached lp price', cachedLpPrice[lpAddress])
    return cachedLpPrice[lpAddress]
  }

  let lpPrice = 0
  try {
    const lpTokenContract = new web3.eth.Contract(abi.erc20ABI, lpAddress)
    const lpTotalSupplyInWei = await lpTokenContract.methods.totalSupply().call()
    if (cBN(lpTotalSupplyInWei).isLessThanOrEqualTo(0)) return 0
    const poolValueInUSD = (
      await Promise.all(
        // underlyingAssets 0:
        underlyingAssets.map(async asset => {
          const tokenPrice = (await getTokenPrice(asset[0])) || 0
          const tokenDecimal = asset[2]
          let tokenAmountInWei = 0
          if (asset[1] === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE') {
            tokenAmountInWei = await web3.eth.getBalance(lpAddress)
          } else {
            const underlyingAssetContract = new web3.eth.Contract(abi.erc20ABI, asset[1])
            tokenAmountInWei = await underlyingAssetContract.methods.balanceOf(lpAddress).call()
            console.log('[getUniswapLPPrice] get token price', asset, tokenAmountInWei)
          }
          const tokenAmount = cBN(tokenAmountInWei).div(cBN(10).pow(tokenDecimal))
          console.log('[getUniswapLPPrice] token amount', asset, tokenAmount.toString(), 'token price', tokenPrice)
          const assetValueInPool = cBN(tokenPrice)
            .multipliedBy(tokenAmount)
            .toString()
          console.log('[getUniswapLPPrice]', lpAddress, 'assetValueInPool', asset, assetValueInPool)
          return assetValueInPool
        }),
      )
    ).reduce((a, b) => {
      return cBN(a).plus(b)
    })
    lpPrice = cBN(poolValueInUSD)
      .div(cBN(lpTotalSupplyInWei).div(cBN(10).pow(18)))
      .toFixed(4)
    console.log('[getUniswapLPPrice]', lpAddress, 'lpPrice', lpPrice.toString())
  } catch (e) {
    console.error('[getUniswapLPPrice]', lpAddress, e.toString())
  }
  return lpPrice
}

// outside call times = 3/4
let cacheTime = 0;
let cacheTimeStep = 1000 * 60 * 5;
export const getCurveLPPrice2 = async (web3, lpAddress, swapPoolABI, swapPoolContractAddress, underlyingAssets) => {
  // console.log('[getCurveLPPrice2] params', lpAddress, swapPoolABI, swapPoolContractAddress, underlyingAssets)
  if (!web3) {
    console.error('[getCurveLPPrice2] missing web3', web3)
    return 0
  }
  if (!lpAddress) {
    console.error('[getCurveLPPrice2] missing lpAddress', lpAddress)
    return 0
  }
  const _currTime = +new Date()
  // console.log('cachedLpPrice[lpAddress]--',cachedLpPrice[lpAddress])
  if (cachedLpPrice[lpAddress] && _currTime < (cacheTime + cacheTimeStep)) {
    // console.log('[getCurveLPPrice2]', lpAddress, ' use cached lp price', cachedLpPrice[lpAddress])
    return cachedLpPrice[lpAddress]
  }
  if (!swapPoolABI) {
    console.error('missing swap pool abi', lpAddress)
    return 0
  }

  let lpPrice = 0
  try {
    const lpTokenContract = new web3.eth.Contract(abi.erc20ABI, lpAddress)
    const curvePoolContract = new web3.eth.Contract(swapPoolABI, swapPoolContractAddress)

    // console.log('[curve lp price]', lpAddress, 'underlyingAssetsContract', underlyingAssetsContract)
    const lpTotalSupply = await lpTokenContract.methods.totalSupply().call()
    if (cBN(lpTotalSupply).isLessThanOrEqualTo(0)) return 0
    // console.log('[curve lp price]', lpAddress, 'lpTotalSupply', lpTotalSupply.toString())

    // Get Curve Vault Total Value
    let totalAssetValueInUSD = cBN(0)
    for (let i = 0; i < underlyingAssets.length; i += 1) {
      // console.log('[curve lp price]', lpAddress, 'getting underlyng asset price', 'underlyingAsset index', i)
      const assetBalanceInWei = await curvePoolContract.methods.balances(i).call()
      let tokenPrice = 1
      const [tokenId, tokenAddress, tokenDecimal] = underlyingAssets[i]
      // for stablecoins, can use 1 directly to reduce the outside call
      if (['dai', 'tether', 'usd-coin'].indexOf(tokenId) < 0) {
        tokenPrice = await getTokenPrice(tokenId)
        // console.log('[curve lp price]', lpAddress, 'underlyingAsset', i, 'tokenId', tokenId, 'tokenPrice', tokenPrice, 'assetBalanceInWei', assetBalanceInWei)
        totalAssetValueInUSD = totalAssetValueInUSD.plus(
          cBN(tokenPrice).multipliedBy(cBN(assetBalanceInWei).div(cBN(10).pow(tokenDecimal))),
        )
      } else {
        totalAssetValueInUSD = totalAssetValueInUSD.plus(cBN(assetBalanceInWei).div(cBN(10).pow(tokenDecimal)))
      }
    }

    const lpDecimal = 18
    lpPrice = cBN(totalAssetValueInUSD).div(cBN(lpTotalSupply).div(cBN(10).pow(lpDecimal))) // lp basiccly is 18 decimal
    // console.log(
    //   '[getCurveLPPrice2]',
    //   lpAddress,
    //   'totalAssetValueInUSD',
    //   totalAssetValueInUSD.toString(),
    //   'lp total supply',
    //   lpTotalSupply.toString(),
    //   'lpPrice',
    //   lpPrice.toString(),
    // )
    cacheTime = _currTime
    cachedLpPrice[lpAddress] = lpPrice;
  } catch (e) {
    console.error('[getCurveLPPrice2]', lpAddress, e.toString())
  }
  return lpPrice
}

const curveLpInfo = {
  [config.convexVaultPool.cvxcrv]: {
    address: config.convexVaultPool.cvxcrv,
    swapPoolABI: abi.curveCvxcrvPoolSwapABI,
    swapPoolAddress: config.contracts.curveCvxcrvPoolSwap,
    underlyingAssets: [
      ['curve-dao-token', config.tokens.crv, 18],
      ['convex-crv', config.tokens.cvxcrv, 18],
    ],
  },
  [config.convexVaultPool.cvxfxs]: {
    address: config.convexVaultPool.cvxfxs,
    swapPoolABI: abi.curveCvxfxsPoolSwapABI,
    swapPoolAddress: config.contracts.curveCvxfxsPoolSwap,
    underlyingAssets: [
      ['frax-share', config.tokens.fxs, 18],
      ['frax-share', config.tokens.fxs, 18],
    ],
  },
  [config.convexVaultPool.steth]: {
    address: config.convexVaultPool.steth,
    swapPoolABI: abi.curveStethPoolSwapABI,
    swapPoolAddress: config.contracts.curveStethPoolSwap,
    underlyingAssets: [
      ['ethereum', config.tokens.eth, 18],
      ['staked-ether', config.tokens.steth, 18],
    ],
  },

  [config.convexVaultPool.frax]: {
    address: config.convexVaultPool.frax,
    swapPoolABI: abi.curveFraxPoolSwapABI,
    swapPoolAddress: config.contracts.curveFraxPoolSwap,
    underlyingAssets: [
      ['frax', config.tokens.frax, 18],
      ['lp-3pool-curve', config.tokens.crv3pool, 18],
    ],
  },

  [config.convexVaultPool.tricrypto2]: {
    address: config.convexVaultPool.tricrypto2,
    swapPoolABI: abi.curveTricrypto2PoolSwapABI,
    swapPoolAddress: config.contracts.curveTricrypto2PoolSwap,
    underlyingAssets: [
      ['usd-coin', config.tokens.usdt, 6],
      ['bitcoin', config.tokens.wbtc, 8],
      ['ethereum', config.tokens.eth, 18],
    ],
  },

  [config.convexVaultPool.crveth]: {
    address: config.convexVaultPool.crveth,
    swapPoolABI: abi.curveCrvethPoolSwapABI,
    swapPoolAddress: config.contracts.curveCrvethPoolSwap,
    underlyingAssets: [
      ['ethereum', config.tokens.eth, 18],
      ['curve-dao-token', config.tokens.crv, 18],
    ],
  },

  [config.convexVaultPool.cvxeth]: {
    address: config.convexVaultPool.cvxeth,
    swapPoolABI: abi.curveCvxethPoolSwapABI,
    swapPoolAddress: config.contracts.curveCvxethPoolSwap,
    underlyingAssets: [
      ['ethereum', config.tokens.eth, 18],
      ['convex-finance', config.tokens.cvx, 18],
    ],
  },

  [config.convexVaultPool.crv3pool]: {
    address: config.convexVaultPool.crv3pool,
    swapPoolABI: abi.curve3PoolSwapABI,
    swapPoolAddress: config.contracts.curve3PoolSwap,
    underlyingAssets: [
      ['dai', config.tokens.dai, 18],
      ['usd-coin', config.tokens.usdc, 6],
      ['tether', config.tokens.usdt, 6],
    ],
  },

  [config.convexVaultPool['ust-wormhole']]: {
    address: config.convexVaultPool['ust-wormhole'],
    swapPoolABI: abi.curveUstWormholeSwapABI,
    swapPoolAddress: config.contracts.curveUstWormholeSwap,
    underlyingAssets: [
      ['terrausd-wormhole', config.tokens['UST(Wormhole)'], 6],
      ['lp-3pool-curve', config.tokens.crv3pool, 18],
    ],
  },

  [config.convexVaultPool.rocketpooleth]: {
    address: config.convexVaultPool.rocketpooleth,
    swapPoolABI: abi.curveRocketPoolEthSwapABI,
    swapPoolAddress: config.contracts.curveRocketPoolEthSwap,
    underlyingAssets: [
      ['rocket-pool-eth', config.tokens.rETH, 18],
      ['wrapped-steth', config.tokens.wstETH, 18],
    ],
  },

  [config.convexVaultPool.ren]: {
    address: config.convexVaultPool.ren,
    swapPoolABI: abi.curveRenABI,
    swapPoolAddress: config.contracts.curveRenSwap,
    underlyingAssets: [
      ['renbtc', config.tokens.renBTC, 8],
      ['wrapped-bitcoin', config.tokens.wbtc, 8],
    ],
  },

  [config.convexVaultPool.pusd]: {
    address: config.convexVaultPool.pusd,
    swapPoolABI: abi.curvePusdPoolSwapABI,
    swapPoolAddress: config.contracts.curvePusdPoolSwap,
    underlyingAssets: [
      ['pusd', config.tokens.PUSd, 18],
      ['lp-3pool-curve', config.tokens.crv3pool, 18],
    ],
  },
}

export const getCurveLPPriceByTokenId = async (tvlPriceTokenId, web3) => {
  if (!web3) {
    console.error('[getCurveLPPriceByTokenId] missing web3', web3)
  }
  // console.log('[getCurveLPPriceByTokenId] starts', tvlPriceTokenId)
  const vault = await vaults.find(item => {
    return item.tvlPriceTokenId === tvlPriceTokenId
  })
  const lpName = tvlPriceTokenId.slice(8)
  const lpAddress = config.convexVaultPool[lpName]

  if (!lpAddress) {
    console.error('[getCurveLPPriceByTokenId] can not find id', tvlPriceTokenId, lpAddress)
    return 0
  }
  const info = curveLpInfo[lpAddress]
  // console.log('[getCurveLPPriceByTokenId] lp info', lpAddress, info)
  if (!info) {
    console.error('[getCurveLPPriceByTokenId] missing curve lp info', tvlPriceTokenId, lpAddress, info)
    return 0
  }

  const lpPrice = await getCurveLPPrice2(web3, lpAddress, info.swapPoolABI, info.swapPoolAddress, info.underlyingAssets)
  // console.log('[getCurveLPPriceByTokenId] vault vault_id', vault.vault_id, 'lp price: ', lpPrice.toString())
  return lpPrice
}

export async function getALDPrice() {
  let aldPrice = 0
  try {
    aldPrice = await getTokenPrice('aladdin-dao')
  } catch (e) {
    console.error('failed to get ald price', e.toString())
  }
  return aldPrice
}

let _time = 0
let EthPrice = 0
export async function getETHPrice() {
  let ethPrice = 0
  const _ct = Math.ceil(+new Date()) / 1000
  if (_ct - _time < 60 * 5) {
    return EthPrice
  }
  _time = _ct
  try {
    const res = await axios.get(`https://api.curve.fi/api/getETHprice`)
    // console.log('eth-price', res)
    ethPrice = res.data.data.price
  } catch (e) {
    console.error('failed to get eth price', e.toString())
  }
  EthPrice = ethPrice
  return ethPrice
}

// vaultlpPrice
export async function getVaultTokenPrice(toeknInfo, tokenPriceLp) {
  const web3 = initWeb3()
  const zeroAddress = '0x0000000000000000000000000000000000000000'
  const uniFactoryAddress = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'
  const { address: token0 } = toeknInfo
  try {
    let _usdtAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' //eth地址

    const contractFactory = new web3.eth.Contract(abi.UNI_V2_FACTORY, uniFactoryAddress)
    const contractToken0 = new web3.eth.Contract(abi.UNI_V2_PAIR, token0)
    const contractUsdt = new web3.eth.Contract(abi.UNI_V2_PAIR, _usdtAddress)
    let lpPairTokenAddress = 1 //zeroAddress;
    if (tokenPriceLp) {
      lpPairTokenAddress = tokenPriceLp
    } else {
      ;[lpPairTokenAddress] = await Promise.all([contractFactory.methods.getPair(token0, _usdtAddress).call()])
    }
    if (lpPairTokenAddress != zeroAddress) {
      const contractLpPair = new web3.eth.Contract(abi.UNI_V2_PAIR, lpPairTokenAddress)
      const [tokenPairObj, lpToken0Address] = await Promise.all([
        contractLpPair.methods.getReserves().call(),
        contractLpPair.methods.token0().call(),
      ])
      let token0Num = tokenPairObj.reserve0
      let tokenUsdtNum = tokenPairObj.reserve1
      if (lpToken0Address.toUpperCase() == _usdtAddress.toUpperCase()) {
        tokenUsdtNum = tokenPairObj.reserve0
        token0Num = tokenPairObj.reserve1
      }
      const [token0Decimals, usdtDecimals] = await Promise.all([
        contractToken0.methods.decimals().call(),
        contractUsdt.methods.decimals().call(),
      ])
      let _token0U = new BigNumber(tokenUsdtNum)
        .multipliedBy(10 ** token0Decimals)
        .div(new BigNumber(token0Num))
        .div(10 ** usdtDecimals)
        .toString(10)
      return _token0U
    }
  } catch (e) {
    console.log(e)
  }
}

const getCachedPrice = id => {
  try {
    if (id.indexOf(',') < 0) {
      const cachedData = JSON.parse(localStorage.getItem(id))
      const cacheTime = 1000 * 60 * 5
      if (new Date().getTime() - cachedData.lastUpdate <= cacheTime) {
        // console.log("cached----price---", cachedData.lastPrice)
        return cachedData.lastPrice
      }
    }
  } catch (e) {
    console.error('error to get cahced price', e.toString())
  }
  return null
}

// Get from coingecko
export async function getTokenPrice(id) {
  if (id === 'ald') {
    return getALDPrice()
  }
  const cachedPrice = getCachedPrice(id)
  if (cachedPrice) {
    // console.log('[getTokenPrice] use cahced data', id, cachedPrice)
    return cachedPrice
  }
  return new Promise(async resolve => {
    const res = await axios.get(`${config.coingeckoURL}/simple/price`, {
      params: {
        ids: id,
        vs_currencies: 'usd',
      },
      timeout: 2000,
    })
    // console.log('[getTokenPrice] get and set price', id, res, res?.data[id]?.usd)
    if (id.includes(',')) {
      const tokens = id.split(',')
      tokens.map(token => {
        localStorage.setItem(
          token,
          JSON.stringify({
            lastPrice: res?.data[token]?.usd,
            lastUpdate: new Date().getTime(),
          }),
        )
      })
      resolve(res?.data)
    } else {
      localStorage.setItem(
        id,
        JSON.stringify({
          lastPrice: res?.data[id]?.usd,
          lastUpdate: new Date().getTime(),
        }),
      )
      resolve(res?.data[id]?.usd)
    }
  })
}

/**
 * Get LP Token Price by token id (set in vault config)
 * tokenId: {protocol}-{lpTokenName}
 * @param {*} web3
 * @param {*} tokenId
 * @returns
 */
export async function getLPTokenPrice(web3, tokenId) {
  let price = 0
  if (!tokenId) {
    return 0
  }

  if (tokenId === 'ald') {
    price = await getALDPrice()
  } else if (tokenId.startsWith('ald')) {
    // price = await getAladdinLPPrice(tokenId, web3)
  } else if (tokenId.startsWith('curveLP-')) {
    price = await getCurveLPPriceByTokenId(tokenId, web3)
  } else if (tokenId.startsWith('slp-')) {
    // price = await getUniswapLPPriceByVault(tokenId, web3)
  } else {
    price = await getTokenPrice(tokenId)
  }
  // console.log('[getLPTokenPrice]', tokenId, price.toString())
  return price
}

export function formatBalance(balanceInWei, decimals = 18, toFixed = -1) {
  if (cBN(balanceInWei).isNaN()) return '0'

  const formatResult = result => {
    if (cBN(result).isZero() || Number.isNaN(result) || result === 'NaN') {
      return '0'
    }

    const trimZero = result.split('.').length > 1 ? result.replace(/0+?$/gi, '').replace(/[.]$/gi, '') : result

    if (cBN(result).isLessThan(1)) {
      return `${trimZero}`
    }

    return trimZero
  }

  if (toFixed === -1) {
    const result = cBN(balanceInWei)
      .div(cBN(10).pow(decimals))
      .toFormat()

    return formatResult(result)
  }

  const result = cBN(balanceInWei)
    .div(cBN(10).pow(decimals))
    .toFormat(toFixed)

  return formatResult(result)
}

export const fb4 = (balance, isMoney = false, decimals) => {
  if (cBN(balance).isZero()) {
    return isMoney ? '$0' : '-'
  }
  if (cBN(balance).isNaN()) {
    return isMoney ? '$0' : '-'
  }

  return `${isMoney ? '$' : ''}${formatBalance(balance, decimals ?? 18, isMoney ? 2 : 4)}`
}

export function formatAddress(address, n) {
  return `${address.slice(0, n + 2)}...${address.slice(-n)}`
}

export function formatDuration(duration) {
  if (cBN(duration).isLessThanOrEqualTo(0)) {
    return '--'
  }
  const d = moment.duration(duration, 'seconds')
  const day = Math.floor(d.asDays())
  const hour = d.hours()
  const minutes = d.minutes()
  const seconds = d.seconds()

  if (day) {
    return `${day}天${hour}时${minutes}分${seconds}秒`
  }
  if (hour) {
    return `${hour}时${minutes}分${seconds}秒`
  }
  if (minutes) {
    return `${minutes}分${seconds}秒`
  }
  if (seconds) {
    return `${seconds}秒`
  }

  return `--`
}

export function formatDurationEn(duration) {
  if (cBN(duration).isLessThanOrEqualTo(0)) {
    return '--'
  }
  const d = moment.duration(duration, 'seconds')
  const day = Math.floor(d.asDays())
  const hour = d.hours()
  const minutes = d.minutes()
  // const seconds = d.seconds()

  if (day) {
    return `${day} Days, ${hour}h, ${minutes}m`
  }
  if (hour) {
    return `${hour}h, ${minutes}m`
  }
  if (minutes) {
    return `${minutes}m`
  }

  return `--`
}

// returns true or false
// Todo:: remove web3 dependency
export function isAddress(value, web3) {
  return true
  if (!web3) return false
  return web3.utils.isAddress(value)
}

export const basicCheck = (web3, currentAccount) => {
  if (!web3) {
    message.error('Web3 not detected')
    return false
  }
  if (!currentAccount) {
    message.error('Not connected to a valid account')
    return false
  }
  return true
}

export const getConvexInfo = tokenName => {
  const apyInfoFromlocalStorage = localStorage.getItem('app.settings.apy')

  let data = converWebsiteInfo
  try {
    if (apyInfoFromlocalStorage) {
      if (JSON.parse(apyInfoFromlocalStorage).find(i => i.name === 'CRV')) {
        data = JSON.parse(apyInfoFromlocalStorage)
      }
    }
    const info =
      data.find(item => item.name === tokenName.toLocaleLowerCase() || item.name === tokenName) ||
      converWebsiteInfo.find(item => item.name === tokenName)

    if (cBN(parseFloat(info.apy.current)).isNaN()) {
      return converWebsiteInfo.find(item => item.name === tokenName.toLocaleLowerCase())
    }
    return info
  } catch (error) {
    // console.log(error)
    return null
  }
}

export const checkWalletConnect = (currentAccount, connectWallet, currentChainId) => {
  if (!currentAccount) {
    connectWallet()
    return false
  }
  return true
}

export default {
  cBN,
  formatBalance,
  getTokenPrice,
  isAddress,
  formatAddress,
  AddressZero,
  formatDuration,
  formatDurationEn,
  basicCheck,
  numberToString,
}
