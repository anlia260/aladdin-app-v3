import config from 'config'
import axios from 'axios'

export const doGetPrice = async (currentChainId, web3 = null) => {
  let gasPriceInfo = {}
  try {
    if (currentChainId !== config.CHAIN_ID) {
      throw new Error('Wrong Chain Id')
    }
    const result = await axios.get('https://gasprice.poa.network')
    gasPriceInfo = {
      low: result.data.slow,
      standard: result.data.standard,
      fast: result.data.fast,
      instant: result.data.instant,
    }
  } catch (err) {
    try {
      if (currentChainId === config.CHAIN_ID) {
        throw new Error('Wrong Chain Id')
      }
      const result = await axios.get('https://fees.upvest.co/estimate_eth_fees')
      gasPriceInfo = {
        low: result.data.estimates.slow,
        standard: result.data.estimates.medium,
        fast: result.data.estimates.fast,
        instant: result.data.estimates.fastest,
      }
    } catch (errSub) {
      try {
        if (!web3 || !web3.eth) {
          throw Error('No Web3 Detected')
        }
        const web3GasPriceRaw = await web3.eth.getGasPrice()
        const web3GasPrice = web3.utils.fromWei(web3GasPriceRaw, 'gwei')

        gasPriceInfo = {
          low: Number(web3GasPrice) - 2,
          standard: Number(web3GasPrice),
          fast: Number(web3GasPrice) + 2,
          instant: Number(web3GasPrice) + 4,
        }
      } catch (errSubWeb3) {
        gasPriceInfo = {
          low: 0,
          standard: 0,
          fast: 0,
          instant: 0,
        }
      }
    }
  }
  return gasPriceInfo
}
export default {
  doGetPrice,
}
