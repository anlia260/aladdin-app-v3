import config from './index'

// To reduce the invoke of the calulation of lp price, cache and update the price regularlly.
// Update process:
//   Set enableCachedLpPrice = false in config
//   Run the app and check the data in the console
//   Update the data to cachedLpPriceMapping
const cachedLpPriceMapping = {
  [config.tokens.eCRV]: 3292.42871064964814066285,
  [config.tokens.crvRenWBTC]: 42745.93416091185630521713,
  [config.tokens.threeCRV]: 1.018296,
  [config.tokens.slpETHWBTC]: 53497664497.2202,
}

export default cachedLpPriceMapping
